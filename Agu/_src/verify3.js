const fs = require('fs'), vm = require('vm');
const html = fs.readFileSync('index.html', 'utf8');
const blocks = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
const all = blocks[0] + "\n" + blocks[blocks.length - 1];

function makeEl(id) {
  const fn = function () {}; fn._ds = {}; fn._v = {}; fn._id = id;
  return new Proxy(fn, {
    get(o, p) {
      if (p === 'value') return o._v._val !== undefined ? o._v._val : '';
      if (p === 'dataset') return o._ds;
      if (p === 'classList') return { toggle() {}, add() {}, remove() {}, contains() { return false; } };
      if (p === 'style') return {};
      if (p === 'checked') return o._v._ck !== undefined ? o._v._ck : true;
      if (p === 'textContent' || p === 'innerHTML') return o['_' + p] || '';
      if (p === 'querySelectorAll') return () => [];
      if (p === 'querySelector') return () => makeEl('q');
      if (['appendChild','removeChild','setAttribute','addEventListener','focus','click','remove','resize','dispose','on'].includes(p)) return () => {};
      if (p === 'getAttribute') return () => null;
      if (p === '_c') return o._chart;
      return makeEl('x');
    },
    set(o, p, v) {
      if (p === 'value') o._v._val = v;
      else if (p === 'checked') o._v._ck = v;
      else if (p === '_c') o._chart = v;
      else o['_' + p] = v;
      return true;
    },
    apply() { return makeEl('f'); }
  });
}
const ELS = {};
const getEl = id => (ELS[id] || (ELS[id] = makeEl(id)));
const store = {};
let lastOpt = null;
const chartStub = () => ({
  setOption(o) { lastOpt = o; this._o = o; },
  dispose() {}, resize() {}, getDataURL() { return "data:image/png;base64,"; },
  on(ev, fn) { this['_on_' + ev] = fn; }, getOption() { return this._o; }
});
const sandbox = {
  Math, JSON, Date, parseFloat, parseInt, isFinite, isNaN, setTimeout, console,
  Promise, Object, Array, String, Number, Boolean, RegExp, Error,
  Blob: function () {}, URL: { createObjectURL: () => "blob:", revokeObjectURL() {} },
  FileReader: function () {}, requestAnimationFrame: f => f(),
  alert: m => console.log('[alert]', String(m).slice(0, 90)), confirm: () => false,
  echarts: { init: () => chartStub(), version: '5' },
  document: { getElementById: getEl, querySelectorAll: () => [], createElement: () => makeEl('n'), body: makeEl('b'), addEventListener() {}, readyState: 'complete' },
  localStorage: { getItem: k => store[k] || null, setItem: (k, v) => store[k] = v, removeItem: k => delete store[k] },
  location: { reload() {} }, navigator: { userAgent: 'node' }
};
sandbox.window = sandbox; sandbox.window.addEventListener = () => {};
vm.createContext(sandbox);
try { vm.runInContext(all, sandbox, { filename: 'app.js' }); }
catch (e) { console.log('LOAD_ERROR:', e.message); console.log(e.stack.split('\n').slice(0, 4).join('\n')); process.exit(1); }
console.log('LOAD_OK');
const G = e => vm.runInContext(e, sandbox);
const state = G('state');

/* ---------- 1. AI 个股研判 ---------- */
console.log('\n===== AI 个股研判（抽样 4 只） =====');
let aiBad = 0;
['000063', '000933', '159558', '159577'].forEach(code => {
  try {
    const an = G('getAn("' + code + '")');
    const r = G('aiStock(getAn("' + code + '"))');
    if (!r || typeof r.resPct !== 'number') { console.log(code, 'AI_FAIL'); aiBad++; return; }
    console.log('---', code, '---');
    console.log('  ', r.icon, r.title, '| 共振', r.resPct + '%', '| 评分', r.score);
    console.log('   多头依据', r.bulls.length, '条 / 空头依据', r.bears.length, '条 / 风险', r.risks.length, '条 / 关键位', r.levels.length, '项 / 观察', r.watch.length, '条');
    console.log('   风险样例:', r.risks[0].replace(/<[^>]+>/g, '').slice(0, 62));
    console.log('   关键位:', r.levels.map(l => l.nm + '=' + l.vv).join(' | ').slice(0, 110));
  } catch (e) { console.log(code, 'ERR', e.message); aiBad++; }
});
console.log('AI个股:', aiBad === 0 ? 'PASS' : 'FAIL(' + aiBad + ')');

