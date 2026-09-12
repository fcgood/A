/* ============================================================
   engine12 · 后台管理中心 v2 + 偏好 + 自动化 + 词典 + 引导
   ------------------------------------------------------------
   后台从「只有 API」扩为 6 大模块：
     ① 数据源与 API   ② 数据缓存   ③ 存储用量
     ④ 偏好设置       ⑤ 自动化任务 ⑥ 日志与诊断
   另含：三主题切换、标的分组、指标数据字典、首次使用引导
   ============================================================ */

/* ---------------- 偏好 ---------------- */
var PREF = {theme:"dark", fs:"fs-m", repMode:"rich", period:"day", span:60,
            preset:"full", autoRefresh:false, refreshMin:15,
            autoScan:true, bootFetch:false, group:"全部"};

function prefSave(){ try{ localStorage.setItem("ashare_pref", JSON.stringify(PREF)); }catch(e){} }
function prefLoad(){
  try{
    var s = localStorage.getItem("ashare_pref");
    if(s){ var o = JSON.parse(s); for(var k in o) PREF[k] = o[k]; }
  }catch(e){}
}

var THEMES = {
  dark:  {bg:"#0b0f16", panel:"#131a25", panel2:"#1a2231", panel3:"#202a3a",
          line:"#263145", line2:"#31405a", txt:"#e8eef7", muted:"#93a1b8", muted2:"#6b7a91"},
  light: {bg:"#f4f6fa", panel:"#ffffff", panel2:"#f0f3f8", panel3:"#e6ebf3",
          line:"#d8dfea", line2:"#c3ccda", txt:"#1c2433", muted:"#5a6b85", muted2:"#7b8798"},
  sepia: {bg:"#f3ece0", panel:"#fbf6ec", panel2:"#f2e9d8", panel3:"#e9dcc4",
          line:"#ddceb3", line2:"#c9b795", txt:"#3b2f1e", muted:"#7a6a52", muted2:"#93826a"}
};

function applyTheme(t){
  PREF.theme = t || "dark";
  var m = THEMES[PREF.theme] || THEMES.dark;
  var r = document.documentElement;
  if(!r || !r.style) return;
  r.setAttribute("data-theme", PREF.theme);
  for(var k in m){ r.style.setProperty("--" + k, m[k]); }
  if(PREF.theme !== "dark"){
    r.style.setProperty("--shadow", "0 4px 18px rgba(0,0,0,.10)");
    r.style.setProperty("--up", "#d9363e");
    r.style.setProperty("--down", "#0f9d58");
  }else{
    r.style.setProperty("--shadow", "0 4px 20px rgba(0,0,0,.35)");
    r.style.setProperty("--up", "#ff4d4f");
    r.style.setProperty("--down", "#22c55e");
  }
  prefSave();
}

function applyFs(f){
  PREF.fs = f || "fs-m";
  var el = document.getElementById("reportOut");
  if(el){
    el.classList.remove("fs-s", "fs-m", "fs-l");
    el.classList.add(PREF.fs);
  }
  prefSave();
}

/* ---------------- 后台：入口（覆盖 engine9 的 renderAdmin） ----------------
   注意：不能用 `var _old = renderAdmin` 保存原函数 —— 同名函数声明会提升，
   且 init() 在 engine10 执行时 engine12 的顶层 var 还没赋值（拿到的会是
   undefined / 自身）。所以这里直接展开 engine9 的各个子步骤。 */
function renderAdmin(){
  try{ if(typeof apiLogLoadOnce === "function") apiLogLoadOnce(); }catch(e){}
  try{ if(typeof renderApiStat   === "function") renderApiStat();   }catch(e){}
  try{ if(typeof renderApiList   === "function") renderApiList();   }catch(e){}
  try{ if(typeof renderApiLog    === "function") renderApiLog();    }catch(e){}
  try{ if(typeof renderHealth    === "function") renderHealth();    }catch(e){}
  renderCachePanel();
  renderStoragePanel();
  renderPrefPanel();
  renderTaskPanel();
  renderDiagPanel();
}

/* ---------------- ② 数据缓存 ---------------- */
function stockMeta(code){
  var s = state.stocks[code];
  if(!s || !s.rows || !s.rows.length) return null;
  var r = s.rows;
  return {n:r.length, from:r[0][0], to:r[r.length - 1][0],
          bytes:JSON.stringify(r).length};
}

