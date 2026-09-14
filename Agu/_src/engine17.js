/* ============================================================
   engine17 · 个股诊断增强：该股提醒 / 快速操作 / 复盘打磨
   ============================================================ */

/* ===================== 1. 该股大事提醒 ===================== */
function renderStockAlerts(code){
  var box = $("stockAlertList");
  if(!box) return;
  var list = ALERTS.filter(function(a){ return a.code === code; });
  if(!list.length){
    box.innerHTML = '<div class="empty" style="padding:14px">该股暂无提醒。在下方添加价格上破 / 下破 / 涨跌 / 日期 / 自定义事项。</div>';
    return;
  }
  var an = getAn(code);
  var cur = an ? f2(an.close) : "无数据";
  var h = "";
  list.forEach(function(a){
    var idx = ALERTS.indexOf(a);
    var cond = "";
    if(a.type === "above") cond = "收盘 ≥ " + f2(a.val) + "（现价 " + cur + "）";
    else if(a.type === "below") cond = "收盘 ≤ " + f2(a.val) + "（现价 " + cur + "）";
    else if(a.type === "chg") cond = "单日涨跌 ≥ ±" + Number(a.val).toFixed(2) + "%";
    else if(a.type === "date") cond = "到期 " + esc(a.val);
    else cond = esc(a.val);

    h += '<div class="alertrow ' + (a.hit ? "hit" : "") + '">' +
      '<div style="padding-top:2px">' + (a.hit ? "🔔" : "⏳") + '</div>' +
      '<div class="txt"><div class="tt">' +
        '<span class="pbadge">' + alertTypeTxt(a.type) + '</span>' +
        (a.hit ? ' <span class="pbadge ok">已触发</span>' : '') +
        '</div>' +
      '<div class="ds">' + cond + (a.hitInfo ? '　<b style="color:#ffd48a">' + esc(a.hitInfo) + '</b>' : '') + '</div></div>' +
      '<button class="btn sm" data-sa-read="' + idx + '">已读</button>' +
      '<button class="btn sm danger" data-sa-del="' + idx + '">删</button>' +
      '</div>';
  });
  box.innerHTML = h;
  box.querySelectorAll("[data-sa-del]").forEach(function(b){
    b.onclick = function(){
      ALERTS.splice(+b.dataset.saDel, 1);
      alertSave();
      renderStockAlerts(code);
      renderAlerts();
    };
  });
  box.querySelectorAll("[data-sa-read]").forEach(function(b){
    b.onclick = function(){
      var a = ALERTS[+b.dataset.saRead];
      if(a){ a.hit = false; a.hitInfo = ""; }
      alertSave();
      renderStockAlerts(code);
      renderAlerts();
    };
  });
}

function bindStockAlertAdd(){
  var btn = $("saAdd");
  if(!btn) return;
  btn.onclick = function(){
    var code = ($("stockCode").value || "").trim();
    if(!code){ toastWarn("请先选择标的"); return; }
    var name = ($("stockName").value || "").trim() || nameOf(code);
    var type = $("saType").value;
    var val = $("saVal").value.trim();
    var price = $("saPrice").value.trim();

    /* 价格类型用 price 输入框 */
    if(type === "above" || type === "below"){
      val = price;
    }
    if(!val){ toastWarn("请输入提醒值"); return; }

    ALERTS.unshift({code:code, name:name, type:type, val:val, hit:false, hitInfo:""});
    alertSave();
    renderStockAlerts(code);
    renderAlerts();
    $("saVal").value = "";
    $("saPrice").value = "";
    toastOk("提醒已添加：" + name + " " + alertTypeTxt(type) + " " + val);
  };

  /* 类型切换时调整输入框 */
  var sel = $("saType");
  if(sel) sel.onchange = function(){
    var v = sel.value;
    var pi = $("saPrice");
    var vi = $("saVal");
    if(v === "above" || v === "below"){
      if(pi) pi.placeholder = "价格";
      if(vi) vi.placeholder = "（可选备注）";
    } else if(v === "chg"){
      if(pi) pi.placeholder = "—";
      if(vi) vi.placeholder = "如 3.5 表示 ±3.5%";
    } else if(v === "date"){
      if(pi) pi.placeholder = "—";
      if(vi) { vi.type = "date"; vi.placeholder = "选择日期"; }
    } else {
      if(pi) pi.placeholder = "—";
      if(vi) { vi.type = "text"; vi.placeholder = "自定义事项"; }
    }
  };
}

