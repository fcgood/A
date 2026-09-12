/* ============================================================
   engine6 · AI 深度研判（情景推演 / 操作纪律 / 形态统计 / 组合集中度）
              + 覆盖 buildStockBlock 与 genReport + 新 UI 绑定
   ============================================================ */

/* ---------------- 工具 ---------------- */
function sgnTxt(v){ return v==null?"—":((v>0?"+":"")+Number(v).toFixed(2)); }
function pctTxt(v){ return v==null?"—":((v>0?"+":"")+Number(v).toFixed(2)+"%"); }

/* ============================================================
   一、个股深度研判（在 aiStock 基础上扩展）
   ============================================================ */
function aiStockDeep(an){
  const i=an.i, c=an.close;
  const A=(a,k)=>nn(a&&a[k])?a[k]:null;
  const atr=A(an.atr,i);
  const atrPct=(atr!=null&&c)?(atr/c*100):null;
  const out={};

  /* ---- 1. 五维共振拆解（每一项都给"判定 + 数据"） ---- */
  const dims=[];
  const bullArr=/多头/.test(an.arrange), bearArr=/空头/.test(an.arrange);
  dims.push({nm:"日线趋势",w:26,ok:bullArr,bad:bearArr,
    ev:"均线"+an.arrange+"（MA5 "+f2(A(an.ma5,i))+" / MA20 "+f2(A(an.ma20,i))+" / MA60 "+f2(A(an.ma60,i))+"）"});
  const wk=an.wk||{};
  dims.push({nm:"周线趋势",w:22,ok:(wk.ok&&/多头/.test(wk.arrange)),bad:(wk.ok&&/空头/.test(wk.arrange)),
    ev:wk.ok?("周线"+wk.arrange+"，周MA5近4周斜率 "+(wk.slope!=null?pctTxt(wk.slope):"—")):"周线样本不足"});
  dims.push({nm:"动量 MACD",w:18,ok:(A(an.bar,i)!=null&&A(an.bar,i)>=0),bad:(A(an.bar,i)!=null&&A(an.bar,i)<0),
    ev:"DIF "+f3(A(an.dif,i))+" / DEA "+f3(A(an.dea,i))+" / 柱 "+f3(A(an.bar,i))+"　"+an.macdSig});
  dims.push({nm:"量能配合",w:18,ok:(nn(an.vr)&&an.vr>=1.1),bad:(nn(an.vr)&&an.vr<0.8),
    ev:"量比 "+(nn(an.vr)?an.vr.toFixed(2):"数据缺失")+"，换手 "+(nn(an.lastTurn)?an.lastTurn.toFixed(2)+"%":"数据缺失")});
  dims.push({nm:"相对位置",w:16,ok:(nn(an.scorePct)&&an.scorePct>=60),bad:(nn(an.scorePct)&&an.scorePct<=30),
    ev:"近120日技术评分分位 "+(nn(an.scorePct)?an.scorePct+"%":"数据不足")
      +"；60日区间位置 "+(an.hl60&&an.hl60.hi>an.hl60.lo?((c-an.hl60.lo)/(an.hl60.hi-an.hl60.lo)*100).toFixed(0)+"%":"—")});
  let got=0,tot=0;
  dims.forEach(d=>{tot+=d.w; if(d.ok)got+=d.w; else if(!d.bad)got+=d.w*0.5;});
  out.dims=dims;
  out.resPct=Math.round(got/Math.max(1,tot)*100);

  /* ---- 2. 情景推演（用 ATR 估算幅度，不报点位迷信） ---- */
  const sup1=an.sup[0], res1=an.res[0];
  const kA=(atrPct!=null?atrPct:2.2);   /* ATR% 作为 1 个单位波动 */
  const scen=[];
  scen.push({
    nm:"乐观情景",p:"约 25%",dir:"up",
    cond:"放量站上 "+(res1!=null?f2(res1):"—")+"（最近压力）且量比回到 1.2 以上，MACD 柱同步翻红",
    move:"向上 1.5～2.5 个 ATR ≈ +"+(kA*1.5).toFixed(1)+"% ～ +"+(kA*2.5).toFixed(1)+"%",
    inv:"若突破当日量比 <1.0，视为假突破，情景作废"
  });
  scen.push({
    nm:"中性情景",p:"约 50%",dir:"neu",
    cond:"价格在 "+(sup1!=null?f2(sup1):"—")+" ～ "+(res1!=null?f2(res1):"—")+" 之间震荡，均线继续收敛",
    move:"区间内 ±1 个 ATR ≈ ±"+kA.toFixed(1)+"%",
    inv:"有效跌破支撑或突破压力即切换情景"
  });
  scen.push({
    nm:"悲观情景",p:"约 25%",dir:"down",
    cond:"跌破 "+(sup1!=null?f2(sup1):"—")+"（最近支撑）并收盘确认，或 MA20 下穿 MA60",
    move:"向下 1.5～2.5 个 ATR ≈ -"+(kA*1.5).toFixed(1)+"% ～ -"+(kA*2.5).toFixed(1)+"%",
    inv:"跌破后 3 日内收回且量能萎缩，视为洗盘"
  });
  out.scen=scen;

  /* ---- 3. 操作纪律（条件化，不给死命令） ---- */
  const plan=[];
  const sc=an.score.total;
  let posTxt,posTone;
  if(out.resPct>=72&&sc>=60){posTxt="可持有基准仓位（如原计划的 60%～80%）";posTone="up";}
  else if(out.resPct>=56){posTxt="半仓为主（40%～60%），留加仓子弹";posTone="up";}
  else if(out.resPct>=44){posTxt="轻仓观望（≤30%），等方向明确再加";posTone="neu";}
  else if(out.resPct>=28){posTxt="防守为主（≤20%），反弹减仓";posTone="down";}
  else {posTxt="原则上不加仓，等待止跌信号（如底背离 + 放量阳线）";posTone="down";}
  plan.push({k:"仓位参考",v:posTxt,t:posTone,r:"依据：多周期共振度 "+out.resPct+"% + 技术评分 "+sc});
  if(sup1!=null&&atr!=null)
    plan.push({k:"止损/减仓触发",v:"收盘跌破 "+f2(sup1-atr*0.5)+"（最近支撑 "+f2(sup1)+" 下方 0.5 ATR）",t:"down",
      r:"ATR(14)="+f2(atr)+"，占股价 "+(atrPct!=null?atrPct.toFixed(2):"—")+"%，用作噪声缓冲"});
  if(res1!=null)
    plan.push({k:"加仓触发",v:"放量突破 "+f2(res1)+" 且次日不回补缺口",t:"up",r:"最近压力位，需量能确认"});
  if(A(an.ma20,i)!=null)
    plan.push({k:"趋势失效线",v:"日线收盘连续 3 日低于 MA20（"+f2(A(an.ma20,i))+"）",t:"down",r:"短中期分水岭"});
  if(A(an.ma60,i)!=null)
    plan.push({k:"中期生命线",v:"MA60 = "+f2(A(an.ma60,i))+"，跌破则中期性质转弱",t:((c>=A(an.ma60,i))?"up":"down"),r:"中长期成本线"});
  if(nn(an.rsiV)&&an.rsiV>=72)
    plan.push({k:"过热提示",v:"RSI(14)="+f1(an.rsiV)+" 已超买，不宜追高，可考虑分批兑现",t:"down",r:">70 为超买区"});
  if(nn(an.rsiV)&&an.rsiV<=30)
    plan.push({k:"超卖提示",v:"RSI(14)="+f1(an.rsiV)+" 已超卖，抢反弹需等量能确认",t:"neu",r:"<30 为超卖区"});
  out.plan=plan;

  /* ---- 4. 历史相似形态统计（本地回测，样本来自自身历史） ---- */
  out.hist=aiHistStat(an);

  /* ---- 5. 一句话结论 ---- */
  const v=out.resPct;
  out.verdict = v>=72?("技术面<b>偏强</b>，多周期共振度高（"+v+"%），回踩不破关键均线可视为趋势延续")
    : v>=56?("技术面<b>中性偏多</b>（共振 "+v+"%），但缺少"+((dims.filter(d=>!d.ok).slice(0,1)[0]||{}).nm||"部分")+"确认")
    : v>=44?("技术面<b>胶着</b>（共振 "+v+"%），方向未明，等突破再动手")
    : v>=28?("技术面<b>偏弱</b>（共振 "+v+"%），反弹以减仓思路对待")
    : ("技术面<b>弱势</b>（共振 "+v+"%），尚无有效止跌证据");
  return out;
}

