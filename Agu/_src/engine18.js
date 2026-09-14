/* ============================================================
   engine18 · 笔记增强 + 复盘模式 + 仪表盘打磨
   ============================================================ */

/* ===================== 1. 笔记增强 ===================== */

var NOTE_TEMPLATES = {
  watch:  {title:"观察等待", text:"当前价格 ，技术形态 。等待 回调/突破 ， 到 位再评估。"},
  buy:    {title:"计划买入", text:"入场区间 - ，仓位 %，止损 ，目标 - 。逻辑："},
  sell:   {title:"计划卖出", text:"现价 ，计划在 减仓/清仓。理由：。止损上移至 。"},
  stop:   {title:"止损位", text:"止损设在 ，对应亏损 %。触发后无条件离场。"},
  target: {title:"目标位", text:"第一目标 ，第二目标 ，对应涨幅 %。到价减仓 。"},
  market: {title:"大盘随笔", text:"今日大盘 ，涨跌家比 ，涨停 板。板块轮动：。整体感受：。"}
};

function bindNoteTemplates(){
  var bar = $("noteTmplBar");
  if(!bar) return;
  bar.querySelectorAll(".note-tmpl").forEach(function(el){
    el.onclick = function(){
      var key = el.dataset.tmpl;
      var t = NOTE_TEMPLATES[key];
      if(!t) return;
      var titleEl = $("noteTitle");
      var textEl = $("noteText");
      var tagEl = $("noteTag");
      if(titleEl) titleEl.value = t.title;
      if(textEl){ textEl.value = t.text; textEl.focus(); }
      if(tagEl) tagEl.value = key;
      if(textEl){
        var idx = t.text.indexOf("，");
        if(idx > 0){ textEl.setSelectionRange(idx, idx); }
      }
    };
  });
}

/* 渲染笔记列表（增强版） */
var _renderNotesOrig = null;
function patchNotes(){
  if(_renderNotesOrig) return;
  if(typeof renderNotes !== "function") return;
  _renderNotesOrig = renderNotes;
  renderNotes = function(){
    _renderNotesOrig();
    var box = $("noteList");
    if(!box) return;
    var filter = ($("noteFilter") ? $("noteFilter").value : "").trim().toLowerCase();

    var list = NOTES.filter(function(n){
      if(_noteTagFilter && (n.tag || "") !== _noteTagFilter) return false;
      if(!filter) return true;
      var txt = (n.title || "") + " " + (n.text || "") + " " + (n.code || "") + " " + (n.name || "") + " " + (n.tag || "");
      return txt.toLowerCase().indexOf(filter) >= 0;
    });

    if(!list.length){
      box.innerHTML = '<div style="padding:20px;text-align:center;color:var(--muted2);font-size:13px">暂无笔记。点击上方模板快速创建。</div>';
      return;
    }

    var h = "";
    list.forEach(function(n){
      var realIdx = NOTES.indexOf(n);
      var time = n.time || n.date || "";
      h += '<div class="note-card">' +
        '<div class="nc-head">' +
          '<div class="nc-title">' + esc(n.title || "无标题") + '</div>' +
          (n.code ? '<span class="nc-code">' + esc(n.code) + ' ' + esc(n.name || "") + '</span>' : '') +
          '<span class="nc-time">' + esc(time) + '</span>' +
          '<span class="nc-del" data-ni="' + realIdx + '">删</span>' +
        '</div>' +
        '<div class="nc-body">' + esc(n.text || "").replace(/\n/g, "<br>") + '</div>' +
        (n.tag ? '<div class="nc-tags"><span class="nc-tag">' + esc(n.tag) + '</span></div>' : '') +
      '</div>';
    });
    box.innerHTML = h;

    box.querySelectorAll(".nc-del").forEach(function(b){
      b.onclick = function(){
        var idx = +b.dataset.ni;
        NOTES.splice(idx, 1);
        try{ localStorage.setItem("ashare_notes", JSON.stringify(NOTES)); }catch(e){}
        renderNotes();
        if(typeof renderQuickNav === "function") renderQuickNav();
      };
    });
  };
}

