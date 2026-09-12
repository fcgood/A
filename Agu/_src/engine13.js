/* ============================================================
   engine13 · 大盘行情增强（趋势线 + 艾略特波浪 + UI 重排）
   —— 形态识别均为客观计算 + 规则推理，不构成投资建议
   ============================================================ */

/* ---------------- 状态扩展 ----------------
   注意：init() 在 engine10 末尾同步执行，而 engine13 的顶层 var 赋值
   排在其后 —— 因此这里必须做「惰性初始化」，不能在顶层直接赋值后就用。 */
var IDX_AN;                            /* (code|period|len) → an 缓存 */
function idxSavePref(){
  try{ localStorage.setItem("idxv2", JSON.stringify({
    mode:IDXV.mode, pick:IDXV.pick, period:IDXV.period, span:IDXV.span,
    trend:IDXV.trend, chan:IDXV.chan, wave:IDXV.wave,
    ma:IDXV.ma, fill:IDXV.fill, vol:IDXV.vol, wavePct:IDXV.wavePct
  })); }catch(e){}
}
function idxLoadPref(){
  try{
    var s = localStorage.getItem("idxv2");
    if(!s) return;
    var o = JSON.parse(s);
    for(var k in o) if(o[k] != null) IDXV[k] = o[k];
  }catch(e){}
}
function idxEnsure(){
  if(typeof IDX_AN === "undefined" || !IDX_AN) IDX_AN = {};
  if(typeof IDXV === "undefined" || !IDXV) IDXV = {};
  if(!IDXV._init2){
    IDXV._init2 = 1;
    /* 首次默认值：单指数 K线 + 趋势线 + 通道 + 波浪 + 均线 + 成交量 */
    if(IDXV.span   == null) IDXV.span   = 60;
    IDXV.mode = "kline"; IDXV.pick = "000001"; IDXV.period = "day";
    IDXV.trend = true; IDXV.chan = true; IDXV.wave = true;
    IDXV.ma = true; IDXV.vol = true; IDXV.fill = false;
    IDXV.wavePct = "auto";
    idxLoadPref();                      /* 用户偏好覆盖默认 */
  }
  if(IDXV.pick   == null) IDXV.pick   = "000001";
  if(IDXV.period == null) IDXV.period = "day";
  if(IDXV.trend  == null) IDXV.trend  = true;
  if(IDXV.chan   == null) IDXV.chan   = true;
  if(IDXV.wave   == null) IDXV.wave   = false;
  if(IDXV.vol    == null) IDXV.vol    = true;
  if(IDXV.wavePct == null) IDXV.wavePct = "auto";
  return IDXV;
}

function IDX_PICK_NAME(){
  idxEnsure();
  var d = idxDefs();
  for(var i=0;i<d.length;i++) if(d[i][0] === IDXV.pick) return d[i][1];
  return "指数";
}
function IDX_SINGLE(){ idxEnsure(); return IDXV.mode === "kline" || IDXV.mode === "close"; }

/* ============================================================
   0. 工作台 UI 状态（纯函数：先推导状态，再写 DOM）
   —— 便于验证，也避免「先改 DOM 再判断」造成的状态不一致
   ============================================================ */
function hexA(h, a){
  if(!h || h.charAt(0) !== "#") return h;
  var s = h.slice(1);
  if(s.length === 3) s = s[0] + s[0] + s[1] + s[1] + s[2] + s[2];
  var n = parseInt(s, 16);
  return "rgba(" + ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")";
}
/* 区间换算：周线模式下与 renderIdxSingle 保持一致 */
function idxWeekN(span){
  var s = parseInt(span, 10) || 0;
  if(s <= 0) return 0;
  return Math.min(s, Math.max(12, Math.round(s / 4)));
}
function idxNoteText(single, mode, wave, trend){
  if(!single){
    return '<b>三指数对比</b>：看谁更强 —— 线在上方、斜率更陡者相对占优；' +
           '<b>归一化</b>以首日 = 100 消除点位差异，<b>涨跌%</b>看区间累计收益。' +
           '滚轮缩放、拖拽平移，底部滑块可框选区间。';
  }
  var base = (mode === "kline")
    ? '<b>K线</b>：红涨绿跌，实体看力度、影线看多空争夺；跌破前低 / 站上前高常作为结构判断起点。'
    : '<b>收盘线</b>：只看收盘价走势，用于过滤日内噪声。';
  var ov = [];
  if(trend) ov.push("趋势线（摆动点线性外推）");
  if(wave)  ov.push("艾略特波浪（1-2-3-4-5 / A-B-C）");
  if(ov.length) base += ' 已叠加：' + ov.join("、") + '。';
  base += ' 图下依次为 <b>关键位</b>、<b>趋势线解读</b>、<b>浪型进度</b> 与 <b>区间统计</b>。';
  return base;
}
function idxUiState(){
  idxEnsure();
  var single = IDX_SINGLE();
  var defs = idxDefs(), nm = "三大指数", color = "#4c8dff", i;
  for(i = 0; i < defs.length; i++) if(defs[i][0] === IDXV.pick){ nm = defs[i][1]; color = defs[i][2]; }
  var per = IDXV.period === "week" ? "week" : "day";
  var modeTxt = ({norm:"三指数 · 归一化对比", chg:"三指数 · 涨跌% 对比",
                  kline:"K线", close:"收盘线"})[IDXV.mode] || "K线";
  var span = parseInt(IDXV.span, 10) || 0;
  var an = single ? idxAn(IDXV.pick, per) : null;
  var totN = (an && an.dates) ? an.dates.length : 0;
  var winN = span > 0 ? (per === "week" ? idxWeekN(span) : span) : totN;
  if(totN && winN > totN) winN = totN;

  var title = single ? (nm + " · " + modeTxt + "（" + (per === "week" ? "周线" : "日线") + "）") : modeTxt;
  var sub = [];
  sub.push(span > 0 ? ("近 " + winN + (per === "week" ? " 周" : " 根")) : ("全部 " + (totN || 0) + " 根"));
  var sd = (typeof SNAPSHOT_DATE !== "undefined" && SNAPSHOT_DATE) ? SNAPSHOT_DATE : "";
  if(sd) sub.push("数据截至 " + sd);

  var tags = [];
  if(single){
    tags.push(["趋势线", !!IDXV.trend]);
    tags.push(["通道", !!IDXV.chan]);
    tags.push(["波浪", !!IDXV.wave]);
    tags.push(["均线", !!IDXV.ma]);
    tags.push(["成交量", !!(IDXV.vol && IDXV.mode === "kline")]);
    tags.push(["面积填充", !!(IDXV.fill && IDXV.mode === "close")]);
  }
  var dis = {
    target: !single,                              /* 指数 / 周期 / 画线 仅单指数有效 */
    wavePct: !single || !IDXV.wave,
    vol: IDXV.mode !== "kline",                   /* 成交量副图仅 K线 */
    fill: IDXV.mode !== "close"                   /* 面积填充仅收盘线 */
  };
  return {single:single, nm:nm, color:color, per:per, modeTxt:modeTxt,
          span:span, winN:winN, totN:totN, title:title, sub:sub.join(" · "),
          tags:tags, dis:dis, note:idxNoteText(single, IDXV.mode, !!IDXV.wave, !!IDXV.trend)};
}

/* ============================================================
   1. 工作台头部（标题 / 叠加标签 / 图下说明 / 状态条）
   ============================================================ */
function idxHeadSync(st){
  st = st || idxUiState();
  var t = $("clabTitle"), s = $("clabSub"), d = $("clabDot"), tg = $("clabTags");
  if(t)  t.textContent = st.title;
  if(s)  s.textContent = st.sub;
  if(d){ d.style.background = st.color; d.style.boxShadow = "0 0 0 3px " + hexA(st.color, .18); }
  if(tg){
    if(!st.tags.length) tg.innerHTML = '<span class="tg">三指数对比模式</span>';
    else tg.innerHTML = st.tags.map(function(x){
      return '<span class="tg' + (x[1] ? " on" : "") + '">' + x[0] + '</span>';
    }).join("");
  }
  var nt = $("idxChartNote"); if(nt) nt.innerHTML = st.note;
  var sn = $("idxSpanNote");
  if(sn) sn.textContent = "当前 " + (st.span > 0 ? ("近 " + st.winN + (st.per === "week" ? " 周" : " 根"))
                                                  : ("全部 " + (st.totN || 0) + " 根"));
  var tn = $("grpIdxTargetNote");
  if(tn) tn.textContent = st.single ? "可切换指数与周期" : "切到单指数模式生效";
}