function renderCachePanel(){
  var box = document.getElementById("cachePanel");
  if(!box) return;
  var codes = Object.keys(state.stocks || {});
  var builtin = (typeof DEFAULT_STOCKS !== "undefined") ? Object.keys(DEFAULT_STOCKS) : [];
  var tot = 0;
  var html = '<div class="loggrid" style="margin-bottom:10px">' +
    '<div class="kv"><span>已缓存标的</span><b>' + codes.length + ' 只</b></div>' +
    '<div class="kv"><span>内置离线快照</span><b>' + builtin.length + ' 只</b></div>' +
    '<div class="kv"><span>合计占用</span><b id="cacheTot">—</b></div></div>';
  html += '<div style="max-height:300px;overflow:auto;border:1px solid var(--line);border-radius:8px">';
  html += '<table style="width:100%;font-size:12.5px;border-collapse:collapse">' +
    '<thead><tr style="background:var(--panel3);text-align:left">' +
    '<th style="padding:7px 10px">代码</th><th style="padding:7px 10px">名称</th>' +
    '<th style="padding:7px 10px">根数</th><th style="padding:7px 10px">区间</th>' +
    '<th style="padding:7px 10px">来源</th><th style="padding:7px 10px">占用</th>' +
    '<th style="padding:7px 10px"></th></tr></thead><tbody>';
  codes.sort().forEach(function(c){
    var m = stockMeta(c);
    if(!m) return;
    tot += m.bytes;
    var isB = builtin.indexOf(c) >= 0;
    html += '<tr style="border-top:1px solid var(--line)">' +
      '<td style="padding:6px 10px;font-family:ui-monospace,Consolas,monospace">' + c + '</td>' +
      '<td style="padding:6px 10px">' + esc(nameOf(c) || c) + '</td>' +
      '<td style="padding:6px 10px">' + m.n + '</td>' +
      '<td style="padding:6px 10px;font-size:11.5px;opacity:.8">' + m.from + ' → ' + m.to + '</td>' +
      '<td style="padding:6px 10px"><span class="pbadge ' + (isB ? "ok" : "") + '">' +
        (isB ? "内置" : "拉取") + '</span></td>' +
      '<td style="padding:6px 10px;font-size:11.5px">' + (m.bytes / 1024).toFixed(1) + ' KB</td>' +
      '<td style="padding:6px 10px"><button class="btn sm" data-del="' + c + '">删除</button></td></tr>';
  });
  html += '</tbody></table></div>';
  html += '<div class="flex" style="margin-top:10px">' +
    '<button class="btn sm" id="cacheClearPull">清空「拉取」数据（保留内置）</button>' +
    '<button class="btn sm" id="cacheClearAll">清空全部缓存</button>' +
    '<span class="muted" id="cacheMsg"></span></div>';
  box.innerHTML = html;
  var t = document.getElementById("cacheTot");
  if(t) t.textContent = (tot / 1024).toFixed(0) + " KB";

  box.querySelectorAll("[data-del]").forEach(function(b){
    b.onclick = function(){
      var c = b.dataset.del;
      delete state.stocks[c];
      saveState(); renderCachePanel();
      if(typeof renderHoldings === "function") renderHoldings();
      if(typeof renderRail === "function") renderRail();
    };
  });
  var b1 = document.getElementById("cacheClearPull");
  if(b1) b1.onclick = function(){
    Object.keys(state.stocks).forEach(function(c){
      if(builtin.indexOf(c) < 0) delete state.stocks[c];
    });
    saveState(); renderCachePanel();
    if(typeof renderHoldings === "function") renderHoldings();
  };
  var b2 = document.getElementById("cacheClearAll");
  if(b2) b2.onclick = function(){
    if(!confirm("清空全部 K 线缓存？内置离线快照也会消失，需重新拉取或粘贴。")) return;
    state.stocks = {}; saveState(); renderCachePanel();
    if(typeof renderHoldings === "function") renderHoldings();
  };
}

