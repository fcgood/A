/* ============================================================
   engine5 · K线重做 / 报告富文本 / 批量解析 / 对比图 / 复盘笔记
   （后加载，覆盖 engine2 的同名函数）
   全局常量（NAME_IDX / KL / REP / CMP / CMP_COLOR）在 engine0.js
   ============================================================ */

/* ---------------- 名称反查：代码 / 中文名 / 拼音首字母 ---------------- */
function lookupName(q){
  if(q==null)return null;
  q=String(q).trim().toLowerCase();
  if(!q)return null;
  if(typeof NAME_IDX==="undefined"||!NAME_IDX)return null;
  var codes=Object.keys(NAME_IDX),i,v;
  for(i=0;i<codes.length;i++){
    if(codes[i]===q)return {code:codes[i],name:NAME_IDX[codes[i]].name};
  }
  for(i=0;i<codes.length;i++){
    v=NAME_IDX[codes[i]];
    if(v.name===q)return {code:codes[i],name:v.name};
  }
  for(i=0;i<codes.length;i++){
    v=NAME_IDX[codes[i]];
    if(v.py&&v.py.indexOf(q)===0)return {code:codes[i],name:v.name};
  }
  for(i=0;i<codes.length;i++){
    v=NAME_IDX[codes[i]];
    if(v.name.indexOf(q)>=0)return {code:codes[i],name:v.name};
  }
  try{
    var hs=state.holdings||[];
    for(i=0;i<hs.length;i++){
      if(hs[i].code===q||String(hs[i].name).indexOf(q)>=0)return {code:hs[i].code,name:hs[i].name};
    }
  }catch(e){}
  return null;
}
function nameOf(code){
  if(!code)return "";
  if(typeof NAME_IDX!=="undefined"&&NAME_IDX&&NAME_IDX[code])return NAME_IDX[code].name;
  try{
    var hs=state.holdings||[];
    for(var i=0;i<hs.length;i++)if(hs[i].code===code)return hs[i].name;
    var sk=state.stocks&&state.stocks[code];
    if(sk&&sk.name)return sk.name;
  }catch(e){}
  return "";
}

/* ---------------- 批量解析 ----------------
   支持：600519 贵州茅台 / 600519,贵州茅台 / 600519 /
        贵州茅台 / zxtx / sh600519 / 600519.SH
        分隔符：换行、逗号、中文逗号、顿号、分号、制表符、竖线
------------------------------------------------ */
var IDX_CODES={"399001":1,"399006":1,"000688":1,"000300":1,"000905":1,
  "000852":1,"899050":1,"000016":1,"000010":1};
var LINE_SPLIT=/[\r\n;；]+/;
var PART_SPLIT=/[,，、\t|]+/;
var CODE_RE=/(\d{6})/;
var NUM_ONLY=/^\d+$/;

function parseBatch(text){
  var out=[];
  if(!text)return out;
  var lines=String(text).split(LINE_SPLIT);
  for(var i=0;i<lines.length;i++){
    var ln=lines[i].trim(); if(!ln)continue;
    var parts=ln.split(PART_SPLIT);
    var code=null,nm="";
    for(var j=0;j<parts.length;j++){
      var p=String(parts[j]).trim(); if(!p)continue;
      var mc=p.match(CODE_RE);
      if(mc){
        if(!code)code=mc[1];
        var rest=p.replace(CODE_RE,"");
        rest=rest.replace(/^(sh|sz|bj)/i,"").replace(/\.(sh|sz|bj)$/i,"");
        rest=rest.replace(/^[.．,，、\s]+|[.．,，、\s]+$/g,"").trim();
        if(rest&&rest.length<=14&&!NUM_ONLY.test(rest)&&!nm)nm=rest;
        continue;
      }
      var np=p.replace(/^(sh|sz|bj)/i,"").replace(/\.(sh|sz|bj)$/i,"").trim();
      if(!NUM_ONLY.test(np)&&np.length<=14&&!nm)nm=np;
    }
    if(!code){
      var r=lookupName(nm||ln);
      if(r)out.push({code:r.code,name:r.name});
      continue;
    }
    if(!nm)nm=nameOf(code);
    out.push({code:code,name:nm||("代码"+code)});
  }
  /* 去重 + 类型判定 */
  var seen={},res=[];
  out.forEach(function(x){
    if(seen[x.code])return; seen[x.code]=1;
    var t="A";
    if(/^(159|51|58|56|52|16)/.test(x.code))t="ETF";
    else if(IDX_CODES[x.code]||(x.code==="000001"&&/上证/.test(x.name)))t="IDX";
    res.push({code:x.code,name:x.name,type:t});
  });
  return res;
}

/* ============================================================
   K 线 —— 彻底重做（像素化 grid + 严格量程 + 宽度自适应）
   ============================================================ */
