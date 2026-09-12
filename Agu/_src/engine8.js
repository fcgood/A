/* ============================================================
   engine8 · K线显示设置 + 艾略特波浪（v2.0）
   ============================================================ */

/* ---------- 设置持久化 ---------- */
function klSetSave(){
  try{ localStorage.setItem("ashare_klset", JSON.stringify(KLSET)); }catch(e){}
}
function klSetLoad(){
  try{
    var s = localStorage.getItem("ashare_klset");
    if(s){
      var o = JSON.parse(s);
      for(var k in o){ if(Object.prototype.hasOwnProperty.call(o,k)) KLSET[k]=o[k]; }
    }
  }catch(e){}
}

/* ---------- 均线数据（支持任意周期，结果缓存在 an 上） ---------- */
function maLineData(an, n){
  if(!an) return null;
  if(!an._maX) an._maX = {};
  if(an._maX[n]) return an._maX[n];
  if(n===5)  { an._maX[n]=an.ma5;  return an.ma5;  }
  if(n===10) { an._maX[n]=an.ma10; return an.ma10; }
  if(n===20) { an._maX[n]=an.ma20; return an.ma20; }
  if(n===60) { an._maX[n]=an.ma60; return an.ma60; }
  if(!an.closes || an.closes.length < n) return null;
  an._maX[n] = sma(an.closes, n);
  return an._maX[n];
}

/* ---------- 美国线（OHLC bar）自定义系列 ---------- */
function ohlcBarSeries(an){
  var data = [];
  for(var k=0;k<an.dates.length;k++){
    data.push([k, an.opens[k], an.closes[k], an.lows[k], an.highs[k]]);
  }
  return {
    name:"OHLC", type:"custom", data:data, z:5,
    renderItem:function(params, api){
      var i = params.dataIndex;
      var o = api.value(1), c = api.value(2), l = api.value(3), h = api.value(4);
      if(o==null||c==null||l==null||h==null) return;
      var up = (c >= o);
      var col = up ? UP : DOWN;
      var x  = api.coord([i, o])[0];
      var yO = api.coord([i, o])[1];
      var yC = api.coord([i, c])[1];
      var yH = api.coord([i, h])[1];
      var yL = api.coord([i, l])[1];
      var hw = Math.max(1.4, (api.size ? (api.size([1,0])[0]||6) : 6) * 0.30);
      return { type:"group", children:[
        {type:"line", shape:{x1:x, y1:yH, x2:x, y2:yL}, style:{stroke:col, lineWidth:1}},
        {type:"line", shape:{x1:x-hw, y1:yO, x2:x, y2:yO}, style:{stroke:col, lineWidth:1.4}},
        {type:"line", shape:{x1:x, y1:yC, x2:x+hw, y2:yC}, style:{stroke:col, lineWidth:1.4}}
      ]};
    }
  };
}

/* ============================================================
   艾略特波浪：ZigZag 摆动点 + 五浪规则校验
   —— 纯形态近似，非预测工具，仅作结构参考
   ============================================================ */
function zigzagPivots(an, pct){
  var n = an.dates.length;
  if(n < 12) return [];
  var hi = an.highs, lo = an.lows;
  var piv = [];
  var dir = 0;
  var upI = 0, upV = hi[0], dnI = 0, dnV = lo[0];
  pct = (pct==null ? 0.05 : pct);
  for(var i=1;i<n;i++){
    if(nn(hi[i]) && hi[i] > upV){ upV = hi[i]; upI = i; }
    if(nn(lo[i]) && lo[i] < dnV){ dnV = lo[i]; dnI = i; }
    if(dir >= 0 && dnV <= upV * (1 - pct)){
      piv.push({i:upI, v:upV, t:1});
      dir = -1; dnI = i; dnV = lo[i]; upI = i; upV = hi[i];
    } else if(dir <= 0 && upV >= dnV * (1 + pct)){
      piv.push({i:dnI, v:dnV, t:-1});
      dir = 1; upI = i; upV = hi[i]; dnI = i; dnV = lo[i];
    }
  }
  /* 合并同向相邻点，保留更极端者 */
  var out = [];
  for(var j=0;j<piv.length;j++){
    var p = piv[j];
    if(out.length && out[out.length-1].t === p.t){
      var q = out[out.length-1];
      if((p.t === 1 && p.v > q.v) || (p.t === -1 && p.v < q.v)) out[out.length-1] = p;
    } else out.push(p);
  }
  return out;
}

