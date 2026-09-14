/* ============================================================
   引擎二：状态 / UI 渲染 / 图表
   ============================================================ */

/* ---------- 状态 ---------- */
function buildDefaultStocks(){
  const s={};
  /* 内置公开行情快照全部进内存索引（builtin 标记：不写 localStorage、可单删） */
  Object.keys(DEFAULT_STOCKS).forEach(c=>{ s[c]={rows:DEFAULT_STOCKS[c].rows,builtin:true}; });
  DEFAULT_HOLDINGS.forEach(h=>{ if(DEFAULT_STOCKS[h.code] && !s[h.code]) s[h.code]={rows:DEFAULT_STOCKS[h.code].rows,builtin:true}; });
  /* 三大指数：仅用于大盘趋势计算，不进持仓清单 */
  if(typeof DEFAULT_INDEX!=="undefined"){
    const IDXN={ "000001":"上证指数","399001":"深证成指","399006":"创业板指" };
    Object.keys(DEFAULT_INDEX).forEach(c=>{ s[c]={rows:DEFAULT_INDEX[c],name:IDXN[c]||c,code:c,isIndex:true}; });
  }
  return s;
}
function defaultSectors(){
  return (DEFAULT_SNAPSHOT.hot||[]).slice(0,5).map(x=>({
    name:x.name, chg:(x.chg==null?"":x.chg), logic:"资金",
    leader:x.leader||"", mid:"", low:"", days:"", note:(x.kind==="concept"?"概念板块":"行业板块")
  }));
}
function defaultState(){
  const snap=DEFAULT_SNAPSHOT.index||{};
  return {
    holdings:DEFAULT_HOLDINGS.map(h=>({...h})),
    market:{
      sh_close:snap.sh_close, sh_chg:snap.sh_chg, sh_amt:snap.sh_amt, sh_amtd:snap.sh_amtd,
      sz_close:snap.sz_close, sz_chg:snap.sz_chg, sz_amt:snap.sz_amt, sz_amtd:snap.sz_amtd,
      cy_close:snap.cy_close, cy_chg:snap.cy_chg, cy_amt:snap.cy_amt, cy_amtd:snap.cy_amtd
    },
    breadth:{}, vol_note:"", sections:{},
    sectors:defaultSectors(),
    stocks:buildDefaultStocks(),
    snap:JSON.parse(JSON.stringify({hot:DEFAULT_SNAPSHOT.hot||[],money:DEFAULT_SNAPSHOT.money||[]})),
    risk:{}
  };
}
function loadState(){
  try{
    const s=JSON.parse(localStorage.getItem(LS_KEY));
    if(s&&s.holdings){
      s.stocks=s.stocks||{};
      /* 内置公开行情快照全部并入内存索引（builtin 标记，不入 localStorage） */
      if(typeof DEFAULT_STOCKS!=="undefined"){
        Object.keys(DEFAULT_STOCKS).forEach(c=>{
          const d=s.stocks[c];
          if(!d||!d.rows||d.rows.length<2)s.stocks[c]={rows:DEFAULT_STOCKS[c].rows,builtin:true};
        });
      }
      DEFAULT_HOLDINGS.forEach(h=>{const d=s.stocks[h.code];if(!d||!d.rows||d.rows.length<2)s.stocks[h.code]={rows:(DEFAULT_STOCKS[h.code]||{}).rows||[],builtin:true};});
      if(typeof DEFAULT_INDEX!=="undefined"){
        const IDXN={"000001":"上证指数","399001":"深证成指","399006":"创业板指"};
        Object.keys(DEFAULT_INDEX).forEach(c=>{
          const d=s.stocks[c];
          if(!d||!d.rows||d.rows.length<2)s.stocks[c]={rows:DEFAULT_INDEX[c],name:IDXN[c]||c,code:c,isIndex:true};
        });
      }
      s.sectors=s.sectors||defaultSectors();
      s.snap=s.snap||JSON.parse(JSON.stringify({hot:DEFAULT_SNAPSHOT.hot||[],money:DEFAULT_SNAPSHOT.money||[]}));
      s.market=Object.assign({},defaultState().market,s.market||{});
      s.breadth=s.breadth||{};
      return s;
    }
  }catch(e){}
  return defaultState();
}
function saveState(){
  try{
    /* 内置行情（builtin）不重复写盘，只存用户自己拉取的数据 */
    const st={};
    Object.keys(state.stocks||{}).forEach(c=>{ if(!state.stocks[c].builtin) st[c]=state.stocks[c]; });
    const out=Object.assign({},state,{stocks:st});
    localStorage.setItem(LS_KEY,JSON.stringify(out));
  }catch(e){}
}
let state=loadState();

/* ---------- 分析缓存 ---------- */
var AN_CACHE={};
function nameOf(code){
  const h=(state.holdings||[]).find(x=>x.code===code);
  if(h)return h.name;
  return code;
}
function getAn(code){
  if(AN_CACHE[code])return AN_CACHE[code];
  const stk=state.stocks[code];
  if(!stk||!stk.rows||stk.rows.length<8)return null;
  const an=analyzeStock({rows:stk.rows,name:nameOf(code),code:code});
  if(an&&an.err)return null;
  AN_CACHE[code]=an;return an;
}
function clearAn(code){ if(code)delete AN_CACHE[code]; else AN_CACHE={}; }

/* ---------- tab ---------- */
function tab(id){
  document.querySelectorAll("nav button").forEach(b=>b.classList.toggle("active",b.dataset.tab===id));
  document.querySelectorAll("main section").forEach(s=>s.classList.toggle("on",s.id===id));
  if(id==="dash")renderDash();
  if(id==="stock"&&!$("stockCode").value&&(state.holdings[0]))pickStock(state.holdings[0].code);
  if(id==="report")genReport();
  if(id==="market"){renderMarket();}
  try{ if(window&&typeof window.scrollTo==="function")window.scrollTo({top:0,behavior:"smooth"}); }catch(e){}
}

/* ---------- 头部状态 ---------- */
function renderHeader(){
  const m=state.market||{}, b=state.breadth||{};
  const pcs=(v)=>v==null||v===""?'<span class="muted">—</span>':'<b class="'+(num(v)>=0?"up":"down")+'">'+pct(v)+'</b>';
  let h='<span class="pill">数据快照 <b>'+SNAPSHOT_DATE+'</b></span>';
  h+='<span class="pill '+((num(m.sh_chg)||0)>=0?"up":"down")+'">上证 <b>'+(m.sh_close!=null?f2(m.sh_close):"—")+'</b> '+pcs(m.sh_chg)+'</span>';
  h+='<span class="pill '+((num(m.cy_chg)||0)>=0?"up":"down")+'">创业板 <b>'+(m.cy_close!=null?f2(m.cy_close):"—")+'</b> '+pcs(m.cy_chg)+'</span>';
  if(b.up!=null&&b.up!=="")h+='<span class="pill">涨跌 <b class="up">'+b.up+'</b>/<b class="down">'+b.dn+'</b></span>';
  else h+='<span class="pill">涨跌家数 <b>待刷新</b></span>';
  h+='<span class="pill">持仓 <b>'+state.holdings.length+'</b> 只</span>';
  $("hstat").innerHTML=h;
  ["snapDateTxt","snapDateTxt2","footDate"].forEach(id=>{const e=$(id);if(e)e.textContent=SNAPSHOT_DATE;});
}

/* ---------- 大盘环境 ---------- */
function renderMarket(){
  const m=state.market||{};
  const card=(nm,c,chg,amt,amtd)=>{
    const u=(num(chg)||0)>=0;
    return '<div class="kpi '+(u?"up":"down")+'">'
      +'<div class="lb">'+nm+'</div><div class="vl">'+f2(c)+'</div>'
      +'<div class="ex"><b class="'+(u?"up":"down")+'">'+pct(chg)+'</b> · 成交额 '+(amt!=null?f2(amt)+'亿':'数据缺失')
      +(amtd!=null?'（环比 '+pct(amtd)+'）':'')+'</div></div>';
  };
  $("idxCards").innerHTML=
    card("上证指数",m.sh_close,m.sh_chg,m.sh_amt,m.sh_amtd)
   +card("深证成指",m.sz_close,m.sz_chg,m.sz_amt,m.sz_amtd)
   +card("创业板指",m.cy_close,m.cy_chg,m.cy_amt,m.cy_amtd);
  const b=state.breadth||{};
  ["up","dn","zt","dt","zb","amt"].forEach(k=>{const e=$("b_"+k);if(e&&b[k]!=null)e.value=b[k];});
  const vn=$("vol_note"); if(vn&&state.vol_note)vn.value=state.vol_note;
  renderIdxMa();
  renderIdxChart();
  renderBreadthBar();
  renderSnapshot();
  renderSectorMap();
  renderMarketAi();
}
function renderIdxMa(){
  const tb=$("idxMaTbl"); if(!tb)return;
  const idxs=[["000001","上证指数"],["399001","深证成指"],["399006","创业板指"]];
  let h="";
  idxs.forEach(([cd,nm])=>{
    const an=getAn(cd);
    if(!an){ h+='<tr><td>'+nm+'</td><td colspan="4" class="muted">未载入指数K线（可在个股诊断粘贴后用"载入"自动回填）</td></tr>'; return; }
    const i=an.i;
    const pos=[];
    [[an.ma5,"MA5"],[an.ma20,"MA20"],[an.ma60,"MA60"]].forEach(([ma,n])=>{
      if(!nn(ma[i])){pos.push(n+"缺失");return;}
      pos.push(n+(an.close>ma[i]?"上方":"下方"));
    });
    h+='<tr><td>'+nm+'</td><td class="num">'+f2(an.ma5[i])+'</td><td class="num">'+f2(an.ma20[i])+'</td>'
      +'<td class="num">'+f2(an.ma60[i])+'</td><td><span class="chip '+((an.close>an.ma20[i])?"up":"down")+'">'+pos.join(" · ")+'</span></td></tr>';
  });
  tb.innerHTML=h;
}
function renderBreadthBar(){
  const el=$("breadthBar"); if(!el||typeof echarts==="undefined")return;
  const b=state.breadth||{};
  const up=num(b.up)||0, dn=num(b.dn)||0, zt=num(b.zt)||0, dt=num(b.dt)||0, zb=num(b.zb)||0;
  if(!up&&!dn){ el.innerHTML='<div class="empty">涨跌家数：数据缺失 — 点顶部「↻ 刷新行情」获取</div>'; if(el._c){el._c.dispose();el._c=null;} return; }
  if(!el._c)el._c=echarts.init(el);
  el._c.setOption({
    grid:{left:8,right:8,top:26,bottom:8,containLabel:true},
    tooltip:{trigger:"axis",axisPointer:{type:"shadow"},
      backgroundColor:"rgba(19,26,37,.96)",borderColor:"#263145",textStyle:{color:"#e8eef7",fontSize:12}},
    xAxis:{type:"category",data:["上涨","下跌","涨停","跌停","炸板"],axisLine:{lineStyle:{color:"#31405a"}},axisLabel:{color:"#93a1b8"}},
    yAxis:{type:"value",splitLine:{lineStyle:{color:"rgba(38,49,69,.6)"}},axisLabel:{color:"#93a1b8"}},
    series:[{type:"bar",barWidth:"46%",
      data:[{value:up,itemStyle:{color:UP}},{value:dn,itemStyle:{color:DOWN}},
            {value:zt,itemStyle:{color:"#ff8a5c"}},{value:dt,itemStyle:{color:"#16a34a"}},
            {value:zb,itemStyle:{color:WARN}}],
      label:{show:true,position:"top",color:"#c7d3e3",fontSize:11}}]
  },true);
}
function renderSnapshot(){
  const box=$("snapBox"); if(!box)return;
  const s=state.snap||{};
  const tbl=(title,rows,cols)=>{
    let h='<div><h4 style="font-size:13px;margin-bottom:8px;color:var(--muted)">'+title+'</h4><table><thead><tr>'
      +cols.map(c=>'<th'+(c.right?' class="num"':'')+'>'+c.t+'</th>').join("")+'</tr></thead><tbody>';
    if(!rows.length)h+='<tr><td colspan="'+cols.length+'" class="muted">数据缺失</td></tr>';
    rows.forEach(r=>{ h+='<tr>'+cols.map(c=>'<td'+(c.right?' class="num"':'')+'>'+c.f(r)+'</td>').join("")+'</tr>'; });
    return h+'</tbody></table></div>';
  };
  box.innerHTML=
    tbl("热门领涨板块（快照）",(s.hot||[]).slice(0,8),[
      {t:"板块",f:r=>esc(r.name)+(r.kind==="concept"?' <span class="chip neu">概念</span>':'')},
      {t:"涨跌幅",right:1,f:r=>'<b class="'+((num(r.chg)||0)>=0?"up":"down")+'">'+pct(r.chg)+'</b>'},
      {t:"领涨股",f:r=>esc(r.leader||"—")}
    ])
   +tbl("主力净流入行业（快照）",(s.money||[]).slice(0,8),[
      {t:"行业",f:r=>esc(r.name)},
      {t:"净流入(亿)",right:1,f:r=>'<b class="'+((num(r.net)||0)>=0?"up":"down")+'">'+(r.net==null?"—":(num(r.net)>0?"+":"")+f2(r.net))+'</b>'},
      {t:"涨跌幅",right:1,f:r=>'<span class="'+((num(r.chg)||0)>=0?"up":"down")+'">'+pct(r.chg)+'</span>'},
      {t:"近5日净额(亿)",right:1,f:r=>'<span class="'+((num(r.days5)||0)>=0?"up":"down")+'">'+(r.days5==null?"—":(num(r.days5)>0?"+":"")+f2(r.days5))+'</span>'}
    ]);
  const j=$("snapJson"); if(j&&!j.value&&!j._touched){
    j.value=JSON.stringify({hot:(s.hot||[]).slice(0,5),money:(s.money||[]).slice(0,5)},null,1);
  }
}