/* 历史相似状态回测：过去出现"同样排列 + 同样 RSI 区间"后 5/10/20 日表现 */
function aiHistStat(an){
  const n=an.dates.length;
  if(n<90)return {ok:false,msg:"样本不足（需 ≥90 根K线，当前 "+n+" 根）"};
  const i=an.i;
  const curArr=/多头/.test(an.arrange)?1:(/空头/.test(an.arrange)?-1:0);
  const curR=nn(an.rsiV)?an.rsiV:50;
  const rLo=curR-6, rHi=curR+6;
  const fwd=[5,10,20];
  const acc=fwd.map(()=>({n:0,sum:0,win:0}));
  let sample=0;
  for(let k=70;k<n-21;k++){
    const a5=nn(an.ma5[k])&&nn(an.ma20[k])&&nn(an.ma60[k])?((an.ma5[k]>an.ma20[k]&&an.ma20[k]>an.ma60[k])?1:((an.ma5[k]<an.ma20[k]&&an.ma20[k]<an.ma60[k])?-1:0)):null;
    if(a5===null||a5!==curArr)continue;
    const rv=an.r[k];
    if(!nn(rv)||rv<rLo||rv>rHi)continue;
    sample++;
    fwd.forEach((f,idx)=>{
      if(k+f>=n)return;
      const ret=(an.closes[k+f]/an.closes[k]-1)*100;
      acc[idx].n++; acc[idx].sum+=ret; if(ret>0)acc[idx].win++;
    });
  }
  if(sample<3)return {ok:false,msg:"相似样本不足（"+sample+" 例，需 ≥3 例），统计不具参考性"};
  return {ok:true,sample:sample,curArr:an.arrange,rsiZone:"["+rLo.toFixed(0)+","+rHi.toFixed(0)+"]",
    rows:fwd.map((f,idx)=>{
      const a=acc[idx];
      return {f:f,n:a.n,avg:a.n?a.sum/a.n:null,win:a.n?a.win/a.n*100:null};
    })};
}

/* ============================================================
   二、大盘深度（五维打分 + 明日观察 + 仓位建议）
   ============================================================ */