var _noteTagFilter = "";
function renderNoteTagFilter(){
  var box = $("noteTagFilter");
  if(!box) return;
  var tags = {};
  NOTES.forEach(function(n){
    var t = n.tag || "";
    if(t) tags[t] = (tags[t] || 0) + 1;
  });
  var keys = Object.keys(tags);
  if(!keys.length){ box.innerHTML = ""; return; }
  var h = '<span class="ntf' + (_noteTagFilter === "" ? " active" : "") + '" data-tag="">全部</span>';
  keys.forEach(function(t){
    h += '<span class="ntf' + (_noteTagFilter === t ? " active" : "") + '" data-tag="' + esc(t) + '">' +
      esc(t) + ' <span style="opacity:.6">' + tags[t] + '</span></span>';
  });
  box.innerHTML = h;
  box.querySelectorAll(".ntf").forEach(function(el){
    el.onclick = function(){
      _noteTagFilter = el.dataset.tag;
      renderNoteTagFilter();
      renderNotes();
    };
  });
}

/* 笔记添加增强 */
function bindNoteAdd(){
  var btn = $("addNote");
  if(!btn || btn._enhanced) return;
  btn._enhanced = true;
  btn.onclick = function(){
    var code = $("noteCode") ? $("noteCode").value : "";
    var name = "";
    if(code){
      var h = state.holdings.find(function(x){ return x.code === code; });
      name = h ? h.name : (typeof nameOf === "function" ? nameOf(code) : code);
    }
    var title = $("noteTitle") ? $("noteTitle").value.trim() : "";
    var text = $("noteText") ? $("noteText").value.trim() : "";
    var tag = $("noteTag") ? $("noteTag").value.trim() : "";

    if(!text && !title){ toastWarn("请输入笔记内容"); return; }

    var now = new Date();
    var time = now.getFullYear() + "-" + String(now.getMonth()+1).padStart(2,"0") + "-" +
      String(now.getDate()).padStart(2,"0") + " " + String(now.getHours()).padStart(2,"0") + ":" +
      String(now.getMinutes()).padStart(2,"0");

    NOTES.unshift({code:code, name:name, title:title, text:text, tag:tag, time:time});
    try{ localStorage.setItem("ashare_notes", JSON.stringify(NOTES)); }catch(e){}
    renderNotes();
    if(typeof renderQuickNav === "function") renderQuickNav();
    if($("noteText")) $("noteText").value = "";
    if($("noteTitle")) $("noteTitle").value = "";
    if($("noteTag")) $("noteTag").value = "";
    var msg = $("noteMsg");
    if(msg){ msg.textContent = "已保存"; setTimeout(function(){ msg.textContent = ""; }, 2000); }
    toastOk("笔记已保存");
  };
}

/* ===================== 2. 复盘模式 ===================== */
var REVIEW = {overlay:null, idx:0, items:[], reviewed:[], notes:[], finished:false};

function openReviewMode(){
  if(!state.holdings.length){
    toastWarn("请先添加持仓标的");
    tab("holdings");
    return;
  }
  REVIEW.items = state.holdings.filter(function(h){ return h.inReport !== false; });
  if(!REVIEW.items.length) REVIEW.items = state.holdings.slice();
  REVIEW.idx = 0;
  REVIEW.reviewed = [];
  REVIEW.notes = [];
  REVIEW.finished = false;

  /* 移除旧的 keydown 监听 */
  if(REVIEW._keyHandler){
    document.removeEventListener("keydown", REVIEW._keyHandler);
  }
  REVIEW._keyHandler = function(e){
    if(!REVIEW.overlay) return;
    if(e.key === "Escape"){ e.preventDefault(); reviewClose(); }
    else if(e.key === "ArrowLeft"){ e.preventDefault(); reviewPrev(); }
    else if(e.key === "ArrowRight" || (e.key === "Enter" && e.target.tagName !== "TEXTAREA" && e.target.tagName !== "INPUT")){
      e.preventDefault(); reviewNext();
    }
  };
  document.addEventListener("keydown", REVIEW._keyHandler);

  reviewRender();
}