/* ===================== 2. 快速操作栏 ===================== */
function bindStockActions(){
  var compare = $("saCompare");
  if(compare) compare.onclick = function(){
    var code = ($("stockCode").value || "").trim();
    if(!code){ toastWarn("请先选择标的"); return; }
    var name = ($("stockName").value || "").trim() || nameOf(code);
    /* 加入走势对比 */
    if(typeof CMP_CODES !== "undefined" && CMP_CODES.indexOf(code) < 0){
      CMP_CODES.push(code);
      try{ localStorage.setItem("ashare_cmp", JSON.stringify(CMP_CODES)); }catch(e){}
    }
    toastOk(name + " 已加入走势对比");
    tab("compare");
  };

  var note = $("saNote");
  if(note) note.onclick = function(){
    var code = ($("stockCode").value || "").trim();
    var name = ($("stockName").value || "").trim() || nameOf(code);
    tab("notes");
    setTimeout(function(){
      /* 尝试在笔记页选中该标的 */
      var sel = $("noteCode");
      if(sel){ sel.value = code; }
      var inp = $("noteTitle");
      if(inp){ inp.value = name + " 复盘"; inp.focus(); }
    }, 100);
  };

  var report = $("saReport");
  if(report) report.onclick = function(){
    var code = ($("stockCode").value || "").trim();
    if(!code){ toastWarn("请先选择标的"); return; }
    var h = state.holdings.find(function(x){ return x.code === code; });
    if(h){
      h.inReport = true;
      saveState();
      toastOk(h.name + " 已纳入复盘报告");
    } else {
      toastWarn("该标的不在持仓列表中，请先添加");
    }
  };

  var refresh = $("saRefresh");
  if(refresh) refresh.onclick = async function(){
    var code = ($("stockCode").value || "").trim();
    if(!code){ toastWarn("请先选择标的"); return; }
    toastInfo("正在重新拉取 " + nameOf(code) + "…");
    try{
      var n;
      if(typeof fetchStockDataRetry === "function"){
        n = await fetchStockDataRetry(code);
      } else {
        n = await fetchStockData(code);
      }
      if(n > 0){
        toastOk(nameOf(code) + " 拉取成功，" + n + " 根日K");
        loadCurrent();
      } else {
        toastWarn(nameOf(code) + " 拉取失败，可手动粘贴日K", 4200);
      }
    }catch(e){
      toastErr("拉取异常：" + String(e.message || e).slice(0, 40), 4200);
    }
  };
}

/* ===================== 3. 左侧 rail 增强：显示信号标记 ===================== */
var _renderRailOrigV17 = null;
function patchRail(){
  if(_renderRailOrigV17) return;
  if(typeof renderRail !== "function") return;
  _renderRailOrigV17 = renderRail;
  renderRail = function(){
    _renderRailOrigV17();
    /* 在每个 rail 项上添加信号标记 */
    var box = $("railList");
    if(!box) return;
    box.querySelectorAll(".it").forEach(function(el){
      var code = el.dataset.c;
      if(!code) return;
      var an = getAn(code);
      if(!an || !an.sigs) return;
      var recent = an.sigs.filter(function(s){ return s.i >= an.i - 3; });
      if(!recent.length) return;
      /* 如果还没有信号标记 */
      if(el.querySelector(".sig-mark")) return;
      var rt = el.querySelector(".rt");
      if(!rt) return;
      var mark = document.createElement("div");
      mark.className = "sig-mark";
      mark.style.cssText = "position:absolute;top:4px;right:4px;width:6px;height:6px;border-radius:50%";
      var lastSig = recent[recent.length - 1];
      mark.style.background = lastSig.side === "b" ? "var(--down)" : (lastSig.side === "s" ? "var(--up)" : "var(--muted2)");
      mark.title = lastSig.nm + " " + (lastSig.date || "");
      el.style.position = "relative";
      el.appendChild(mark);
    });
  };
}

/* ===================== 4. 增强复盘报告：显示该股提醒 ===================== */
var _renderReportStockOrig = null;
function patchReportStock(){
  /* 在报告的每个标的区块末尾追加该股提醒 */
  if(typeof renderReportStock !== "function") return;
  _renderReportStockOrig = renderReportStock;
  renderReportStock = function(hd, an){
    var html = _renderReportStockOrig(hd, an);
    /* 追加该股提醒 */
    var list = ALERTS.filter(function(a){ return a.code === hd.code; });
    if(list.length){
      html += '<h4>🔔 该股提醒</h4><ul>';
      list.forEach(function(a){
        var cond = "";
        if(a.type === "above") cond = "收盘 ≥ " + f2(a.val);
        else if(a.type === "below") cond = "收盘 ≤ " + f2(a.val);
        else if(a.type === "chg") cond = "单日涨跌 ≥ ±" + a.val + "%";
        else if(a.type === "date") cond = "到期 " + a.val;
        else cond = a.val;
        html += "<li>" + alertTypeTxt(a.type) + "：" + esc(cond) + (a.hit ? "（已触发）" : "") + "</li>";
      });
      html += "</ul>";
    }
    return html;
  };
}