function aiMarketDeep(){
  const m=state.market||{}, b=state.breadth||{};
  const sh=num(m.sh_chg),sz=num(m.sz_chg),cy=num(m.cy_chg);
  const cnt=(sh!=null?1:0)+(sz!=null?1:0)+(cy!=null?1:0);
  const avg=cnt?(((sh||0)+(sz||0)+(cy||0))/cnt):null;
  const up=num(b.up),dn=num(b.dn),zt=num(b.zt),dt=num(b.dt),zb=num(b.zb);
  const amt=(num(m.sh_amt)||0)+(num(m.sz_amt)||0);
  const dims=[];

  /* 指数 */
  let d1=50,d1ev="";
  if(avg!=null){
    d1=Math.max(0,Math.min(100,50+avg*15));
    d1ev="三大指数平均 "+(avg>=0?"+":"")+avg.toFixed(2)+"%"
      +"（上证 "+pctTxt(sh)+" / 深证 "+pctTxt(sz)+" / 创业板 "+pctTxt(cy)+"）";
  } else d1ev="指数数据缺失";
  dims.push({nm:"指数涨跌",s:Math.round(d1),ev:d1ev,miss:avg==null});

  /* 宽度 */
  let d2=50,d2ev="";
  if(up!=null&&dn!=null&&(up+dn)>0){
    const r=up/(up+dn);
    d2=Math.max(0,Math.min(100,r*100));
    d2ev="涨 "+up+" / 跌 "+dn+" 家，涨跌比 "+r.toFixed(2)
      +(r>=2?"（普涨）":r>=1.2?"（涨多跌少）":r>=0.8?"（均衡分化）":r>=0.5?"（跌多涨少）":"（普跌）");
  } else { d2ev="涨跌家数缺失（点顶部「↻ 刷新行情」补全）"; }
  dims.push({nm:"市场宽度",s:Math.round(d2),ev:d2ev,miss:(up==null||dn==null)});

  /* 情绪（涨停/跌停/炸板） */
  let d3=50,d3ev="";
  if(zt!=null){
    d3=Math.max(0,Math.min(100,25+zt*0.75-(dt||0)*1.2));
    d3ev="涨停 "+zt+" 家"+(dt!=null?"，跌停 "+dt+" 家":"")+(zb!=null?"，炸板 "+zb+" 家":"");
    if(zb!=null&&(zt+zb)>0){
      const zbr=zb/(zt+zb)*100;
      d3ev+="，炸板率 "+zbr.toFixed(1)+"%"+(zbr>35?"（偏高·追涨风险大）":zbr<15?"（偏低·封板质量好）":"（中性）");
      d3-=Math.max(0,(zbr-30)*0.5);
    }
    d3=Math.max(0,Math.min(100,d3));
  } else d3ev="涨停/跌停数据缺失";
  dims.push({nm:"情绪温度",s:Math.round(d3),ev:d3ev,miss:zt==null});

  /* 量能 */
  let d4=50,d4ev="";
  if(amt>0){
    d4=amt>=22000?85:amt>=16000?70:amt>=11000?55:amt>=8000?42:25;
    d4ev="两市成交 "+f2(amt)+" 亿"+(amt>=22000?"（显著放量）":amt>=11000?"（量能中性）":"（明显缩量）");
  } else d4ev="成交额数据缺失";
  dims.push({nm:"量能水平",s:Math.round(d4),ev:d4ev,miss:!(amt>0)});

  /* 结构（指数自身技术位） */
  let d5=50,d5ev="",d5n=0,acc=0;
  [["000001","上证"],["399001","深证"],["399006","创业板"]].forEach(function(x){
    let an=null; try{an=getAn(x[0]);}catch(e){}
    if(!an||!nn(an.ma20[an.i]))return;
    let s=50;
    if(an.close>an.ma20[an.i])s+=18; else s-=18;
    if(nn(an.ma60[an.i])){ if(an.close>an.ma60[an.i])s+=16; else s-=16; }
    if(nn(an.bar[an.i])){ if(an.bar[an.i]>=0)s+=10; else s-=10; }
    acc+=Math.max(0,Math.min(100,s)); d5n++;
    d5ev+=x[1]+" "+f2(an.close)+"（MA20 "+(an.close>an.ma20[an.i]?"上":"下")+"、MA60 "
      +(nn(an.ma60[an.i])?(an.close>an.ma60[an.i]?"上":"下"):"—")+"、"+(an.arrange||"")+"）　";
  });
  if(d5n)d5=acc/d5n; else d5ev="指数K线数据缺失";
  dims.push({nm:"指数结构",s:Math.round(d5),ev:d5ev.trim(),miss:!d5n});

  const valid=dims.filter(d=>!d.miss);
  const total=valid.length?Math.round(valid.reduce((a,d)=>a+d.s,0)/valid.length):50;
  let tone,icon,title;
  if(total>=70){tone="up";icon="▲";title="市场环境偏暖，可积极参与";}
  else if(total>=56){tone="up";icon="▲";title="环境结构性偏暖，择优参与";}
  else if(total>=45){tone="neu";icon="◆";title="环境中性震荡，控制节奏";}
  else if(total>=32){tone="down";icon="▼";title="环境偏弱，防守为先";}
  else {tone="down";icon="▼";title="环境弱势，降低仓位与操作频率";}

  /* 明日观察点 */
  const tw=[];
  if(up!=null&&dn!=null)tw.push("涨跌家数能否由 "+(up>=dn?"涨":"跌")+"转"+(up>=dn?"跌":"涨")+"——宽度拐点通常先于指数拐点");
  if(zt!=null)tw.push("涨停家数（今日 "+zt+" 家）能否维持，跌停是否收敛");
  if(amt>0)tw.push("两市成交能否维持 "+f2(amt)+" 亿量级，缩量至 8000 亿以下需降仓");
  [["000001","上证"],["399006","创业板"]].forEach(function(x){
    let an=null; try{an=getAn(x[0]);}catch(e){}
    if(!an||!nn(an.ma20[an.i]))return;
    tw.push(x[1]+"指数 MA20 = "+f2(an.ma20[an.i])+"，当前 "+(an.close>an.ma20[an.i]?"站上（多头防线）":"跌破（反弹压力）"));
  });
  const sn=state.snap||{};
  if(sn.hot&&sn.hot.length)tw.push("领涨主线「"+sn.hot[0].name+"」次日能否延续——主线断则情绪快速降温");
  if(sn.net&&sn.net.length&&(num(sn.net[0].net)||0)<0)
    tw.push("主力净流出居前的「"+sn.net[0].name+"」能否止住流出");

  /* 仓位建议 */
  let pos,posR;
  if(total>=70){pos="七成以上，可适度进攻";posR="五维均分 "+total+"（偏暖）";}
  else if(total>=56){pos="五至七成，结构优先";posR="五维均分 "+total+"（结构性）";}
  else if(total>=45){pos="三至五成，快进快出";posR="五维均分 "+total+"（中性）";}
  else if(total>=32){pos="二至三成，以守代攻";posR="五维均分 "+total+"（偏弱）";}
  else {pos="两成以下或空仓观望";posR="五维均分 "+total+"（弱势）";}

  const miss=dims.filter(d=>d.miss).map(d=>d.nm);
  return {dims:dims,total:total,tone:tone,icon:icon,title:title,tomorrow:tw,pos:pos,posR:posR,miss:miss};
}

/* ============================================================
   三、组合深度（集中度 / 相关性 / 再平衡）
   ============================================================ */