function reviewClose(){
  if(REVIEW._keyHandler){
    document.removeEventListener("keydown", REVIEW._keyHandler);
    REVIEW._keyHandler = null;
  }
  if(REVIEW.overlay){
    REVIEW.overlay.remove();
    REVIEW.overlay = null;
  }
  REVIEW.finished = false;
}

function reviewNext(){
  if(REVIEW.finished) return;
  /* 保存快速笔记 */
  var qi = $("rvQuickNote");
  if(qi && qi.value.trim()){
    var hd = REVIEW.items[REVIEW.idx];
    var nm = hd ? (hd.name || hd.code) : "";
    REVIEW.notes.push({code:hd ? hd.code : "", name:nm, text:qi.value.trim(), time:new Date().toLocaleString("zh-CN").slice(0,16)});
    qi.value = "";
  }

  if(REVIEW.idx < REVIEW.items.length - 1){
    REVIEW.reviewed[REVIEW.idx] = true;
    REVIEW.idx++;
    reviewRender();
  } else {
    REVIEW.reviewed[REVIEW.idx] = true;
    REVIEW.finished = true;
    reviewRenderSummary();
  }
}

function reviewPrev(){
  if(REVIEW.finished){ REVIEW.finished = false; }
  if(REVIEW.idx > 0){
    REVIEW.idx--;
    reviewRender();
  }
}

/* 安全取值 */
function rvSafe(v, dflt){ return (v === undefined || v === null) ? dflt : v; }
function rvF2(v){ return (v !== undefined && v !== null && !isNaN(v)) ? f2(v) : "—"; }
function rvF1(v){ return (v !== undefined && v !== null && !isNaN(v)) ? f1(v) : "—"; }
function rvPct(v){ return (v !== undefined && v !== null && !isNaN(v)) ? pct(v) : "—"; }
function rvNum(v){ return (v !== undefined && v !== null && !isNaN(v)) ? Number(v) : 0; }

