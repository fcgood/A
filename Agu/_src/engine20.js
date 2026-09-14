/* ============================================================
   engine20 · v2.2 手动画线 + 性能优化 + UI 微调
   ============================================================ */

/* ===================== 1. 性能优化工具 ===================== */

/* rAF 防抖：多次调用只执行最后一帧 */
function rAFDebounce(fn){
  var timer = null;
  return function(){
    var args = arguments, ctx = this;
    if(timer) cancelAnimationFrame(timer);
    timer = requestAnimationFrame(function(){
      timer = null;
      fn.apply(ctx, args);
    });
  };
}

/* 简单防抖 */
function debounce(fn, wait){
  var timer = null;
  return function(){
    var args = arguments, ctx = this;
    clearTimeout(timer);
    timer = setTimeout(function(){ fn.apply(ctx, args); }, wait);
  };
}

/* ECharts 实例缓存池 */
var _chartPool = {};
function getChart(domId){
  if(!_chartPool[domId]){
    var el = document.getElementById(domId);
    if(!el || typeof echarts === "undefined") return null;
    _chartPool[domId] = echarts.init(el);
  }
  return _chartPool[domId];
}
function disposeChart(domId){
  if(_chartPool[domId]){
    try{ _chartPool[domId].dispose(); }catch(e){}
    delete _chartPool[domId];
  }
}

/* 优化 resize：全局只绑定一次 */
var _resizeBound = false;
function bindGlobalResize(){
  if(_resizeBound) return;
  _resizeBound = true;
  var fn = rAFDebounce(function(){
    for(var k in _chartPool){
      try{ _chartPool[k].resize(); }catch(e){}
    }
    /* 也 resize 非 pool 管理的图表 */
    if(typeof resizeAllCharts === "function"){
      try{ resizeAllCharts(); }catch(e){}
    }
  });
  window.addEventListener("resize", fn);
}

/* DOM 批量更新 */
function batchDOM(fn){
  var frag = document.createDocumentFragment();
  fn(frag);
  return frag;
}

/* ===================== 2. 手动画线 ===================== */
var DRAW = {mode:"off", points:[], shapes:[], chart:null, code:""};

function drawLoad(code){
  DRAW.code = code;
  try{
    var s = localStorage.getItem("ashare_draw_" + code);
    DRAW.shapes = s ? JSON.parse(s) : [];
  }catch(e){ DRAW.shapes = []; }
}

function drawSave(){
  if(!DRAW.code) return;
  try{ localStorage.setItem("ashare_draw_" + DRAW.code, JSON.stringify(DRAW.shapes)); }catch(e){}
}

function drawSetMode(mode){
  DRAW.mode = mode;
  DRAW.points = [];
  if(DRAW.chart){
    try{ DRAW.chart.off("click", drawOnClick); DRAW.chart.off("mousedown", drawOnClick); }catch(e){}
    if(mode !== "off"){
      DRAW.chart.on("click", drawOnClick);
    }
  }
  /* 更新光标 */
  var kl = $("kline");
  if(kl){
    kl.style.cursor = mode === "off" ? "crosshair" : "crosshair";
  }
}

function drawOnClick(params){
  if(DRAW.mode === "off") return;
  if(!params || params.componentType !== "series") return;

  var p = {x:params.value[0] || params.dataIndex, y:params.value[1]};
  /* 对于非 candlestick 系列（如收盘线），用 event offsetX/Y */
  if(params.value && typeof params.value[1] !== "number"){
    var cv = DRAW.chart.convertFromPixel({seriesIndex:0}, [params.event.event.offsetX, params.event.event.offsetY]);
    p = {x:cv[0], y:cv[1]};
  }

  DRAW.points.push(p);

  if(DRAW.mode === "line" && DRAW.points.length >= 2){
    DRAW.shapes.push({type:"line", p1:DRAW.points[0], p2:DRAW.points[1], color:"#4c8dff"});
    DRAW.points = [];
    drawApply();
    drawSave();
    toastInfo("趋势线已添加");
  } else if(DRAW.mode === "hline" && DRAW.points.length >= 1){
    DRAW.shapes.push({type:"hline", y:DRAW.points[0].y, color:"#f5a524"});
    DRAW.points = [];
    drawApply();
    drawSave();
    toastInfo("水平线已添加");
  } else if(DRAW.mode === "channel" && DRAW.points.length >= 3){
    DRAW.shapes.push({type:"channel", p1:DRAW.points[0], p2:DRAW.points[1], p3:DRAW.points[2], color:"#a371f7"});
    DRAW.points = [];
    drawApply();
    drawSave();
    toastInfo("通道已添加");
  } else if(DRAW.mode === "rect" && DRAW.points.length >= 2){
    DRAW.shapes.push({type:"rect", p1:DRAW.points[0], p2:DRAW.points[1], color:"rgba(76,141,255,.2)"});
    DRAW.points = [];
    drawApply();
    drawSave();
    toastInfo("矩形已添加");
  } else if(DRAW.mode === "text" && DRAW.points.length >= 1){
    var txt = prompt("输入标注文字：");
    if(txt){
      DRAW.shapes.push({type:"text", p:DRAW.points[0], text:txt, color:"#e8eef7"});
      drawApply();
      drawSave();
    }
    DRAW.points = [];
  }
}