function aiPortfolioDeep(list){
  const rows=[];
  (list||[]).forEach(h=>{const an=getAn(h.code); if(an)rows.push({h,an});});
  if(rows.length<2)return null;
  const n=rows.length;

  /* 收益序列（近 60 日） */
  const R={};
  rows.forEach(r=>{
    const a=r.an, len=a.closes.length, s=Math.max(1,len-60);
    const arr=[];
    for(let k=s;k<len;k++)arr.push((a.closes[k]/a.closes[k-1]-1)*100);
    R[r.h.code]=arr;
  });
  /* 相关性 */
  let corSum=0,corN=0,maxCor=0,maxPair="";
  const codes=rows.map(r=>r.h.code);
  for(let i=0;i<codes.length;i++){
    for(let j=i+1;j<codes.length;j++){
      const a=R[codes[i]],b=R[codes[j]],L=Math.min(a.length,b.length);
      if(L<20)continue;
      const x=a.slice(a.length-L),y=b.slice(b.length-L);
      const mx=x.reduce((p,c)=>p+c,0)/L, my=y.reduce((p,c)=>p+c,0)/L;
      let sxy=0,sxx=0,syy=0;
      for(let k=0;k<L;k++){const dx=x[k]-mx,dy=y[k]-my;sxy+=dx*dy;sxx+=dx*dx;syy+=dy*dy;}
      const cor=(sxx>0&&syy>0)?sxy/Math.sqrt(sxx*syy):0;
      corSum+=cor;corN++;
      if(cor>maxCor){maxCor=cor;maxPair=rows[i].h.name+" ↔ "+rows[j].h.name;}
    }
  }
  const avgCor=corN?corSum/corN:0;

  /* 集中度：以技术评分权重近似"健康度加权"，这里用等权 HHI + 弱势占比 */
  const weak=rows.filter(r=>r.an.score.total<40);
  const strong=rows.filter(r=>r.an.score.total>=62);
  const hhi=Math.round(10000/n);   /* 等权下的赫芬达尔指数（仅示意为分散度上限） */
  const bearN=rows.filter(r=>/空头/.test(r.an.arrange)).length;
  const sameDir=Math.max(bearN,n-bearN)/n*100;

  /* 波动贡献（用 ATR% 近似） */
  let volSum=0,volN=0;
  rows.forEach(r=>{
    const a=r.an,atr=nn(a.atr[a.i])?a.atr[a.i]:null;
    if(atr!=null&&a.close){volSum+=atr/a.close*100;volN++;}
  });
  const avgVolPct=volN?volSum/volN:null;

  const rebal=[];
  if(avgCor>=0.7)rebal.push("近60日平均相关性 <b>"+avgCor.toFixed(2)+"</b>（偏高）——组合实际是<b>同一个 beta</b>，分散效果有限，应按单一仓位控制总敞口");
  else if(avgCor>=0.45)rebal.push("平均相关性 <b>"+avgCor.toFixed(2)+"</b>（中等），具备一定分散，但极端行情下仍会同涨同跌");
  else rebal.push("平均相关性 <b>"+avgCor.toFixed(2)+"</b>（较低），分散度较好");
  if(maxCor>=0.85&&maxPair)rebal.push("相关性最高的一对：<b>"+maxPair+"</b>（"+maxCor.toFixed(2)+"），二者择一加仓即可，无需重复配置");
  if(weak.length>=Math.ceil(n*0.35))
    rebal.push("技术评分 <40 的弱势标的 <b>"+weak.length+"/"+n+"</b> 只（"+weak.map(r=>r.h.name).join("、")+"），建议优先处理这批——弱势标的在反弹中弹性最差、下跌中跌幅最大");
  if(strong.length)rebal.push("可作为组合核心保留：<b>"+strong.map(r=>r.h.name+"("+r.an.score.total+")").join("、")+"</b>");
  if(sameDir>=70)rebal.push("同向排列占比 <b>"+sameDir.toFixed(0)+"%</b>（"+(bearN>=n/2?"空头":"多头")+"为主），<b>分散是假象</b>，建议整体降仓而非单独调整个股");
  if(avgVolPct!=null)rebal.push("组合平均 ATR 波动 <b>"+avgVolPct.toFixed(2)+"%</b>/日"+(avgVolPct>3.5?"（偏高，单日 ±3.5% 属常态，仓位需相应收缩）":"（可控）"));

  return {n:n,avgCor:avgCor,maxCor:maxCor,maxPair:maxPair,weak:weak,strong:strong,
    bearN:bearN,sameDir:sameDir,avgVolPct:avgVolPct,hhi:hhi,rebal:rebal,corN:corN};
}

/* ============================================================
   四、覆盖 buildStockBlock：插入深度 AI 段
   ============================================================ */