/* ---------- 板块轮动 ---------- */
function renderSectors(){
  const box=$("sectorBox"); if(!box)return;
  let h='<table><thead><tr><th style="width:150px">板块</th><th style="width:100px">涨跌幅%</th><th style="width:110px">驱动逻辑</th>'
       +'<th>龙头</th><th>中军跟风</th><th>低位补涨</th><th style="width:80px">连续天数</th><th style="width:60px"></th></tr></thead><tbody>';
  (state.sectors||[]).forEach((s,idx)=>{
    h+='<tr>'
     +'<td><input data-s="'+idx+'" data-k="name" value="'+esc(s.name)+'" placeholder="板块名"></td>'
     +'<td><input data-s="'+idx+'" data-k="chg" value="'+esc(s.chg)+'" placeholder="如 4.44"></td>'
     +'<td><select data-s="'+idx+'" data-k="logic">'
       +["政策","业绩","事件","资金"].map(o=>'<option'+(s.logic===o?" selected":"")+'>'+o+'</option>').join("")+'</select></td>'
     +'<td><input data-s="'+idx+'" data-k="leader" value="'+esc(s.leader||"")+'" placeholder="龙头股"></td>'
     +'<td><input data-s="'+idx+'" data-k="mid" value="'+esc(s.mid||"")+'" placeholder="中军"></td>'
     +'<td><input data-s="'+idx+'" data-k="low" value="'+esc(s.low||"")+'" placeholder="补涨"></td>'
     +'<td><input data-s="'+idx+'" data-k="days" value="'+esc(s.days||"")+'" placeholder="如 3"></td>'
     +'<td><button class="btn sm danger" data-del="'+idx+'">删</button></td></tr>';
  });
  h+='</tbody></table>';
  box.innerHTML=h;
  box.querySelectorAll("input,select").forEach(el=>{
    el.onchange=()=>{
      const i=+el.dataset.s,k=el.dataset.k;
      state.sectors[i][k]=el.value;saveState();
      if(k==="chg")renderSectorVerdict();
      renderSectorVerdict();
    };
  });
  box.querySelectorAll("[data-del]").forEach(btn=>{
    btn.onclick=()=>{state.sectors.splice(+btn.dataset.del,1);saveState();renderSectors();};
  });
  renderSectorVerdict();
}
function renderSectorVerdict(){
  const el=$("sectorVerdict"); if(!el)return;
  const ss=(state.sectors||[]).filter(s=>s.name);
  if(!ss.length){el.innerHTML='<div class="empty">尚未填写板块数据</div>';return;}
  const money=(state.snap&&state.snap.money)||[];
  const netMap={};money.forEach(m=>netMap[m.name]=num(m.net));
  const d5Map={};money.forEach(m=>d5Map[m.name]=num(m.days5));
  let h='<table><thead><tr><th>板块</th><th class="num">涨幅</th><th>驱动</th><th class="num">主力净额(亿)</th>'
       +'<th class="num">近5日(亿)</th><th>资金持续性</th><th>梯队完整性</th><th>判定</th></tr></thead><tbody>';
  ss.forEach(s=>{
    const net=netMap[s.name], d5=d5Map[s.name];
    let cont='<span class="muted">数据缺失</span>';
    if(net!=null&&d5!=null) cont = (net>0&&d5>0)?'<span class="chip up">连续净流入</span>'
      :(net>0&&d5<0)?'<span class="chip warn">今日回流/5日净出</span>'
      :(net<0&&d5<0)?'<span class="chip down">持续净流出</span>':'<span class="chip warn">今日流出/5日净入</span>';
    else if(net!=null) cont = net>0?'<span class="chip up">今日净流入</span>':'<span class="chip down">今日净流出</span>';
    const ladder=[s.leader,s.mid,s.low].filter(x=>x).length;
    const lad = ladder>=3?'<span class="chip up">完整（龙头+中军+补涨）</span>':(ladder===2?'<span class="chip warn">部分（'+ladder+'/3）</span>':'<span class="chip down">不完整（仅'+ladder+'/3）</span>');
    const days=num(s.days)||0;
    const judge = (days>=3&&ladder>=2)?'<span class="chip up">主线（连续'+days+'天）</span>':(days>=2?'<span class="chip acc">疑似主线</span>':'<span class="chip neu">轮动/首日</span>');
    h+='<tr><td><b>'+esc(s.name)+'</b></td><td class="num"><b class="'+((num(s.chg)||0)>=0?"up":"down")+'">'+pct(s.chg)+'</b></td>'
      +'<td><span class="chip neu">'+esc(s.logic)+'</span></td><td class="num">'+(net==null?"—":'<b class="'+(net>=0?"up":"down")+'">'+(net>0?"+":"")+f2(net)+'</b>')+'</td>'
      +'<td class="num">'+(d5==null?"—":'<span class="'+(d5>=0?"up":"down")+'">'+(d5>0?"+":"")+f2(d5)+'</span>')+'</td>'
      +'<td>'+cont+'</td><td>'+lad+'</td><td>'+judge+'</td></tr>';
  });
  h+='</tbody></table>';
  const sorted=[...ss].sort((a,b)=>(num(b.chg)||0)-(num(a.chg)||0));
  const top=sorted[0];
  const noLeader=ss.filter(s=>!s.leader).length;
  h+='<div class="banner '+(noLeader>ss.length/2?"":"info")+'" style="margin-top:12px">'
    +'梯队评估：当前 '+ss.length+' 个板块中，<b>'+(ss.length-noLeader)+'</b> 个已标注龙头；'
    +(top?'领涨为 <b>'+esc(top.name)+'（'+pct(top.chg)+'）</b>。':'')
    +(noLeader>ss.length/2?'　⚠ 超半数板块缺龙头/中军标注，梯队完整性判断依据不足，标注"数据缺失"。':'')
    +'　说明：主线判定 = 连续天数≥3 且梯队要素≥2 项；否则归为轮动。</div>';
  el.innerHTML=h;
}

/* ---------- 持仓管理 ---------- */
function renderHoldings(){
  const box=$("holdList"); if(!box)return;
  let h='<table><thead><tr><th style="width:52px">纳入</th><th style="width:110px">代码</th><th>名称</th><th style="width:90px">类型</th>'
       +'<th class="num">最新</th><th class="num">涨跌</th><th class="num">评分</th><th>技术评级</th><th>K线</th><th style="width:60px"></th></tr></thead><tbody>';
  state.holdings.forEach((hd,idx)=>{
    const an=getAn(hd.code);
    const cls=(v)=>(num(v)||0)>=0?"up":"down";
    h+='<tr>'
     +'<td><input type="checkbox" data-hi="'+idx+'" data-k="inReport"'+(hd.inReport?" checked":"")+' style="width:auto"></td>'
     +'<td><input data-hi="'+idx+'" data-k="code" value="'+esc(hd.code)+'" class="mono"></td>'
     +'<td><input data-hi="'+idx+'" data-k="name" value="'+esc(hd.name)+'"></td>'
     +'<td><select data-hi="'+idx+'" data-k="type">'+["A","ETF","IDX"].map(o=>'<option'+(hd.type===o?" selected":"")+'>'+o+'</option>').join("")+'</select></td>'
     +'<td class="num">'+(an?f2(an.close):'<span class="muted">无数据</span>')+'</td>'
     +'<td class="num '+(an?cls(an.chg):"")+'">'+(an?pct(an.chg):"—")+'</td>'
     +'<td class="num">'+(an?'<b>'+an.score.total+'</b>':'—')+'</td>'
     +'<td>'+(an?'<span class="chip '+an.score.tone+'">'+an.score.label+'</span> <span class="muted" style="font-size:11.5px">'+esc(an.arrange)+'</span>':'<span class="muted">—</span>')+'</td>'
     +'<td class="muted">'+(state.stocks[hd.code]&&state.stocks[hd.code].rows?state.stocks[hd.code].rows.length+' 根':'0')+'</td>'
     +'<td><button class="btn sm danger" data-hdel="'+idx+'">删</button></td></tr>';
  });
  h+='</tbody></table>';
  box.innerHTML=h;
  box.querySelectorAll("input,select").forEach(el=>{
    el.onchange=()=>{
      const i=+el.dataset.hi,k=el.dataset.k;
      if(el.type==="checkbox")state.holdings[i][k]=el.checked; else state.holdings[i][k]=el.value;
      saveState();renderHoldings();renderRail();renderDash();
    };
  });
  box.querySelectorAll("[data-hdel]").forEach(b=>{
    b.onclick=()=>{state.holdings.splice(+b.dataset.hdel,1);saveState();renderHoldings();renderRail();renderDash();};
  });
  $("railCount").textContent=state.holdings.length+" 只";
}