function reviewRender(){
  if(REVIEW.finished){ reviewRenderSummary(); return; }

  var ov = REVIEW.overlay;
  if(!ov){
    ov = document.createElement("div");
    ov.className = "review-overlay";
    document.body.appendChild(ov);
    REVIEW.overlay = ov;
  }

  var hd = REVIEW.items[REVIEW.idx];
  if(!hd){ reviewClose(); return; }

  var an = null;
  try{ an = getAn(hd.code); }catch(e){ an = null; }
  var nm = hd.name || (an ? an.name : "") || hd.code;

  var prog = "";
  REVIEW.items.forEach(function(_, i){
    var cls = i === REVIEW.idx ? "current" : (REVIEW.reviewed[i] ? "done" : "");
    prog += '<span class="rn-dot ' + cls + '"></span>';
  });

  var isLast = REVIEW.idx >= REVIEW.items.length - 1;

  var content = "";
  try{
    if(!an || !an.dates || !an.dates.length){
      content = '<div class="review-empty">' +
        '<p style="font-size:16px">📋 ' + esc(nm) + '（' + esc(hd.code) + '）</p>' +
        '<p>暂无日K数据，请先联网拉取或手动粘贴</p>' +
        '<div class="flex" style="justify-content:center;gap:8px;margin-top:16px">' +
          '<button class="btn primary sm" id="rvFetch">↻ 联网拉取</button>' +
        '</div>' +
      '</div>';
    } else {
      var k = an.i;
      var chg = rvNum(an.chg);
      var chgCls = chg >= 0 ? "up" : "down";

      /* 信号 */
      var sigs = (an.sigs || []).filter(function(s){ return s.i >= k - 10; });
      var sigHtml = "";
      sigs.forEach(function(s){
        var cls = s.side === "b" ? "up" : (s.side === "s" ? "down" : "neu");
        sigHtml += '<span class="chip ' + cls + '" style="font-size:11px">' + esc(s.nm || "") + ' ' + esc(s.date || "") + '</span>';
      });
      if(!sigHtml) sigHtml = '<span style="color:var(--muted2);font-size:12px">近10日无信号</span>';

      /* 提醒 */
      var alerts = ALERTS.filter(function(a){ return a.code === hd.code; });
      var alertHtml = "";
      alerts.forEach(function(a){
        var cond = "";
        if(a.type === "above") cond = "收盘 ≥ " + rvF2(a.val);
        else if(a.type === "below") cond = "收盘 ≤ " + rvF2(a.val);
        else if(a.type === "chg") cond = "涨跌 ≥ ±" + esc(String(a.val || "")) + "%";
        else if(a.type === "date") cond = "到期 " + esc(String(a.val || ""));
        else cond = esc(String(a.val || ""));
        alertHtml += '<div style="padding:4px 0;font-size:12px;color:var(--muted)">' +
          (a.hit ? "🔔" : "⏳") + " " + (typeof alertTypeTxt === "function" ? alertTypeTxt(a.type) : a.type) + "：" + cond +
          (a.hit ? ' <span style="color:#ffd48a">已触发</span>' : '') + '</div>';
      });

      /* 笔记 */
      var notes = NOTES.filter(function(n){ return n.code === hd.code; });
      var noteHtml = "";
      notes.forEach(function(n){
        noteHtml += '<div style="padding:4px 0;font-size:12px;color:var(--muted);border-bottom:1px dashed var(--line)">' +
          (n.title ? '<b style="color:var(--txt)">' + esc(n.title) + '</b> — ' : '') +
          esc(n.text || "").slice(0, 120) +
          (n.time ? ' <span style="color:var(--muted2);font-size:10px">' + esc(n.time) + '</span>' : '') +
        '</div>';
      });
      if(!noteHtml) noteHtml = '<span style="color:var(--muted2);font-size:12px">暂无笔记</span>';

      /* KPI */
      var scoreTotal = (an.score && an.score.total !== undefined) ? an.score.total : "—";
      var scoreLabel = (an.score && an.score.label) ? an.score.label : "";
      var scoreTone  = (an.score && an.score.tone) ? an.score.tone : "";
      var rsiV = rvNum(an.rsiV);
      var rsiZone = an.rsiZone || "";
      var vr = rvNum(an.vr);

      content =
        '<div class="grid g4" style="margin-bottom:14px">' +
          '<div class="kpi ' + chgCls + '"><div class="lb">最新收盘</div><div class="vl">' + rvF2(an.close) + '</div><div class="ex">' + rvPct(chg) + '</div></div>' +
          '<div class="kpi ' + scoreTone + '"><div class="lb">技术评分</div><div class="vl">' + scoreTotal + '</div><div class="ex">' + scoreLabel + '</div></div>' +
          '<div class="kpi ' + (rsiV >= 70 ? "up" : (rsiV <= 30 ? "down" : "")) + '"><div class="lb">RSI(14)</div><div class="vl">' + (rsiV ? rvF1(an.rsiV) : "—") + '</div><div class="ex">' + rsiZone + '</div></div>' +
          '<div class="kpi"><div class="lb">量比(5日)</div><div class="vl">' + (vr ? vr.toFixed(2) : "—") + '</div><div class="ex">' + (vr > 1.5 ? "放量" : (vr < 0.7 ? "缩量" : "常态")) + '</div></div>' +
        '</div>';

      /* 均线 */
      var arrange = an.arrange || "—";
      var arrangeCls = arrange.indexOf("多头") >= 0 ? "up" : (arrange.indexOf("空头") >= 0 ? "down" : "neu");
      content += '<div style="margin-bottom:14px"><div class="muted" style="font-size:12px;margin-bottom:4px">均线排列</div>' +
        '<div class="flex" style="gap:6px;flex-wrap:wrap">' +
          '<span class="chip ' + arrangeCls + ' big">' + esc(arrange) + '</span>';
      if(an.wk && an.wk.ok && an.wk.arrange){
        content += '<span class="chip acc big">周线 ' + esc(an.wk.arrange) + '</span>';
      }
      content += '</div></div>';

      /* 信号 */
      content += '<div style="margin-bottom:14px"><div class="muted" style="font-size:12px;margin-bottom:4px">近 10 日信号</div>' +
        '<div class="flex" style="gap:6px;flex-wrap:wrap">' + sigHtml + '</div></div>';

      /* 提醒 */
      if(alertHtml){
        content += '<div style="margin-bottom:14px"><div class="muted" style="font-size:12px;margin-bottom:4px">该股提醒</div>' + alertHtml + '</div>';
      }

      /* 笔记 */
      content += '<div style="margin-bottom:14px"><div class="muted" style="font-size:12px;margin-bottom:4px">相关笔记</div>' + noteHtml + '</div>';

      /* 关键位 */
      var supArr = (an.sup || []).map(function(v){ return rvF2(v); }).filter(function(v){ return v !== "—"; });
      var resArr = (an.res || []).map(function(v){ return rvF2(v); }).filter(function(v){ return v !== "—"; });
      var ma20v = (an.ma20 && k >= 0 && an.ma20[k] !== undefined) ? rvF2(an.ma20[k]) : "—";
      var ma60v = (an.ma60 && k >= 0 && an.ma60[k] !== undefined) ? rvF2(an.ma60[k]) : "—";
      var blStr = "—";
      if(an.bl && an.bl.up && an.bl.up[k] !== undefined){
        blStr = rvF2(an.bl.lo[k]) + " / " + rvF2(an.bl.mid[k]) + " / " + rvF2(an.bl.up[k]);
      }
      content += '<div style="margin-bottom:14px"><div class="muted" style="font-size:12px;margin-bottom:4px">关键位</div>' +
        '<div style="font-size:12px;color:var(--muted);line-height:1.8">' +
          '支撑：' + (supArr.length ? supArr.join(" / ") : "—") +
          ' ｜ 压力：' + (resArr.length ? resArr.join(" / ") : "—") + '<br>' +
          'MA20：' + ma20v + ' ｜ MA60：' + ma60v + ' ｜ BOLL：' + blStr +
        '</div></div>';

      /* 迷你 K 线图 */
      content += '<div style="margin-bottom:14px"><div class="muted" style="font-size:12px;margin-bottom:4px">近 30 日 K 线</div>' +
        '<div id="rvChart" style="height:200px;border:1px solid var(--line);border-radius:8px"></div></div>';
    }
  }catch(err){
    content = '<div class="review-empty">' +
      '<p style="font-size:16px">📋 ' + esc(nm) + '（' + esc(hd.code) + '）</p>' +
      '<p>数据解析异常：' + esc(String(err.message || err).slice(0, 80)) + '</p>' +
      '<p style="font-size:12px;color:var(--muted2)">可尝试重新拉取数据或手动粘贴日K</p>' +
    '</div>';
  }

  ov.innerHTML =
    '<div class="review-bar">' +
      '<span style="font-size:18px">🎯</span>' +
      '<div class="rb-title">复盘模式 — ' + esc(nm) + '（' + esc(hd.code) + '）</div>' +
      '<span class="rb-count">' + (REVIEW.idx + 1) + ' / ' + REVIEW.items.length + '</span>' +
      '<button class="btn sm" id="rvPrev"' + (REVIEW.idx === 0 ? " disabled" : "") + '>← 上一只</button>' +
      '<button class="btn primary sm" id="rvNext">' + (isLast ? "✓ 完成" : "下一只 →") + '</button>' +
      '<button class="btn sm" id="rvClose">✕ 退出</button>' +
    '</div>' +
    '<div class="review-body">' +
      '<div class="review-nav">' +
        '<span style="font-size:12px;color:var(--muted)">← / → 键翻页 · Esc 退出</span>' +
        '<div class="rn-progress">' + prog + '</div>' +
      '</div>' +
      '<div class="review-content">' + content + '</div>' +
      '<div style="margin-top:12px">' +
        '<div class="muted" style="font-size:12px;margin-bottom:4px">快速笔记（写完按→下一只会自动保存）</div>' +
        '<textarea id="rvQuickNote" rows="2" placeholder="对 ' + esc(nm) + ' 的判断 / 计划…" style="width:100%;font-size:13px;padding:8px 10px;background:#0e141f;border:1px solid var(--line2);border-radius:8px;color:var(--txt)"></textarea>' +
      '</div>' +
      '<div class="flex" style="gap:8px;justify-content:center;padding:16px 0">' +
        '<button class="btn sm" id="rvStock">📊 深入诊断</button>' +
        '<button class="btn sm" id="rvNote">📝 写详细笔记</button>' +
        '<button class="btn sm" id="rvAlert">🔔 加提醒</button>' +
        (an && an.dates && an.dates.length ? '<button class="btn sm" id="rvCompare">📊 加入对比</button>' : '') +
      '</div>' +
    '</div>';

  /* 绑定事件 */
  var prev = $("rvPrev"); if(prev) prev.onclick = reviewPrev;
  var next = $("rvNext"); if(next) next.onclick = reviewNext;
  var close = $("rvClose"); if(close) close.onclick = reviewClose;
  var stock = $("rvStock"); if(stock) stock.onclick = function(){
    reviewClose();
    if(typeof pickStock === "function") pickStock(hd.code);
    tab("stock");
  };
  var note = $("rvNote"); if(note) note.onclick = function(){
    reviewClose();
    tab("notes");
    setTimeout(function(){
      var sel = $("noteCode");
      if(sel) sel.value = hd.code;
      var ti = $("noteTitle");
      if(ti){ ti.value = nm + " 复盘"; ti.focus(); }
    }, 100);
  };
  var alert = $("rvAlert"); if(alert) alert.onclick = function(){
    reviewClose();
    if(typeof pickStock === "function") pickStock(hd.code);
    tab("stock");
    setTimeout(function(){
      var box = $("stockAlertCard");
      if(box) box.scrollIntoView({behavior:"smooth"});
    }, 200);
  };
  var cmp = $("rvCompare");
  if(cmp) cmp.onclick = function(){
    if(typeof CMP_CODES !== "undefined" && CMP_CODES.indexOf(hd.code) < 0){
      CMP_CODES.push(hd.code);
      try{ localStorage.setItem("ashare_cmp", JSON.stringify(CMP_CODES)); }catch(e){}
    }
    toastOk(nm + " 已加入走势对比");
  };
  var fetch = $("rvFetch"); if(fetch) fetch.onclick = async function(){
    toastInfo("正在拉取 " + nm + "…");
    try{
      var n = 0;
      if(typeof fetchStockDataRetry === "function"){
        n = await fetchStockDataRetry(hd.code);
      } else if(typeof fetchStockData === "function"){
        n = await fetchStockData(hd.code);
      }
      if(n > 0){ toastOk(nm + " 拉取成功，" + n + " 根日K"); reviewRender(); }
      else toastWarn(nm + " 拉取失败，可手动粘贴日K", 4000);
    }catch(e){ toastErr("拉取异常：" + String(e.message || e).slice(0, 40)); }
  };

  /* 渲染迷你K线图 */
  if(an && an.dates && an.dates.length){
    setTimeout(function(){ try{ renderRvChart(hd.code); }catch(e){} }, 50);
  }

  /* 聚焦到快速笔记 */
  setTimeout(function(){
    var qi = $("rvQuickNote");
    if(qi) qi.focus();
  }, 200);
}

