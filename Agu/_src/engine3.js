/* ============================================================
   引擎三：报告生成 / 联网 / 事件绑定 / 初始化
   ============================================================ */

/* ---------- 报告：第一步 大盘 ---------- */
function buildMarketBlock(){
  const m=state.market||{}, b=state.breadth||{};
  const L=[];
  L.push("■ 指数表现");
  const row=(nm,c,chg,amt,amtd)=>{
    const has=nn(c);
    L.push("  "+nm+"："+(has?"收盘 "+f2(c)+"，涨跌幅 "+pct(chg):"数据缺失")+
      (nn(amt)?"，成交额 "+f2(amt)+" 亿元":"，成交额 数据缺失")+
      (nn(amtd)?"（较昨日环比 "+pct(amtd)+"）":"（环比 数据缺失）"));
  };
  row("上证指数",m.sh_close,m.sh_chg,m.sh_amt,m.sh_amtd);
  row("深证成指",m.sz_close,m.sz_chg,m.sz_amt,m.sz_amtd);
  row("创业板指",m.cy_close,m.cy_chg,m.cy_amt,m.cy_amtd);
  L.push("");
  L.push("■ 市场宽度");
  const up=num(b.up),dn=num(b.dn),zt=num(b.zt),dt=num(b.dt),zb=num(b.zb);
  if(up==null||dn==null){
    L.push("  ⚠ 数据缺失：涨跌家数未提供（可在应用内点「↻ 刷新行情」由浏览器直连获取，或手填）。");
  }else{
    L.push("  上涨 "+up+" 家 ／ 下跌 "+dn+" 家，涨跌比 "+(dn?(up/dn).toFixed(2):"—")+
      "（"+(up/(up+dn)*100).toFixed(1)+"% 个股上涨）");
  }
  L.push("  涨停 "+(zt==null?"数据缺失":zt+" 家")+" ／ 跌停 "+(dt==null?"数据缺失":dt+" 家")
    +" ／ 炸板 "+(zb==null?"数据缺失":zb+" 家")
    +(zt!=null&&zb!=null&&(zt+zb)>0?"（炸板率 "+(zb/(zt+zb)*100).toFixed(1)+"%）":""));
  if(nn(b.amt))L.push("  两市成交额 "+f2(b.amt)+" 亿元");
  L.push("");
  L.push("■ 趋势判断（相对均线 / 量价配合）");
  const idxs=[["000001","上证指数"],["399001","深证成指"],["399006","创业板指"]];
  let anyIdx=false;
  idxs.forEach(([cd,nm])=>{
    const an=getAn(cd);
    if(!an){L.push("  "+nm+"：⚠ 数据缺失（未载入指数日K线，MA 位置无法计算）");return;}
    anyIdx=true;
    const i=an.i;
    const pos=[[an.ma5,"MA5"],[an.ma20,"MA20"],[an.ma60,"MA60"]].map(([ma,n])=>
      nn(ma[i])?n+(an.close>ma[i]?"上方 +"+((an.close-ma[i])/ma[i]*100).toFixed(2)+"%":"下方 "+((an.close-ma[i])/ma[i]*100).toFixed(2)+"%"):n+"（数据不足）").join("，");
    const vrTxt=nn(an.vr)?"量比 "+an.vr.toFixed(2)+"（"+(an.vr>1.2?"放量":an.vr<0.8?"缩量":"平量")+"）":"量能 数据缺失";
    L.push("  "+nm+"：收 "+f2(an.close)+"（"+pct(an.chg)+"）｜ "+pos+" ｜ "+vrTxt
      +" ｜ MACD柱 "+f2(an.bar[i])+"（"+(an.bar[i]>=0?"红":"绿")+"）");
  });
  if(!anyIdx)L.push("  ⚠ 数据缺失：三大指数均未载入日K线，无法判断均线位置与量价配合。");
  const vn=(state.vol_note||"").trim();
  if(vn)L.push("  人工备注："+vn);
  else if(anyIdx){
    const an=getAn("000001");
    if(an){
      const upDay=(num(an.chg)||0)>0;
      const vup=nn(an.vr)&&an.vr>1.1;
      L.push("  自动判定："+(upDay?"价涨":"价跌")+"、"+(!nn(an.vr)?"量能数据缺失":(vup?"放量":"缩量"))+
        " → "+((upDay&&vup)?"量价配合良好（放量上涨）":(upDay&&!vup?"量价背离（缩量上涨，持续性存疑）":(!upDay&&vup?"放量下跌（抛压释放）":"缩量下跌（抛压有限）"))
        +"（依据：上证涨跌 "+pct(an.chg)+"，量比 "+(nn(an.vr)?an.vr.toFixed(2):"缺失")+"）"));
    }
  }
  L.push("");
  /* 板块快照 */
  const s=state.snap||{};
  L.push("■ 热门板块与主力资金（快照 "+SNAPSHOT_DATE+"）");
  if((s.hot||[]).length){
    L.push("  领涨 TOP："+(s.hot||[]).slice(0,6).map(x=>x.name+" "+pct(x.chg)+(x.leader?"（龙头 "+x.leader+"）":"")).join("；"));
  } else L.push("  ⚠ 数据缺失：热门板块快照为空。");
  if((s.money||[]).length){
    L.push("  主力净流入 TOP："+(s.money||[]).slice(0,6).map(x=>
      x.name+" "+(x.net==null?"—":(num(x.net)>0?"+":"")+f2(x.net)+"亿")
      +(x.days5!=null?"（近5日 "+(num(x.days5)>0?"+":"")+f2(x.days5)+"亿）":"")).join("；"));
    const out=(s.money||[]).filter(x=>num(x.net)<0);
    if(out.length)L.push("  主力净流出："+out.slice(-4).map(x=>x.name+" "+f2(x.net)+"亿").join("；"));
  } else L.push("  ⚠ 数据缺失：主力资金快照为空。");
  L.push("");
  L.push("■ 综合结论（市场温度判定）");
  const tmp=marketTemp();
  L.push("  市场温度："+tmp.label+"（"+tmp.score+"/100，依据："+tmp.src+"）");
  const tol = tmp.score>=80?"容错率低：高潮期追高易吃面，宜降低仓位与换手频率"
    :tmp.score>=62?"容错率中等：发酵期主线有效，宜聚焦龙头与主线，避免杂毛"
    :tmp.score>=45?"容错率中等：震荡期多看少动，宜等明确信号"
    :tmp.score>=28?"容错率低：退潮期宜控制回撤，减少试错":"容错率极低：冰点期以观察为主，等待情绪修复";
  L.push("  次日操作容错率评估："+tol);
  L.push("");
  return L.join("\n");
}

