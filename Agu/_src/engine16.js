/* ============================================================
   engine16 · 复盘增强：市场脉搏 / 持仓异动 / 分组 / 复盘日记
   ============================================================ */

/* ===================== 1. 今日市场脉搏 ===================== */
function renderPulse(){
  var body = $("pulseBody");
  if(!body) return;
  var m = state.market || {};
  var snap = state.snap || {};
  var sectors = state.sectors || [];

  /* 指数数据 */
  var indices = [
    {lb:"上证指数", close:m.sh_close, chg:m.sh_chg, amt:m.sh_amt},
    {lb:"深证成指", close:m.sz_close, chg:m.sz_chg, amt:m.sz_amt},
    {lb:"创业板指", close:m.cy_close, chg:m.cy_chg, amt:m.cy_amt}
  ];

  var h = '<div class="pulse-grid">';
  indices.forEach(function(idx){
    var chg = num(idx.chg);
    var cls = chg > 0 ? "up" : (chg < 0 ? "down" : "flat");
    var arrow = chg > 0 ? "▲" : (chg < 0 ? "▼" : "—");
    h += '<div class="pulse-cell ' + cls + '">' +
      '<div class="pl-lb">' + idx.lb + '</div>' +
      '<div class="pl-vl">' + (idx.close ? f2(idx.close) : "—") + '</div>' +
      '<div class="pl-ex">' + arrow + ' ' + pct(idx.chg) + '</div>' +
    '</div>';
  });

  /* 涨跌家数 */
  var br = state.breadth || {};
  var upN = num(br.up) || 0, dnN = num(br.down) || 0, flatN = num(br.flat) || 0;
  var total = upN + dnN + flatN;
  var upRatio = total ? Math.round(upN / total * 100) : 0;
  h += '<div class="pulse-cell ' + (upN >= dnN ? "up" : "down") + '">' +
    '<div class="pl-lb">涨跌家数</div>' +
    '<div class="pl-vl">' + upN + ' / ' + dnN + '</div>' +
    '<div class="pl-ex">上涨占比 ' + upRatio + '%</div>' +
  '</div>';

  /* 涨停跌停 */
  var ztN = num(br.zt) || 0, dtN = num(br.dt) || 0;
  h += '<div class="pulse-cell ' + (ztN >= dtN ? "up" : "down") + '">' +
    '<div class="pl-lb">涨停 / 跌停</div>' +
    '<div class="pl-vl">' + ztN + ' / ' + dtN + '</div>' +
    '<div class="pl-ex">' + (ztN > 0 ? "赚钱效应偏强" : "—") + '</div>' +
  '</div>';

  h += '</div>';

  /* 板块 TOP */
  if(sectors.length){
    h += '<div style="margin-top:10px;font-size:12px;color:var(--muted2);margin-bottom:4px">板块领涨</div>';
    sectors.slice(0, 5).forEach(function(s){
      var c = num(s.chg);
      var cls = c > 0 ? "up" : (c < 0 ? "down" : "");
      h += '<div class="pulse-sec">' +
        '<span class="nm">' + esc(s.name) + '</span>' +
        '<span class="ch ' + cls + '">' + (c > 0 ? "+" : "") + f2(c) + '%</span>' +
        (s.leader ? '<span class="lb">' + esc(s.leader) + '</span>' : '') +
      '</div>';
    });
  }

  /* 资金快照 */
  var money = snap.money || [];
  if(money.length){
    h += '<div style="margin-top:8px;font-size:12px;color:var(--muted2);margin-bottom:4px">主力资金</div>';
    money.slice(0, 3).forEach(function(mf){
      h += '<div class="pulse-sec">' +
        '<span class="nm">' + esc(mf.name || mf.n || "") + '</span>' +
        '<span class="ch ' + (num(mf.net || mf.amt) > 0 ? "up" : "down") + '">' +
          (num(mf.net || mf.amt) > 0 ? "+" : "") + esc(String(mf.net || mf.amt || "")) + '</span>' +
      '</div>';
    });
  }

  body.innerHTML = h;

  /* 日期 */
  var dt = $("pulseDate");
  if(dt){
    var d = new Date();
    dt.textContent = d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");
  }
}

