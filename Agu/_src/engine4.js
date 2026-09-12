/* ============================================================
   AI 技术研判引擎（规则推理 · 每条结论附数据依据）
   ============================================================ */
function aiStock(an){
  const i=an.i, c=an.close;
  const A=(arr,k)=>nn(arr&&arr[k])?arr[k]:null;
  const bulls=[],bears=[],risks=[],watch=[],levels=[];
  let res=0, resMax=0;

  /* 1. 多周期共振度 0-100 */
  const rc=(cond,w)=>{resMax+=w; if(cond)res+=w;};
  rc(/多头/.test(an.arrange),22);
  rc(an.wk&&an.wk.ok&&/多头/.test(an.wk.arrange),20);
  rc(A(an.ma20,i)!=null&&c>A(an.ma20,i),12);
  rc(A(an.ma60,i)!=null&&c>A(an.ma60,i),12);
  rc(A(an.bar,i)!=null&&A(an.bar,i)>=0,10);
  rc(an.dif[i]>an.dea[i],8);
  rc(nn(an.vr)&&an.vr>=1,8);
  rc(nn(an.rsiV)&&an.rsiV>=50,8);
  const resPct=Math.round(res/Math.max(1,resMax)*100);

  /* 2. 结论 */
  const sc=an.score.total;
  let tone,icon,title;
  if(resPct>=72&&sc>=58){tone="up";icon="▲";title="多头趋势明确，回踩不破关键均线则视为趋势延续";}
  else if(resPct>=56){tone="up";icon="▲";title="偏多格局，但尚未形成完整多周期共振";}
  else if(resPct>=44){tone="neu";icon="◆";title="多空胶着，方向未明，等待关键位突破确认";}
  else if(resPct>=28){tone="down";icon="▼";title="偏空格局，反弹受制于上方均线压力";}
  else{tone="down";icon="▼";title="空头趋势主导，尚未见到有效止跌信号";}

  const arrTxt=/多头/.test(an.arrange)?"多头排列":(/空头/.test(an.arrange)?"空头排列":"均线纠缠");
  const wkTxt=(an.wk&&an.wk.ok)?(/多头/.test(an.wk.arrange)?"周线多头":(/空头/.test(an.wk.arrange)?"周线空头":"周线纠缠")):"周线数据不足";
  const pos60=((c-an.hl60.lo)/Math.max(1e-9,an.hl60.hi-an.hl60.lo)*100);
  const desc="日线"+arrTxt+"、"+wkTxt+"，多周期共振度 <b>"+resPct+"%</b>；"
    +"技术评分 <b>"+sc+"</b> 分（"+an.score.label+"），"
    +"RSI(14)=<b>"+f1(an.rsiV)+"</b>（"+an.rsiZone+"），"
    +"量比 <b>"+(nn(an.vr)?an.vr.toFixed(2):"数据缺失")+"</b>。"
    +"当前价 "+f2(c)+" 处于近60日区间 "+f2(an.hl60.lo)+"～"+f2(an.hl60.hi)+" 的 <b>"+pos60.toFixed(0)+"%</b> 分位。";

  /* 3. 多头 / 空头依据 */
  if(/多头/.test(an.arrange))bulls.push("均线<b>多头排列</b>（"+esc(an.arrange)+"），短中期成本依次抬高");
  if(an.wk&&an.wk.ok&&/多头/.test(an.wk.arrange))bulls.push("周线同步多头，大周期方向向上（周MA5近4周斜率 "+(an.wk.slope!=null?(an.wk.slope>0?"+":"")+f2(an.wk.slope)+"%":"数据缺失")+"）");
  if(A(an.bar,i)!=null&&A(an.bar,i)>=0)bulls.push("MACD 柱 <b>"+f3(an.bar[i])+"</b> 为红柱，动能偏多");
  if(an.dif[i]>an.dea[i])bulls.push("DIF("+f3(an.dif[i])+") 位于 DEA("+f3(an.dea[i])+") 上方");
  if(nn(an.rsiV)&&an.rsiV>=55&&an.rsiV<70)bulls.push("RSI(14)="+f1(an.rsiV)+" 处于偏强区（50-70），尚未过热");
  if(nn(an.vr)&&an.vr>=1.2)bulls.push("量比 "+an.vr.toFixed(2)+"，较5日均量<b>明显放大</b>，资金关注度提升");
  if(nn(an.ms.s1)&&an.ms.s1>0)bulls.push("MA5-MA20 发散 <b>+"+an.ms.s1.toFixed(2)+"%</b>，短中期均线上张口");
  if(an.chan&&an.chan.slope>0)bulls.push("处于<b>"+esc(an.chan.dir)+"</b>，通道斜率 +"+f2(an.chan.slopePct)+"%");
  const lastB=(an.sigs||[]).filter(s=>s.side==="b"&&s.i>=i-6);
  if(lastB.length)bulls.push("近6日出现 "+lastB.length+" 个多头信号："+lastB.slice(0,3).map(s=>esc(s.nm)).join("、"));

  if(/空头/.test(an.arrange))bears.push("均线<b>空头排列</b>（"+esc(an.arrange)+"），反弹受均线层层压制");
  if(an.wk&&an.wk.ok&&/空头/.test(an.wk.arrange))bears.push("周线空头排列，大周期仍在下行");
  if(A(an.bar,i)!=null&&A(an.bar,i)<0)bears.push("MACD 柱 <b>"+f3(an.bar[i])+"</b> 为绿柱，动能偏空");
  if(nn(an.rsiV)&&an.rsiV<45)bears.push("RSI(14)="+f1(an.rsiV)+" 处于偏弱区，买盘不足");
  if(nn(an.vr)&&an.vr<0.8)bears.push("量比 "+an.vr.toFixed(2)+" <b>明显缩量</b>，承接意愿弱");
  if(nn(an.ms.s1)&&an.ms.s1<0)bears.push("MA5-MA20 发散 <b>"+an.ms.s1.toFixed(2)+"%</b>，均线下张口");
  if(an.chan&&an.chan.slope<0)bears.push("处于<b>"+esc(an.chan.dir)+"</b>，通道斜率 "+f2(an.chan.slopePct)+"%");
  const lastS=(an.sigs||[]).filter(s=>s.side==="s"&&s.i>=i-6);
  if(lastS.length)bears.push("近6日出现 "+lastS.length+" 个空头信号："+lastS.slice(0,3).map(s=>esc(s.nm)).join("、"));

  /* 4. 风险 */
  if(nn(an.rsiV)&&an.rsiV>=72)risks.push("RSI(14)="+f1(an.rsiV)+" 进入<b>超买区</b>（>70），获利盘积累，回撤敏感度上升");
  if(nn(an.rsiV)&&an.rsiV<=28)risks.push("RSI(14)="+f1(an.rsiV)+" 进入<b>超卖区</b>（<30），有反弹条件但下跌动能尚未衰竭");
  if(an.diver&&an.diver.indexOf("顶背离")>=0)risks.push("检测到<b>顶背离</b>：价格创新高而 DIF 未同步，内在动能转弱");
  if(an.diver&&an.diver.indexOf("底背离")>=0)risks.push("检测到<b>底背离</b>：价格创新低而 DIF 抬升，属止跌前兆，需量能确认方可视为反转");
  if(an.bw&&nn(an.bw.bw)&&/收敛/.test(an.bw.state))risks.push("布林带宽 "+an.bw.bw.toFixed(2)+"% <b>极度收敛</b>，处于变盘临界，方向未定前不宜加仓");
  if(nn(an.ms.s1)&&Math.abs(an.ms.s1)>8)risks.push("MA5 偏离 MA20 达 <b>"+an.ms.s1.toFixed(2)+"%</b>，乖离过大存在均值回归压力");
  if(nn(an.vr)&&an.vr<0.7&&(num(an.chg)||0)>0)risks.push("上涨当日量比仅 "+an.vr.toFixed(2)+"，<b>价涨量缩</b>，上攻持续性存疑");
  if(nn(an.vr)&&an.vr>2.5)risks.push("量比高达 "+an.vr.toFixed(2)+"，<b>巨量</b>对应分歧加剧，需观察次日能否守住");
  if(A(an.atr,i)!=null){const ap=an.atr[i]/c*100;if(ap>4)risks.push("ATR(14)="+f2(an.atr[i])+"（占股价 "+ap.toFixed(2)+"%），<b>波动率偏高</b>，仓位应相应收缩");}
  if(!risks.length)risks.push("当前未触发显著风险指标，但仍需留意大盘系统性波动与个股基本面变化");

  /* 5. 关键位 */
  const atr=A(an.atr,i);
  levels.push({nm:"最新收盘",vv:f2(c),tone:"neu"});
  const sup1=an.sup[0], res1=an.res[0];
  levels.push({nm:"最近支撑",vv:sup1!=null?f2(sup1):"数据缺失",tone:"up"});
  levels.push({nm:"最近压力",vv:res1!=null?f2(res1):"数据缺失",tone:"down"});
  if(nn(an.poc.poc))levels.push({nm:"密集成交区 POC",vv:f2(an.poc.poc),tone:(c>=an.poc.poc?"up":"down")});
  if(A(an.ma20,i)!=null)levels.push({nm:"MA20",vv:f2(an.ma20[i]),tone:(c>=an.ma20[i]?"up":"down")});
  if(A(an.ma60,i)!=null)levels.push({nm:"MA60（生命线）",vv:f2(an.ma60[i]),tone:(c>=an.ma60[i]?"up":"down")});
  if(atr!=null)levels.push({nm:"ATR 波动参考 ±1",vv:f2(c-atr)+" ～ "+f2(c+atr),tone:"neu"});
  if(sup1!=null&&atr!=null)levels.push({nm:"结构破坏参考位",vv:f2(sup1-atr*0.5),tone:"down"});

  /* 6. 观察要点 */
  if(A(an.ma20,i)!=null)watch.push("能否<b>站稳 MA20（"+f2(an.ma20[i])+"）</b>——短中期分水岭");
  if(A(an.ma60,i)!=null)watch.push("MA60（"+f2(an.ma60[i])+"）得失决定中期趋势性质是否改变");
  watch.push("量能能否<b>持续放大</b>（量比维持 >1.2）——无量上攻难以持续");
  if(res1!=null)watch.push("上方 <b>"+f2(res1)+"</b> 能否放量有效突破");
  if(sup1!=null)watch.push("下方 <b>"+f2(sup1)+"</b> 破位则支撑结构失效");
  if(A(an.bar,i)!=null&&A(an.bar,i)<0)watch.push("MACD 绿柱何时<b>缩短并翻红</b>——动能转向的前置信号");
  if(nn(an.rsiV)&&an.rsiV>=70)watch.push("RSI 能否从超买区回落至 70 下方且不破关键均线（强势整理）");

  return {tone,icon,title,desc,resPct,score:sc,
    bulls:bulls.length?bulls:["当前无明确多头技术依据"],
    bears:bears.length?bears:["当前无明确空头技术依据"],
    risks,levels,watch};
}

