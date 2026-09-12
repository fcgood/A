/* ============================================================
   engine7 · 图表可读性重做（v2.0）
   1) 延迟初始化：隐藏 Tab 内不再创建 0×0 图表（这是"比例错误/挤成一团"的根因）
   2) 大盘走势图：加高 + Y 轴自动收紧 + 缩放 + 模式切换
   3) 五维雷达：加高 + 数值条
   4) 120 日评分走势：加高 + 边距 + 缩放
   ============================================================ */

/* ---------- 图表生命周期 ---------- */
var CHART_REGS = [];
function ensureChart(el){
  if(!el) return null;
  if(typeof echarts === "undefined") return null;
  var w = el.clientWidth, h = el.clientHeight;
  if(!(w > 80 && h > 60)) return null;          /* 不可见 / 尺寸异常 → 延迟 */
  if(!el._c){
    try{ el._c = echarts.init(el); }catch(e){ return null; }
    CHART_REGS.push(el);
  }
  return el._c;
}
function deferChart(el, fn){
  if(!el) return;
  el._pending = fn;
}
function flushCharts(){
  var secs = document.querySelectorAll("main section.on");
  for(var s=0;s<secs.length;s++){
    var list = secs[s].querySelectorAll(".chart");
    for(var i=0;i<list.length;i++){
      var el = list[i];
      if(el._pending){ var f = el._pending; el._pending = null; try{ f(); }catch(e){} }
      if(el._c){ try{ el._c.resize(); }catch(e){} }
    }
  }
  var all = document.querySelectorAll(".chart");
  for(var k=0;k<all.length;k++){
    if(all[k]._c){ try{ all[k]._c.resize(); }catch(e){} }
  }
}
function resizeAllCharts(){
  var all = document.querySelectorAll(".chart");
  for(var k=0;k<all.length;k++){
    if(all[k]._c && all[k].clientWidth > 80){ try{ all[k]._c.resize(); }catch(e){} }
  }
}

/* ---------- 工具：稳健 Y 轴区间 ---------- */
function tightRange(vals, padR, trim){
  var a = [];
  for(var i=0;i<vals.length;i++){ if(nn(vals[i])) a.push(vals[i]); }
  if(!a.length) return null;
  a.sort(function(x,y){ return x-y; });
  var lo, hi;
  if(trim && a.length > 12){
    var k = Math.max(1, Math.floor(a.length * 0.02));
    lo = a[k]; hi = a[a.length-1-k];
  }else{ lo = a[0]; hi = a[a.length-1]; }
  if(hi <= lo){ hi = lo + Math.max(Math.abs(lo)*0.004, 0.02); }
  var pad = (hi-lo) * (padR==null?0.10:padR);
  return {min: lo-pad, max: hi+pad};
}
function pctile(arr, p){
  var a = arr.filter(nn).slice().sort(function(x,y){return x-y;});
  if(!a.length) return null;
  var i = Math.min(a.length-1, Math.max(0, Math.round((a.length-1)*p)));
  return a[i];
}

/* ============================================================
   一、大盘走势图（重做）
   ============================================================ */
var IDXV = {span:60, mode:"norm", ma:false, fill:false};

function idxDefs(){
  return [["000001","上证指数","#f5a524"],
          ["399001","深证成指","#58a6ff"],
          ["399006","创业板指","#a371f7"]];
}