function buildStockBlock(stk){
  const L=[];
  const code=stk.code,name=stk.name;
  L.push("────────────────────────────────────");
  L.push("【"+name+"】"+code+"　"+(stk.type||""));
  const an=stk.an;
  if(!an){L.push("  ⚠ 数据缺失：该标的未载入K线数据，无法诊断。");L.push("");return L.join("\n");}
  const i=an.i;
  L.push("  最新：收盘 "+f2(an.close)+"（"+pct(an.chg)+"）　"+an.dates[i]+"　技术评分 "+an.score.total+"/100（"+an.score.label+"）");
  L.push("");
  L.push("  ■ 趋势指标");
  L.push("    · 均线排列："+an.arrange+"（MA5 "+f2(an.ma5[i])+" ／ MA10 "+f2(an.ma10[i])+" ／ MA20 "+f2(an.ma20[i])+" ／ MA60 "+f2(an.ma60[i])+"）");
  if(an.ms&&(nn(an.ms.s1)||nn(an.ms.s2)))
    L.push("    · 发散度：MA5-MA20 "+(nn(an.ms.s1)?(an.ms.s1>0?"+":"")+an.ms.s1.toFixed(2)+"%":"数据缺失")
      +"；MA20-MA60 "+(nn(an.ms.s2)?(an.ms.s2>0?"+":"")+an.ms.s2.toFixed(2)+"%":"数据缺失"));
  L.push("    · MACD："+an.macdSig);
  L.push("    · 背离检测："+an.diver);
  L.push("");
  L.push("  ■ 震荡指标");
  L.push("    · RSI(14)="+(!nn(an.rsiV)?"数据缺失":f1(an.rsiV))+"，"+an.rsiZone+"；RSI(6)="+(!nn(an.r6[i])?"数据缺失":f1(an.r6[i]))+"（短周期敏感度更高）");
  L.push("    · KDJ："+an.kdjSig);
  L.push("");
  L.push("  ■ 量能指标");
  L.push("    · 量比（5日均量口径）="+(nn(an.vr)?an.vr.toFixed(2):"数据缺失")+(nn(an.vr)?("（"+(an.vr>1.5?"放量":an.vr<0.7?"缩量":"常态")+"）"):""));
  L.push("    · 换手率："+(nn(an.lastTurn)?an.lastTurn.toFixed(2)+"%":"数据缺失（日K未含换手字段）"));
  L.push("");
  L.push("  ■ 形态与关键位");
  const patAll=(an.pats||[]).slice().sort((a,b)=>b.i-a.i);
  const seenPat={},pats=[];
  patAll.forEach(p=>{ if(seenPat[p.nm])return; seenPat[p.nm]=1; pats.push(p); });
  pats.reverse();
  L.push("    · 近期形态："+(pats.length?pats.map(p=>p.date+" "+p.nm+"（"+p.ds+"）").join("；"):"未识别到典型K线形态"));
  L.push("    · 支撑位："+(an.sup.length?an.sup.map(f2).join(" ＞ "):"数据缺失")
    +((an.supAll||[]).length?"　【"+(an.supAll||[]).map(x=>x.t+" "+f2(x.v)).join("；")+"】":""));
  L.push("    · 压力位："+(an.res.length?an.res.map(f2).join(" ＜ "):"数据缺失")
    +((an.resAll||[]).length?"　【"+(an.resAll||[]).map(x=>x.t+" "+f2(x.v)).join("；")+"】":""));
  L.push("    · BOLL(20,2)：上轨 "+f2(an.bl.up[i])+" ／ 中轨 "+f2(an.bl.mid[i])+" ／ 下轨 "+f2(an.bl.lo[i])
    +(an.bw&&nn(an.bw.bw)?("，带宽 "+an.bw.bw.toFixed(2)+"%("+an.bw.state+")"):""));
  L.push("    · 密集成交区 POC："+(nn(an.poc.poc)?f2(an.poc.poc):"数据缺失")+"（近60日成交量最大价格中枢）");
  L.push("");
  L.push("  ■ 多空技术信号（近 40 日，客观形态识别，非交易指令）");
  const sigs=(an.sigs||[]).filter(s=>s.i>=an.i-40).slice(0,12);
  if(sigs.length){
    let nb=0,ns=0;
    sigs.forEach(s=>{
      L.push("    · "+s.date+"　"+(s.side==="b"?"▲ 多头":(s.side==="s"?"▼ 空头":"● 中性"))+"　"+s.nm+(s.st>=2?"（强）":"")
        +"　"+f2(s.price)+"　"+s.ds);
      if(s.side==="b")nb++;else if(s.side==="s")ns++;
    });
    L.push("    统计：多头 "+nb+" 个 / 空头 "+ns+" 个 / 中性 "+(sigs.length-nb-ns)+" 个");
  } else L.push("    · 近 40 日未触发技术信号");
  L.push("");
  L.push("  ■ 短 / 中 / 长 三周期研判");
  (an.tf||[]).forEach(t=>{
    L.push("    【"+t.tf+"】"+t.label);
    t.ev.forEach(e=>L.push("      · "+e));
  });
  L.push("");

  /* ============ AI 深度研判（三段） ============ */
  L.push("  ■ AI 深度研判（规则推理 · 每条附数据依据 · 非投资建议）");
  try{
    const r=aiStock(an);
    const dp=aiStockDeep(an);
    const strip=s=>String(s).replace(/<[^>]+>/g,"");
    L.push("    【一句话结论】"+r.icon+" "+strip(dp.verdict));
    L.push("    "+strip(r.desc));
    L.push("");
    L.push("    【五维共振拆解】综合共振度 "+dp.resPct+"%");
    dp.dims.forEach(d=>{
      const tag=d.ok?"✔ 多头":(d.bad?"✘ 空头":"○ 中性");
      L.push("      · "+d.nm+"（权重 "+d.w+"）"+tag+"　"+strip(d.ev));
    });
    L.push("");
    L.push("    【多头依据】");
    r.bulls.forEach(x=>L.push("      + "+strip(x)));
    L.push("    【空头依据】");
    r.bears.forEach(x=>L.push("      - "+strip(x)));
    L.push("");
    L.push("    【情景推演】");
    L.push("      | 情景 | 主观概率 | 触发条件 | 幅度参考(ATR口径) | 证伪条件 |");
    L.push("      |---|---|---|---|---|");
    dp.scen.forEach(s=>{
      L.push("      | "+s.nm+" | "+s.p+" | "+s.cond+" | "+s.move+" | "+s.inv+" |");
    });
    L.push("");
    L.push("    【操作纪律（条件触发，非指令）】");
    dp.plan.forEach(p=>L.push("      · "+p.k+"："+p.v+"　（"+p.r+"）"));
    L.push("");
    const hs=dp.hist;
    if(hs&&hs.ok){
      L.push("    【历史相似状态统计】样本 "+hs.sample+" 例（相同均线排列 "+hs.curArr+" + RSI "+hs.rsiZone+"）");
      L.push("      | 持有期 | 样本数 | 平均涨跌 | 上涨概率 |");
      L.push("      |---|---|---|---|");
      hs.rows.forEach(rw=>{
        L.push("      | "+rw.f+" 日后 | "+rw.n+" | "+(rw.avg==null?"—":pctTxt(rw.avg))+" | "
          +(rw.win==null?"—":rw.win.toFixed(0)+"%")+" |");
      });
      L.push("      注：仅统计自身历史，样本量小，不代表未来。");
    } else {
      L.push("    【历史相似状态统计】"+(hs?hs.msg:"不可用"));
    }
    L.push("");
    L.push("    【关键位】"+r.levels.map(x=>x.nm+" = "+x.vv).join("　｜　"));
    L.push("    【风险提示】"+r.risks.map(strip).join("；"));
    L.push("    【后续观察要点】");
    r.watch.forEach(x=>L.push("      · "+strip(x)));
  }catch(e){L.push("    ⚠ AI 深度研判生成失败："+(e&&e.message?e.message:"未知错误"));}
  L.push("");
  L.push("  ■ 技术评分分解（五维）");
  const d=an.score.dims,cap=an.score.caps;
  L.push("    "+Object.keys(d).map(k=>k+" "+d[k]+"/"+cap[k]).join("　｜　")+"　→　总分 "+an.score.total+"（"+an.score.label+"）");
  L.push("    自身历史分位："+(an.scorePct==null?"数据不足（样本<5）":an.scorePct+"%（近120日回测，越高表示相对自身历史越强）"));
  L.push("");
  return L.join("\n");
}

/* ============================================================
   五、覆盖 genReport：追加深度段落 + 富文本渲染
   ============================================================ */