/* 大盘 AI 解读 */
function aiMarket(){
  const m=state.market||{}, b=state.breadth||{};
  const items=[],risks=[];
  const sh=num(m.sh_chg),sz=num(m.sz_chg),cy=num(m.cy_chg);
  const cnt=(sh!=null?1:0)+(sz!=null?1:0)+(cy!=null?1:0);
  const avg=cnt?(((sh||0)+(sz||0)+(cy||0))/cnt):null;
  const up=num(b.up),dn=num(b.dn);
  const ratio=(up!=null&&dn&&dn>0)?up/dn:null;
  let tone="neu",icon="◆",title="市场处于震荡格局";

  if(avg!=null){
    if(avg>=1){tone="up";icon="▲";title="三大指数普涨，市场情绪回暖";}
    else if(avg>=0.2){tone="up";icon="▲";title="指数小幅收红，结构性行情为主";}
    else if(avg<=-1){tone="down";icon="▼";title="三大指数普跌，市场情绪转弱";}
    else if(avg<=-0.2){tone="down";icon="▼";title="指数小幅收绿，赚钱效应收缩";}
    else {tone="neu";icon="◆";title="指数涨跌互现，多空分歧明显";}
  }
  let desc="三大指数：上证 <b>"+f2(num(m.sh_close))+"</b>（"+pct(sh)+"）、深证 <b>"+f2(num(m.sz_close))+"</b>（"+pct(sz)+"）、创业板 <b>"+f2(num(m.cy_close))+"</b>（"+pct(cy)+"）。";
  if(avg!=null)desc+="平均涨跌 <b>"+(avg>=0?"+":"")+avg.toFixed(2)+"%</b>。";

  if(up!=null&&dn!=null){
    desc+=" 市场宽度：上涨 <b>"+up+"</b> 家 / 下跌 <b>"+dn+"</b> 家，涨跌比 <b>"+(ratio!=null?ratio.toFixed(2):"—")+"</b>。";
    if(ratio!=null){
      if(ratio>=2)items.push("涨跌比 "+ratio.toFixed(2)+"，<b>普涨格局</b>，赚钱效应扩散，容错率较高");
      else if(ratio>=1.2)items.push("涨跌比 "+ratio.toFixed(2)+"，<b>涨多跌少</b>，情绪偏暖但需主线支撑");
      else if(ratio>=0.8)items.push("涨跌比 "+ratio.toFixed(2)+"，多空<b>基本均衡</b>，典型分化市");
      else if(ratio>=0.5)items.push("涨跌比 "+ratio.toFixed(2)+"，<b>跌多涨少</b>，赚钱效应收缩，容错率下降");
      else items.push("涨跌比仅 "+ratio.toFixed(2)+"，<b>普跌格局</b>，系统性风险大于结构性机会");
    }
  } else {
    risks.push("市场宽度（涨跌家数）<b>数据缺失</b>——点顶部「↻ 刷新行情」补全后温度判定才准确");
  }
  const zt=num(b.zt),dt=num(b.dt),zb=num(b.zb);
  if(zt!=null){
    items.push("涨停 <b>"+zt+"</b> 家"+(dt!=null?"、跌停 <b>"+dt+"</b> 家":"")+(zb!=null?"、炸板 <b>"+zb+"</b> 家":""));
    if(zb!=null&&zt>0){
      const zbr=zb/(zt+zb)*100;
      items.push("炸板率 <b>"+zbr.toFixed(1)+"%</b>"+(zbr>35?"——<b>偏高</b>，追涨风险大、承接不足":(zbr<15?"——偏低，封板质量较好":"——中性水平")));
    }
    if(zt>=80)items.push("涨停家数 "+zt+" 家，处于<b>情绪高位</b>，需防高潮后的分歧");
    else if(zt<=25)items.push("涨停家数仅 "+zt+" 家，处于<b>情绪低位</b>，热点稀缺");
  } else {
    risks.push("涨停/跌停/炸板数据缺失，情绪周期判断不完整");
  }
  const amt=(num(m.sh_amt)||0)+(num(m.sz_amt)||0);
  if(amt>0)items.push("两市合计成交 <b>"+f2(amt)+" 亿</b>"+(amt>20000?"（<b>显著放量</b>，交投活跃）":(amt<9000?"（<b>明显缩量</b>，观望情绪浓）":"（量能中性）")));
  /* 指数技术面（基于内嵌真实指数日K） */
  [["000001","上证"],["399001","深证"],["399006","创业板"]].forEach(function(d){
    let an=null; try{ an=getAn(d[0]); }catch(e){}
    if(!an||!nn(an.ma20[an.i]))return;
    const a20=an.close>an.ma20[an.i], a60=nn(an.ma60[an.i])&&an.close>an.ma60[an.i];
    items.push("<b>"+d[1]+"指数</b> "+f2(an.close)+"：位于 MA20 "+(a20?"上方":"下方")+"、MA60 "+(a60?"上方":"下方")
      +"，"+esc(an.arrange)+"，MACD柱 "+f3(an.bar[an.i])+(nn(an.vr)?"，量比 "+an.vr.toFixed(2):""));
  });
  const sn=state.snap||{};
  if(sn.hot&&sn.hot.length)items.push("领涨主线：<b>"+sn.hot.slice(0,3).map(x=>esc(x.name)+" "+pct(x.chg)).join("、")+"</b>");
  if(sn.net&&sn.net.length){
    const pos=sn.net.filter(x=>(num(x.net)||0)>0), neg=sn.net.filter(x=>(num(x.net)||0)<0);
    if(pos.length)items.push("主力净流入居前：<b>"+pos.slice(0,2).map(x=>esc(x.name)+" +"+f2(x.net)+"亿").join("、")+"</b>");
    if(neg.length)items.push("主力净流出居前：<b>"+neg.slice(0,2).map(x=>esc(x.name)+" "+f2(x.net)+"亿").join("、")+"</b>，注意资金撤离方向");
  }
  if(avg!=null&&avg>0.8)risks.push("指数涨幅较大，需防<b>次日高位分歧</b>，追高容错率低");
  if(avg!=null&&avg<-0.8)risks.push("指数跌幅较深，若次日<b>不能收复</b>，易形成下跌中继");
  if(ratio!=null&&ratio<0.5)risks.push("市场宽度极差（涨跌比 "+ratio.toFixed(2)+"），<b>指数与个股背离</b>时勿被指数表象误导");
  if(zt!=null&&zt>=80)risks.push("涨停家数处于高位，情绪<b>接近高潮</b>，通常对应短期风险累积");
  if(!risks.length)risks.push("当前未见极端信号，按常态震荡市处理，控制单一标的集中度");

  return {tone,icon,title,desc,items,risks,avgTemp:avg};
}

