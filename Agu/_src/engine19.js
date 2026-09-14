/* ============================================================
   engine19 · v2.2 复盘日历热力图 / 雷达图 / 全局稳定性
   ============================================================ */

/* ===================== 1. 全局错误捕获 ===================== */
function setupGlobalErrorGuard(){
  /* 捕获未处理的 Promise rejection */
  window.addEventListener("unhandledrejection", function(e){
    var msg = String(e.reason && e.reason.message || e.reason || "").slice(0, 80);
    if(console && console.error) console.error("未捕获 Promise:", e.reason);
    if(typeof toastErr === "function") toastErr("操作异常（已恢复）：" + msg, 3000);
    e.preventDefault();
  });

  /* 捕获运行时错误 */
  window.addEventListener("error", function(e){
    var msg = String(e.message || "").slice(0, 80);
    var src = String(e.filename || "").split("/").pop() + ":" + (e.lineno || "?");
    if(console && console.error) console.error("运行时错误:", msg, src);
    /* 不弹 toast 避免刷屏，仅控制台 */
    return false;
  });
}

/* 安全渲染包装 */
function safeRender(fn, fallback){
  return function(){
    try{ return fn.apply(this, arguments); }
    catch(e){
      if(console && console.error) console.error("渲染异常:", fn.name || "<anon>", e);
      if(typeof fallback === "function"){ try{ return fallback(e); }catch(_){} }
      return undefined;
    }
  };
}

/* 安全操作包装 */
function safeCall(fn, errMsg){
  return function(){
    try{ return fn.apply(this, arguments); }
    catch(e){
      if(console && console.error) console.error("操作异常:", fn.name || "<anon>", e);
      if(typeof toastErr === "function") toastErr(errMsg || "操作失败", 3000);
    }
  };
}

/* ===================== 2. 复盘日历热力图 ===================== */
var CAL_DATE = new Date();

function renderCalendar(){
  var box = $("calHeatmap");
  if(!box) return;
  var year = CAL_DATE.getFullYear();
  var month = CAL_DATE.getMonth();
  var label = $("calLabel");
  if(label) label.textContent = year + "年" + (month + 1) + "月";

  var first = new Date(year, month, 1);
  var firstDay = first.getDay(); /* 0=周日 */
  var daysInMonth = new Date(year, month + 1, 0).getDate();
  var today = new Date();
  var todayStr = today.getFullYear() + "-" + String(today.getMonth()+1).padStart(2,"0") + "-" + String(today.getDate()).padStart(2,"0");

  /* 从日记加载历史评分 */
  var entries = [];
  try{ entries = journalLoad(); }catch(e){}
  var entryMap = {};
  entries.forEach(function(e){
    if(e.date) entryMap[e.date] = e;
  });

  var weekDays = ["日","一","二","三","四","五","六"];
  var h = '<div class="cal-grid">';
  weekDays.forEach(function(d){ h += '<div class="cal-hd">' + d + '</div>'; });

  /* 空白填充 */
  for(var i = 0; i < firstDay; i++){
    h += '<div class="cal-cell empty"></div>';
  }

  for(var d = 1; d <= daysInMonth; d++){
    var dateStr = year + "-" + String(month+1).padStart(2,"0") + "-" + String(d).padStart(2,"0");
    var entry = entryMap[dateStr];
    var score = entry ? (entry.portfolio ? entry.portfolio.avg : 0) : 0;
    var hasData = !!entry;
    var isToday = dateStr === todayStr;

    /* 根据评分决定颜色 */
    var bg = "transparent";
    if(hasData && score){
      if(score >= 62) bg = "rgba(34,197,94,.35)";
      else if(score >= 50) bg = "rgba(76,141,255,.35)";
      else if(score >= 40) bg = "rgba(245,165,36,.35)";
      else bg = "rgba(255,77,79,.35)";
    }

    var cls = "cal-cell";
    if(hasData) cls += " has-data";
    if(isToday) cls += " today";
    if(!hasData) cls += " empty";

    var tip = "";
    if(hasData){
      var m = entry.market || {};
      var p = entry.portfolio || {};
      tip = '<div class="cal-tooltip">' + dateStr + ' · 上证' + (m.sh >= 0 ? "+" : "") + (m.sh||0) + '% · 评分' + (p.avg||0) + '</div>';
    }

    h += '<div class="' + cls + '" style="background:' + bg + '" data-date="' + dateStr + '">' +
      d + tip + '</div>';
  }
  h += '</div>';
  box.innerHTML = h;

  /* 点击日期 */
  box.querySelectorAll(".cal-cell:not(.empty)").forEach(function(c){
    c.onclick = function(){
      var date = c.dataset.date;
      /* 找到对应日记条目并高亮 */
      var entries = journalLoad();
      var found = entries.find(function(e){ return e.date === date; });
      if(found){
        /* 滚动到日记区域 */
        var jb = $("journalBox");
        if(jb) jb.scrollIntoView({behavior:"smooth", block:"center"});
        toastInfo(date + " 评分 " + ((found.portfolio||{}).avg||"—") + " 分");
      } else {
        toastInfo(date + " 无日记记录");
      }
    };
  });
}

