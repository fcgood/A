/* ============================================================
   engine14 · v2.1 UI 增强
   Toast 通知 / 市场开盘状态 / 快捷键帮助 / 回到顶部 / 空状态 / URL hash
   ============================================================ */

/* ===================== Toast 通知系统 ===================== */
var TOAST_ICONS = {info:"i", success:"✓", warn:"!", error:"×"};
var TOAST_BAR_ANIM = null;

function toast(msg, type, duration){
  type = type || "info";
  duration = duration || 3200;
  var box = $("toastBox");
  if(!box) return;
  var el = document.createElement("div");
  el.className = "toast " + type;
  el.innerHTML =
    '<div class="ic">' + (TOAST_ICONS[type] || "i") + '</div>' +
    '<div class="bd">' + esc(msg) + '</div>' +
    '<div class="cls">×</div>' +
    '<div class="pb"><i></i></div>';
  box.appendChild(el);
  var remove = function(){
    if(el._removed) return;
    el._removed = 1;
    el.classList.add("out");
    if(el._timer) clearTimeout(el._timer);
    if(el._pbTimer) clearInterval(el._pbTimer);
    setTimeout(function(){ if(el.parentNode) el.parentNode.removeChild(el); }, 280);
  };
  el.querySelector(".cls").onclick = remove;
  el.onclick = function(e){ if(e.target.classList.contains("bd")) remove(); };
  el._timer = setTimeout(remove, duration);
  /* 进度条 */
  var pb = el.querySelector(".pb i");
  if(pb){
    var steps = 50, elapsed = 0;
    pb.style.width = "100%";
    el._pbTimer = setInterval(function(){
      elapsed += duration / steps;
      pb.style.width = Math.max(0, 100 - (elapsed / duration * 100)) + "%";
      if(el._removed) clearInterval(el._pbTimer);
    }, duration / steps);
  }
  /* 最多同时 5 条 */
  while(box.children.length > 5){
    var first = box.firstChild;
    if(first && first.classList) first.classList.add("out");
    if(first && first.parentNode) first.parentNode.removeChild(first);
  }
}

/* 便捷封装 */
function toastInfo(msg, d){ toast(msg, "info", d); }
function toastOk(msg, d){ toast(msg, "success", d); }
function toastWarn(msg, d){ toast(msg, "warn", d); }
function toastErr(msg, d){ toast(msg, "error", d || 4200); }

/* ===================== 市场开盘状态 ===================== */
function marketSessionStatus(){
  var now = new Date();
  var day = now.getDay();
  var h = now.getHours(), m = now.getMinutes();
  var mins = h * 60 + m;
  if(day === 0 || day === 6) return {state:"closed", label:"周末休市", countdown:""};
  if(mins >= 570 && mins < 690) return {state:"open", label:"早盘交易", countdown:formatCountdown(690 - mins, "午休")};
  if(mins >= 690 && mins < 780) return {state:"lunch", label:"午休中", countdown:formatCountdown(780 - mins, "开盘")};
  if(mins >= 780 && mins < 900) return {state:"open", label:"午盘交易", countdown:formatCountdown(900 - mins, "收盘")};
  if(mins >= 540 && mins < 570) return {state:"lunch", label:"盘前", countdown:formatCountdown(570 - mins, "开盘")};
  return {state:"closed", label:"休市", countdown:""};
}

function formatCountdown(mins, event){
  if(mins <= 0) return "";
  mins = Math.floor(mins);
  var h = Math.floor(mins / 60), m = mins % 60;
  if(h > 0) return h + ":" + String(m).padStart(2,"0") + " 后" + event;
  return m + " 分后" + event;
}

var _mktTimer = null;
function renderMarketBadge(){
  var badge = $("mktBadge");
  if(!badge) return;
  var s = marketSessionStatus();
  badge.className = "mkt-badge " + s.state;
  var lb = badge.querySelector(".lb");
  var cd = badge.querySelector(".cd");
  if(lb) lb.textContent = s.label;
  if(cd) cd.textContent = s.countdown ? "· " + s.countdown : "";
  badge.title = "A股交易时段：周一至周五 9:30-11:30 / 13:00-15:00";
}

function startMarketBadge(){
  renderMarketBadge();
  if(_mktTimer) clearInterval(_mktTimer);
  _mktTimer = setInterval(renderMarketBadge, 30000);
}

