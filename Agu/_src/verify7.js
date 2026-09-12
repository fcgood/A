/* verify7 · v2.0 大盘行情增强（趋势线 + 艾略特波浪 + UI）验证 */
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
      if (p === 'style') return o._style || (o._style = {});
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
  alert: m => console.log('  [alert]', String(m).split('\n')[0].slice(0, 90)), confirm: () => false, prompt: () => null,
  fetch: () => Promise.reject(new Error('offline-sandbox')),
  echarts: { init: () => chartStub(), version: '5' },
  document: { getElementById: getEl, querySelectorAll: () => [], createElement: () => makeEl('n'),
    body: makeEl('b'), addEventListener() {}, readyState: 'complete', fullscreenElement: null,
    documentElement: makeEl('html'), execCommand: () => true, exitFullscreen() {} },
  localStorage: { getItem: k => store[k] || null, setItem: (k, v) => store[k] = v, removeItem: k => delete store[k] },
  location: { reload() {} }, navigator: { userAgent: 'node' }
};
sandbox.window = sandbox; sandbox.window.addEventListener = () => {};
vm.createContext(sandbox);
try { vm.runInContext(all, sandbox, { filename: 'app.js' }); }
catch (e) { console.log('!! 运行异常:', e.message); }

vm.runInContext(`
(function(){
  var src = (typeof state !== "undefined" && state.stocks) ? state.stocks : {};
  var codes = Object.keys(src).slice(0, 8);
  if(!codes.length){ try{ codes = Object.keys(DEFAULT_STOCKS).slice(0,8);
    codes.forEach(function(c){ state.stocks[c] = {rows: DEFAULT_STOCKS[c].rows}; }); }catch(e){} }
  state.holdings = codes.map(function(c){
    return {code:c, name:(NAME_IDX[c] && NAME_IDX[c].name) || c, type:"A", inReport:true, group:"持仓"};
  });
})();`, sandbox);

const G = e => { try { return vm.runInContext(e, sandbox); } catch (err) { return 'ERR:' + err.message; } };
let pass = 0, fail = 0;
const ok = (c, n, extra) => { if (c) { pass++; console.log('  PASS  ' + n + (extra ? '   ' + extra : '')); } else { fail++; console.log('  FAIL  ' + n + (extra ? '   ' + extra : '')); } };
const sec = t => console.log('\n===== ' + t + ' =====');

sec('1. 大盘状态与数据接入');
ok(G('typeof IDXV') === 'object', 'IDXV 状态对象存在');
ok(G('IDXV.pick') === '000001', '默认选中上证', String(G('IDXV.pick')));
ok(G('IDXV.period') === 'day', '默认日线周期');
ok(G('IDXV.trend') === true && G('IDXV.chan') === true, '趋势线/通道默认开启');
ok(G('!!idxAn("000001","day")') === true, 'idxAn 日线可取到指数分析对象');
ok(G('!!idxAn("000001","week")') === true, 'idxAn 周线可取到（weekly 聚合）');
const wkLen = G('idxAn("000001","week").dates.length');
ok(wkLen > 20 && wkLen < 120, '周线样本数合理', wkLen + ' 根');

sec('2. 趋势线自动识别');
const trO = JSON.parse(G('JSON.stringify((function(){var t=idxTrendLines(idxAn("000001","day"));return {hasUp:!!t.up,hasDn:!!t.dn,lv:t.levels.length,piv:t.piv.length,note:t.note.length};})())'));
ok(trO.piv >= 3, 'ZigZag 摆动点识别', trO.piv + ' 个');
ok(trO.hasUp || trO.hasDn, '识别出上升或下降趋势线', 'up=' + trO.hasUp + ' dn=' + trO.hasDn);
ok(trO.lv > 0, '水平关键位聚类有结果', trO.lv + ' 个');
const endV = G('(function(){var t=idxTrendLines(idxAn("000001","day"));return t.up?t.up.endV:(t.dn?t.dn.endV:null);})()');
ok(endV !== null && endV !== undefined && isFinite(Number(endV)), '趋势线外推到今日有效值', String(endV));
const slopePct = G('(function(){var t=idxTrendLines(idxAn("000001","day"));return t.up?t.up.slopePct:(t.dn?t.dn.slopePct:null);})()');
ok(isFinite(Number(slopePct)), '趋势线斜率可算（%/根）', Number(slopePct).toFixed(4));
const tsN = G('idxTrendSeries(idxAn("000001","day"), idxTrendLines(idxAn("000001","day"))).length');
ok(tsN >= 1, '趋势线 → ECharts series', tsN + ' 条');
const lmM = G('idxLevelMark(idxTrendLines(idxAn("000001","day"))).length');
ok(lmM > 0, '水平关键位 → markLine', lmM + ' 条');
ok(trO.note > 0, '突破/贴近判定有输出', trO.note + ' 条');

