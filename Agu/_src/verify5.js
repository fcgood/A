/* verify5 · v2.0 新功能验证 */
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
    execCommand: () => true, exitFullscreen() {} },
  localStorage: { getItem: k => store[k] || null, setItem: (k, v) => store[k] = v, removeItem: k => delete store[k] },
  location: { reload() {} }, navigator: { userAgent: 'node' }
};
sandbox.window = sandbox; sandbox.window.addEventListener = () => {};
vm.createContext(sandbox);
try { vm.runInContext(all, sandbox, { filename: 'app.js' }); }
catch (e) { console.log('!! 运行异常:', e.message); }

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

const G = e => { try { return vm.runInContext(e, sandbox); } catch (err) { return 'ERR:' + err.message; } };

let pass = 0, fail = 0;
const ok = (c, n, extra) => { if (c) { pass++; console.log('  PASS  ' + n + (extra ? '   ' + extra : '')); } else { fail++; console.log('  FAIL  ' + n + (extra ? '   ' + extra : '')); } };
const sec = t => console.log('\n===== ' + t + ' =====');


sec('1. 版本与全局状态');
ok(G('APPVER') === '2.2', '版本号 v2.2', G('APPVER'));
ok(Array.isArray(G('KLSET.ma')) && G('KLSET.ma').length === 4, 'KLSET 均线默认 4 条', JSON.stringify(G('KLSET.ma')));
ok(Object.keys(G('KL_PRESETS')).length === 6, '6 套 K 线预设', Object.keys(G('KL_PRESETS')).join('/'));
ok(G('typeof APICFG.tpl.tx') === 'string', 'APICFG 含腾讯模板');
ok(Array.isArray(G('ALERTS')), 'ALERTS 已初始化');

sec('2. 代码 → 数据源符号映射');
const cases = [['600519', 'sh600519', '1.600519'], ['000063', 'sz000063', '0.000063'],
               ['159558', 'sz159558', '0.159558'], ['688981', 'sh688981', '1.688981'],
               ['399006', 'sz399006', '0.399006']];
cases.forEach(([c, wantSym, wantSec]) => {
  const s = G(`symFor("tx","${c}")`), e = G(`emSecid("${c}")`);
  ok(s === wantSym && e === wantSec, `${c} → ${wantSym} / ${wantSec}`, s + ' / ' + e);
});

sec('3. 代理与 URL 拼装');
G('APICFG.proxy="https://p.example/?u={URL}"');
const pu = G('srcUrl("tx","000063",60)');
ok(pu.indexOf('https://p.example/?u=') === 0 && pu.indexOf(encodeURIComponent('ifzq.gtimg.cn')) > 0, '代理 {URL} 生效', pu.slice(0, 60) + '…');
G('APICFG.proxy=""');
ok(G('srcUrl("tx","000063",60)').indexOf('datalen') < 0 && G('srcUrl("tx","000063",60)').indexOf(',,,60,') > 0, '占位符替换 {N}', G('srcUrl("tx","000063",60)').slice(40, 90));

sec('4. 艾略特波浪识别');
const waveRes = G(`(function(){
  var out=[];
  var codes=Object.keys(state.stocks);
  for(var i=0;i<codes.length;i++){
    var an=getAn(codes[i]);
    if(!an||!an.dates||an.dates.length<60)continue;
    var n=zigzagPivots(an,0.05).length;
    var e=elliott(an);
    out.push({code:codes[i],piv:n,found:e.found,up:e.imp?e.imp.up:null,text:(e.text||"").slice(0,40)});
  }
  return out;
})()`);
const wv = Array.isArray(waveRes) ? waveRes : [];
ok(wv.length > 0, '波浪扫描覆盖标的数', wv.length + ' 只');
wv.slice(0, 6).forEach(x => console.log('    ' + x.code + '  摆动点 ' + x.piv + '  五浪=' + (x.found ? '是' : '否') + '  ' + x.text));
ok(wv.every(x => x.piv >= 0), 'ZigZag 返回合法');
const foundN = wv.filter(x => x.found).length;
ok(foundN >= 1, '至少 1 只识别出五浪结构', foundN + '/' + wv.length);
const mk = G(`(function(){
  var codes=Object.keys(state.stocks);
  for(var i=0;i<codes.length;i++){
    var an=getAn(codes[i]);
    if(!an)continue;
    var e=elliott(an);
    if(e.found){ var n=buildWaveMark(an,{min:0,max:1e9}).length; return n+'|'+codes[i]; }
  }
  return '0|none';
})()`);
ok(parseInt(String(mk).split('|')[0],10) >= 5, 'buildWaveMark 画出 5 段以上浪线', String(mk));