function bindPulse(){
  var btn = $("pulseRefresh");
  if(btn) btn.onclick = function(){
    if(typeof refreshMarket === "function"){
      refreshMarket();
    } else {
      try{ renderHeader(); }catch(e){}
    }
    setTimeout(renderPulse, 500);
  };
  var exp = $("pulseExpand");
  if(exp) exp.onclick = function(){
    var card = $("pulseCard");
    if(!card) return;
    card.classList.toggle("pulse-collapsed");
    exp.textContent = card.classList.contains("pulse-collapsed") ? "展开" : "收起";
  };
}

/* ===================== 2. 持仓异动监控 ===================== */
function renderChanges(){
  var body = $("changeBody");
  if(!body) return;
  if(!state.holdings.length){
    body.innerHTML = '<div class="chg-empty">还没有持仓。点击右下角 + 添加标的开始复盘。</div>';
    return;
  }

  var feed = [];
  state.holdings.forEach(function(hd){
    var an = getAn(hd.code);
    if(!an || !an.dates || !an.dates.length) return;
    var k = an.i, nm = hd.name || an.name || hd.code;

    /* 近 3 日技术信号 */
    if(an.sigs){
      an.sigs.filter(function(s){ return s.i >= k - 3; }).forEach(function(s){
        feed.push({
          type:"sig", code:hd.code, name:nm,
          icon: s.side === "b" ? "▲" : (s.side === "s" ? "▼" : "●"),
          text: s.nm + " — " + (s.ds || "").slice(0, 50),
          date: s.date || an.dates[s.i] || "",
          tag: s.side === "b" ? "多头" : (s.side === "s" ? "空头" : "中性")
        });
      });
    }

    /* 价格变动（最近一日） */
    if(an.closes && k >= 1){
      var chg = an.chg;
      if(Math.abs(num(chg)) >= 2){
        feed.push({
          type:"move", code:hd.code, name:nm,
          icon: chg > 0 ? "↑" : "↓",
          text: "单日" + (chg > 0 ? "上涨" : "下跌") + " " + pct(chg) + "（收 " + f2(an.close) + "）",
          date: an.dates[k] || "",
          tag: Math.abs(num(chg)) >= 5 ? "大波动" : "异动"
        });
      }
    }
  });

  /* 提醒触发 */
  ALERTS.forEach(function(a){
    if(a.hit){
      feed.push({
        type:"alert", code:a.code, name:a.name || a.code,
        icon:"!",
        text: alertTypeTxt(a.type) + " 已触发" + (a.hitInfo ? "：" + a.hitInfo : ""),
        date:"",
        tag:"提醒"
      });
    }
  });

  /* 按日期倒序 */
  feed.sort(function(a, b){
    return (b.date || "").localeCompare(a.date || "");
  });

  if(!feed.length){
    body.innerHTML = '<div class="chg-empty">近 3 日无异常信号 / 价格异动 / 提醒触发，组合平稳。</div>';
    return;
  }

  /* tab 筛选 */
  var h = '<div class="chg-tabs">' +
    '<span class="chg-tab active" data-filter="all">全部 ' + feed.length + '</span>' +
    '<span class="chg-tab" data-filter="sig">信号 ' + feed.filter(function(f){return f.type==="sig";}).length + '</span>' +
    '<span class="chg-tab" data-filter="move">异动 ' + feed.filter(function(f){return f.type==="move";}).length + '</span>' +
    '<span class="chg-tab" data-filter="alert">提醒 ' + feed.filter(function(f){return f.type==="alert";}).length + '</span>' +
  '</div>';

  h += '<div class="chg-feed" id="chgFeed">';
  feed.forEach(function(f){
    h += '<div class="chg-row ' + f.type + '" data-code="' + esc(f.code) + '" data-filter="' + f.type + '">' +
      '<div class="chg-ic">' + f.icon + '</div>' +
      '<div class="chg-nm">' + esc(f.name) + '</div>' +
      '<div class="chg-cd">' + esc(f.code) + '</div>' +
      '<div class="chg-tx">' + esc(f.text) + '</div>' +
      '<div class="chg-tag">' + esc(f.tag) + '</div>' +
      '<div class="chg-dt">' + esc(f.date) + '</div>' +
    '</div>';
  });
  h += '</div>';

  body.innerHTML = h;

  /* tab 事件 */
  body.querySelectorAll(".chg-tab").forEach(function(t){
    t.onclick = function(){
      body.querySelectorAll(".chg-tab").forEach(function(x){ x.classList.remove("active"); });
      t.classList.add("active");
      var f = t.dataset.filter;
      body.querySelectorAll(".chg-row").forEach(function(r){
        r.style.display = (f === "all" || r.dataset.filter === f) ? "" : "none";
      });
    };
  });

  /* 点击行跳转个股诊断 */
  body.querySelectorAll(".chg-row").forEach(function(r){
    r.onclick = function(){
      var code = r.dataset.code;
      try{ pickStock(code); tab("stock"); }catch(e){}
    };
  });
}

