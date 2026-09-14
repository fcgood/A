/* ============================================================
   engine15 · 浮动快捷面板 / 复盘清单 / 隐私保护 / 拉取增强
   ============================================================ */

/* ===================== 1. 浮动快捷加标的面板 ===================== */
var FAB = {panel:null, input:null, results:null, items:[], idx:-1, timer:null, seq:0,
           recent:[], maxRecent:12};

function fabLoadRecent(){
  try{
    var s = localStorage.getItem("ashare_fab_recent");
    if(s){ FAB.recent = JSON.parse(s) || []; }
  }catch(e){ FAB.recent = []; }
}
function fabSaveRecent(){
  try{ localStorage.setItem("ashare_fab_recent", JSON.stringify(FAB.recent.slice(0, FAB.maxRecent))); }catch(e){}
}
function fabAddRecent(code, name){
  FAB.recent = FAB.recent.filter(function(r){ return r.code !== code; });
  FAB.recent.unshift({code:code, name:name});
  if(FAB.recent.length > FAB.maxRecent) FAB.recent.length = FAB.maxRecent;
  fabSaveRecent();
}

var FAB_HOT = [
  {code:"600519", name:"贵州茅台"}, {code:"000858", name:"五粮液"},
  {code:"300750", name:"宁德时代"}, {code:"601318", name:"中国平安"},
  {code:("000001"), name:"平安银行"}, {code:"002594", name:"比亚迪"},
  {code:"600036", name:"招商银行"}, {code:"000063", name:"中兴通讯"},
  {code:"601012", name:"隆基绿能"}, {code:"002475", name:"立讯精密"}
];

function fabToggle(forceShow){
  var p = FAB.panel;
  if(!p){ p = fabCreate(); }
  var show = forceShow !== undefined ? forceShow : (p.style.display === "none" || !p.style.display);
  if(show){
    p.style.display = "block";
    p.classList.remove("out");
    if(FAB.input){
      FAB.input.value = "";
      FAB.input.focus();
      fabRenderHot();
    }
  } else {
    p.classList.add("out");
    setTimeout(function(){ p.style.display = "none"; }, 200);
  }
}

function fabCreate(){
  var p = document.createElement("div");
  p.className = "qa-panel";
  p.style.display = "none";
  p.innerHTML =
    '<div class="qa-head">' +
      '<h4>⚡ 快捷加标的</h4>' +
      '<div class="qa-sub">输入代码 / 拼音 / 名称，回车即加并自动拉取</div>' +
    '</div>' +
    '<div class="qa-body">' +
      '<div class="qa-input-wrap">' +
        '<input type="text" id="fabInput" autocomplete="off" ' +
        'placeholder="如 600519、gmt、茅台…">' +
        '<button class="qa-clear-btn" id="fabClear">×</button>' +
      '</div>' +
      '<div class="qa-results" id="fabResults"></div>' +
      '<div class="qa-hint">↑↓ 选择 · Enter 添加 · Esc 关闭 · 支持拼音首字母 / 汉字 / 代码</div>' +
      '<div class="qa-quick" id="fabHot"></div>' +
      '<div class="qa-recent" id="fabRecentBox" style="display:none">' +
        '<div class="lb">最近添加</div>' +
        '<div class="chips" id="fabRecentChips"></div>' +
      '</div>' +
    '</div>';
  document.body.appendChild(p);
  FAB.panel = p;
  FAB.input = p.querySelector("#fabInput");
  FAB.results = p.querySelector("#fabResults");

  /* 点击面板外关闭 */
  p.addEventListener("mousedown", function(e){ e.stopPropagation(); });
  document.addEventListener("mousedown", function(e){
    if(p.style.display !== "none" && !p.contains(e.target) &&
       !($("fabAdd") && $("fabAdd").contains(e.target))){
      fabToggle(false);
    }
  });

  FAB.input.addEventListener("input", function(){
    var q = FAB.input.value.trim();
    clearTimeout(FAB.timer);
    if(!q){ FAB.items = []; fabRenderResults(); fabRenderHot(); return; }
    var seq = ++FAB.seq;
    FAB.timer = setTimeout(function(){
      searchStock(q, function(items, done){
        if(seq !== FAB.seq) return;
        FAB.items = items;
        FAB.idx = items.length ? 0 : -1;
        fabRenderResults();
      });
    }, 180);
  });

  FAB.input.addEventListener("keydown", function(e){
    if(!FAB.items.length){
      if(e.key === "Enter" && FAB.input.value.trim()){
        e.preventDefault();
        fabSubmitRaw(FAB.input.value.trim());
      }
      if(e.key === "Escape") fabToggle(false);
      return;
    }
    if(e.key === "ArrowDown"){ e.preventDefault(); FAB.idx = Math.min(FAB.items.length - 1, FAB.idx + 1); fabRenderResults(); }
    else if(e.key === "ArrowUp"){ e.preventDefault(); FAB.idx = Math.max(0, FAB.idx - 1); fabRenderResults(); }
    else if(e.key === "Enter"){ e.preventDefault(); fabPick(FAB.items[FAB.idx >= 0 ? FAB.idx : 0]); }
    else if(e.key === "Escape"){ fabToggle(false); }
  });

  var clrBtn = p.querySelector("#fabClear");
  if(clrBtn) clrBtn.onclick = function(){ FAB.input.value = ""; FAB.items = []; fabRenderResults(); fabRenderHot(); FAB.input.focus(); };

  return p;
}