/* ===================== 快捷键帮助面板 ===================== */
var SHORTCUTS = [
  {section:"全局", items:[
    {keys:["Ctrl/⌘","K"], desc:"打开快捷搜索（标的 / 页面跳转）"},
    {keys:["?"], desc:"显示 / 隐藏快捷键帮助"},
    {keys:["Esc"], desc:"关闭弹窗 / 退出全屏"}
  ]},
  {section:"大盘走势工作台", items:[
    {keys:["1"], desc:"切换上证指数"},
    {keys:["2"], desc:"切换深证成指"},
    {keys:["3"], desc:"切换创业板指"},
    {keys:["["], desc:"缩小区间（20→60→120→全部）"},
    {keys:["]"], desc:"放大区间"},
    {keys:["Esc"], desc:"退出全屏走势图"}
  ]},
  {section:"导航", items:[
    {keys:["g","d"], desc:"仪表盘"},
    {keys:["g","m"], desc:"大盘环境"},
    {keys:["g","s"], desc:"个股诊断"},
    {keys:["g","h"], desc:"持仓管理"},
    {keys:["g","r"], desc:"复盘报告"}
  ]}
];

function renderShortcutPanel(){
  var grid = $("shortcutGrid");
  if(!grid) return;
  var h = "";
  SHORTCUTS.forEach(function(sec){
    h += '<div class="shortcut-section"><h4>' + esc(sec.section) + '</h4>';
    sec.items.forEach(function(it){
      var keys = it.keys.map(function(k, i){
        return (i > 0 ? '<span class="plus">+</span>' : "") + '<kbd>' + esc(k) + '</kbd>';
      }).join("");
      h += '<div class="shortcut-row"><span class="desc">' + esc(it.desc) + '</span><span class="keys">' + keys + '</span></div>';
    });
    h += '</div>';
  });
  h += '<div class="shortcut-section"><h4>提示</h4>' +
    '<div class="shortcut-row"><span class="desc">快捷键在输入框内不触发</span><span class="keys"><kbd>—</kbd></span></div>' +
    '<div class="shortcut-row"><span class="desc">按 <kbd style="display:inline">?</kbd> 随时呼出 / 关闭本面板</span><span class="keys"></span></div></div>';
  grid.innerHTML = h;
}

function toggleShortcutPanel(){
  var ov = $("shortcutOverlay");
  if(!ov) return;
  var show = ov.style.display === "none" || !ov.style.display;
  ov.style.display = show ? "flex" : "none";
  if(show) renderShortcutPanel();
}

function bindShortcutPanel(){
  var ov = $("shortcutOverlay");
  if(ov){
    ov.onclick = function(e){ if(e.target === ov) ov.style.display = "none"; };
  }
  var cls = $("shortcutClose");
  if(cls) cls.onclick = function(){ var o = $("shortcutOverlay"); if(o) o.style.display = "none"; };
  var navBtn = $("navShortcut");
  if(navBtn) navBtn.onclick = function(e){ e.preventDefault(); toggleShortcutPanel(); };
}

/* ===================== 回到顶部 ===================== */
function bindScrollTop(){
  var btn = $("scrollTop");
  if(!btn) return;
  window.addEventListener("scroll", function(){
    if(window.pageYOffset > 400) btn.classList.add("show");
    else btn.classList.remove("show");
  }, {passive:true});
  btn.onclick = function(){
    window.scrollTo({top:0, behavior:"smooth"});
  };
}

/* ===================== URL hash 路由 ===================== */
var TAB_IDS = ["dash","market","sector","stock","holdings","report","compare","notes","alerts","admin","help"];

function syncTabFromHash(){
  var h = (location.hash || "").replace("#","");
  if(TAB_IDS.indexOf(h) >= 0){
    try{ tab(h); }catch(e){}
  }
}

function bindHashChange(){
  window.addEventListener("hashchange", syncTabFromHash);
  /* 让 tab() 调用时也更新 hash */
  var _tabOrig = tab;
  tab = function(id){
    _tabOrig(id);
    try{ if(history && history.replaceState) history.replaceState(null, "", "#" + id); }catch(e){}
  };
}