/* ---------- 左侧 rail ---------- */
function renderRail(){
  const box=$("railList"); if(!box)return;
  const q=($("railSearch")&&$("railSearch").value||"").trim().toLowerCase();
  let h="";
  state.holdings.forEach(hd=>{
    if(q&&(hd.code+hd.name).toLowerCase().indexOf(q)<0)return;
    const an=getAn(hd.code);
    const on=(CUR.code===hd.code)?" on":"";
    h+='<div class="it'+on+'" data-c="'+esc(hd.code)+'">'
     +'<div><div class="nm">'+esc(hd.name)+'</div><div class="cd">'+esc(hd.code)+'</div></div>'
     +'<div class="rt">'+(an
        ?'<div class="px '+(num(an.chg)>=0?"up":"down")+'">'+f2(an.close)+'</div>'
         +'<div class="cg '+(num(an.chg)>=0?"up":"down")+'">'+pct(an.chg)+'</div>'
         +'<div class="cg"><span class="chip '+an.score.tone+'" style="font-size:10px;padding:1px 6px">'+an.score.total+'</span></div>'
        :'<div class="cg muted">无数据</div>')+'</div></div>';
  });
  box.innerHTML=h||'<div class="empty">无匹配标的</div>';
  box.querySelectorAll(".it").forEach(it=>{it.onclick=()=>pickStock(it.dataset.c);});
}

/* ---------- 选中标的 ---------- */
var CUR={code:null,an:null,period:"daily",main:"both",sub:"macd",span:60};
function pickStock(code){
  CUR.code=code;
  const hd=state.holdings.find(h=>h.code===code);
  $("stockCode").value=code;
  $("stockName").value=hd?hd.name:"";
  $("stockRaw").value="";
  loadCurrent();
  renderRail();
}
function loadCurrent(){
  const code=($("stockCode").value||"").trim();
  const name=($("stockName").value||"").trim()||nameOf(code);
  const raw=($("stockRaw").value||"").trim();
  if(raw){
    const rows=parseOhlc(raw);
    if(rows.length<8){alert("解析到 "+rows.length+" 行K线，至少需要 8 行。请检查格式：日期,开,高,低,收,量");return;}
    state.stocks[code]={rows};
    saveState();clearAn(code);
  }
  const stk=state.stocks[code];
  if(!stk||!stk.rows){alert("该代码无数据：请粘贴K线或点「联网拉取」");return;}
  const an=analyzeStock({rows:stk.rows,name,code});
  if(an.err){alert(an.err);return;}
  AN_CACHE[code]=an;
  CUR.code=code;CUR.an=an;
  renderDiag(an);
}
function parseOhlc(text){
  const out=[];
  text.split(/\r?\n/).forEach(line=>{
    const t=line.trim(); if(!t||t.startsWith("#"))return;
    const p=t.split(/[,\t; ]+/);
    if(p.length<6)return;
    const o=num(p[1]),h=num(p[2]),l=num(p[3]),c=num(p[4]),v=num(p[5]);
    if([o,h,l,c].some(x=>x==null))return;
    out.push([p[0],o,h,l,c,v==null?0:v,p.length>6?num(p[6]):null]);
  });
  return out;
}

/* ---------- 个股诊断渲染 ---------- */
function renderDiag(an){
  const code=an.code,name=an.name||nameOf(an.code);
  $("diagTitle").textContent=name+"（"+code+"）";
  const chg=an.chg;
  $("diagTags").innerHTML=
    '<span class="chip '+((num(chg)||0)>=0?"up":"down")+' big">'+f2(an.close)+'　'+pct(chg)+'</span>'
   +'<span class="chip '+(an.score.tone)+' big">评分 '+an.score.total+' · '+an.score.label+'</span>'
   +'<span class="chip '+(an.arrange.indexOf("多头")>=0?"up":(an.arrange.indexOf("空头")>=0?"down":"neu"))+' big">'+esc(an.arrange)+'</span>'
   +'<span class="chip acc big">'+(an.wk&&an.wk.ok?esc(an.wk.arrange):"周线数据不足")+'</span>';

  const kpi=(lb,vl,ex,clss)=>'<div class="kpi '+(clss||"")+'"><div class="lb">'+lb+'</div><div class="vl">'+vl+'</div><div class="ex">'+ex+'</div></div>';
  const rsiTone=!nn(an.rsiV)?"":(an.rsiV>=70?"up":(an.rsiV<=30?"down":""));
  const vrTone=!nn(an.vr)?"":(an.vr>1.5?"up":(an.vr<0.7?"down":""));
  $("diagKpi").innerHTML=
     kpi("最新收盘",f2(an.close),(an.dateLast||an.dates[an.i])+"　"+pct(chg),((num(chg)||0)>=0?"up":"down"))
    +kpi("RSI(14)",!nn(an.rsiV)?"—":f1(an.rsiV),esc(an.rsiZone),rsiTone)
    +kpi("量比（5日）",!nn(an.vr)?"—":an.vr.toFixed(2),nn(an.vr)?(an.vr>1.5?"明显放量":an.vr<0.7?"明显缩量":"常态"):"数据缺失",vrTone)
    +kpi("技术评分",an.score.total,an.score.label+"｜近120日自身分位 "+(an.scorePct==null?"数据不足":an.scorePct+"%"),an.score.tone);

  const chips=[];
  chips.push('<span class="chip acc">MACD '+(nn(an.bar[an.i])?(an.bar[an.i]>=0?"红柱":"绿柱"):"—")+'</span>');
  if(nn(an.ma20[an.i]))chips.push('<span class="chip '+(an.close>an.ma20[an.i]?"up":"down")+'">MA20 '+f2(an.ma20[an.i])+'</span>');
  if(nn(an.ma60[an.i]))chips.push('<span class="chip '+(an.close>an.ma60[an.i]?"up":"down")+'">MA60 '+f2(an.ma60[an.i])+'</span>');
  if(nn(an.bl.up[an.i])&&nn(an.bl.lo[an.i])){
    const p=(an.close-an.bl.lo[an.i])/(an.bl.up[an.i]-an.bl.lo[an.i])*100;
    chips.push('<span class="chip neu">BOLL位置 '+p.toFixed(0)+'%</span>');
  }
  if(an.bw&&nn(an.bw.bw))chips.push('<span class="chip '+(an.bw.state.indexOf("收敛")>=0?"warn":"neu")+'">带宽 '+an.bw.bw.toFixed(1)+'% '+esc(an.bw.state)+'</span>');
  if(an.chan)chips.push('<span class="chip '+(an.chan.slope>0?"up":(an.chan.slope<0?"down":"neu"))+'">'+esc(an.chan.dir)+'</span>');
  (an.pats||[]).slice(-3).forEach(p=>chips.push('<span class="chip '+(p.side==="b"?"up":(p.side==="s"?"down":"neu"))+'">'+esc(p.nm)+'</span>'));
  const recentSig=(an.sigs||[]).filter(s=>s.i>=an.i-5);
  recentSig.slice(0,4).forEach(s=>chips.push('<span class="chip '+(s.side==="b"?"up":(s.side==="s"?"down":"neu"))+'">'+esc(s.nm)+'</span>'));
  $("diagChips").innerHTML=chips.join("");

  /* 三周期 */
  $("tfBox").innerHTML=(an.tf||[]).map(t=>
    '<div class="vcard"><div class="hd"><span class="tf">'+t.tf+'</span>'
    +'<span class="chip '+t.tone+' big">'+t.label+'</span></div>'
    +'<div class="bd">'+t.ev.map(e=>"· "+esc(e)).join("<br>")+'</div></div>').join("");

  /* 指标明细 */
  const kv=(k,v)=>'<div class="k"><span>'+k+'</span><b>'+v+'</b></div>';
  $("diagKv").innerHTML=
     kv("均线排列",esc(an.arrange))
    +kv("MA5 / MA10",f2(an.ma5[an.i])+" / "+f2(an.ma10[an.i]))
    +kv("MA20 / MA60",f2(an.ma20[an.i])+" / "+f2(an.ma60[an.i]))
    +kv("MACD DIF / DEA",f2(an.dif[an.i])+" / "+f2(an.dea[an.i]))
    +kv("MACD 柱",f2(an.bar[an.i]))
    +kv("RSI(14) / RSI(6)",f1(an.rsiV)+" / "+f1(an.r6[an.i]))
    +kv("KDJ K/D/J",f2(an.K[an.i])+" / "+f2(an.D[an.i])+" / "+f2(an.J[an.i]))
    +kv("BOLL 上/中/下",f2(an.bl.up[an.i])+" / "+f2(an.bl.mid[an.i])+" / "+f2(an.bl.lo[an.i]))
    +kv("布林带宽",(an.bw&&nn(an.bw.bw))?an.bw.bw.toFixed(2)+"%（"+esc(an.bw.state)+"）":"数据缺失")
    +kv("MA5-MA20 发散",(an.ms&&nn(an.ms.s1))?(an.ms.s1>0?"+":"")+an.ms.s1.toFixed(2)+"%":"数据缺失")
    +kv("量比（5日）",!nn(an.vr)?"数据缺失":an.vr.toFixed(2))
    +kv("换手率",nn(an.lastTurn)?an.lastTurn.toFixed(2)+"%":"日K未含换手字段")
    +kv("近20日高/低",f2(an.hl20.hi)+" / "+f2(an.hl20.lo))
    +kv("近60日高/低",f2(an.hl60.hi)+" / "+f2(an.hl60.lo))
    +kv("密集成交区 POC",nn(an.poc.poc)?f2(an.poc.poc):"数据缺失")
    +kv("ATR(14)",nn(an.atr[an.i])?f2(an.atr[an.i]):"数据缺失")
    +kv("支撑位",an.sup.map(f2).join(" / ")||"数据缺失")
    +kv("压力位",an.res.map(f2).join(" / ")||"数据缺失")
    +kv("背离检测",'<span style="font-size:11.5px">'+esc(an.diver)+'</span>');

  /* 序列 */
  let sh='<table><thead><tr><th>日期</th><th class="num">开</th><th class="num">高</th><th class="num">低</th><th class="num">收</th>'
        +'<th class="num">涨跌%</th><th class="num">量(万手)</th><th class="num">MA5</th><th class="num">MA20</th>'
        +'<th class="num">DIF</th><th class="num">DEA</th><th class="num">柱</th><th class="num">RSI</th><th class="num">K</th><th class="num">D</th><th class="num">J</th><th>信号</th></tr></thead><tbody>';
  const sigByDay={};
  (an.sigs||[]).forEach(s=>{ (sigByDay[s.date]=sigByDay[s.date]||[]).push(s); });
  for(let k=an.i-7;k<=an.i;k++){
    if(k<0)continue;
    const pc=an.closes[k-1]?((an.closes[k]-an.closes[k-1])/an.closes[k-1]*100):null;
    const sg=(sigByDay[an.dates[k]]||[]).map(s=>'<span class="chip '+(s.side==="b"?"up":(s.side==="s"?"down":"neu"))+'" style="font-size:10px">'+esc(s.nm)+'</span>').join(" ");
    sh+='<tr><td class="mono">'+esc(an.dates[k])+'</td>'
      +'<td class="num">'+f2(an.opens[k])+'</td><td class="num">'+f2(an.highs[k])+'</td>'
      +'<td class="num">'+f2(an.lows[k])+'</td><td class="num"><b class="'+(pc>=0?"up":"down")+'">'+f2(an.closes[k])+'</b></td>'
      +'<td class="num '+(pc>=0?"up":"down")+'">'+pct(pc)+'</td>'
      +'<td class="num">'+(an.vols[k]!=null?(an.vols[k]/1e4).toFixed(1):"—")+'</td>'
      +'<td class="num">'+f2(an.ma5[k])+'</td><td class="num">'+f2(an.ma20[k])+'</td>'
      +'<td class="num">'+f2(an.dif[k])+'</td><td class="num">'+f2(an.dea[k])+'</td>'
      +'<td class="num '+(an.bar[k]>=0?"up":"down")+'">'+f2(an.bar[k])+'</td>'
      +'<td class="num">'+f1(an.r[k])+'</td><td class="num">'+f2(an.K[k])+'</td><td class="num">'+f2(an.D[k])+'</td><td class="num">'+f2(an.J[k])+'</td>'
      +'<td>'+(sg||"—")+'</td></tr>';
  }
  sh+='</tbody></table>';
  $("diagSeries").innerHTML=sh;

  /* 信号列表 */
  let sigs=(an.sigs||[]).filter(s=>s.i>=an.i-40);
  if(sigs.length>14)sigs=sigs.filter(s=>s.st>=2).concat(sigs.filter(s=>s.st<2).slice(0,3)).slice(0,14);
  sigs=sigs.slice(0,14);
  $("sigList").innerHTML=sigs.length?sigs.map(s=>
    '<div class="sig '+(s.side==="b"?"b":(s.side==="s"?"s":"n"))+'">'
    +'<div class="ic">'+(s.side==="b"?"▲":(s.side==="s"?"▼":"●"))+'</div>'
    +'<div class="bd"><div class="t1">'+esc(s.nm)+'　<span class="muted" style="font-weight:400">'+esc(s.date)+'　'+f2(s.price)+'</span>'
    +(s.st>=2?'　<span class="chip up" style="font-size:10px">强</span>':'')+'</div>'
    +'<div class="t2">'+esc(s.ds)+'</div></div></div>').join("")
    :'<div class="empty">近 40 日无技术信号</div>';

  ["diagHead","klineCard","tfCard","detailCard","aiCard","stockAlertCard","stockActionCard"].forEach(id=>{$(id).style.display="";});
  renderAi(an);
  if(typeof renderStockAlerts === "function") renderStockAlerts(an.code);
  renderRadar(an);
  renderScoreTrend(an);
  drawKline();
}