function findImpulse(piv){
  if(!piv || piv.length < 6) return null;
  var startMin = Math.max(0, piv.length - 16);
  for(var s = piv.length - 6; s >= startMin; s--){
    var P = piv.slice(s, s + 6);
    var ok = true, i;
    for(i=1;i<6;i++){ if(P[i].t === P[i-1].t){ ok = false; break; } }
    if(!ok) continue;
    var up = P[1].v > P[0].v;
    if(up  && P[1].t !== 1)  continue;
    if(!up && P[1].t !== -1) continue;
    var l1 = Math.abs(P[1].v-P[0].v), l2 = Math.abs(P[2].v-P[1].v),
        l3 = Math.abs(P[3].v-P[2].v), l4 = Math.abs(P[4].v-P[3].v),
        l5 = Math.abs(P[5].v-P[4].v);
    if(!(l1>0 && l3>0 && l5>0)) continue;
    /* 规则1：2浪不回撤超过1浪起点 */
    if(up  && !(P[2].v < P[1].v && P[2].v > P[0].v)) continue;
    if(!up && !(P[2].v > P[1].v && P[2].v < P[0].v)) continue;
    /* 规则2：3浪不是最短的一浪 */
    if(!(l3 >= Math.min(l1, l5) * 0.98 && l3 > l1 * 0.50)) continue;
    /* 规则3：4浪不与1浪重叠 */
    if(up  && !(P[4].v < P[3].v && P[4].v > P[1].v)) continue;
    if(!up && !(P[4].v > P[3].v && P[4].v < P[1].v)) continue;
    return {P:P, up:up, l:[l1,l2,l3,l4,l5], s:s};
  }
  return null;
}

function elliott(an, pctOverride){
  var res = {found:false, piv:[], imp:null, corr:null, fib:null, text:""};
  if(!an || !an.dates || an.dates.length < 30) return res;
  var pct = (pctOverride != null ? pctOverride
            : (KLSET && KLSET.wavePct ? KLSET.wavePct : 5)) / 100;
  var piv = zigzagPivots(an, pct);
  res.piv = piv;
  if(piv.length < 6){ res.text = "摆动点不足（" + piv.length + " 个），暂无法识别完整浪型。可调大灵敏度或切换更长周期。"; return res; }
  var imp = findImpulse(piv);
  if(!imp){ res.text = "未匹配到满足「2浪不破1浪起点 / 3浪非最短 / 4浪不重叠1浪」三条硬规则的五浪结构。"; return res; }
  res.found = true; res.imp = imp;
  var P = imp.P, up = imp.up, l = imp.l;
  var P0=P[0].v, P1=P[1].v, P2=P[2].v, P3=P[3].v, P4=P[4].v, P5=P[5].v;
  var waveLen = Math.abs(P5 - P0) || 1;
  var dir = up ? 1 : -1;
  var fib = {
    r382: P5 - dir * waveLen * 0.382,
    r500: P5 - dir * waveLen * 0.500,
    r618: P5 - dir * waveLen * 0.618,
    ext1618: P4 + dir * l[0] * 1.618,
    ext100:  P4 + dir * l[0] * 1.000
  };
  res.fib = fib;
  /* 修正段：主浪之后若还有 2~3 个摆动点，标 A/B/C */
  if(imp.s + 8 <= piv.length){
    res.corr = [piv[imp.s+5], piv[imp.s+6], piv[imp.s+7]];
  } else if(imp.s + 7 <= piv.length){
    res.corr = [piv[imp.s+5], piv[imp.s+6]];
  }
  var last = an.close;
  var phase;
  if(res.corr && res.corr.length >= 2){
    phase = "当前处于" + (up ? "上升" : "下降") + "五浪之后的<b>修正段</b>（" +
            (res.corr.length >= 3 ? "A-B-C 已成型" : "A-B 进行中，C 段未确认") + "）";
  } else if((up && last >= P5*0.985) || (!up && last <= P5*1.015)){
    phase = "价格贴近第 <b>5 浪末端</b>，五浪结构接近完成，需警惕反转或进入修正";
  } else if((up && last >= P3) || (!up && last <= P3)){
    phase = "当前处于第 <b>4/5 浪区域</b>（3 浪高点已过）";
  } else if((up && last >= P2) || (!up && last <= P2)){
    phase = "当前处于第 <b>3 浪区域</b>（通常是主升/主跌段）";
  } else {
    phase = "当前处于第 <b>1~2 浪区域</b>";
  }
  res.phase = phase;
  res.text =
    "识别出" + (up ? "<b>上升</b>" : "<b>下降</b>") + "五浪结构（摆动阈值 " + (pct*100).toFixed(1) + "%）：" +
    "1浪 " + f2(P1-P0) + "　2浪 " + f2(P2-P1) + "　3浪 " + f2(P3-P2) +
    "　4浪 " + f2(P4-P3) + "　5浪 " + f2(P5-P4) + "。" + phase +
    "。若五浪结束，常见回撤参考：" + f2(fib.r382) + "（38.2%）/ " +
    f2(fib.r500) + "（50%）/ " + f2(fib.r618) + "（61.8%）。" +
    "若为 5 浪延伸，1 倍量度目标约 " + f2(fib.ext100) + "，1.618 倍约 " + f2(fib.ext1618) + "。";
  return res;
}

