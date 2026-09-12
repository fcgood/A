/* ============================================================
   engine9 · 数据层（v2.0）
   1) 三数据源自动回退：腾讯 → 东财 → 新浪
   2) API 后台：源开关 / 优先级 / 模板编辑 / 代理 / 调用日志 / 体检
   ============================================================ */

var LAST_FETCH_ERR = "";
var SRC_META = {
  sina:{nm:"新浪财经", cors:false, note:"JSONP，兼容性最好，偶发限流"},
  tx:  {nm:"腾讯证券",  cors:true,  note:"fetch 直连，前复权日K，速度快"},
  em:  {nm:"东方财富",  cors:true,  note:"fetch 直连，数据全，含成交额"}
};

/* ---------- 代码 → 各源符号 ---------- */
function mktPrefix(code){
  code = String(code||"");
  var c = code.replace(/\D/g,"");
  if(/^(6|9|5|11|78|113|132)/.test(c)) return "sh";
  if(/^(8|4|92)/.test(c)) return "bj";
  return "sz";
}
function symFor(src, code){
  if(src === "em") return emSecid(code);
  return mktPrefix(code) + String(code).replace(/\D/g,"");
}
function emSecid(code){
  var p = mktPrefix(code);
  var m = (p === "sh") ? "1" : "0";
  return m + "." + String(code).replace(/\D/g,"");
}
function withProxy(u){
  var p = (APICFG && APICFG.proxy ? APICFG.proxy : "").trim();
  if(!p) return u;
  if(p.indexOf("{URL}") >= 0) return p.replace("{URL}", encodeURIComponent(u));
  return p + encodeURIComponent(u);
}
function srcUrl(src, code, n){
  var tpl = (APICFG && APICFG.tpl && APICFG.tpl[src]) ? APICFG.tpl[src] : "";
  var u = tpl.replace(/\{SYM\}/g, symFor(src, code))
             .replace(/\{SECID\}/g, emSecid(code))
             .replace(/\{N\}/g, n || 320);
  return withProxy(u);
}

/* ---------- 单源取数 ---------- */
function withTimeout(p, ms){
  return new Promise(function(res, rej){
    var done = false;
    var t = setTimeout(function(){ if(!done){ done = true; rej(new Error("超时")); } }, ms);
    p.then(function(v){ if(!done){ done = true; clearTimeout(t); res(v); } },
           function(e){ if(!done){ done = true; clearTimeout(t); rej(e); } });
  });
}
function fetchTx(code, n){
  var u = srcUrl("tx", code, n);
  return withTimeout(fetch(u, {cache:"no-store"}).then(function(r){
    if(!r.ok) throw new Error("HTTP " + r.status);
    return r.json();
  }), 9000).then(function(j){
    var key = symFor("tx", code);
    var d = j && j.data && (j.data[key] || j.data[Object.keys(j.data || {})[0]]);
    if(!d) throw new Error("返回结构异常");
    var arr = d.qfqday || d.day || [];
    if(!arr.length) throw new Error("空数据");
    /* 腾讯顺序：日期,开,收,高,低,量 */
    return arr.map(function(x){
      return {day:x[0], open:x[1], close:x[2], high:x[3], low:x[4], volume:x[5]};
    });
  });
}
function fetchEm(code, n){
  var u = srcUrl("em", code, n);
  return withTimeout(fetch(u, {cache:"no-store"}).then(function(r){
    if(!r.ok) throw new Error("HTTP " + r.status);
    return r.json();
  }), 9000).then(function(j){
    var kl = j && j.data && j.data.klines;
    if(!kl || !kl.length) throw new Error("空数据");
    /* 东财：日期,开,收,高,低,量,额 */
    return kl.map(function(s){
      var a = String(s).split(",");
      return {day:a[0], open:a[1], close:a[2], high:a[3], low:a[4], volume:a[5]};
    });
  });
}
function fetchSinaN(code, n){
  return new Promise(function(resolve){
    var cb = "__k" + Math.random().toString(36).slice(2, 9);
    var s = document.createElement("script");
    var done = false;
    var fin = function(v){
      if(done) return; done = true;
      try{ delete window[cb]; }catch(e){}
      try{ document.body.removeChild(s); }catch(e){}
      resolve(v || []);
    };
    window[cb] = function(data){ fin(data || []); };
    s.onerror = function(){ fin([]); };
    s.src = srcUrl("sina", code, n) + "&cb=" + cb;
    document.body.appendChild(s);
    setTimeout(function(){ fin([]); }, 9000);
  }).then(function(raw){
    if(!raw || !raw.length) throw new Error("空数据");
    return raw.map(function(d){
      return {day:d.day, open:d.open, close:d.close, high:d.high, low:d.low, volume:d.volume};
    });
  });
}
function normRaw(list){
  var out = [], seen = {};
  for(var i=0;i<list.length;i++){
    var d = list[i];
    var day = normDate(d.day); if(!day) continue;
    var o = num(d.open), h = num(d.high), l = num(d.low), c = num(d.close), v = num(d.volume);
    if(o==null || h==null || l==null || c==null) continue;
    if(seen[day]) continue; seen[day] = 1;
    if(h < Math.max(o,c)) h = Math.max(o,c);
    if(l > Math.min(o,c)) l = Math.min(o,c);
    out.push([day, o, h, l, c, (v==null?0:v), null]);
  }
  out.sort(function(a,b){ return a[0] < b[0] ? -1 : (a[0] > b[0] ? 1 : 0); });
  return out;
}

