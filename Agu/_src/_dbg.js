const fs = require('fs'), vm = require('vm'), path = require('path');
const echarts = require(path.join(__dirname, '..', 'echarts.min.js'));
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const b = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
const all = b[0] + "\n" + b[b.length - 1];
function makeEl() {
  const fn = function () {}; fn._ds = {}; fn._v = {};
  return new Proxy(fn, {
    get(o, p) {
      if (p === 'value') return o._v._val !== undefined ? o._v._val : '';
      if (p === 'dataset') return o._ds;
      if (p === 'classList') return { toggle() {}, add() {}, remove() {}, contains() { return false; } };
      if (p === 'style') return o._st || (o._st = {});
      if (p === 'checked') return true;
      if (p === 'textContent' || p === 'innerHTML') return o['_' + p] || '';
      if (p === 'querySelectorAll') return () => [];
      if (p === 'querySelector') return () => makeEl();
      if (p === 'clientWidth') return 1180;
      if (p === 'clientHeight') return 430;
      if (p === '_c') return o._chart || null;
      if (p === '_pending') return o._pend || null;
      if (['appendChild','removeChild','setAttribute','getAttribute','addEventListener','focus','click','remove','resize','dispose','on'].includes(p)) return () => {};
      return makeEl();
    },
    set(o, p, v) { if (p === 'value') o._v._val = v; else if (p === '_c') o._chart = v; else if (p === '_pending') o._pend = v; else o['_' + p] = v; return true; },
    apply() { return makeEl(); }
  });
}
const ELS = {};
let lastOpt = null;
const stub = () => ({ setOption(o) { lastOpt = o; this._o = o; }, clear() {}, dispose() {}, resize() {}, getDataURL() { return ''; }, on() {}, getOption() { return this._o; } });
const sb = {
  Math, JSON, Date, parseFloat, parseInt, isFinite, isNaN, setTimeout, console, Promise,
  Object, Array, String, Number, Boolean, RegExp, Error,
  Blob: function () {}, URL: { createObjectURL: () => 'b:', revokeObjectURL() {} },
  alert: () => {}, confirm: () => false,
  echarts: { init: () => stub() },
  document: { getElementById: id => (ELS[id] || (ELS[id] = makeEl())), querySelectorAll: () => [], createElement: () => makeEl(), body: makeEl(), addEventListener() {}, readyState: 'complete' },
  localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
  location: { reload() {} }, navigator: {}
};
sb.window = sb; sb.window.addEventListener = () => {};
vm.createContext(sb);
vm.runInContext(all, sb);
const G = e => { try { return vm.runInContext(e, sb); } catch (err) { return 'THROW:' + err.message; } };

console.log('before:', typeof lastOpt);
console.log('call:', G('renderIdxChart()'));
console.log('after:', typeof lastOpt, lastOpt ? Object.keys(lastOpt).join(',') : '-');
console.log('pending:', typeof (ELS['idxChart'] || {})._pending);
console.log('geom:', JSON.stringify(G('(function(){var e=$("idxChart");return [e.clientWidth,e.clientHeight,typeof e._c];})()')));

if (lastOpt) {
  const opt = JSON.parse(JSON.stringify(lastOpt, (k, v) => (typeof v === 'function' ? undefined : v)));
  try {
    const c = echarts.init(null, null, { renderer: 'svg', ssr: true, width: 1180, height: 430 });
    c.setOption(opt);
    const svg = c.renderToSVGString();
    fs.writeFileSync(path.join(__dirname, '..', '_idx_preview.svg'), svg);
    const g = opt.grid, plotH = g.height, top = g.top, bot = g.top + g.height;
    let best = 0;
    [...svg.matchAll(/<path[^>]*d="M([^"]+)"/g)].map(m => m[1]).forEach(d => {
      const ys = [...d.matchAll(/[ML]\s*([\d.]+)\s+([\d.]+)/g)].map(m => parseFloat(m[2]));
      if (ys.length < 5) return;
      const lo = Math.min(...ys), hi = Math.max(...ys);
      if (lo >= top - 2 && hi <= bot + 2) best = Math.max(best, (hi - lo) / plotH);
    });
    console.log('plot高=', plotH, ' 折线纵向占用=', (best * 100).toFixed(0) + '%',
      ' Y轴=', opt.yAxis.min.toFixed(1), '~', opt.yAxis.max.toFixed(1),
      ' 点数=', opt.series[0].data.length, ' series=', opt.series.length);
    console.log('SVG', Math.round(svg.length / 1024), 'KB');
  } catch (e) { console.log('SSR ERR:', e.message.slice(0, 200)); }
}

if (lastOpt && lastOpt.yAxis) {
  const ymin = lastOpt.yAxis.min, ymax = lastOpt.yAxis.max;
  let lo = 1e9, hi = -1e9;
  (lastOpt.series || []).forEach(s => (s.data || []).forEach(v => {
    if (v == null) return; if (v < lo) lo = v; if (v > hi) hi = v;
  }));
  const plotH = 430 - lastOpt.grid.top - lastOpt.grid.bottom;
  console.log('数据范围', lo.toFixed(1), '~', hi.toFixed(1), '| Y轴', ymin.toFixed(1), '~', ymax.toFixed(1));
  console.log('绘图区', plotH, 'px  折线纵向占用', (((hi - lo) / (ymax - ymin)) * 100).toFixed(0) + '%  ≈',
    Math.round((hi - lo) / (ymax - ymin) * plotH) + 'px');
}
