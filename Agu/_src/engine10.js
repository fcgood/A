/* ============================================================
   engine10 · 大事提醒 / 持仓盈亏 / 快捷搜索 / 关于（v2.0）
   ============================================================ */

/* ============================================================
   一、大事提醒
   ============================================================ */
function alertSave(){ try{ localStorage.setItem("ashare_alerts", JSON.stringify(ALERTS)); }catch(e){} }
function alertLoad(){
  try{
    var s = localStorage.getItem("ashare_alerts");
    if(s){ var a = JSON.parse(s); if(a && a.length) ALERTS = a; }
  }catch(e){}
}
function posSave(){ try{ localStorage.setItem("ashare_pos", JSON.stringify(POS)); }catch(e){} }
function posLoad(){
  try{
    var s = localStorage.getItem("ashare_pos");
    if(s){ var o = JSON.parse(s); if(o) POS = o; }
  }catch(e){}
}

function alertTypeTxt(t){
  return {above:"价格上破", below:"价格下破", chg:"单日涨跌", date:"日期提醒", note:"自定义事项"}[t] || t;
}
function renderAlerts(){
  alertLoad();
  renderAlertAuto();
  renderAlertList();
  updateAlertBadge();
}

function renderAlertList(){
  var box = $("alList"); if(!box) return;
  var cnt = $("alCount");
  var hitN = 0;
  for(var i=0;i<ALERTS.length;i++) if(ALERTS[i].hit) hitN++;
  if(cnt) cnt.textContent = "共 " + ALERTS.length + " 条，其中 " + hitN + " 条已触发";
  if(!ALERTS.length){
    box.innerHTML = '<div class="empty">还没有提醒。左侧添加「价格上破 / 下破 / 涨跌 / 日期 / 自定义事项」，或点上方「立即扫描技术信号」。</div>';
    return;
  }
  var h = "";
  for(var j=0;j<ALERTS.length;j++){
    var a = ALERTS[j];
    var an = getAn(a.code);
    var cur = an ? f2(an.close) : "无数据";
    var cond = "";
    if(a.type === "above") cond = "收盘 ≥ " + f2(a.val) + "（现价 " + cur + "）";
    else if(a.type === "below") cond = "收盘 ≤ " + f2(a.val) + "（现价 " + cur + "）";
    else if(a.type === "chg") cond = "单日涨跌 ≥ ±" + Number(a.val).toFixed(2) + "%";
    else if(a.type === "date") cond = "到期 " + esc(a.val);
    else cond = esc(a.val);
    h += '<div class="alertrow ' + (a.hit ? "hit" : "") + '">' +
      '<div style="padding-top:2px">' + (a.hit ? "🔔" : "⏳") + '</div>' +
      '<div class="txt"><div class="tt">' + esc(a.name || a.code) +
        ' <span class="muted mono" style="font-size:12px">' + esc(a.code) + '</span>' +
        ' <span class="pbadge">' + alertTypeTxt(a.type) + '</span>' +
        (a.hit ? ' <span class="pbadge ok">已触发</span>' : '') + '</div>' +
      '<div class="ds">' + cond + (a.hitInfo ? '　<b style="color:#ffd48a">' + esc(a.hitInfo) + '</b>' : '') + '</div></div>' +
      '<button class="btn sm" data-alread="' + j + '">已读</button>' +
      '<button class="btn sm danger" data-aldel="' + j + '">删</button>' +
      '</div>';
  }
  box.innerHTML = h;
  [].forEach.call(box.querySelectorAll("[data-aldel]"), function(b){
    b.onclick = function(){ ALERTS.splice(+b.getAttribute("data-aldel"), 1); alertSave(); renderAlerts(); };
  });
  [].forEach.call(box.querySelectorAll("[data-alread]"), function(b){
    b.onclick = function(){
      var a = ALERTS[+b.getAttribute("data-alread")];
      if(a){ a.hit = false; a.hitInfo = ""; }
      alertSave(); renderAlerts();
    };
  });
}

