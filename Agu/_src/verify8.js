/* ============================================================
   verify8 · v2.0 大盘走势工作台验证
   覆盖：结构完整性 / 状态推导 idxUiState / DOM 同步 / 交互（重置·快捷键·全屏）
         / 渲染选项 / 偏好持久化
   伪 DOM 具备真实 classList 与 getAttribute，可断言选中态
   ============================================================ */
const fs = require('fs'), vm = require('vm');
const html = fs.readFileSync('index.html', 'utf8');
const blocks = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
const all = blocks[0] + "\n" + blocks[blocks.length - 1];

let pass = 0, fail = 0;
const ok = (c, n, extra) => {
  if (c) { pass++; console.log('  PASS  ' + n + (extra ? '   ' + extra : '')); }
  else { fail++; console.log('  FAIL  ' + n + (extra ? '   ' + extra : '')); }
};
const sec = t => console.log('\n===== ' + t + ' =====');

/* ---------------- 工作台 HTML 区块（供结构断言 + 生成伪子节点） ---------------- */
const hA = html.indexOf('指数表现'), hB = html.indexOf('指数联动与多周期共振');
const mkt = (hA > 0 && hB > hA) ? html.slice(hA, hB) : '';

/* ---------------- 伪 DOM ---------------- */
const RAW = {}, ELS = {};
const cls = s => ({
  add: c => s.add(c), remove: c => s.delete(c),
  toggle: (c, f) => { const on = (f === undefined) ? !s.has(c) : !!f; on ? s.add(c) : s.delete(c); return on; },
  contains: c => s.has(c)
});
const METHODS = ['appendChild','removeChild','addEventListener','removeEventListener','focus','click',
  'remove','resize','dispose','requestFullscreen','select','setProperty','dispatchEvent','insertBefore'];
function rawEl(id) {
  if (RAW[id]) return RAW[id];
  const fn = function () {};
  fn._id = id; fn._cls = new Set(); fn._ds = {}; fn._attrs = {}; fn._kids = []; fn._q = {};
  fn.getAttribute = k => (fn._attrs[k] !== undefined ? fn._attrs[k] : null);
  fn.setAttribute = (k, v) => { fn._attrs[k] = v; };
  RAW[id] = fn;
  return fn;
}
function wrap(o) {
  return new Proxy(o, {
    get(t, p) {
      if (p === 'classList') return t._clsApi || (t._clsApi = cls(t._cls));
      if (p === 'dataset') return t._ds;
      if (p === 'style') return t._style || (t._style = { setProperty() {}, removeProperty() {}, getPropertyValue: () => '' });
      if (p === 'value') return t.value !== undefined ? t.value : '';
      if (p === 'checked') return t.checked !== undefined ? t.checked : false;
      if (p === 'textContent' || p === 'innerHTML') return t[p] !== undefined ? t[p] : '';
      if (p === 'tagName') return t.tagName || 'DIV';
      if (p === 'querySelectorAll') return s => (s === 'button' ? t._kids : []);
      if (p === 'querySelector') return s => t._q[s] || makeEl('q_' + t._id + '_' + s);
      if (p === 'clientWidth') return 1180;
      if (p === 'clientHeight') return 700;
      if (p === 'closest') return () => null;
      if (p === 'files') return [];
      if (typeof p === 'string' && p.charCodeAt(0) === 95) return t[p];
      if (typeof p === 'string' && /^on[a-z]+$/.test(p)) return t['_h_' + p];
      if (typeof p === 'string' && p in t && t[p] !== undefined) return t[p];
      if (typeof p === 'string' && METHODS.indexOf(p) >= 0) return () => {};
      return makeEl('x');
    },
    set(t, p, v) {
      if (typeof p === 'string' && /^on[a-z]+$/.test(p)) t['_h_' + p] = v;
      else t[p] = v;
      return true;
    },
    apply() { return makeEl('f'); }
  });
}
const makeEl = id => wrap(rawEl(id));
const getEl = id => (ELS[id] || (ELS[id] = wrap(rawEl(id))));