/* 迷你K线图 */
function renderRvChart(code){
  var box = $("rvChart");
  if(!box) return;
  var s = state.stocks[code];
  if(!s || !s.rows || !s.rows.length) return;
  var rows = s.rows.slice(-30);
  if(rows.length < 2) return;

  /* 用 echarts */
  if(typeof echarts === "undefined") return;
  var chart = echarts.init(box);
  var cats = rows.map(function(r){ return r.day; });
  var ohlc = rows.map(function(r){ return [r.open, r.close, r.low, r.high]; });
  var vols = rows.map(function(r){ return r.volume; });
  var maxVol = Math.max.apply(null, vols);

  chart.setOption({
    animation:false,
    grid:{left:40,right:16,top:16,bottom:48},
    xAxis:{type:"category",data:cats,axisLabel:{fontSize:9,interval:Math.floor(rows.length/6)}},
    yAxis:[{scale:true,splitLine:{lineStyle:{color:"rgba(38,49,69,.3)"}}},{scale:true,max:maxVol*4,splitLine:{show:false}}],
    series:[
      {type:"candlestick",data:ohlc,
        itemStyle:{color:"#e74c3c",color0:"#2ecc71",borderColor:"#e74c3c",borderColor0:"#2ecc71"},
        markPoint:{data:[
          {type:"max",name:"高",valueIndex:3},
          {type:"min",name:"低",valueIndex:2}
        ],itemStyle:{color:"rgba(76,141,255,.6)"}}
      },
      {name:"量",type:"bar",xAxisIndex:0,yAxisIndex:1,data:vols,
        itemStyle:{color:"rgba(76,141,255,.2)"}
      }
    ]
  });
  /* 自适应 */
  if(!REVIEW._resizeRv){
    REVIEW._resizeRv = function(){
      var b = $("rvChart");
      if(b){ echarts.getInstanceByDom(b) && echarts.getInstanceByDom(b).resize(); }
    };
    window.addEventListener("resize", REVIEW._resizeRv);
  }
}