/* ---------- 自动技术大事扫描 ---------- */
function scanTechSignals(){
  var out = [];
  var list = state.holdings.slice();
  for(var i=0;i<list.length;i++){
    var hd = list[i];
    var an = getAn(hd.code);
    if(!an || !an.dates || !an.dates.length) continue;
    var k = an.i, nm = hd.name || an.name || hd.code;
    var add = function(tp, txt, lv){ out.push({code:hd.code, name:nm, type:tp, text:txt, level:lv||"info"}); };
    /* MACD 金叉 / 死叉（近 5 日） */
    for(var d=Math.max(2,k-4); d<=k; d++){
      if(an.dif[d-1]!=null && an.dea[d-1]!=null && an.dif[d]!=null && an.dea[d]!=null){
        if(an.dif[d-1] <= an.dea[d-1] && an.dif[d] > an.dea[d])
          add("macd", an.dates[d] + " MACD 金叉（DIF " + f3(an.dif[d]) + " 上穿 DEA " + f3(an.dea[d]) + "）", "bull");
        if(an.dif[d-1] >= an.dea[d-1] && an.dif[d] < an.dea[d])
          add("macd", an.dates[d] + " MACD 死叉（DIF " + f3(an.dif[d]) + " 下穿 DEA " + f3(an.dea[d]) + "）", "bear");
      }
    }
    /* 均线穿越 */
    if(an.ma60 && an.ma60[k]!=null && an.ma60[k-1]!=null){
      if(an.closes[k-1] <= an.ma60[k-1] && an.closes[k] > an.ma60[k])
        add("ma", "收盘上穿 MA60（" + f2(an.ma60[k]) + "），中期结构转强", "bull");
      if(an.closes[k-1] >= an.ma60[k-1] && an.closes[k] < an.ma60[k])
        add("ma", "收盘跌破 MA60（" + f2(an.ma60[k]) + "），中期结构转弱", "bear");
    }
    if(an.ma20 && an.ma20[k]!=null && an.ma20[k-1]!=null){
      if(an.closes[k-1] <= an.ma20[k-1] && an.closes[k] > an.ma20[k])
        add("ma", "收盘上穿 MA20（" + f2(an.ma20[k]) + "）", "bull");
      if(an.closes[k-1] >= an.ma20[k-1] && an.closes[k] < an.ma20[k])
        add("ma", "收盘跌破 MA20（" + f2(an.ma20[k]) + "）", "bear");
    }
    /* 量能 */
    if(nn(an.vrs[k]) && an.vrs[k] >= 2)
      add("vol", "放量：量比 " + an.vrs[k].toFixed(2) + "（≥2 为显著放量）", an.chg >= 0 ? "bull" : "bear");
    /* 创新高 / 新低 */
    if(an.hl60){
      if(nn(an.hl60.hi) && an.close >= an.hl60.hi * 0.995)
        add("hl", "逼近 / 创 60 日新高（" + f2(an.hl60.hi) + "）", "bull");
      if(nn(an.hl60.lo) && an.close <= an.hl60.lo * 1.005)
        add("hl", "逼近 / 创 60 日新低（" + f2(an.hl60.lo) + "）", "bear");
    }
    /* RSI */
    if(nn(an.r[k])){
      if(an.r[k] >= 75) add("rsi", "RSI14 = " + f1(an.r[k]) + "，进入超买区", "bear");
      if(an.r[k] <= 25) add("rsi", "RSI14 = " + f1(an.r[k]) + "，进入超卖区", "bull");
    }
    /* 通道 */
    if(an.chan && an.chan.lo && an.chan.lo[k]!=null && an.close < an.chan.lo[k])
      add("chan", "跌破趋势通道下轨（" + f2(an.chan.lo[k]) + "）", "bear");
    /* 波浪末端 */
    try{
      var e = elliott(an);
      if(e.found && e.imp){
        var P5 = e.imp.P[5].v;
        if(Math.abs(an.close - P5) / P5 < 0.02)
          add("wave", "价格贴近" + (e.imp.up ? "上升" : "下降") + "五浪末端（" + f2(P5) + "），结构接近完成", "warn");
      }
    }catch(err){}
  }
  return out;
}
function renderAlertAuto(){
  var box = $("alAuto"); if(!box) return;
  var sigs = scanTechSignals();
  if(!sigs.length){ box.innerHTML = '<div class="empty">当前无显著技术信号。</div>'; return; }
  var order = {bear:0, warn:1, bull:2, info:3};
  sigs.sort(function(a,b){ return (order[a.level]||9) - (order[b.level]||9); });
  var col = {bull:UP, bear:DOWN, warn:WARN, info:"#93a1b8"};
  var nm = {bull:"多头", bear:"空头", warn:"注意", info:"提示"};
  var h = "";
  for(var i=0;i<sigs.length;i++){
    var s = sigs[i];
    h += '<div class="alertrow"><div class="txt">' +
      '<div class="tt">' + esc(s.name) + ' <span class="muted mono" style="font-size:12px">' + esc(s.code) + '</span> ' +
      '<span class="pbadge" style="color:' + col[s.level] + ';border-color:' + col[s.level] + '55">' + nm[s.level] + '</span></div>' +
      '<div class="ds">' + s.text + '</div></div></div>';
  }
  h += '<div class="hint" style="margin-top:6px">共 ' + sigs.length + ' 条。均为<b>已发生</b>的技术形态客观描述，' +
       '非预测、非买卖指令；点「立即扫描技术信号」可刷新。</div>';
  box.innerHTML = h;
}