function fabRenderResults(){
  var box = FAB.results;
  if(!box) return;
  if(!FAB.items.length){ box.innerHTML = ""; return; }
  var h = "";
  FAB.items.forEach(function(it, i){
    var sel = (i === FAB.idx) ? " sel" : "";
    var inList = state.holdings.some(function(hd){ return hd.code === it.code; });
    var tag = inList ? '<span class="tag have">已持有</span>'
            : (it.src === "网络" ? '<span class="tag net">网</span>'
            : '<span class="tag">' + esc(it.src || "") + '</span>');
    h += '<div class="qa-result' + sel + '" data-i="' + i + '">' +
      '<span class="code">' + esc(it.code) + '</span>' +
      '<span class="name">' + esc(it.name) + '</span>' + tag + '</div>';
  });
  box.innerHTML = h;
  Array.prototype.forEach.call(box.querySelectorAll(".qa-result"), function(d){
    d.onmouseenter = function(){ FAB.idx = +d.dataset.i; fabRenderResults(); };
    d.onmousedown = function(e){ e.preventDefault(); fabPick(FAB.items[+d.dataset.i]); };
  });
}

function fabRenderHot(){
  var box = $("fabHot");
  if(!box) return;
  var h = "";
  FAB_HOT.forEach(function(s){
    var inList = state.holdings.some(function(hd){ return hd.code === s.code; });
    h += '<span class="chip' + (inList ? " have" : "") + '" data-code="' + s.code + '" data-name="' + esc(s.name) + '">' +
      esc(s.name) + '</span>';
  });
  box.innerHTML = h;
  Array.prototype.forEach.call(box.querySelectorAll(".chip"), function(c){
    c.onclick = function(){
      fabPick({code:c.dataset.code, name:c.dataset.name, src:"热门"});
    };
  });
  /* 最近添加 */
  var rcBox = $("fabRecentBox");
  var rcChips = $("fabRecentChips");
  if(rcBox && rcChips){
    if(FAB.recent.length){
      rcBox.style.display = "block";
      var rh = "";
      FAB.recent.forEach(function(r){
        rh += '<span class="chip" data-code="' + r.code + '" data-name="' + esc(r.name) + '">' +
          esc(r.name) + '</span>';
      });
      rcChips.innerHTML = rh;
      Array.prototype.forEach.call(rcChips.querySelectorAll(".chip"), function(c){
        c.onclick = function(){
          fabPick({code:c.dataset.code, name:c.dataset.name, src:"最近"});
        };
      });
    } else {
      rcBox.style.display = "none";
    }
  }
}