function drawApply(){
  if(!DRAW.chart) return;
  /* 先移除旧的 graphic */
  try{ DRAW.chart.setOption({graphic:[]}); }catch(e){}

  var graphics = [];
  DRAW.shapes.forEach(function(s, i){
    if(s.type === "line" || s.type === "channel"){
      /* 趋势线：用 markLine */
      graphics.push({
        type:"line",
        shape:{
          x1:drawToPx(s.p1.x), y1:drawToPx(s.p1.y),
          x2:drawToPx(s.p2.x), y2:drawToPx(s.p2.y)
        },
        style:{stroke:s.color, lineWidth:2},
        z:50
      });
      if(s.type === "channel" && s.p3){
        /* 第三点定义平行偏移 */
        var dx = drawToPx(s.p2.x) - drawToPx(s.p1.x);
        var dy = drawToPx(s.p2.y) - drawToPx(s.p1.y);
        graphics.push({
          type:"line",
          shape:{
            x1:drawToPx(s.p3.x), y1:drawToPx(s.p3.y),
            x2:drawToPx(s.p3.x) + dx, y2:drawToPx(s.p3.y) + dy
          },
          style:{stroke:s.color, lineWidth:2, lineDash:[4,4]},
          z:50
        });
      }
    } else if(s.type === "hline"){
      /* 水平线：横跨整个图表 */
      graphics.push({
        type:"line",
        shape:{
          x1:0, y1:drawToPx(s.y),
          x2:9999, y2:drawToPx(s.y)
        },
        style:{stroke:s.color, lineWidth:1.5, lineDash:[6,3]},
        z:50
      });
    } else if(s.type === "rect"){
      graphics.push({
        type:"rect",
        shape:{
          x:Math.min(drawToPx(s.p1.x), drawToPx(s.p2.x)),
          y:Math.min(drawToPx(s.p1.y), drawToPx(s.p2.y)),
          width:Math.abs(drawToPx(s.p2.x) - drawToPx(s.p1.x)),
          height:Math.abs(drawToPx(s.p2.y) - drawToPx(s.p1.y))
        },
        style:{fill:s.color, stroke:s.color.replace(/[\d.]+\)/,"0.6)"), lineWidth:1},
        z:49
      });
    } else if(s.type === "text"){
      graphics.push({
        type:"text",
        style:{
          text:s.text,
          x:drawToPx(s.p.x),
          y:drawToPx(s.p.y) - 10,
          fill:s.color,
          fontSize:12,
          fontWeight:600,
          textBackgroundColor:"rgba(18,24,38,.8)",
          textPadding:[4,6]
        },
        z:51
      });
    }
  });

  if(graphics.length){
    try{ DRAW.chart.setOption({graphic:graphics}); }catch(e){}
  }
}

/* 将数据坐标转为像素坐标 */
function drawToPx(val){
  /* 画线时值已经是像素坐标（convertFromPixel 的结果），直接返回 */
  return Math.round(val);
}

function drawClear(){
  if(!confirm("确定清空当前标的所有画线？")) return;
  DRAW.shapes = [];
  drawSave();
  drawApply();
  toastOk("画线已清空");
}