/* 图下状态条：把当前关键结论浓缩成 chips（不新增计算，复用已算好的结果） */
function renderIdxStateBar(){
  var box = $("idxChartState"); if(!box) return;
  if(!IDX_SINGLE()){ box.innerHTML = ""; return; }
  var an = idxAn(IDXV.pick, IDXV.period);
  if(!an){ box.innerHTML = ""; return; }
  var h = "", last = an.close, i;
  /* 趋势线状态 */
  if(IDXV.trend){
    try{
      var tr = idxTrendLines(an);
      if(tr.up) h += '<span class="tg ' + (last >= tr.up.endV ? "on" : "") + '">上升线 ' + f2(tr.up.endV) + '</span>';
      if(tr.dn) h += '<span class="tg ' + (last >= tr.dn.endV ? "on" : "") + '">下降线 ' + f2(tr.dn.endV) + '</span>';
    }catch(e){}
  }
  /* 浪型阶段 */
  if(IDXV.wave){
    try{
      var e = idxElliott(an);
      if(e && e.found && e.imp){
        var P = e.imp.P, up = e.imp.up, step = "1";
        if(e.corr && e.corr.length >= 3) step = "C";
        else if(e.corr && e.corr.length >= 2) step = "B";
        else if(e.corr && e.corr.length >= 1) step = "A";
        else if((up && last >= P[4].v) || (!up && last <= P[4].v)) step = "5";
        else if((up && last >= P[3].v) || (!up && last <= P[3].v)) step = "4";
        else if((up && last >= P[2].v) || (!up && last <= P[2].v)) step = "3";
        else if((up && last >= P[1].v) || (!up && last <= P[1].v)) step = "2";
        h += '<span class="tg on">' + (up ? "向上" : "向下") + '浪型 第 ' + step + ' 段</span>';
      }
    }catch(e2){}
  }
  /* 指标位置 */
  var pos = [];
  [[an.ma20,"MA20"],[an.ma60,"MA60"]].forEach(function(m){
    if(nn(m[0][an.i])) pos.push(m[1] + (last > m[0][an.i] ? "上方" : "下方"));
  });
  if(pos.length) h += '<span class="tg on">' + pos.join(" · ") + '</span>';
  box.innerHTML = h;
}

/* ---------------- 取指数分析对象（日 / 周） ---------------- */
function idxAn(cd, period){
  idxEnsure();
  var stk = (typeof state !== "undefined") ? state.stocks[cd] : null;
  if(!stk || !stk.rows) return null;
  var key = cd + "|" + (period||"day") + "|" + stk.rows.length;
  if(IDX_AN[key]) return IDX_AN[key];
  var an;
  if(period === "week"){
    try{
      var wr = weeklyFromDaily(stk.rows);
      an = analyzeStock({rows: wr, name: nameOf(cd) || cd, code: cd});
      if(an && an.err) an = null;
    }catch(e){ an = null; }
  }else{
    an = getAn(cd);
  }
  if(an) IDX_AN[key] = an;
  return an || null;
}

/* ============================================================
   一、趋势线自动识别
   思路：ZigZag 摆动点 → 取最近两个同向且递增（低点）/递减（高点）的摆动点
        → 线性外推到最后一根 → 判突破；摆动点价格聚类 → 水平支撑压力
   ============================================================ */
function idxFitLine(an, a, b){
  var n = an.dates.length;
  if(!(b.i > a.i)) return null;
  var slope = (b.v - a.v) / (b.i - a.i);
  var arr = [];
  for(var i=0;i<n;i++) arr.push(i >= a.i ? (a.v + slope * (i - a.i)) : null);
  var mid = (a.v + b.v) / 2 || 1;
  return {
    i1:a.i, i2:n-1, v1:a.v, v2:b.v, slope:slope,
    slopePct: slope / mid * 100,
    endV: arr[n-1], data: arr,
    x1: an.dates[a.i], x2: an.dates[b.i]
  };
}

function idxTrendLines(an){
  var res = {up:null, dn:null, levels:[], piv:[], note:[]};
  if(!an || !an.dates || an.dates.length < 20) return res;
  var pct = (typeof KLSET !== "undefined" && KLSET.wavePct ? KLSET.wavePct : 5) / 100;
  var piv = zigzagPivots(an, pct);
  res.piv = piv;
  if(piv.length < 3) return res;

  /* 上升趋势线：最近两个「递增」低点 */
  var lows = piv.filter(function(p){ return p.t === -1; }).slice(-5);
  for(var i = lows.length - 1; i >= 1; i--){
    if(lows[i].i > lows[i-1].i && lows[i].v > lows[i-1].v){
      res.up = idxFitLine(an, lows[i-1], lows[i]); break;
    }
  }
  /* 下降趋势线：最近两个「递减」高点 */
  var highs = piv.filter(function(p){ return p.t === 1; }).slice(-5);
  for(var j = highs.length - 1; j >= 1; j--){
    if(highs[j].i > highs[j-1].i && highs[j].v < highs[j-1].v){
      res.dn = idxFitLine(an, highs[j-1], highs[j]); break;
    }
  }
  /* 水平关键位：摆动点价格聚类（±1.2%） */
  var bks = [], k, hit;
  for(i = 0; i < piv.length; i++){
    hit = null;
    for(k = 0; k < bks.length; k++){
      if(Math.abs(bks[k].v - piv[i].v) / piv[i].v < 0.012){ hit = bks[k]; break; }
    }
    if(hit){ hit.v = (hit.v * hit.n + piv[i].v) / (hit.n + 1); hit.n++; }
    else bks.push({v:piv[i].v, n:1});
  }
  var close = an.close;
  res.levels = bks.filter(function(b){ return b.n >= 2; })
    .map(function(b){
      return {v:b.v, n:b.n, side: b.v < close ? "sup" : "res",
              dist: (b.v - close) / close * 100};
    })
    .filter(function(b){ return Math.abs(b.dist) < 22; })
    .sort(function(x,y){ return Math.abs(x.dist) - Math.abs(y.dist); })
    .slice(0, 6);

  /* 突破判定 */
  if(res.up){
    if(close < res.up.endV * 0.995) res.note.push({t:"bad", s:"收盘跌破上升趋势线（线位 " + f2(res.up.endV) + "）"});
    else if(close < res.up.endV * 1.02) res.note.push({t:"warn", s:"贴近上升趋势线（线位 " + f2(res.up.endV) + "），距线仅 " + ((close/res.up.endV-1)*100).toFixed(2) + "%"});
    else res.note.push({t:"good", s:"运行于上升趋势线上方（线位 " + f2(res.up.endV) + "）"});
  }
  if(res.dn){
    if(close > res.dn.endV * 1.005) res.note.push({t:"good", s:"收盘突破下降趋势线（线位 " + f2(res.dn.endV) + "）"});
    else if(close > res.dn.endV * 0.98) res.note.push({t:"warn", s:"贴近下降趋势线（线位 " + f2(res.dn.endV) + "）"});
    else res.note.push({t:"bad", s:"受压于下降趋势线下方（线位 " + f2(res.dn.endV) + "）"});
  }
  return res;
}

/* 趋势线 → ECharts line series */
function idxTrendSeries(an, tr){
  var out = [];
  if(!tr) return out;
  if(tr.up){
    out.push({name:"上升趋势线", type:"line", data:tr.up.data, showSymbol:false, smooth:false,
      lineStyle:{color:"#22c55e", width:1.8, type:"solid"}, z:6,
      endLabel:{show:true, formatter:"上升线 " + f2(tr.up.endV), color:"#7ee79f", fontSize:11}});
  }
  if(tr.dn){
    out.push({name:"下降趋势线", type:"line", data:tr.dn.data, showSymbol:false, smooth:false,
      lineStyle:{color:"#ff7875", width:1.8, type:"solid"}, z:6,
      endLabel:{show:true, formatter:"下降线 " + f2(tr.dn.endV), color:"#ff9d9b", fontSize:11}});
  }
  return out;
}