/* ===================== 3. 标的分组 ===================== */
var STOCK_GROUPS = ["持仓", "观察", "题材"];
var _grpActive = "全部";

function grpLoad(){
  try{
    var s = localStorage.getItem("ashare_groups");
    if(s) STOCK_GROUPS = JSON.parse(s) || ["持仓", "观察", "题材"];
  }catch(e){}
}
function grpSave(){
  try{ localStorage.setItem("ashare_groups", JSON.stringify(STOCK_GROUPS)); }catch(e){}
}

function renderGrpBar(){
  var bar = $("grpBar");
  if(!bar) return;
  var counts = {};
  counts["全部"] = state.holdings.length;
  STOCK_GROUPS.forEach(function(g){
    counts[g] = state.holdings.filter(function(h){ return h.group === g; }).length;
  });

  var h = '<span class="grp-chip' + (_grpActive === "全部" ? " active" : "") + '" data-grp="全部">全部<span class="cnt">' + (counts["全部"] || 0) + '</span></span>';
  STOCK_GROUPS.forEach(function(g){
    h += '<span class="grp-chip' + (_grpActive === g ? " active" : "") + '" data-grp="' + esc(g) + '">' + esc(g) + '<span class="cnt">' + (counts[g] || 0) + '</span></span>';
  });
  h += '<span class="grp-add" id="grpAdd">+ 新建分组</span>';
  bar.innerHTML = h;

  bar.querySelectorAll(".grp-chip").forEach(function(c){
    c.onclick = function(){
      _grpActive = c.dataset.grp;
      renderGrpBar();
      renderHoldings();
    };
  });

  var add = $("grpAdd");
  if(add) add.onclick = function(){
    var name = prompt("输入新分组名称：");
    if(name && name.trim()){
      name = name.trim();
      if(STOCK_GROUPS.indexOf(name) < 0){
        STOCK_GROUPS.push(name);
        grpSave();
        _grpActive = name;
        renderGrpBar();
      }
    }
  };
}

/* 在持仓表格中增加分组列 */
var _renderHoldingsOrigV16 = null;
function patchHoldingsForGroups(){
  if(_renderHoldingsOrigV16) return;
  _renderHoldingsOrigV16 = renderHoldings;

  renderHoldings = function(){
    /* 调用原始函数 */
    _renderHoldingsOrigV16();
    /* 然后过滤显示 */
    var box = $("holdList");
    if(!box) return;
    var rows = box.querySelectorAll("tbody tr");
    if(_grpActive === "全部") return;
    rows.forEach(function(tr){
      var hi = tr.querySelector("[data-hi]");
      if(!hi) return;
      var idx = +hi.dataset.hi;
      var hd = state.holdings[idx];
      if(!hd) return;
      tr.style.display = (hd.group === _grpActive) ? "" : "none";
    });
  };
}

