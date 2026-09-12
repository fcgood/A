/* ============================================================
   A股复盘分析器 · 引擎一：指标计算 / 多空信号 / 五维评分 / 三周期
   ============================================================ */
"use strict";
var LS_KEY="ashare_review_v3";
var UP="#ff4d4f", DOWN="#22c55e", NEU="#8b949e", ACC="#4c8dff", WARN="#f5a524", PURPLE="#a371f7";

function $(id){return document.getElementById(id);}
function num(x){const v=parseFloat(String(x).replace(/,/g,""));return isFinite(v)?v:null;}
function f2(x){return x==null?"数据缺失":(Math.round(x*100)/100).toFixed(2);}
function f1(x){return x==null?"数据缺失":(Math.round(x*10)/10).toFixed(1);}
function f3(x){return x==null?"数据缺失":(Math.round(x*1000)/1000).toFixed(3);}
function pct(x){if(x==null)return "数据缺失";const v=num(x);return v==null?"数据缺失":(v>0?"+":"")+v.toFixed(2)+"%";}
function esc(s){return String(s==null?"":s).replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));}
function nn(x){return x!=null&&isFinite(x);}

/* ---------- 基础指标 ---------- */
function sma(arr,n){const o=[];let s=0;for(let i=0;i<arr.length;i++){s+=arr[i];if(i>=n)s-=arr[i-n];o.push(i>=n-1?s/n:null);}return o;}
function ema(arr,n){const o=[];const k=2/(n+1);let p=null;for(let i=0;i<arr.length;i++){p=p==null?arr[i]:arr[i]*k+p*(1-k);o.push(p);}return o;}
function macd(closes){const e12=ema(closes,12),e26=ema(closes,26);const dif=e12.map((v,i)=>v-e26[i]);const dea=ema(dif,9);const bar=dif.map((v,i)=>(v-dea[i])*2);return {dif,dea,bar};}
function rsi(closes,n=14){
  const o=new Array(closes.length).fill(null);
  if(closes.length<=n)return o;
  let g=0,l=0;
  for(let i=1;i<=n;i++){const d=closes[i]-closes[i-1];if(d>0)g+=d;else l-=d;}
  g/=n;l/=n;o[n]= l===0?100:100-100/(1+g/l);
  for(let i=n+1;i<closes.length;i++){
    const d=closes[i]-closes[i-1];
    g=(g*(n-1)+(d>0?d:0))/n; l=(l*(n-1)+(d<0?-d:0))/n;
    o[i]= l===0?100:100-100/(1+g/l);
  }
  return o;
}
function kdj(highs,lows,closes,n=9){
  const K=[],D=[],J=[],RSV=[];
  let k=50,d=50;
  for(let i=0;i<closes.length;i++){
    if(i<n-1){K.push(null);D.push(null);J.push(null);RSV.push(null);continue;}
    let hh=-Infinity,ll=Infinity;
    for(let j=i-n+1;j<=i;j++){if(highs[j]>hh)hh=highs[j];if(lows[j]<ll)ll=lows[j];}
    const rsv= hh===ll?50:(closes[i]-ll)/(hh-ll)*100;
    RSV.push(rsv);
    k=(2*k+rsv)/3; d=(2*d+k)/3;
    K.push(k);D.push(d);J.push(3*k-2*d);
  }
  return {K,D,J,RSV};
}
function boll(closes,n=20,m=2){
  const mid=sma(closes,n),up=[],lo=[];
  for(let i=0;i<closes.length;i++){
    if(mid[i]==null){up.push(null);lo.push(null);continue;}
    let s=0;for(let j=i-n+1;j<=i;j++){const d=closes[j]-mid[i];s+=d*d;}
    const sd=Math.sqrt(s/n);
    up.push(mid[i]+m*sd);lo.push(mid[i]-m*sd);
  }
  return {up,mid,lo};
}
function avgVol(vols,n,i){
  if(i<n-1)return null;let s=0;for(let j=i-n+1;j<=i;j++)s+=vols[j];return s/n;
}
function volRatioSeries(vols,n=5){
  const o=[];for(let i=0;i<vols.length;i++){const a=avgVol(vols,n,i);o.push(a? (vols[i]/a):null);}return o;
}
function atrSeries(highs,lows,closes,n=14){
  const tr=[highs[0]-lows[0]];
  for(let i=1;i<closes.length;i++)tr.push(Math.max(highs[i]-lows[i],Math.abs(highs[i]-closes[i-1]),Math.abs(lows[i]-closes[i-1])));
  const o=[];let p=null;for(let i=0;i<tr.length;i++){p = p==null? tr[i] : (p*(n-1)+tr[i])/n; o.push(i>=n-1?p:null);}
  return o;
}