function renderIdxChart(){
  var el = $("idxChart"); if(!el) return;
  var run = function(){
    var defs = idxDefs();
    var dates = null, series = [], leg = [], allV = [], stats = [];
    var span = IDXV.span|0;
    for(var d=0; d<defs.length; d++){
      var cd = defs[d][0], nm = defs[d][1], color = defs[d][2];
      var an = getAn(cd); if(!an || !an.closes || !an.closes.length) continue;
      var N = (span>0 && span<an.dates.length) ? span : an.dates.length;
      var st = an.dates.length - N;
      var base = an.closes[st];
      if(!nn(base) || !base) continue;
      if(!dates) dates = an.dates.slice(st);
      var arr = [], i;
      if(IDXV.mode === "chg"){
        for(i=st;i<an.dates.length;i++){
          var c = an.closes[i];
          arr.push(nn(c) ? +(((c/base)-1)*100).toFixed(2) : null);
        }
      }else{
        for(i=st;i<an.dates.length;i++){
          var c2 = an.closes[i];
          arr.push(nn(c2) ? +((c2/base)*100).toFixed(2) : null);
        }
      }
      for(i=0;i<arr.length;i++) if(nn(arr[i])) allV.push(arr[i]);
      var last = arr[arr.length-1];
      var hi = Math.max.apply(null, arr.filter(nn));
      var lo = Math.min.apply(null, arr.filter(nn));
      var mdd = 0, peak = -Infinity;
      for(i=0;i<arr.length;i++){
        if(!nn(arr[i])) continue;
        if(arr[i] > peak) peak = arr[i];
        var dd = (IDXV.mode==="chg") ? (arr[i]-peak) : ((arr[i]/peak-1)*100);
        if(dd < mdd) mdd = dd;
      }
      var rets = [];
      for(i=1;i<arr.length;i++){ if(nn(arr[i])&&nn(arr[i-1])&&arr[i-1]!==0) rets.push(arr[i]/arr[i-1]-1); }
      var mu = rets.length ? rets.reduce(function(a,b){return a+b;},0)/rets.length : 0;
      var varr = rets.length ? rets.reduce(function(a,b){return a+(b-mu)*(b-mu);},0)/rets.length : 0;
      stats.push({nm:nm, color:color, last:last, hi:hi, lo:lo, mdd:mdd, vol:Math.sqrt(varr)*Math.sqrt(244)*100});
      var common = {
        name:nm, type:"line", data:arr, smooth:false, showSymbol:false,
        lineStyle:{width:2.1, color:color}, itemStyle:{color:color},
        emphasis:{focus:"series"}, z:5
      };
      if(IDXV.fill){
        common.areaStyle = {opacity:0.10, color:color};
      }
      series.push(common);
      if(IDXV.ma){
        var ma = [];
        for(i=st;i<an.dates.length;i++){
          var mv = an.ma20[i];
          ma.push(nn(mv) ? (IDXV.mode==="chg" ? +(((mv/base)-1)*100).toFixed(2) : +((mv/base)*100).toFixed(2)) : null);
        }
        series.push({name:nm+" MA20", type:"line", data:ma, smooth:true, showSymbol:false,
          lineStyle:{width:1, color:color, opacity:0.42, type:"dashed"}, z:2});
      }
      leg.push(nm);
    }
    if(!series.length){
      el.innerHTML = '<div class="empty">指数K线数据缺失（可在「数据后台」检查，或在个股诊断粘贴指数日K）</div>';
      if(el._c){ try{el._c.dispose();}catch(e){} el._c=null; }
      return;
    }
    var c = ensureChart(el);
    if(!c){ deferChart(el, run); return; }
    var rg = tightRange(allV, 0.12, false);
    if(!rg) rg = {min:null, max:null};
    var zeroLine = (IDXV.mode==="chg") ? 0 : 100;
    if(rg.min!=null && zeroLine < rg.min) rg.min = zeroLine - (rg.max-rg.min)*0.02;
    if(rg.max!=null && zeroLine > rg.max) rg.max = zeroLine + (rg.max-rg.min)*0.02;
    var mark = {silent:true, symbol:"none", data:[{
      yAxis:zeroLine,
      lineStyle:{color:"rgba(147,161,184,.45)", type:"dashed", width:1},
      label:{show:false}
    }]};
    series[0].markLine = mark;

    c.setOption({
      animation:false, backgroundColor:"transparent",
      grid:{left:66, right:26, top:52, bottom:66},
      legend:{data:leg, top:4, left:8, textStyle:{color:"#a9b6c9", fontSize:12.5},
        itemWidth:20, itemHeight:10, itemGap:18},
      tooltip:{trigger:"axis", backgroundColor:"rgba(19,26,37,.97)", borderColor:"#31405a",
        textStyle:{color:"#e8eef7", fontSize:12.5},
        axisPointer:{type:"cross", lineStyle:{color:"rgba(147,161,184,.4)"}},
        valueFormatter:function(v){ return v==null ? "—" : (+v).toFixed(2) + (IDXV.mode==="chg" ? "%" : ""); }},
      xAxis:{type:"category", data:dates||[], boundaryGap:false,
        axisLine:{lineStyle:{color:"#31405a"}},
        axisTick:{show:false},
        axisLabel:{color:"#93a1b8", fontSize:11.5,
          interval:Math.max(1, Math.floor((dates||[]).length/9))}},
      yAxis:{type:"value", min:rg.min, max:rg.max, scale:true,
        splitNumber:6,
        splitLine:{lineStyle:{color:"rgba(38,49,69,.55)"}},
        axisLabel:{color:"#93a1b8", fontSize:11.5,
          formatter:function(v){ return (IDXV.mode==="chg") ? v.toFixed(1)+"%" : v.toFixed(1); }},
        axisLine:{show:false}},
      dataZoom:[
        {type:"inside", start:0, end:100, zoomOnMouseWheel:true, moveOnMouseMove:false},
        {type:"slider", height:22, bottom:14, start:0, end:100,
          borderColor:"transparent", backgroundColor:"rgba(255,255,255,.03)",
          fillerColor:"rgba(76,141,255,.14)", handleStyle:{color:"#4c8dff"},
          dataBackground:{lineStyle:{color:"#3d4a60"}, areaStyle:{color:"rgba(61,74,96,.5)"}},
          textStyle:{color:"#7d8ca3", fontSize:10}}
      ],
      series:series
    }, true);

    /* 区间统计 */
    var box = $("idxStat");
    if(box){
      var h = "";
      for(var i=0;i<stats.length;i++){
        var s = stats[i];
        var up = (s.last!=null) && (IDXV.mode==="chg" ? s.last>=0 : s.last>=100);
        h += '<div class="logitem"><div class="k">'+esc(s.nm)+'</div>'+
             '<div class="v '+(up?"up":"down")+'">'+(s.last==null?"—":((s.last>0?"+":"")+s.last.toFixed(2)+(IDXV.mode==="chg"?"%":"")))+'</div>'+
             '<div class="ds muted" style="font-size:11.5px;margin-top:4px">'+
             '区间高 '+s.hi.toFixed(1)+' / 低 '+s.lo.toFixed(1)+'<br>'+
             '最大回撤 '+s.mdd.toFixed(2)+(IDXV.mode==="chg"?"%":"")+
             ' · 年化波动 '+s.vol.toFixed(1)+'%</div></div>';
      }
      box.innerHTML = h;
    }
  };
  run();
}