/* ---------- 调用日志 ---------- */
function apiLog(rec){
  try{
    APILOG.unshift(rec);
    if(APILOG.length > 200) APILOG.length = 200;
    localStorage.setItem("ashare_apilog", JSON.stringify(APILOG.slice(0, 60)));
  }catch(e){}
}
function apiLogLoad(){
  try{
    var s = localStorage.getItem("ashare_apilog");
    if(s){ var a = JSON.parse(s); if(a && a.length) APILOG = a; }
  }catch(e){}
}
function cfgSave(){ try{ localStorage.setItem("ashare_apicfg", JSON.stringify(APICFG)); }catch(e){} }
function cfgLoad(){
  try{
    var s = localStorage.getItem("ashare_apicfg");
    if(s){
      var o = JSON.parse(s);
      if(o.tpl)   for(var k in o.tpl) APICFG.tpl[k] = o.tpl[k];
      if(o.order) APICFG.order = o.order;
      if(o.on)    for(var k2 in o.on) APICFG.on[k2] = o.on[k2];
      if(o.proxy != null) APICFG.proxy = o.proxy;
    }
  }catch(e){}
}

/* ---------- 主拉取入口（覆盖旧版单源） ---------- */
async function fetchStockData(code){
  var n = 320, errs = [];
  var order = (APICFG.order && APICFG.order.length) ? APICFG.order.slice() : ["tx","em","sina"];
  for(var i=0;i<order.length;i++){
    var src = order[i];
    if(APICFG.on && APICFG.on[src] === false) continue;
    var t0 = Date.now();
    try{
      var raw = (src === "sina") ? await fetchSinaN(code, n)
              : (src === "tx")   ? await fetchTx(code, n)
              :                    await fetchEm(code, n);
      var rows = normRaw(raw);
      var ms = Date.now() - t0;
      if(rows.length >= 8){
        state.stocks[code] = {rows: rows};
        clearAn(code);
        saveState();
        apiLog({t:t0, src:src, code:code, ok:true, n:rows.length, ms:ms,
                last:rows[rows.length-1][0]});
        return rows.length;
      }
      apiLog({t:t0, src:src, code:code, ok:false, n:rows.length, ms:ms, err:"条数不足"});
      errs.push(SRC_META[src].nm + " 仅 " + rows.length + " 条");
    }catch(e){
      apiLog({t:t0, src:src, code:code, ok:false, n:0, ms:Date.now()-t0,
              err:String((e && e.message) || e || "失败").slice(0, 70)});
      errs.push(SRC_META[src].nm + " " + String((e && e.message) || e).slice(0, 40));
    }
  }
  LAST_FETCH_ERR = errs.join("；") || "全部数据源不可用";
  return 0;
}

