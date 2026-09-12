/* 用 ECharts SSR 真实渲染 K 线为 SVG，测量蜡烛实际像素尺寸 */
const fs = require('fs'), vm = require('vm'), path = require('path');
const echarts = require(path.join(__dirname, '..', 'echarts.min.js'));
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const blocks = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
const all = blocks[0] + "\n" + blocks[blocks.length - 1];

/* 复用 verify4 的 DOM stub */
function makeEl(id) {
  const fn = function () {}; fn._ds = {}; fn._v = {}; fn._id = id;
  return new Proxy(fn, {
    get(o, p) {
      if (p === 'value') return o._v._val !== undefined ? o._v._val : '';
      if (p === 'dataset') return o._ds;
      if (p === 'classList') return { toggle() {}, add() {}, remove() {}, contains() { return false; } };
      if (p === 'style') return {};
      if (p === 'checked') return true;
      if (p === 'textContent' || p === 'innerHTML') return o['_' + p] || '';
      if (p === 'querySelectorAll') return () => [];
      if (p === 'querySelector') return () => makeEl('q');
      if (p === 'clientWidth') return 1180;
      if (p === 'clientHeight') return 700;
      if (p === 'closest') return () => null;
      if (['appendChild','removeChild','setAttribute','getAttribute','addEventListener','focus','click','remove','resize','dispose','on','requestFullscreen','select'].includes(p)) return () => {};
      if (p === '_c') return o._chart;
      return makeEl('x');
    },
    set(o, p, v) {
      if (p === 'value') o._v._val = v; else if (p === '_c') o._chart = v; else o['_' + p] = v;
      return true;
    },
    apply() { return makeEl('f'); }
  });
}
const ELS = {};
let lastOpt = null;
const chartStub = () => ({
  setOption(o) { lastOpt = o; this._o = o; }, clear() {}, dispose() {}, resize() {},
  getDataURL() { return ''; }, on() {}, getOption() { return this._o; }
});
const store = {};
const sandbox = {
  Math, JSON, Date, parseFloat, parseInt, isFinite, isNaN, setTimeout, console,
  Promise, Object, Array, String, Number, Boolean, RegExp, Error,
  Blob: function () {}, URL: { createObjectURL: () => "blob:", revokeObjectURL() {} },
  FileReader: function () {}, requestAnimationFrame: f => f(),
  alert: () => {}, confirm: () => false, prompt: () => null,
  echarts: { init: () => chartStub(), version: '5' },
  document: { getElementById: id => (ELS[id] || (ELS[id] = makeEl(id))), querySelectorAll: () => [],
    createElement: () => makeEl('n'), body: makeEl('b'), addEventListener() {},
    readyState: 'complete', fullscreenElement: null, execCommand: () => true, exitFullscreen() {} },
  localStorage: { getItem: k => store[k] || null, setItem: (k, v) => store[k] = v, removeItem: k => delete store[k] },
  location: { reload() {} }, navigator: { userAgent: 'node' }
};
sandbox.window = sandbox; sandbox.window.addEventListener = () => {};
vm.createContext(sandbox);
vm.runInContext(all, sandbox, { filename: 'app.js' });
const G = e => vm.runInContext(e, sandbox);

const WIDTH = 1180, HEIGHT = 700;

function renderCase(code, span, h) {
  G('CUR.code="' + code + '";CUR.an=getAn("' + code + '");CUR.period="daily";CUR.span=' + span + ';');
  G('KL.h=' + h + ';');
  G('drawKline()');
  const opt = JSON.parse(JSON.stringify(lastOpt, (k, v) => (typeof v === 'function' ? undefined : v)));
  const chart = echarts.init(null, null, { renderer: 'svg', ssr: true, width: WIDTH, height: h });
  chart.setOption(opt);
  const svg = chart.renderToSVGString();
  chart.dispose();

  /* 解析所有 path，统计蜡烛几何 */
  const paths = [...svg.matchAll(/<path[^>]*d="([^"]+)"[^>]*>/g)].map(m => m[1]);
  /* 蜡烛 path 形如 M x y L x y L x y ... （竖线+矩形），取所有 (x,y) 数值对 */
  let ys = [];
  paths.forEach(d => {
    const nums = d.match(/-?\d+(\.\d+)?/g);
    if (!nums) return;
    for (let i = 1; i < nums.length; i += 2) ys.push(parseFloat(nums[i]));
  });
  const g0 = opt.grid[0];
  const mainTop = g0.top, mainBot = g0.top + g0.height;
  const inMain = ys.filter(y => y >= mainTop - 1 && y <= mainBot + 1);
  const yMin = Math.min(...inMain), yMax = Math.max(...inMain);
  const used = yMax - yMin;
  const svgBytes = svg.length;
  return {
    code, span, h,
    mainH: g0.height,
    dataSpanPx: Math.round(used),
    fillPct: Math.round(used / g0.height * 100),
    bars: span > 0 ? span : G('getAn("' + code + '").dates.length'),
    barW: ((WIDTH - 136) / (span > 0 ? span : G('getAn("' + code + '").dates.length'))).toFixed(1),
    svg: svgBytes
  };
}

console.log('宽度固定 ' + WIDTH + 'px；主图高度 / 蜡烛实际占像素 / 占比 / 单根宽度');
console.log('标的     视野  图高  主图高  蜡烛占px  占比   单根宽');
const cases = [
  ['000933', 60, 700], ['000933', 20, 700], ['000933', 0, 700],
  ['000063', 60, 700], ['000063', 90, 700],
  ['159558', 60, 700], ['513050', 60, 700],
  ['000933', 60, 900], ['000063', 180, 900]
];
let minFill = 100;
cases.forEach(c => {
  const r = renderCase(c[0], c[1], c[2]);
  minFill = Math.min(minFill, r.fillPct);
  console.log('  ' + r.code + '  ' + String(r.span).padStart(4) + '  ' + String(r.h).padStart(4)
    + '  ' + String(r.mainH).padStart(5) + '  ' + String(r.dataSpanPx).padStart(7)
    + '  ' + String(r.fillPct).padStart(4) + '%  ' + String(r.barW).padStart(6) + 'px');
});
console.log('\n最小纵向占比 = ' + minFill + '%  ' + (minFill >= 60 ? '=> PASS（蜡烛撑满主图）' : '=> 偏低'));

/* 导出一张 SVG 供人工预览 */
G('CUR.code="000933";CUR.an=getAn("000933");CUR.period="daily";CUR.span=60;KL.h=700;drawKline();');
const opt = JSON.parse(JSON.stringify(lastOpt, (k, v) => (typeof v === 'function' ? undefined : v)));
const c2 = echarts.init(null, null, { renderer: 'svg', ssr: true, width: WIDTH, height: 700 });
c2.setOption(opt);
const svgOut = c2.renderToSVGString();
fs.writeFileSync(path.join(__dirname, '..', '_kline_preview.svg'), svgOut, 'utf8');
console.log('已导出 _kline_preview.svg  (' + Math.round(svgOut.length / 1024) + ' KB)');