/* ---------------- ③ 存储用量 ---------------- */
var LS_KEYS = [
  ["ashare_state", "持仓 / 行情缓存 / 笔记"],
  ["ashare_alerts", "大事提醒"],
  ["ashare_pos", "持仓成本数量"],
  ["ashare_apicfg", "数据源配置"],
  ["ashare_apilog", "调用日志"],
  ["ashare_klset", "K线显示设置"],
  ["ashare_notes", "复盘笔记"],
  ["ashare_pref", "偏好设置"]
];

function renderStoragePanel(){
  var box = document.getElementById("storagePanel");
  if(!box) return;
  var rows = [], tot = 0;
  LS_KEYS.forEach(function(k){
    var v = "";
    try{ v = localStorage.getItem(k[0]) || ""; }catch(e){}
    var b = v.length;
    if(!b) return;
    tot += b;
    rows.push({k:k[0], d:k[1], b:b});
  });
  var cap = 5 * 1024 * 1024;
  var pct = Math.min(100, tot / cap * 100);
  var html = '<div class="loggrid" style="margin-bottom:10px">' +
    '<div class="kv"><span>已用</span><b>' + (tot / 1024).toFixed(1) + ' KB</b></div>' +
    '<div class="kv"><span>浏览器上限（约）</span><b>5 MB</b></div>' +
    '<div class="kv"><span>占用率</span><b style="color:' +
      (pct > 80 ? "var(--warn)" : "var(--down)") + '">' + pct.toFixed(1) + '%</b></div></div>';
  html += '<div style="height:10px;background:var(--panel3);border-radius:6px;overflow:hidden;margin-bottom:12px">' +
    '<div style="height:100%;width:' + pct.toFixed(1) + '%;background:' +
    (pct > 80 ? "var(--warn)" : "var(--accent)") + '"></div></div>';
  html += '<table style="width:100%;font-size:12.5px;border-collapse:collapse">' +
    '<thead><tr style="background:var(--panel3);text-align:left"><th style="padding:6px 10px">键</th>' +
    '<th style="padding:6px 10px">内容</th><th style="padding:6px 10px">大小</th></tr></thead><tbody>';
  rows.sort(function(a, b){ return b.b - a.b; }).forEach(function(r){
    html += '<tr style="border-top:1px solid var(--line)">' +
      '<td style="padding:5px 10px;font-family:ui-monospace,Consolas,monospace;font-size:11.5px">' + r.k + '</td>' +
      '<td style="padding:5px 10px">' + r.d + '</td>' +
      '<td style="padding:5px 10px">' + (r.b / 1024).toFixed(1) + ' KB</td></tr>';
  });
  html += '</tbody></table>';
  html += '<div class="hint" style="margin-top:10px;font-size:12px">' +
    '全部数据只存在这台电脑的浏览器里，<b>不会上传</b>。清理浏览器缓存会一并清除，建议定期用「导出全部数据」备份。</div>';
  box.innerHTML = html;
}

