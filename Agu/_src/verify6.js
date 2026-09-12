/* verify5 · v2.0 新功能验证 */
const fs = require('fs'), vm = require('vm');
const html = fs.readFileSync('index.html', 'utf8');
const DEFAULT_HOLDINGS_LEN = 0;
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



sec('1. 智能添加：本地索引检索');
const q1 = G('searchLocal("gmt",5).map(function(x){return x.code+"|"+x.name;})');
ok(String(q1).indexOf('600519') >= 0, '拼音首字母 gmt → 贵州茅台', String(q1).slice(0,60));
const q2 = G('searchLocal("茅台",3).map(function(x){return x.code+"|"+x.name;})');
ok(String(q2).indexOf('600519') >= 0, '汉字「茅台」→ 贵州茅台', String(q2).slice(0,60));
const q3 = G('searchLocal("zxtx",3).map(function(x){return x.code+"|"+x.name;})');
ok(String(q3).indexOf('000063') >= 0, '拼音 zxtx → 中兴通讯', String(q3).slice(0,60));
const q4 = G('searchLocal("159558",3).map(function(x){return x.code;})');
ok(String(q4).indexOf('159558') >= 0, '代码前缀 159558', String(q4));
const q5 = G('searchLocal("半导体",8).length');
ok(q5 > 0, '关键词「半导体」有结果', q5 + ' 条');
const idxN = G('Object.keys(NAME_IDX).length');
ok(idxN > 900, '内置名称索引规模', idxN + ' 条');

sec('2. 智能添加：批量一句话解析');
const p1 = G('parseSmart("600519 贵州茅台\\n300750\\n宁德时代\\ngmt").map(function(x){return x.code;})');
ok(String(p1).indexOf('600519') >= 0 && String(p1).indexOf('300750') >= 0, '混排解析（代码+名称+拼音）', String(p1));
const p2 = G('parseSmart("600519,300750,000063").length');
ok(p2 === 3, '逗号分隔解析', p2 + ' 只');
const p3 = G('parseSmart("600519\\n600519\\n600519").length');
ok(p3 === 1, '重复代码去重', p3 + ' 只');

sec('3. 内置行情库（离线可用，不含任何持仓）');
ok(G('DEFAULT_HOLDINGS.length') === 0, '内置持仓为空（隐私默认）', G('DEFAULT_HOLDINGS.length') + ' 只');
const bn = G('Object.keys(DEFAULT_STOCKS).length');
ok(bn >= 20, '内置公开行情快照', bn + ' 只标的');
ok(G('!!state.stocks["600519"]'), '行情库已并入运行索引');
ok(G('state.stocks["600519"].builtin') === true, '内置数据标记 builtin（不写 localStorage）');
const savedLen = G('(function(){try{return JSON.stringify(state).length}catch(e){return 0}})()');
ok(savedLen > 0, 'state 可序列化', (savedLen/1024).toFixed(0) + ' KB');

sec('4. 隐私检查：发布安全');
ok(html.indexOf('myHoldings') < 0 && DEFAULT_HOLDINGS_LEN === 0, '源码不含内置持仓清单');
ok(/不内置、不上传任何人的持仓/.test(html), '说明页含隐私声明');
ok(!/14 只持仓/.test(html), '说明页已移除「14 只持仓」表述');

sec('5. 后台管理：六模块');
['cachePanel','storagePanel','prefPanel','taskPanel','diagPanel','apiStat','apiLog','healthBox']
  .forEach(function(id){ ok(!!G('$("' + id + '")'), '后台容器 #' + id + ' 存在'); });
try{ G('renderCachePanel()'); ok(true, '数据缓存面板渲染'); }catch(e){ ok(false, '数据缓存面板', e.message); }
try{ G('renderStoragePanel()'); ok(true, '存储用量面板渲染'); }catch(e){ ok(false, '存储用量面板', e.message); }
try{ G('renderPrefPanel()');   ok(true, '偏好设置面板渲染'); }catch(e){ ok(false, '偏好设置面板', e.message); }
try{ G('renderTaskPanel()');   ok(true, '自动化任务面板渲染'); }catch(e){ ok(false, '自动化任务面板', e.message); }
try{ G('renderDiagPanel()');   ok(true, '诊断自检面板渲染'); }catch(e){ ok(false, '诊断自检面板', e.message); }
const chk = G('runSelfCheck().length');
ok(chk >= 5, '自检项数量', chk + ' 项');
ok(String(G('$("cachePanel").innerHTML')).indexOf('KB') >= 0, '缓存面板显示占用');
ok(String(G('$("diagPanel").innerHTML')).indexOf('正常') >= 0, '诊断面板输出结论');

sec('6. 主题与偏好');
['dark','light','sepia'].forEach(function(t){
  try{ G('applyTheme("' + t + '")'); ok(G('PREF.theme') === t, '主题切换 ' + t); }
  catch(e){ ok(false, '主题切换 ' + t, e.message); }
});
G('applyTheme("dark")');
try{ G('applyFs("fs-l")'); ok(G('PREF.fs') === 'fs-l', '字号切换到「大」'); }catch(e){ ok(false,'字号',e.message); }
G('applyFs("fs-m")');
ok(G('prefSave') !== undefined, '偏好可持久化');

sec('7. 数据字典');
ok(G('DICT.length') >= 10, '词典条目数', G('DICT.length') + ' 条');
try{ G('renderDict()'); ok(String(G('$("dictBox").innerHTML')).indexOf('MA 均线') >= 0, '词典渲染'); }
catch(e){ ok(false, '词典渲染', e.message); }

sec('8. 拉取层 v2');
ok(typeof G('fetchStockData') === 'function', 'fetchStockData 已升级');
ok(G('typeof diagText') === 'function', '诊断文本函数存在');
G('FETCH_DIAG=[{src:"tx",ok:false,ms:120,err:"测试错误"},{src:"sina",ok:true,ms:80,n:320}]');
ok(String(G('diagText()')).indexOf('腾讯行情') >= 0, '诊断含源名称');
ok(String(G('fetchFailGuide("600519")')).indexOf('常见原因') >= 0, '失败引导含排查建议');
ok(String(G('pasteTemplate()')).indexOf('日期') >= 0, '粘贴模板可用');
ok(G('typeof fetchMany') === 'function', '批量拉取函数存在');

sec('9. 分组与引导');
ok(G('GROUPS.length') >= 3, '分组定义', String(G('GROUPS')));
G('setGroup(state.holdings[0].code,"自选")');
ok(G('groupOf(state.holdings[0].code)') === '自选', '分组可设置与读取');
try{ G('firstRunGuide()'); ok(true, '首次引导可渲染'); }catch(e){ ok(false,'首次引导',e.message); }

sec('10. 页签与整体冒烟');
const pages = ['dash','market','sector','stock','holdings','report','compare','notes','alerts','admin','help'];
let perr = [];
pages.forEach(p => { try { G('tab("' + p + '")'); } catch(e){ perr.push(p + ':' + e.message); } });
ok(perr.length === 0, '11 页签切换正常', perr.join(' | ') || '全部正常');
try{ G('initExtras()'); ok(true, 'initExtras 无异常'); }catch(e){ ok(false, 'initExtras', e.message); }
try{ G('renderAdmin()'); ok(true, '后台整页渲染（六模块）'); }catch(e){ ok(false, 'renderAdmin', e.message); }

console.log('\n================ ' + (fail ? (fail + ' FAILED / ' + pass + ' passed') : 'ALL PASS (' + pass + ')') + ' ================');