/* ---------- 波浪画线（挂在 K 线主图 markLine 上） ---------- */
function buildWaveMark(an, rg, pctOverride){
  var out = [];
  if(!an) return out;
  var e = elliott(an, pctOverride);
  if(!e.found || !e.imp) return out;
  var P = e.imp.P;
  var C = ["#ffd166","#ffb86b","#ffe08a","#ffb86b","#ffd166"];
  var names = ["1","2","3","4","5"];
  var i;
  for(i=0;i<5;i++){
    var a = P[i], b = P[i+1];
    out.push([
      {coord:[an.dates[a.i], a.v], symbol:"none",
        lineStyle:{color:C[i], width:(i===2?2.2:1.6), opacity:0.92},
        label:{show:true, formatter:names[i], position:"middle",
          color:"#0d1117", backgroundColor:C[i], borderRadius:3,
          padding:[1,4], fontSize:11, fontWeight:"bold"}},
      {coord:[an.dates[b.i], b.v], symbol:"none"}
    ]);
  }
  if(e.corr && e.corr.length >= 2){
    var lb = ["A","B","C"], cc = "#a371f7";
    for(i=0;i<e.corr.length-1;i++){
      var p1 = e.corr[i], p2 = e.corr[i+1];
      out.push([
        {coord:[an.dates[p1.i], p1.v], symbol:"none",
          lineStyle:{color:cc, width:1.5, opacity:0.85, type:"dashed"},
          label:{show:true, formatter:lb[i], position:"middle",
            color:"#fff", backgroundColor:"rgba(163,113,247,.85)", borderRadius:3,
            padding:[1,4], fontSize:11, fontWeight:"bold"}},
        {coord:[an.dates[p2.i], p2.v], symbol:"none"}
      ]);
    }
  }
  if(e.fib){
    var f = e.fib;
    var up = e.imp.up;
    [["38.2%", f.r382], ["50%", f.r500], ["61.8%", f.r618]].forEach(function(x, idx){
      out.push({yAxis:x[1], symbol:"none",
        lineStyle:{color:"rgba(163,113,247,.42)", type:"dotted", width:1},
        label:{show:true, formatter:"回调"+x[0]+" "+f2(x[1]),
          position: idx===0 ? "insideEndTop" : "insideEndBottom",
          color:"#c3a6f7", fontSize:10}});
    });
  }
  return out;
}

function renderWaveBox(an){
  var box = $("waveBox"); if(!box) return;
  var on = (KLSET && KLSET.wave) || ($("ckWave") && $("ckWave").checked);
  if(!on || !an){ box.innerHTML = ""; return; }
  var e = elliott(an);
  var h = '<div class="hint" style="margin-top:8px;border-left:3px solid #ffd166;padding-left:10px">'+
          '<b style="color:#ffd166">🌊 艾略特波浪（ZigZag 自动识别）</b><br>'+
          e.text +
          '<div class="muted" style="margin-top:4px">浪型为基于摆动点的<b>形态近似</b>，同一段行情可有多种数法；'+
          '阈值可在设置中调整（当前 ' + ((KLSET.wavePct)||5) + '%）。<b>不构成买卖指令。</b></div></div>';
  box.innerHTML = h;
}

/* ============================================================
   设置面板绑定
   ============================================================ */