/* ---------- AI 技术研判（个股） ---------- */
function renderAi(an){
  const box=$("aiBox"); if(!box)return;
  const r=aiStock(an);
  const toneCls=(v)=>v>=56?"up":(v>=44?"neu":"down");
  const barColor=(t)=>t==="up"?UP:(t==="down"?DOWN:WARN);
  let h='<div class="aiwrap">';
  h+='<div class="aiverdict '+r.tone+'">'
    +'<div class="ai-ico '+(r.tone==="up"?"up":(r.tone==="down"?"down":"warn"))+'">'+r.icon+'</div>'
    +'<div class="ai-main"><div class="ai-title">'+esc(r.title)+'</div>'
    +'<div class="ai-desc">'+r.desc+'</div></div></div>';
  h+='<div class="aigrid">';
  h+='<div class="aibox"><h5>多周期共振度</h5>'
    +'<div style="display:flex;align-items:baseline;gap:8px">'
    +'<span style="font-size:26px;font-weight:700" class="'+toneCls(r.resPct)+'">'+r.resPct+'%</span>'
    +'<span class="muted" style="font-size:12px">技术评分 '+r.score+'</span></div>'
    +'<div class="aibar"><i style="width:'+Math.max(2,r.resPct)+'%;background:'+barColor(toneCls(r.resPct))+'"></i></div>'
    +'<div class="muted" style="font-size:11.5px;margin-top:6px">日线排列 · 周线排列 · 均线位置 · MACD · 量能 · RSI 六维加权</div></div>';
  h+='<div class="aibox"><h5>多头依据</h5><ul>'+r.bulls.map(x=>"<li>"+x+"</li>").join("")+"</ul></div>";
  h+='<div class="aibox"><h5>空头依据</h5><ul>'+r.bears.map(x=>"<li>"+x+"</li>").join("")+"</ul></div>";
  h+='<div class="aibox"><h5>关键位一览</h5><div class="ailv">'
    +r.levels.map(l=>'<div class="row '+l.tone+'"><span class="nm">'+esc(l.nm)+'</span><span class="vv">'+l.vv+"</span></div>").join("")
    +'</div></div>';
  h+='<div class="aibox"><h5>后续观察要点</h5><ul>'+r.watch.map(x=>"<li>"+x+"</li>").join("")+"</ul></div>";
  h+='</div>';
  h+='<div class="airisk"><b>⚠ 风险提示</b><br>'+r.risks.map(x=>"· "+x).join("<br>")+'</div>';
  h+='</div>';
  box.innerHTML=h;
}

/* ---------- 评分走势 ---------- */
function renderScoreTrend(an){
  const el=$("scoreChart"); if(!el||typeof echarts==="undefined")return;
  if(!el._c)el._c=echarts.init(el);
  const h=an.hist||[];
  if(!h.length){el._c.clear();return;}
  const xs=h.map(x=>x.date), vs=h.map(x=>x.v);
  const cur=vs[vs.length-1];
  el._c.setOption({
    grid:{left:34,right:12,top:12,bottom:20},
    tooltip:{trigger:"axis",backgroundColor:"rgba(19,26,37,.96)",borderColor:"#263145",
      textStyle:{color:"#e8eef7",fontSize:11},formatter:p=>p[0].name+"　评分 "+p[0].value},
    xAxis:{type:"category",data:xs,boundaryGap:false,
      axisLine:{lineStyle:{color:"#31405a"}},
      axisLabel:{color:"#6b7a91",fontSize:9,interval:Math.max(1,Math.floor(xs.length/5))}},
    yAxis:{type:"value",min:0,max:100,
      splitLine:{lineStyle:{color:"rgba(38,49,69,.55)"}},
      axisLabel:{color:"#6b7a91",fontSize:9}},
    series:[{
      type:"line",data:vs,smooth:true,showSymbol:false,
      lineStyle:{width:1.8,color:ACC},
      areaStyle:{color:{type:"linear",x:0,y:0,x2:0,y2:1,
        colorStops:[{offset:0,color:"rgba(76,141,255,.34)"},{offset:1,color:"rgba(76,141,255,0)"}]}},
      markLine:{silent:true,symbol:"none",data:[
        {yAxis:60,lineStyle:{color:"rgba(34,197,94,.45)",type:"dashed",width:1},
         label:{formatter:"偏强60",color:"#6ee79f",fontSize:9,position:"insideEndTop"}},
        {yAxis:40,lineStyle:{color:"rgba(255,77,79,.45)",type:"dashed",width:1},
         label:{formatter:"偏弱40",color:"#ff8f8f",fontSize:9,position:"insideEndBottom"}}
      ]}
    }]
  },true);
}

/* ---------- 雷达图 ---------- */
function renderRadar(an){
  const el=$("radarChart"); if(!el||typeof echarts==="undefined")return;
  if(!el._c)el._c=echarts.init(el);
  const d=an.score.dims, cap=an.score.caps;
  const keys=Object.keys(d);
  el._c.setOption({
    tooltip:{backgroundColor:"rgba(19,26,37,.96)",borderColor:"#263145",textStyle:{color:"#e8eef7",fontSize:12},
      formatter:()=>keys.map(k=>k+"："+d[k]+" / "+cap[k]).join("<br>")+"<br><b>总分 "+an.score.total+"（"+an.score.label+"）</b>"},
    radar:{
      indicator:keys.map(k=>{return {name:k,max:cap[k]};}),
      radius:"62%",center:["50%","54%"],
      axisName:{color:"#93a1b8",fontSize:11},
      splitLine:{lineStyle:{color:"rgba(38,49,69,.9)"}},
      splitArea:{areaStyle:{color:["rgba(255,255,255,.015)","rgba(255,255,255,.035)"]}},
      axisLine:{lineStyle:{color:"rgba(38,49,69,.9)"}}
    },
    series:[{type:"radar",symbolSize:5,
      data:[{value:keys.map(k=>d[k]),name:"当前",
        lineStyle:{color:ACC,width:2},itemStyle:{color:ACC},
        areaStyle:{color:"rgba(76,141,255,.22)"}}]}]
  },true);
}

/* ============================================================
   K线图（增强：多空点 / 支撑压力 / 通道 / 副图切换）
   ============================================================ */