/* ---------- 背离 ---------- */
function detectDivergence(closes,dif){
  const n=closes.length; if(n<30)return "数据不足 30 根K线，未做背离检测";
  const out=[];
  // 顶背离：近30日内两个价格高点抬升，而对应 DIF 走低
  let h1=-1,h2=-1;let best1=-Infinity,best2=-Infinity;
  for(let i=n-30;i<n-1;i++){ if(closes[i]>best1){best1=closes[i];h1=i;} }
  for(let i=h1+1;i<n;i++){ if(closes[i]>best2){best2=closes[i];h2=i;} }
  if(h1>0&&h2>h1&&closes[h2]>closes[h1]*1.005&&nn(dif[h1])&&nn(dif[h2])&&dif[h2]<dif[h1])
    out.push(`顶背离：${closes[h1].toFixed(2)}(DIF ${dif[h1].toFixed(3)}) → ${closes[h2].toFixed(2)}(DIF ${dif[h2].toFixed(3)})，价格新高而动量走弱`);
  let l1=-1,l2=-1;let lo1=Infinity,lo2=Infinity;
  for(let i=n-30;i<n-1;i++){ if(closes[i]<lo1){lo1=closes[i];l1=i;} }
  for(let i=l1+1;i<n;i++){ if(closes[i]<lo2){lo2=closes[i];l2=i;} }
  if(l1>0&&l2>l1&&closes[l2]<closes[l1]*0.995&&nn(dif[l1])&&nn(dif[l2])&&dif[l2]>dif[l1])
    out.push(`底背离：${closes[l1].toFixed(2)}(DIF ${dif[l1].toFixed(3)}) → ${closes[l2].toFixed(2)}(DIF ${dif[l2].toFixed(3)})，价格新低而动量转强`);
  return out.length?out.join("；"):"未检测到明显背离";
}

/* ---------- 周线聚合 ---------- */
function isoWeek(d){const t=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));const day=(t.getUTCDay()+6)%7;t.setUTCDate(t.getUTCDate()-day+3);const first=new Date(Date.UTC(t.getUTCFullYear(),0,4));return Math.round((t-first)/6048e5)+1;}
function weeklyFromDaily(rows){
  const out=[];let cur=null,key="";
  rows.forEach(r=>{
    const d=new Date(String(r.date||r[0]).replace(/-/g,"/"));
    const k=d.getFullYear()+"-"+isoWeek(d);
    const o=Array.isArray(r)?{date:r[0],o:r[1],h:r[2],l:r[3],c:r[4],v:r[5]}:{date:r.date,o:r.o,h:r.h,l:r.l,c:r.c,v:r.v};
    if(k!==key){ if(cur)out.push(cur); cur={date:o.date,o:o.o,h:o.h,l:o.l,c:o.c,v:o.v}; key=k; }
    else { cur.h=Math.max(cur.h,o.h); cur.l=Math.min(cur.l,o.l); cur.c=o.c; cur.v=cur.v+(o.v||0); cur.date=o.date; }
  });
  if(cur)out.push(cur);
  return out;
}
function analyzeWeekly(wrows){
  if(!wrows||wrows.length<12)return {ok:false,reason:"周线样本不足（需≥12根）"};
  const c=wrows.map(x=>x.c);
  const ma5=sma(c,5),ma10=sma(c,10),ma20=sma(c,20);
  const i=c.length-1;
  const arrange = nn(ma5[i])&&nn(ma10[i])&&nn(ma20[i]) ? (ma5[i]>ma10[i]&&ma10[i]>ma20[i]?"多头排列":(ma5[i]<ma10[i]&&ma10[i]<ma20[i]?"空头排列":"交织震荡")) : "数据不足";
  const slope = nn(ma5[i])&&nn(ma5[i-4]) ? ((ma5[i]-ma5[i-4])/ma5[i-4]*100) : null;
  const m=macd(c);
  return {ok:true,i,len:c.length,close:c[i],ma5:ma5[i],ma10:ma10[i],ma20:ma20[i],arrange,slope,
    dif:m.dif[i],dea:m.dea[i],bar:m.bar[i],
    trend:`周线${arrange}，周MA5=${f2(ma5[i])}${slope!=null?"（近4周"+(slope>0?"上行":"下行")+Math.abs(slope).toFixed(2)+"%）":""}`};
}

/* ---------- K线形态 ---------- */
function detectPatterns(rows){
  const out=[];const n=rows.length;if(n<3)return out;
  const R=k=>({o:num(Array.isArray(rows[k])?rows[k][1]:rows[k].o),h:num(Array.isArray(rows[k])?rows[k][2]:rows[k].h),
    l:num(Array.isArray(rows[k])?rows[k][3]:rows[k].l),c:num(Array.isArray(rows[k])?rows[k][4]:rows[k].c),
    d:Array.isArray(rows[k])?rows[k][0]:rows[k].date});
  for(let i=n-6;i<n;i++){
    if(i<1)continue;
    const a=R(i),b=R(i-1);
    if(a.o==null||b.o==null)continue;
    const body=Math.abs(a.c-a.o), rng=a.h-a.l;
    const upBody=a.c>a.o, dnBody=a.c<a.o;
    const lowTail=Math.min(a.c,a.o)-a.l, upTail=a.h-Math.max(a.c,a.o);
    if(body>0&&lowTail>body*2&&upTail<body*0.7&&rng>0) out.push({i,date:a.d,side:"b",nm:"锤头线",ds:"长下影+小实体，下探后收回"});
    if(body>0&&upTail>body*2&&lowTail<body*0.7&&rng>0) out.push({i,date:a.d,side:"s",nm:"倒锤头",ds:"长上影，上方抛压明显"});
    if(rng>0&&body<=rng*0.12) out.push({i,date:a.d,side:"n",nm:"十字星",ds:"多空平衡，变盘信号"});
    if(dnBody&&upBody&&a.c>=b.o&&a.o<=b.c&&b.c<b.o) out.push({i,date:a.d,side:"b",nm:"看涨吞没",ds:"阳线实体完全包住前一根阴线"});
    if(upBody&&dnBody&&a.c<=b.o&&a.o>=b.c&&b.c>b.o) out.push({i,date:a.d,side:"s",nm:"看跌吞没",ds:"阴线实体完全包住前一根阳线"});
    if(i>=2){
      const c2=R(i-2);
      if(c2.o!=null){
        const u=[c2,b,a].every(x=>x.c>x.o);
        const d3=[c2,b,a].every(x=>x.c<x.o);
        if(u)out.push({i,date:a.d,side:"b",nm:"红三兵",ds:"连续三根阳线，多头推进"});
        if(d3)out.push({i,date:a.d,side:"s",nm:"三只乌鸦",ds:"连续三根阴线，空头压制"});
      }
    }
  }
  return out;
}