function klSetSyncUI(){
  var i;
  /* 均线周期勾选 */
  var box = $("maOpts");
  if(box){
    var h = "";
    [5,10,20,60,120,250].forEach(function(n){
      var on = KLSET.ma.indexOf(n) >= 0;
      h += '<label style="margin:0;display:inline-flex;align-items:center;gap:4px;cursor:pointer">'+
           '<input type="checkbox" data-ma="'+n+'" '+(on?"checked":"")+' style="width:auto"> '+
           '<span style="color:'+(MA_META[n]||"#8b949e")+'">MA'+n+'</span></label>';
    });
    box.innerHTML = h;
    [].forEach.call(box.querySelectorAll("input[data-ma]"), function(cb){
      cb.onchange = function(){
        var n = parseInt(cb.getAttribute("data-ma"), 10);
        var idx = KLSET.ma.indexOf(n);
        if(cb.checked && idx < 0) KLSET.ma.push(n);
        if(!cb.checked && idx >= 0) KLSET.ma.splice(idx, 1);
        KLSET.ma.sort(function(a,b){return a-b;});
        KLSET.preset = "custom"; klSetMarkPreset(); klSetSave(); drawKline();
      };
    });
  }
  var sc = $("segCandle");
  if(sc) [].forEach.call(sc.querySelectorAll("button"), function(b){
    b.classList.toggle("on", b.getAttribute("data-c") === KLSET.candle);
  });
  var wp = $("wavePct"), wpt = $("wavePctTxt");
  if(wp){
    wp.value = KLSET.wavePct || 5;
    if(wpt) wpt.textContent = (KLSET.wavePct || 5).toFixed(1) + "%";
    wp.oninput = function(){
      KLSET.wavePct = parseFloat(wp.value) || 5;
      if(wpt) wpt.textContent = KLSET.wavePct.toFixed(1) + "%";
    };
    wp.onchange = function(){ klSetSave(); drawKline(); };
  }
  var ck;
  ck = $("ckLog");   if(ck) ck.checked = !!KLSET.log;
  ck = $("ckCross"); if(ck) ck.checked = !!KLSET.cross;
  ck = $("ckSplit"); if(ck) ck.checked = !!KLSET.split;
  ck = $("ckWave");  if(ck) ck.checked = !!KLSET.wave;
  klSetMarkPreset();
}
function klSetMarkPreset(){
  var sp = $("segPreset"); if(!sp) return;
  [].forEach.call(sp.querySelectorAll("button"), function(b){
    b.classList.toggle("on", b.getAttribute("data-p") === KLSET.preset);
  });
}
function klSetApplyPreset(name){
  var p = KL_PRESETS[name];
  if(!p) return;
  KLSET.preset = name;
  KLSET.ma = p.ma.slice();
  KLSET.wave = !!p.wave;
  CUR.main = p.main;
  var cks = {ckSignal:p.sig, ckLevel:p.lv, ckChan:p.chan, ckWave:p.wave};
  for(var id in cks){
    var el = $(id); if(el) el.checked = !!cks[id];
  }
  var sm = $("segMain");
  if(sm && p.main){
    [].forEach.call(sm.querySelectorAll("button"), function(b){
      b.classList.toggle("on", b.getAttribute("data-m") === p.main);
    });
  }
  klSetSyncUI(); klSetSave(); drawKline();
}
function bindKlSet(){
  klSetLoad();
  var sp = $("segPreset");
  if(sp) [].forEach.call(sp.querySelectorAll("button"), function(b){
    b.onclick = function(){ klSetApplyPreset(b.getAttribute("data-p")); };
  });
  var sc = $("segCandle");
  if(sc) [].forEach.call(sc.querySelectorAll("button"), function(b){
    b.onclick = function(){
      KLSET.candle = b.getAttribute("data-c");
      KLSET.preset = "custom";
      klSetSyncUI(); klSetSave(); drawKline();
    };
  });
  [["ckLog","log"],["ckCross","cross"],["ckSplit","split"],["ckWave","wave"]].forEach(function(x){
    var el = $(x[0]);
    if(el) el.onchange = function(){
      KLSET[x[1]] = !!el.checked;
      KLSET.preset = "custom";
      klSetSave(); drawKline(); renderWaveBox(curViewAn());
    };
  });
  var bs = $("btnKlSet"), panel = $("klSetPanel");
  if(bs && panel){
    bs.onclick = function(){
      var show = panel.style.display === "none";
      panel.style.display = show ? "" : "none";
      if(show) klSetSyncUI();
      bs.textContent = show ? "⚙ 收起设置" : "⚙ 显示设置";
    };
  }
  var bsave = $("btnKlSetSave");
  if(bsave) bsave.onclick = function(){
    klSetSave(); drawKline(); renderWaveBox(curViewAn());
    var m = $("klSetMsg"); if(m){ m.textContent = "已应用并保存"; setTimeout(function(){m.textContent="";},1600); }
  };
  var breset = $("btnKlSetReset");
  if(breset) breset.onclick = function(){
    KLSET = {preset:"full", ma:[5,10,20,60], candle:"solid", log:false,
             cross:true, split:false, wave:false, wavePct:5};
    klSetSyncUI(); klSetSave(); drawKline(); renderWaveBox(curViewAn());
  };
  /* 大盘图工具条已由 engine13 接管（图型/指数/周期/叠加/导出） */
}