/* ---------- 2. AI 大盘 / 组合 ---------- */
console.log('\n===== AI 大盘 & 组合 =====');
try {
  const m = G('aiMarket()');
  console.log('大盘:', m.icon, m.title);
  console.log('  解读', m.items.length, '条 / 风险', m.risks.length, '条');
  m.items.slice(0, 3).forEach(x => console.log('   ·', x.replace(/<[^>]+>/g, '').slice(0, 78)));
  console.log('  风险样例:', m.risks[0].replace(/<[^>]+>/g, '').slice(0, 70));
} catch (e) { console.log('aiMarket ERR', e.message); }
try {
  const list = G('state.holdings.filter(h=>h.inReport!==false).map(h=>({h:h,an:getAn(h.code)}))');
  const p = G('aiPortfolio(state.holdings.filter(h=>h.inReport!==false))');
  console.log('组合:', p.icon, p.title, '| 均分', p.mean.toFixed(1), '| 多头', p.upN, '空头', p.dnN, '周线多头', p.wkUp);
  p.items.forEach(x => console.log('   ·', x.replace(/<[^>]+>/g, '').slice(0, 78)));
  p.risks.forEach(x => console.log('   !', x.replace(/<[^>]+>/g, '').slice(0, 78)));
} catch (e) { console.log('aiPortfolio ERR', e.message); }

/* ---------- 3. K线量程 ---------- */
console.log('\n===== K线量程（视野 30/60/120/全部） =====');
let rgBad = 0;
['000063', '000933', '159558'].forEach(code => {
  G('CUR.code="' + code + '";CUR.an=getAn("' + code + '");CUR.period="daily";');
  [30, 60, 120, 0].forEach(span => {
    G('CUR.span=' + span + ';');
    try {
      G('drawKline()');
      const o = lastOpt;
      if (!o) { console.log(code, span, 'NO_OPTION'); rgBad++; return; }
      const y = o.yAxis[0];
      const an = G('getAn("' + code + '")');
      const n = an.dates.length;
      const s = span > 0 ? Math.max(0, n - span) : 0;
      let lo = Infinity, hi = -Infinity;
      for (let k = s; k < n; k++) {
        if (an.highs[k] > hi) hi = an.highs[k];
        if (an.lows[k] < lo) lo = an.lows[k];
      }
      const inside = y.min < lo && y.max > hi;
      const ratio = (hi - lo) / (y.max - y.min);
      const ok = inside && ratio > 0.55 && ratio < 1.0;
      if (!ok) rgBad++;
      console.log('  ' + code + ' span=' + String(span).padStart(3),
        'y范围 [' + y.min + ', ' + y.max + ']',
        '数据范围 [' + lo.toFixed(2) + ', ' + hi.toFixed(2) + ']',
        '占比 ' + (ratio * 100).toFixed(0) + '%', ok ? 'OK' : 'BAD');
    } catch (e) { console.log(code, span, 'ERR', e.message); rgBad++; }
  });
});
console.log('K线量程:', rgBad === 0 ? 'PASS' : 'FAIL(' + rgBad + ')');

/* ---------- 4. 图表元素完整性 ---------- */
console.log('\n===== 图表元素 =====');
G('CUR.span=60;CUR.code="000933";CUR.an=getAn("000933");drawKline();');
const o = lastOpt;
console.log('series 数量:', o.series.length);
console.log('含 candlestick:', o.series.some(s => s.type === 'candlestick'));
console.log('markPoint 点数:', (o.series[0].markPoint && o.series[0].markPoint.data || []).length);
console.log('markArea 有:', !!(o.series[0].markArea && o.series[0].markArea.data));
console.log('markLine 有:', !!(o.series[0].markLine));
console.log('grid 配置:', JSON.stringify(o.grid));
console.log('dataZoom start:', o.dataZoom[0].start.toFixed(1));

/* ---------- 5. 报告含 AI 段 ---------- */
console.log('\n===== 报告集成 =====');
try {
  const rep = G('genReport()');
  console.log('报告长度:', rep.length);
  console.log('含 AI 技术研判:', rep.includes('AI 技术研判'));
  console.log('含 多周期共振度:', rep.includes('多周期共振度'));
  console.log('含 风险提示:', rep.includes('风险提示'));
} catch (e) { console.log('genReport ERR', e.message); }