/* ---------------- ④ 偏好设置 ---------------- */
function renderPrefPanel(){
  var box = document.getElementById("prefPanel");
  if(!box) return;
  var seg = function(id, items, cur){
    return '<div class="segpick" id="' + id + '">' + items.map(function(it){
      return '<button data-v="' + it[0] + '"' + (it[0] === cur ? ' class="on"' : '') + '>' + it[1] + '</button>';
    }).join("") + '</div>';
  };
  var html =
    '<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:14px">' +
    '<div><div class="muted" style="font-size:12px;margin-bottom:6px">界面主题</div>' +
      seg("segTheme", [["dark", "深色"], ["light", "浅色"], ["sepia", "护眼"]], PREF.theme) + '</div>' +
    '<div><div class="muted" style="font-size:12px;margin-bottom:6px">报告字号</div>' +
      seg("segFs", [["fs-s", "小"], ["fs-m", "中"], ["fs-l", "大"]], PREF.fs) + '</div>' +
    '<div><div class="muted" style="font-size:12px;margin-bottom:6px">报告默认模式</div>' +
      seg("segRep", [["rich", "富文本"], ["raw", "纯文本"]], PREF.repMode) + '</div>' +
    '<div><div class="muted" style="font-size:12px;margin-bottom:6px">K线默认周期</div>' +
      seg("segPd", [["day", "日线"], ["week", "周线"]], PREF.period) + '</div>' +
    '<div><div class="muted" style="font-size:12px;margin-bottom:6px">K线默认视野</div>' +
      seg("segSp", [["20", "20"], ["40", "40"], ["60", "60"], ["90", "90"], ["180", "180"], ["0", "全部"]],
        String(PREF.span)) + '</div>' +
    '<div><div class="muted" style="font-size:12px;margin-bottom:6px">K线默认预设</div>' +
      seg("segPs", [["bare", "裸K"], ["ma", "均线"], ["boll", "布林"], ["chan", "通道"], ["wave", "波浪"], ["full", "全开"]],
        PREF.preset) + '</div>' +
    '</div>' +
    '<div style="margin-top:14px;display:flex;flex-wrap:wrap;gap:16px;align-items:center">' +
      '<label class="ck"><input type="checkbox" id="ckAutoScan"' + (PREF.autoScan ? " checked" : "") + '> 打开时自动扫描大事提醒</label>' +
      '<label class="ck"><input type="checkbox" id="ckBootFetch"' + (PREF.bootFetch ? " checked" : "") + '> 打开时自动补拉缺失行情</label>' +
    '</div>';
  box.innerHTML = html;

  var bind = function(id, fn){
    var p = document.getElementById(id);
    if(!p) return;
    p.querySelectorAll("button").forEach(function(b){
      b.onclick = function(){
        p.querySelectorAll("button").forEach(function(x){ x.classList.remove("on"); });
        b.classList.add("on");
        fn(b.dataset.v);
      };
    });
  };
  bind("segTheme", function(v){ applyTheme(v); });
  bind("segFs",    function(v){ applyFs(v); });
  bind("segRep",   function(v){ PREF.repMode = v; prefSave(); if(typeof REP !== "undefined"){ REP.mode = v; if(typeof setReport === "function") setReport(REP.raw || ""); } });
  bind("segPd",    function(v){ PREF.period = v; prefSave(); });
  bind("segSp",    function(v){ PREF.span = parseInt(v, 10) || 60; prefSave(); });
  bind("segPs",    function(v){ PREF.preset = v; prefSave(); if(typeof KLSET !== "undefined" && typeof applyPreset === "function"){ applyPreset(v); if(typeof drawKline === "function") drawKline(); } });
  var c1 = document.getElementById("ckAutoScan");
  if(c1) c1.onchange = function(){ PREF.autoScan = c1.checked; prefSave(); };
  var c2 = document.getElementById("ckBootFetch");
  if(c2) c2.onchange = function(){ PREF.bootFetch = c2.checked; prefSave(); };
}

/* ---------------- ⑤ 自动化任务 ---------------- */
var TASK = {timer:null, last:"", running:false};

function taskLog(msg){
  TASK.last = new Date().toTimeString().slice(0, 8) + " " + msg;
  var el = document.getElementById("taskLast");
  if(el) el.textContent = TASK.last;
}

async function taskTick(manual){
  if(TASK.running) return;
  TASK.running = true;
  try{
    var b = document.getElementById("btnRefresh");
    if(b) b.click();
    taskLog("已刷新行情");
    if(PREF.autoScan && typeof checkAllAlerts === "function"){
      checkAllAlerts();
      taskLog("已刷新行情并扫描提醒");
    }
  }catch(e){ taskLog("出错：" + e.message); }
  TASK.running = false;
}

function taskStart(){
  taskStop();
  var min = Math.max(1, parseInt((document.getElementById("taskMin") || {}).value, 10) || 15);
  PREF.refreshMin = min; prefSave();
  TASK.timer = setInterval(taskTick, min * 60000);
  var el = document.getElementById("taskState");
  if(el) el.innerHTML = '<span class="pbadge ok">运行中 · 每 ' + min + ' 分钟</span>';
  taskLog("定时任务已启动（每 " + min + " 分钟）");
}
function taskStop(){
  if(TASK.timer) clearInterval(TASK.timer);
  TASK.timer = null;
  var el = document.getElementById("taskState");
  if(el) el.innerHTML = '<span class="pbadge">已停止</span>';
}