function klineRange(an,s,e){
  s=Math.max(0,s|0); e=Math.min(an.dates.length-1,e|0);
  if(e<s)e=s;
  var lo=Infinity,hi=-Infinity,k,v;
  /* 1) 基准 = 可见窗口蜡烛高低 */
  for(k=s;k<=e;k++){
    v=an.lows[k];  if(nn(v)&&v<lo)lo=v;
    v=an.highs[k]; if(nn(v)&&v>hi)hi=v;
  }
  if(!isFinite(lo)||!isFinite(hi)||hi<=lo){ lo=an.close*0.90; hi=an.close*1.10; }
  var baseLo=lo, baseHi=hi;
  var base=Math.max(hi-lo, Math.abs(an.close)*0.004, 1e-6);
  /* 2) 辅助线只纳入基准 ±18% 以内，避免把蜡烛压扁 */
  var lim=base*0.18;
  var ex=[an.ma5,an.ma10,an.ma20,an.ma60,an.bl.lo,an.bl.up,an.bl.mid];
  for(k=s;k<=e;k++){
    for(var j=0;j<ex.length;j++){
      var a=ex[j]; if(!a)continue;
      v=a[k]; if(!nn(v))continue;
      if(v>=baseLo-lim&&v<=baseHi+lim){ if(v<lo)lo=v; if(v>hi)hi=v; }
    }
  }
  if(lo<=0&&baseLo>0)lo=Math.max(baseLo-base*0.15, baseLo*0.5);
  /* 3) 上下各留 8% 空白 */
  var span=Math.max(hi-lo, base);
  var pad=span*0.08;
  var dec=(an.close!=null&&an.close<5)?3:2;
  return {min:+(lo-pad).toFixed(dec), max:+(hi+pad).toFixed(dec)};
}

function klGeom(el){
  var H=(el&&el.clientHeight)||KL.h||700;
  var W=(el&&el.clientWidth)||980;
  H=Math.max(420,H);
  var topPad=30, dzH=20;
  var avail=H-topPad-dzH-14;
  var gap=12;
  var mainH=Math.round(avail*0.615);
  var volH=Math.round(avail*0.135);
  var subH=Math.max(70, avail-mainH-volH-gap*2);
  return {H:H,W:W,mainH:mainH,volH:volH,subH:subH,gap:gap,
    topPad:topPad,
    g1Top:topPad+mainH+gap,
    g2Top:topPad+mainH+gap+volH+gap};
}
/* 视野内舒适的根数 */
function autoBars(W){
  var plot=Math.max(160,(W||980)-128);
  return Math.max(18, Math.min(150, Math.floor(plot/9)));
}