/* 复盘完成摘要 */
function reviewRenderSummary(){
  var ov = REVIEW.overlay;
  if(!ov){
    ov = document.createElement("div");
    ov.className = "review-overlay";
    document.body.appendChild(ov);
    REVIEW.overlay = ov;
  }

  var n = REVIEW.items.length;
  var reviewedN = REVIEW.reviewed.filter(function(v){ return v; }).length;
  var noteN = REVIEW.notes.length;

  /* 汇总统计 */
  var bullN = 0, bearN = 0, avgScore = 0, scoreN = 0;
  REVIEW.items.forEach(function(hd){
    var an = null;
    try{ an = getAn(hd.code); }catch(e){}
    if(an && an.score){
      avgScore += rvNum(an.score.total);
      scoreN++;
      if(an.score.total >= 62) bullN++;
      if(an.score.total < 45) bearN++;
    }
  });
  avgScore = scoreN ? Math.round(avgScore / scoreN) : 0;

  var h =
    '<div class="review-bar">' +
      '<span style="font-size:18px">✅</span>' +
      '<div class="rb-title">复盘完成</div>' +
      '<button class="btn sm" id="rvClose">✕ 关闭</button>' +
    '</div>' +
    '<div class="review-body">' +
      '<div class="review-content" style="text-align:center;padding:40px 20px">' +
        '<div style="font-size:48px;margin-bottom:12px">🎉</div>' +
        '<div style="font-size:18px;margin-bottom:20px">本次复盘完成！</div>' +
        '<div class="grid g4" style="max-width:600px;margin:0 auto 24px">' +
          '<div class="kpi"><div class="lb">复盘标的</div><div class="vl">' + n + '</div><div class="ex">共过 ' + reviewedN + ' 只</div></div>' +
          '<div class="kpi ' + (avgScore >= 55 ? "up" : (avgScore < 45 ? "down" : "")) + '"><div class="lb">平均评分</div><div class="vl">' + (avgScore || "—") + '</div><div class="ex">技术形态综合</div></div>' +
          '<div class="kpi up"><div class="lb">偏多</div><div class="vl">' + bullN + '</div><div class="ex">评分 ≥ 62</div></div>' +
          '<div class="kpi down"><div class="lb">偏空</div><div class="vl">' + bearN + '</div><div class="ex">评分 < 45</div></div>' +
        '</div>';

  if(noteN > 0){
    h += '<div style="text-align:left;max-width:600px;margin:0 auto 20px"><div class="muted" style="font-size:12px;margin-bottom:6px">本次快速笔记（' + noteN + ' 条）</div>';
    REVIEW.notes.forEach(function(n){
      h += '<div class="note-card"><div class="nc-head"><div class="nc-title">' + esc(n.name) + '</div><span class="nc-time">' + esc(n.time) + '</span></div><div class="nc-body">' + esc(n.text) + '</div></div>';
    });
    h += '</div>';
  }

  h += '<div class="flex" style="gap:8px;justify-content:center">' +
      '<button class="btn primary sm" id="rvSaveNotes">💾 保存笔记到笔记页</button>' +
      '<button class="btn sm" id="rvReport">📄 生成复盘报告</button>' +
      '<button class="btn sm" id="rvRestart">🔄 重新复盘</button>' +
    '</div>' +
    '</div></div>';

  ov.innerHTML = h;

  var close = $("rvClose"); if(close) close.onclick = reviewClose;
  var save = $("rvSaveNotes"); if(save) save.onclick = function(){
    REVIEW.notes.forEach(function(n){
      NOTES.unshift({code:n.code, name:n.name, title:"复盘快速笔记", text:n.text, tag:"复盘", time:n.time});
    });
    try{ localStorage.setItem("ashare_notes", JSON.stringify(NOTES)); }catch(e){}
    renderNotes();
    if(typeof renderQuickNav === "function") renderQuickNav();
    toastOk("已保存 " + REVIEW.notes.length + " 条笔记");
  };
  var report = $("rvReport"); if(report) report.onclick = function(){
    reviewClose();
    tab("report");
    setTimeout(function(){
      var btn = $("genReport");
      if(btn) btn.click();
    }, 200);
  };
  var restart = $("rvRestart"); if(restart) restart.onclick = function(){
    REVIEW.finished = false;
    REVIEW.idx = 0;
    REVIEW.reviewed = [];
    REVIEW.notes = [];
    reviewRender();
  };
}

