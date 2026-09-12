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
      if (p === 'clientWidth') return 1180;
      if (p === 'clientHeight') return 700;
      if (p === 'closest') return () => null;
      if (['appendChild','removeChild','setAttribute','getAttribute','addEventListener','focus','click','remove','resize','dispose','on','requestFullscreen','select'].includes(p)) return () => {};
      if (p === '_c') return o._chart;
      if (p === 'files') return [];
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
  clear() {}, dispose() {}, resize() {}, getDataURL() { return "data:image/png;base64,"; },
  on(ev, fn) { this['_on_' + ev] = fn; }, getOption() { return this._o; }
});
const sandbox = {
  Math, JSON, Date, parseFloat, parseInt, isFinite, isNaN, setTimeout, console,
  Promise, Object, Array, String, Number, Boolean, RegExp, Error,
  Blob: function () {}, URL: { createObjectURL: () => "blob:", revokeObjectURL() {} },
  FileReader: function () {}, requestAnimationFrame: f => f(),
  alert: m => console.log('[alert]', String(m).slice(0, 80)), confirm: () => false, prompt: () => null,
  echarts: { init: () => chartStub(), version: '5' },
  document: { getElementById: getEl, querySelectorAll: () => [], createElement: () => makeEl('n'),
    body: makeEl('b'), addEventListener() {}, readyState: 'complete', fullscreenElement: null,
    execCommand: () => true, exitFullscreen() {} },
  localStorage: { getItem: k => store[k] || null, setItem: (k, v) => store[k] = v, removeItem: k => delete store[k] },
  location: { reload() {} }, navigator: { userAgent: 'node' }
};
sandbox.window = sandbox; sandbox.window.addEventListener = () => {};
vm.createContext(sandbox);
try { vm.runInContext(all, sandbox, { filename: 'app.js' }); }
catch (e) { console.log('LOAD_ERROR:', e.message); console.log(e.stack.split('\n').slice(0, 6).join('\n')); process.exit(1); }
console.log('LOAD_OK  (含 engine5/6 覆盖)');

/* ---- 模拟用户添加持仓（v2 起内置持仓为空） ---- */
vm.runInContext(`
(function(){
  var src = (typeof state !== "undefined" && state.stocks) ? state.stocks : {};
  var codes = Object.keys(src).slice(0, 10);
  ["000063","159558","300014","000933"].forEach(function(c){ if(src[c] && codes.indexOf(c) < 0) codes.unshift(c); });
  if(!codes.length){ try{ codes = Object.keys(DEFAULT_STOCKS).slice(0,10);
    codes.forEach(function(c){ state.stocks[c] = {rows: DEFAULT_STOCKS[c].rows}; }); }catch(e){} }
  state.holdings = codes.map(function(c){
    return {code:c, name:(NAME_IDX[c] && NAME_IDX[c].name) || c, type:"A", inReport:true, group:"持仓"};
  });
  if(typeof renderHoldings === "function") renderHoldings();
  if(typeof renderRail === "function") renderRail();
})();`, sandbox);

const G = e => vm.runInContext(e, sandbox);
const state = G('state');
let FAIL = 0;
const chk = (name, ok, extra) => { console.log((ok ? '  PASS  ' : '  FAIL  ') + name + (extra ? '   ' + extra : '')); if (!ok) FAIL++; };

/* ============ 1. K线量程 ============ */
console.log('\n===== 1. K线量程（视野 20/40/60/90/180/全部） =====');
['000063', '000933', '159558', '513050'].forEach(code => {
  [20, 40, 60, 90, 180, 0].forEach(span => {
    G('CUR.code="' + code + '";CUR.an=getAn("' + code + '");CUR.period="daily";CUR.span=' + span + ';');
    try {
      G('drawKline()');
      const o = lastOpt;
      const y = o.yAxis[0];
      const an = G('getAn("' + code + '")');
      const n = an.dates.length;
      const s = span > 0 ? Math.max(0, n - span) : 0;
      let lo = Infinity, hi = -Infinity;
      for (let k = s; k < n; k++) { if (an.highs[k] > hi) hi = an.highs[k]; if (an.lows[k] < lo) lo = an.lows[k]; }
      const inside = y.min < lo && y.max > hi;
      const ratio = (hi - lo) / (y.max - y.min) * 100;
      const ok = inside && ratio > 60 && ratio < 100;
      if (span === 60 || span === 0)
        console.log('  ' + code + ' span=' + String(span).padStart(3) + '  y[' + y.min + ',' + y.max + ']  数据[' +
          lo.toFixed(2) + ',' + hi.toFixed(2) + ']  占比 ' + ratio.toFixed(0) + '%  ' + (ok ? 'OK' : 'BAD'));
      if (!ok) FAIL++;
    } catch (e) { console.log(code, span, 'ERR', e.message); FAIL++; }
  });
});
console.log('  （其余组合未打印，失败会计入 FAIL=' + FAIL + '）');