/* ===================== 5. 信号面板增强：信号统计摘要 ===================== */
function renderSignalSummary(){
  /* 在信号列表上方添加摘要 */
  var box = $("sigList");
  if(!box) return;
  var an = CUR.an;
  if(!an || !an.sigs) return;

  var existing = $("sigSummary");
  if(existing) existing.remove();

  var all = an.sigs;
  var bull = all.filter(function(s){ return s.side === "b"; }).length;
  var bear = all.filter(function(s){ return s.side === "s"; }).length;
  var neu = all.filter(function(s){ return s.side !== "b" && s.side !== "s"; }).length;
  var recent5 = all.filter(function(s){ return s.i >= an.i - 5; }).length;
  var recent20 = all.filter(function(s){ return s.i >= an.i - 20; }).length;

  var div = document.createElement("div");
  div.id = "sigSummary";
  div.style.cssText = "display:flex;gap:10px;flex-wrap:wrap;margin-bottom:8px;padding:8px 10px;border:1px solid var(--line);border-radius:8px;background:rgba(255,255,255,.02)";
  div.innerHTML =
    '<span style="font-size:12px;color:var(--muted)">信号统计：</span>' +
    '<span class="chip up" style="font-size:11px">多头 ' + bull + '</span>' +
    '<span class="chip down" style="font-size:11px">空头 ' + bear + '</span>' +
    '<span class="chip neu" style="font-size:11px">中性 ' + neu + '</span>' +
    '<span style="font-size:11px;color:var(--muted2)">近5日 ' + recent5 + ' 个 · 近20日 ' + recent20 + ' 个</span>';

  box.parentNode.insertBefore(div, box);
}

/* ===================== 6. 持仓表格增强：高亮有信号的行 ===================== */
function highlightSignalRows(){
  var box = $("holdList");
  if(!box) return;
  var rows = box.querySelectorAll("tbody tr");
  rows.forEach(function(tr){
    var hi = tr.querySelector("[data-hi]");
    if(!hi) return;
    var idx = +hi.dataset.hi;
    var hd = state.holdings[idx];
    if(!hd) return;
    var an = getAn(hd.code);
    if(!an || !an.sigs) return;
    var hasRecent = an.sigs.some(function(s){ return s.i >= an.i - 3; });
    if(hasRecent){
      tr.style.boxShadow = "inset 3px 0 0 var(--accent)";
    }
  });
}

/* ===================== 初始化 ===================== */
var _initV17 = null;
function initV17(){
  try{ bindStockAlertAdd(); }catch(e){}
  try{ bindStockActions(); }catch(e){}
  try{ patchRail(); }catch(e){}
  try{ patchReportStock(); }catch(e){}
}

var _v2InitStepsOrigV17 = v2InitSteps;
v2InitSteps = function(){
  _v2InitStepsOrigV17();
  try{ initV17(); }catch(e){ if(console&&console.error) console.error("v17 init:", e); }
};

/* 在 renderDiag 之后渲染信号摘要 */
var _renderDiagOrigV17 = null;
function patchRenderDiag(){
  if(_renderDiagOrigV17) return;
  if(typeof renderDiag !== "function") return;
  _renderDiagOrigV17 = renderDiag;
  renderDiag = function(an){
    _renderDiagOrigV17(an);
    try{ renderSignalSummary(); }catch(e){}
  };
}

/* 在 renderHoldings 之后高亮信号行 */
var _renderHoldingsOrigV17 = null;
function patchHoldingsHighlight(){
  if(_renderHoldingsOrigV17) return;
  if(typeof renderHoldings !== "function") return;
  /* 等待其他 patch 完成后再 patch */
  _renderHoldingsOrigV17 = renderHoldings;
  renderHoldings = function(){
    _renderHoldingsOrigV17();
    try{ highlightSignalRows(); }catch(e){}
  };
}

/* 二次 patch（在 v15/v16 patch 之后） */
var _v2InitStepsOrigV17b = v2InitSteps;
v2InitSteps = function(){
  _v2InitStepsOrigV17b();
  try{
    patchRenderDiag();
    patchHoldingsHighlight();
  }catch(e){}
};