/* 批量拉取：带进度 + 明确失败原因 */
async function fetchAllHoldings(){
  var msg = $("holdMsg");
  var done = 0, fail = 0, fails = [];
  var list = state.holdings.slice();
  for(var i=0;i<list.length;i++){
    var h = list[i];
    if(msg) msg.textContent = "拉取中 " + (i+1) + "/" + list.length + " " + h.name + "…";
    try{
      var n = await fetchStockData(h.code);
      if(n > 0) done++; else { fail++; fails.push(h.name + "（" + LAST_FETCH_ERR + "）"); }
    }catch(e){ fail++; fails.push(h.name + "（异常）"); }
  }
  if(msg) msg.textContent = "完成：成功 " + done + " 只，失败 " + fail + " 只";
  renderHoldings(); renderRail(); renderDash(); renderAdmin();
  var tip = "批量拉取完成：成功 " + done + " 只，失败 " + fail + " 只。";
  if(fails.length){
    tip += "\n\n失败明细：\n· " + fails.slice(0, 8).join("\n· ");
    tip += "\n\n常见原因：① 公司网络拦截外网 ② 浏览器跨域限制（可开代理）③ 代码所属市场未覆盖。";
    tip += "\n可在「⑨ 数据后台」调整数据源顺序或在「个股诊断」直接粘贴日K。";
  }
  alert(tip);
}

/* ============================================================
   API 后台渲染
   ============================================================ */
function renderAdmin(){
  apiLogLoadOnce();
  renderApiStat();
  renderApiList();
  renderApiLog();
  renderHealth();
}
var _apiLogLoaded = false;
function apiLogLoadOnce(){ if(!_apiLogLoaded){ apiLogLoad(); _apiLogLoaded = true; } }

function renderApiStat(){
  var box = $("apiStat"); if(!box) return;
  var tot = APILOG.length, ok = 0, mssum = 0, srcOk = {};
  for(var i=0;i<APILOG.length;i++){
    var r = APILOG[i];
    if(r.ok){ ok++; srcOk[r.src] = 1; }
    mssum += (r.ms || 0);
  }
  var rate = tot ? (ok / tot * 100) : 0;
  var avg = tot ? Math.round(mssum / tot) : 0;
  var onN = 0;
  for(var s in SRC_META){ if(APICFG.on[s] !== false) onN++; }
  var h = "";
  h += card("启用数据源", onN + " / 3", "可在下方勾选 / 调序");
  h += card("累计调用", tot + " 次", "最近 200 条滚动保留");
  h += card("成功率", rate.toFixed(0) + "%", ok + " 成功 / " + (tot-ok) + " 失败");
  h += card("平均耗时", avg + " ms", "含网络往返，超时 9s");
  box.innerHTML = h;
  function card(k, v, d){
    return '<div class="logitem"><div class="k">' + k + '</div><div class="v">' + v +
           '</div><div class="muted" style="font-size:11px;margin-top:3px">' + d + '</div></div>';
  }
}