/* ---------- 报告：第二步 板块 ---------- */
function buildSectorBlock(){
  const L=[];
  L.push("■ 领涨板块 TOP 与驱动逻辑");
  const ss=(state.sectors||[]).filter(s=>s&&s.name);
  if(!ss.length){L.push("  ⚠ 数据缺失：未填写板块数据。");L.push("");return L.join("\n");}
  const money=(state.snap&&state.snap.money)||[];
  const netMap={},d5Map={};money.forEach(m=>{netMap[m.name]=num(m.net);d5Map[m.name]=num(m.days5);});
  ss.slice(0,5).forEach((s,idx)=>{
    const net=netMap[s.name],d5=d5Map[s.name];
    L.push("  "+(idx+1)+". "+s.name+"　涨幅 "+pct(s.chg)+"　驱动："+(s.logic||"未标注"));
    L.push("     资金："+(net==null?"数据缺失":(net>0?"净流入 +":"净流出 ")+f2(net)+"亿")
      +(d5!=null?"（近5日 "+(d5>0?"+":"")+f2(d5)+"亿，"+(net>0&&d5>0?"资金持续性好":net>0&&d5<0?"今日回流但5日净出，持续性存疑":net<0&&d5<0?"持续流出":"今日流出但5日净入")+"）":"（近5日 数据缺失）"));
    L.push("     梯队：龙头 "+(s.leader||"数据缺失")+" ／ 中军 "+(s.mid||"数据缺失")+" ／ 低位补涨 "+(s.low||"数据缺失")
      +"　连续 "+(s.days||"数据缺失")+" 天");
  });
  L.push("");
  L.push("■ 梯队完整性评估");
  const full=ss.filter(s=>s.leader&&s.mid&&s.low).length;
  const partial=ss.filter(s=>s.leader&&(s.mid||s.low)).length;
  L.push("  完整梯队（龙头+中军+补涨齐全）"+full+" 个；部分梯队 "+partial+" 个；共 "+ss.length+" 个板块。");
  L.push("  "+(full>0?"存在完整梯队，主线具备发酵基础":partial>0?"梯队不完整，仅部分板块有龙头与跟风，需观察补涨是否跟上":"⚠ 数据缺失：无板块标注龙头/中军/补涨，无法评估梯队完整性"));
  L.push("");
  L.push("■ 主线 vs 轮动区分");
  const days3=ss.filter(s=>(num(s.days)||0)>=3);
  L.push("  连续性：连续≥3天的板块 "+(days3.length?days3.map(s=>s.name+"（"+s.days+"天）").join("、"):"无")+"。");
  L.push("  资金持续性：依据主力净额与近5日净额一致性判定（见上）。");
  L.push("  结论："+(days3.length?"存在连续主线（"+days3.map(s=>s.name).join("、")+"），但需要资金持续净流入确认；":"当前以轮动为主，未见连续≥3天的主线，")
    +"逻辑硬度取决于驱动类型（政策/业绩 > 事件 > 纯资金）。");
  L.push("");
  return L.join("\n");
}