function curViewAn(){
  if(!CUR.an)return null;
  if(CUR.period==="weekly"){
    if(!CUR.an._w){
      const wrows=weeklyFromDaily(CUR.an.rows);
      if(wrows.length<10)return CUR.an;
      const w=analyzeStock({rows:wrows.map(r=>[r.date,r.o,r.h,r.l,r.c,r.v]),name:CUR.an.name,code:CUR.an.code});
      if(w&&!w.err){w.wk=CUR.an.wk;w.isWeekly=true;CUR.an._w=w;}
    }
    return CUR.an._w||CUR.an;
  }
  return CUR.an;
}
/* 按可见窗口计算主图 Y 轴量程（含均线/BOLL/通道，避免蜡烛被压扁） */
function klineRange(an,s,e){
  s=Math.max(0,s|0); e=Math.min(an.dates.length-1,e|0);
  if(e<s)e=s;
  /* 第一遍：仅蜡烛高低，作为量程基准 */
  let lo=Infinity,hi=-Infinity;
  for(let k=s;k<=e;k++){
    if(nn(an.lows[k])&&an.lows[k]<lo)lo=an.lows[k];
    if(nn(an.highs[k])&&an.highs[k]>hi)hi=an.highs[k];
  }
  if(!isFinite(lo)||!isFinite(hi)||hi<=lo){ lo=an.close*0.92; hi=an.close*1.08; }
  const baseLo=lo, baseHi=hi;          /* 快照，裁剪判断必须用固定基准 */
  const base=hi-lo;
  /* 第二遍：纳入均线/BOLL，但裁剪在基准 ±25% 内，避免辅助线把蜡烛压扁 */
  const lim=base*0.25;
  const ex=[an.ma5,an.ma10,an.ma20,an.ma60,an.bl.lo,an.bl.up,an.bl.mid];
  for(let k=s;k<=e;k++){
    for(let j=0;j<ex.length;j++){
      const a=ex[j]; if(!a)continue;
      const v=a[k]; if(!nn(v))continue;
      if(v>=baseLo-lim&&v<=baseHi+lim){ if(v<lo)lo=v; if(v>hi)hi=v; }
    }
  }
  if(lo<0&&baseLo>0)lo=Math.max(0,baseLo-base*0.12);   /* 价格不为负 */
  let pad=(hi-lo)*0.05; if(pad<=0)pad=Math.max(0.01,Math.abs(hi)*0.01);
  return {min:+(lo-pad).toFixed(4), max:+(hi+pad).toFixed(4)};
}