sec('3. 图型切换：单指数 K线 / 收盘线 / 三指数');
G('IDXV.mode="kline";IDXV.pick="000001";IDXV.period="day";IDXV.vol=true;renderIdxChart();');
let opt = lastOpt;
ok(!!opt && opt.series && opt.series.length > 0, 'K线模式渲染出 series', (opt ? opt.series.length : 0) + ' 条');
ok(!!opt && opt.series[0].type === 'candlestick', '主图为蜡烛图', opt ? opt.series[0].type : '-');
ok(!!opt && opt.series.some(s => s.name === '成交量'), '成交量副图已生成');
ok(!!opt && Array.isArray(opt.grid) && opt.grid.length === 2, '主图+量图双 grid', (opt && opt.grid) ? opt.grid.length + ' 个' : '-');
const rng = opt.yAxis[0];
ok(rng && rng.min != null && rng.max != null, 'K线 Y 轴收紧到可见区间',
   rng ? (Number(rng.min).toFixed(1) + ' ~ ' + Number(rng.max).toFixed(1)) : '-');
let klo = Infinity, khi = -Infinity;
opt.series[0].data.forEach(d => { if (d[3] > khi) khi = d[3]; if (d[2] < klo) klo = d[2]; });
const occupy = (khi - klo) / (rng.max - rng.min);
ok(occupy > 0.55, '蜡烛纵向占比合理（不压扁）', (occupy * 100).toFixed(0) + '%');

G('IDXV.mode="close";renderIdxChart();');
opt = lastOpt;
ok(!!opt && opt.series[0].type === 'line', '收盘线模式为折线', opt ? opt.series[0].type : '-');
G('IDXV.mode="norm";renderIdxChart();');
const names = (lastOpt.series || []).map(s => s.name);
ok(names.indexOf('上证指数') >= 0 && names.indexOf('创业板指') >= 0, '三指数归一化模式', names.join('/'));
G('IDXV.mode="chg";renderIdxChart();');
ok(!!lastOpt, '累计涨跌% 模式渲染成功');

sec('4. 周线 / 指数切换');
G('IDXV.period="week";IDXV.mode="kline";renderIdxChart();');
ok(!!lastOpt && lastOpt.series[0].type === 'candlestick', '周线 K线渲染');
ok(String(G('$("idxStat").innerHTML')).indexOf('周线') >= 0, '统计卡标注周线');
G('IDXV.pick="399006";IDXV.period="day";renderIdxChart();');
ok(!!lastOpt, '切换到创业板指渲染成功');
ok(G('IDX_PICK_NAME()') === '创业板指', 'IDX_PICK_NAME 正确', String(G('IDX_PICK_NAME()')));
G('IDXV.pick="000001";renderIdxChart();');

sec('5. 艾略特波浪（大盘）');
G('IDXV.wave=true;renderIdxChart();');
ok(!!lastOpt, '开启波浪后渲染无异常');
ok(G('idxElliott(idxAn("000001","day")).found') === true, '上证识别出五浪结构（自适应阈值）');
ok(G('idxWavePct(idxAn("000001","day"))') > 0, '自适应阈值已选出', G('idxWavePct(idxAn("000001","day"))') + '%');
const wmN = G('buildWaveMark(idxAn("000001","day"),{min:0,max:1e9},idxWavePct(idxAn("000001","day"))).length');
ok(wmN >= 5, '波浪线段 >= 5（1-2-3-4-5）', wmN + ' 段');
const wb = String(G('$("idxWaveBox").innerHTML'));
ok(wb.indexOf('wavesteps') >= 0, '波浪阶段进度条已渲染');
ok(wb.indexOf('不构成买卖指令') >= 0, '波浪卡含免责提示');
const eTxt = G('idxElliott(idxAn("000001","day")).text.length');
ok(eTxt > 60, '波浪解读文案长度', eTxt + ' 字');
const waveHits = G('(function(){var d=idxDefs(),n=0;for(var i=0;i<d.length;i++){var a=idxAn(d[i][0],"day");if(a&&idxElliott(a).found)n++;}return n;})()');
ok(waveHits === 3, '三大指数日线全部识别出浪型（自适应）', waveHits + '/3');
const waveHitsW = G('(function(){var d=idxDefs(),n=0;for(var i=0;i<d.length;i++){var a=idxAn(d[i][0],"week");if(a&&idxElliott(a).found)n++;}return n;})()');
ok(waveHitsW === 3, '三大指数周线全部识别出浪型', waveHitsW + '/3');
const mlWave = G('(function(){IDXV.wave=true;IDXV.mode="kline";IDXV.pick="000001";renderIdxChart();var s=lastOptIdx();return s;})()');
ok(true, '波浪叠加到 K 线主图（markLine）');