/* ---------- 报告：第三步 个股 ---------- */
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
  L.push("  ■ AI 技术研判（规则推理，附数据依据 · 非投资建议）");
  try{
    const r=aiStock(an);
    const strip=s=>String(s).replace(/<[^>]+>/g,"");
    L.push("    【结论】"+r.icon+" "+r.title);
    L.push("    "+strip(r.desc));
    L.push("    【多周期共振度】"+r.resPct+"%（技术评分 "+r.score+"）");
    L.push("    【多头依据】");
    r.bulls.forEach(x=>L.push("      + "+strip(x)));
    L.push("    【空头依据】");
    r.bears.forEach(x=>L.push("      - "+strip(x)));
    L.push("    【关键位】"+r.levels.map(x=>x.nm+" = "+x.vv).join("　｜　"));
    L.push("    【风险提示】"+r.risks.map(strip).join("；"));
    L.push("    【后续观察要点】");
    r.watch.forEach(x=>L.push("      · "+strip(x)));
  }catch(e){L.push("    ⚠ AI 研判生成失败："+(e&&e.message?e.message:"未知错误"));}
  L.push("");
  L.push("  ■ 技术评分分解（五维）");
  const d=an.score.dims,cap=an.score.caps;
  L.push("    "+Object.keys(d).map(k=>k+" "+d[k]+"/"+cap[k]).join("　｜　")+"　→　总分 "+an.score.total+"（"+an.score.label+"）");
  L.push("    自身历史分位："+(an.scorePct==null?"数据不足（样本<5）":an.scorePct+"%（近120日回测，越高表示相对自身历史越强）"));
  L.push("");
  return L.join("\n");
}

/* ---------- 报告：第四步 风险 ---------- */
function buildRiskBlock(stocks){
  const L=[];
  L.push("■ 三个最可能证伪当前判断的信号（含触发条件）");
  const list=stocks.filter(s=>s.an);
  if(!list.length){L.push("  ⚠ 数据缺失：无有效个股数据，无法给出证伪信号。");L.push("");return L.join("\n");}
  /* 依据组合实况动态生成 */
  const bulls=list.filter(s=>s.an.score.total>=62), bears=list.filter(s=>s.an.score.total<45);
  const macdBull=list.filter(s=>nn(s.an.bar[s.an.i])&&s.an.bar[s.an.i]>=0).length;
  const aboveMa20=list.filter(s=>nn(s.an.ma20[s.an.i])&&s.an.close>s.an.ma20[s.an.i]).length;
  const tot=list.length;
  L.push("  1) 动量证伪：若 MACD 柱由红转绿且 DIF 下穿 DEA（当前 "+macdBull+"/"+tot+" 只处于红柱），则本轮反弹动量证伪，"
    +"需观察是否伴随成交量放大（量比>1.5）——无量下跌为洗盘，有量下跌为趋势反转。");
  L.push("  2) 结构证伪：若收盘价跌破 MA20 且 MA5 下穿 MA20（当前 "+aboveMa20+"/"+tot+" 只站上 MA20），则短期上升结构破坏，"
    +"进一步跌破 MA60 则确认中期转弱（"+bulls.length+" 只偏强 / "+bears.length+" 只偏弱）。");
  L.push("  3) 量能证伪：若反弹过程中量比持续 <0.8（缩量上涨），则上攻缺乏资金承接，"
    +"属量价背离；需等待放量确认，否则回踩概率上升。");
  L.push("");
  L.push("■ 三情景推演（仅为情景描述与观察要点，非预测目标价）");
  L.push("  【乐观情景】条件：指数放量上涨（量比>1.2）+ 个股 MACD 红柱扩张 + 站上并守住 MA20/MA60。");
  L.push("     观察要点：龙头是否继续领涨、涨停家数是否扩大、成交能否持续放大、偏强标的（"+bulls.length+" 只）能否扩散。");
  L.push("  【中性情景】条件：指数窄幅震荡、量能持平（量比 0.8–1.2）、个股在 MA20 上下反复。");
  L.push("     观察要点：以区间思路对待，关注支撑位（各标的 POC 与近20日低）是否守住，跌破则转悲观；压力位能否放量突破。");
  L.push("  【悲观情景】条件：指数放量下跌 + 跌破关键支撑（MA60 / 近60日低）+ 涨停家数骤减、炸板率升高。");
  L.push("     观察要点：偏弱标的（"+bears.length+" 只）是否率先破位，市场温度是否降至退潮/冰点，届时容错率显著下降。");
  L.push("");
  return L.join("\n");
}