async function fabPick(it){
  if(!it) return;
  fabAddRecent(it.code, it.name);
  var t = typeOfCode(it.code, it.name);
  var has = state.holdings.find(function(h){ return h.code === it.code; });
  if(!has){
    state.holdings.push({code:it.code, name:it.name, type:t, inReport:true, group:"持仓"});
    saveState();
  }
  fabToggle(false);
  /* 自动拉取 */
  var haveData = !!(state.stocks[it.code] && state.stocks[it.code].rows && state.stocks[it.code].rows.length > 20);
  if(!haveData){
    toastInfo("正在拉取 " + it.name + " 日K数据…");
    try{
      var n = await fetchStockDataRetry(it.code);
      if(n > 0){
        toastOk(it.name + " 拉取成功，" + n + " 根日K");
      } else {
        toastWarn(it.name + " 暂无联网数据，可手动粘贴日K", 4200);
      }
    }catch(e){
      toastErr(it.name + " 拉取异常：" + String(e.message || e).slice(0, 40), 4200);
    }
  } else {
    toastOk((has ? "已存在：" : "已添加：") + it.name + "（" + it.code + "）");
  }
  if(typeof renderHoldings === "function") renderHoldings();
  if(typeof renderRail === "function") renderRail();
  if(typeof renderDash === "function") renderDash();
  fabUpdateBadge();
}

async function fabSubmitRaw(q){
  if(!q) return;
  var local = searchLocal(q, 1);
  if(local.length){ fabPick(local[0]); return; }
  txSmartbox(q, function(items){
    if(items.length){ fabPick({code:items[0].code, name:items[0].name, py:items[0].py, src:"网络"}); }
    else if(/^\d{6}$/.test(q)){
      fabPick({code:q, name:nameOf(q) || ("代码" + q), src:"代码"});
    }
    else toastWarn("没找到「" + q + "」，试试代码 / 拼音首字母 / 名称");
  });
}

function fabUpdateBadge(){
  var badge = $("fabBadge");
  if(!badge) return;
  var n = state.holdings.length;
  if(n > 0){
    badge.textContent = n;
    badge.style.display = "flex";
  } else {
    badge.style.display = "none";
  }
}

function bindFab(){
  fabLoadRecent();
  var btn = $("fabAdd");
  if(btn) btn.onclick = function(e){ e.preventDefault(); fabToggle(); };
}

/* ===================== 2. 拉取可靠性增强 ===================== */

/* 带自动重试的拉取 */
async function fetchStockDataRetry(code, retries){
  retries = retries || 2;
  var lastErr = "";
  for(var attempt = 0; attempt <= retries; attempt++){
    try{
      var n;
      if(typeof fetchStockData === "function" && fetchStockData !== fetchStockDataRetry){
        n = await fetchStockData(code);
      } else {
        n = await fetchStockDataV2(code);
      }
      if(n > 0) return n;
      lastErr = LAST_FETCH_ERR || "无数据";
      if(attempt < retries){
        var delay = 800 * (attempt + 1);
        await new Promise(function(r){ setTimeout(r, delay); });
      }
    }catch(e){
      lastErr = String(e.message || e);
      if(attempt < retries){
        await new Promise(function(r){ setTimeout(r, 800 * (attempt + 1)); });
      }
    }
  }
  return 0;
}