/* 水平关键位 → markLine data */
function idxLevelMark(tr){
  var out = [];
  if(!tr || !tr.levels) return out;
  tr.levels.forEach(function(l){
    var sup = l.side === "sup";
    out.push({yAxis:l.v, symbol:"none",
      lineStyle:{color: sup ? "rgba(110,231,159,.55)" : "rgba(255,120,120,.55)",
                 type:"dashed", width:1.1},
      label:{show:true, formatter:(sup?"支撑 ":"压力 ") + f2(l.v) + " (" + (l.dist>0?"+":"") + l.dist.toFixed(1) + "%)",
        position:"insideEndTop", color: sup ? "#7ee79f" : "#ff9d9b", fontSize:10.5}});
  });
  return out;
}

/* ============================================================
   二、主图渲染（覆盖 engine7 的 renderIdxChart）
   ============================================================ */
/* ============================================================
   波浪阈值自适应
   指数波动远小于个股，同一阈值在不同指数上差异很大：
   实测上证日线 2%~3.5% 可识别、深成需 4%~6%、创业板 2%~2.5%，
   而周线 3%~4% 三个指数都能识别。故提供「自动」模式逐个试。
   ============================================================ */
function idxWavePct(an){
  idxEnsure();
  if(IDXV.wavePct && IDXV.wavePct !== "auto") return parseFloat(IDXV.wavePct);
  /* 局部常量：避免顶层 var 在 init 同步执行时尚未赋值 */
  var TRY = [3.5, 3, 2.5, 4, 2, 5, 6, 1.5, 8];
  for(var i = 0; i < TRY.length; i++){
    var e = elliott(an, TRY[i]);
    if(e.found) return TRY[i];
  }
  return (typeof KLSET !== "undefined" && KLSET.wavePct) || 5;
}
function idxElliott(an){
  return elliott(an, idxWavePct(an));
}

function renderIdxChart(){ renderIdxChartImpl(); }

function renderIdxChartImpl(){
  idxEnsure();
  var el = $("idxChart"); if(!el) return;
  var run = function(){
    var c = ensureChart(el);
    if(!c){ deferChart(el, run); return; }
    if(IDX_SINGLE()) renderIdxSingle(el, c);
    else renderIdxMulti(el, c);
    renderIdxTrendBox();
    renderIdxWaveBox();
    renderIdxLevels();
    renderIdxCorr();
    renderIdxMultiTf();
    renderIdxStateBar();
    idxV2SyncUI();
  };
  run();
}

/* ---------- 单指数：K线 / 收盘价 ---------- */
function renderIdxSingle(el, c){
  var cd = IDXV.pick, nm = IDX_PICK_NAME();
  var an = idxAn(cd, IDXV.period);
  if(!an){
    el.innerHTML = '<div class="empty">指数K线数据缺失（可在「个股诊断」粘贴指数日K，或到「数据后台」检查）</div>';
    if(el._c){ try{ el._c.dispose(); }catch(e){} el._c = null; }
    return;
  }
  var defs = idxDefs(), color = "#f5a524", k;
  for(k = 0; k < defs.length; k++) if(defs[k][0] === cd) color = defs[k][2];

  var n = an.dates.length;
  var span = IDXV.span | 0;
  if(IDXV.period === "week" && span > 0) span = Math.min(span, Math.max(12, Math.round(span / 4)));
  var st = (span > 0 && span < n) ? n - span : 0;
  var dates = an.dates.slice(st), i;

  /* 量程：可见窗口真实高低 */
  var lo = Infinity, hi = -Infinity;
  for(i = st; i < n; i++){
    if(nn(an.highs[i]) && an.highs[i] > hi) hi = an.highs[i];
    if(nn(an.lows[i])  && an.lows[i]  < lo) lo = an.lows[i];
  }
  var extra = [];
  if(IDXV.chan && an.chan){ for(i = st; i < n; i++){ if(nn(an.chan.up[i])) extra.push(an.chan.up[i]); if(nn(an.chan.lo[i])) extra.push(an.chan.lo[i]); } }
  if(IDXV.ma){ [an.ma5, an.ma10, an.ma20, an.ma60].forEach(function(m){ for(i = st; i < n; i++) if(nn(m[i])) extra.push(m[i]); }); }
  /* 均线/通道只在 ±30% 内参与，避免把蜡烛压扁 */
  var mid = (lo + hi) / 2;
  extra.forEach(function(v){ if(v > mid * 0.7 && v < mid * 1.3){ if(v > hi) hi = v; if(v < lo) lo = v; } });
  if(!nn(lo) || !nn(hi) || hi <= lo){ lo = an.close * 0.9; hi = an.close * 1.1; }
  var pad = (hi - lo) * 0.08;
  var rg = {min: lo - pad, max: hi + pad};

  var series = [], leg = [];
  var main;
  if(IDXV.mode === "kline"){
    var candle = [];
    for(i = st; i < n; i++) candle.push([an.opens[i], an.closes[i], an.lows[i], an.highs[i]]);
    main = {name:nm, type:"candlestick", data:candle, barMaxWidth:22, barMinWidth:1.2,
      itemStyle:{color:UP, color0:DOWN, borderColor:UP, borderColor0:DOWN, borderWidth:1}, z:5};
  }else{
    var cl = [];
    for(i = st; i < n; i++) cl.push(an.closes[i]);
    main = {name:nm, type:"line", data:cl, showSymbol:false, smooth:false,
      lineStyle:{width:2.2, color:color}, itemStyle:{color:color}, z:5};
    if(IDXV.fill) main.areaStyle = {opacity:0.12, color:color};
  }
  leg.push(nm);
  series.push(main);

  /* 均线 */
  if(IDXV.ma){
    var MAS = [[an.ma5,"MA5","#58a6ff",1.1],[an.ma10,"MA10","#79c0ff",1],
               [an.ma20,"MA20","#f5a524",1.4],[an.ma60,"MA60","#a371f7",1.5]];
    MAS.forEach(function(m){
      var d = [];
      for(var i2 = st; i2 < n; i2++) d.push(nn(m[0][i2]) ? m[0][i2] : null);
      series.push({name:m[1], type:"line", data:d, showSymbol:false, smooth:true,
        lineStyle:{width:m[3], color:m[2]}, z:4});
      leg.push(m[1]);
    });
  }

  /* 趋势通道 */
  if(IDXV.chan && an.chan){
    var cu = [], cl2 = [], cm = [];
    for(i = st; i < n; i++){
      cu.push(nn(an.chan.up[i]) ? an.chan.up[i] : null);
      cl2.push(nn(an.chan.lo[i]) ? an.chan.lo[i] : null);
      cm.push(nn(an.chan.mid[i]) ? an.chan.mid[i] : null);
    }
    series.push({name:"通道上轨", type:"line", data:cu, showSymbol:false, smooth:false,
      lineStyle:{width:1.2, color:"rgba(88,166,255,.75)", type:"dashed"}, z:3});
    series.push({name:"通道下轨", type:"line", data:cl2, showSymbol:false, smooth:false,
      lineStyle:{width:1.2, color:"rgba(88,166,255,.75)", type:"dashed"}, z:3});
    series.push({name:"通道中轨", type:"line", data:cm, showSymbol:false, smooth:false,
      lineStyle:{width:1, color:"rgba(147,161,184,.5)", type:"dotted"}, z:2});
    leg.push("通道上轨","通道下轨");
  }

  /* 趋势线 */
  var tr = null;
  if(IDXV.trend){
    tr = idxTrendLines(an);
    var ts = idxTrendSeries(an, tr);
    for(i = 0; i < ts.length; i++){ series.push(ts[i]); leg.push(ts[i].name); }
  }

  /* 波浪 + 水平关键位 → markLine */
  var ml = [];
  if(IDXV.wave){
    try{
      var wm = buildWaveMark(an, rg, idxWavePct(an));
      for(i = 0; i < wm.length; i++) ml.push(wm[i]);
    }catch(e){}
  }
  if(IDXV.trend && tr){
    var lm = idxLevelMark(tr);
    for(i = 0; i < lm.length; i++) ml.push(lm[i]);
  }
  if(ml.length) main.markLine = {silent:true, symbol:"none", animation:false,
    data:ml, label:{fontSize:10.5}};

  /* 成交量副图 */
  var grids, xAxes, yAxes;
  var showVol = IDXV.vol && IDXV.mode === "kline";
  if(showVol){
    grids = [{left:64, right:26, top:46, height:"64%"},
             {left:64, right:26, top:"76%", height:"14%"}];
    xAxes = [{type:"category", data:dates, gridIndex:0, boundaryGap:true,
        axisLine:{lineStyle:{color:"#31405a"}}, axisTick:{show:false},
        axisLabel:{color:"#93a1b8", fontSize:11.5, interval:Math.max(1, Math.floor(dates.length/9))}},
       {type:"category", data:dates, gridIndex:1, boundaryGap:true,
        axisLine:{lineStyle:{color:"#31405a"}}, axisTick:{show:false}, axisLabel:{show:false}}];
    yAxes = [{scale:true, gridIndex:0, min:rg.min, max:rg.max, splitNumber:6,
        splitLine:{lineStyle:{color:"rgba(38,49,69,.55)"}},
        axisLabel:{color:"#93a1b8", fontSize:11.5, formatter:function(v){ return v.toFixed(1); }},
        axisLine:{show:false}},
      {scale:true, gridIndex:1, splitNumber:2,
        splitLine:{lineStyle:{color:"rgba(38,49,69,.35)"}},
        axisLabel:{color:"#7d8ca3", fontSize:10,
          formatter:function(v){ return v >= 1e8 ? (v/1e8).toFixed(1)+"亿" : (v/1e4).toFixed(0)+"万"; }},
        axisLine:{show:false}}];
  }else{
    grids = [{left:64, right:26, top:46, bottom:62}];
    xAxes = [{type:"category", data:dates, gridIndex:0,
      boundaryGap: IDXV.mode === "kline",
      axisLine:{lineStyle:{color:"#31405a"}}, axisTick:{show:false},
      axisLabel:{color:"#93a1b8", fontSize:11.5, interval:Math.max(1, Math.floor(dates.length/9))}}];
    yAxes = [{type:"value", scale:true, min:rg.min, max:rg.max, splitNumber:6,
      splitLine:{lineStyle:{color:"rgba(38,49,69,.55)"}},
      axisLabel:{color:"#93a1b8", fontSize:11.5, formatter:function(v){ return v.toFixed(1); }},
      axisLine:{show:false}}];
  }
  if(showVol){
    var vols = [], vma = [];
    for(i = st; i < n; i++){
      var up = an.closes[i] >= an.opens[i];
      vols.push({value:an.vols[i] || 0,
        itemStyle:{color: up ? "rgba(255,77,79,.62)" : "rgba(34,197,94,.62)"}});
    }
    for(i = st; i < n; i++){
      var s = 0, cnt = 0;
      for(var j2 = Math.max(st, i - 4); j2 <= i; j2++){ if(nn(an.vols[j2])){ s += an.vols[j2]; cnt++; } }
      vma.push(cnt ? s / cnt : null);
    }
    series.push({name:"成交量", type:"bar", data:vols, xAxisIndex:1, yAxisIndex:1,
      barMaxWidth:22, z:3});
    series.push({name:"量MA5", type:"line", data:vma, xAxisIndex:1, yAxisIndex:1,
      showSymbol:false, smooth:true, lineStyle:{width:1.2, color:"#f5a524"}, z:4});
    leg.push("成交量","量MA5");
  }

  c.setOption({
    animation:false, backgroundColor:"transparent",
    grid:grids,
    legend:{data:leg, top:4, left:8, textStyle:{color:"#a9b6c9", fontSize:12},
      itemWidth:18, itemHeight:9, itemGap:14},
    tooltip:{trigger:"axis", backgroundColor:"rgba(19,26,37,.97)", borderColor:"#31405a",
      textStyle:{color:"#e8eef7", fontSize:12.5},
      axisPointer:{type:"cross", lineStyle:{color:"rgba(147,161,184,.4)"}}},
    axisPointer:{link:[{xAxisIndex:"all"}]},
    xAxis:xAxes, yAxis:yAxes,
    dataZoom:[
      {type:"inside", xAxisIndex: showVol ? [0,1] : [0], start:0, end:100, zoomOnMouseWheel:true},
      {type:"slider", height:20, bottom:12, start:0, end:100,
        borderColor:"transparent", backgroundColor:"rgba(255,255,255,.03)",
        fillerColor:"rgba(76,141,255,.14)", handleStyle:{color:"#4c8dff"},
        dataBackground:{lineStyle:{color:"#3d4a60"}, areaStyle:{color:"rgba(61,74,96,.5)"}},
        textStyle:{color:"#7d8ca3", fontSize:10}}
    ],
    series:series
  }, true);

  /* 统计卡 */
  renderIdxStat(nm, an, st, n, color, "single");
}