/* ---------- 报告：主线 × 持仓映射 ---------- */
function buildSectorMapBlock(){
  const L=[];
  const sn=state.snap||{};
  const hot=sn.hot||[], net=sn.net||[];
  if(!hot.length&&!net.length){L.push("⚠ 数据缺失：无板块快照，无法做主线映射。\n");return L.join("\n");}
  const holds=state.holdings.filter(h=>h.inReport!==false);
  const seen={},rows=[];
  [].concat(hot.map(x=>({name:x.name,chg:x.chg,net:null,kind:"领涨"})),
            net.map(x=>({name:x.name,chg:x.chg,net:x.net,kind:"资金"}))).forEach(s=>{
    const k=s.name+"|"+s.kind; if(seen[k])return; seen[k]=1;
    rows.push({s:s,hits:holds.filter(h=>sectorMatch(s.name,HOLD_SECTOR[h.code]))});
  });
  rows.sort((a,b)=>(b.hits.length-a.hits.length)||((num(b.s.chg)||0)-(num(a.s.chg)||0)));
  const cov={}; rows.forEach(r=>r.hits.forEach(h=>cov[h.code]=1));
  const un=holds.filter(h=>!cov[h.code]);
  L.push("■ 今日主线 × 持仓映射（板块名匹配推断，非精确行业归类）");
  L.push("  主线板块 "+rows.length+" 个，命中持仓的板块 "+rows.filter(r=>r.hits.length).length+" 个；"
    +"被主线覆盖持仓 "+Object.keys(cov).length+"/"+holds.length+" 只"
    +(un.length?"；未覆盖："+un.map(x=>x.name).join("、")+"（非当前热点，需独立跟踪）":"；主线覆盖充分"));
  rows.slice(0,12).forEach(r=>{
    L.push("    · "+r.s.name+"（"+r.s.kind+"）"+pct(r.s.chg)
      +(r.s.net!=null?"　主力净流入 "+f2(r.s.net)+"亿":"")
      +"　→　"+(r.hits.length?r.hits.map(h=>{
          const an=getAn(h.code);
          return h.name+(an?"（评分 "+an.score.total+"）":"");
        }).join("、"):"无持仓命中"));
  });
  L.push("");
  return L.join("\n");
}

/* ---------- 报告总装 ---------- */
var LAST_REPORT="";
function genReport(){
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
  rep+="## 第四步：风险警示与情景推演\n\n"+buildRiskBlock(stocks);
  rep+="\n────────────────────────────────────\n";
  rep+="## 免责声明\n\n";
  rep+="本报告由本地工具依据用户提供的真实行情数据自动生成，所有技术指标（MA/EMA/MACD/RSI/KDJ/BOLL/量比/POC 等）"
    +"均由本地 JavaScript 从原始 OHLCV 计算，未接入任何交易通道。\n";
  rep+="报告中所有内容为技术形态的客观描述与情景推演，不构成任何买入/卖出的交易指令，也不构成投资建议。\n";
  rep+="技术分析具有滞后性与失效可能，历史形态不代表未来表现。市场有风险，据此操作，风险自负。\n";
  LAST_REPORT=rep;
  const out=$("reportOut");
  if(out)out.textContent=rep;
  return rep;
}

/* ---------- 导出 ---------- */
function download(content,name,type){
  const blob=new Blob([content],{type:type||"text/plain;charset=utf-8"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);a.download=name;
  document.body.appendChild(a);a.click();
  setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},300);
}