/* ---------- 辅助：布林带宽 / 均线发散 / POC / 高低 ---------- */
function bollBw(bl,i){
  if(!nn(bl.up[i])||!nn(bl.lo[i])||!nn(bl.mid[i])||bl.mid[i]===0)return {bw:null,state:"数据缺失"};
  const bw=(bl.up[i]-bl.lo[i])/bl.mid[i]*100;
  let state="常态";
  if(bl.mid[i-5]!=null&&i>=5){
    const pb=(bl.up[i-5]-bl.lo[i-5])/bl.mid[i-5]*100;
    if(bw<pb*0.7)state="收敛（变盘临界）"; else if(bw>pb*1.4)state="扩张（趋势加速）";
  }
  return {bw,state};
}
function maSpread(ma5,ma20,ma60,i){
  const s1=nn(ma5[i])&&nn(ma20[i])&&ma20[i]!==0?(ma5[i]-ma20[i])/ma20[i]*100:null;
  const s2=nn(ma20[i])&&nn(ma60[i])&&ma60[i]!==0?(ma20[i]-ma60[i])/ma60[i]*100:null;
  return {s1,s2};
}
function volumePOC(rows,win){
  win=win||60;
  const seg=rows.slice(-win);
  const cs=seg.map(r=>num(Array.isArray(r)?r[4]:r.c)).filter(nn);
  if(cs.length<5)return {poc:null};
  const ref=cs[Math.floor(cs.length/2)];
  const step=Math.max(0.01, ref*0.01);   /* 固定 1% 价格步长分桶 */
  const buckets={};
  seg.forEach(r=>{
    const h=num(Array.isArray(r)?r[2]:r.h),l=num(Array.isArray(r)?r[3]:r.l),
          c=num(Array.isArray(r)?r[4]:r.c),v=num(Array.isArray(r)?r[5]:r.v)||0;
    if(!nn(c))return;
    const mid=(nn(h)&&nn(l))?(h+l)/2:c;
    const k=Math.round(mid/step);
    if(!buckets[k])buckets[k]={v:0,px:mid};
    buckets[k].v+=v;
    buckets[k].px=(buckets[k].px+buckets[k].cnt*0+mid)/2;
    buckets[k].cnt=(buckets[k].cnt||0)+1;
  });
  let bk=null,bv=-1;
  for(const k in buckets){if(buckets[k].v>bv){bv=buckets[k].v;bk=k;}}
  if(bk==null)return {poc:null};
  return {poc:Number(bk)*step, vol:bv, step};
}
function recentHL(closes,highs,lows,n){
  const h=highs.slice(-n).filter(nn),l=lows.slice(-n).filter(nn);
  return {hi:h.length?Math.max.apply(null,h):null, lo:l.length?Math.min.apply(null,l):null, n};
}

/* ============================================================
   核心：analyzeStock
   ============================================================ */