function drawKline(){
  const an=curViewAn(); if(!an)return;
  const el=$("klineChart"); if(!el||typeof echarts==="undefined"){
    if(el)el.innerHTML='<div class="empty">图表库 echarts.min.js 未加载（需与 index.html 同目录）</div>';return;}
  if(!el._c)el._c=echarts.init(el);
  const chart=el._c;
  const dates=an.dates, n=dates.length;
  const candle=dates.map((d,k)=>[an.opens[k],an.closes[k],an.lows[k],an.highs[k]]);
  const showSig=$("ckSignal").checked, showLv=$("ckLevel").checked, showCh=$("ckChan").checked;

  /* ---- 主图 series ---- */
  const mpRaw=buildMarkPoint(an);
  const mpData=(showSig&&mpRaw&&mpRaw.data)?mpRaw.data.slice():[];
  /* 最新价标签 */
  mpData.push({coord:[n-1,an.close],value:an.close,symbol:"circle",symbolSize:0,
    label:{show:true,position:"right",distance:8,formatter:f2(an.close),
      backgroundColor:(num(an.chg)||0)>=0?UP:DOWN,borderRadius:3,padding:[3,5],
      color:"#0d1117",fontSize:11,fontWeight:"bold"}});
  /* AI 关键博弈区（POC ± 0.75 ATR） */
  let mkArea=undefined;
  const atrv=nn(an.atr[an.i])?an.atr[an.i]:null;
  if(nn(an.poc.poc)&&atrv!=null){
    mkArea={silent:true,itemStyle:{color:"rgba(227,179,65,.08)"},
      data:[[{yAxis:+(an.poc.poc-atrv*0.75).toFixed(4),
              label:{show:true,position:"insideStartTop",formatter:"AI 博弈区",color:"#e3b341",fontSize:10}},
             {yAxis:+(an.poc.poc+atrv*0.75).toFixed(4)}]]};
  }
  const main=[{
    name:"K线",type:"candlestick",data:candle,
    itemStyle:{color:UP,color0:DOWN,borderColor:"#ff7875",borderColor0:"#4ade80"},
    markPoint:Object.assign({symbolSize:1},mpRaw||{},{data:mpData}),
    markLine: showLv?buildMarkLine(an):undefined,
    markArea: mkArea,
    z:5
  }];
  const showMA=(CUR.main==="ma"||CUR.main==="both");
  const showBOLL=(CUR.main==="boll"||CUR.main==="both");
  if(showMA){
    main.push({name:"MA5",type:"line",data:an.ma5,smooth:true,showSymbol:false,lineStyle:{width:1.2,color:"#58a6ff"},z:3});
    main.push({name:"MA10",type:"line",data:an.ma10,smooth:true,showSymbol:false,lineStyle:{width:1,color:"#79c0ff",opacity:.75},z:3});
    main.push({name:"MA20",type:"line",data:an.ma20,smooth:true,showSymbol:false,lineStyle:{width:1.2,color:"#f5a524"},z:3});
    main.push({name:"MA60",type:"line",data:an.ma60,smooth:true,showSymbol:false,lineStyle:{width:1.4,color:"#a371f7"},z:3});
  }
  if(showBOLL){
    main.push({name:"BOLL上",type:"line",data:an.bl.up,smooth:true,showSymbol:false,lineStyle:{width:1,color:"#5c6b80",opacity:.75},z:2});
    main.push({name:"BOLL中",type:"line",data:an.bl.mid,smooth:true,showSymbol:false,lineStyle:{width:1,color:"#5c6b80",opacity:.6,type:"dashed"},z:2});
    main.push({name:"BOLL下",type:"line",data:an.bl.lo,smooth:true,showSymbol:false,lineStyle:{width:1,color:"#5c6b80",opacity:.75},z:2});
  }
  if(showCh&&an.chan){
    main.push({name:"通道上轨",type:"line",data:an.chan.up,showSymbol:false,lineStyle:{width:1,color:"#ffd166",opacity:.55,type:"dashed"},z:1});
    main.push({name:"通道中轨",type:"line",data:an.chan.mid,showSymbol:false,lineStyle:{width:1,color:"#ffd166",opacity:.35},z:1});
    main.push({name:"通道下轨",type:"line",data:an.chan.lo,showSymbol:false,lineStyle:{width:1,color:"#ffd166",opacity:.55,type:"dashed"},z:1});
  }

  /* ---- 成交量 ---- */
  const volMA5=dates.map((d,k)=>avgVol(an.vols,5,k));
  const volData=dates.map((d,k)=>({value:an.vols[k],itemStyle:{color:(an.closes[k]>=an.opens[k]?"rgba(255,77,79,.65)":"rgba(34,197,94,.6)")}}));
  const volS=[{name:"VOL",type:"bar",xAxisIndex:1,yAxisIndex:1,data:volData},
    {name:"VOL MA5",type:"line",xAxisIndex:1,yAxisIndex:1,data:volMA5,showSymbol:false,lineStyle:{width:1,color:"#f5a524"}}];

  /* ---- 副图 ---- */
  let subS=[],subName="MACD";
  if(CUR.sub==="macd"){
    subName="MACD(12,26,9)";
    subS=[
      {name:"DIF",type:"line",xAxisIndex:2,yAxisIndex:2,data:an.dif,showSymbol:false,lineStyle:{width:1.2,color:"#58a6ff"}},
      {name:"DEA",type:"line",xAxisIndex:2,yAxisIndex:2,data:an.dea,showSymbol:false,lineStyle:{width:1.2,color:"#f5a524"}},
      {name:"MACD",type:"bar",xAxisIndex:2,yAxisIndex:2,
        data:an.bar.map(b=>({value:b,itemStyle:{color:b>=0?"rgba(255,77,79,.8)":"rgba(34,197,94,.75)"}}))}
    ];
  } else if(CUR.sub==="kdj"){
    subName="KDJ(9,3,3)";
    subS=[
      {name:"K",type:"line",xAxisIndex:2,yAxisIndex:2,data:an.K,showSymbol:false,lineStyle:{width:1.2,color:"#58a6ff"}},
      {name:"D",type:"line",xAxisIndex:2,yAxisIndex:2,data:an.D,showSymbol:false,lineStyle:{width:1.2,color:"#f5a524"}},
      {name:"J",type:"line",xAxisIndex:2,yAxisIndex:2,data:an.J,showSymbol:false,lineStyle:{width:1,color:"#a371f7"}}
    ];
  } else {
    subName="RSI(6/14)";
    subS=[
      {name:"RSI6",type:"line",xAxisIndex:2,yAxisIndex:2,data:an.r6,showSymbol:false,lineStyle:{width:1.2,color:"#58a6ff"}},
      {name:"RSI14",type:"line",xAxisIndex:2,yAxisIndex:2,data:an.r,showSymbol:false,lineStyle:{width:1.2,color:"#f5a524"},
        markLine:{silent:true,symbol:"none",data:[
          {yAxis:70,lineStyle:{color:"rgba(255,77,79,.5)",type:"dashed",width:1},label:{formatter:"超买70",color:"#ff8f8f",fontSize:10,position:"insideEndTop"}},
          {yAxis:30,lineStyle:{color:"rgba(34,197,94,.5)",type:"dashed",width:1},label:{formatter:"超卖30",color:"#6ee79f",fontSize:10,position:"insideEndBottom"}}
        ]}}
    ];
  }

  const span=(CUR.span==null?60:CUR.span);
  const startZoom=(span>0&&n>span)?(100-span*100/n):0;
  const rg=klineRange(an,(span>0?n-span:0),n-1);
  chart.setOption({
    animation:false,
    backgroundColor:"transparent",
    legend:{data:["MA5","MA10","MA20","MA60","BOLL上","BOLL中","BOLL下","通道上轨","通道下轨"],
      top:2,textStyle:{color:"#93a1b8",fontSize:10},itemWidth:14,itemHeight:8,inactiveColor:"#3d4a60"},
    tooltip:{
      trigger:"axis",axisPointer:{type:"cross",lineStyle:{color:"#5c6b80"},crossStyle:{color:"#5c6b80"}},
      backgroundColor:"rgba(19,26,37,.97)",borderColor:"#31405a",borderWidth:1,
      textStyle:{color:"#e8eef7",fontSize:12},
      formatter:function(ps){
        if(!ps||!ps.length)return "";
        const k=ps[0].dataIndex;
        const c=an.closes[k],o=an.opens[k],h=an.highs[k],l=an.lows[k];
        const pc=an.closes[k-1]?((c-an.closes[k-1])/an.closes[k-1]*100):null;
        const v=an.vols[k], vr=an.vrs[k];
        const col=pc==null?"#c7d3e3":(pc>=0?UP:DOWN);
        let s='<div style="font-weight:600;margin-bottom:4px">'+an.dates[k]+(an.isWeekly?' <span style="color:#93a1b8">周</span>':'')+'</div>';
        s+='<div style="color:'+col+'">开 '+f2(o)+'　高 '+f2(h)+'　低 '+f2(l)+'　收 <b>'+f2(c)+'</b>　'+(pc==null?"":(pc>=0?"+":"")+pc.toFixed(2)+"%")+'</div>';
        s+='<div style="color:#93a1b8">量 '+(v!=null?(v/1e4).toFixed(1)+"万手":"—")+(nn(vr)?'　量比 '+vr.toFixed(2):'')+'</div>';
        const row=(nm,a,b,cc)=>{const va=a[k],vb=b[k];return '<div style="color:'+(cc||"#c7d3e3")+'">'+nm+' '+(nn(va)?f2(va):"—")+' / '+(nn(vb)?f2(vb):"—")+'</div>';};
        s+=row("MA5/20",an.ma5,an.ma20,"#79c0ff");
        s+=row("MA10/60",an.ma10,an.ma60,"#a371f7");
        s+=row("DIF/DEA",an.dif,an.dea,"#58a6ff");
        s+='<div>RSI14 '+(nn(an.r[k])?f1(an.r[k]):"—")+'　RSI6 '+(nn(an.r6[k])?f1(an.r6[k]):"—")+'</div>';
        s+='<div>KDJ '+(nn(an.K[k])?f2(an.K[k]):"—")+' / '+(nn(an.D[k])?f2(an.D[k]):"—")+' / '+(nn(an.J[k])?f2(an.J[k]):"—")+'</div>';
        const sg=(an.sigs||[]).filter(x=>x.i===k);
        if(sg.length)s+='<div style="margin-top:4px;border-top:1px solid #31405a;padding-top:4px">'
          +sg.map(x=>'<span style="color:'+(x.side==="b"?UP:(x.side==="s"?DOWN:"#93a1b8"))+'">'
          +(x.side==="b"?"▲ ":"▼ ")+x.nm+(x.st>=2?"（强）":"")+'</span>').join("<br>")+'</div>';
        return s;
      }
    },
    axisPointer:{link:[{xAxisIndex:"all"}]},
    grid:[
      {left:58,right:70,top:26,height:"50%"},
      {left:58,right:70,top:"60.5%",height:"11%"},
      {left:58,right:70,top:"75.5%",height:"16.5%"}
    ],
    xAxis:[
      {type:"category",data:dates,gridIndex:0,axisLine:{lineStyle:{color:"#31405a"}},axisLabel:{show:false},
       splitLine:{show:false},axisPointer:{label:{show:false}}},
      {type:"category",data:dates,gridIndex:1,axisLine:{lineStyle:{color:"#31405a"}},axisLabel:{show:false},
       splitLine:{show:false},axisPointer:{label:{show:false}}},
      {type:"category",data:dates,gridIndex:2,axisLine:{lineStyle:{color:"#31405a"}},
       axisLabel:{color:"#93a1b8",fontSize:10,rotate:0,interval:Math.max(1,Math.floor(n/8))},
       splitLine:{show:false}}
    ],
    yAxis:[
      {scale:true,gridIndex:0,position:"left",min:rg.min,max:rg.max,splitNumber:5,
       splitLine:{lineStyle:{color:"rgba(38,49,69,.55)"}},
       axisLabel:{color:"#93a1b8",fontSize:10,formatter:function(v){return v.toFixed(2);}},
       axisLine:{show:false},axisPointer:{label:{backgroundColor:"#1a2231",color:"#e8eef7"}}},
      {scale:true,gridIndex:1,position:"left",splitNumber:2,
       splitLine:{lineStyle:{color:"rgba(38,49,69,.35)"}},axisLabel:{color:"#6b7a91",fontSize:9},axisLine:{show:false}},
      {scale:true,gridIndex:2,position:"left",splitNumber:2,
       min:(CUR.sub==="rsi"?0:null),max:(CUR.sub==="rsi"?100:null),
       splitLine:{lineStyle:{color:"rgba(38,49,69,.35)"}},axisLabel:{color:"#6b7a91",fontSize:9},axisLine:{show:false},
       name:subName,nameTextStyle:{color:"#6b7a91",fontSize:9},nameGap:8}
    ],
    dataZoom:[
      {type:"inside",xAxisIndex:[0,1,2],start:startZoom,end:100},
      {type:"slider",xAxisIndex:[0,1,2],start:startZoom,end:100,height:16,bottom:6,
       borderColor:"#31405a",fillerColor:"rgba(76,141,255,.14)",
       handleStyle:{color:"#4c8dff"},textStyle:{color:"#6b7a91",fontSize:9},dataBackground:{lineStyle:{color:"#31405a"},areaStyle:{color:"rgba(76,141,255,.08)"}}}
    ],
    series:main.concat(volS,subS)
  },true);

  /* 缩放 / 平移后重算主图量程，保证蜡烛始终占满可视高度 */
  if(!chart._dz){
    chart._dz=1;
    chart.on("dataZoom",function(){
      const a2=curViewAn(); if(!a2)return;
      const N=a2.dates.length; let s=0,e=N-1;
      try{
        const opt=chart.getOption();
        const dz=(opt&&opt.dataZoom&&opt.dataZoom[0])||{};
        const st=(dz.start!=null?dz.start:0), en=(dz.end!=null?dz.end:100);
        s=Math.floor(N*st/100); e=Math.min(N-1,Math.ceil(N*en/100)-1);
      }catch(err){}
      const r2=klineRange(a2,s,e);
      chart.setOption({yAxis:[{min:r2.min,max:r2.max}]});
    });
  }
}
function buildMarkPoint(an){
  const n=an.dates.length;
  let sigs=(an.sigs||[]).filter(s=>s.i>=Math.max(0,n-70));
  if(sigs.length>20)sigs=sigs.filter(s=>s.st>=2);      /* 过密时只保留强信号 */
  sigs=sigs.slice(0,20);
  return {
    symbolSize:1,
    label:{show:true,fontSize:11,fontWeight:"bold"},
    data:sigs.map(s=>{
      const isB=s.side==="b", isS=s.side==="s";
      const color=isB?UP:(isS?DOWN:"#8b949e");
      return {
        name:s.nm,
        coord:[an.dates[s.i], isB?an.lows[s.i]:an.highs[s.i]],
        value:isB?"▲":(isS?"▼":"●"),
        symbol:"triangle",
        symbolRotate:isB?0:180,
        symbolSize:(s.st>=2?12:9),
        symbolOffset:isB?[0,"60%"]:[0,"-60%"],
        itemStyle:{color:color,borderColor:"rgba(0,0,0,.35)",borderWidth:1},
        label:{show:true,position:isB?"bottom":"top",color:color,
          formatter:isB?"▲":(isS?"▼":"●"),fontSize:(s.st>=2?12:10)}
      };
    })
  };
}
function buildMarkLine(an){
  const data=[];
  (an.supAll||[]).slice(0,2).forEach(l=>data.push({
    yAxis:l.v,name:l.t,
    lineStyle:{color:"rgba(34,197,94,.55)",type:"dashed",width:1},
    label:{formatter:"支撑 "+l.t+" "+f2(l.v),position:"insideEndTop",color:"#6ee79f",fontSize:10}
  }));
  (an.resAll||[]).slice(0,2).forEach(l=>data.push({
    yAxis:l.v,name:l.t,
    lineStyle:{color:"rgba(255,77,79,.55)",type:"dashed",width:1},
    label:{formatter:"压力 "+l.t+" "+f2(l.v),position:"insideEndTop",color:"#ff8f8f",fontSize:10}
  }));
  return {silent:true,symbol:"none",animation:false,data:data};
}