/* ---------- 价格比对 ---------- */
function checkAllAlerts(){
  var hitNew = 0;
  for(var i=0;i<ALERTS.length;i++){
    var a = ALERTS[i];
    var an = getAn(a.code);
    if(a.type === "date"){
      if(a.val && a.val <= todayStr() && !a.hit){ a.hit = true; a.hitInfo = "日期已到（" + a.val + "）"; hitNew++; }
      continue;
    }
    if(a.type === "note") continue;
    if(!an) continue;
    var c = an.close, v = num(a.val);
    if(!nn(c) || v == null) continue;
    if(a.type === "above" && c >= v){ if(!a.hit) hitNew++; a.hit = true; a.hitInfo = "现价 " + f2(c) + " 已上破 " + f2(v); }
    if(a.type === "below" && c <= v){ if(!a.hit) hitNew++; a.hit = true; a.hitInfo = "现价 " + f2(c) + " 已下破 " + f2(v); }
    if(a.type === "chg" && nn(an.chg) && Math.abs(an.chg) >= Math.abs(v)){
      if(!a.hit) hitNew++; a.hit = true; a.hitInfo = "今日 " + pct(an.chg) + " 超过 ±" + Math.abs(v).toFixed(2) + "%";
    }
  }
  alertSave(); updateAlertBadge();
  return hitNew;
}
function todayStr(){
  var d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");
}
function updateAlertBadge(){
  var b = $("alertBadge");
  if(!b) return;
  var n = 0;
  for(var i=0;i<ALERTS.length;i++) if(ALERTS[i].hit) n++;
  if(n > 0){ b.style.display = ""; b.textContent = n; } else { b.style.display = "none"; }
}

function addAlertFromUI(){
  var code = ($("alCode") && $("alCode").value || "").trim();
  var type = ($("alType") && $("alType").value) || "above";
  var val  = ($("alVal") && $("alVal").value || "").trim();
  var msg  = $("alAddMsg");
  if(!code){ if(msg) msg.textContent = "请填写代码或名称"; return; }
  var real = code, nm = "";
  if(!/^\d{6}$/.test(code)){
    var r = lookupName(code);
    if(r){ real = r.code; nm = r.name; }
    else { if(msg) msg.textContent = "未识别：" + code + "，请填 6 位代码"; return; }
  } else { nm = nameOf(real) || real; }
  if(type !== "note" && type !== "date" && !nn(num(val))){
    if(msg) msg.textContent = "请填写数值阈值"; return;
  }
  if(type === "date" && !/^\d{4}-\d{2}-\d{2}$/.test(val)){
    if(msg) msg.textContent = "日期格式应为 2026-09-30"; return;
  }
  ALERTS.unshift({id:Date.now(), code:real, name:nm, type:type, val:val, hit:false, hitInfo:""});
  alertSave();
  if(msg) msg.textContent = "已添加：" + nm + " · " + alertTypeTxt(type);
  checkAllAlerts(); renderAlerts();
}