function analyzeStock(stk){
  const raw=stk&&stk.rows||[];
  const rows=raw.map(r=>Array.isArray(r)
    ?{date:r[0],o:num(r[1]),h:num(r[2]),l:num(r[3]),c:num(r[4]),v:num(r[5]),t:num(r[6])}
    :{date:r.date,o:num(r.o),h:num(r.h),l:num(r.l),c:num(r.c),v:num(r.v),t:num(r.turn)});
  if(rows.length<8)return {err:"K线样本不足（需≥8根），当前 "+rows.length+" 根"};
  const dates=rows.map(r=>r.date), opens=rows.map(r=>r.o), highs=rows.map(r=>r.h),
        lows=rows.map(r=>r.l), closes=rows.map(r=>r.c), vols=rows.map(r=>r.v||0),
        turn=rows.map(r=>r.t);
  const i=closes.length-1;
  const ma5=sma(closes,5),ma10=sma(closes,10),ma20=sma(closes,20),ma60=sma(closes,60);
  const m=macd(closes),dif=m.dif,dea=m.dea,bar=m.bar;
  const r=rsi(closes,14), r6=rsi(closes,6);
  const kd=kdj(highs,lows,closes),K=kd.K,D=kd.D,J=kd.J;
  const bl=boll(closes,20,2);
  const vrs=volRatioSeries(vols,5);
  const atr=atrSeries(highs,lows,closes,14);
  const close=closes[i], pre=closes[i-1], chg=pre?((close-pre)/pre*100):null;

  let arrange="数据不足";
  if(nn(ma5[i])&&nn(ma20[i])&&nn(ma60[i]))
    arrange = (ma5[i]>ma20[i]&&ma20[i]>ma60[i])?"多头排列":(ma5[i]<ma20[i]&&ma20[i]<ma60[i])?"空头排列":(ma5[i]>ma20[i]?"短期修复（MA5上穿MA20，MA60未确认）":"短期转弱（MA5跌破MA20）");
  else if(nn(ma5[i])&&nn(ma20[i])) arrange = ma5[i]>ma20[i]?"短多（MA60数据不足）":"短空（MA60数据不足）";

  let macdSig="数据缺失";
  if(nn(dif[i])&&nn(dea[i])){
    const cross = nn(dif[i-1])&&nn(dea[i-1])&&((dif[i-1]<=dea[i-1]&&dif[i]>dea[i])?"（今日金叉）":((dif[i-1]>=dea[i-1]&&dif[i]<dea[i])?"（今日死叉）":""));
    const rising = nn(bar[i-1])&&bar[i]>bar[i-1];
    macdSig=`DIF=${f3(dif[i])}，DEA=${f3(dea[i])}，柱=${f3(bar[i])}（${bar[i]>=0?"红":"绿"}柱${rising?"走强":"走弱"}）${dif[i]>dea[i]?"，DIF在DEA上方":"，DIF在DEA下方"}${cross}`;
  }
  const rsiV=r[i], rsiZone = !nn(rsiV)?"数据缺失":(rsiV>=80?"超买（≥80）":rsiV>=70?"偏强（70-80）":rsiV>=50?"中性偏多（50-70）":rsiV>=30?"中性偏弱（30-50）":rsiV>=20?"偏弱（20-30）":"超卖（≤20）");
  let kdjSig="数据缺失";
  if(nn(K[i])&&nn(D[i])){
    const cx = nn(K[i-1])&&nn(D[i-1])&&((K[i-1]<=D[i-1]&&K[i]>D[i])?"（今日金叉）":((K[i-1]>=D[i-1]&&K[i]<D[i])?"（今日死叉）":""));
    const blunt = (K[i]>80&&D[i]>80)?"（高位钝化）":(K[i]<20&&D[i]<20)?"（低位钝化）":"";
    kdjSig=`K=${f2(K[i])}，D=${f2(D[i])}，J=${f2(J[i])}${blunt}${cx}`;
  }

  const vr=vrs[i];
  const poc=volumePOC(rows,60);
  const hl60=recentHL(closes,highs,lows,60), hl20=recentHL(closes,highs,lows,20);
  const bw=bollBw(bl,i), ms=maSpread(ma5,ma20,ma60,i);
  const pats=detectPatterns(rows);
  const wk=analyzeWeekly(weeklyFromDaily(rows));
  const diver=detectDivergence(closes,dif);

  /* 支撑压力：近20/60日高低 + POC + 整数关口 + 均线 */
  const supSet=[],resSet=[];
  [hl20,hl60].forEach(h=>{ if(nn(h.lo)&&h.lo<close)supSet.push({v:h.lo,t:"近"+h.n+"日低"}); if(nn(h.hi)&&h.hi>close)resSet.push({v:h.hi,t:"近"+h.n+"日高"}); });
  if(nn(poc.poc)){ (poc.poc<close?supSet:resSet).push({v:poc.poc,t:"密集成交区POC"}); }
  [ma5,ma10,ma20,ma60].forEach((ma,k)=>{ const nm=["MA5","MA10","MA20","MA60"][k]; if(nn(ma[i])){ (ma[i]<close?supSet:resSet).push({v:ma[i],t:nm}); } });
  if(nn(bl.lo[i])&&bl.lo[i]<close)supSet.push({v:bl.lo[i],t:"BOLL下轨"});
  if(nn(bl.up[i])&&bl.up[i]>close)resSet.push({v:bl.up[i],t:"BOLL上轨"});
  const step = close>100?10:(close>50?5:(close>10?1:0.5));
  const rf=Math.ceil(close/step)*step, sf=Math.floor(close/step)*step;
  if(rf>close&&rf<close*1.06)resSet.push({v:rf,t:"整数关口"});
  if(sf<close&&sf>close*0.94)supSet.push({v:sf,t:"整数关口"});
  const dedup=a=>{const s=new Set();return a.filter(x=>{const k=x.v.toFixed(2);if(s.has(k))return false;s.add(k);return true;});};
  const supAll=dedup(supSet).sort((a,b)=>b.v-a.v).slice(0,4);
  const resAll=dedup(resSet).sort((a,b)=>a.v-b.v).slice(0,4);
  const sup=supAll.map(x=>x.v), res=resAll.map(x=>x.v);

  const an={rows,dates,opens,highs,lows,closes,vols,turn,i,close,pre,chg,
    ma5,ma10,ma20,ma60,dif,dea,bar,r,r6,K,D,J,bl,vrs,atr,vr,
    arrange,macdSig,rsiV,rsiZone,kdjSig,sup,res,supAll,resAll,diver,
    poc,hl20,hl60,bw,ms,pats,wk,lastTurn:turn[i],
    name:stk&&stk.name||"",code:stk&&stk.code||""};
  an.sigs=genSignals(an);
  an.score=scoreTech(an);
  an.tf=tfVerdict(an);
  an.chan=channelLines(an);
  /* 自身历史分位 */
  an.hist=scoreSeries(an,120);
  const cur=an.hist.length?an.hist[an.hist.length-1].v:an.score.total;
  const below=an.hist.filter(x=>x.v<cur).length;
  an.scorePct=an.hist.length>5?Math.round(below/an.hist.length*100):null;
  return an;
}