/* ============ 2. K线几何 ============ */
console.log('\n===== 2. K线几何布局（像素） =====');
G('CUR.span=60;CUR.code="000933";CUR.an=getAn("000933");drawKline();');
let o = lastOpt;
console.log('  grid:', JSON.stringify(o.grid));
const g0 = o.grid[0], g1 = o.grid[1], g2 = o.grid[2];
chk('主图在量图之上', g0.top + g0.height <= g1.top);
chk('量图在副图之上', g1.top + g1.height <= g2.top);
chk('主图高度 >= 380px', g0.height >= 380, g0.height + 'px');
chk('副图不超出容器(700)', g2.top + g2.height <= 700 - 20, (g2.top + g2.height) + '');
chk('含 candlestick', o.series.some(s => s.type === 'candlestick'));
const cs = o.series.find(s => s.type === 'candlestick');
chk('蜡烛 barMaxWidth 已设', cs.barMaxWidth === 26);
chk('最新价标签存在', !!(cs.markPoint && cs.markPoint.data && cs.markPoint.data.length));

/* ============ 3. AI 深度 ============ */
console.log('\n===== 3. AI 深度研判 =====');
['000063', '000933', '159558', '513050', '159577'].forEach(code => {
  try {
    const an = G('getAn("' + code + '")');
    const dp = G('aiStockDeep(getAn("' + code + '"))');
    const ok = dp && typeof dp.resPct === 'number' && dp.dims.length === 5
      && dp.scen.length === 3 && dp.plan.length >= 3 && dp.verdict;
    if (code === '000933' || code === '159558') {
      console.log('  --- ' + code + ' 共振 ' + dp.resPct + '% ---');
      dp.dims.forEach(d => console.log('     ' + (d.ok ? '[多]' : d.bad ? '[空]' : '[中]') + ' ' + d.nm + ' w=' + d.w + '  ' + String(d.ev).replace(/<[^>]+>/g, '').slice(0, 62)));
      dp.scen.forEach(s => console.log('     ' + s.nm + ' ' + s.p + '  ' + s.move + '  | ' + s.cond.slice(0, 46)));
      dp.plan.forEach(p => console.log('     · ' + p.k + ': ' + String(p.v).replace(/<[^>]+>/g, '').slice(0, 58)));
      console.log('     历史统计: ' + (dp.hist.ok ? ('样本' + dp.hist.sample + ' 例 ' + dp.hist.rows.map(r => r.f + '日 ' + (r.avg == null ? '—' : r.avg.toFixed(2) + '%') ).join(' / ')) : dp.hist.msg));
    }
    chk('aiStockDeep ' + code, !!ok);
  } catch (e) { chk('aiStockDeep ' + code, false, e.message); }
});

/* ============ 4. 大盘/组合深度 ============ */
console.log('\n===== 4. 大盘五维 & 组合结构 =====');
try {
  const dm = G('aiMarketDeep()');
  console.log('  大盘综合 ' + dm.total + '/100  ' + dm.icon + ' ' + dm.title);
  dm.dims.forEach(d => console.log('     ' + d.nm + ' ' + (d.miss ? '缺失' : d.s) + '  ' + String(d.ev).replace(/<[^>]+>/g, '').slice(0, 60)));
  console.log('  仓位建议: ' + dm.pos + '  (' + dm.posR + ')');
  console.log('  明日观察 ' + dm.tomorrow.length + ' 条，例: ' + String(dm.tomorrow[0]).replace(/<[^>]+>/g, '').slice(0, 56));
  chk('aiMarketDeep 五维', dm.dims.length === 5 && typeof dm.total === 'number');
  chk('明日观察 >=3 条', dm.tomorrow.length >= 3);
} catch (e) { chk('aiMarketDeep', false, e.message); }
try {
  const pd = G('aiPortfolioDeep(state.holdings.filter(h=>h.inReport!==false))');
  console.log('  组合 n=' + pd.n + ' 平均相关 ' + (pd.avgCor != null ? pd.avgCor.toFixed(2) : '—')
    + ' 最高相关对 ' + (pd.maxPair || '—') + ' (' + (pd.maxCor != null ? pd.maxCor.toFixed(2) : '—') + ')');
  console.log('  同向暴露 ' + pd.sameDir.toFixed(0) + '%  平均ATR波动 ' + (pd.avgVolPct != null ? pd.avgVolPct.toFixed(2) + '%' : '—'));
  pd.rebal.forEach(x => console.log('     · ' + String(x).replace(/<[^>]+>/g, '').slice(0, 74)));
  chk('aiPortfolioDeep', pd.n > 1 && pd.rebal.length >= 2);
} catch (e) { chk('aiPortfolioDeep', false, e.message); }