function drawKline(){
  var an=curViewAn(); if(!an)return;
  var el=$("klineChart"); if(!el)return;
  if(typeof echarts==="undefined"){
    el.innerHTML='<div class="empty">图表库 echarts.min.js 未加载（需与 index.html 同目录）</div>';return;
  }
  el.style.height=(KL.h||700)+"px";
  if(!el._c)el._c=echarts.init(el); else { try{el._c.resize();}catch(e){} }
  var chart=el._c;
  var dates=an.dates, n=dates.length;
  var candle=dates.map(function(d,k){return [an.opens[k],an.closes[k],an.lows[k],an.highs[k]];});
  var showSig=$("ckSignal")&&$("ckSignal").checked;
  var showLv=$("ckLevel")&&$("ckLevel").checked;
  var showCh=$("ckChan")&&$("ckChan").checked;
  var showMA=(CUR.main==="ma"||CUR.main==="both");
  var showBOLL=(CUR.main==="boll"||CUR.main==="both");

  /* ---- 视野 ---- */
  var span=(CUR.span==null?60:CUR.span);
  if(span>0&&span>n)span=n;
  var bars=span>0?span:n;
  var s0=span>0?Math.max(0,n-span):0;
  var startZoom=(span>0&&n>span)?(100-span*100/n):0;
  var rg=klineRange(an,s0,n-1);

  /* ---- 几何 ---- */
  var G=klGeom(el);
  var barW=(G.W-136)/Math.max(1,bars);
  var thin=barW<5;

  /* ---- 主图 series ---- */
  var main=[{
    name:"K线",type:"candlestick",data:candle,
    barMaxWidth:26, barMinWidth:1,
    itemStyle:{color:UP,color0:DOWN,
      borderColor:thin?"rgba(255,120,120,0)":"#ff7875",
      borderColor0:thin?"rgba(74,222,128,0)":"#4ade80",
      borderWidth:thin?0:1},
    z:5
  }];
  if(showSig){
    var mp=buildMarkPoint(an);
    if(mp&&mp.data&&mp.data.length)main[0].markPoint=mp;
  }
  if(showLv)main[0].markLine=buildMarkLine(an,rg);
  var atrv=nn(an.atr[an.i])?an.atr[an.i]:null;
  if(nn(an.poc.poc)&&atrv!=null&&KL.autoY!==false){
    var a1=+(an.poc.poc-atrv*0.75).toFixed(3), a2=+(an.poc.poc+atrv*0.75).toFixed(3);
    if(a2>rg.min&&a1<rg.max){
      main[0].markArea={silent:true,itemStyle:{color:"rgba(227,179,65,.10)"},
        data:[[{yAxis:Math.max(a1,rg.min),label:{show:true,position:"insideStartTop",
          formatter:"AI 博弈区",color:"#e3b341",fontSize:10}},{yAxis:Math.min(a2,rg.max)}]]};
    }
  }
  /* 最新价标签 */
  var mpData=[{coord:[n-1,an.close],value:an.close,symbol:"circle",symbolSize:0,
    label:{show:true,position:"right",distance:9,formatter:f2(an.close),
      backgroundColor:(num(an.chg)||0)>=0?UP:DOWN,borderRadius:3,padding:[4,6],
      color:"#0d1117",fontSize:12,fontWeight:"bold"}}];
  if(!main[0].markPoint)main[0].markPoint={symbolSize:1,data:mpData};
  else main[0].markPoint.data=(main[0].markPoint.data||[]).concat(mpData);

  if(showMA){
    var mal=(KLSET&&KLSET.ma&&KLSET.ma.length)?KLSET.ma:[5,10,20,60];
    for(var mi=0;mi<mal.length;mi++){
      var mN=mal[mi], md=maLineData(an,mN);
      if(!md)continue;
      main.push({name:"MA"+mN,type:"line",data:md,smooth:true,showSymbol:false,
        lineStyle:{width:(mN>=60?1.6:1.2),color:(MA_META[mN]||"#8b949e"),opacity:(mN===10?0.7:1)},z:3});
    }
  }
  if(showBOLL){
    main.push({name:"BOLL上",type:"line",data:an.bl.up,smooth:true,showSymbol:false,lineStyle:{width:1,color:"#5c6b80",opacity:.7},z:2});
    main.push({name:"BOLL中",type:"line",data:an.bl.mid,smooth:true,showSymbol:false,lineStyle:{width:1,color:"#5c6b80",opacity:.55,type:"dashed"},z:2});
    main.push({name:"BOLL下",type:"line",data:an.bl.lo,smooth:true,showSymbol:false,lineStyle:{width:1,color:"#5c6b80",opacity:.7},z:2});
  }
  if(showCh&&an.chan){
    main.push({name:"通道上轨",type:"line",data:an.chan.up,showSymbol:false,lineStyle:{width:1,color:"#ffd166",opacity:.5,type:"dashed"},z:1});
    main.push({name:"通道下轨",type:"line",data:an.chan.lo,showSymbol:false,lineStyle:{width:1,color:"#ffd166",opacity:.5,type:"dashed"},z:1});
  }

  /* ---- 成交量 ---- */
  var volMA5=dates.map(function(d,k){return avgVol(an.vols,5,k);});
  var volData=dates.map(function(d,k){return {value:an.vols[k],
    itemStyle:{color:(an.closes[k]>=an.opens[k]?"rgba(255,77,79,.62)":"rgba(34,197,94,.58)")}};});
  var volS=[{name:"VOL",type:"bar",xAxisIndex:1,yAxisIndex:1,data:volData},
    {name:"VOL MA5",type:"line",xAxisIndex:1,yAxisIndex:1,data:volMA5,showSymbol:false,lineStyle:{width:1,color:"#f5a524"}}];

  /* ---- 副图 ---- */
  var subS=[],subName="MACD";
  if(CUR.sub==="macd"){
    subName="MACD(12,26,9)";
    subS=[
      {name:"DIF",type:"line",xAxisIndex:2,yAxisIndex:2,data:an.dif,showSymbol:false,lineStyle:{width:1.3,color:"#58a6ff"}},
      {name:"DEA",type:"line",xAxisIndex:2,yAxisIndex:2,data:an.dea,showSymbol:false,lineStyle:{width:1.3,color:"#f5a524"}},
      {name:"MACD",type:"bar",xAxisIndex:2,yAxisIndex:2,barMaxWidth:22,
        data:an.bar.map(function(b){return {value:b,itemStyle:{color:b>=0?"rgba(255,77,79,.8)":"rgba(34,197,94,.75)"}};})}
    ];
  } else if(CUR.sub==="kdj"){
    subName="KDJ(9,3,3)";
    subS=[
      {name:"K",type:"line",xAxisIndex:2,yAxisIndex:2,data:an.K,showSymbol:false,lineStyle:{width:1.3,color:"#58a6ff"}},
      {name:"D",type:"line",xAxisIndex:2,yAxisIndex:2,data:an.D,showSymbol:false,lineStyle:{width:1.3,color:"#f5a524"}},
      {name:"J",type:"line",xAxisIndex:2,yAxisIndex:2,data:an.J,showSymbol:false,lineStyle:{width:1,color:"#a371f7"}}
    ];
  } else {
    subName="RSI(6/14)";
    subS=[
      {name:"RSI6",type:"line",xAxisIndex:2,yAxisIndex:2,data:an.r6,showSymbol:false,lineStyle:{width:1.2,color:"#58a6ff"}},
      {name:"RSI14",type:"line",xAxisIndex:2,yAxisIndex:2,data:an.r,showSymbol:false,lineStyle:{width:1.3,color:"#f5a524"},
        markLine:{silent:true,symbol:"none",data:[
          {yAxis:70,lineStyle:{color:"rgba(255,77,79,.45)",type:"dashed",width:1},label:{formatter:"超买70",color:"#ff8f8f",fontSize:10,position:"insideEndTop"}},
          {yAxis:30,lineStyle:{color:"rgba(34,197,94,.45)",type:"dashed",width:1},label:{formatter:"超卖30",color:"#6ee79f",fontSize:10,position:"insideEndBottom"}}
        ]}}
    ];
  }

  var dec=(an.close!=null&&an.close<5)?3:2;
  chart.setOption({
    animation:false,
    backgroundColor:"transparent",
    legend:{data:(function(){
        var L=[];
        for(var q=0;q<main.length;q++){ if(main[q].name)L.push(main[q].name); }
        return L;
      })(),
      top:2,textStyle:{color:"#93a1b8",fontSize:11},itemWidth:16,itemHeight:9,
      itemGap:10,inactiveColor:"#3d4a60"},
    tooltip:{
      trigger:"axis",axisPointer:{type:(KLSET&&KLSET.cross===false?"line":"cross"),
        lineStyle:{color:"#5c6b80"},crossStyle:{color:"#5c6b80"}},
      backgroundColor:"rgba(19,26,37,.97)",borderColor:"#31405a",borderWidth:1,
      textStyle:{color:"#e8eef7",fontSize:12.5},
      formatter:function(ps){
        if(!ps||!ps.length)return "";
        var k=ps[0].dataIndex;
        var c=an.closes[k],o=an.opens[k],h=an.highs[k],l=an.lows[k];
        var pc=an.closes[k-1]?((c-an.closes[k-1])/an.closes[k-1]*100):null;
        var v=an.vols[k], vr=an.vrs[k];
        var col=pc==null?"#c7d3e3":(pc>=0?UP:DOWN);
        var s='<div style="font-weight:700;font-size:13px;margin-bottom:5px">'+an.dates[k]
          +(an.isWeekly?' <span style="color:#93a1b8">周</span>':'')+'</div>';
        s+='<div style="color:'+col+'">开 '+f2(o)+'　高 '+f2(h)+'　低 '+f2(l)+'　收 <b>'+f2(c)+'</b>　'
          +(pc==null?"":(pc>=0?"+":"")+pc.toFixed(2)+"%")+'</div>';
        s+='<div style="color:#93a1b8">量 '+(v!=null?(v/1e4).toFixed(1)+"万手":"—")
          +(nn(vr)?'　量比 '+vr.toFixed(2):'')+'</div>';
        var row=function(nm,a,b,cc){
          var va=a[k],vb=b[k];
          return '<div style="color:'+(cc||"#c7d3e3")+'">'+nm+' '+(nn(va)?f2(va):"—")+' / '+(nn(vb)?f2(vb):"—")+'</div>';};
        s+=row("MA5/20",an.ma5,an.ma20,"#79c0ff");
        s+=row("MA10/60",an.ma10,an.ma60,"#a371f7");
        s+=row("DIF/DEA",an.dif,an.dea,"#58a6ff");
        s+='<div>RSI14 '+(nn(an.r[k])?f1(an.r[k]):"—")+'　RSI6 '+(nn(an.r6[k])?f1(an.r6[k]):"—")+'</div>';
        s+='<div>KDJ '+(nn(an.K[k])?f2(an.K[k]):"—")+' / '+(nn(an.D[k])?f2(an.D[k]):"—")+' / '+(nn(an.J[k])?f2(an.J[k]):"—")+'</div>';
        var sg=(an.sigs||[]).filter(function(x){return x.i===k;});
        if(sg.length)s+='<div style="margin-top:5px;border-top:1px solid #31405a;padding-top:5px">'
          +sg.map(function(x){return '<span style="color:'+(x.side==="b"?UP:(x.side==="s"?DOWN:"#93a1b8"))+'">'
          +(x.side==="b"?"▲ ":"▼ ")+x.nm+(x.st>=2?"（强）":"")+'</span>';}).join("<br>")+'</div>';
        return s;
      }
    },
    axisPointer:{link:[{xAxisIndex:"all"}]},
    grid:[
      {left:62,right:74,top:G.topPad,height:G.mainH},
      {left:62,right:74,top:G.g1Top,height:G.volH},
      {left:62,right:74,top:G.g2Top,height:G.subH}
    ],
    xAxis:[
      {type:"category",data:dates,gridIndex:0,axisLine:{lineStyle:{color:"#31405a"}},axisLabel:{show:false},
       splitLine:{show:false},axisPointer:{label:{show:false}}},
      {type:"category",data:dates,gridIndex:1,axisLine:{lineStyle:{color:"#31405a"}},axisLabel:{show:false},
       splitLine:{show:false},axisPointer:{label:{show:false}}},
      {type:"category",data:dates,gridIndex:2,axisLine:{lineStyle:{color:"#31405a"}},
       axisLabel:{color:"#93a1b8",fontSize:10.5,interval:Math.max(1,Math.floor(bars/7))},
       splitLine:{show:false}}
    ],
    yAxis:[
      {type:(KLSET&&KLSET.log?"log":"value"),scale:true,gridIndex:0,position:"left",
       min:(KLSET&&KLSET.log&&!(rg.min>0)?null:rg.min),
       max:(KLSET&&KLSET.log&&!(rg.max>0)?null:rg.max),splitNumber:6,
       splitLine:{lineStyle:{color:"rgba(38,49,69,.5)"}},
       axisLabel:{color:"#93a1b8",fontSize:11,formatter:function(v){return v.toFixed(dec);}},
       axisLine:{show:false},axisPointer:{label:{backgroundColor:"#1a2231",color:"#e8eef7",fontSize:11}}},
      {scale:true,gridIndex:1,position:"left",splitNumber:2,
       splitLine:{lineStyle:{color:"rgba(38,49,69,.3)"}},axisLabel:{color:"#6b7a91",fontSize:9.5},axisLine:{show:false}},
      {scale:true,gridIndex:2,position:"left",splitNumber:2,
       min:(CUR.sub==="rsi"?0:null),max:(CUR.sub==="rsi"?100:null),
       splitLine:{lineStyle:{color:"rgba(38,49,69,.3)"}},axisLabel:{color:"#6b7a91",fontSize:9.5},axisLine:{show:false},
       name:subName,nameTextStyle:{color:"#6b7a91",fontSize:9.5},nameGap:8}
    ],
    dataZoom:[
      {type:"inside",xAxisIndex:[0,1,2],start:startZoom,end:100,zoomOnMouseWheel:true,moveOnMouseMove:true},
      {type:"slider",xAxisIndex:[0,1,2],start:startZoom,end:100,height:18,bottom:2,
       borderColor:"#31405a",fillerColor:"rgba(76,141,255,.14)",
       handleStyle:{color:"#4c8dff"},textStyle:{color:"#6b7a91",fontSize:9},
       dataBackground:{lineStyle:{color:"#31405a"},areaStyle:{color:"rgba(76,141,255,.08)"}}}
    ],
    series:main.concat(volS,subS)
  },true);

  /* 缩放 / 平移后重算主图量程 */
  if(!chart._dz){
    chart._dz=1;
    chart.on("dataZoom",function(){
      var a2=curViewAn(); if(!a2)return;
      if(KL.autoY===false)return;
      var N=a2.dates.length; var s=0,e=N-1;
      try{
        var opt=chart.getOption();
        var dz=(opt&&opt.dataZoom&&opt.dataZoom[0])||{};
        var st=(dz.start!=null?dz.start:0), en=(dz.end!=null?dz.end:100);
        s=Math.floor(N*st/100); e=Math.min(N-1,Math.ceil(N*en/100)-1);
      }catch(err){}
      var r2=klineRange(a2,s,e);
      chart.setOption({yAxis:[{min:r2.min,max:r2.max}]});
      klInfo(a2,s,e,r2);
    });
  }
  klInfo(an,s0,n-1,rg);
}