/* ============================================================
   多空信号引擎（客观形态识别，非交易指令）
   ============================================================ */
function genSignals(an){
  const S=[], n=an.closes.length;
  const push=(i,side,nm,ds,st)=>{ if(i<0||i>=n)return; S.push({i,date:an.dates[i],side,nm,ds,st:st||1,price:an.closes[i]}); };
  const hh=(arr,end,len)=>{const s=arr.slice(Math.max(0,end-len+1),end+1).filter(nn);return s.length?Math.max.apply(null,s):null;};

  for(let k=1;k<n;k++){
    /* MACD */
    if(nn(an.dif[k-1])&&nn(an.dea[k-1])&&nn(an.dif[k])&&nn(an.dea[k])){
      if(an.dif[k-1]<=an.dea[k-1]&&an.dif[k]>an.dea[k]) push(k,"b","MACD金叉",`DIF ${f3(an.dif[k])} 上穿 DEA ${f3(an.dea[k])}`,2);
      if(an.dif[k-1]>=an.dea[k-1]&&an.dif[k]<an.dea[k]) push(k,"s","MACD死叉",`DIF ${f3(an.dif[k])} 下穿 DEA ${f3(an.dea[k])}`,2);
    }
    /* 均线金叉/死叉 MA5 vs MA20 */
    if(nn(an.ma5[k-1])&&nn(an.ma20[k-1])&&nn(an.ma5[k])&&nn(an.ma20[k])){
      if(an.ma5[k-1]<=an.ma20[k-1]&&an.ma5[k]>an.ma20[k]) push(k,"b","均线金叉",`MA5 ${f2(an.ma5[k])} 上穿 MA20 ${f2(an.ma20[k])}`,2);
      if(an.ma5[k-1]>=an.ma20[k-1]&&an.ma5[k]<an.ma20[k]) push(k,"s","均线死叉",`MA5 ${f2(an.ma5[k])} 下穿 MA20 ${f2(an.ma20[k])}`,2);
    }
    /* KDJ */
    if(nn(an.K[k-1])&&nn(an.D[k-1])&&nn(an.K[k])&&nn(an.D[k])){
      if(an.K[k-1]<=an.D[k-1]&&an.K[k]>an.D[k]) push(k,"b","KDJ金叉",`K ${f2(an.K[k])} 上穿 D ${f2(an.D[k])}`+(an.D[k]<30?"（低位区，信号较强）":an.D[k]>70?"（高位钝化，信号打折）":""),an.D[k]<30?2:1);
      if(an.K[k-1]>=an.D[k-1]&&an.K[k]<an.D[k]) push(k,"s","KDJ死叉",`K ${f2(an.K[k])} 下穿 D ${f2(an.D[k])}`+(an.D[k]>70?"（高位区，信号较强）":an.D[k]<30?"（低位区，信号打折）":""),an.D[k]>70?2:1);
    }
    /* RSI 超卖回升 / 超买回落 */
    if(nn(an.r[k-1])&&nn(an.r[k])){
      if(an.r[k-1]<30&&an.r[k]>=30) push(k,"b","RSI超卖回升",`RSI(14) 由 ${f1(an.r[k-1])} 回升至 ${f1(an.r[k])}`,2);
      if(an.r[k-1]>70&&an.r[k]<=70) push(k,"s","RSI超买回落",`RSI(14) 由 ${f1(an.r[k-1])} 回落至 ${f1(an.r[k])}`,2);
    }
    /* 量能 */
    const av=avgVol(an.vols,5,k);
    if(av&&nn(an.vols[k])){
      const ratio=an.vols[k]/av;
      if(ratio>1.8){
        const prevHi=hh(an.highs,k-1,20);
        if(prevHi!=null&&an.closes[k]>prevHi&&an.closes[k]>an.closes[k-1])
          push(k,"b","放量突破",`量能 ${ratio.toFixed(2)} 倍于5日均量，收盘 ${f2(an.closes[k])} 突破前20日高点 ${f2(prevHi)}`,2);
        else if(an.closes[k]<an.closes[k-1])
          push(k,"s","放量下跌",`量能 ${ratio.toFixed(2)} 倍于5日均量且收阴，抛压释放`,2);
      }
      if(ratio<0.6&&nn(an.ma20[k])&&an.closes[k]>an.ma20[k]&&an.closes[k]<an.closes[k-1])
        push(k,"s","缩量回踩",`量能仅 ${ratio.toFixed(2)} 倍，缩量回落但仍处 MA20 上方`,1);
    }
    /* MA60 攻防 */
    if(nn(an.ma60[k-1])&&nn(an.ma60[k])){
      if(an.closes[k-1]<=an.ma60[k-1]&&an.closes[k]>an.ma60[k]) push(k,"b","站上MA60",`收盘 ${f2(an.closes[k])} 收复 MA60 ${f2(an.ma60[k])}`,2);
      if(an.closes[k-1]>=an.ma60[k-1]&&an.closes[k]<an.ma60[k]) push(k,"s","跌破MA60",`收盘 ${f2(an.closes[k])} 失守 MA60 ${f2(an.ma60[k])}`,2);
    }
    /* BOLL */
    if(nn(an.bl.lo[k])&&nn(an.lows[k])&&an.lows[k]<=an.bl.lo[k]*1.005&&an.closes[k]>an.opens[k])
      push(k,"b","下轨获支撑",`最低 ${f2(an.lows[k])} 触及 BOLL 下轨 ${f2(an.bl.lo[k])} 后收阳`,1);
    if(nn(an.bl.up[k])&&nn(an.highs[k])&&an.highs[k]>=an.bl.up[k]*0.995&&an.closes[k]<an.opens[k])
      push(k,"s","上轨受阻",`最高 ${f2(an.highs[k])} 触及 BOLL 上轨 ${f2(an.bl.up[k])} 后收阴`,1);
  }
  /* 形态 */
  (an.pats||[]).forEach(p=>push(p.i,p.side,p.nm,p.ds,1));
  /* 背离（落在最后一根） */
  if(typeof an.diver==="string"){
    if(an.diver.indexOf("顶背离")>=0) push(n-1,"s","顶背离",an.diver.split("；").filter(s=>s.indexOf("顶背离")>=0)[0],2);
    if(an.diver.indexOf("底背离")>=0) push(n-1,"b","底背离",an.diver.split("；").filter(s=>s.indexOf("底背离")>=0)[0],2);
  }
  /* 合并同一日同方向的信号，保留强度最高的 */
  const byDay={};
  S.forEach(s=>{const k=s.i+"|"+s.side;if(!byDay[k]||s.st>byDay[k].st)byDay[k]=s;});
  const merged=Object.keys(byDay).map(k=>byDay[k]);
  /* 同类信号冷却：10 个交易日内只保留最新一次，避免同一形态反复刷屏 */
  /* 按信号类型差异化冷却（KDJ/MACD 等敏感指标需要更长间隔，避免刷屏） */
  const COOL={"MACD金叉":15,"MACD死叉":15,"均线金叉":15,"均线死叉":15,
    "KDJ金叉":15,"KDJ死叉":15,"RSI超卖回升":20,"RSI超买回落":20,
    "放量突破":10,"放量下跌":10,"缩量回踩":10,"站上MA60":15,"跌破MA60":15,
    "下轨获支撑":10,"上轨受阻":10,"顶背离":30,"底背离":30};
  merged.sort((a,b)=>b.i-a.i);          /* 由新到旧 */
  const out=[],lastByName={};
  merged.forEach(s=>{
    const lk=lastByName[s.nm], need=COOL[s.nm]||10;
    if(lk!=null&&(lk-s.i)<need)return;  /* 与已保留的同名信号间隔不足 → 跳过 */
    lastByName[s.nm]=s.i;out.push(s);
  });
  return out.sort((a,b)=>b.i-a.i);
}