/* ============ 5. 批量解析 ============ */
console.log('\n===== 5. 批量添加解析 =====');
const cases = [
  ['600519 贵州茅台\n000858,五粮液\n159509 纳指科技ETF', 3],
  ['000063\n中兴通讯\nzxtx\n159558', 2],
  ['sz000001,上证指数\nsh600519 贵州茅台\n  601318 中国平安  ', 3],
  ['中信证券, 600030', 1]
];
cases.forEach(c => {
  const r = G('parseBatch(' + JSON.stringify(c[0]) + ')');
  console.log('  输入 ' + JSON.stringify(c[0].replace(/\n/g, '\\n')));
  console.log('    => ' + r.map(x => x.code + '/' + x.name + '/' + x.type).join('  '));
  chk('parseBatch 数量=' + c[1], r.length === c[1], r.length + '');
});

/* ============ 6. 报告富文本 ============ */
console.log('\n===== 6. 报告渲染 =====');
try {
  const md = G('genReport()');
  console.log('  报告长度 ' + md.length + ' 字符');
  const htmlOut = G('renderReportRich(LAST_REPORT)');
  console.log('  富文本长度 ' + htmlOut.length);
  chk('含目录 TOC', htmlOut.includes('r-toc'));
  chk('含 r-h2 标题', htmlOut.includes('class="r-h2"'));
  chk('含表格', htmlOut.includes('<table>'));
  chk('含情景推演表', htmlOut.includes('情景推演'));
  chk('含操作纪律', htmlOut.includes('操作纪律'));
  chk('含历史相似状态统计', htmlOut.includes('历史相似状态统计'));
  chk('含大盘五维打分', htmlOut.includes('大盘五维打分'));
  chk('含组合结构深度', htmlOut.includes('组合结构深度'));
  chk('含免责声明', md.includes('免责声明'));
  chk('无未闭合 <b', (htmlOut.match(/<b>/g) || []).length === (htmlOut.match(/<\/b>/g) || []).length,
    (htmlOut.match(/<b>/g) || []).length + '/' + (htmlOut.match(/<\/b>/g) || []).length);
  chk('残留字面 <b> 标签为 0', !htmlOut.includes('&lt;b&gt;'));
} catch (e) { chk('genReport', false, e.message); }

/* ============ 7. 对比图 & 笔记 ============ */
console.log('\n===== 7. 对比图 / 笔记 =====');
try {
  G('CMP.sel=state.holdings.slice(0,4).map(h=>h.code);renderCompare();');
  const co = lastOpt;
  console.log('  对比 series ' + co.series.length + ' 条，x轴 ' + (co.xAxis.data || []).length + ' 点');
  chk('对比图 series >=2', co.series.length >= 2);
  chk('对比图归一化首值=0', co.series.every(s => Math.abs(s.data[0]) < 0.01));
} catch (e) { chk('renderCompare', false, e.message); }
try {
  G('saveNotes([{id:1,code:"000063",name:"中兴通讯",text:"跌破30.5减半仓",t:Date.now()}]);renderNotes();');
  const n = G('getNotes().length');
  chk('笔记存取', n === 1, n + ' 条');
} catch (e) { chk('笔记', false, e.message); }

/* ============ 8. 名称索引 ============ */
console.log('\n===== 8. 名称索引 =====');
[['000063', '000063'], ['中兴通讯', '000063'], ['zxtx', '000063'], ['600519', '600519'], ['茅台', '600519']].forEach(t => {
  const r = G('lookupName(' + JSON.stringify(t[0]) + ')');
  const ok = r && r.code === t[1];
  console.log('  ' + t[0] + ' => ' + (r ? r.code + '/' + r.name : 'null'));
  chk('lookup ' + t[0], ok);
});

console.log('\n================ ' + (FAIL === 0 ? 'ALL PASS' : 'FAIL COUNT = ' + FAIL) + ' ================');