/* ============================================================
   二、五维雷达（加高 + 数值条）
   ============================================================ */
function renderRadar(an){
  var el = $("radarChart"); if(!el) return;
  var run = function(){
    var c = ensureChart(el);
    if(!c){ deferChart(el, run); return; }
    try{
      var d = an.score.dims, cap = an.score.caps;
      var keys = Object.keys(d);
      c.setOption({
        animation:false, backgroundColor:"transparent",
        tooltip:{backgroundColor:"rgba(19,26,37,.97)", borderColor:"#263145",
          textStyle:{color:"#e8eef7", fontSize:13},
          formatter:function(){
            var s = "";
            for(var i=0;i<keys.length;i++) s += keys[i]+"："+d[keys[i]]+" / "+cap[keys[i]]+"<br>";
            return s + "<b>总分 "+an.score.total+"（"+an.score.label+"）</b>";
          }},
        radar:{
          indicator: keys.map(function(k){ return {name:k, max:cap[k]}; }),
          radius:"70%", center:["50%","52%"],
          shape:"polygon", splitNumber:4,
          axisName:{color:"#c3cfdd", fontSize:13, fontWeight:500,
            backgroundColor:"rgba(255,255,255,.04)", borderRadius:4, padding:[4,6]},
          splitLine:{lineStyle:{color:"rgba(38,49,69,.95)", width:1}},
          splitArea:{areaStyle:{color:["rgba(255,255,255,.02)","rgba(255,255,255,.045)"]}},
          axisLine:{lineStyle:{color:"rgba(38,49,69,.95)"}}
        },
        series:[{type:"radar", symbolSize:6,
          data:[{value:keys.map(function(k){return d[k];}), name:"当前",
            lineStyle:{color:ACC, width:2.4}, itemStyle:{color:ACC},
            areaStyle:{color:"rgba(76,141,255,.26)"}}]}]
      }, true);
    }catch(e){}
    /* 数值条：比雷达更直观 */
    var box = $("radarBars");
    if(box){
      var h = "";
      for(var i=0;i<keys.length;i++){
        var k = keys[i], v = d[k], cp = cap[k];
        var r = cp ? Math.max(0, Math.min(100, v/cp*100)) : 0;
        var col = r>=66 ? UP : (r>=40 ? WARN : DOWN);
        h += '<div style="margin-bottom:7px">'+
          '<div style="display:flex;justify-content:space-between;font-size:12.5px;margin-bottom:2px">'+
            '<span>'+esc(k)+'</span><span><b class="'+(r>=66?"up":(r>=40?"":"down"))+'">'+v+'</b> <span class="muted">/ '+cp+'</span></span></div>'+
          '<div class="pnbar"><i style="width:'+r.toFixed(1)+'%;background:'+col+'"></i></div></div>';
      }
      box.innerHTML = h;
    }
  };
  run();
}