function renderTaskPanel(){
  var box = document.getElementById("taskPanel");
  if(!box) return;
  box.innerHTML =
    '<div class="hint" style="font-size:12.5px;line-height:1.9;margin-bottom:12px">' +
    '定时自动刷新指数与涨跌家数，并按你的提醒条件扫描命中项。' +
    '仅在<b>本页保持打开</b>时生效；关闭标签页即停止（浏览器限制，不会后台常驻）。</div>' +
    '<div class="flex" style="flex-wrap:wrap;gap:10px;align-items:center">' +
      '<span class="lbl">间隔</span>' +
      '<input id="taskMin" type="number" min="1" max="240" value="' + (PREF.refreshMin || 15) + '" style="max-width:80px"> 分钟' +
      '<button class="btn primary sm" id="taskGo">启动</button>' +
      '<button class="btn sm" id="taskStopBtn">停止</button>' +
      '<button class="btn sm" id="taskNow">立即执行一次</button>' +
      '<span id="taskState">' + (TASK.timer ? '<span class="pbadge ok">运行中</span>' : '<span class="pbadge">已停止</span>') + '</span>' +
      '<span class="muted" id="taskLast">' + (TASK.last || "尚未运行") + '</span>' +
    '</div>';
  var g = document.getElementById("taskGo");   if(g) g.onclick = taskStart;
  var s = document.getElementById("taskStopBtn"); if(s) s.onclick = taskStop;
  var n = document.getElementById("taskNow");  if(n) n.onclick = function(){ taskTick(true); };
}

/* ---------------- ⑥ 诊断与自检 ---------------- */
function runSelfCheck(){
  var items = [];
  var push = function(name, ok, detail){ items.push({name:name, ok:ok, detail:detail}); };
  push("行情数据", Object.keys(state.stocks || {}).length > 0,
    Object.keys(state.stocks || {}).length + " 只标的有 K 线");
  push("持仓列表", true, state.holdings.length + " 只（本机私有，不在源码中）");
  var bad = state.holdings.filter(function(h){
    var s = state.stocks[h.code]; return !s || !s.rows || s.rows.length < 20; });
  push("数据完整性", bad.length === 0,
    bad.length ? (bad.length + " 只缺数据：" + bad.map(function(x){ return x.name; }).slice(0, 5).join("、"))
               : "全部持仓均有足够 K 线");
  var hasIdx = !!(typeof DEFAULT_INDEX !== "undefined" && Object.keys(DEFAULT_INDEX).length);
  push("指数快照", hasIdx, hasIdx ? (Object.keys(DEFAULT_INDEX).length + " 个指数") : "缺失");
  push("图表引擎", typeof echarts !== "undefined", typeof echarts !== "undefined" ? ("ECharts " + (echarts.version || "")) : "未加载 echarts.min.js");
  push("本地存储", (function(){ try{ localStorage.setItem("__t", "1"); localStorage.removeItem("__t"); return true; }catch(e){ return false; } })(),
    "localStorage 可写");
  push("内置索引", Object.keys(NAME_IDX).length > 500, Object.keys(NAME_IDX).length + " 条名称索引");
  return items;
}

function renderDiagPanel(){
  var box = document.getElementById("diagPanel");
  if(!box) return;
  var items = runSelfCheck();
  var html = '<div class="loggrid">';
  items.forEach(function(it){
    html += '<div class="kv"><span>' + it.name + '</span><b style="color:' +
      (it.ok ? "var(--down)" : "var(--warn)") + '">' + (it.ok ? "正常" : "注意") +
      '</b><span class="muted" style="font-size:11.5px;grid-column:1/-1">' + it.detail + '</span></div>';
  });
  html += '</div>';
  html += '<div style="margin-top:12px"><b style="font-size:12.5px">最近一次联网拉取</b>' +
    '<pre style="white-space:pre-wrap;font-size:12px;background:var(--panel2);' +
    'border:1px solid var(--line);border-radius:8px;padding:10px;margin-top:6px">' +
    (LAST_FETCH_ERR ? esc(LAST_FETCH_ERR) : (FETCH_DIAG.length ? esc(diagText()) : "（本次启动后尚未发起拉取）")) +
    '</pre></div>';
  box.innerHTML = html;
}