function genReportBase(){
  const inRep=state.holdings.filter(h=>h.inReport!==false);
  const stocks=inRep.map(h=>{
    const stk=state.stocks[h.code];
    if(!stk||!stk.rows||stk.rows.length<8)return {name:h.name,code:h.code,type:h.type,an:null,rows:null};
    const an=analyzeStock({rows:stk.rows,name:h.name,code:h.code});
    return {name:h.name,code:h.code,type:h.type,an:(an&&an.err)?null:an,rows:stk.rows};
  });
  const now=new Date();
  const pad=n=>String(n).padStart(2,"0");
  const ts=now.getFullYear()+"-"+pad(now.getMonth()+1)+"-"+pad(now.getDate())+" "+pad(now.getHours())+":"+pad(now.getMinutes());
  let rep="";
  rep+="# A股每日复盘报告（技术分析版）\n\n";
  rep+="生成时间："+ts+"　｜　数据快照日期："+SNAPSHOT_DATE+"　｜　纳入标的："+inRep.length+" 只\n";
  rep+="数据来源：内嵌真实日K线（本机抓取）+ 板块/资金快照；指标由本地 JS 从原始 OHLCV 计算。\n\n";
  rep+="## 第一步：大盘环境与趋势评估\n\n"+buildMarketBlock();
  try{
    const rm=aiMarket();
    const strip2=s=>String(s).replace(/<[^>]+>/g,"");
    let mb="\n■ AI 大盘解读（规则推理 · 非投资建议）\n";
    mb+="  【结论】"+rm.icon+" "+rm.title+"\n";
    mb+="  "+strip2(rm.desc)+"\n";
    if(rm.items.length){mb+="  【盘面解读】\n";rm.items.forEach(x=>mb+="    · "+strip2(x)+"\n");}
    mb+="  【风险与容错提示】\n"+rm.risks.map(x=>"    · "+strip2(x)).join("\n")+"\n";
    rep+=mb;
  }catch(e){}
  /* ---- 大盘五维打分（新增） ---- */
  try{
    const dm=aiMarketDeep();
    let t="\n■ 大盘五维打分（量化环境，用于决定总仓位）\n";
    t+="  | 维度 | 得分 | 依据 |\n  |---|---|---|\n";
    dm.dims.forEach(d=>{
      t+="  | "+d.nm+" | "+(d.miss?"缺失":d.s+"/100")+" | "+String(d.ev).replace(/<[^>]+>/g,"").replace(/\|/g,"／")+" |\n";
    });
    t+="\n  【综合环境分】"+dm.icon+" "+dm.total+"/100 —— "+dm.title+"\n";
    t+="  【建议仓位区间】"+dm.pos+"　（"+dm.posR+"）\n";
    if(dm.miss&&dm.miss.length)t+="  ⚠ 以下维度数据缺失，评分基于其余维度："+dm.miss.join("、")+"\n";
    t+="  【明日重点观察】\n";
    dm.tomorrow.forEach(x=>t+="    · "+String(x).replace(/<[^>]+>/g,"")+"\n");
    rep+=t;
  }catch(e){}
  rep+="## 第二步：板块轮动与主线识别\n\n"+buildSectorBlock();
  try{ rep+=buildSectorMapBlock(); }catch(e){}
  rep+="## 第三步：个股技术面诊断（共 "+inRep.length+" 只）\n\n";
  stocks.forEach(s=>{
    if(!s.an){ rep+="────────────────────────────────────\n【"+s.name+"】"+s.code+"\n  ⚠ 数据缺失：未载入K线数据，无法诊断。\n\n"; return; }
    rep+=buildStockBlock(s);
  });
  try{
    const rp=aiPortfolio(inRep);
    if(rp){
      const strip3=s=>String(s).replace(/<[^>]+>/g,"");
      let pb="\n■ AI 组合诊断（集中度 / 强弱结构 · 非投资建议）\n";
      pb+="  【结论】"+rp.icon+" "+rp.title+"\n";
      pb+="  "+strip3(rp.desc)+"\n";
      pb+="  【结构要点】\n"+rp.items.map(x=>"    · "+strip3(x)).join("\n")+"\n";
      pb+="  【组合层面风险】\n"+rp.risks.map(x=>"    · "+strip3(x)).join("\n")+"\n";
      rep+=pb;
    }
  }catch(e){}
  /* ---- 组合深度：相关性 / 集中度 / 再平衡（新增） ---- */
  try{
    const pd=aiPortfolioDeep(inRep);
    if(pd){
      let t="\n■ 组合结构深度（相关性 / 集中度 / 再平衡 · 非投资建议）\n";
      t+="  【分散度】近60日平均相关系数 "+(pd.corN?pd.avgCor.toFixed(2):"样本不足")
        +"，最高相关对："+(pd.maxPair?pd.maxPair+"（"+pd.maxCor.toFixed(2)+"）":"—")+"\n";
      t+="  【同向暴露】同向排列占比 "+pd.sameDir.toFixed(0)+"%，组合平均日波动（ATR口径）"
        +(pd.avgVolPct!=null?pd.avgVolPct.toFixed(2)+"%":"数据缺失")+"\n";
      t+="  【再平衡思路】\n";
      pd.rebal.forEach(x=>t+="    · "+String(x).replace(/<[^>]+>/g,"")+"\n");
      rep+=t;
    }
  }catch(e){}
  rep+="## 第四步：风险警示与情景推演\n\n"+buildRiskBlock(stocks);
  rep+="\n────────────────────────────────────\n";
  rep+="## 免责声明\n\n";
  rep+="本报告由本地工具依据用户提供的真实行情数据自动生成，所有技术指标（MA/EMA/MACD/RSI/KDJ/BOLL/量比/POC 等）"
    +"均由本地 JavaScript 从原始 OHLCV 计算，未接入任何交易通道。\n";
  rep+="报告中所有内容为技术形态的客观描述与情景推演，不构成任何买入/卖出的交易指令，也不构成投资建议。\n";
  rep+="情景概率为主观赋值（用于表达不确定性），历史相似统计样本量有限，均不代表未来表现。\n";
  rep+="技术分析具有滞后性与失效可能，历史形态不代表未来表现。市场有风险，据此操作，风险自负。\n";
  return rep;
}

function genReport(){
  let md="";
  try{ md=genReportBase(); }
  catch(e){ md="# 报告生成失败\n\n"+e.message+"\n"; }
  LAST_REPORT=md;
  setReport(md);
  renderNoteSel();
  return md;
}

/* ============================================================
   六、新 UI 绑定
   ============================================================ */