/* 从工作台 markup 里给 segpick 容器挂上按钮子节点，使其选中态可断言 */
const segIds = [];
for (const m of mkt.matchAll(/<div class="segpick[^"]*" id="(segIdx\w+)"[^>]*>([\s\S]*?)<\/div>/g)) {
  const host = rawEl(m[1]); segIds.push(m[1]);
  for (const b of m[2].matchAll(/<button\s+([^>]*)>/g)) {
    const attrs = {};
    for (const a of b[1].matchAll(/([\w-]+)(?:="([^"]*)")?/g)) attrs[a[1]] = a[2] === undefined ? '' : a[2];
    const key = attrs['data-t'] || attrs['data-c'] || attrs['data-p'] || attrs['data-n'] || attrs['data-w'] || 'b';
    const el = rawEl(m[1] + '#' + key);
    Object.keys(attrs).forEach(k => { if (k.indexOf('data-') === 0) el._attrs[k] = attrs[k]; });
    host._kids.push(makeEl(el._id));
  }
}
/* 开关 chip：把内部 input 挂到 _q.input，便于断言 checkbox 同步 */
const chipIds = [];
for (const m of mkt.matchAll(/<label class="tchip"[^>]*\sid="(\w+)"[^>]*>([\s\S]*?)<\/label>/g)) {
  const host = rawEl(m[1]); chipIds.push(m[1]);
  const im = m[2].match(/<input\s+type="checkbox"\s+id="(\w+)"/);
  if (im) host._q.input = makeEl(im[1]);
}

const store = {};
let lastOpt = null;
const chartStub = () => ({
  setOption(o) { lastOpt = o; this._o = o; }, clear() {}, dispose() {}, resize() {},
  getDataURL: () => "data:image/png;base64,", on(ev, fn) { this['_on_' + ev] = fn; }, getOption() { return this._o; }
});
/* 真实事件循环语义：脚本求值期间 setTimeout 只入队，求值结束后 flush
   —— 复现浏览器「宏任务在脚本跑完后才执行」的顺序，
      也才能暴露「init 同步读未赋值的顶层 var」这类缺陷 */
const TASKQ = [];
let flushing = false;
const setTimeoutStub = fn => { if (typeof fn === 'function') TASKQ.push(fn); return 0; };
function flushTasks(rounds = 120) {
  flushing = true;
  while (TASKQ.length && rounds-- > 0) {
    const f = TASKQ.shift();
    try { f(); } catch (e) { console.log('  [task] ' + String(e && e.message).slice(0, 70)); }
  }
  flushing = false;
}
const sandbox = {
  Math, JSON, Date, parseFloat, parseInt, isFinite, isNaN, console,
  Promise, Object, Array, String, Number, Boolean, RegExp, Error, Set, Map,
  Blob: function () {}, URL: { createObjectURL: () => "blob:", revokeObjectURL() {} },
  FileReader: function () {}, requestAnimationFrame: f => f(),
  setTimeout: setTimeoutStub,
  clearTimeout: () => {},
  alert: () => {}, confirm: () => false, prompt: () => null,
  fetch: () => Promise.reject(new Error('offline-sandbox')),
  echarts: { init: () => chartStub(), version: '5' },
  document: {
    getElementById: getEl, querySelectorAll: () => [], querySelector: () => makeEl('q'),
    createElement: () => makeEl('n'), body: makeEl('body'), addEventListener() {},
    readyState: 'complete', fullscreenElement: null, activeElement: makeEl('active'),
    documentElement: makeEl('html'), execCommand: () => true, exitFullscreen() {}
  },
  localStorage: { getItem: k => store[k] || null, setItem: (k, v) => store[k] = v, removeItem: k => delete store[k] },
  location: { reload() {} }, navigator: { userAgent: 'node' }
};
sandbox.window = sandbox; sandbox.window.addEventListener = () => {};
/* 大盘页签设为可见 */
rawEl('market')._cls.add('on');
vm.createContext(sandbox);
try { vm.runInContext(all, sandbox, { filename: 'app.js' }); }
catch (e) { console.log('!! 运行异常:', e.message); }
flushTasks();   /* 脚本求值结束 → 执行积压的引导任务 */

const G = code => vm.runInContext(code, sandbox);
const $el = id => getEl(id);
const V = () => JSON.parse(JSON.stringify(G('IDXV')));
const setV = o => G('(function(o){ for(var k in o) IDXV[k]=o[k]; return 1; })(' + JSON.stringify(o) + ')');
const U = () => JSON.parse(JSON.stringify(G('idxUiState()')));
const shown = id => RAW[id] && RAW[id]._style && RAW[id]._style.display;
/* 单指数为数组轴、多指数为对象轴，统一取 0 号 */
const ax0 = o => (o && Array.isArray(o.yAxis)) ? o.yAxis[0] : (o ? o.yAxis : { min: NaN, max: NaN });

/* ============================================================
   1. 结构：工作台 DOM 是否齐备、旧的一行式工具条是否清除
   ============================================================ */
sec('1. 工作台结构');
ok(mkt.length > 3000, '定位到大盘指数区块', mkt.length + ' 字符');
ok(/<div class="clab" id="clab"[\s>]/.test(mkt), '工作台容器 .clab#clab 存在');
['clabTitle','clabSub','clabDot','clabTags'].forEach(id =>
  ok(new RegExp('\\sid="' + id + '"').test(mkt), '头部元素 #' + id));
['btnIdxReset','btnIdxFull','btnIdxPng'].forEach(id =>
  ok(new RegExp('\\sid="' + id + '"').test(mkt), '动作按钮 #' + id));
ok(/class="cdeck"/.test(mkt), '控制台 .cdeck 存在');
['segIdxType','grpIdxTarget','segIdxSpan','grpIdxDraw'].forEach(id =>
  ok(new RegExp('\\sid="' + id + '"').test(mkt), '控制组 #' + id));
ok((mkt.match(/<div class="cgroup"/g) || []).length === 5, '控制台分为 5 个控制组',
   '实际 ' + (mkt.match(/<div class="cgroup"/g) || []).length);
ok(/id="idxChartNote"/.test(mkt) && /id="idxChartState"/.test(mkt), '图下说明 + 状态条容器存在');
ok(!/class="toolrow"/.test(mkt), '大盘区内已无旧的单行 .toolrow');
ok(!/id="pickWrap"|id="periodWrap"/.test(mkt), '旧的显隐式 pickWrap / periodWrap 已移除');
ok(chipIds.length === 6, '开关 chip 数量 = 6', '实际 ' + chipIds.length);
chipIds.forEach(id => {
  const seg = mkt.match(new RegExp('\\sid="' + id + '"[\\s\\S]*?</label>'))[0];
  ok(RAW[id]._q.input && /<i class="bx"[^>]*><\/i>/.test(seg) && /<span[^>]*>/.test(seg),
     'chip ' + id + ' 含 input + 勾选方块 + 文案');
});
/* 工作台内所有 id 都必须被脚本引用（防止重排后漏绑） */
const ids = [...mkt.matchAll(/(?:^|\s)id="([\w-]+)"/g)].map(m => m[1]);
const engineCode = blocks[blocks.length - 1];
const orphan = ids.filter(id => !new RegExp('["\']' + id + '["\']').test(engineCode));
ok(orphan.length === 0, '工作台 ' + ids.length + ' 个 id 全部被脚本引用', orphan.length ? '未引用: ' + orphan.join(',') : '');
ok(!/id="idxChart"[^>]*style=/.test(mkt), 'idxChart 高度改由 CSS 控制（无内联 style）');
ok(/\.clab-body \.chart\{height:540px\}/.test(html), 'CSS 定义主图高度 540px');
ok(/\.clab\.fs \.clab-body \.chart\{flex:1 1 auto/.test(html), 'CSS 定义全屏时主图自适应');
ok(!/grpIdxTarget[\s\S]{0,60}\.style\.display/.test(engineCode) && /idxSetDis\(/.test(engineCode),
   '禁用态用 class「变暗」而非 display:none（切换图型不跳动）');

/* ============================================================
   2. 状态推导 idxUiState：图型 × 周期
   ============================================================ */
sec('2. 状态推导（4 图型 × 指数 / 周期）');
setV({ mode:'kline', pick:'000001', period:'day', span:60, trend:true, chan:true, wave:true, ma:true, vol:true, fill:false, wavePct:'auto' });
let st = U();
ok(st.single === true, 'kline 为单指数模式');
ok(/K线/.test(st.title) && /上证指数/.test(st.title), 'K线标题含指数名与图型', st.title);
ok(/近 60 根/.test(st.sub), 'K线副标题含区间', st.sub);
ok(/数据截至/.test(st.sub), '副标题含快照日期', st.sub);
ok(st.dis.target === false && st.dis.wavePct === false, 'kline 下标的目标/灵敏度可用');
ok(st.dis.vol === false && st.dis.fill === true, 'kline 下成交量可用、面积填充禁用');
ok(st.tags.length === 6 && st.tags.filter(t => t[1]).length === 5, 'kline 叠加标签 6 项 / 生效 5 项');
ok(st.note.length > 30 && /K线/.test(st.note), '图下说明随图型变化', st.note.replace(/<[^>]+>/g, '').slice(0, 30) + '…');

setV({ mode:'close' });
st = U();
ok(st.dis.fill === false && st.dis.vol === true, '收盘线下面积填充可用、成交量禁用');
ok(/收盘线/.test(st.note), '收盘线说明文案正确');

setV({ mode:'norm' });
st = U();
ok(st.single === false, 'norm 为多指数模式');
ok(st.dis.target === true && st.dis.wavePct === true, '多指数下标的 / 画线组禁用');
ok(st.tags.length === 0, '多指数模式无叠加标签');
ok(/归一化/.test(st.title) && /归一化/.test(st.note), '归一化标题与说明正确', st.title);

setV({ mode:'chg' });
st = U();
ok(/涨跌%/.test(st.title), '涨跌% 标题正确', st.title);
ok(/三指数对比/.test(st.note), '涨跌% 说明为三指数对比');

setV({ mode:'kline', period:'week', pick:'399006', span:60 });
st = U();
ok(/周线/.test(st.title) && /创业板指/.test(st.title), '周线标题含周期与指数', st.title);
ok(/近 15 周/.test(st.sub), '周线区间按周换算（60 → 15 周）', st.sub);
setV({ period:'day', pick:'399001', span:0 });
st = U();
ok(/全部/.test(st.sub), '区间=全部时副标题为全部', st.sub);
ok(/深证成指/.test(st.title), '切换指数标题同步', st.title);
ok(st.winN === st.totN && st.totN > 60, '全部区间根数与数据长度一致', st.totN + ' 根');

/* ============================================================
   3. DOM 同步：头部 / 分段按钮 / chip / 禁用态
   ============================================================ */
sec('3. DOM 同步');
const btnOn = (host, attr, val) => {
  const k = RAW[host]._kids.find(e => e._attrs[attr] === String(val));
  return !!(k && k._cls.has('on'));
};
setV({ mode:'kline', pick:'000001', period:'day', span:60, trend:true, chan:true, wave:true, ma:true, vol:true, fill:false });
G('idxV2SyncUI()');
ok(/K线/.test(String($el('clabTitle').textContent)), '标题写入 DOM', String($el('clabTitle').textContent));
ok(/数据截至/.test(String($el('clabSub').textContent)), '副标题写入 DOM', String($el('clabSub').textContent));
ok(/波浪<\/span>/.test(String($el('clabTags').innerHTML)) && /tg on/.test(String($el('clabTags').innerHTML)), '叠加标签写入且生效项高亮');
ok(/近 60/.test(String($el('idxSpanNote').textContent)), '区间提示写入 DOM', String($el('idxSpanNote').textContent));
ok(/可切换指数与周期/.test(String($el('grpIdxTargetNote').textContent)), '标的分组提示写入');
ok(String($el('idxChartNote').innerHTML).length > 20, '图下说明写入 DOM');
ok(btnOn('segIdxType','data-t','kline'), '图型按钮选中态 = kline');
ok(btnOn('segIdxPick','data-c','000001'), '指数按钮选中态 = 上证');
ok(btnOn('segIdxPeriod','data-p','day'), '周期按钮选中态 = 日线');
ok(btnOn('segIdxSpan','data-n','60'), '区间按钮选中态 = 60');
ok(btnOn('segIdxWavePct','data-w','auto'), '灵敏度按钮选中态 = 自动');
['tchipTrend','tchipChan','tchipWave','tchipMa','tchipVol'].forEach(id =>
  ok(RAW[id]._cls.has('on'), id + ' 呈选中态'));
ok(!RAW.tchipFill._cls.has('on'), 'tchipFill 未选中');
ok(!RAW.grpIdxTarget._cls.has('dis'), '单指数下标的组不禁用');
ok($el('ckIdxTrend').checked === true && $el('ckIdxFill').checked === false, '复选框状态与 chip 一致');

setV({ mode:'norm' });
G('idxV2SyncUI()');
ok(RAW.grpIdxTarget._cls.has('dis'), '多指数下标的组变暗禁用');
ok(RAW.grpIdxDraw._cls.has('dis'), '多指数画线组变暗禁用');
ok(RAW.grpIdxTarget._style === undefined || RAW.grpIdxTarget._style.display === undefined, '禁用组未被 display:none 隐藏');
['idxTrendBox','idxWaveBox','idxLevels'].forEach(id =>
  ok(shown(id) === 'none', '多指数下隐藏 ' + id + ' 结果区'));
ok(btnOn('segIdxType','data-t','norm'), '切换后图型按钮选中态同步');

setV({ mode:'kline', wave:false, vol:false, fill:true });
G('idxV2SyncUI()');
ok(RAW.wavePctWrap._cls.has('dis'), '关闭波浪后灵敏度组变暗');
ok(!RAW.tchipWave._cls.has('on'), '关闭波浪后 chip 同步取消选中');
ok(RAW.tchipFill._cls.has('on'), '开启面积填充后 chip 呈选中');
ok(shown('idxTrendBox') === '', '回到单指数后结果区恢复显示');

/* ============================================================
   4. 交互：重置 / 快捷键 / 全屏
   ============================================================ */
sec('4. 交互');
setV({ mode:'chg', pick:'399006', period:'week', span:0, trend:false, chan:false, wave:false,
       ma:false, vol:false, fill:true, wavePct:'5' });
G('(function(){ $("btnIdxReset").onclick(); return 1; })()');
let v = V();
ok(v.mode === 'kline' && v.pick === '000001', '重置恢复默认图型与标的');
ok(v.period === 'day' && v.span === 60, '重置恢复日线 / 60 根');
ok(v.trend && v.chan && v.wave && v.ma && v.vol && !v.fill, '重置恢复叠加项');
ok(v.wavePct === 'auto', '重置恢复自动灵敏度');

G('idxHotkey({key:"2", preventDefault:function(){}})');
ok(V().pick === '399001', '快捷键 2 → 深证成指');
G('idxHotkey({key:"3", preventDefault:function(){}})');
ok(V().pick === '399006', '快捷键 3 → 创业板指');
G('idxHotkey({key:"1", preventDefault:function(){}})');
ok(V().pick === '000001', '快捷键 1 → 上证指数');
G('idxHotkey({key:"]", preventDefault:function(){}})');
ok(V().span === 120, '快捷键 ] 区间 60 → 120');
G('idxHotkey({key:"]", preventDefault:function(){}})');
ok(V().span === 0, '快捷键 ] 到末位后停在「全部」');
G('idxHotkey({key:"[", preventDefault:function(){}})');
ok(V().span === 120, '快捷键 [ 区间 全部 → 120');
G('idxHotkey({key:"x", preventDefault:function(){}})');
ok(V().span === 120, '无关按键被忽略');
setV({ mode:'chg' });
G('idxHotkey({key:"2", preventDefault:function(){}})');
ok(V().mode === 'kline' && V().pick === '399001', '多指数模式按数字键自动切到单指数 K线');

const act = rawEl('active');
act.tagName = 'INPUT';
G('idxHotkey({key:"1", preventDefault:function(){}})');
ok(V().pick === '399001', '输入框聚焦时快捷键不触发');
act.tagName = 'DIV';
rawEl('market')._cls.delete('on');
G('idxHotkey({key:"1", preventDefault:function(){}})');
ok(V().pick === '399001', '非大盘页签时快捷键不触发');
rawEl('market')._cls.add('on');

G('idxFullscreen()');
ok(RAW.clab._cls.has('fs'), '全屏：clab 加 fs');
ok(RAW.body._cls.has('fs-lock'), '全屏：body 锁定滚动');
G('idxV2SyncUI()');
ok(/退出全屏/.test(String($el('btnIdxFull').textContent)), '全屏按钮文案切换为退出');
G('idxHotkey({key:"Escape", preventDefault:function(){}})');
ok(!RAW.clab._cls.has('fs'), 'Esc 退出全屏');
G('idxV2SyncUI()');
ok(!/退出/.test(String($el('btnIdxFull').textContent)), '全屏按钮文案复原');

/* ============================================================
   5. 渲染：选项结构与状态条
   ============================================================ */
sec('5. 渲染与状态条');
setV({ mode:'kline', pick:'000001', period:'day', span:60, trend:true, chan:true, wave:true, ma:true, vol:true, fill:false });
G('idxV2SyncUI(); renderIdxChart()');
let o = lastOpt;
ok(o && o.grid && o.grid.length === 2, 'K线 + 成交量 → 双 grid（主图 / 副图）');
ok(o && o.series.filter(s => s.type === 'candlestick').length === 1, 'K线模式含蜡烛系列');
ok(o && o.dataZoom && o.dataZoom.length === 2, '含滚轮缩放 + 底部滑块');
ok(o && o.grid[0].height === '64%' && String(o.grid[1].top) === '76%', '主图 / 副图比例正确', o && (o.grid[0].height + ' / ' + o.grid[1].top));
const cdl = o.series.find(s => s.type === 'candlestick');
const yLo = ax0(o).min, yHi = ax0(o).max;
let cLo = Infinity, cHi = -Infinity;
cdl.data.forEach(d => { if (d[2] < cLo) cLo = d[2]; if (d[3] > cHi) cHi = d[3]; });
ok(cHi <= yHi && cLo >= yLo, 'Y 轴量程包住全部蜡烛', 'lo=' + yLo.toFixed(1) + ' hi=' + yHi.toFixed(1));
ok((cHi - cLo) / (yHi - yLo) > 0.6, '蜡烛占 Y 轴 > 60%（不被压扁）', ((cHi - cLo) / (yHi - yLo) * 100).toFixed(1) + '%');
const volSer = o.series.filter(s => s.xAxisIndex === 1);
ok(volSer.length === 2, '副图为 成交量柱 + 量MA5 两条系列', '实际 ' + volSer.length);
ok(o.xAxis.length === 2 && String(o.xAxis[0].data.length) === String(cdl.data.length), '主副图 X 轴数据等长');

setV({ mode:'close', vol:false, fill:true });
G('renderIdxChart()'); o = lastOpt;
ok(o && o.grid.length === 1, '收盘线且无成交量 → 单 grid');
ok(o.series.some(s => s.type === 'line' && s.areaStyle), '面积填充生效');

setV({ mode:'norm' });
G('renderIdxChart()'); o = lastOpt;
ok(o && o.series.length >= 3, '归一化模式 3 条指数线', '系列数 ' + (o ? o.series.length : 0));
ok(o && ax0(o).min <= 100 && ax0(o).max >= 100, '归一化基准 100 落在量程内',
   o ? (ax0(o).min.toFixed(1) + ' ~ ' + ax0(o).max.toFixed(1)) : '');
setV({ mode:'chg' });
G('renderIdxChart()'); o = lastOpt;
ok(o && o.series.length >= 3, '涨跌% 模式 3 条线');

setV({ mode:'kline', pick:'000001', period:'day', span:60, trend:true, chan:true, wave:true, ma:true, vol:true });
G('renderIdxStateBar()');
const sb = String($el('idxChartState').innerHTML);
ok(sb.length > 10, '状态条有内容', sb.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 56));
ok(/MA20|MA60/.test(sb), '状态条含均线位置');
G('IDXV.mode="norm"; renderIdxStateBar()');
ok(String($el('idxChartState').innerHTML) === '', '多指数模式状态条清空（无歧义信息）');

/* KPI 卡带 data-idx，供点击切换 */
G('IDXV.mode="kline"; renderIdxSpark()');
const sparkHtml = String($el('idxCards').innerHTML);
ok((sparkHtml.match(/data-idx=/g) || []).length === 3, '三张 KPI 卡均带 data-idx（可点击切换）');
ok(/data-idx="399006"/.test(sparkHtml), 'KPI 卡标的与指数一一对应');

/* ============================================================
   6. 偏好持久化
   ============================================================ */
sec('6. 偏好持久化');
G('IDXV.mode="close"; IDXV.span=120; IDXV.fill=true; IDXV.wavePct="3"; idxSavePref();');
const saved = JSON.parse(store['idxv2'] || '{}');
ok(saved.mode === 'close' && saved.span === 120 && saved.fill === true, '偏好写入 localStorage', JSON.stringify(saved).slice(0, 90));
ok(saved.wavePct === '3' && typeof saved.trend === 'boolean', '灵敏度与开关一并保存');

console.log('\n================ ' + (fail === 0 ? 'ALL PASS' : 'FAILED') + ' (' + pass + ' passed' + (fail ? ', ' + fail + ' failed' : '') + ') ================');
process.exit(fail ? 1 : 0);