/* 组合 AI 诊断 */
function aiPortfolio(list){
  const rows=[];
  list.forEach(h=>{const an=getAn(h.code);if(an)rows.push({h,an});});
  if(!rows.length)return null;
  const n=rows.length;
  const mean=rows.reduce((a,r)=>a+r.an.score.total,0)/n;
  const upN=rows.filter(r=>/多头/.test(r.an.arrange)).length;
  const dnN=rows.filter(r=>/空头/.test(r.an.arrange)).length;
  const wkUp=rows.filter(r=>r.an.wk&&r.an.wk.ok&&/多头/.test(r.an.wk.arrange)).length;
  const strong=rows.filter(r=>r.an.score.total>=62).length;
  const weak=rows.filter(r=>r.an.score.total<=32).length;
  const sorted=rows.slice().sort((a,b)=>b.an.score.total-a.an.score.total);
  let tone,icon,title;
  if(mean>=60){tone="up";icon="▲";title="组合整体技术面偏强，多数标的处于多头结构";}
  else if(mean>=48){tone="neu";icon="◆";title="组合技术面中性，强弱分化明显";}
  else if(mean>=36){tone="down";icon="▼";title="组合整体偏弱，多数标的承压";}
  else{tone="down";icon="▼";title="组合技术面普遍弱势，需警惕系统性回撤";}
  const desc="纳入 <b>"+n+"</b> 只标的，平均技术评分 <b>"+mean.toFixed(1)+"</b> 分；日线多头 <b>"+upN+"</b> 只 / 空头 <b>"+dnN+"</b> 只，周线多头 <b>"+wkUp+"</b> 只；"
    +"评分≥62 的强势标的 <b>"+strong+"</b> 只，≤32 的弱势标的 <b>"+weak+"</b> 只。";
  const items=[];
  const top=sorted[0], bot=sorted[n-1];
  if(top)items.push("技术面最强：<b>"+esc(top.h.name)+"</b>（评分 "+top.an.score.total+" · "+esc(top.an.arrange)+"）");
  if(bot&&n>1)items.push("技术面最弱：<b>"+esc(bot.h.name)+"</b>（评分 "+bot.an.score.total+" · "+esc(bot.an.arrange)+"）");
  const corr=dnN/n*100;
  if(corr>=60)items.push("空头排列占比 <b>"+corr.toFixed(0)+"%</b>，组合<b>同向暴露高</b>，分散效果有限，实质是集中 beta 押注");
  const risks=[];
  if(weak>=Math.ceil(n*0.4))risks.push("弱势标的达 "+weak+"/"+n+" 只，若大盘转弱，组合<b>下行相关性会显著上升</b>");
  if(dnN>=Math.ceil(n*0.6))risks.push("多数标的处于空头结构，<b>分散是假象</b>——应按单一集中仓位管理风险敞口");
  const hot=rows.filter(r=>nn(r.an.rsiV)&&r.an.rsiV>=72);
  if(hot.length)risks.push(hot.length+" 只标的 RSI(14)≥72 处于超买区："+hot.map(r=>esc(r.h.name)).join("、"));
  if(!risks.length)risks.push("未发现极端集中风险，但仍建议关注宏观变量（如大厂 AI capex）对组合的共同驱动");
  return {tone,icon,title,desc,items,risks,mean,upN,dnN,wkUp,strong,weak,sorted};
}