function bindCalendar(){
  var prev = $("calPrev");
  var next = $("calNext");
  if(prev) prev.onclick = function(){
    CAL_DATE.setMonth(CAL_DATE.getMonth() - 1);
    renderCalendar();
  };
  if(next) next.onclick = function(){
    CAL_DATE.setMonth(CAL_DATE.getMonth() + 1);
    renderCalendar();
  };
}

/* ===================== 3. 持仓评分雷达图 ===================== */
function renderPortfolioRadar(){
  var box = $("radarChart");
  if(!box) return;
  if(typeof echarts === "undefined") return;
  if(!state.holdings.length){
    box.innerHTML = '<div style="text-align:center;padding:40px;color:var(--muted2);font-size:13px">添加持仓后显示评分雷达图</div>';
    return;
  }

  /* 取前5只评分最高的 */
  var items = state.holdings.map(function(hd){
    var an = null;
    try{ an = getAn(hd.code); }catch(e){}
    var s = (an && an.score) ? an.score : {};
    return {
      code: hd.code,
      name: hd.name || (an ? an.name : "") || hd.code,
      trend: s.trend || 0,
      momentum: s.momentum || s.dyn || 0,
      volume: s.volume || s.vol || 0,
      position: s.position || s.pos || 0,
      pattern: s.pattern || s.shape || 0,
      total: s.total || 0
    };
  }).filter(function(x){ return x.total > 0; })
    .sort(function(a, b){ return b.total - a.total; })
    .slice(0, 5);

  if(!items.length){
    box.innerHTML = '<div style="text-align:center;padding:40px;color:var(--muted2);font-size:13px">拉取数据后显示评分雷达图</div>';
    return;
  }

  var chart = echarts.init(box);
  var indicators = [
    {name:"趋势", max:100},
    {name:"动量", max:100},
    {name:"量能", max:100},
    {name:"位置", max:100},
    {name:"形态", max:100}
  ];

  var series = items.map(function(it, i){
    return {
      name: it.name,
      value: [it.trend, it.momentum, it.volume, it.position, it.pattern],
      itemStyle:{color: CMP_COLOR[i % CMP_COLOR.length]}
    };
  });

  chart.setOption({
    animation:false,
    legend:{
      data: items.map(function(it){ return it.name; }),
      bottom:0,
      textStyle:{color:"#8b95a8", fontSize:11}
    },
    radar:{
      indicator: indicators,
      shape:"polygon",
      splitNumber:4,
      axisName:{color:"#8b95a8", fontSize:11},
      splitLine:{lineStyle:{color:"rgba(38,49,69,.4)"}},
      splitArea:{areaStyle:{color:["rgba(38,49,69,.05)","rgba(38,49,69,.1)"]}},
      axisLine:{lineStyle:{color:"rgba(38,49,69,.3)"}}
    },
    series:[{
      type:"radar",
      data:series,
      areaStyle:{opacity:0.08},
      lineStyle:{width:2},
      symbol:"circle",
      symbolSize:5
    }]
  });

  if(!box._resizeBound){
    box._resizeBound = true;
    window.addEventListener("resize", function(){
      var b = $("radarChart");
      if(b){ var c = echarts.getInstanceByDom(b); if(c) c.resize(); }
    });
  }
}

/* ===================== 4. 增强仪表盘渲染 ===================== */
var _renderDashV19Orig = null;
function patchRenderDashV19(){
  if(_renderDashV19Orig) return;
  if(typeof renderDash !== "function") return;
  _renderDashV19Orig = renderDash;
  renderDash = function(){
    _renderDashV19Orig();
    try{ renderCalendar(); }catch(e){}
    try{ renderPortfolioRadar(); }catch(e){}
  };
}

/* ===================== 初始化 ===================== */
function initV19(){
  try{ setupGlobalErrorGuard(); }catch(e){}
  try{ bindCalendar(); }catch(e){}
  try{ patchRenderDashV19(); }catch(e){}
}

var _v2InitStepsOrigV19 = v2InitSteps;
v2InitSteps = function(){
  _v2InitStepsOrigV19();
  try{ initV19(); }catch(e){ if(console&&console.error) console.error("v19 init:", e); }
};