/* 在持仓编辑中增加分组选择 */
function patchHoldingRowForGroup(){
  /* 在 renderHoldings 之后，找到每行添加分组下拉 */
  var box = $("holdList");
  if(!box) return;
  var ths = box.querySelectorAll("thead th");
  /* 在"类型"列后插入"分组"列 */
  var typeTh = box.querySelector("thead th:nth-child(4)");
  if(typeTh && !box.querySelector("thead th.grp-th")){
    var grpTh = document.createElement("th");
    grpTh.className = "grp-th";
    grpTh.style.width = "90px";
    grpTh.textContent = "分组";
    typeTh.parentNode.insertBefore(grpTh, typeTh.nextSibling);
  }
  /* 在每行的类型列后插入分组选择 */
  var rows = box.querySelectorAll("tbody tr");
  rows.forEach(function(tr){
    if(tr.querySelector(".grp-sel")) return;
    var typeCell = tr.querySelector("td:nth-child(4)");
    if(!typeCell) return;
    var hi = tr.querySelector("[data-hi]");
    if(!hi) return;
    var idx = +hi.dataset.hi;
    var hd = state.holdings[idx];
    if(!hd) return;
    var grpCell = document.createElement("td");
    var sel = document.createElement("select");
    sel.className = "grp-sel";
    sel.style.cssText = "width:80px;font-size:12px";
    STOCK_GROUPS.forEach(function(g){
      var opt = document.createElement("option");
      opt.value = g;
      opt.textContent = g;
      if(hd.group === g) opt.selected = true;
      sel.appendChild(opt);
    });
    sel.onchange = function(){
      state.holdings[idx].group = sel.value;
      saveState();
    };
    grpCell.appendChild(sel);
    typeCell.parentNode.insertBefore(grpCell, typeCell.nextSibling);
  });
}

/* ===================== 4. 复盘日记时间线 ===================== */
function journalLoad(){
  try{
    var s = localStorage.getItem("ashare_journal");
    if(s) return JSON.parse(s) || [];
  }catch(e){}
  return [];
}
function journalSave(entries){
  try{ localStorage.setItem("ashare_journal", JSON.stringify(entries)); }catch(e){}
}

function journalGenEntry(){
  var today = checklistTodayKey();
  var entries = journalLoad();
  /* 如果今天已有条目，不重复生成 */
  var existing = entries.find(function(e){ return e.date === today; });
  if(existing) return existing;

  var m = state.market || {};
  var avgScore = 0, n = 0, bullN = 0, bearN = 0, sigN = 0;
  state.holdings.forEach(function(hd){
    var an = getAn(hd.code);
    if(an){
      avgScore += an.score.total; n++;
      if(an.score.total >= 62) bullN++;
      if(an.score.total < 45) bearN++;
      if(an.sigs) sigN += an.sigs.filter(function(s){ return s.i >= an.i - 5; }).length;
    }
  });
  avgScore = n ? Math.round(avgScore / n) : 0;

  var shChg = num(m.sh_chg);
  var entry = {
    date: today,
    market: {
      sh: shChg, sz: num(m.sz_chg), cy: num(m.cy_chg)
    },
    portfolio: {
      avg: avgScore, n: n, bull: bullN, bear: bearN, sigs: sigN
    },
    checklist: checklistLoad()[today] || {},
    note: ""
  };
  entries.unshift(entry);
  if(entries.length > 365) entries.length = 365;
  journalSave(entries);
  return entry;
}