/* ---------- 仪表盘 ---------- */
function marketTemp(){
  const b=state.breadth||{}, m=state.market||{};
  const up=num(b.up), dn=num(b.dn), zt=num(b.zt), dt=num(b.dt);
  if(up!=null&&dn!=null&&up+dn>0){
    const ratio=up/(up+dn);
    let t=ratio*70;
    if(zt!=null)t+=Math.min(20,zt*0.35);
    if(dt!=null)t-=Math.min(15,dt*0.6);
    const avg=((num(m.sh_chg)||0)+(num(m.cy_chg)||0))/2;
    t+=Math.max(-10,Math.min(10,avg*3));
    t=Math.max(0,Math.min(100,t));
    let label = t>=80?"高潮":t>=62?"发酵":t>=45?"震荡":t>=28?"退潮":"冰点";
    return {score:Math.round(t),label,src:"涨跌家数+涨跌停+指数涨跌"};
  }
  const avg=((num(m.sh_chg)||0)+(num(m.cy_chg)||0))/2;
  const t=Math.max(0,Math.min(100,50+avg*8));
  return {score:Math.round(t),label:Math.abs(avg)<0.3?"震荡":(avg>0?"发酵":"退潮"),src:"仅指数涨跌估算（涨跌家数数据缺失）"};
}
function renderDash(){
  renderHeader();
  const ans=[];
  state.holdings.forEach(h=>{const a=getAn(h.code);if(a)ans.push({h,a});});
  const inRep=ans.filter(x=>x.h.inReport!==false);
  const avg=inRep.length?Math.round(inRep.reduce((s,x)=>s+x.a.score.total,0)/inRep.length):0;
  const bull=inRep.filter(x=>x.a.score.total>=62).length;
  const bear=inRep.filter(x=>x.a.score.total<45).length;
  const tmp=marketTemp();
  const sigCnt=inRep.reduce((s,x)=>s+(x.a.sigs||[]).filter(g=>g.i>=x.a.i-5).length,0);

  const kpi=(lb,vl,ex,c)=>'<div class="kpi '+(c||"")+'"><div class="lb">'+lb+'</div><div class="vl">'+vl+'</div><div class="ex">'+ex+'</div></div>';
  $("dashKpi").innerHTML=
     kpi("组合技术均分",avg||"—",inRep.length+" 只纳入统计",avg>=62?"up":(avg<45?"down":""))
    +kpi("偏强 / 偏弱",'<span class="up">'+bull+'</span> / <span class="down">'+bear+'</span>',"评分 ≥62 / <45")
    +kpi("近5日信号数",sigCnt,"全持仓技术形态触发","")
    +kpi("市场温度",tmp.score+' <span style="font-size:13px">'+tmp.label+'</span>',esc(tmp.src),tmp.score>=62?"up":(tmp.score<45?"down":""));

  /* 排行 */
  const sorted=[...inRep].sort((a,b)=>b.a.score.total-a.a.score.total);
  let h='<table><thead><tr><th style="width:40px">#</th><th>标的</th><th class="num">收盘</th><th class="num">涨跌</th>'
       +'<th style="width:120px">评分</th><th>评级</th><th class="num" title="近120日自身历史分位">分位</th>'
       +'<th>日线</th><th>周线</th><th>短线</th><th>中线</th><th>长线</th><th>最近信号</th></tr></thead><tbody>';
  sorted.forEach((x,idx)=>{
    const a=x.a;
    const tf=a.tf||[];
    const tc=(t)=>t?'<span class="chip '+t.tone+'" style="font-size:10.5px">'+t.label.replace(/^(短线|中线|长线)/,"")+'</span>':"—";
    const lastSig=(a.sigs||[]).filter(s=>s.i>=a.i-10).slice(0,2)
      .map(s=>'<span class="chip '+(s.side==="b"?"up":(s.side==="s"?"down":"neu"))+'" style="font-size:10px">'+esc(s.nm)+'</span>').join(" ")||"—";
    const pc=Math.round(a.score.total);
    const barColor=pc>=62?UP:(pc>=45?WARN:DOWN);
    h+='<tr><td class="muted">'+(idx+1)+'</td>'
      +'<td><a href="javascript:;" data-go="'+esc(x.h.code)+'" style="text-decoration:none"><b>'+esc(x.h.name)+'</b></a>'
      +'<div class="muted mono" style="font-size:11px">'+esc(x.h.code)+'</div></td>'
      +'<td class="num">'+f2(a.close)+'</td>'
      +'<td class="num '+(num(a.chg)>=0?"up":"down")+'">'+pct(a.chg)+'</td>'
      +'<td><div class="flex" style="gap:7px"><div class="sbar" style="flex:1"><i style="width:'+pc+'%;background:'+barColor+'"></i></div><b>'+pc+'</b></div></td>'
      +'<td><span class="chip '+a.score.tone+'">'+a.score.label+'</span></td>'
      +'<td class="num">'+(a.scorePct==null?'<span class="muted">—</span>'
         :'<b class="'+(a.scorePct>=60?"up":(a.scorePct<=30?"down":""))+'">'+a.scorePct+'%</b>')+'</td>'
      +'<td style="font-size:11.5px">'+esc(a.arrange)+'</td>'
      +'<td style="font-size:11.5px">'+(a.wk&&a.wk.ok?esc(a.wk.arrange):'<span class="muted">不足</span>')+'</td>'
      +'<td>'+tc(tf[0])+'</td><td>'+tc(tf[1])+'</td><td>'+tc(tf[2])+'</td>'
      +'<td>'+lastSig+'</td></tr>';
  });
  h+='</tbody></table>';
  $("rankTbl").innerHTML=inRep.length?h:'<div class="empty">暂无纳入报告的持仓</div>';
  $("rankTbl").querySelectorAll("[data-go]").forEach(a=>{a.onclick=()=>{pickStock(a.dataset.go);tab("stock");};});

  /* 信号流 */
  const feed=[];
  inRep.forEach(x=>{
    (x.a.sigs||[]).filter(s=>s.i>=x.a.i-20).forEach(s=>feed.push({name:x.h.name,code:x.h.code,s}));
  });
  feed.sort((a,b)=>b.s.i-a.s.i);
  const top=feed.slice(0,40);
  $("sigFeed").innerHTML=top.length?top.map(f=>
    '<div class="sig '+(f.s.side==="b"?"b":(f.s.side==="s"?"s":"n"))+'">'
    +'<div class="ic">'+(f.s.side==="b"?"▲":(f.s.side==="s"?"▼":"●"))+'</div>'
    +'<div class="bd"><div class="t1">'+esc(f.name)+'　<span class="muted" style="font-weight:400">'+esc(f.s.date)+'　'+f2(f.s.price)+'</span>'
    +'　<b>'+esc(f.s.nm)+'</b>'+(f.s.st>=2?'　<span class="chip up" style="font-size:10px">强</span>':'')+'</div>'
    +'<div class="t2">'+esc(f.s.ds)+'</div></div>'
    +'<button class="btn sm" data-go2="'+esc(f.code)+'">看图</button></div>').join("")
    :'<div class="empty">近 20 日无技术信号</div>';
  $("sigFeed").querySelectorAll("[data-go2]").forEach(b=>{b.onclick=()=>{pickStock(b.dataset.go2);tab("stock");};});

  renderSigPie(inRep);
  renderTempGauge(tmp);
  renderStruct(inRep);
  renderPortfolioAi(inRep.map(x=>x.h));
}

/* ---------- AI 组合诊断 ---------- */
function renderPortfolioAi(rows){
  const box=$("pfAi"); if(!box)return;
  const r=aiPortfolio(rows);
  if(!r){box.innerHTML='<div class="empty">暂无可分析的标的（请先在持仓管理勾选纳入报告）</div>';return;}
  let h='<div class="aiwrap">';
  h+='<div class="aiverdict '+r.tone+'">'
    +'<div class="ai-ico '+(r.tone==="up"?"up":(r.tone==="down"?"down":"warn"))+'">'+r.icon+'</div>'
    +'<div class="ai-main"><div class="ai-title">'+esc(r.title)+'</div>'
    +'<div class="ai-desc">'+r.desc+'</div></div></div>';
  h+='<div class="aigrid">';
  h+='<div class="aibox"><h5>结构要点</h5><ul>'+r.items.map(x=>"<li>"+x+"</li>").join("")+"</ul></div>";
  /* 强弱分布条 */
  const n=rows.length||1;
  const seg=(v,t)=>'<div style="flex:'+Math.max(0,v)+'"><div class="aibar"><i style="width:100%;background:'+t+'"></i></div>'
    +'<div class="muted" style="font-size:11px;margin-top:3px">'+v+' 只</div></div>';
  h+='<div class="aibox"><h5>多头 / 空头分布</h5>'
    +'<div style="display:flex;gap:8px;margin-bottom:6px">'
    +seg(r.upN,UP)+seg(r.dnN,DOWN)+seg(n-r.upN-r.dnN,WARN)+'</div>'
    +'<div class="muted" style="font-size:11.5px">多头 '+r.upN+' · 空头 '+r.dnN+' · 纠缠 '+(n-r.upN-r.dnN)+'（日线排列口径）</div>'
    +'<div class="muted" style="font-size:11.5px;margin-top:4px">周线多头 '+r.wkUp+' 只 —— 周线口径比日线更能反映中期趋势</div></div>';
  h+='<div class="aibox"><h5>强弱两端</h5><div class="ailv">'
    +r.sorted.slice(0,3).map(x=>'<div class="row up"><span class="nm">'+esc(x.h.name)+'</span><span class="vv">'+x.an.score.total+" 分</span></div>").join("")
    +r.sorted.slice(-3).reverse().map(x=>'<div class="row down"><span class="nm">'+esc(x.h.name)+'</span><span class="vv">'+x.an.score.total+" 分</span></div>").join("")
    +'</div></div>';
  h+='</div>';
  h+='<div class="airisk"><b>⚠ 组合层面风险</b><br>'+r.risks.map(x=>"· "+x).join("<br>")+'</div>';
  h+='</div>';
  box.innerHTML=h;
}

/* ---------- 指数走势（归一化对比） ---------- */
const HOLD_SECTOR={
  "000063":"通信设备","300014":"电池","300602":"电子元件被动元件","300748":"稀土永磁",
  "000988":"通信设备光模块","300442":"IDC算力服务","300693":"电力设备","000933":"工业金属",
  "159558":"半导体设备","159326":"电网设备","159713":"稀土","159290":"创业板综指",
  "513050":"中概互联网","159577":"美股50"
};
/* 板块名 ↔ 持仓行业 匹配：先整体包含，再用 3 字滑窗，避免"通信设备"误命中"电力设备" */
function sectorMatch(secName,holdSec){
  if(!secName||!holdSec)return false;
  const a=String(secName).replace(/[ⅡⅢⅠ\s\(\)（）概念行业]/g,"");
  const b=String(holdSec);
  if(!a||!b)return false;
  if(b.indexOf(a)>=0||a.indexOf(b)>=0)return true;
  if(a.length<3)return false;
  for(let i=0;i+3<=a.length;i++){ if(b.indexOf(a.substr(i,3))>=0)return true; }
  return false;
}
function renderIdxChart(){
  const el=$("idxChart"); if(!el||typeof echarts==="undefined")return;
  const defs=[["000001","上证指数","#f5a524"],["399001","深证成指","#58a6ff"],["399006","创业板指","#a371f7"]];
  const series=[],leg=[];
  let dates=null;
  defs.forEach(([cd,nm,color])=>{
    const an=getAn(cd); if(!an)return;
    const N=Math.min(60,an.dates.length);
    const st=an.dates.length-N;
    const base=an.closes[st]; if(!nn(base)||!base)return;
    if(!dates)dates=an.dates.slice(st);
    const norm=an.closes.slice(st).map(v=>nn(v)?+(v/base*100).toFixed(2):null);
    const ma20=an.ma20.slice(st).map(v=>nn(v)?+(v/base*100).toFixed(2):null);
    series.push({name:nm,type:"line",data:norm,smooth:true,showSymbol:false,
      lineStyle:{width:1.8,color:color},itemStyle:{color:color}});
    series.push({name:nm+" MA20",type:"line",data:ma20,smooth:true,showSymbol:false,
      lineStyle:{width:1,color:color,opacity:.45,type:"dashed"}});
    leg.push(nm);
  });
  if(!series.length){ el.innerHTML='<div class="empty">指数K线数据缺失</div>'; if(el._c){el._c.dispose();el._c=null;} return; }
  if(!el._c)el._c=echarts.init(el);
  el._c.setOption({
    animation:false,backgroundColor:"transparent",
    grid:{left:52,right:16,top:34,bottom:30},
    legend:{data:leg,top:2,textStyle:{color:"#93a1b8",fontSize:11},itemWidth:14,itemHeight:8},
    tooltip:{trigger:"axis",backgroundColor:"rgba(19,26,37,.96)",borderColor:"#31405a",
      textStyle:{color:"#e8eef7",fontSize:12},valueFormatter:v=>v==null?"—":(+v).toFixed(2)},
    xAxis:{type:"category",data:dates||[],axisLine:{lineStyle:{color:"#31405a"}},
      axisLabel:{color:"#93a1b8",fontSize:10,interval:Math.max(1,Math.floor((dates||[]).length/8))}},
    yAxis:{type:"value",scale:true,splitLine:{lineStyle:{color:"rgba(38,49,69,.55)"}},
      axisLabel:{color:"#93a1b8",fontSize:10,formatter:v=>v.toFixed(0)},axisLine:{show:false}},
    series:series
  },true);
}