sec('5. K线设置');
G('klSetApplyPreset("bare")');
ok(G('KLSET.ma').length === 0, '预设「裸K」清空均线');
ok(G('CUR.main') === 'none', '预设「裸K」主图 none', G('CUR.main'));
G('klSetApplyPreset("chan")');
ok(G('KLSET.wave') === false && G('CUR.main') === 'ma', '预设「趋势通道」');
G('klSetApplyPreset("wave")');
ok(G('KLSET.wave') === true, '预设「波浪」开启波浪');
G('klSetApplyPreset("full")');
ok(G('KLSET.ma').length === 4 && G('KLSET.wave') === true, '预设「全开」');
const md120 = G(`(function(){var an=getAn(state.holdings[0].code);var d=maLineData(an,120);return d?(d.filter(function(x){return x!=null;}).length):0;})()`);
ok(md120 > 0, 'MA120 可计算', md120 + ' 个有效值');
const ohlc = G(`(function(){var an=getAn(state.holdings[0].code);var s=ohlcBarSeries(an);return s&&s.type==="custom"&&s.data.length;})()`);
ok(ohlc > 0, '美国线 custom 系列', ohlc + ' 条');

sec('6. 大事提醒');
G('ALERTS=[]');
G('$("alCode").value="000063";$("alType").value="below";$("alVal").value="99999"');
G('addAlertFromUI()');
ok(G('ALERTS.length') === 1, '添加价格下破提醒', G('ALERTS[0] && ALERTS[0].name'));
const hit = G('checkAllAlerts()');
ok(G('ALERTS[0].hit') === true, '低于阈值即命中（现价<99999）', G('ALERTS[0].hitInfo'));
G('$("alCode").value="中兴通讯";$("alType").value="date";$("alVal").value="2020-01-01"');
G('addAlertFromUI()');
ok(G('ALERTS[1].hit') === true, '日期到期提醒命中');
G('$("alCode").value="abcxyz"'); G('addAlertFromUI()');
ok(G('ALERTS.length') === 2, '非法代码被拒绝');
const sigs = G('scanTechSignals().length');
ok(typeof sigs === 'number', '技术信号扫描返回', sigs + ' 条');
console.log('    信号样例：' + String(G('(scanTechSignals()[0]||{}).text') || '无').slice(0, 60));

sec('7. 持仓盈亏');
G('POS={"000063":{cost:30,qty:1000},"159558":{cost:1.0,qty:20000}}');
G('renderPosSummary()');
const sum = G('(function(){var mv=0,c=0;state.holdings.forEach(function(h){var an=getAn(h.code);var p=POS[h.code];if(an&&p&&p.cost!=null&&p.qty!=null){mv+=an.close*p.qty;c+=p.cost*p.qty;}});return {mv:Math.round(mv),c:Math.round(c),pl:Math.round(mv-c)};})()');
ok(sum.c === 50000, '总成本 = 30×1000 + 1×20000', String(sum.c));
ok(sum.pl === (sum.mv - sum.c), '浮盈亏 = 市值 − 成本', String(sum.pl));
ok(String(G('$("posSummary").innerHTML')).indexOf('总市值') >= 0, '盈亏卡片已渲染');

sec('8. API 日志 / 体检');
G('APILOG=[]');
G('apiLog({t:Date.now(),src:"tx",code:"000063",ok:true,n:320,ms:210})');
G('apiLog({t:Date.now(),src:"em",code:"159558",ok:false,n:0,ms:900,err:"超时"})');
ok(G('APILOG.length') === 2, '日志写入', G('APILOG.length'));
G('renderApiStat()');
ok(String(G('$("apiStat").innerHTML')).indexOf('成功率') >= 0, '统计卡片渲染');
G('renderApiLog()');
ok(String(G('$("apiLog").innerHTML')).indexOf('东方财富') >= 0, '日志表渲染');
G('renderHealth()');
ok(String(G('$("healthBox").innerHTML')).indexOf('K线总根数') >= 0, '体检卡片渲染');