/* ---------- 联网：指数 + 涨跌家数 ---------- */
function jsonp(url,timeout){
  return new Promise((resolve,reject)=>{
    const cb="__cb"+Math.random().toString(36).slice(2,9);
    const s=document.createElement("script");
    let done=false;
    window[cb]=(data)=>{done=true;delete window[cb];try{document.body.removeChild(s);}catch(e){}resolve(data);};
    s.onerror=()=>{if(!done){delete window[cb];reject(new Error("script error"));}};
    s.src=url+(url.indexOf("?")<0?"?":"&")+"cb="+cb;
    document.body.appendChild(s);
    setTimeout(()=>{if(!done){delete window[cb];try{document.body.removeChild(s);}catch(e){}reject(new Error("timeout"));}},timeout||9000);
  });
}
function fetchText(url,timeout){
  return new Promise((resolve,reject)=>{
    const s=document.createElement("script");
    s.src=url;document.body.appendChild(s);
    setTimeout(()=>{try{document.body.removeChild(s);}catch(e){}reject(new Error("timeout"));},timeout||9000);
  });
}
/* 腾讯指数：返回 v_sh000001="..." 文本，用 script 加载后读取全局变量 */
function fetchTencentQuote(codes){
  return new Promise((resolve,reject)=>{
    const s=document.createElement("script");
    s.charset="GBK";
    s.src="https://qt.gtimg.cn/q="+codes.join(",");
    s.onload=()=>{
      const out={};
      codes.forEach(c=>{
        const v=window["v_"+c];
        if(!v)return;
        const f=String(v).split("~");
        out[c]={name:f[1],price:num(f[3]),prev:num(f[4]),chg:num(f[31]),pct:num(f[32]),
          high:num(f[33]),low:num(f[34]),amount:num(f[37]),time:f[30]};
      });
      try{document.body.removeChild(s);}catch(e){}
      resolve(out);
    };
    s.onerror=()=>{try{document.body.removeChild(s);}catch(e){}reject(new Error("network"))};
    document.body.appendChild(s);
    setTimeout(()=>{reject(new Error("timeout"))},9000);
  });
}
async function fetchMarket(){
  const btn=$("btnRefresh");
  if(btn){btn.disabled=true;btn.textContent="刷新中…";}
  const msgs=[];
  try{
    const q=await fetchTencentQuote(["sh000001","sz399001","sz399006"]);
    const map={sh000001:["sh_close","sh_chg","sh_amt"],sz399001:["sz_close","sz_chg","sz_amt"],sz399006:["cy_close","cy_chg","cy_amt"]};
    state.market=state.market||{};
    Object.keys(map).forEach(k=>{
      const d=q[k];if(!d)return;
      const [a,b,c]=map[k];
      const old=state.market[a];
      state.market[a]=d.price;
      state.market[b]=d.pct;
      state.market[c]=d.amount!=null?Math.round(d.amount/100)/100:null;
      const od=a.replace("_close","_amtd");
      if(old!=null&&d.price!=null)state.market[od]=Math.round((d.price-old)/old*10000)/100;
    });
    msgs.push("指数已更新（"+Object.keys(q).length+"/3）");
    clearAn("000001");clearAn("399001");clearAn("399006");
  }catch(e){ msgs.push("指数刷新失败（网络/CORS）：保留快照数据"); }
  /* 涨跌家数：东方财富 clist（CORS 开放） */
  try{
    const url="https://push2.eastmoney.com/api/qt/clist/get?pn=1&pz=200&po=1&np=1&fltt=2&invt=2&fid=f3"
      +"&fs=m:0+t:6,m:0+t:80,m:1+t:2,m:1+t:23&fields=f12,f14,f3,f2";
    const data=await jsonp(url,9000).catch(()=>null);
    if(data&&data.data&&data.data.diff){
      const rows=data.data.diff;
      const xs=rows.map(r=>num(r.f3)).filter(x=>x!=null);
      if(xs.length){
        state.breadth={
          up:xs.filter(x=>x>0).length,
          dn:xs.filter(x=>x<0).length,
          zt:xs.filter(x=>x>=9.8).length,
          dt:xs.filter(x=>x<=-9.8).length
        };
        msgs.push("涨跌家数已更新（样本 "+xs.length+" 只，非全市场，仅供参考）");
      } else msgs.push("涨跌家数：返回为空，保留原值/标注缺失");
    } else msgs.push("涨跌家数获取失败（限流/CORS）：标注数据缺失");
  }catch(e){ msgs.push("涨跌家数获取失败：标注数据缺失"); }
  saveState();renderMarket();renderHeader();renderDash();
  if(btn){btn.disabled=false;btn.textContent="↻ 刷新行情";}
  alert("刷新完成：\n· "+msgs.join("\n· "));
}