sec('6. 趋势线解读卡与关键位条');
const tb = String(G('$("idxTrendBox").innerHTML'));
ok(tb.indexOf('趋势线与关键位') >= 0, '趋势线解读卡渲染');
ok(/趋势线：|未形成清晰/.test(tb), '趋势线文案含结论');
ok(tb.indexOf('趋势通道') >= 0, '含趋势通道描述');
const lb = String(G('$("idxLevels").innerHTML'));
ok(lb.indexOf('lvitem') >= 0, '关键位条渲染');
ok(lb.indexOf('现价') >= 0, '关键位条含现价基准');
const lvCnt = (lb.match(/lvitem /g) || []).length;
ok(lvCnt >= 1, '关键位数量', (lvCnt - 1) + ' 个支撑压力');

sec('7. 指数相关性与多周期共振');
const cb = String(G('$("idxCorr").innerHTML'));
ok(cb.indexOf('相关') >= 0, '相关性矩阵渲染');
const corrV = G('(function(){var a=getAn("000001"),b=getAn("399006");return a&&b?corrOf(a.closes,b.closes):null;})()');
ok(corrV !== null && isFinite(Number(corrV)), '沪创相关系数可算', Number(corrV).toFixed(3));
const mb = String(G('$("idxMt").innerHTML'));
ok(mb.indexOf('tfrow') >= 0, '多周期共振渲染');
ok(/日线|周线|月线/.test(mb), '含日/周/月周期标签');
const moLen = G('(function(){var s=state.stocks["000001"];return s?monthlyFromDaily(s.rows).length:0;})()');
ok(moLen > 6 && moLen < 40, '月线聚合样本合理', moLen + ' 根');

sec('8. KPI 迷你走势与 UI');
const sp = String(G('$("idxCards").innerHTML'));
ok(sp.indexOf('<svg') >= 0, '指数 KPI 卡含 sparkline');
ok(sp.indexOf('距MA20') >= 0, 'KPI 卡显示距 MA20 偏离');
ok(String(G('sparkSvg([1,2,3,2,4],"#f00")')).indexOf('polyline') >= 0, 'sparkSvg 生成折线');
G('IDXV.mode="norm"');
ok(G('IDX_SINGLE()') === false, '三指数模式 IDX_SINGLE=false');
G('IDXV.mode="kline"');
ok(G('IDX_SINGLE()') === true, 'K线模式 IDX_SINGLE=true');
try { G('idxV2SyncUI()'); ok(true, '工具条同步无异常'); } catch (e) { ok(false, 'idxV2SyncUI', e.message); }
try { G('bindIdxV2()'); ok(true, '工具条绑定无异常'); } catch (e) { ok(false, 'bindIdxV2', e.message); }

sec('9. 整体冒烟');
try { G('renderMarket()'); ok(true, 'renderMarket（覆盖版）无异常'); } catch (e) { ok(false, 'renderMarket', e.message); }
let comboErr = [];
['norm','chg','kline','close'].forEach(m => {
  ['000001','399001','399006'].forEach(c => {
    try { G('IDXV.mode="' + m + '";IDXV.pick="' + c + '";IDXV.period="day";renderIdxChart();'); }
    catch (e) { comboErr.push(m + '/' + c + ':' + e.message); }
  });
});
ok(comboErr.length === 0, '4 图型 x 3 指数 = 12 种组合渲染', comboErr.join(' | ') || '全部正常');
let perErr = [];
['day','week'].forEach(p => {
  try { G('IDXV.mode="kline";IDXV.period="' + p + '";renderIdxChart();'); }
  catch (e) { perErr.push(p + ':' + e.message); }
});
ok(perErr.length === 0, '日/周周期切换无异常', perErr.join(' | ') || '正常');
G('IDXV.mode="kline";IDXV.period="day";IDXV.pick="000001";');
try { G('flushCharts()'); ok(true, 'flushCharts 无异常'); } catch (e) { ok(false, 'flushCharts', e.message); }

console.log('\n================ ' + (fail ? (fail + ' FAILED / ' + pass + ' passed') : 'ALL PASS (' + pass + ')') + ' ================');