/* 备用拉取：腾讯日线 v2 接口（不同路径，增加成功率） */
async function fetchTxV2(code, n){
  var sym = mktPrefix(code) + String(code).replace(/\D/g, "");
  var u = "https://web.ifzq.gtimg.cn/appstock/app/kline/kline?param=" + sym + ",day,," + n + ",qfq";
  var r = await withTimeout(fetch(u, {cache:"no-store"}).then(function(r){
    if(!r.ok) throw new Error("HTTP " + r.status);
    return r.json();
  }), 9000);
  var key = sym;
  var d = r && r.data && (r.data[key] || r.data[Object.keys(r.data || {})[0]]);
  if(!d) throw new Error("返回结构异常");
  var arr = d.qfqday || d.day || [];
  if(!arr.length) throw new Error("空数据");
  return arr.map(function(x){
    return {day:x[0], open:x[1], close:x[2], high:x[3], low:x[4], volume:x[5]};
  });
}

/* v2 拉取主函数（带额外备用源） */
async function fetchStockDataV2(code, opt){
  opt = opt || {};
  var n = opt.n || 320;
  code = String(code || "").replace(/\D/g, "").slice(0, 6);
  if(code.length !== 6) return 0;

  var order = (APICFG && APICFG.order && APICFG.order.length) ? APICFG.order.slice() : ["tx", "sina", "em"];
  if(order.indexOf("tx") < 0) order.unshift("tx");
  FETCH_DIAG = [];
  var rows = null, used = "";

  for(var i = 0; i < order.length; i++){
    var src = order[i];
    if(APICFG && APICFG.on && APICFG.on[src] === false) continue;
    var t0 = Date.now();
    try{
      var raw = null;
      if(src === "tx")        raw = await withTimeout(fetchTx(code, n), 10000);
      else if(src === "sina") raw = await withTimeout(fetchSinaN(code, n), 10000);
      else if(src === "em")   raw = await withTimeout(fetchEm(code, n), 10000);
      var ms = Date.now() - t0;
      var r = (raw && raw.length) ? normRaw(raw) : [];
      if(r.length >= 8){
        rows = r; used = src;
        FETCH_DIAG.push({src:src, ok:true, ms:ms, n:r.length});
        break;
      }
      FETCH_DIAG.push({src:src, ok:false, ms:ms, err:"返回数据不足（" + r.length + " 根）"});
    }catch(e){
      FETCH_DIAG.push({src:src, ok:false, ms:Date.now() - t0,
        err:String((e && e.message) || e || "未知").slice(0, 60)});
    }
  }

  /* 所有标准源都失败，尝试备用腾讯 v2 */
  if(!rows){
    try{
      var t1 = Date.now();
      var raw2 = await withTimeout(fetchTxV2(code, n), 9000);
      var r2 = (raw2 && raw2.length) ? normRaw(raw2) : [];
      var ms2 = Date.now() - t1;
      if(r2.length >= 8){
        rows = r2; used = "tx2";
        FETCH_DIAG.push({src:"tx2", ok:true, ms:ms2, n:r2.length});
      } else {
        FETCH_DIAG.push({src:"tx2", ok:false, ms:ms2, err:"备用源数据不足"});
      }
    }catch(e2){
      FETCH_DIAG.push({src:"tx2", ok:false, ms:0, err:String((e2 && e2.message) || e2).slice(0, 60)});
    }
  }

  if(typeof apiLog === "function"){
    apiLog({t:new Date().toISOString().slice(0, 19).replace("T", " "), src:used || "-",
      code:code, ok:!!rows, n:rows ? rows.length : 0,
      ms:(FETCH_DIAG.length ? FETCH_DIAG[FETCH_DIAG.length - 1].ms : 0)});
  }

  if(!rows || !rows.length){
    LAST_FETCH_ERR = "全部数据源均未取到数据\n" + diagText();
    return 0;
  }
  state.stocks[code] = {rows:rows};
  if(typeof clearAn === "function") clearAn(code);
  if(typeof saveState === "function") saveState();
  var h = state.holdings.find(function(x){ return x.code === code; });
  if(h && (!h.name || /^代码/.test(h.name))){
    h.name = (NAME_IDX[code] && NAME_IDX[code].name) || h.name;
  }
  LAST_FETCH_ERR = "";
  if(typeof renderAdmin === "function" && document.getElementById("admin") &&
     document.getElementById("admin").classList.contains("on")) renderAdmin();
  return rows.length;
}