function bindAlerts(){
  var b;
  b = $("alAdd"); if(b) b.onclick = addAlertFromUI;
  b = $("alScan"); if(b) b.onclick = function(){
    renderAlertAuto();
    var m = $("alMsg");
    if(m){ m.textContent = "已扫描 " + new Date().toLocaleTimeString(); setTimeout(function(){ m.textContent = ""; }, 2000); }
  };
  b = $("alReadAll"); if(b) b.onclick = function(){
    for(var i=0;i<ALERTS.length;i++){ ALERTS[i].hit = false; ALERTS[i].hitInfo = ""; }
    alertSave(); renderAlerts();
  };
  b = $("alClearHit"); if(b) b.onclick = function(){
    var keep = [];
    for(var i=0;i<ALERTS.length;i++) if(!ALERTS[i].hit) keep.push(ALERTS[i]);
    ALERTS = keep; alertSave(); renderAlerts();
  };
}

/* ---------- 报告里附上提醒 ---------- */
function buildAlertBlock(){
  var lines = [];
  for(var i=0;i<ALERTS.length;i++){
    var a = ALERTS[i];
    var st = a.hit ? "已触发" : "监控中";
    var v = (a.type === "date" || a.type === "note") ? a.val : f2(num(a.val));
    lines.push("- " + a.name + "（" + a.code + "）· " + alertTypeTxt(a.type) + " " + v + " · " + st);
  }
  var sigs = scanTechSignals();
  var s = "## 大事提醒\n\n";
  s += "### 我的提醒（" + ALERTS.length + " 条）\n\n";
  s += lines.length ? lines.join("\n") + "\n" : "- 暂无\n";
  s += "\n### 技术信号自动扫描（" + sigs.length + " 条）\n\n";
  if(sigs.length){
    var nmx = {bull:"多头", bear:"空头", warn:"注意", info:"提示"};
    s += sigs.slice(0, 25).map(function(x){
      return "- **" + x.name + "（" + x.code + "）**[" + (nmx[x.level]||"") + "] " + x.text;
    }).join("\n") + "\n";
  } else s += "- 当前无显著技术信号\n";
  s += "\n> 提醒为价格 / 日期条件的客观比对结果，技术信号为已发生形态的描述，**不构成买卖指令**。\n";
  return s;
}

/* ============================================================
   二、持仓盈亏
   ============================================================ */