function bindExtra(){
  const on=(id,ev,fn)=>{const e=$(id); if(e)e.addEventListener(ev,fn);};

  /* --- 报告字号 / 视图 --- */
  const segFs=$("segFs");
  if(segFs)segFs.addEventListener("click",function(e){
    const b=e.target.closest?e.target.closest("button"):null; if(!b)return;
    [].forEach.call(segFs.querySelectorAll("button"),x=>x.classList.remove("on"));
    b.classList.add("on");
    REP.fs=b.getAttribute("data-f");
    try{localStorage.setItem("ashare_repfs",REP.fs);}catch(err){}
    setReport(REP.raw);
  });
  const segRv=$("segRepView");
  if(segRv)segRv.addEventListener("click",function(e){
    const b=e.target.closest?e.target.closest("button"):null; if(!b)return;
    [].forEach.call(segRv.querySelectorAll("button"),x=>x.classList.remove("on"));
    b.classList.add("on");
    REP.mode=b.getAttribute("data-v");
    setReport(REP.raw);
  });
  on("btnCopyRep","click",function(){
    if(!LAST_REPORT){alert("请先生成报告");return;}
    try{
      if(navigator.clipboard&&navigator.clipboard.writeText){
        navigator.clipboard.writeText(LAST_REPORT).then(()=>msgTmp("noteMsg","已复制全文"));
      } else {
        const ta=document.createElement("textarea");ta.value=LAST_REPORT;document.body.appendChild(ta);
        ta.select();document.execCommand("copy");ta.remove();
      }
    }catch(e){alert("复制失败，请手动选择文本");}
  });

  /* --- K线：高度 / 自适应量程 / 全屏 --- */
  const segH=$("segHeight");
  if(segH)segH.addEventListener("click",function(e){
    const b=e.target.closest?e.target.closest("button"):null; if(!b)return;
    [].forEach.call(segH.querySelectorAll("button"),x=>x.classList.remove("on"));
    b.classList.add("on");
    KL.h=parseInt(b.getAttribute("data-h"),10)||700;
    const el=$("klineChart"); if(el){el.style.height=KL.h+"px"; if(el._c)try{el._c.resize();}catch(err){}}
    drawKline();
  });
  on("ckAutoY","change",function(){ KL.autoY=this.checked; drawKline(); });
  on("btnFull","click",function(){
    const wrap=$("klineWrap"); if(!wrap)return;
    if(!document.fullscreenElement){
      if(wrap.requestFullscreen)wrap.requestFullscreen();
      else if(wrap.webkitRequestFullscreen)wrap.webkitRequestFullscreen();
      else { KL.h=Math.round(window.innerHeight*0.88); drawKline(); return; }
      KL.h=Math.round(window.innerHeight*0.88);
    } else {
      if(document.exitFullscreen)document.exitFullscreen();
      KL.h=700;
    }
    setTimeout(()=>{const el=$("klineChart"); if(el){el.style.height=KL.h+"px"; if(el._c)try{el._c.resize();}catch(e){}} drawKline();},260);
  });

  /* --- 批量添加（个股诊断页） --- */
  let batchData=[];
  const bpv=$("batchPreview");
  on("batchParse","click",function(){
    const txt=($("batchRaw")||{}).value||"";
    batchData=parseBatch(txt);
    if(!batchData.length){
      bpv.innerHTML='<div class="banner err">未识别到有效代码/名称。支持格式：600519 贵州茅台 / 600519,贵州茅台 / 600519 / 贵州茅台</div>';
      return;
    }
    bpv.innerHTML='<div class="banner info">识别到 '+batchData.length+' 只：'
      +batchData.map(function(x,i){
        return '<label style="display:inline-flex;align-items:center;gap:4px;margin-right:10px;cursor:pointer">'
        +'<input type="checkbox" class="bpick" data-i="'+i+'" checked style="width:auto;margin:0">'
        +esc(x.name)+' <span class="muted">'+x.code+'</span></label>';
      }).join("")+'</div>';
  });
  on("batchAdd","click",async function(){
    if(!batchData.length){
      const txt=($("batchRaw")||{}).value||"";
      batchData=parseBatch(txt);
    }
    const picks=[];
    const cbs=(bpv?bpv.querySelectorAll(".bpick"):[]);
    if(cbs&&cbs.length){
      for(let i=0;i<cbs.length;i++)if(cbs[i].checked)picks.push(batchData[parseInt(cbs[i].getAttribute("data-i"),10)]);
    } else picks.push.apply(picks,batchData);
    if(!picks.length){ ($("batchMsg")).textContent="请先点「解析」并勾选"; return; }
    const msg=$("batchMsg");
    let added=0;
    for(let i=0;i<picks.length;i++){
      const p=picks[i];
      if(!state.holdings.some(h=>h.code===p.code)){
        state.holdings.push({code:p.code,name:p.name,type:p.type,inReport:true});added++;
      }
    }
    saveState();renderHoldings();renderRail();renderCmpPick();
    if(msg)msg.textContent="已加入 "+added+" 只（共 "+state.holdings.length+" 只），开始拉取行情…";
    for(let i=0;i<picks.length;i++){
      try{ await fetchStockData(picks[i].code); }catch(e){}
    }
    saveState();renderHoldings();renderRail();renderDash();
    if(msg)msg.innerHTML="完成：新增 "+added+" 只，行情拉取结束。<b>提示</b>：若某只显示数据缺失，可在「个股诊断」页手动粘贴日K或稍后重试。";
  });
  on("pickStock","click",function(){
    const q=prompt("输入代码或名称（支持拼音首字母，如 zxtx / 中兴 / 000063）：");
    if(q==null)return;
    const r=lookupName(q.trim());
    if(!r){alert("未匹配到标的：\n• 内置约 300 只常见 A股/ETF/指数\n• 支持 6 位代码、中文名称、拼音首字母\n• 未收录的可直接输入 6 位代码后「联网拉取」");return;}
    const cEl=$("stockCode"),nEl=$("stockName");
    if(cEl)cEl.value=r.code;
    if(nEl)nEl.value=r.name;
    try{ pickStock(r.code); }catch(e){}
  });

  /* --- 个股诊断页：代码输入框失焦自动补全名称 --- */
  on("stockCode","blur",function(){
    const c=(this.value||"").trim();
    const nEl=$("stockName");
    if(c&&nEl&&!nEl.value){ const nm=nameOf(c); if(nm)nEl.value=nm; }
  });

  /* --- 持仓页批量 --- */
  let holdBatchData=[];
  const hbp=$("holdBatchPreview");
  on("holdBatchParse","click",function(){
    holdBatchData=parseBatch(($("holdBatch")||{}).value||"");
    if(!holdBatchData.length){ hbp.innerHTML='<div class="banner err">未识别到有效代码/名称</div>'; return; }
    hbp.innerHTML='<div class="banner info">识别到 '+holdBatchData.length+' 只：'
      +holdBatchData.map(function(x,i){
        return '<label style="display:inline-flex;align-items:center;gap:4px;margin-right:10px;cursor:pointer">'
        +'<input type="checkbox" class="hpick" data-i="'+i+'" checked style="width:auto;margin:0">'
        +esc(x.name)+' <span class="muted">'+x.code+'</span></label>';
      }).join("")+'</div>';
  });
  async function holdBatchAdd(doFetch){
    if(!holdBatchData.length)holdBatchData=parseBatch(($("holdBatch")||{}).value||"");
    const picks=[];
    const cbs=(hbp?hbp.querySelectorAll(".hpick"):[]);
    if(cbs&&cbs.length){ for(let i=0;i<cbs.length;i++)if(cbs[i].checked)picks.push(holdBatchData[parseInt(cbs[i].getAttribute("data-i"),10)]); }
    else picks.push.apply(picks,holdBatchData);
    if(!picks.length){ const m=$("holdBatchMsg"); if(m)m.textContent="请先点「解析预览」"; return; }
    let added=0;
    picks.forEach(p=>{
      if(!state.holdings.some(h=>h.code===p.code)){state.holdings.push({code:p.code,name:p.name,type:p.type,inReport:true});added++;}
    });
    saveState();renderHoldings();renderRail();renderCmpPick();
    const m=$("holdBatchMsg");
    if(doFetch){
      if(m)m.textContent="已加入 "+added+" 只，拉取行情中…";
      for(let i=0;i<picks.length;i++){ try{ await fetchStockData(picks[i].code); }catch(e){} }
      saveState();renderHoldings();renderRail();renderDash();
      if(m)m.innerHTML="完成：新增 "+added+" 只并已尝试拉取行情";
    } else if(m) m.innerHTML="已加入 "+added+" 只（未拉取行情）。数据缺失的标的请点「批量联网拉取持仓行情」。";
    if(hbp)hbp.innerHTML="";
    holdBatchData=[];
    if($("holdBatch"))$("holdBatch").value="";
  }
  on("holdBatchAdd","click",function(){holdBatchAdd(false);});
  on("holdBatchFetch","click",function(){holdBatchAdd(true);});

  /* --- 持仓页单个添加：自动补全 --- */
  on("newCode","blur",function(){
    const c=(this.value||"").trim();
    const nEl=$("newName");
    if(c&&nEl&&!nEl.value){
      const r=lookupName(c)||{name:nameOf(c)};
      if(r&&r.name)nEl.value=r.name;
    }
  });

  /* --- 对比图 --- */
  const segCmp=$("segCmpSpan");
  if(segCmp)segCmp.addEventListener("click",function(e){
    const b=e.target.closest?e.target.closest("button"):null; if(!b)return;
    [].forEach.call(segCmp.querySelectorAll("button"),x=>x.classList.remove("on"));
    b.classList.add("on");
    CMP.span=parseInt(b.getAttribute("data-n"),10)||60;
    renderCompare();
  });

  /* --- 笔记 --- */
  on("addNote","click",function(){
    const t=($("noteText")||{}).value||"";
    if(!t.trim()){ msgTmp("noteMsg","请输入笔记内容"); return; }
    const sel=$("noteCode");
    const code=(sel&&sel.value)||"";
    const arr=getNotes();
    arr.push({id:Date.now()+"_"+Math.random().toString(36).slice(2,6),code:code,
      name:code?nameOf(code):"",text:t.trim(),t:Date.now()});
    saveNotes(arr);renderNotes();
    if($("noteText"))$("noteText").value="";
    msgTmp("noteMsg","已保存（共 "+arr.length+" 条）");
  });
  on("clearNote","click",function(){
    if(!confirm("确定清空全部复盘笔记？此操作不可撤销。"))return;
    saveNotes([]);renderNotes();msgTmp("noteMsg","已清空");
  });
  on("noteFilter","input",renderNotes);

  /* --- 代码候选列表 --- */
  try{
    const dl=$("codeList");
    if(dl)dl.innerHTML=Object.keys(NAME_IDX).map(function(c){
      return '<option value="'+c+'">'+esc(NAME_IDX[c].name)+"</option>";}).join("");
  }catch(e){}
}