function journalRender(){
  var box = $("journalBox");
  if(!box) return;
  var entries = journalLoad();
  if(!entries.length){
    box.innerHTML = '<div class="chg-empty">还没有日记。点击下方「生成今日日记」开始记录。</div>' +
      '<div style="text-align:center;margin-top:10px"><button class="btn primary sm" id="journalGen">✍ 生成今日日记</button></div>';
    var gen = $("journalGen");
    if(gen) gen.onclick = function(){ journalGenEntry(); journalRender(); };
    return;
  }

  var h = "";
  entries.slice(0, 30).forEach(function(e){
    var m = e.market || {};
    var p = e.portfolio || {};
    var cl = m.sh >= 0 ? "up" : "down";
    var tone = p.avg >= 62 ? "偏强" : (p.avg < 45 ? "偏弱" : "中性");
    var toneCls = p.avg >= 62 ? "up" : (p.avg < 45 ? "down" : "");

    var body = "大盘：上证 " + (m.sh >= 0 ? "+" : "") + m.sh + "% · 深成 " + (m.sz >= 0 ? "+" : "") + m.sz + "% · 创业 " + (m.cy >= 0 ? "+" : "") + m.cy + "%<br>" +
      "组合：均分 <b>" + (p.avg || "—") + "</b> 分（" + (p.n || 0) + " 只），<span class='" + toneCls + "'>" + tone + "</span>，多头 " + p.bull + " / 空头 " + p.bear + "，近5日 " + p.sigs + " 个信号";

    if(e.note) body += "<br>笔记：" + esc(e.note);

    var clDone = 0, clTotal = 0;
    if(e.checklist){
      for(var k in e.checklist){ clTotal++; if(e.checklist[k]) clDone++; }
    }

    h += '<div class="journal-entry">' +
      '<div class="je-dot"></div>' +
      '<div class="je-date">' + esc(e.date) + (clTotal ? ' · 复盘清单 ' + clDone + '/' + clTotal : '') + '</div>' +
      '<div class="je-body">' + body + '</div>' +
      '<div class="je-tags">' +
        '<span class="chg-tag">上证' + (m.sh >= 0 ? "+" : "") + m.sh + "%</span>" +
        '<span class="chg-tag">均分' + (p.avg || "—") + '</span>' +
        '<span class="chg-tag">' + tone + '</span>' +
      '</div>' +
    '</div>';
  });
  box.innerHTML = h +
    '<div style="text-align:center;padding:10px"><button class="btn sm" id="journalGen2">✍ 更新今日日记</button></div>';

  var gen2 = $("journalGen2");
  if(gen2) gen2.onclick = function(){
    /* 删除今天的旧条目再重新生成 */
    var today = checklistTodayKey();
    var entries = journalLoad().filter(function(e){ return e.date !== today; });
    journalSave(entries);
    journalGenEntry();
    journalRender();
  };
}

function bindJournal(){
  var exp = $("journalExport");
  if(exp) exp.onclick = function(){
    var entries = journalLoad();
    if(!entries.length){ toastWarn("暂无日记可导出"); return; }
    var text = entries.map(function(e){
      var m = e.market || {}, p = e.portfolio || {};
      return "[" + e.date + "] 上证" + (m.sh >= 0 ? "+" : "") + m.sh + "% 深成" + (m.sz >= 0 ? "+" : "") + m.sz + "% 创业" + (m.cy >= 0 ? "+" : "") + m.cy + "% | 组合均分" + (p.avg || "—") + " 多" + p.bull + " 空" + p.bear + " 信号" + p.sigs + (e.note ? " | " + e.note : "");
    }).join("\n");
    dl("journal_" + Date.now() + ".txt", text, "text/plain;charset=utf-8");
    toastOk("日记已导出");
  };
}

/* ===================== 5. 增强仪表盘渲染 ===================== */
var _renderDashV16Orig = null;
function patchRenderDash(){
  if(_renderDashV16Orig) return;
  if(typeof renderDash !== "function") return;
  _renderDashV16Orig = renderDash;
  renderDash = function(){
    _renderDashV16Orig();
    renderPulse();
    renderChanges();
    renderQuickNav();
    renderChecklist();
    journalRender();
  };
}

/* ===================== 初始化 ===================== */
var _initV16 = null;
function initV16(){
  try{ grpLoad(); }catch(e){}
  try{ patchRenderDash(); }catch(e){}
  try{ patchHoldingsForGroups(); }catch(e){}
  try{ bindPulse(); }catch(e){}
  try{ bindJournal(); }catch(e){}
  try{ renderGrpBar(); }catch(e){}

  /* 在 renderHoldings 之后自动补分组列 */
  var _origRH = renderHoldings;
  if(!_origRH._grpPatched){
    renderHoldings = function(){
      _origRH();
      try{ renderGrpBar(); }catch(e){}
      try{ patchHoldingRowForGroup(); }catch(e){}
      try{ if(_grpActive !== "全部"){
        var box = $("holdList");
        if(box){
          box.querySelectorAll("tbody tr").forEach(function(tr){
            var hi = tr.querySelector("[data-hi]");
            if(!hi) return;
            var idx = +hi.dataset.hi;
            var hd = state.holdings[idx];
            if(hd && hd.group !== _grpActive) tr.style.display = "none";
          });
        }
      }}catch(e){}
    };
    renderHoldings._grpPatched = true;
  }
}

var _v2InitStepsOrigV16 = v2InitSteps;
v2InitSteps = function(){
  _v2InitStepsOrigV16();
  try{ initV16(); }catch(e){ if(console&&console.error) console.error("v16 init:", e); }
};