function renderHoldings(){
  var box = $("holdList"); if(!box) return;
  var h = '<table><thead><tr><th style="width:48px">纳入</th><th style="width:104px">代码</th><th>名称</th>'
        + '<th style="width:86px">类型</th><th style="width:88px">成本</th><th style="width:88px">数量</th>'
        + '<th class="num">最新</th><th class="num">涨跌</th><th class="num">浮盈亏</th><th class="num">盈亏%</th>'
        + '<th style="width:96px">权重</th><th class="num">评分</th><th>技术评级</th><th>K线</th><th style="width:56px"></th></tr></thead><tbody>';
  var totalMv = 0, totalCost = 0, rows = [];
  state.holdings.forEach(function(hd, idx){
    var an = getAn(hd.code);
    var p = POS[hd.code] || {};
    var cost = num(p.cost), qty = num(p.qty);
    var last = an ? an.close : null;
    var mv = (last != null && qty != null) ? last * qty : null;
    var cst = (cost != null && qty != null) ? cost * qty : null;
    var pl = (mv != null && cst != null) ? mv - cst : null;
    var plp = (pl != null && cst) ? pl / cst * 100 : null;
    if(mv != null) totalMv += mv;
    if(cst != null) totalCost += cst;
    rows.push({hd:hd, idx:idx, an:an, mv:mv, pl:pl, plp:plp, cost:cost, qty:qty});
  });
  rows.forEach(function(r){
    var hd = r.hd, an = r.an, idx = r.idx;
    var cls = function(v){ return (num(v)||0) >= 0 ? "up" : "down"; };
    var wt = (r.mv != null && totalMv > 0) ? (r.mv / totalMv * 100) : null;
    var plTxt = (r.pl == null) ? '<span class="muted">—</span>'
      : '<b class="' + (r.pl>=0?"up":"down") + '">' + (r.pl>=0?"+":"") + Math.round(r.pl).toLocaleString() + '</b>';
    var plpTxt = (r.plp == null) ? '<span class="muted">—</span>'
      : '<span class="' + (r.plp>=0?"up":"down") + '">' + (r.plp>=0?"+":"") + r.plp.toFixed(2) + '%</span>';
    var wtBar = (wt == null) ? '<span class="muted">—</span>'
      : '<div style="font-size:11.5px">' + wt.toFixed(1) + '%</div><div class="pnbar"><i style="width:'
        + Math.min(100, wt*3).toFixed(1) + '%;background:' + ACC + '"></i></div>';
    h += '<tr>'
      + '<td><input type="checkbox" data-hi="' + idx + '" data-k="inReport"' + (hd.inReport ? " checked" : "") + ' style="width:auto"></td>'
      + '<td><input data-hi="' + idx + '" data-k="code" value="' + esc(hd.code) + '" class="mono"></td>'
      + '<td><input data-hi="' + idx + '" data-k="name" value="' + esc(hd.name) + '"></td>'
      + '<td><select data-hi="' + idx + '" data-k="type">'
        + ["A","ETF","IDX"].map(function(o){ return '<option' + (hd.type===o?" selected":"") + '>' + o + '</option>'; }).join("") + '</select></td>'
      + '<td><input data-hi="' + idx + '" data-k="cost" value="' + (r.cost==null?"":r.cost) + '" placeholder="成本" style="text-align:right"></td>'
      + '<td><input data-hi="' + idx + '" data-k="qty" value="' + (r.qty==null?"":r.qty) + '" placeholder="股数" style="text-align:right"></td>'
      + '<td class="num">' + (an ? f2(an.close) : '<span class="muted">无数据</span>') + '</td>'
      + '<td class="num ' + (an ? cls(an.chg) : "") + '">' + (an ? pct(an.chg) : "—") + '</td>'
      + '<td class="num">' + plTxt + '</td>'
      + '<td class="num">' + plpTxt + '</td>'
      + '<td>' + wtBar + '</td>'
      + '<td class="num">' + (an ? '<b>' + an.score.total + '</b>' : "—") + '</td>'
      + '<td>' + (an ? '<span class="chip ' + an.score.tone + '">' + an.score.label + '</span> <span class="muted" style="font-size:11.5px">' + esc(an.arrange) + '</span>' : '<span class="muted">—</span>') + '</td>'
      + '<td class="muted">' + (state.stocks[hd.code] && state.stocks[hd.code].rows ? state.stocks[hd.code].rows.length + " 根" : "0") + '</td>'
      + '<td><button class="btn sm danger" data-hdel="' + idx + '">删</button></td></tr>';
  });
  h += '</tbody></table>';
  h += '<div class="hint" style="margin-top:8px">成本 / 数量只存本机浏览器，用于算浮盈亏与仓位权重；留空则该标的不纳入盈亏统计。</div>';
  box.innerHTML = h;
  [].forEach.call(box.querySelectorAll("input,select"), function(el){
    el.onchange = function(){
      var i = +el.getAttribute("data-hi"), k = el.getAttribute("data-k");
      if(k === "cost" || k === "qty"){
        var code = state.holdings[i].code;
        if(!POS[code]) POS[code] = {};
        POS[code][k] = el.value === "" ? null : num(el.value);
        posSave();
      } else {
        state.holdings[i][k] = (el.type === "checkbox") ? el.checked : el.value;
      }
      saveState(); renderHoldings(); renderRail(); renderDash(); renderPosSummary();
    };
  });
  [].forEach.call(box.querySelectorAll("[data-hdel]"), function(b){
    b.onclick = function(){
      state.holdings.splice(+b.getAttribute("data-hdel"), 1);
      saveState(); renderHoldings(); renderRail(); renderDash(); renderPosSummary();
    };
  });
  var rc = $("railCount"); if(rc) rc.textContent = state.holdings.length + " 只";
  renderPosSummary();
}