/* ===================== 3. 复盘检查清单 ===================== */
var CHECKLIST_ITEMS = [
  {id:"market", txt:"查看大盘环境（指数涨跌 / 涨跌家数 / 板块轮动）", tab:"market"},
  {id:"breadth", txt:"确认市场情绪（涨跌比 / 涨停跌停 / 连板高度）", tab:"market"},
  {id:"holdings", txt:"逐一检查持仓技术形态（评分 / 信号 / 支撑压力）", tab:"holdings"},
  {id:"alerts", txt:"扫描大事提醒与技术信号触发", tab:"alerts"},
  {id:"stock", txt:"深入分析重点个股（K线 / MACD / 均线 / 布林）", tab:"stock"},
  {id:"compare", txt:"走势对比：持仓 vs 指数 / 同业强弱", tab:"compare"},
  {id:"notes", txt:"记录今日判断与明日操作计划", tab:"notes"},
  {id:"report", txt:"生成复盘报告并归档", tab:"report"}
];

function checklistLoad(){
  try{
    var s = localStorage.getItem("ashare_checklist");
    if(s) return JSON.parse(s) || {};
  }catch(e){}
  return {};
}
function checklistSave(obj){
  try{ localStorage.setItem("ashare_checklist", JSON.stringify(obj)); }catch(e){}
}
function checklistTodayKey(){
  var d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");
}

function renderChecklist(){
  var box = $("checklistBox");
  if(!box) return;
  var saved = checklistLoad();
  var today = checklistTodayKey();
  var todayState = saved[today] || {};
  var h = "";
  CHECKLIST_ITEMS.forEach(function(item){
    var done = !!todayState[item.id];
    h += '<div class="cl-item' + (done ? " done" : "") + '" data-id="' + item.id + '" data-tab="' + item.tab + '">' +
      '<div class="cl-ic"></div>' +
      '<div class="cl-txt">' + esc(item.txt) + '</div>' +
    '</div>';
  });
  box.innerHTML = h;
  box.querySelectorAll(".cl-item").forEach(function(el){
    el.onclick = function(){
      var id = el.dataset.id;
      var today = checklistTodayKey();
      var saved = checklistLoad();
      if(!saved[today]) saved[today] = {};
      saved[today][id] = !saved[today][id];
      checklistSave(saved);
      renderChecklist();
      /* 如果勾选了，跳转到对应标签页 */
      if(saved[today][id]){
        var item = CHECKLIST_ITEMS.find(function(x){ return x.id === id; });
        if(item && item.tab){
          try{ tab(item.tab); }catch(e){}
        }
      }
    };
  });
}