/* ---------------- 指标数据字典 ---------------- */
var DICT = [
  ["MA 均线", "收盘价的算术平均。MA5/20/60 分别代表一周、一月、一季的平均成本。",
   "价格在 MA20 上方且 MA20 向上，中期偏多；跌破且 MA20 走平转下，需警惕。<b>均线是滞后指标</b>，震荡市中频繁上下穿属正常噪声。"],
  ["MACD", "DIF（12日与26日EMA之差）减去 DEA（DIF 的 9 日EMA），柱=2×(DIF−DEA)。",
   "金叉（DIF 上穿 DEA）常被视为转强信号，死叉反之。<b>顶部/底部背离（价格新高但 MACD 不新高）比金叉死叉更有预警价值</b>。"],
  ["RSI(14)", "一定周期内涨跌幅的相对强弱，0~100。",
   ">70 为超买区，<30 为超卖区。<b>强势股可以长期超买，弱势股可以长期超卖</b>，单独用 RSI 抄底逃顶容易连续误判。"],
  ["KDJ(9,3,3)", "以最高/最低价计算的随机指标，K、D、J 三线。",
   "J 值 >100 或 <0 属极值。<b>KDJ 在趋势市钝化明显</b>，应与 MACD、量能配合使用。"],
  ["BOLL(20,2)", "中轨=MA20，上下轨=中轨±2倍标准差。",
   "带宽收窄（布林收口）往往预示变盘；价格触及上轨不等于必须卖出。<b>带宽只能衡量波动，不能指示方向</b>。"],
  ["ATR(14)", "真实波幅均值，衡量近期平均波动幅度。",
   "常用于设置止损距离（如 1.5×ATR）。<b>波动越大止损应越宽，否则容易被正常波动扫出</b>。"],
  ["量比", "当前成交量 / 过去 5 日同期均量。",
   ">1.5 为放量，<0.7 为缩量。<b>上涨放量、下跌缩量是健康结构；上涨缩量需警惕后继乏力</b>。"],
  ["POC 密集成交区", "区间内成交量最集中的价格带。",
   "价格回到 POC 附近常出现反复。<b>筹码密集区既是支撑也是阻力，方向由突破方决定</b>。"],
  ["趋势通道", "由近期摆动高点与低点拟合的上下轨。",
   "通道内运行属常态；<b>有效跌破下轨（且伴随放量）才算趋势破坏</b>，单根插针不算。"],
  ["艾略特波浪", "ZigZag 识别摆动点后，用「2浪不破1浪起点 / 3浪不是最短 / 4浪不重叠1浪」三条规则校验 5 浪结构。",
   "<b>浪型是主观性很强的事后描述</b>，同一段行情常有多种数法。本工具只做客观标注，请以关键位和风控为准，不要依赖浪型做单。"],
  ["顶背离 / 底背离", "价格创新高（新低）而指标未创新高（新低）。",
   "背离提示动能衰减，<b>但背离可以多次出现后才转折</b>，不宜作为唯一买卖依据。"],
  ["五维技术评分", "趋势 / 动量 / 量能 / 波动 / 位置 五个维度各 0~100 分后的加权。",
   "用于横向比较同一时点不同标的的相对强弱，<b>不是预测分数</b>，60 分不代表会涨。"],
  ["最大回撤", "区间内从最高点到之后最低点的最大跌幅。",
   "衡量最坏情况。<b>收益/回撤比（Calmar）比单看收益更能反映持仓体验</b>。"]
];

function renderDict(){
  var box = document.getElementById("dictBox");
  if(!box) return;
  var q = (document.getElementById("dictQ") || {}).value || "";
  var html = "";
  DICT.forEach(function(d, i){
    if(q && (d[0] + d[1] + d[2]).toLowerCase().indexOf(q.toLowerCase()) < 0) return;
    html += '<details style="border:1px solid var(--line);border-radius:8px;margin-bottom:7px;padding:0 10px"' +
      (i === 0 && !q ? " open" : "") + '>' +
      '<summary style="cursor:pointer;padding:9px 0;font-size:13.5px;font-weight:600">' + d[0] + '</summary>' +
      '<div style="font-size:12.5px;line-height:1.9;padding-bottom:10px">' +
      '<div style="opacity:.9">' + d[1] + '</div>' +
      '<div style="margin-top:6px;color:var(--muted)">' + d[2] + '</div></div></details>';
  });
  box.innerHTML = html || '<div class="muted">没有匹配的指标</div>';
}

/* ---------------- 标的分组 ---------------- */
var GROUPS = ["持仓", "自选", "观察", "已清"];