function bindReviewMode(){
  var btn = $("btnReviewMode");
  if(btn && !btn._rvBound){
    btn._rvBound = true;
    btn.onclick = openReviewMode;
  }
}

/* ===================== 3. 仪表盘空状态打磨 ===================== */
function polishEmptyStates(){
  var changeBody = $("changeBody");
  if(changeBody && !changeBody.innerHTML.trim()){
    changeBody.innerHTML = '<div class="chg-empty">添加持仓并拉取数据后，这里会显示近 3 日信号与异动</div>';
  }
  var journalBox = $("journalBox");
  if(journalBox && !journalBox.innerHTML.trim()){
    journalBox.innerHTML = '<div class="chg-empty">点击下方按钮生成今日复盘日记</div>';
  }
}

/* ===================== 初始化 ===================== */
function initV18(){
  try{ bindNoteTemplates(); }catch(e){}
  try{ patchNotes(); }catch(e){}
  try{ bindNoteAdd(); }catch(e){}
  try{ bindReviewMode(); }catch(e){}
}

var _v2InitStepsOrigV18 = v2InitSteps;
v2InitSteps = function(){
  _v2InitStepsOrigV18();
  try{
    initV18();
    /* 在 renderNotes 后渲染标签过滤器 */
    var _origRN = renderNotes;
    if(_origRN && !_origRN._tagPatched){
      renderNotes = function(){
        _origRN();
        try{ renderNoteTagFilter(); }catch(e){}
      };
      renderNotes._tagPatched = true;
    }
  }catch(e){ if(console&&console.error) console.error("v18 init:", e); }
};

/* 在 renderDash 后打磨空状态 */
var _renderDashV18Orig = null;
function patchDashPolish(){
  if(_renderDashV18Orig) return;
  if(typeof renderDash !== "function") return;
  _renderDashV18Orig = renderDash;
  renderDash = function(){
    _renderDashV18Orig();
    try{ polishEmptyStates(); }catch(e){}
  };
}

var _v2InitStepsOrigV18b = v2InitSteps;
v2InitSteps = function(){
  _v2InitStepsOrigV18b();
  try{ patchDashPolish(); }catch(e){}
};