/* 绑定画线按钮 */
function bindDrawTools(){
  var seg = $("segDraw");
  if(!seg || seg._bound) return;
  seg._bound = true;
  seg.querySelectorAll("button").forEach(function(b){
    b.onclick = function(){
      seg.querySelectorAll("button").forEach(function(x){ x.classList.remove("on"); });
      b.classList.add("on");
      drawSetMode(b.dataset.d);
      if(b.dataset.d !== "off"){
        toastInfo("画线模式：" + b.textContent.trim() + "，点击图表添加");
      }
    };
  });

  var clr = $("btnClearDraw");
  if(clr) clr.onclick = drawClear;
}

/* 在 renderKline 后设置 chart 引用并应用已有画线 */
var _renderKlineOrig = null;
function patchRenderKline(){
  if(_renderKlineOrig) return;
  if(typeof renderKline !== "function") return;
  _renderKlineOrig = renderKline;
  renderKline = function(){
    _renderKlineOrig();
    try{
      /* 获取 echarts 实例 */
      var kl = $("kline");
      if(kl){
        var inst = echarts.getInstanceByDom(kl);
        if(inst){
          DRAW.chart = inst;
          drawApply();
        }
      }
    }catch(e){}
  };
}

/* 在 pickStock 后加载该股的画线 */
var _pickStockOrig = null;
function patchPickStock(){
  if(_pickStockOrig) return;
  if(typeof pickStock !== "function") return;
  _pickStockOrig = pickStock;
  pickStock = function(code){
    _pickStockOrig(code);
    try{
      drawLoad(code);
      /* 等图表渲染完再应用 */
      setTimeout(function(){ drawApply(); }, 300);
    }catch(e){}
  };
}

/* ===================== 3. UI 微调 ===================== */

/* nav 改进 */
function polishNav(){
  var nav = document.querySelector("nav");
  if(!nav) return;
  /* 确保 nav 按钮有微交互 */
  nav.querySelectorAll("a").forEach(function(a){
    if(a._polished) return;
    a._polished = true;
    a.addEventListener("mouseenter", function(){
      a.style.transform = "translateX(2px)";
    });
    a.addEventListener("mouseleave", function(){
      a.style.transform = "";
    });
  });
}

/* section 切换动画增强 */
function polishSectionSwitch(){
  /* 已经有 fade 动画，这里增强一下过渡 */
  var style = document.createElement("style");
  style.textContent =
    "section.on{animation:fade .22s cubic-bezier(.4,0,.2,1) both}" +
    ".card{animation:cardFade .28s cubic-bezier(.4,0,.2,1) both}" +
    "@keyframes cardFade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}" +
    ".kpi{animation:cardFade .24s cubic-bezier(.4,0,.2,1) both}" +
    /* 输入框聚焦发光 */
    "input:focus,select:focus,textarea:focus{box-shadow:0 0 0 3px rgba(76,141,255,.12),0 0 12px rgba(76,141,255,.06)}" +
    /* 表格行悬停 */
    "tbody tr:hover{background:rgba(76,141,255,.04)}" +
    /* chip 微交互 */
    ".chip{transition:transform var(--t),box-shadow var(--t)}" +
    ".chip:hover{transform:translateY(-1px);box-shadow:var(--shadow-sm)}" +
    /* pbadge 微动画 */
    ".pbadge{transition:transform var(--t)}" +
    ".pbadge:hover{transform:scale(1.05)}" +
    /* 链接下划线动画 */
    "a{text-decoration:none;position:relative}" +
    "a[href]:after{content:'';position:absolute;bottom:-1px;left:0;width:0;height:1px;background:currentColor;transition:width var(--t)}" +
    "a[href]:hover:after{width:100%}";
  document.head.appendChild(style);
}

/* ===================== 初始化 ===================== */
function initV20(){
  try{ bindGlobalResize(); }catch(e){}
  try{ bindDrawTools(); }catch(e){}
  try{ patchRenderKline(); }catch(e){}
  try{ patchPickStock(); }catch(e){}
  try{ polishNav(); }catch(e){}
  try{ polishSectionSwitch(); }catch(e){}
}

var _v2InitStepsOrigV20 = v2InitSteps;
v2InitSteps = function(){
  _v2InitStepsOrigV20();
  try{ initV20(); }catch(e){ if(console&&console.error) console.error("v20 init:", e); }
};