/* ---------- 多指数：归一化 / 累计涨跌 ---------- */
function renderIdxMulti(el, c){
  var defs = idxDefs();
  var dates = null, series = [], leg = [], allV = [], stats = [];
  var span = IDXV.span | 0;
  for(var d = 0; d < defs.length; d++){
    var cd = defs[d][0], nm = defs[d][1], color = defs[d][2];
    var an = getAn(cd); if(!an || !an.closes || !an.closes.length) continue;
    var N = (span > 0 && span < an.dates.length) ? span : an.dates.length;
    var st = an.dates.length - N;
    var base = an.closes[st];
    if(!nn(base) || !base) continue;
    if(!dates) dates = an.dates.slice(st);
    var arr = [], i;
    if(IDXV.mode === "chg"){
      for(i = st; i < an.dates.length; i++){
        var cc = an.closes[i];
        arr.push(nn(cc) ? +(((cc / base) - 1) * 100).toFixed(2) : null);
      }
    }else{
      for(i = st; i < an.dates.length; i++){
        var c2 = an.closes[i];
        arr.push(nn(c2) ? +((c2 / base) * 100).toFixed(2) : null);
      }
    }
    for(i = 0; i < arr.length; i++) if(nn(arr[i])) allV.push(arr[i]);
    var last = arr[arr.length - 1];
    var hi = Math.max.apply(null, arr.filter(nn));
    var lo = Math.min.apply(null, arr.filter(nn));
    var mdd = 0, peak = -Infinity;
    for(i = 0; i < arr.length; i++){
      if(!nn(arr[i])) continue;
      if(arr[i] > peak) peak = arr[i];
      var dd = (IDXV.mode === "chg") ? (arr[i] - peak) : ((arr[i] / peak - 1) * 100);
      if(dd < mdd) mdd = dd;
    }
    var rets = [];
    for(i = 1; i < arr.length; i++){ if(nn(arr[i]) && nn(arr[i-1]) && arr[i-1] !== 0) rets.push(arr[i] / arr[i-1] - 1); }
    var mu = rets.length ? rets.reduce(function(a,b){ return a + b; }, 0) / rets.length : 0;
    var varr = rets.length ? rets.reduce(function(a,b){ return a + (b - mu) * (b - mu); }, 0) / rets.length : 0;
    stats.push({nm:nm, color:color, last:last, hi:hi, lo:lo, mdd:mdd, vol:Math.sqrt(varr) * Math.sqrt(244) * 100});
    var common = {name:nm, type:"line", data:arr, smooth:false, showSymbol:false,
      lineStyle:{width:2.1, color:color}, itemStyle:{color:color},
      emphasis:{focus:"series"}, z:5};
    if(IDXV.fill) common.areaStyle = {opacity:0.10, color:color};
    series.push(common);
    if(IDXV.ma){
      var ma = [];
      for(i = st; i < an.dates.length; i++){
        var mv = an.ma20[i];
        ma.push(nn(mv) ? (IDXV.mode === "chg" ? +(((mv / base) - 1) * 100).toFixed(2) : +((mv / base) * 100).toFixed(2)) : null);
      }
      series.push({name:nm + " MA20", type:"line", data:ma, smooth:true, showSymbol:false,
        lineStyle:{width:1, color:color, opacity:0.45, type:"dashed"}, z:2});
    }
    leg.push(nm);
  }
  if(!series.length){
    el.innerHTML = '<div class="empty">指数K线数据缺失（可在「数据后台」检查，或在个股诊断粘贴指数日K）</div>';
    if(el._c){ try{ el._c.dispose(); }catch(e){} el._c = null; }
    return;
  }
  var rg = tightRange(allV, 0.12, false);
  if(!rg) rg = {min:null, max:null};
  var zeroLine = (IDXV.mode === "chg") ? 0 : 100;
  if(rg.min != null && zeroLine < rg.min) rg.min = zeroLine - (rg.max - rg.min) * 0.02;
  if(rg.max != null && zeroLine > rg.max) rg.max = zeroLine + (rg.max - rg.min) * 0.02;
  series[0].markLine = {silent:true, symbol:"none", data:[{yAxis:zeroLine,
    lineStyle:{color:"rgba(147,161,184,.45)", type:"dashed", width:1}, label:{show:false}}]};

  c.setOption({
    animation:false, backgroundColor:"transparent",
    grid:{left:66, right:26, top:52, bottom:66},
    legend:{data:leg, top:4, left:8, textStyle:{color:"#a9b6c9", fontSize:12.5},
      itemWidth:20, itemHeight:10, itemGap:18},
    tooltip:{trigger:"axis", backgroundColor:"rgba(19,26,37,.97)", borderColor:"#31405a",
      textStyle:{color:"#e8eef7", fontSize:12.5},
      axisPointer:{type:"cross", lineStyle:{color:"rgba(147,161,184,.4)"}},
      valueFormatter:function(v){ return v == null ? "—" : (+v).toFixed(2) + (IDXV.mode === "chg" ? "%" : ""); }},
    xAxis:{type:"category", data:dates || [], boundaryGap:false,
      axisLine:{lineStyle:{color:"#31405a"}}, axisTick:{show:false},
      axisLabel:{color:"#93a1b8", fontSize:11.5, interval:Math.max(1, Math.floor((dates || []).length / 9))}},
    yAxis:{type:"value", min:rg.min, max:rg.max, scale:true, splitNumber:6,
      splitLine:{lineStyle:{color:"rgba(38,49,69,.55)"}},
      axisLabel:{color:"#93a1b8", fontSize:11.5,
        formatter:function(v){ return (IDXV.mode === "chg") ? v.toFixed(1) + "%" : v.toFixed(1); }},
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

  var box = $("idxStat");
  if(box){
    var h = "";
    for(var s2 = 0; s2 < stats.length; s2++){
      var s = stats[s2];
      var up = (s.last != null) && (IDXV.mode === "chg" ? s.last >= 0 : s.last >= 100);
      h += '<div class="logitem"><div class="k">' + esc(s.nm) + '</div>' +
           '<div class="v ' + (up ? "up" : "down") + '">' + (s.last == null ? "—" : ((s.last > 0 ? "+" : "") + s.last.toFixed(2) + (IDXV.mode === "chg" ? "%" : ""))) + '</div>' +
           '<div class="ds muted" style="font-size:11.5px;margin-top:4px">' +
           '区间高 ' + s.hi.toFixed(1) + ' / 低 ' + s.lo.toFixed(1) + '<br>' +
           '最大回撤 ' + s.mdd.toFixed(2) + (IDXV.mode === "chg" ? "%" : "") +
           ' · 年化波动 ' + s.vol.toFixed(1) + '%</div></div>';
    }
    box.innerHTML = h;
  }
}

/* 单指数模式下的区间统计 */
function renderIdxStat(nm, an, st, n, color, tag){
  var box = $("idxStat"); if(!box) return;
  var arr = [], i;
  for(i = st; i < n; i++) arr.push(an.closes[i]);
  var seg = arr.filter(nn);
  if(!seg.length){ box.innerHTML = ""; return; }
  var hi = Math.max.apply(null, seg), lo = Math.min.apply(null, seg);
  var last = an.close, first = seg[0];
  var chg = first ? (last / first - 1) * 100 : null;
  var mdd = 0, peak = -Infinity;
  for(i = 0; i < seg.length; i++){
    if(seg[i] > peak) peak = seg[i];
    var dd = (seg[i] / peak - 1) * 100;
    if(dd < mdd) mdd = dd;
  }
  var rets = [];
  for(i = 1; i < seg.length; i++) if(seg[i-1]) rets.push(seg[i] / seg[i-1] - 1);
  var mu = rets.length ? rets.reduce(function(a,b){ return a + b; }, 0) / rets.length : 0;
  var vr = rets.length ? rets.reduce(function(a,b){ return a + (b - mu) * (b - mu); }, 0) / rets.length : 0;
  var vol = Math.sqrt(vr) * Math.sqrt(IDXV.period === "week" ? 52 : 244) * 100;
  var maPos = [];
  [[an.ma20,"MA20"],[an.ma60,"MA60"]].forEach(function(m){
    if(nn(m[0][an.i])) maPos.push(m[1] + (last > m[0][an.i] ? "上方" : "下方"));
  });
  var up = (chg != null && chg >= 0);
  box.innerHTML =
    '<div class="logitem"><div class="k">' + esc(nm) + ' 区间涨跌</div>' +
    '<div class="v ' + (up ? "up" : "down") + '">' + (chg == null ? "—" : ((chg > 0 ? "+" : "") + chg.toFixed(2) + "%")) + '</div>' +
    '<div class="ds muted" style="font-size:11.5px;margin-top:4px">样本 ' + (n - st) + ' 根（' + (IDXV.period === "week" ? "周线" : "日线") + '）</div></div>' +
    '<div class="logitem"><div class="k">区间高 / 低</div>' +
    '<div class="v" style="font-size:14px">' + f2(hi) + ' <span class="muted">/</span> ' + f2(lo) + '</div>' +
    '<div class="ds muted" style="font-size:11.5px;margin-top:4px">现价 ' + f2(last) + '，距高点 ' + ((last/hi-1)*100).toFixed(2) + '%</div></div>' +
    '<div class="logitem"><div class="k">最大回撤</div>' +
    '<div class="v down">' + mdd.toFixed(2) + '%</div>' +
    '<div class="ds muted" style="font-size:11.5px;margin-top:4px">年化波动 ' + vol.toFixed(1) + '%</div></div>' +
    '<div class="logitem"><div class="k">均线位置</div>' +
    '<div class="v" style="font-size:13px">' + (maPos.join(" · ") || "—") + '</div>' +
    '<div class="ds muted" style="font-size:11.5px;margin-top:4px">' + (an.arrange || "") + '</div></div>';
}

/* ============================================================
   三、解读卡片
   ============================================================ */
function renderIdxTrendBox(){
  var box = $("idxTrendBox"); if(!box) return;
  if(!IDX_SINGLE() || !IDXV.trend){
    box.innerHTML = '<div class="hint muted">开启「趋势线」并在单指数模式（K线 / 收盘价）下查看自动识别结果。</div>';
    return;
  }
  var an = idxAn(IDXV.pick, IDXV.period);
  if(!an){ box.innerHTML = '<div class="hint muted">指数数据缺失。</div>'; return; }
  var tr = idxTrendLines(an);
  var h = '<div class="hint" style="border-left:3px solid #4c8dff;padding-left:10px">';
  h += '<b style="color:#79c0ff">📈 趋势线与关键位（自动识别）</b><br>';
  if(tr.up){
    h += '上升趋势线：' + an.dates[tr.up.i1] + ' 低点 ' + f2(tr.up.v1) + ' → 外推至今日 <b>' + f2(tr.up.endV) +
         '</b>（斜率 ' + (tr.up.slopePct > 0 ? "+" : "") + tr.up.slopePct.toFixed(3) + '%/根）。<br>';
  }
  if(tr.dn){
    h += '下降趋势线：' + an.dates[tr.dn.i1] + ' 高点 ' + f2(tr.dn.v1) + ' → 外推至今日 <b>' + f2(tr.dn.endV) +
         '</b>（斜率 ' + (tr.dn.slopePct > 0 ? "+" : "") + tr.dn.slopePct.toFixed(3) + '%/根）。<br>';
  }
  if(!tr.up && !tr.dn) h += '当前摆动点未形成清晰的上升 / 下降趋势线（可能处于横向震荡）。<br>';
  if(an.chan){
    h += '趋势通道：' + esc(an.chan.dir) + '，斜率 ' + (an.chan.slopePct > 0 ? "+" : "") + an.chan.slopePct.toFixed(3) + '%/根';
    if(nn(an.chan.up[an.i]) && nn(an.chan.lo[an.i]))
      h += '，今日上轨 ' + f2(an.chan.up[an.i]) + ' / 下轨 ' + f2(an.chan.lo[an.i]);
    h += '。<br>';
  }
  if(tr.note && tr.note.length){
    h += '<div style="margin-top:4px">';
    tr.note.forEach(function(x){
      var c = x.t === "good" ? "#ff8f8f" : (x.t === "bad" ? "#6ee79f" : "#f5a524");
      h += '<span class="chip" style="color:' + c + ';border-color:' + c + '44">' + (x.t === "good" ? "▲ " : (x.t === "bad" ? "▼ " : "● ")) + x.s + '</span> ';
    });
    h += '</div>';
  }
  h += '<div class="muted" style="margin-top:4px">趋势线由 ZigZag 摆动点线性外推得到，属客观画线；是否有效突破需结合成交量与后续 2～3 根K线确认。<b>不构成买卖指令。</b></div>';
  h += '</div>';
  box.innerHTML = h;
}

function renderIdxWaveBox(){
  var box = $("idxWaveBox"); if(!box) return;
  if(!IDX_SINGLE() || !IDXV.wave){
    box.innerHTML = '<div class="hint muted">勾选「波浪」后，系统会用 ZigZag 摆动点在指数K线上标注 1-2-3-4-5 与 A-B-C 修正段。</div>';
    return;
  }
  var an = idxAn(IDXV.pick, IDXV.period);
  if(!an){ box.innerHTML = '<div class="hint muted">指数数据缺失。</div>'; return; }
  var wp = idxWavePct(an);
  var e = elliott(an, wp);
  var h = '<div class="hint" style="border-left:3px solid #ffd166;padding-left:10px">';
  h += '<b style="color:#ffd166">🌊 艾略特波浪（ZigZag 自动识别 · ' + esc(IDX_PICK_NAME()) + '）</b><br>';
  if(e.found && e.imp){
    /* 阶段进度条 */
    var P = e.imp.P, up = e.imp.up;
    var last = an.close;
    var step = 0;
    if(e.corr && e.corr.length >= 3) step = 8;
    else if(e.corr && e.corr.length >= 2) step = 7;
    else if((up && last >= P[4].v) || (!up && last <= P[4].v)) step = 5;
    else if((up && last >= P[3].v) || (!up && last <= P[3].v)) step = 4;
    else if((up && last >= P[2].v) || (!up && last <= P[2].v)) step = 3;
    else if((up && last >= P[1].v) || (!up && last <= P[1].v)) step = 2;
    else step = 1;
    var names = ["1","2","3","4","5","A","B","C"];
    h += '<div class="wavesteps" style="margin:8px 0 6px">';
    for(var i = 0; i < 8; i++){
      if(i === 5) h += '<i class="gap"></i>';
      if(i > 0 && i !== 5) h += '<i></i>';
      h += '<span class="' + (step >= i + 1 ? "on" : "") + '">' + names[i] + '</span>';
    }
    h += '</div>';
  }
  h += e.text;
  h += '<div class="muted" style="margin-top:4px">浪型是基于摆动阈值的<b>形态近似</b>，同一段行情常有多种数法；' +
       '当前阈值 <b>' + wp + '%</b>' + (IDXV.wavePct && IDXV.wavePct !== "auto" ? "（手动）" : "（自动适配）") +
       '，可在上方「灵敏度」切换。<b>不构成买卖指令。</b></div>';
  h += '</div>';
  box.innerHTML = h;
}

function renderIdxLevels(){
  var box = $("idxLevels"); if(!box) return;
  if(!IDX_SINGLE()){
    box.innerHTML = '<div class="hint muted">切到「K线 / 收盘价」模式可查看自动识别的水平支撑压力位。</div>';
    return;
  }
  var an = idxAn(IDXV.pick, IDXV.period);
  if(!an){ box.innerHTML = ""; return; }
  var tr = idxTrendLines(an);
  if(!tr.levels || !tr.levels.length){
    box.innerHTML = '<div class="hint muted">未识别出有效水平关键位（摆动点过于分散）。</div>';
    return;
  }
  var close = an.close;
  var h = '<div class="lvbar">';
  tr.levels.forEach(function(l){
    var sup = l.side === "sup";
    h += '<div class="lvitem ' + (sup ? "sup" : "res") + '">' +
         '<div class="t">' + (sup ? "支撑" : "压力") + ' ×' + l.n + '</div>' +
         '<div class="v">' + f2(l.v) + '</div>' +
         '<div class="d">' + (l.dist > 0 ? "+" : "") + l.dist.toFixed(2) + '%（' + (sup ? "下方" : "上方") + ' ' + Math.abs(l.dist).toFixed(1) + '%）</div>' +
         '</div>';
  });
  h += '<div class="lvitem cur"><div class="t">现价</div><div class="v">' + f2(close) + '</div>' +
       '<div class="d">基准</div></div>';
  h += '</div>';
  box.innerHTML = h;
}

/* ---------- 指数相关性矩阵 ---------- */
function corrOf(a, b){
  var n = Math.min(a.length, b.length), i;
  var xs = [], ys = [];
  for(i = a.length - n; i < a.length; i++){
    var j = b.length - n + (i - (a.length - n));
    if(!nn(a[i]) || !nn(b[j]) || !a[i-1] || !b[j-1]){ xs.push(null); ys.push(null); continue; }
    xs.push(a[i] / a[i-1] - 1); ys.push(b[j] / b[j-1] - 1);
  }
  var X = [], Y = [];
  for(i = 1; i < xs.length; i++) if(xs[i] != null && ys[i] != null){ X.push(xs[i]); Y.push(ys[i]); }
  if(X.length < 12) return null;
  var mx = X.reduce(function(p,c){ return p + c; }, 0) / X.length;
  var my = Y.reduce(function(p,c){ return p + c; }, 0) / Y.length;
  var sxy = 0, sxx = 0, syy = 0;
  for(i = 0; i < X.length; i++){
    sxy += (X[i] - mx) * (Y[i] - my); sxx += (X[i] - mx) * (X[i] - mx); syy += (Y[i] - my) * (Y[i] - my);
  }
  if(sxx === 0 || syy === 0) return null;
  return sxy / Math.sqrt(sxx * syy);
}

function renderIdxCorr(){
  idxEnsure();
  var box = $("idxCorr"); if(!box) return;
  var defs = idxDefs();
  var ans = defs.map(function(d){ return {cd:d[0], nm:d[1], an:getAn(d[0])}; })
                .filter(function(x){ return x.an; });
  if(ans.length < 2){ box.innerHTML = '<div class="hint muted">至少需 2 个指数的K线数据。</div>'; return; }
  var N = IDXV.span > 0 ? IDXV.span : 60;
  var h = '<table class="mini"><thead><tr><th>日收益相关性</th>';
  ans.forEach(function(a){ h += '<th class="num">' + esc(a.nm.replace("指数","").replace("证成指","成指")) + '</th>'; });
  h += '</tr></thead><tbody>';
  var vals = [];
  ans.forEach(function(a){
    h += '<tr><td>' + esc(a.nm) + '</td>';
    ans.forEach(function(b){
      if(a.cd === b.cd){ h += '<td class="num muted">1.00</td>'; return; }
      var c = corrOf(a.an.closes, b.an.closes);
      if(c == null){ h += '<td class="num muted">—</td>'; return; }
      vals.push(c);
      var col = c >= 0.8 ? "up" : (c >= 0.5 ? "" : "down");
      h += '<td class="num ' + col + '">' + c.toFixed(2) + '</td>';
    });
    h += '</tr>';
  });
  h += '</tbody></table>';
  if(vals.length){
    var avg = vals.reduce(function(p,c){ return p + c; }, 0) / vals.length;
    var judge = avg >= 0.85 ? "高度同向，分散效果弱，组合容易齐涨齐跌" :
                (avg >= 0.6 ? "中高度相关，需注意同向风险" : "相关性一般，指数间存在一定分化");
    h += '<div class="hint muted" style="margin-top:6px">近 ' + N + ' 日平均相关系数 <b>' + avg.toFixed(2) +
         '</b>：' + judge + '。</div>';
  }
  box.innerHTML = h;
}

/* ---------- 多周期共振（日 / 周 / 月） ---------- */
function monthlyFromDaily(rows){
  var out = [], cur = null, key = "";
  (rows || []).forEach(function(r){
    var d = String(Array.isArray(r) ? r[0] : r.date);
    var k = d.slice(0, 7);
    var o = Array.isArray(r)
      ? {date:r[0], o:r[1], h:r[2], l:r[3], c:r[4], v:r[5]}
      : {date:r.date, o:r.o, h:r.h, l:r.l, c:r.c, v:r.v};
    if(k !== key){ if(cur) out.push(cur); cur = {date:o.date, o:o.o, h:o.h, l:o.l, c:o.c, v:o.v}; key = k; }
    else { cur.h = Math.max(cur.h, o.h); cur.l = Math.min(cur.l, o.l); cur.c = o.c; cur.v = (cur.v||0) + (o.v||0); cur.date = o.date; }
  });
  if(cur) out.push(cur);
  return out;
}

function tfVote(an){
  if(!an) return 0;
  var i = an.i, c = an.close;
  var m20 = nn(an.ma20[i]) ? an.ma20[i] : null;
  var bull = an.arrange === "多头排列" && (!nn(m20) || c > m20);
  var bear = an.arrange === "空头排列" && (!nn(m20) || c < m20);
  if(bull) return 1;
  if(bear) return -1;
  return 0;
}

function renderIdxMultiTf(){
  idxEnsure();
  var box = $("idxMt"); if(!box) return;
  var defs = idxDefs(), h = "", any = false;
  defs.forEach(function(d){
    var cd = d[0], nm = d[1];
    var an = getAn(cd);
    if(!an){ return; }
    any = true;
    var wk = idxAn(cd, "week"), mo = null;
    try{
      var stk = state.stocks[cd];
      if(stk && stk.rows && stk.rows.length > 60)
        mo = analyzeStock({rows: monthlyFromDaily(stk.rows), name: nm, code: cd});
    }catch(e){}
    var votes = [tfVote(an), wk ? tfVote(wk) : 0, (mo && !mo.err) ? tfVote(mo) : 0];
    var names = ["日线", "周线", "月线"];
    var bulls = votes.filter(function(v){ return v > 0; }).length;
    var bears = votes.filter(function(v){ return v < 0; }).length;
    var verdict, cls;
    if(bulls === 3){ verdict = "三周期同向偏多"; cls = "up"; }
    else if(bears === 3){ verdict = "三周期同向偏空"; cls = "down"; }
    else if(bulls >= 2 && bears === 0){ verdict = "多头占优"; cls = "up"; }
    else if(bears >= 2 && bulls === 0){ verdict = "空头占优"; cls = "down"; }
    else { verdict = "多周期分歧"; cls = ""; }
    var rsn = bulls + " 多 / " + bears + " 空 / " + (3 - bulls - bears) + " 中性";
    h += '<div class="tfrow"><span class="nm">' + esc(nm.replace("指数","")) + '</span>' +
         '<span style="flex:1">';
    for(var i = 0; i < 3; i++){
      var v = votes[i];
      var c2 = v > 0 ? "#ff8f8f" : (v < 0 ? "#6ee79f" : "#93a1b8");
      var t2 = v > 0 ? "多头" : (v < 0 ? "空头" : "交织");
      h += '<span class="tfchip" style="color:' + c2 + ';border-color:' + c2 + '44">' + names[i] + " " + t2 + '</span>';
    }
    h += '</span><span class="tfchip ' + cls + '" style="border-color:var(--line)">' + verdict + '</span></div>';
    h += '<div class="muted" style="font-size:11px;margin:-2px 0 6px 72px">共振票型 ' + rsn +
         '　周线：' + (wk ? esc(wk.arrange || "—") : "数据不足") + '</div>';
  });
  if(!any){ h = '<div class="hint muted">指数K线数据缺失。</div>'; }
  box.innerHTML = h;
}

/* ---------- KPI 迷你走势 sparkline ---------- */
function sparkSvg(arr, color){
  var a = (arr || []).filter(nn);
  if(a.length < 3) return "";
  var lo = Math.min.apply(null, a), hi = Math.max.apply(null, a);
  if(hi <= lo) hi = lo + 1;
  var W = 100, H = 26, pts = [];
  for(var i = 0; i < a.length; i++){
    var x = i / (a.length - 1) * W;
    var y = H - (a[i] - lo) / (hi - lo) * (H - 3) - 1.5;
    pts.push(x.toFixed(1) + "," + y.toFixed(1));
  }
  return '<svg class="spark" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none">' +
         '<polyline points="' + pts.join(" ") + '" fill="none" stroke="' + color +
         '" stroke-width="1.6" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></svg>';
}

function renderIdxSpark(){
  idxEnsure();
  var box = $("idxCards"); if(!box) return;
  var defs = idxDefs(), m = (typeof state !== "undefined" && state.market) ? state.market : {};
  var keys = [["sh_close","sh_chg","sh_amt","sh_amtd"],
              ["sz_close","sz_chg","sz_amt","sz_amtd"],
              ["cy_close","cy_chg","cy_amt","cy_amtd"]];
  var h = "";
  for(var i = 0; i < defs.length; i++){
    var cd = defs[i][0], nm = defs[i][1], color = defs[i][2];
    var kk = keys[i];
    var c = m[kk[0]], chg = m[kk[1]], amt = m[kk[2]], amtd = m[kk[3]];
    var u = (num(chg) || 0) >= 0;
    var an = getAn(cd);
    var spark = "";
    if(an && an.closes){
      var N = Math.min(60, an.closes.length);
      spark = sparkSvg(an.closes.slice(an.closes.length - N), u ? "#ff6b6b" : "#4ade80");
    }
    var dev = null;
    if(an && nn(an.ma20[an.i]) && an.ma20[an.i]) dev = (an.close / an.ma20[an.i] - 1) * 100;
    h += '<div class="kpi ' + (u ? "up" : "down") + '" data-idx="' + cd + '" title="点击查看 ' + esc(nm) + ' 走势图">' +
         '<div class="lb">' + nm + (dev != null ? ' <span class="muted2">距MA20 ' + (dev > 0 ? "+" : "") + dev.toFixed(1) + '%</span>' : '') + '</div>' +
         '<div class="vl">' + f2(c) + '</div>' +
         '<div class="ex"><b class="' + (u ? "up" : "down") + '">' + pct(chg) + '</b> · 成交额 ' + (amt != null ? f2(amt) + '亿' : '数据缺失') +
         (amtd != null ? '（环比 ' + pct(amtd) + '）' : '') + '</div>' +
         spark + '</div>';
  }
  box.innerHTML = h;
  idxV2SyncUI();   /* 同步 KPI 卡选中态 */
}

/* ============================================================
   四、绑定
   ============================================================ */
function bindIdxV2(){
  idxEnsure();
  var seg = function(id, attr, fn){
    var box = $(id); if(!box) return;
    box.addEventListener("click", function(e){
      var b = e.target.closest ? e.target.closest("button") : null;
      if(!b) return;
      var v = b.getAttribute(attr); if(v == null) return;
      var all = box.querySelectorAll("button");
      for(var i = 0; i < all.length; i++) all[i].classList.remove("on");
      b.classList.add("on");
      fn(v);
      idxSavePref();
      renderIdxChart();
      idxV2SyncUI();
    });
  };
  seg("segIdxType", "data-t", function(v){ IDXV.mode = v; });
  seg("segIdxPick", "data-c", function(v){ IDXV.pick = v; });
  seg("segIdxPeriod", "data-p", function(v){ IDXV.period = v; });
  seg("segIdxSpan", "data-n", function(v){ IDXV.span = parseInt(v, 10); });
  seg("segIdxWavePct", "data-w", function(v){ IDXV.wavePct = v; });

  var ck = function(id, key){
    idxEnsure();
    var e = $(id); if(!e) return;
    e.checked = !!IDXV[key];
    e.addEventListener("change", function(){ IDXV[key] = e.checked; idxSavePref(); renderIdxChart(); idxV2SyncUI(); });
  };
  ck("ckIdxTrend", "trend");
  ck("ckIdxChan",  "chan");
  ck("ckIdxWave",  "wave");
  ck("ckIdxMa",    "ma");
  ck("ckIdxFill",  "fill");
  ck("ckIdxVol",   "vol");

  var png = $("btnIdxPng");
  if(png) png.onclick = function(){
    var el = $("idxChart");
    if(!el || !el._c){ alert("图表未就绪"); return; }
    try{
      var url = el._c.getDataURL({type:"png", pixelRatio:2, backgroundColor:"#0d131d"});
      var a = document.createElement("a");
      a.href = url; a.download = "指数走势_" + (IDX_SINGLE() ? IDX_PICK_NAME() : "三指数") + "_" + new Date().toISOString().slice(0,10) + ".png";
      a.click();
    }catch(e){ alert("导出失败：" + e.message); }
  };

  /* 重置视图 */
  var rst = $("btnIdxReset");
  if(rst) rst.onclick = function(){
    IDXV.mode = "kline"; IDXV.pick = "000001"; IDXV.period = "day"; IDXV.span = 60;
    IDXV.trend = true; IDXV.chan = true; IDXV.wave = true;
    IDXV.ma = true; IDXV.vol = true; IDXV.fill = false; IDXV.wavePct = "auto";
    idxSavePref(); renderIdxChart();
  };
  /* 全屏 */
  var fb = $("btnIdxFull");
  if(fb) fb.onclick = function(){ idxFullscreen(); };

  /* 点击 KPI 卡 → 切换下方图表标的 */
  var cards = $("idxCards");
  if(cards && cards.addEventListener){
    cards.addEventListener("click", function(e){
      var t = e.target, el = (t && t.closest) ? t.closest(".kpi[data-idx]") : null;
      if(!el) return;
      var cd = el.getAttribute("data-idx"); if(!cd) return;
      idxEnsure();
      IDXV.pick = cd;
      if(!IDX_SINGLE()) IDXV.mode = "kline";     /* 三指数模式下点卡片自动切到单指数K线 */
      idxSavePref(); renderIdxChart();
    });
  }
  /* 键盘快捷键（仅大盘页可见且未聚焦输入框） */
  if(!bindIdxV2._hot){
    bindIdxV2._hot = 1;
    document.addEventListener("keydown", idxHotkey);
  }
  idxV2SyncUI();
}

/* ---------------- 全屏 / 快捷键 ---------------- */
function idxFullscreen(){
  var cl = $("clab"); if(!cl || !cl.classList) return;
  var on = cl.classList.toggle("fs");
  try{ document.body.classList.toggle("fs-lock", on); }catch(e){}
  var fit = function(){
    var el = $("idxChart");
    if(el && el._c && el._c.resize) { try{ el._c.resize(); }catch(e){} }
  };
  setTimeout(fit, 40); setTimeout(fit, 220);
  idxV2SyncUI();
}
function idxHotkey(e){
  if(!e || e.ctrlKey || e.metaKey || e.altKey) return;
  var sec = document.getElementById("market");
  var vis = sec && sec.classList && sec.classList.contains("on");
  if(!vis) return;
  var a = document.activeElement;
  if(a && a.tagName && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)) return;
  var ck = document.getElementById("cmdk");
  if(ck && ck.style && ck.style.display && ck.style.display !== "none") return;
  idxEnsure();
  var k = e.key, changed = false;
  if(e.key === "Escape"){
    var cl = $("clab");
    if(cl && cl.classList && cl.classList.contains("fs")){ idxFullscreen(); e.preventDefault(); }
    return;
  }
  if(k === "1" || k === "2" || k === "3"){
    IDXV.pick = ["000001","399001","399006"][parseInt(k, 10) - 1];
    if(!IDX_SINGLE()) IDXV.mode = "kline";
    changed = true;
  }else if(k === "[" || k === "]"){
    var SP = [20, 60, 120, 0], i = SP.indexOf(parseInt(IDXV.span, 10) || 0);
    if(i < 0) i = 1;
    i = (k === "]") ? Math.min(SP.length - 1, i + 1) : Math.max(0, i - 1);
    IDXV.span = SP[i]; changed = true;
  }
  if(!changed) return;
  e.preventDefault();
  idxSavePref(); renderIdxChart();
}

/* ---------------- UI 同步 ---------------- */
function idxSetDis(id, on){
  var e = $(id); if(!e || !e.classList) return;
  e.classList.toggle("dis", !!on);
}
function idxChipSync(id, on){
  var e = $(id); if(!e) return;
  if(e.classList) e.classList.toggle("on", !!on);
  var inp = (e.querySelector ? e.querySelector("input") : null);
  if(inp) inp.checked = !!on;
}
function idxV2SyncUI(){
  idxEnsure();
  var st = idxUiState(), single = st.single;

  /* 结果区显隐：这些是纵向堆叠的结果卡，隐藏不会造成布局跳动 */
  ["idxTrendBox","idxWaveBox","idxLevels"].forEach(function(id){
    var b = $(id); if(b) b.style.display = single ? "" : "none";
  });

  /* 控制台可用态：用「变暗」代替「隐藏」，避免切换图型时整排控件跳动 */
  idxSetDis("grpIdxTarget", st.dis.target);
  idxSetDis("grpIdxDraw",   st.dis.target);
  idxSetDis("wavePctWrap",  st.dis.wavePct);
  idxSetDis("tchipVol",     st.dis.vol);
  idxSetDis("tchipFill",    st.dis.fill);

  /* 分段按钮选中态 */
  var sync = function(id, attr, val){
    var box = $(id); if(!box) return;
    var all = box.querySelectorAll("button");
    for(var i = 0; i < all.length; i++){
      all[i].classList.toggle("on", all[i].getAttribute(attr) === String(val));
    }
  };
  sync("segIdxType",    "data-t", IDXV.mode);
  sync("segIdxPick",    "data-c", IDXV.pick);
  sync("segIdxPeriod",  "data-p", IDXV.period);
  sync("segIdxSpan",    "data-n", IDXV.span);
  sync("segIdxWavePct", "data-w", IDXV.wavePct);

  /* 开关 chip 选中态 */
  idxChipSync("tchipTrend", !!IDXV.trend);
  idxChipSync("tchipChan",  !!IDXV.chan);
  idxChipSync("tchipWave",  !!IDXV.wave);
  idxChipSync("tchipMa",    !!IDXV.ma);
  idxChipSync("tchipVol",   !!IDXV.vol);
  idxChipSync("tchipFill",  !!IDXV.fill);

  /* 头部 */
  idxHeadSync(st);

  /* KPI 卡选中态 + 全屏按钮文案 */
  var cards = $("idxCards");
  if(cards && cards.querySelectorAll){
    var items = cards.querySelectorAll(".kpi");
    for(var j = 0; j < items.length; j++){
      var cd = items[j].getAttribute ? items[j].getAttribute("data-idx") : null;
      if(items[j].classList) items[j].classList.toggle("sel", !!(single && cd === IDXV.pick));
    }
  }
  var fb = $("btnIdxFull"), cl = $("clab");
  if(fb) fb.textContent = (cl && cl.classList && cl.classList.contains("fs")) ? "✕ 退出全屏" : "⛶ 全屏";
}

/* ============================================================
   五、覆盖大盘页总渲染（KPI 卡换成带迷你走势的版本）
   —— 直接展开原步骤，不做函数包装（避免同名声明提升导致自递归）
   ============================================================ */
function renderMarket(){
  const b = state.breadth || {};
  renderIdxSpark();
  ["up","dn","zt","dt","zb","amt"].forEach(k=>{ const e=$("b_"+k); if(e&&b[k]!=null)e.value=b[k]; });
  const vn=$("vol_note"); if(vn&&state.vol_note)vn.value=state.vol_note;
  renderIdxMa();
  renderIdxChart();
  renderBreadthBar();
  renderSnapshot();
  renderSectorMap();
  renderMarketAi();
}

function idxV2Boot(){
  if(typeof state === "undefined" || !state || !state.holdings){
    setTimeout(idxV2Boot, 40); return;
  }
  try{
    bindIdxV2();
    if(typeof renderIdxSpark === "function") renderIdxSpark();
    idxV2SyncUI();
  }catch(e){ if(window.console) console.warn("idxV2Boot:", e); }
}
if(document.readyState === "loading"){
  document.addEventListener("DOMContentLoaded", function(){ setTimeout(idxV2Boot, 60); });
}else{
  setTimeout(idxV2Boot, 60);
}