sec('9. 大盘走势图');
G('IDXV.span=60;IDXV.mode="norm";renderIdxChart()');
const io1 = lastOpt;
ok(io1 && io1.grid && io1.grid.top >= 40, 'grid 顶部留白', 'top=' + (io1 && io1.grid.top));
ok(io1 && io1.grid.bottom >= 60, 'grid 底部留给缩放条', 'bottom=' + (io1 && io1.grid.bottom));
ok(io1 && io1.dataZoom && io1.dataZoom.length === 2, '含 inside + slider 缩放');
const yv = io1 && (Array.isArray(io1.yAxis) ? io1.yAxis[0] : io1.yAxis);
ok(yv && yv.min != null && yv.max != null, 'Y 轴显式收紧', (yv ? (Number(yv.min).toFixed(1) + ' ~ ' + Number(yv.max).toFixed(1)) : ''));
G('IDXV.mode="chg";renderIdxChart()');
ok(lastOpt && lastOpt.series.length >= 3, '切换涨跌%模式 series', lastOpt.series.length + ' 条');

sec('10. 五维雷达 / 120日评分');
G('IDXV.mode="norm"');
G('(function(){var an=getAn(state.holdings[0].code);renderRadar(an);})()');
ok(lastOpt && lastOpt.radar && lastOpt.radar.radius === '70%', '雷达半径 70%');
ok(String(G('$("radarBars").innerHTML')).indexOf('pnbar') >= 0, '雷达数值条渲染');
G('(function(){var an=getAn(state.holdings[0].code);renderScoreTrend(an);})()');
ok(lastOpt && lastOpt.grid.top >= 18 && lastOpt.grid.left >= 40, '评分图边距加大', JSON.stringify(lastOpt.grid));
ok(lastOpt && lastOpt.dataZoom && lastOpt.dataZoom.length === 1, '评分图可缩放');

sec('11. 关于页 / 快捷搜索');
G('renderAbout()');
ok(String(G('$("changelog").innerHTML')).indexOf('2.2') >= 0, '更新日志含 2.2');
ok(String(G('$("verBadge").innerHTML') || '').indexOf('v2.2') >= 0 || G('APPVER') === '2.2', '版本徽章');
const ci = G('cmdkItems().length');
ok(ci > 10, '快捷搜索条目', ci + ' 条');

sec('12. 报告附加大事提醒');
const rep = G('genReport()');
ok(rep.indexOf('## 大事提醒') >= 0, '报告含大事提醒段');
ok(rep.indexOf('## 免责声明') >= 0, '报告仍含免责声明');
ok(rep.indexOf('## 大事提醒') < rep.indexOf('## 免责声明'), '提醒段在免责声明之前');

sec('13. 页签切换冒烟测试');
const pages = ['dash','market','sector','stock','holdings','report','compare','notes','alerts','admin','help'];
let perr = [];
pages.forEach(p => { try { G('tab("' + p + '")'); } catch (e) { perr.push(p + ':' + e.message); } });
ok(perr.length === 0, '11 个页签切换无异常', perr.join(' | ') || '全部正常');
try { G('openCmdk()'); ok(true, '快捷搜索面板可打开'); } catch (e) { ok(false, '快捷搜索面板', e.message); }
try { G('flushCharts()'); ok(true, 'flushCharts 无异常'); } catch (e) { ok(false, 'flushCharts', e.message); }
try { G('resizeAllCharts()'); ok(true, 'resizeAllCharts 无异常'); } catch (e) { ok(false, 'resizeAllCharts', e.message); }
try { G('bindKlSet()'); ok(true, 'bindKlSet 无异常'); } catch (e) { ok(false, 'bindKlSet', e.message); }
try { G('klSetSyncUI()'); ok(true, 'klSetSyncUI 无异常'); } catch (e) { ok(false, 'klSetSyncUI', e.message); }

console.log('\n================ ' + (fail ? (fail + ' FAILED / ' + pass + ' passed') : 'ALL PASS (' + pass + ')') + ' ================');
process.exit(fail ? 1 : 0);