function renderPosSummary(){
  var box = $("posSummary"); if(!box) return;
  var totalMv = 0, totalCost = 0, n = 0;
  var list = [];
  state.holdings.forEach(function(hd){
    var an = getAn(hd.code);
    var p = POS[hd.code] || {};
    var cost = num(p.cost), qty = num(p.qty);
    if(an && qty != null && cost != null){
      var mv = an.close * qty, cst = cost * qty;
      totalMv += mv; totalCost += cst; n++;
      list.push({nm:hd.name, mv:mv, pl:mv-cst, plp:(mv/cst-1)*100});
    } else if(an && qty != null){
      totalMv += an.close * qty; n++;
    }
  });
  var pl = totalCost > 0 ? totalMv - totalCost : null;
  var plp = totalCost > 0 ? (totalMv/totalCost - 1) * 100 : null;
  var best = null, worst = null;
  list.forEach(function(x){
    if(!best || x.plp > best.plp) best = x;
    if(!worst || x.plp < worst.plp) worst = x;
  });
  function card(k, v, d, c){
    return '<div class="logitem"><div class="k">' + k + '</div><div class="v ' + (c||"") + '">' + v +
           '</div><div class="muted" style="font-size:11px;margin-top:3px">' + d + '</div></div>';
  }
  if(!n){
    box.innerHTML = '<div class="logitem" style="grid-column:1/-1"><div class="k">持仓盈亏</div>' +
      '<div class="v muted">—</div><div class="muted" style="font-size:11.5px">在上表填写「成本」与「数量」后自动生成</div></div>';
    return;
  }
  var h = "";
  h += card("总市值", (totalMv/10000).toFixed(2) + " 万", n + " 只已填成本数量");
  h += card("总成本", (totalCost/10000).toFixed(2) + " 万", "按你的成本价计");
  h += card("浮动盈亏", (pl==null?"—":((pl>=0?"+":"") + Math.round(pl).toLocaleString())),
            (plp==null?"":((plp>=0?"+":"") + plp.toFixed(2) + "%")), pl==null?"":(pl>=0?"up":"down"));
  h += card("最强 / 最弱",
            (best ? esc(best.nm) + " " + (best.plp>=0?"+":"") + best.plp.toFixed(1) + "%" : "—") + " / " +
            (worst ? esc(worst.nm) + " " + (worst.plp>=0?"+":"") + worst.plp.toFixed(1) + "%" : "—"),
            "仅统计已填成本数量的标的");
  box.innerHTML = h;
}

/* ============================================================
   三、快捷搜索（Ctrl / Cmd + K）
   ============================================================ */