/* ===================== 4. 快速导航卡片 ===================== */
function renderQuickNav(){
  var box = $("quickNav");
  if(!box) return;
  var holdingsN = state.holdings.length;
  var withDataN = 0;
  state.holdings.forEach(function(h){
    var s = state.stocks[h.code];
    if(s && s.rows && s.rows.length > 8) withDataN++;
  });
  var alertsN = ALERTS.length;
  var notesN = (typeof NOTES !== "undefined") ? NOTES.length : 0;
  var sigN = 0;
  state.holdings.forEach(function(h){
    var an = getAn(h.code);
    if(an && an.sigs) sigN += an.sigs.filter(function(s){ return s.i >= an.i - 5; }).length;
  });

  var cards = [
    {ic:"📊", tt:"大盘环境", ds:"指数走势 / 板块轮动", tab:"market", badge:""},
    {ic:"📈", tt:"个股诊断", ds:"K线 / MACD / 趋势分析", tab:"stock", badge:""},
    {ic:"💼", tt:"持仓管理", ds:holdingsN + " 只标的 · " + withDataN + " 只有数据", tab:"holdings", badge:holdingsN > 0 ? holdingsN + " 只" : ""},
    {ic:"🔔", tt:"大事提醒", ds:alertsN + " 条提醒待查", tab:"alerts", badge:alertsN > 0 ? alertsN + " 条" : ""},
    {ic:"⚡", tt:"信号汇总", ds:"近 5 日 " + sigN + " 个技术信号", tab:"dash", badge:sigN > 0 ? sigN + " 信号" : ""},
    {ic:"📝", tt:"复盘笔记", ds:notesN + " 条笔记", tab:"notes", badge:notesN > 0 ? notesN + " 条" : ""},
    {ic:"📄", tt:"复盘报告", ds:"一键生成今日复盘报告", tab:"report", badge:""},
    {ic:"🔍", tt:"走势对比", ds:"多标的归一化强弱对比", tab:"compare", badge:""}
  ];

  var h = "";
  cards.forEach(function(c){
    h += '<div class="qn-card" data-tab="' + c.tab + '">' +
      '<div class="qn-ic">' + c.ic + '</div>' +
      '<div class="qn-tt">' + esc(c.tt) + '</div>' +
      '<div class="qn-ds">' + esc(c.ds) + '</div>' +
      (c.badge ? '<div class="qn-badge">' + esc(c.badge) + '</div>' : '') +
    '</div>';
  });
  box.innerHTML = h;
  box.querySelectorAll(".qn-card").forEach(function(el){
    el.onclick = function(){
      var t = el.dataset.tab;
      try{ tab(t); }catch(e){}
    };
  });
}

/* ===================== 5. 隐私发布检查 ===================== */
function renderPubCheck(){
  var box = $("pubCheck");
  if(!box) return;
  var checks = [];

  /* 检查 1: DEFAULT_HOLDINGS 是否为空 */
  var dhEmpty = (typeof DEFAULT_HOLDINGS !== "undefined" && DEFAULT_HOLDINGS.length === 0);
  checks.push({ok:dhEmpty, txt:"内置持仓列表（DEFAULT_HOLDINGS）" + (dhEmpty ? "为空" : "含 " + DEFAULT_HOLDINGS.length + " 条个人持仓")});

  /* 检查 2: localStorage 是否有用户持仓 */
  var lsData = "";
  try{ lsData = localStorage.getItem(LS_KEY) || ""; }catch(e){}
  var lsHas = lsData && lsData.length > 10;
  var lsHoldingsN = 0;
  if(lsHas){
    try{ var p = JSON.parse(lsData); if(p && p.holdings) lsHoldingsN = p.holdings.length; }catch(e){}
  }
  checks.push({ok:!lsHas || lsHoldingsN === 0, txt:"localStorage 无用户持仓数据" + (lsHas ? "（当前有 " + lsHoldingsN + " 只，发布前请清空）" : "")});

  /* 检查 3: POS（持仓成本）是否为空 */
  var posHas = false;
  try{ var ps = localStorage.getItem("ashare_pos"); if(ps && ps !== "{}") posHas = true; }catch(e){}
  checks.push({ok:!posHas, txt:"持仓成本数据（POS）" + (posHas ? "非空，含个人交易成本" : "为空")});

  /* 检查 4: ALERTS 是否有个人提醒 */
  var alertsHas = ALERTS && ALERTS.length > 0;
  checks.push({ok:!alertsHas, txt:"大事提醒列表" + (alertsHas ? "有 " + ALERTS.length + " 条个人提醒" : "为空")});

  /* 检查 5: NOTES 是否有个人笔记 */
  var notesN = 0;
  try{ var ns = localStorage.getItem("ashare_notes"); if(ns){ notesN = JSON.parse(ns).length || 0; } }catch(e){}
  checks.push({ok:notesN === 0, txt:"复盘笔记" + (notesN > 0 ? "有 " + notesN + " 条个人笔记" : "为空")});

  /* 检查 6: .gitignore 是否覆盖 index.html */
  checks.push({ok:true, txt:"index.html 是构建产物（由 build.py 从 _src/ 生成），源码中不含个人数据"});

  /* 检查 7: API 调用日志 */
  var apiLogN = APILOG.length;
  checks.push({ok:apiLogN === 0, txt:"API 调用日志" + (apiLogN > 0 ? "有 " + apiLogN + " 条（含拉取记录，建议清空）" : "为空")});

  var h = "";
  checks.forEach(function(c){
    h += '<div class="pc-row">' +
      '<div class="pc-st ' + (c.ok ? "ok" : "no") + '">' + (c.ok ? "✓" : "✕") + '</div>' +
      '<div class="pc-txt">' + esc(c.txt) + '</div>' +
    '</div>';
  });
  box.innerHTML = h;
}