/* ===================== g + 字母 导航 ===================== */
var _gPrefix = {active:false, timer:null};
function bindGNav(){
  document.addEventListener("keydown", function(e){
    if(!e || e.ctrlKey || e.metaKey || e.altKey) return;
    var a = document.activeElement;
    if(a && a.tagName && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)) return;
    /* ? 打开快捷键面板 */
    if(e.key === "?" || (e.shiftKey && e.key === "/")){
      var ov = $("shortcutOverlay");
      var vis = ov && ov.style.display !== "none" && ov.style.display !== "";
      if(vis){
        ov.style.display = "none";
      }else{
        toggleShortcutPanel();
      }
      e.preventDefault();
      return;
    }
    /* Esc 关闭快捷键面板 */
    if(e.key === "Escape"){
      var ov2 = $("shortcutOverlay");
      if(ov2 && ov2.style.display !== "none" && ov2.style.display !== ""){
        ov2.style.display = "none";
      }
    }
    /* g + 字母 导航 */
    if(e.key === "g" && !_gPrefix.active){
      _gPrefix.active = true;
      if(_gPrefix.timer) clearTimeout(_gPrefix.timer);
      _gPrefix.timer = setTimeout(function(){ _gPrefix.active = false; }, 1200);
      e.preventDefault();
      return;
    }
    if(_gPrefix.active){
      _gPrefix.active = false;
      if(_gPrefix.timer) clearTimeout(_gPrefix.timer);
      var map = {d:"dash", m:"market", s:"stock", h:"holdings", r:"report",
                 c:"compare", n:"notes", a:"alerts", p:"admin", e:"help"};
      var tgt = map[e.key.toLowerCase()];
      if(tgt){
        try{ tab(tgt); }catch(err){}
        e.preventDefault();
      }
      return;
    }
  });
}

/* ===================== 空状态渲染 ===================== */
function emptyStateHtml(icon, title, desc, ctaText, ctaAction){
  var h = '<div class="empty-state">';
  h += '<div class="ic">' + icon + '</div>';
  h += '<div class="tt">' + esc(title) + '</div>';
  if(desc) h += '<div class="ds">' + esc(desc) + '</div>';
  if(ctaText){
    h += '<div class="cta"><button class="btn primary sm" onclick="' + (ctaAction || "") + '">' + esc(ctaText) + '</button></div>';
  }
  h += '</div>';
  return h;
}

/* ===================== 数字滚动动画 ===================== */
function countUp(el, target, suffix, decimals){
  if(!el) return;
  suffix = suffix || "";
  decimals = decimals || 2;
  var start = 0, duration = 600, startTime = null;
  function step(ts){
    if(!startTime) startTime = ts;
    var p = Math.min(1, (ts - startTime) / duration);
    var ease = 1 - Math.pow(1 - p, 3);
    var val = start + (target - start) * ease;
    el.textContent = val.toFixed(decimals) + suffix;
    if(p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ===================== 增强 alert / confirm 提示 ===================== */
/* 不替换原有的 alert/confirm（因为同步逻辑），但在某些非关键位置提供 toast 替代 */
var _origAlert = window.alert;
window.alert = function(msg){
  /* 如果是简单提示信息，用 toast 替代 */
  if(typeof msg === "string" && msg.length < 120 && !msg.includes("\n")){
    toastInfo(msg);
    return;
  }
  _origAlert.call(window, msg);
};

/* ===================== 初始化 ===================== */
var _initV14 = null;
function initV14(){
  try{ startMarketBadge(); }catch(e){ if(console&&console.error) console.error("marketBadge:", e); }
  try{ bindShortcutPanel(); }catch(e){}
  try{ bindScrollTop(); }catch(e){}
  try{ bindGNav(); }catch(e){}
  try{ bindHashChange(); }catch(e){}
  try{ syncTabFromHash(); }catch(e){}
}

/* 拦截 v2InitSteps，在最后插入新功能 */
var _v2InitStepsOrig = v2InitSteps;
v2InitSteps = function(){
  _v2InitStepsOrig();
  try{ initV14(); }catch(e){ if(console&&console.error) console.error("v14 init:", e); }
  /* 延迟一帧，确保所有渲染完成后再显示欢迎 toast */
  setTimeout(function(){
    try{
      var s = marketSessionStatus();
      if(s.state === "open"){
        toastOk("A股" + s.label + "中，数据仅供参考");
      }else if(s.state === "lunch"){
        toastInfo("A股" + s.label + "中");
      }else{
        toastInfo("A股" + s.label + "，可离线复盘");
      }
    }catch(e){}
  }, 600);
};