function setGroup(code, g){
  var h = state.holdings.find(function(x){ return x.code === code; });
  if(h){ h.group = g; saveState(); }
}
function groupOf(code){
  var h = state.holdings.find(function(x){ return x.code === code; });
  return (h && h.group) || "持仓";
}

/* ---------------- 首次使用引导 ---------------- */
function firstRunGuide(){
  var box = document.getElementById("guideBox");
  if(!box) return;
  if(state.holdings.length > 0){ box.style.display = "none"; return; }
  box.style.display = "";
  box.innerHTML =
    '<div style="display:flex;gap:14px;align-items:flex-start;flex-wrap:wrap">' +
    '<div style="flex:1;min-width:280px">' +
      '<div style="font-size:15px;font-weight:700;margin-bottom:6px">👋 先加几只标的吧</div>' +
      '<div class="hint" style="font-size:12.5px;line-height:1.9">' +
      '这个工具<b>不内置任何持仓</b>——你的数据只存在这台电脑。' +
      '在上面输入框里随便敲：<b>代码</b>（600519）、<b>拼音首字母</b>（gmt）、' +
      '或<b>汉字</b>（茅台 / 半导体），都能直接搜到并一键加入。' +
      '也可以一次粘一整段（一行一个，逗号分隔都行）。</div>' +
    '</div>' +
    '<div style="display:flex;gap:8px;align-items:center">' +
      '<button class="btn primary sm" id="guideDemo">载入 5 只示例标的</button>' +
      '<button class="btn sm" id="guideHide">不再显示</button>' +
    '</div></div>';
  var d = document.getElementById("guideDemo");
  if(d) d.onclick = async function(){
    var demo = [["600519", "贵州茅台"], ["300750", "宁德时代"], ["000063", "中兴通讯"],
                ["512880", "证券ETF"], ["000001", "上证指数"]];
    for(var i = 0; i < demo.length; i++){
      if(!state.holdings.find(function(h){ return h.code === demo[i][0]; }))
        state.holdings.push({code:demo[i][0], name:demo[i][1], type:typeOfCode(demo[i][0], demo[i][1]), inReport:true, group:"持仓"});
    }
    saveState();
    if(typeof renderHoldings === "function") renderHoldings();
    if(typeof renderRail === "function") renderRail();
    if(typeof renderDash === "function") renderDash();
    box.style.display = "none";
    qaToast("已载入 5 只示例标的，可随时在持仓管理删除");
  };
  var h = document.getElementById("guideHide");
  if(h) h.onclick = function(){
    try{ localStorage.setItem("ashare_guide_off", "1"); }catch(e){}
    box.style.display = "none";
  };
}

/* ---------------- 启动挂载 ---------------- */
function initExtras(){
  prefLoad();
  applyTheme(PREF.theme);
  applyFs(PREF.fs);
  if(PREF.period && typeof CUR !== "undefined") CUR.period = PREF.period;
  if(PREF.span && typeof CUR !== "undefined")  CUR.span = PREF.span;
  qaBindAll(document);
  if(typeof bindAdmin === "function"){ try{ bindAdmin(); }catch(e){} }
  renderDict();
  var dq = document.getElementById("dictQ");
  if(dq) dq.oninput = renderDict;
  firstRunGuide();
  if(PREF.autoScan && typeof checkAllAlerts === "function"){
    try{ checkAllAlerts(); }catch(e){}
  }
  if(PREF.bootFetch){
    var miss = state.holdings.filter(function(h){
      var s = state.stocks[h.code]; return !s || !s.rows || s.rows.length < 20;
    }).map(function(h){ return h.code; });
    if(miss.length) fetchMany(miss.slice(0, 30));
  }
}

/* ---------------- 启动（等 engine10 的 init 跑完再挂） ---------------- */
function bootExtras(){
  if(typeof state === "undefined" || !state || !state.holdings){
    setTimeout(bootExtras, 40); return;
  }
  try{ initExtras(); }catch(e){ if(window.console) console.warn("initExtras:", e); }
}
if(document.readyState === "loading"){
  document.addEventListener("DOMContentLoaded", function(){ setTimeout(bootExtras, 40); });
}else{
  setTimeout(bootExtras, 40);
}