function msgTmp(id,txt){
  const e=$(id); if(!e)return; e.textContent=txt;
  setTimeout(function(){ if(e.textContent===txt)e.textContent=""; },4000);
}

/* ============================================================
   七、tab 覆盖（支持新增的对比 / 笔记页）
   ============================================================ */
function tab(id){
  document.querySelectorAll("nav button").forEach(b=>b.classList.toggle("active",b.dataset.tab===id));
  document.querySelectorAll("main section").forEach(s=>s.classList.toggle("on",s.id===id));
  if(id==="dash")renderDash();
  if(id==="stock"&&!$("stockCode").value&&(state.holdings[0]))pickStock(state.holdings[0].code);
  if(id==="report")genReport();
  if(id==="market")renderMarket();
  if(id==="compare"){ try{renderCmpPick();renderCompare();}catch(e){} }
  if(id==="notes"){ try{renderNoteSel();renderNotes();}catch(e){} }
  if(id==="stock"){ const el=$("klineChart"); if(el&&el._c){try{el._c.resize();}catch(e){}} }
  try{ if(window&&typeof window.scrollTo==="function")window.scrollTo({top:0,behavior:"smooth"}); }catch(e){}
}

/* ============================================================
   七点五、日K粘贴解析增强（日期标准化 + 乱序/重复处理）
   ============================================================ */
function normDate(s){
  if(s==null)return "";
  var t=String(s).trim().replace(/[年月]/g,"-").replace(/[日]/g,"");
  var m=t.match(/^(\d{4})[-\/.]?(\d{1,2})[-\/.]?(\d{1,2})$/);
  if(m)return m[1]+"-"+String(m[2]).padStart(2,"0")+"-"+String(m[3]).padStart(2,"0");
  m=t.match(/^(\d{4})(\d{2})(\d{2})$/);
  if(m)return m[1]+"-"+m[2]+"-"+m[3];
  return String(s).trim().slice(0,10);
}
function parseOhlc(text){
  var out=[],seen={};
  String(text).split(/\r?\n/).forEach(function(line){
    var t=line.trim(); if(!t||t.charAt(0)==="#")return;
    var p=t.split(/[,\t; ]+/);
    if(p.length<6)return;
    var d=normDate(p[0]); if(!d)return;
    var o=num(p[1]),h=num(p[2]),l=num(p[3]),c=num(p[4]),v=num(p[5]);
    if(o==null||h==null||l==null||c==null)return;
    if(seen[d])return; seen[d]=1;
    out.push([d,o,h,l,c,(v==null?0:v),(p.length>6?num(p[6]):null)]);
  });
  out.sort(function(a,b){return a[0]<b[0]?-1:(a[0]>b[0]?1:0);});
  return out;
}

/* ============================================================
   八、初始化覆盖
   ============================================================ */
function init(){
  bind();
  bindExtra();
  renderHeader();
  renderMarket();
  renderSectors();
  renderHoldings();
  renderRail();
  renderDash();
  renderCmpPick();
  renderNoteSel();
  renderNotes();
  const j=$("snapJson"); if(j){j._touched=false;j.oninput=()=>{j._touched=true;};}
  /* 恢复字号偏好 */
  try{
    const f=localStorage.getItem("ashare_repfs");
    if(f&&["fs-s","fs-m","fs-l"].indexOf(f)>=0){
      REP.fs=f;
      const seg=$("segFs");
      if(seg)[].forEach.call(seg.querySelectorAll("button"),
        b=>b.classList.toggle("on",b.getAttribute("data-f")===f));
    }
  }catch(e){}
  if(state.holdings.length)pickStock(state.holdings[0].code);
  tab("dash");
  genReport();
  window.addEventListener("resize",function(){
    ["klineChart","radarChart","scoreChart","cmpChart","sigPie","tempGauge","breadthBar","structBar"].forEach(function(id){
      const e=$(id); if(e&&e._c){try{e._c.resize();}catch(err){}}
    });
  });
}
/* v2.0: init 由 engine10 统一启动 */