/* K 线状态条：让用户看见"为什么这么画" */
function klInfo(an,s,e,rg){
  var box=$("klineInfo"); if(!box)return;
  var n=an.dates.length, bars=Math.max(1,e-s+1);
  var el=$("klineChart");
  var plotW=Math.max(160,((el&&el.clientWidth)||980)-136);
  var bw=plotW/bars;
  var dHi=-Infinity,dLo=Infinity;
  for(var k=s;k<=e;k++){ if(an.highs[k]>dHi)dHi=an.highs[k]; if(an.lows[k]<dLo)dLo=an.lows[k]; }
  var ratio=(isFinite(dHi)&&isFinite(dLo)&&rg.max>rg.min)?((dHi-dLo)/(rg.max-rg.min)*100):0;
  var warn="";
  if(bw<4)warn=' <b style="color:#ffd48a">（蜡烛过密，建议切到 60/90 根或点「大图」）</b>';
  else if(ratio<55)warn=' <b style="color:#ffd48a">（纵向占比偏低，已自动收紧量程）</b>';
  box.innerHTML='可见 <b>'+bars+'</b>/'+n+' 根　每根约 <b>'+bw.toFixed(1)+'px</b>'
    +'　主图量程 <b>'+rg.min+' ~ '+rg.max+'</b>'
    +'　蜡烛纵向占比 <b style="color:'+(ratio>=70?"#6ee79f":"#ffd48a")+'">'+ratio.toFixed(0)+'%</b>'
    +'　'+(an.isWeekly?"周线":"日线")+warn;
}