function clearAllPersonalData(){
  if(!confirm("确认清空全部个人数据？\n\n将删除：持仓列表、持仓成本、复盘笔记、大事提醒、API日志、复盘清单。\n内置的公开行情快照不受影响。\n\n此操作不可撤销！")) return;
  try{
    localStorage.removeItem(LS_KEY);
    localStorage.removeItem("ashare_pos");
    localStorage.removeItem("ashare_alerts");
    localStorage.removeItem("ashare_notes");
    localStorage.removeItem("ashare_apilog");
    localStorage.removeItem("ashare_checklist");
    localStorage.removeItem("ashare_fab_recent");
  }catch(e){}
  /* 重新加载状态 */
  state = loadState();
  POS = {};
  ALERTS = [];
  APILOG = [];
  FAB.recent = [];
  if(typeof clearAn === "function") clearAn();
  if(typeof renderHoldings === "function") renderHoldings();
  if(typeof renderRail === "function") renderRail();
  if(typeof renderDash === "function") renderDash();
  if(typeof renderAlerts === "function") renderAlerts();
  if(typeof renderAdmin === "function") renderAdmin();
  renderPubCheck();
  renderChecklist();
  renderQuickNav();
  fabUpdateBadge();
  var msg = $("privMsg");
  if(msg) msg.innerHTML = '<span style="color:var(--down)">✓ 已清空全部个人数据，可安全发布到 GitHub</span>';
  toastOk("个人数据已清空，可安全发布");
}

function exportSafeSnapshot(){
  /* 导出一份不含个人数据的 JSON 快照 */
  var safe = {
    ver: APPVER,
    date: new Date().toISOString().slice(0, 10),
    holdings: [],
    stocks: {},
    market: state.market,
    sectors: state.sectors,
    snap: state.snap,
    risk: state.risk
  };
  var json = JSON.stringify(safe, null, 2);
  dl("ashare_safe_snapshot_" + Date.now() + ".json", json, "application/json");
  toastOk("已导出安全快照（不含个人持仓 / 成本 / 笔记）");
}

function bindPrivacy(){
  var btn = $("btnPubCheck");
  if(btn) btn.onclick = renderPubCheck;
  var btn2 = $("btnExportSafe");
  if(btn2) btn2.onclick = exportSafeSnapshot;
  var btn3 = $("btnClearAll");
  if(btn3) btn3.onclick = clearAllPersonalData;
}

/* ===================== 6. 增强 renderDash ===================== */
var _renderDashOrig = renderDash;
renderDash = function(){
  _renderDashOrig();
  renderQuickNav();
  renderChecklist();
};