/* ============================================================
   历史评分序列：用同一套规则回算近 N 日简化分，用于算"自身分位"
   ============================================================ */
function scoreSeries(an,lookback){
  lookback=lookback||120;
  const n=an.closes.length, st=Math.max(1,n-lookback), out=[];
  const hi=an.hl60?an.hl60.hi:null, lo=an.hl60?an.hl60.lo:null;
  for(let k=st;k<n;k++){
    const ma5=an.ma5[k],ma20=an.ma20[k],ma60=an.ma60[k],c=an.closes[k];
    let t=0,m=0,p=0;
    if(nn(ma5))t+=c>ma5?5:0;
    if(nn(ma5)&&nn(ma20))t+=ma5>ma20?5:0;
    if(nn(ma60))t+=c>ma60?10:0;
    if(nn(an.bar[k])){m+=an.bar[k]>=0?10:0;if(nn(an.dif[k])&&nn(an.dea[k])&&an.dif[k]>an.dea[k])m+=5;}
    if(nn(an.r[k]))m+=an.r[k]>=50?Math.min(5,(an.r[k]-50)/30*5):0;
    if(nn(hi)&&nn(lo)&&hi>lo)p=Math.max(0,Math.min(10,(c-lo)/(hi-lo)*10));
    out.push({i:k,date:an.dates[k],v:Math.round((t+m+p)/50*100)});
  }
  return out;
}

/* ============================================================
   五维技术评分（0-100）
   ============================================================ */