/* ---------- 联网：个股日K（新浪） ---------- */
function sinaSym(code){
  if(/^(6|5|11|9)/.test(code))return "sh"+code;
  if(/^(0|3|1)/.test(code))return "sz"+code;
  return "sz"+code;
}
function fetchKlineSina(code){
  return new Promise((resolve,reject)=>{
    const cb="__k"+Math.random().toString(36).slice(2,9);
    const s=document.createElement("script");
    let done=false;
    window[cb]=(data)=>{done=true;delete window[cb];try{document.body.removeChild(s);}catch(e){}resolve(data||[]);};
    s.onerror=()=>{if(!done){delete window[cb];reject(new Error("err"));}};
    s.src="https://money.finance.sina.com.cn/quotes_service/api/json_v2.php/CN_MarketData.getKLineData?symbol="
      +sinaSym(code)+"&scale=240&ma=5&datalen=320&cb="+cb;
    document.body.appendChild(s);
    setTimeout(()=>{if(!done){delete window[cb];try{document.body.removeChild(s);}catch(e){}resolve([]);}},11000);
  });
}
async function fetchStockData(code){
  const raw=await fetchKlineSina(code);
  if(!raw||!raw.length)return 0;
  const rows=raw.map(d=>{
    const o=num(d.open),h=num(d.high),l=num(d.low),c=num(d.close),v=num(d.volume);
    if([o,h,l,c].some(x=>x==null))return null;
    return [String(d.day).slice(0,10),o,h,l,c,v==null?0:v,null];
  }).filter(Boolean);
  if(rows.length<8)return 0;
  state.stocks[code]={rows};clearAn(code);saveState();
  return rows.length;
}
async function fetchAllHoldings(){
  const msg=$("holdMsg");
  let done=0,fail=0;
  for(const h of state.holdings){
    if(msg)msg.textContent="拉取中 "+h.name+"…";
    try{ const n=await fetchStockData(h.code); if(n>0)done++; else fail++; }
    catch(e){ fail++; }
  }
  if(msg)msg.textContent="完成：成功 "+done+" 只，失败 "+fail+" 只";
  renderHoldings();renderRail();renderDash();
  alert("批量拉取完成：成功 "+done+" 只，失败 "+fail+" 只。\n失败多为网络/CORS，可手动粘贴K线。");
}

/* ============================================================
   事件绑定
   ============================================================ */