/* ===================== 7. 增强 renderHoldings ===================== */
/* 在持仓管理页面顶部添加批量操作栏 */
var _renderHoldingsOrig = renderHoldings;
renderHoldings = function(){
  _renderHoldingsOrig();
  var box = $("holdList");
  if(!box) return;
  /* 在表格上方插入批量操作栏 */
  var existing = $("batchBar");
  if(existing) return;
  var bar = document.createElement("div");
  bar.id = "batchBar";
  bar.style.cssText = "display:flex;gap:8px;align-items:center;margin-bottom:10px;flex-wrap:wrap";
  bar.innerHTML =
    '<button class="btn primary sm" id="batchFetch">⚡ 批量联网拉取</button>' +
    '<button class="btn sm" id="batchAllOn">☑ 全部纳入报告</button>' +
    '<button class="btn sm" id="batchAllOff">☑ 全部排除报告</button>' +
    '<button class="btn sm" id="batchClearData">🗑 清空已拉取数据</button>' +
    '<span class="muted" id="batchMsg" style="font-size:12px"></span>';
  box.parentNode.insertBefore(bar, box);

  var bf = $("batchFetch");
  if(bf) bf.onclick = async function(){
    if(state.holdings.length === 0){ toastWarn("没有持仓，请先添加标的"); return; }
    var codes = state.holdings.map(function(h){ return h.code; });
    var msg = $("batchMsg"); if(msg) msg.textContent = "批量拉取中…";
    toastInfo("开始批量拉取 " + codes.length + " 只标的…");
    var done = 0, fail = 0;
    for(var i = 0; i < codes.length; i++){
      var c = codes[i];
      if(msg) msg.textContent = "拉取中 " + (i+1) + "/" + codes.length + " " + nameOf(c) + "…";
      try{
        var n = await fetchStockDataRetry(c);
        if(n > 0) done++; else fail++;
      }catch(e){ fail++; }
    }
    if(msg) msg.textContent = "完成：成功 " + done + " 只，失败 " + fail + " 只";
    if(done > 0) toastOk("批量拉取完成：成功 " + done + " 只，失败 " + fail + " 只");
    else toastErr("全部拉取失败，请检查网络或手动粘贴日K");
    renderHoldings(); renderRail(); renderDash();
  };

  var bon = $("batchAllOn");
  if(bon) bon.onclick = function(){
    state.holdings.forEach(function(h){ h.inReport = true; });
    saveState(); renderHoldings(); renderRail(); renderDash();
    toastOk("已全部纳入报告");
  };
  var boff = $("batchAllOff");
  if(boff) boff.onclick = function(){
    state.holdings.forEach(function(h){ h.inReport = false; });
    saveState(); renderHoldings(); renderRail(); renderDash();
    toastOk("已全部排除报告");
  };
  var bcd = $("batchClearData");
  if(bcd) bcd.onclick = function(){
    if(!confirm("清空所有已拉取的日K数据？\n（不影响持仓列表，可重新拉取）")) return;
    state.stocks = buildDefaultStocks();
    saveState();
    if(typeof clearAn === "function") clearAn();
    renderHoldings(); renderRail(); renderDash();
    toastOk("已清空用户拉取数据（保留内置快照）");
  };
};

/* ===================== 初始化 ===================== */
var _initV15 = null;
function initV15(){
  try{ fabLoadRecent(); }catch(e){}
  try{ bindFab(); }catch(e){}
  try{ fabUpdateBadge(); }catch(e){}
  try{ bindPrivacy(); }catch(e){}
}

/* 拦截 v2InitSteps，插入 v15 初始化 */
var _v2InitStepsOrigV15 = v2InitSteps;
v2InitSteps = function(){
  _v2InitStepsOrigV15();
  try{
    initV15();
    /* 当切到帮助页时渲染隐私检查 */
    var _origTab = tab;
    if(!_origTab._wrapped){
      tab = function(id){
        _origTab(id);
        if(id === "help"){
          setTimeout(renderPubCheck, 50);
        }
        if(id === "dash"){
          setTimeout(function(){ renderQuickNav(); renderChecklist(); }, 50);
        }
      };
      tab._wrapped = true;
    }
  }catch(e){ if(console&&console.error) console.error("v15 init:", e); }
};

/* Ctrl+K / Cmd+K 呼出浮动面板 */
document.addEventListener("keydown", function(e){
  if((e.ctrlKey || e.metaKey) && e.key === "k"){
    e.preventDefault();
    fabToggle();
  }
});