/* ============================================================
   三、近 120 日技术评分走势（加高 + 边距 + 缩放）
   ============================================================ */
function renderScoreTrend(an){
  var el = $("scoreChart"); if(!el) return;
  var run = function(){
    var c = ensureChart(el);
    if(!c){ deferChart(el, run); return; }
    var h = an.hist || [];
    if(!h.length){ c.clear(); return; }
    var xs = h.map(function(x){ return x.date; });
    var vs = h.map(function(x){ return x.v; });
    var cur = vs[vs.length-1];
    var mn = Math.min.apply(null, vs.filter(nn));
    var mx = Math.max.apply(null, vs.filter(nn));
    var loY = Math.max(0, Math.floor((mn-6)/10)*10);
    var hiY = Math.min(100, Math.ceil((mx+6)/10)*10);
    if(hiY - loY < 40){ loY = Math.max(0, loY-10); hiY = Math.min(100, hiY+10); }
    c.setOption({
      animation:false, backgroundColor:"transparent",
      grid:{left:46, right:20, top:22, bottom:44},
      tooltip:{trigger:"axis", backgroundColor:"rgba(19,26,37,.97)", borderColor:"#263145",
        textStyle:{color:"#e8eef7", fontSize:12.5},
        formatter:function(p){ return p[0].name + "　评分 " + p[0].value; }},
      xAxis:{type:"category", data:xs, boundaryGap:false,
        axisLine:{lineStyle:{color:"#31405a"}}, axisTick:{show:false},
        axisLabel:{color:"#8b98ab", fontSize:11,
          interval:Math.max(1, Math.floor(xs.length/6))}},
      yAxis:{type:"value", min:loY, max:hiY, interval:20,
        splitLine:{lineStyle:{color:"rgba(38,49,69,.55)"}},
        axisLabel:{color:"#8b98ab", fontSize:11}, axisLine:{show:false}},
      dataZoom:[{type:"inside", start:0, end:100}],
      series:[{
        type:"line", data:vs, smooth:true, showSymbol:false,
        lineStyle:{width:2.2, color:ACC},
        areaStyle:{color:{type:"linear", x:0,y:0,x2:0,y2:1,
          colorStops:[{offset:0,color:"rgba(76,141,255,.36)"},{offset:1,color:"rgba(76,141,255,0)"}]}},
        markPoint:{symbolSize:0, data:[{coord:[xs.length-1, cur],
          label:{show:true, position:"top", distance:8, formatter:String(cur),
            color:"#e8eef7", fontSize:12, fontWeight:"bold"}}]},
        markLine:{silent:true, symbol:"none", data:[
          {yAxis:60, lineStyle:{color:"rgba(34,197,94,.5)", type:"dashed", width:1},
           label:{formatter:"偏强 60", color:"#6ee79f", fontSize:10.5, position:"insideEndTop"}},
          {yAxis:40, lineStyle:{color:"rgba(255,77,79,.5)", type:"dashed", width:1},
           label:{formatter:"偏弱 40", color:"#ff8f8f", fontSize:10.5, position:"insideEndBottom"}}
        ]}
      }]
    }, true);
  };
  run();
}

/* ============================================================
   四、Tab 切换时刷新图表尺寸
   ============================================================ */
var _tab7 = (typeof tab === "function") ? tab : null;
tab = function(id){
  if(_tab7) _tab7(id);
  try{ flushCharts(); }catch(e){}
  if(id === "market"){ try{ renderIdxChart(); }catch(e){} }
  if(id === "admin"){ try{ renderAdmin(); }catch(e){} }
  if(id === "alerts"){ try{ renderAlerts(); }catch(e){} }
  if(id === "help"){ try{ renderAbout(); }catch(e){} }
};
try{
  var _rt = null;
  window.addEventListener("resize", function(){
    if(_rt) clearTimeout(_rt);
    _rt = setTimeout(function(){ resizeAllCharts(); }, 140);
  });
}catch(e){}