/* ---------- 今日主线 × 持仓映射 ---------- */
function renderSectorMap(){
  const box=$("sectorMap"); if(!box)return;
  const sn=state.snap||{};
  const hot=sn.hot||[], net=sn.net||[];
  if(!hot.length&&!net.length){box.innerHTML='<div class="empty">板块快照：数据缺失</div>';return;}
  const holds=state.holdings.filter(h=>h.inReport!==false);
  /* 汇总：每个板块 → 命中持仓 */
  const rows=[];
  const seen={};
  [].concat(hot.map(x=>({name:x.name,chg:x.chg,kind:"领涨"})),
            net.map(x=>({name:x.name,chg:x.chg,net:x.net,kind:"资金"}))).forEach(s=>{
    const key=s.name+"|"+s.kind;
    if(seen[key])return; seen[key]=1;
    const hits=holds.filter(h=>sectorMatch(s.name,HOLD_SECTOR[h.code]));
    rows.push({s:s,hits:hits});
  });
  rows.sort((a,b)=>(b.hits.length-a.hits.length)||((num(b.s.chg)||0)-(num(a.s.chg)||0)));
  const covered={};
  rows.forEach(r=>r.hits.forEach(h=>covered[h.code]=1));
  const uncovered=holds.filter(h=>!covered[h.code]);

  let h='<div class="banner '+(uncovered.length?'warn':'info')+'" style="margin-bottom:10px">'
    +'今日主线板块共 <b>'+rows.length+'</b> 个，与你的持仓发生关联的有 <b>'+(rows.length-rows.filter(r=>!r.hits.length).length)+'</b> 个；'
    +'被主线覆盖的持仓 <b>'+Object.keys(covered).length+'/'+holds.length+'</b> 只'
    +(uncovered.length?'，<b>未覆盖：'+uncovered.map(x=>esc(x.name)).join("、")+'</b>（属非当前热点，需独立跟踪）':'，主线覆盖充分')
    +'。仅板块名称匹配推断，非精确行业归类。</div>';
  h+='<table><thead><tr><th>板块</th><th>类型</th><th class="num">涨跌</th><th class="num">主力净流入</th><th>命中持仓</th></tr></thead><tbody>';
  rows.slice(0,14).forEach(r=>{
    const s=r.s;
    h+='<tr><td><b>'+esc(s.name)+'</b></td>'
      +'<td><span class="chip '+(s.kind==="领涨"?"up":"acc")+'">'+s.kind+'</span></td>'
      +'<td class="num '+(num(s.chg)>=0?"up":"down")+'">'+pct(s.chg)+'</td>'
      +'<td class="num">'+((s.net!=null)?(num(s.net)>0?"+":"")+f2(s.net)+"亿":"—")+'</td>'
      +'<td>'+(r.hits.length?r.hits.map(x=>{
          const an=getAn(x.code);
          const sc=an?an.score.total:null;
          return '<span class="chip '+(sc==null?"neu":(sc>=62?"up":(sc<45?"down":"neu")))+'" style="margin-right:4px">'
            +esc(x.name)+(sc!=null?' '+sc:'')+'</span>';
        }).join(""):'<span class="muted">无</span>')+'</td></tr>';
  });
  h+='</tbody></table>';
  box.innerHTML=h;
}

/* ---------- AI 大盘解读 ---------- */
function renderMarketAi(){
  const box=$("mktAi"); if(!box)return;
  const r=aiMarket();
  let h='<div class="aiwrap">';
  h+='<div class="aiverdict '+r.tone+'">'
    +'<div class="ai-ico '+(r.tone==="up"?"up":(r.tone==="down"?"down":"warn"))+'">'+r.icon+'</div>'
    +'<div class="ai-main"><div class="ai-title">'+esc(r.title)+'</div>'
    +'<div class="ai-desc">'+r.desc+'</div></div></div>';
  if(r.items.length){
    h+='<div class="aigrid"><div class="aibox" style="grid-column:1/-1"><h5>盘面解读</h5><ul>'
      +r.items.map(x=>"<li>"+x+"</li>").join("")+"</ul></div></div>";
  }
  h+='<div class="airisk"><b>⚠ 风险与容错提示</b><br>'+r.risks.map(x=>"· "+x).join("<br>")+'</div>';
  h+='</div>';
  box.innerHTML=h;
}
function renderStruct(list){
  const el=$("structBar"); if(!el||typeof echarts==="undefined")return;
  if(!el._c)el._c=echarts.init(el);
  const R=[
    {n:"日线排列",b:0,m:0,s:0,t:0},
    {n:"周线排列",b:0,m:0,s:0,t:0},
    {n:"价格 vs MA60",b:0,m:0,s:0,t:0},
    {n:"中期通道",b:0,m:0,s:0,t:0},
    {n:"MACD 柱",b:0,m:0,s:0,t:0}
  ];
  list.forEach(x=>{
    const a=x.a,i=a.i;
    const arr=a.arrange||"";
    if(arr.indexOf("多头")>=0)R[0].b++; else if(arr.indexOf("空头")>=0)R[0].s++; else R[0].m++;
    R[0].t++;
    const wk=(a.wk&&a.wk.ok)?a.wk.arrange:null;
    if(wk==="多头排列")R[1].b++; else if(wk==="空头排列")R[1].s++; else R[1].m++;
    R[1].t++;
    if(nn(a.ma60[i])){ a.close>a.ma60[i]?R[2].b++:R[2].s++; R[2].t++; }
    if(a.chan){ a.chan.slope>0?R[3].b++:(a.chan.slope<0?R[3].s++:R[3].m++); R[3].t++; }
    if(nn(a.bar[i])){ a.bar[i]>=0?R[4].b++:R[4].s++; R[4].t++; }
  });
  const pc=(c,t)=>t?Math.round(c/t*100):0;
  const mk=(key,color,nm)=>({
    name:nm,type:"bar",stack:"x",barWidth:"52%",
    itemStyle:{color:color},
    label:{show:true,color:"#0b0f16",fontSize:10,fontWeight:600,
      formatter:p=>{const r=R[p.dataIndex];const c=r[key];return c?c+"":"";}},
    data:R.map(r=>({value:pc(r[key],r.t),raw:r[key]}))
  });
  el._c.setOption({
    grid:{left:78,right:16,top:8,bottom:20},
    tooltip:{trigger:"axis",axisPointer:{type:"shadow"},
      backgroundColor:"rgba(19,26,37,.96)",borderColor:"#263145",textStyle:{color:"#e8eef7",fontSize:11},
      formatter:ps=>{const r=R[ps[0].dataIndex];
        return r.n+"（"+r.t+" 只）<br>偏多 "+r.b+"　中性 "+r.m+"　偏空 "+r.s;}},
    xAxis:{type:"value",max:100,show:false},
    yAxis:{type:"category",data:R.map(r=>r.n),inverse:true,
      axisLine:{show:false},axisTick:{show:false},
      axisLabel:{color:"#93a1b8",fontSize:11}},
    series:[mk("b",UP,"偏多"),mk("m","#4a586d","中性"),mk("s",DOWN,"偏空")]
  },true);
}
function renderSigPie(list){
  const el=$("sigPie"); if(!el||typeof echarts==="undefined")return;
  if(!el._c)el._c=echarts.init(el);
  let b=0,s=0,n=0;
  list.forEach(x=>{(x.a.sigs||[]).filter(g=>g.i>=x.a.i-20).forEach(g=>{ if(g.side==="b")b++; else if(g.side==="s")s++; else n++; });});
  el._c.setOption({
    tooltip:{trigger:"item",backgroundColor:"rgba(19,26,37,.96)",borderColor:"#263145",textStyle:{color:"#e8eef7",fontSize:12}},
    legend:{bottom:2,textStyle:{color:"#93a1b8",fontSize:11},itemWidth:12,itemHeight:8},
    series:[{type:"pie",radius:["46%","70%"],center:["50%","44%"],avoidLabelOverlap:true,
      label:{color:"#c7d3e3",fontSize:11,formatter:"{b}\n{c}"},
      labelLine:{lineStyle:{color:"#31405a"}},
      data:[
        {value:b,name:"多头信号",itemStyle:{color:UP}},
        {value:s,name:"空头信号",itemStyle:{color:DOWN}},
        {value:n,name:"中性形态",itemStyle:{color:"#6b7a91"}}
      ].filter(d=>d.value>0)}]
  },true);
}
function renderTempGauge(tmp){
  const el=$("tempGauge"); if(!el||typeof echarts==="undefined")return;
  if(!el._c)el._c=echarts.init(el);
  el._c.setOption({
    series:[{
      type:"gauge",startAngle:200,endAngle:-20,min:0,max:100,
      radius:"86%",center:["50%","62%"],
      progress:{show:true,width:14,itemStyle:{color:{
        type:"linear",x:0,y:0,x2:1,y2:0,
        colorStops:[{offset:0,color:"#22c55e"},{offset:.5,color:"#f5a524"},{offset:1,color:"#ff4d4f"}]}}},
      axisLine:{lineStyle:{width:14,color:[[1,"rgba(38,49,69,.8)"]]}},
      axisTick:{show:false},splitLine:{length:8,lineStyle:{color:"#5c6b80",width:1}},
      axisLabel:{color:"#6b7a91",fontSize:9,distance:-26},
      pointer:{width:4,length:"58%",itemStyle:{color:"#e8eef7"}},
      anchor:{show:true,size:8,itemStyle:{color:"#e8eef7"}},
      title:{show:true,offsetCenter:[0,"76%"],color:"#93a1b8",fontSize:12},
      detail:{valueAnimation:true,offsetCenter:[0,"42%"],fontSize:24,fontWeight:700,color:"#e8eef7",formatter:"{value}"},
      data:[{value:tmp.score,name:tmp.label}]
    }]
  },true);
  $("tempNote").innerHTML='判定来源：'+esc(tmp.src)+'。区间：0–28 冰点 / 28–45 退潮 / 45–62 震荡 / 62–80 发酵 / 80+ 高潮。'
    +( (num(state.breadth.up)==null)?'　<b style="color:#ffcf7a">涨跌家数缺失，当前为估算值</b>：' :'');
}