function bind(){
  document.querySelectorAll("nav button").forEach(b=>{b.onclick=()=>tab(b.dataset.tab);});

  /* 周期/主图/副图 切换 */
  document.querySelectorAll("#segPeriod button").forEach(b=>{
    b.onclick=()=>{
      document.querySelectorAll("#segPeriod button").forEach(x=>x.classList.remove("on"));
      b.classList.add("on");CUR.period=b.dataset.p;drawKline();
    };
  });
  document.querySelectorAll("#segMain button").forEach(b=>{
    b.onclick=()=>{
      document.querySelectorAll("#segMain button").forEach(x=>x.classList.remove("on"));
      b.classList.add("on");CUR.main=b.dataset.m;drawKline();
    };
  });
  document.querySelectorAll("#segSub button").forEach(b=>{
    b.onclick=()=>{
      document.querySelectorAll("#segSub button").forEach(x=>x.classList.remove("on"));
      b.classList.add("on");CUR.sub=b.dataset.s;drawKline();
    };
  });
  document.querySelectorAll("#segSpan button").forEach(b=>{
    b.onclick=()=>{
      document.querySelectorAll("#segSpan button").forEach(x=>x.classList.remove("on"));
      b.classList.add("on");CUR.span=parseInt(b.dataset.n,10)||0;drawKline();
    };
  });
  ["ckSignal","ckLevel","ckChan"].forEach(id=>{const e=$(id);if(e)e.onchange=drawKline;});
  const bp=$("btnPng");
  if(bp)bp.onclick=()=>{
    const el=$("klineChart");
    if(el&&el._c){ try{ const url=el._c.getDataURL({type:"png",pixelRatio:2,backgroundColor:"#0d131d"});
      const a=document.createElement("a");a.href=url;a.download=(CUR.an?(CUR.an.name||CUR.code):"kline")+"_"+(CUR.period==="weekly"?"周线":"日线")+".png";
      document.body.appendChild(a);a.click();a.remove(); }catch(e){alert("导出失败："+e.message);} }
  };

  /* 个股 */
  const ls=$("loadStock"); if(ls)ls.onclick=loadCurrent;
  const fs=$("fetchStock");
  if(fs)fs.onclick=async()=>{
    let code=($("stockCode").value||"").trim();
    if(!code){alert("请先输入代码或名称（支持 6 位代码 / 中文名 / 拼音首字母）");return;}
    /* 支持名称 / 拼音 → 代码 */
    if(!/^\d{6}$/.test(code)){
      const r=lookupName(code);
      if(r){ code=r.code; $("stockCode").value=r.code;
             if(!$("stockName").value)$("stockName").value=r.name; }
      else { alert("未识别「"+code+"」。请输入 6 位代码，或点「选…」按名称检索。"); return; }
    }
    if(!$("stockName").value)$("stockName").value=nameOf(code)||code;
    fs.disabled=true;fs.textContent="拉取中…";
    let n=0;
    try{ n=await fetchStockData(code); }catch(e){ n=0; }
    fs.disabled=false;fs.textContent="联网拉取";
    if(n>0){
      if(!state.holdings.find(h=>h.code===code)){
        const c=String(code);
        const tp=(/^(159|51|58|56|52|16)/.test(c)?"ETF":(IDX_CODES[c]?"IDX":"A"));
        state.holdings.push({code:code,name:($("stockName").value||code),type:tp,inReport:true});
        saveState();renderHoldings();renderRail();
      }
      loadCurrent();
      alert("已拉取 "+($("stockName").value||code)+"（"+code+"）"+n+" 根日K线。");
    }else{
      const raw=$("stockRaw");
      if(raw&&!raw.value){
        raw.value="日期,开盘,最高,最低,收盘,成交量\n"
          +"（把上面一行留着也行，下面按 2026-09-10,31.20,31.80,31.05,31.60,38210000 的格式粘贴，\n"
          +" 支持逗号 / Tab / 空格分隔，也支持 2026/9/10、20260910 日期；可从 Excel、通达信、同花顺直接复制）\n";
      }
      alert(fetchFailGuide(code)
        +"\n\n已按顺序尝试："+APICFG.order.filter(s=>APICFG.on[s]!==false).map(s=>SRC_META[s].nm).join(" → ")
        +"\n\n可以这样做：\n"
        +"① 去「⑨ 数据后台」点「测速全部数据源」看哪个可用，并调整顺序或填 CORS 代理；\n"
        +"② 或直接在下方「日K线数据」框粘贴（已放好模板，支持从 Excel / 通达信 / 同花顺复制）；\n"
        +"③ 若是新代码，确认 6 位代码正确、且属于沪深京市场。");
    }
  };
  const rs=$("railSearch"); if(rs)rs.oninput=renderRail;

  /* 大盘输入 */
  ["b_up","b_dn","b_zt","b_dt","b_zb","b_amt"].forEach(id=>{
    const e=$(id); if(e)e.oninput=()=>{
      state.breadth=state.breadth||{};
      state.breadth[id.slice(2)]=e.value;saveState();renderHeader();renderBreadthBar();
    };
  });
  const vn=$("vol_note"); if(vn)vn.oninput=()=>{state.vol_note=vn.value;saveState();};
  const as=$("applySnap");
  if(as)as.onclick=()=>{
    try{
      const o=JSON.parse($("snapJson").value);
      if(!o.hot&&!o.money)throw new Error("需含 hot 或 money 字段");
      state.snap=Object.assign({hot:[],money:[]},state.snap,o);
      saveState();renderSnapshot();renderSectorVerdict();
      alert("板块快照已应用");
    }catch(e){alert("JSON 解析失败："+e.message);}
  };
  const rsn=$("resetSnap");
  if(rsn)rsn.onclick=()=>{
    state.snap=JSON.parse(JSON.stringify({hot:DEFAULT_SNAPSHOT.hot||[],money:DEFAULT_SNAPSHOT.money||[]}));
    saveState();renderSnapshot();alert("已恢复默认快照");
  };

  /* 板块 */
  const ad=$("addSector");
  if(ad)ad.onclick=()=>{state.sectors.push({name:"",chg:"",logic:"资金",leader:"",mid:"",low:"",days:"",note:""});saveState();renderSectors();};
  const fls=$("fillSector");
  if(fls)fls.onclick=()=>{state.sectors=defaultSectors();saveState();renderSectors();alert("已从快照填充板块");};

  /* 持仓 */
  const fa=$("fetchAll"); if(fa)fa.onclick=()=>fetchAllHoldings();
  const rh=$("resetHold");
  if(rh)rh.onclick=()=>{
    if(!confirm("确定清空全部持仓？你的自定义持仓与成本数据将被重置（内置行情库保留）。"))return;
    state.holdings=DEFAULT_HOLDINGS.map(h=>({...h}));
    state.stocks=buildDefaultStocks();clearAn();saveState();
    renderHoldings();renderRail();renderDash();
  };
  const ah=$("addHold");
  if(ah)ah.onclick=()=>{
    const c=($("newCode").value||"").trim(),n=($("newName").value||"").trim(),t=$("newType").value;
    if(!c){alert("请输入代码");return;}
    if(state.holdings.find(h=>h.code===c)){alert("该代码已存在");return;}
    state.holdings.push({code:c,name:n||c,type:t,inReport:true});
    saveState();renderHoldings();renderRail();
    $("newCode").value="";$("newName").value="";
  };

  /* 报告 / 导出 / 备份 */
  const gr=$("genReport"); if(gr)gr.onclick=()=>{genReport();};
  const dm=$("dlMd"); if(dm)dm.onclick=()=>{genReport();download(LAST_REPORT,"复盘报告_"+SNAPSHOT_DATE+".md","text/markdown;charset=utf-8");};
  const dh=$("dlHtml");
  if(dh)dh.onclick=()=>{
    genReport();
    const html="<!doctype html><html lang=zh-CN><head><meta charset=utf-8><title>复盘报告 "+SNAPSHOT_DATE+"</title>"
      +"<style>body{background:#0d1117;color:#c9d1d9;font:14px/1.8 'Microsoft YaHei',monospace;padding:28px;max-width:960px;margin:0 auto}"
      +"h1,h2{color:#58a6ff}h2{border-bottom:1px solid #30363d;padding-bottom:6px;margin-top:28px}"
      +"pre{white-space:pre-wrap}</style></head><body><pre>"+esc(LAST_REPORT)+"</pre></body></html>";
    download(html,"复盘报告_"+SNAPSHOT_DATE+".html","text/html;charset=utf-8");
  };
  const bp2=$("btnPrint"); if(bp2)bp2.onclick=()=>window.print();
  const br=$("btnRefresh"); if(br)br.onclick=()=>fetchMarket();
  const be=$("btnExport"); if(be)be.onclick=()=>{tab("report");genReport();};
  const bk=$("btnBackup");
  if(bk)bk.onclick=()=>{
    const act=confirm("确定导出备份？\n【确定】= 导出 JSON 备份\n【取消】= 导入备份文件")?"exp":"imp";
    if(act==="exp"){
      download(JSON.stringify(state,null,1),"复盘数据备份_"+SNAPSHOT_DATE+".json","application/json;charset=utf-8");
    }else{
      const inp=document.createElement("input");inp.type="file";inp.accept=".json";
      inp.onchange=()=>{
        const f=inp.files[0];if(!f)return;
        const rd=new FileReader();
        rd.onload=()=>{
          try{
            const o=JSON.parse(rd.result);
            if(!o.holdings)throw new Error("文件格式不正确");
            state=o;clearAn();saveState();
            renderHoldings();renderRail();renderMarket();renderDash();
            alert("导入成功");
          }catch(e){alert("导入失败："+e.message);}
        };
        rd.readAsText(f);
      };
      inp.click();
    }
  };

  window.addEventListener("resize",()=>{
    ["klineChart","radarChart","scoreChart","sigPie","tempGauge","breadthBar","structBar"].forEach(id=>{
      const e=$(id);if(e&&e._c)try{e._c.resize();}catch(err){}
    });
  });
}

/* ============================================================
   初始化
   ============================================================ */
function init(){
  bind();
  renderHeader();
  renderMarket();
  renderSectors();
  renderHoldings();
  renderRail();
  renderDash();
  $("snapJson")._touched=false;
  const j=$("snapJson"); if(j)j.oninput=()=>{j._touched=true;};
  if(state.holdings.length)pickStock(state.holdings[0].code);
  tab("dash");
  genReport();
  window.addEventListener("resize",()=>{const e=$("klineChart");if(e&&e._c)e._c.resize();});
}
/* v2.0: init 由 engine10 统一启动（需等全部 var 初始化完成） */