function cmdkItems(){
  var out = [];
  state.holdings.forEach(function(h){
    out.push({t:h.name + "　" + h.code, s:"持仓", fn:function(){ tab("stock"); pickStock(h.code); }});
  });
  ["000001 上证指数", "399001 深证成指", "399006 创业板指"].forEach(function(x){
    var p = x.split(" ");
    out.push({t:x, s:"指数", fn:function(){ tab("market"); }});
  });
  var pages = [["dash","仪表盘"],["market","大盘环境"],["sector","板块轮动"],["stock","个股诊断"],
    ["holdings","持仓管理"],["report","复盘报告"],["compare","走势对比"],["notes","复盘笔记"],
    ["alerts","大事提醒"],["admin","数据后台"],["help","关于 / 说明"]];
  pages.forEach(function(p){
    out.push({t:p[1], s:"页面", fn:function(){ tab(p[0]); }});
  });
  return out;
}
function openCmdk(){
  var host = $("cmdk"); if(!host) return;
  var items = cmdkItems();
  var sel = 0;
  host.style.display = "";
  host.innerHTML = '<div class="cmdk"><div class="box">' +
    '<input id="cmdkInp" placeholder="搜索标的 / 页面…（↑↓ 选择，回车跳转，Esc 关闭）">' +
    '<div class="res" id="cmdkRes"></div></div></div>';
  var inp = $("cmdkInp"), res = $("cmdkRes");
  function draw(){
    var q = (inp.value || "").trim().toLowerCase();
    var list = items.filter(function(x){ return !q || x.t.toLowerCase().indexOf(q) >= 0; }).slice(0, 40);
    if(sel >= list.length) sel = 0;
    res.innerHTML = list.map(function(x, i){
      return '<div class="it' + (i===sel?" sel":"") + '" data-i="' + i + '"><span>' + esc(x.t) +
             '</span><span class="muted" style="font-size:11.5px">' + x.s + '</span></div>';
    }).join("") || '<div class="it muted">无匹配</div>';
    [].forEach.call(res.querySelectorAll(".it"), function(d){
      d.onmouseenter = function(){ sel = +d.getAttribute("data-i"); draw(); };
      d.onclick = function(){ go(list[+d.getAttribute("data-i")]); };
    });
    res._list = list;
  }
  function go(x){ close(); if(x && x.fn) x.fn(); }
  function close(){ host.style.display = "none"; host.innerHTML = ""; }
  inp.oninput = function(){ sel = 0; draw(); };
  inp.onkeydown = function(e){
    var list = res._list || [];
    if(e.key === "ArrowDown"){ sel = Math.min(list.length-1, sel+1); draw(); e.preventDefault(); }
    else if(e.key === "ArrowUp"){ sel = Math.max(0, sel-1); draw(); e.preventDefault(); }
    else if(e.key === "Enter"){ go(list[sel]); e.preventDefault(); }
    else if(e.key === "Escape"){ close(); }
  };
  host.onclick = function(e){ if(e.target === host || e.target.className === "cmdk") close(); };
  draw(); inp.focus();
}
function bindCmdk(){
  var bs = $("btnSearch");
  if(bs) bs.onclick = function(){ openCmdk(); };
  try{
    document.addEventListener("keydown", function(e){
      if((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")){ e.preventDefault(); openCmdk(); }
      if(e.key === "Escape"){ var h = $("cmdk"); if(h && h.style.display !== "none"){ h.style.display = "none"; h.innerHTML = ""; } }
    });
  }catch(e){}
}

/* ============================================================
   四、关于页
   ============================================================ */
var CHANGELOG = [
  ["2.2", "2026-09-14", "<b>复盘增强 + 稳定性提升</b>：复盘日历热力图（按日可视化评分/盈亏分布）；持仓评分雷达图（多维对比）；复盘模板向导（引导式每日复盘）；全局错误捕获 + 渲染保护；复盘模式增加迷你K线图与快速笔记；个股诊断提醒面板；笔记模板+标签系统；标的分组；隐私发布检查。"],
  ["2.1", "2026-09-12", "<b>复盘工作流全面优化</b>：浮动快捷加标的面板（Ctrl+K 呼出）；拉取自动重试 + 备用源兜底；仪表盘市场脉搏 / 持仓异动 / 复盘检查清单 / 快速导航 / 复盘日记时间线；Toast 通知 / 市场状态指示 / 快捷键帮助 / URL hash 路由。"],
  ["2.0.0", "2026-09-12", "<b>大盘行情重做</b>：走势图新增<b>单指数 K线 / 收盘线</b>模式（可切上证·深成·创业板与日/周线），叠加<b>自动趋势线</b>（ZigZag 摆动点拟合上升/下降趋势线 + 水平支撑压力聚类 + 突破判定）、<b>趋势通道</b>、<b>艾略特波浪</b>（1-2-3-4-5 与 A-B-C，附浪型阶段进度条与自适应阈值）、均线、成交量副图；指数 KPI 卡加<b>迷你走势</b>与距 MA20 偏离；新增<b>指数相关性矩阵</b>与<b>日/周/月多周期共振</b>。<br>一句话添加标的（代码 / 拼音首字母 / 汉字 / 联网全市场检索，回车即加）；拉取层重写（腾讯直连优先 + JSONP 兜底 + 逐源失败诊断）；后台管理扩为六模块；深色 / 浅色 / 护眼三主题；指标数据字典；<b>隐私默认：不内置、不上传任何持仓</b>。"],
  ["1.1.0", "2026-09-11", "多空信号点、支撑压力线与趋势通道、副图 MACD / KDJ / RSI 切换；指数归一化走势图；主线 × 持仓映射。"],
  ["1.0.0", "2026-09-11", "首个可用版本：四步复盘框架（大盘环境 → 板块轮动 → 个股诊断 → 风险情景），指标全部本地计算，公开行情快照离线可用，Markdown 报告导出。"]
];
function renderAbout(){
  var box = $("changelog");
  if(box){
    var h = "";
    CHANGELOG.forEach(function(c){
      h += '<div style="margin-bottom:7px"><b style="color:var(--txt)">v' + c[0] + '</b> ' +
           '<span class="muted">' + c[1] + '</span><br>' + c[2] + '</div>';
    });
    box.innerHTML = h;
  }
  var vb = $("verBadge");
  if(vb) vb.textContent = "v" + APPVER + " · " + APPDATE;
  var f = $("footDate");
  if(f && (!f.textContent || f.textContent === "—")) f.textContent = (typeof SNAPSHOT_DATE !== "undefined" ? SNAPSHOT_DATE : APPDATE);
}

/* ============================================================
   五、v2.0 初始化
   ============================================================ */
/* 注意：init() 在 engine10 顶层同步执行，而 engine11 ~ 13 的顶层 var
   （PREF / LS_KEYS / TASK / SRC_LABEL …）要到整个脚本求值完才赋值。
   若在这里同步调用 renderAdmin() 等，函数内部会拿到 undefined：
   实测 renderStoragePanel 读 LS_KEYS.forEach 抛错，被外层 catch 吞掉后，
   「大事提醒 / 关于 / 持仓 / 指数图」等后续步骤全部不再执行。
   因此 v2 步骤「分步 try + 延后一个事件循环」执行，单步失败不再拖垮整条引导链。 */
var _initBase = init;
function v2InitSteps(){
  var steps = [
    ["cfgLoad", cfgLoad], ["apiLogLoadOnce", apiLogLoadOnce], ["alertLoad", alertLoad],
    ["posLoad", posLoad], ["klSetLoad", klSetLoad],
    ["bindKlSet", bindKlSet], ["bindAdmin", bindAdmin], ["bindAlerts", bindAlerts], ["bindCmdk", bindCmdk],
    ["klSetSyncUI", klSetSyncUI],
    ["renderAdmin", renderAdmin], ["renderAlerts", renderAlerts], ["renderAbout", renderAbout],
    ["renderHoldings", renderHoldings], ["renderPosSummary", renderPosSummary],
    ["renderIdxChart", renderIdxChart]
  ];
  for(var i = 0; i < steps.length; i++){
    try{ steps[i][1](); }
    catch(e){
      if(typeof console !== "undefined" && console.error) console.error("v2 init · " + steps[i][0] + ":", e);
    }
  }
  try{
    var n = checkAllAlerts();
    if(n > 0){
      var m = $("alMsg");
      if(m) m.textContent = "有 " + n + " 条提醒已触发，去「⑧ 大事提醒」查看";
    }
  }catch(e){}
  try{ flushCharts(); }catch(e){}
}
init = function(){
  _initBase();
  setTimeout(v2InitSteps, 0);   /* 延后一帧：等 engine11~13 顶层变量就位 */
};

/* 报告附加大事提醒 */
var _genReportV2 = genReport;
genReport = function(){
  var md = "";
  try{ md = _genReportV2(); }catch(e){ md = "# 报告生成失败\n\n" + e.message + "\n"; }
  try{
    if(md && md.indexOf("## 大事提醒") < 0){
      var blk = buildAlertBlock();
      if(md.indexOf("## 免责声明") >= 0){
        md = md.replace("## 免责声明", blk + "\n## 免责声明");
      } else {
        md = md + "\n\n" + blk;
      }
      LAST_REPORT = md;
      setReport(md);
    }
  }catch(e){}
  return md;
};

if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
else init();