function scoreTech(an){
  const i=an.i;
  /* 趋势 30 */
  let trend=0;
  if(an.wk&&an.wk.ok){ if(an.wk.arrange==="多头排列")trend+=10; else if(an.wk.arrange==="空头排列")trend+=0; else trend+=5;
    if(nn(an.wk.slope)) trend += an.wk.slope>0?Math.min(4,an.wk.slope*0.8):0; }
  else trend+=5;
  if(an.arrange==="多头排列")trend+=10; else if(an.arrange==="空头排列")trend+=0;
  else if(an.arrange.indexOf("修复")>=0||an.arrange.indexOf("短多")>=0)trend+=7; else trend+=3;
  if(nn(an.ma60[i])){
    const d=(an.close-an.ma60[i])/an.ma60[i]*100;
    trend += d>0?6:Math.max(0,6+d*0.8);   /* 离 MA60 越远越扣分，避免全 0 */
  } else trend+=3;
  trend=Math.max(0,Math.min(26,trend))+4;   /* 基础分 4，满分 30 */
  /* 动量 25（RSI/KDJ 用连续映射，避免非黑即白） */
  let momentum=0;
  if(nn(an.bar[i])){ momentum += an.bar[i]>=0?8:0; if(nn(an.bar[i-1])) momentum += an.bar[i]>an.bar[i-1]?4:0; if(an.dif[i]>an.dea[i])momentum+=3; }
  if(nn(an.rsiV)) momentum += Math.round(an.rsiV/100*6);
  if(nn(an.K[i])) momentum += Math.round(Math.min(4,an.K[i]/100*4));
  momentum=Math.max(0,Math.min(22,momentum))+3;
  /* 量能 15 */
  let volume=0;
  if(nn(an.vr)) volume += an.vr>1.2?8:(an.vr>0.9?5:2);
  if(nn(an.vr)&&nn(an.chg)) volume += (an.chg>0&&an.vr>1)?7:((an.chg<0&&an.vr>1)?0:4);
  volume=Math.max(0,Math.min(12,volume))+3;
  /* 位置 15 */
  let position=0;
  if(nn(an.bl.up[i])&&nn(an.bl.lo[i])&&an.bl.up[i]>an.bl.lo[i]){
    const p=(an.close-an.bl.lo[i])/(an.bl.up[i]-an.bl.lo[i])*100;
    position += Math.round(Math.max(0,Math.min(100,p))/100*8);
  }
  if(nn(an.hl60.hi)&&nn(an.hl60.lo)&&an.hl60.hi>an.hl60.lo){
    const p=(an.close-an.hl60.lo)/(an.hl60.hi-an.hl60.lo)*100;
    position += Math.round(Math.max(0,Math.min(100,p))/100*7);
  }
  position=Math.max(0,Math.min(15,position));
  /* 形态 15 */
  let pattern=7;
  const recent=(an.sigs||[]).filter(s=>s.i>=an.i-20);
  let net=0; recent.forEach(s=>net += s.side==="b"?s.st:(s.side==="s"?-s.st:0));
  pattern += Math.max(-6,Math.min(6,net*1.2));
  const lastPats=(an.pats||[]).filter(p=>p.i>=an.i-5);
  lastPats.forEach(p=>pattern += p.side==="b"?1.5:(p.side==="s"?-1.5:0));
  pattern=Math.max(0,Math.min(15,Math.round(pattern)));

  const total=Math.round(trend+momentum+volume+position+pattern);
  let label,tone;
  if(total>=72){label="极强";tone="up";}
  else if(total>=58){label="偏强";tone="up";}
  else if(total>=42){label="中性震荡";tone="neu";}
  else if(total>=28){label="偏弱";tone="down";}
  else {label="极弱";tone="down";}
  return {total,label,tone,dims:{趋势:Math.round(trend),动量:Math.round(momentum),量能:Math.round(volume),位置:Math.round(position),形态:pattern},
    caps:{趋势:30,动量:25,量能:15,位置:15,形态:15}};
}

/* ============================================================
   短 / 中 / 长 三周期研判
   ============================================================ */