/* 支撑压力线：只画落在量程内的，减少视觉噪音 */
function buildMarkLine(an,rg){
  var data=[];
  function inR(v){ return rg&&nn(v)&&v>=rg.min&&v<=rg.max; }
  (an.supAll||[]).slice(0,3).forEach(function(l){
    if(!inR(l.v))return;
    data.push({yAxis:l.v,name:l.t,
      lineStyle:{color:"rgba(34,197,94,.5)",type:"dashed",width:1},
      label:{formatter:"支撑 "+l.t+" "+f2(l.v),position:"insideEndTop",color:"#6ee79f",fontSize:10}});
  });
  (an.resAll||[]).slice(0,3).forEach(function(l){
    if(!inR(l.v))return;
    data.push({yAxis:l.v,name:l.t,
      lineStyle:{color:"rgba(255,77,79,.5)",type:"dashed",width:1},
      label:{formatter:"压力 "+l.t+" "+f2(l.v),position:"insideEndBottom",color:"#ff8f8f",fontSize:10}});
  });
  return {silent:true,symbol:"none",animation:false,data:data};
}

/* ============================================================
   报告富文本渲染（Markdown 纯文本 -> 层级清晰的 HTML）
   ============================================================ */
function mdInline(t){
  return String(t)
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
    .replace(/\*\*(.+?)\*\*/g,"<b>$1</b>");
}
function renderReportRich(md){
  var lines=String(md).split("\n"), out=[], toc=[], sec=0;
  var inTable=false, tbl=[];
  function flushTable(){
    if(!tbl.length)return;
    var body=tbl.filter(function(r){return !/^\s*\|?[\s\-:|]+\|?\s*$/.test(r);});
    if(body.length){
      var head=body[0].replace(/^\s*\|/,"").replace(/\|\s*$/,"").split("|").map(function(x){return x.trim();});
      var h='<table><thead><tr>'+head.map(function(c){return "<th>"+mdInline(c)+"</th>";}).join("")+"</tr></thead><tbody>";
      for(var i=1;i<body.length;i++){
        var cells=body[i].replace(/^\s*\|/,"").replace(/\|\s*$/,"").split("|").map(function(x){return x.trim();});
        h+="<tr>"+cells.map(function(c){
          var cls=/^[+\-]?\d/.test(c)?(/^\+/.test(c)?" class=\"r-up\"":(/^-/.test(c)?" class=\"r-dn\"":"")):"";
          return "<td"+cls+">"+mdInline(c)+"</td>";}).join("")+"</tr>";
      }
      h+="</tbody></table>";
      out.push(h);
    }
    tbl=[];
  }
  for(var i=0;i<lines.length;i++){
    var ln=lines[i];
    var tr=ln.trim();
    if(/^\s*\|/.test(ln)){ inTable=true; tbl.push(ln.replace(/\s+$/,"")); continue; }
    if(inTable){ flushTable(); inTable=false; }
    if(!tr)continue;
    if(/^─{4,}/.test(tr)||/^-{6,}$/.test(tr)){ out.push("<hr>"); continue; }
    var m;
    if((m=tr.match(/^####\s+(.*)$/))){ out.push('<span class="r-h4">'+mdInline(m[1])+"</span>"); continue; }
    if((m=tr.match(/^###\s+(.*)$/))){ out.push('<span class="r-h3">'+mdInline(m[1])+"</span>"); continue; }
    if((m=tr.match(/^##\s+(.*)$/))){
      sec++; var id="s"+sec; toc.push([id,mdInline(m[1])]);
      out.push('<span class="r-h2" id="'+id+'">'+mdInline(m[1])+"</span>"); continue;
    }
    if((m=tr.match(/^#\s+(.*)$/))){
      out.push('<div style="font-size:1.35em;font-weight:800;color:#fff;margin:6px 0 4px">'+mdInline(m[1])+"</div>"); continue;
    }
    if(/^■/.test(tr)){
      out.push('<span class="r-h3">'+mdInline(tr.replace(/^■\s*/,""))+"</span>"); continue;
    }
    if((m=tr.match(/^\s{2,}[·•]\s*(.*)$/))){
      out.push('<span class="r-li" style="padding-left:34px;opacity:.92">'+mdInline(m[1])+"</span>"); continue;
    }
    if((m=tr.match(/^[·•]\s*(.*)$/))){
      out.push('<span class="r-li">'+mdInline(m[1])+"</span>"); continue;
    }
    out.push("<div>"+mdInline(ln)+"</div>");
  }
  if(inTable)flushTable();
  var tocHtml=toc.length?('<div class="r-toc"><div style="font-weight:700;color:#fff;margin-bottom:6px">目录</div>'
    +toc.map(function(t){return '<a href="#'+t[0]+'">'+t[1]+"</a>";}).join("")+"</div>"):"";
  return tocHtml+out.join("\n");
}
function setReport(md){
  REP.raw=md||"";
  var el=$("reportOut"); if(!el)return;
  el.className=REP.fs;
  if(REP.mode==="raw"){ el.style.whiteSpace="pre-wrap"; el.textContent=REP.raw; }
  else { el.style.whiteSpace="normal"; el.innerHTML=renderReportRich(REP.raw); }
}

/* ============================================================
   多标的走势对比
   ============================================================ */
function renderCmpPick(){
  var box=$("cmpPick"); if(!box)return;
  var list=(state.holdings||[]).slice();
  try{
    ["000001","399001","399006"].forEach(function(c){
      var ex=false;
      for(var i=0;i<list.length;i++)if(list[i].code===c)ex=true;
      if(!ex&&state.stocks&&state.stocks[c])list.push({code:c,name:nameOf(c)||c,type:"IDX"});
    });
  }catch(e){}
  if(!CMP.sel.length)CMP.sel=list.slice(0,4).map(function(h){return h.code;});
  box.innerHTML=list.map(function(h){
    var on=CMP.sel.indexOf(h.code)>=0?" on":"";
    return '<label class="'+on.trim()+'"><input type="checkbox" data-c="'+h.code+'"'+(on?" checked":"")+'>'
      +esc(h.name)+"</label>";
  }).join("");
  var cbs=box.querySelectorAll("input");
  for(var i=0;i<cbs.length;i++){
    cbs[i].onchange=function(){
      var c=this.getAttribute("data-c");
      if(this.checked){
        if(CMP.sel.length>=6){this.checked=false;alert("最多对比 6 只");return;}
        CMP.sel.push(c);
      } else CMP.sel=CMP.sel.filter(function(x){return x!==c;});
      renderCmpPick(); renderCompare();
    };
  }
}
function renderCompare(){
  var el=$("cmpChart"); if(!el)return;
  if(typeof echarts==="undefined"){el.innerHTML='<div class="empty">需 echarts.min.js</div>';return;}
  var span=(CMP.span==null?60:CMP.span);
  var codes=CMP.sel.slice(0,6);
  var msgEl=$("cmpMsg"), tblEl=$("cmpTable");
  if(codes.length<2){
    if(el._c){try{el._c.clear();}catch(e){}}
    el.innerHTML='<div class="empty">请至少勾选 2 只标的进行对比</div>';
    if(tblEl)tblEl.innerHTML="";
    if(msgEl)msgEl.textContent="已选 "+codes.length+" 只";
    return;
  }
  if(el.innerHTML)el.innerHTML="";
  if(!el._c)el._c=echarts.init(el);
  var ch=el._c;
  var series=[],rows=[],dates=null;
  codes.forEach(function(code,idx){
    var stk=state.stocks&&state.stocks[code]; if(!stk||!stk.rows)return;
    var an=getAn(code); if(!an)return;
    var n=an.closes.length;
    var s=span>0?Math.max(0,n-span):0;
    var arr=[],ds=[];
    var base=an.closes[s];
    if(!base)return;
    for(var k=s;k<n;k++){ arr.push(+((an.closes[k]/base-1)*100).toFixed(2)); ds.push(an.dates[k]); }
    if(!dates||ds.length>dates.length)dates=ds;
    series.push({name:(stk.name||code),type:"line",data:arr,showSymbol:false,smooth:false,
      lineStyle:{width:idx===0?2.2:1.7,color:CMP_COLOR[idx%CMP_COLOR.length]},
      itemStyle:{color:CMP_COLOR[idx%CMP_COLOR.length]},
      emphasis:{focus:"series"}});
    var hi=-Infinity,lo=Infinity,mdd=0,peak=-Infinity;
    for(k=0;k<arr.length;k++){
      if(arr[k]>hi)hi=arr[k]; if(arr[k]<lo)lo=arr[k];
      var p=(an.closes[s+k]/base-1)*100; if(p>peak)peak=p; if(peak-p>mdd)mdd=peak-p;
    }
    var rets=[];
    for(k=1;k<arr.length;k++)rets.push((an.closes[s+k]/an.closes[s+k-1]-1)*100);
    var mu=rets.length?rets.reduce(function(a,b){return a+b;},0)/rets.length:0;
    var vv=rets.length?rets.reduce(function(a,b){return a+(b-mu)*(b-mu);},0)/rets.length:0;
    rows.push({code:code,name:stk.name||code,tot:arr.length?arr[arr.length-1]:0,
      hi:hi,lo:lo,mdd:mdd,vol:Math.sqrt(vv)*Math.sqrt(250)});
  });
  if(series.length<2){
    el.innerHTML='<div class="empty">所选标的暂无可用K线数据（请先联网拉取或粘贴日K）</div>';
    if(tblEl)tblEl.innerHTML="";
    return;
  }
  rows.sort(function(a,b){return b.tot-a.tot;});
  ch.setOption({
    animation:false,backgroundColor:"transparent",
    tooltip:{trigger:"axis",backgroundColor:"rgba(19,26,37,.97)",borderColor:"#31405a",
      textStyle:{color:"#e8eef7",fontSize:12.5},
      valueFormatter:function(v){return (v>=0?"+":"")+Number(v).toFixed(2)+"%";}},
    legend:{top:2,textStyle:{color:"#93a1b8",fontSize:11.5},itemWidth:16,itemHeight:9},
    grid:{left:62,right:26,top:34,bottom:34},
    xAxis:{type:"category",data:dates||[],axisLine:{lineStyle:{color:"#31405a"}},
      axisLabel:{color:"#93a1b8",fontSize:11,interval:Math.max(1,Math.floor((dates||[]).length/8))}},
    yAxis:{type:"value",scale:true,axisLine:{show:false},
      splitLine:{lineStyle:{color:"rgba(38,49,69,.5)"}},
      axisLabel:{color:"#93a1b8",fontSize:11,formatter:function(v){return v.toFixed(0)+"%";}}},
    series:series
  },true);
  var h='<table><thead><tr><th>排名</th><th>标的</th><th class="num">区间涨跌</th><th class="num">最大涨幅</th>'
    +'<th class="num">最大回撤</th><th class="num">年化波动</th><th class="num">收益/回撤</th></tr></thead><tbody>';
  rows.forEach(function(r,i){
    var rr=r.mdd>0?(r.tot/r.mdd):0;
    h+="<tr><td>"+(i+1)+"</td><td>"+esc(r.name)+' <span class="muted">'+r.code+"</span></td>"
      +'<td class="num '+(r.tot>=0?"up":"down")+'">'+(r.tot>=0?"+":"")+r.tot.toFixed(2)+"%</td>"
      +'<td class="num up">+'+r.hi.toFixed(2)+"%</td>"
      +'<td class="num down">-'+r.mdd.toFixed(2)+"%</td>"
      +'<td class="num">'+r.vol.toFixed(1)+"%</td>"
      +'<td class="num '+(rr>=1?"up":"down")+'">'+rr.toFixed(2)+"</td></tr>";
  });
  h+="</tbody></table>";
  if(tblEl)tblEl.innerHTML=h;
  if(msgEl&&rows.length){
    msgEl.innerHTML="区间内相对最强：<b>"+esc(rows[0].name)+"</b>（"+(rows[0].tot>=0?"+":"")+rows[0].tot.toFixed(2)+"%）"
      +"　最弱：<b>"+esc(rows[rows.length-1].name)+"</b>（"+rows[rows.length-1].tot.toFixed(2)+"%）";
  }
}

/* ============================================================
   复盘笔记（localStorage）
   ============================================================ */
function notesKey(){ return "ashare_notes_v1"; }
function getNotes(){
  try{ return JSON.parse(localStorage.getItem(notesKey())||"[]"); }catch(e){ return []; }
}
function saveNotes(a){
  try{ localStorage.setItem(notesKey(),JSON.stringify(a)); }catch(e){}
}
function renderNoteSel(){
  var sel=$("noteCode"); if(!sel)return;
  var hs=(state.holdings||[]).slice();
  var cur=sel.value;
  sel.innerHTML='<option value="">（市场随笔 · 不关联标的）</option>'
    +hs.map(function(h){return '<option value="'+h.code+'">'+esc(h.name)+" "+h.code+"</option>";}).join("");
  if(cur)sel.value=cur;
}
function renderNotes(){
  var box=$("noteList"); if(!box)return;
  var all=getNotes().slice().sort(function(a,b){return (b.t||0)-(a.t||0);});
  var q=(($("noteFilter")&&$("noteFilter").value)||"").trim();
  if(q)all=all.filter(function(n){
    return (n.text&&n.text.indexOf(q)>=0)||(n.name&&n.name.indexOf(q)>=0)||(n.code&&n.code.indexOf(q)>=0);});
  if(!all.length){ box.innerHTML='<div class="empty" style="padding:20px">暂无笔记</div>'; return; }
  box.innerHTML=all.map(function(n){
    var d=new Date(n.t||Date.now());
    var p=function(x){return String(x).padStart(2,"0");};
    return '<div class="noteItem"><div class="nh"><span class="nm">'
      +(n.name?esc(n.name)+' <span class="muted" style="font-weight:400">'+esc(n.code)+"</span>":"市场随笔")
      +'</span><span class="nt">'+d.getFullYear()+"-"+p(d.getMonth()+1)+"-"+p(d.getDate())+" "+p(d.getHours())+":"+p(d.getMinutes())
      +' · <a href="javascript:void(0)" data-del="'+n.id+'" style="color:#ff8f8f">删除</a></span></div>'
      +'<div class="nb">'+esc(n.text)+"</div></div>";
  }).join("");
  var as=box.querySelectorAll("[data-del]");
  for(var i=0;i<as.length;i++){
    as[i].onclick=function(){
      var id=this.getAttribute("data-del");
      saveNotes(getNotes().filter(function(n){return String(n.id)!==String(id);}));
      renderNotes();
    };
  }
}