function renderApiList(){
  var box = $("apiList"); if(!box) return;
  var order = APICFG.order.slice();
  var h = '<table><thead><tr><th style="width:70px">优先级</th><th style="width:110px">数据源</th>' +
          '<th style="width:64px">启用</th><th>接口地址模板（{SYM} {SECID} {N} 为占位符，可自行修改）</th>' +
          '<th style="width:80px">操作</th></tr></thead><tbody>';
  for(var i=0;i<order.length;i++){
    var s = order[i], m = SRC_META[s] || {nm:s, note:""};
    h += '<tr>' +
      '<td><div class="flex" style="gap:4px">' +
        '<button class="btn sm" data-up="' + s + '" ' + (i===0?"disabled":"") + '>↑</button>' +
        '<button class="btn sm" data-dn="' + s + '" ' + (i===order.length-1?"disabled":"") + '>↓</button>' +
        '<span class="muted">' + (i+1) + '</span></div></td>' +
      '<td><b>' + m.nm + '</b><div class="muted" style="font-size:11px">' + m.note + '</div></td>' +
      '<td><input type="checkbox" data-on="' + s + '" ' + (APICFG.on[s]!==false?"checked":"") + ' style="width:auto"></td>' +
      '<td><input data-tpl="' + s + '" value="' + esc(APICFG.tpl[s]||"") + '" style="font-size:11.5px"></td>' +
      '<td><button class="btn sm" data-test="' + s + '">测试</button></td>' +
    '</tr>';
  }
  h += '</tbody></table>';
  h += '<div class="field" style="margin-top:10px"><label>CORS 代理前缀（可选，填了会走代理；用 {URL} 代表原始地址，不填则直接拼接）</label>' +
       '<input id="proxyInp" value="' + esc(APICFG.proxy||"") + '" placeholder="如 https://api.allorigins.win/raw?url={URL}"></div>';
  h += '<div class="flex"><button class="btn primary sm" id="cfgSave">保存配置</button>' +
       '<button class="btn sm" id="cfgReset">恢复默认地址</button>' +
       '<span class="muted" id="cfgMsg"></span></div>';
  box.innerHTML = h;

  [].forEach.call(box.querySelectorAll("button[data-up]"), function(b){
    b.onclick = function(){ moveSrc(b.getAttribute("data-up"), -1); };
  });
  [].forEach.call(box.querySelectorAll("button[data-dn]"), function(b){
    b.onclick = function(){ moveSrc(b.getAttribute("data-dn"), 1); };
  });
  [].forEach.call(box.querySelectorAll("input[data-on]"), function(cb){
    cb.onchange = function(){ APICFG.on[cb.getAttribute("data-on")] = cb.checked; cfgSave(); renderApiStat(); };
  });
  [].forEach.call(box.querySelectorAll("input[data-tpl]"), function(ip){
    ip.onchange = function(){ APICFG.tpl[ip.getAttribute("data-tpl")] = ip.value.trim(); cfgSave(); };
  });
  [].forEach.call(box.querySelectorAll("button[data-test]"), function(b){
    b.onclick = function(){ testSrc(b.getAttribute("data-test")); };
  });
  var pi = $("proxyInp");
  if(pi) pi.onchange = function(){ APICFG.proxy = pi.value.trim(); cfgSave(); };
  var cs = $("cfgSave");
  if(cs) cs.onclick = function(){ cfgSave(); apiMsg("配置已保存"); };
  var cr = $("cfgReset");
  if(cr) cr.onclick = function(){
    APICFG.tpl = {
      sina:"https://money.finance.sina.com.cn/quotes_service/api/json_v2.php/CN_MarketData.getKLineData?symbol={SYM}&scale=240&ma=5&datalen={N}",
      tx:"https://web.ifzq.gtimg.cn/appstock/app/fqkline/get?param={SYM},day,,,{N},qfq",
      em:"https://push2his.eastmoney.com/api/qt/stock/kline/get?secid={SECID}&fields1=f1,f2,f3&fields2=f51,f52,f53,f54,f55,f56,f57&klt=101&fqt=1&end=20500101&lmt={N}"
    };
    APICFG.proxy = ""; cfgSave(); renderAdmin(); apiMsg("已恢复默认");
  };
}
function apiMsg(t){
  var m = $("apiMsg"); if(m){ m.textContent = t; setTimeout(function(){ m.textContent = ""; }, 2200); }
  var m2 = $("cfgMsg"); if(m2){ m2.textContent = t; setTimeout(function(){ m2.textContent = ""; }, 2200); }
}
function moveSrc(s, d){
  var i = APICFG.order.indexOf(s);
  if(i < 0) return;
  var j = i + d;
  if(j < 0 || j >= APICFG.order.length) return;
  var t = APICFG.order[i]; APICFG.order[i] = APICFG.order[j]; APICFG.order[j] = t;
  cfgSave(); renderAdmin();
}
async function testSrc(s){
  apiMsg("测试 " + SRC_META[s].nm + " 中…（用 000063 中兴通讯）");
  var t0 = Date.now();
  try{
    var raw = (s === "sina") ? await fetchSinaN("000063", 60)
            : (s === "tx")   ? await fetchTx("000063", 60)
            :                  await fetchEm("000063", 60);
    var rows = normRaw(raw);
    apiLog({t:t0, src:s, code:"000063", ok:rows.length>=8, n:rows.length, ms:Date.now()-t0,
            err:rows.length>=8?"":"条数不足"});
    apiMsg(SRC_META[s].nm + "：" + (rows.length>=8 ? ("可用，" + rows.length + " 条，" + (Date.now()-t0) + "ms") : ("返回 " + rows.length + " 条，不可用")));
  }catch(e){
    apiLog({t:t0, src:s, code:"000063", ok:false, n:0, ms:Date.now()-t0, err:String(e.message||e).slice(0,60)});
    apiMsg(SRC_META[s].nm + "：失败 — " + String(e.message || e).slice(0, 60));
  }
  renderApiStat(); renderApiLog();
}
async function testAllSrc(){
  var order = APICFG.order.slice();
  for(var i=0;i<order.length;i++){
    if(APICFG.on[order[i]] === false) continue;
    await testSrc(order[i]);
  }
}