function tfVerdict(an){
  const i=an.i, out=[];
  const cls=(v)=>v>=0?"up":"down";
  /* 短线 1-5 日 */
  {
    let sc=0, ev=[];
    const ma5=an.ma5[i],ma10=an.ma10[i],c=an.close;
    if(nn(ma5)&&nn(ma10)){ const d=(ma5-ma10)/ma10*100; ev.push(`MA5 ${f2(ma5)} vs MA10 ${f2(ma10)}（${d>0?"多头":"空头"}，乖离 ${d.toFixed(2)}%）`); sc += d>1?2:(d<-1?-2:0); }
    const bias5 = nn(ma5)?(c-ma5)/ma5*100:null;
    if(nn(bias5)){ ev.push(`收盘对 MA5 乖离 ${bias5>0?"+":""}${bias5.toFixed(2)}%`); sc += bias5>2?1:(bias5<-2?-1:0); }
    if(nn(an.r6[i])){ ev.push(`RSI(6)=${f1(an.r6[i])}（${an.r6[i]>=80?"短线超买":an.r6[i]<=20?"短线超卖":"中性区"}）`); sc += an.r6[i]>=80?-1:(an.r6[i]<=20?1:0); }
    if(nn(an.J[i])){ ev.push(`KDJ J=${f2(an.J[i])}（${an.J[i]>100?"超买钝化":an.J[i]<0?"超卖区":"常态"}）`); sc += an.J[i]>100?-1:(an.J[i]<0?1:0); }
    if(nn(an.vr)){ ev.push(`量比 ${an.vr.toFixed(2)}（${an.vr>1.5?"明显放量":an.vr<0.7?"明显缩量":"常态"}）`); sc += (nn(an.chg)&&an.chg>0&&an.vr>1.2)?2:((nn(an.chg)&&an.chg<0&&an.vr>1.2)?-2:0); }
    const label = sc>=3?"短线偏多":(sc<=-3?"短线偏空":"短线中性");
    out.push({tf:"短线（1–5日）",label,tone:sc>=3?"up":(sc<=-3?"down":"neu"),ev,score:sc});
  }
  /* 中线 20-60 日 */
  {
    let sc=0, ev=[];
    ev.push(`均线：${an.arrange}`);
    if(an.arrange==="多头排列")sc+=3; else if(an.arrange==="空头排列")sc-=3;
    else if(an.arrange.indexOf("修复")>=0)sc+=1; else sc-=1;
    if(nn(an.bar[i])){ const rising=nn(an.bar[i-1])&&an.bar[i]>an.bar[i-1]; ev.push(`MACD 柱 ${f2(an.bar[i])}（${an.bar[i]>=0?"红":"绿"}柱，${rising?"走强":"走弱"}）`); sc += (an.bar[i]>=0?2:-2)+(rising?1:-1); }
    if(nn(an.ma20[i])&&nn(an.ma60[i])){ const d=(an.ma20[i]-an.ma60[i])/an.ma60[i]*100; ev.push(`MA20 ${f2(an.ma20[i])} vs MA60 ${f2(an.ma60[i])}（乖离 ${d>0?"+":""}${d.toFixed(2)}%）`); sc += d>2?2:(d<-2?-2:0); }
    if(an.bw&&nn(an.bw.bw)) ev.push(`布林带宽 ${an.bw.bw.toFixed(2)}%（${an.bw.state}）`);
    if(an.ms&&nn(an.ms.s1)) ev.push(`MA5-MA20 发散 ${an.ms.s1>0?"+":""}${an.ms.s1.toFixed(2)}%`);
    const label = sc>=3?"中线偏多":(sc<=-3?"中线偏空":"中线震荡");
    out.push({tf:"中线（20–60日）",label,tone:sc>=3?"up":(sc<=-3?"down":"neu"),ev,score:sc});
  }
  /* 长线 周线 */
  {
    let sc=0, ev=[];
    if(an.wk&&an.wk.ok){
      ev.push(an.wk.trend);
      if(an.wk.arrange==="多头排列")sc+=3; else if(an.wk.arrange==="空头排列")sc-=3;
      if(nn(an.wk.slope)) sc += an.wk.slope>1?2:(an.wk.slope<-1?-2:0);
      if(nn(an.wk.bar)){ ev.push(`周线 MACD 柱 ${f2(an.wk.bar)}（${an.wk.bar>=0?"红":"绿"}）`); sc += an.wk.bar>=0?2:-2; }
      ev.push(`周线样本 ${an.wk.len} 根，周收盘 ${f2(an.wk.close)}`);
    } else { ev.push((an.wk&&an.wk.reason)||"周线数据不足"); }
    const label = sc>=3?"长线偏多":(sc<=-3?"长线偏空":"长线震荡");
    out.push({tf:"长线（周线）",label,tone:sc>=3?"up":(sc<=-3?"down":"neu"),ev,score:sc});
  }
  return out;
}

/* ============================================================
   趋势通道（最近 W 根 close 线性回归 ± 最大偏离）
   ============================================================ */
function channelLines(an,W){
  W=W||Math.min(60,an.closes.length);
  const st=Math.max(0,an.closes.length-W);
  const xs=[],ys=[];
  for(let i=st;i<an.closes.length;i++){xs.push(i-st);ys.push(an.closes[i]);}
  const n=xs.length; if(n<8)return null;
  const mx=xs.reduce((a,b)=>a+b,0)/n, my=ys.reduce((a,b)=>a+b,0)/n;
  let sxy=0,sxx=0;
  for(let k=0;k<n;k++){sxy+=(xs[k]-mx)*(ys[k]-my);sxx+=(xs[k]-mx)*(xs[k]-mx);}
  if(sxx===0)return null;
  const b=sxy/sxx, a=my-b*mx;
  let upDev=-Infinity,dnDev=Infinity;
  for(let k=0;k<n;k++){const fit=a+b*xs[k];const d=ys[k]-fit;if(d>upDev)upDev=d;if(d<dnDev)dnDev=d;}
  const line=(off)=>{const o=new Array(an.closes.length).fill(null);for(let k=0;k<n;k++)o[st+k]=a+b*xs[k]+off;return o;};
  return {mid:line(0),up:line(upDev),lo:line(dnDev),slope:b,slopePct:b/my*100,
    dir:b>0?"上升通道":(b<0?"下降通道":"横向通道")};
}