function renderApiLog(){
  var box = $("apiLog"); if(!box) return;
  if(!APILOG.length){ box.innerHTML = '<div class="empty">暂无调用记录。点上方「测速全部数据源」或去持仓页「批量联网拉取」试试。</div>'; return; }
  var h = '<table><thead><tr><th>时间</th><th>数据源</th><th>代码</th><th>结果</th><th class="num">条数</th><th class="num">耗时</th><th>说明</th></tr></thead><tbody>';
  for(var i=0;i<Math.min(APILOG.length, 200);i++){
    var r = APILOG[i];
    var dt = new Date(r.t || Date.now());
    var ts = String(dt.getHours()).padStart(2,"0") + ":" + String(dt.getMinutes()).padStart(2,"0") + ":" + String(dt.getSeconds()).padStart(2,"0");
    h += '<tr><td class="muted">' + ts + '</td>' +
         '<td>' + ((SRC_META[r.src] && SRC_META[r.src].nm) || r.src) + '</td>' +
         '<td>' + esc(r.code) + ' <span class="muted">' + esc(nameOf(r.code)) + '</span></td>' +
         '<td>' + (r.ok ? '<span class="pbadge ok">成功</span>' : '<span class="pbadge bad">失败</span>') + '</td>' +
         '<td class="num">' + (r.n||0) + '</td>' +
         '<td class="num">' + (r.ms||0) + 'ms</td>' +
         '<td class="muted">' + esc(r.err || (r.last ? ("最新 " + r.last) : "")) + '</td></tr>';
  }
  h += '</tbody></table>';
  box.innerHTML = h;
}
function exportLogCsv(){
  if(!APILOG.length){ apiMsg("暂无日志"); return; }
  var rows = [["时间","数据源","代码","结果","条数","耗时ms","说明"]];
  for(var i=0;i<APILOG.length;i++){
    var r = APILOG[i];
    rows.push([new Date(r.t).toLocaleString(), r.src, r.code, r.ok?"成功":"失败", r.n, r.ms, r.err||""]);
  }
  var csv = rows.map(function(a){
    return a.map(function(v){ return '"' + String(v==null?"":v).replace(/"/g,'""') + '"'; }).join(",");
  }).join("\r\n");
  dl("api_log_" + Date.now() + ".csv", "\ufeff" + csv, "text/csv;charset=utf-8");
  apiMsg("日志已导出");
}
function dl(name, content, type){
  try{
    var b = new Blob([content], {type: type || "application/octet-stream"});
    var u = URL.createObjectURL(b);
    var a = document.createElement("a");
    a.href = u; a.download = name; a.click();
    setTimeout(function(){ URL.revokeObjectURL(u); }, 2000);
  }catch(e){}
}

/* ---------- 本机数据体检 ---------- */
function renderHealth(){
  var box = $("healthBox"); if(!box) return;
  var codes = Object.keys(state.stocks || {});
  var withData = 0, totalRows = 0, latest = "";
  for(var i=0;i<codes.length;i++){
    var st = state.stocks[codes[i]];
    if(st && st.rows && st.rows.length >= 8){
      withData++; totalRows += st.rows.length;
      var d = st.rows[st.rows.length-1][0];
      if(d > latest) latest = d;
    }
  }
  var bytes = 0;
  try{ bytes = (localStorage.getItem(LS_KEY) || "").length; }catch(e){}
  var missing = [];
  for(var j=0;j<state.holdings.length;j++){
    var hh = state.holdings[j];
    var s2 = state.stocks[hh.code];
    if(!s2 || !s2.rows || s2.rows.length < 8) missing.push(hh.name || hh.code);
  }
  var h = "";
  h += '<div class="logitem"><div class="k">标的（含内嵌）</div><div class="v">' + codes.length +
       '</div><div class="muted" style="font-size:11px">其中 ' + withData + ' 只有有效日K</div></div>';
  h += '<div class="logitem"><div class="k">K线总根数</div><div class="v">' + totalRows +
       '</div><div class="muted" style="font-size:11px">最新日期 ' + (latest || "—") + '</div></div>';
  h += '<div class="logitem"><div class="k">本地存储占用</div><div class="v">' + (bytes/1024).toFixed(0) +
       ' KB</div><div class="muted" style="font-size:11px">浏览器上限通常 5 MB</div></div>';
  h += '<div class="logitem"><div class="k">持仓缺数据</div><div class="v ' + (missing.length?"down":"up") + '">' +
       missing.length + ' 只</div><div class="muted" style="font-size:11px">' +
       (missing.length ? esc(missing.slice(0,4).join("、")) + (missing.length>4?" 等":"") : "全部齐全") + '</div></div>';
  box.innerHTML = h;
}

/* ---------- 后台按钮绑定 ---------- */
function bindAdmin(){
  cfgLoad(); apiLogLoadOnce();
  var b;
  b = $("apiTest");   if(b) b.onclick = function(){ testAllSrc(); };
  b = $("apiLogClear"); if(b) b.onclick = function(){ APILOG = []; try{localStorage.removeItem("ashare_apilog");}catch(e){} renderApiStat(); renderApiLog(); apiMsg("日志已清空"); };
  b = $("apiLogExport"); if(b) b.onclick = exportLogCsv;
  b = $("apiCacheClear"); if(b) b.onclick = function(){
    if(!confirm("将清空所有已拉取/粘贴的K线缓存，内嵌数据不受影响。确定？")) return;
    state.stocks = {}; AN_CACHE = {}; saveState();
    state.holdings.forEach(function(h){ var d = defaultStockOf(h.code); if(d) state.stocks[h.code] = d; });
    saveState(); renderHealth(); renderHoldings(); apiMsg("缓存已清空并重建");
  };
  b = $("btnBackup2"); if(b) b.onclick = function(){
    dl("ashare_review_backup_" + Date.now() + ".json", JSON.stringify(state, null, 1), "application/json");
    apiMsg("已导出备份");
  };
  b = $("btnRestore2"); if(b) b.onclick = function(){ restoreJson(); };
  b = $("btnFactory"); if(b) b.onclick = function(){
    if(!confirm("将清空全部本地数据（持仓、笔记、提醒、配置）并恢复默认。确定？")) return;
    try{
      [LS_KEY, "ashare_notes_v1", "ashare_apilog", "ashare_apicfg", "ashare_klset", "ashare_alerts", "ashare_pos", "ashare_repfs"]
        .forEach(function(k){ localStorage.removeItem(k); });
    }catch(e){}
    location.reload();
  };
}
function defaultStockOf(code){
  try{
    if(typeof DEFAULT_STOCKS === "undefined") return null;
    var k = String(code);
    if(DEFAULT_STOCKS[k]) return DEFAULT_STOCKS[k];
    for(var q in DEFAULT_STOCKS){ if(String(q).indexOf(k) >= 0) return DEFAULT_STOCKS[q]; }
  }catch(e){}
  return null;
}
function restoreJson(){
  var inp = document.createElement("input");
  inp.type = "file"; inp.accept = ".json,application/json";
  inp.onchange = function(){
    var f = inp.files && inp.files[0]; if(!f) return;
    var fr = new FileReader();
    fr.onload = function(){
      try{
        var o = JSON.parse(String(fr.result));
        if(!o || !o.holdings) throw new Error("不是有效的备份文件");
        state = o; saveState(); location.reload();
      }catch(e){ alert("导入失败：" + e.message); }
    };
    fr.readAsText(f);
  };
  inp.click();
}
