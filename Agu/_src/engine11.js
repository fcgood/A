/* ============================================================
   engine11 · 智能添加 + 数据拉取 v2
   ------------------------------------------------------------
   1) 一句话添加：代码 / 拼音首字母 / 汉字 / 简称 → 实时候选 → 回车即加
      本地索引 992 条 + 腾讯 smartbox 全市场联网兜底（script 标签，
      天然绕过 CORS，因为接口返回的是 JS 变量赋值语句）
   2) 拉取根治：腾讯 web.ifzq（响应头 ACAO:*，浏览器直连可用）优先，
      新浪 JSONP 兜底，东财最后；逐源记录诊断，失败说清"卡在哪"
   ============================================================ */

var FETCH_DIAG = [];

/* ---------- 市场归属 ---------- */
function mktOf(code){
  code = String(code || "");
  if(/^(6|9)/.test(code))  return "sh";
  if(/^(5)/.test(code))    return "sh";
  if(/^(0|3)/.test(code))  return "sz";
  if(/^(1)/.test(code))    return "sz";
  if(/^(4|8)/.test(code))  return "bj";
  return "sz";
}
function isEtfCode(code){
  return /^(1[15689]|5[0168])/.test(String(code || ""));
}
function typeOfCode(code, name){
  if(isEtfCode(code)) return "ETF";
  if(/^(000001|399|000300|000905|000852|899050|000016|000010|000688|932000)/.test(String(code))) return "IDX";
  if(name && /ETF$|指数$|LOF$|REIT$/.test(name)) return "ETF";
  return "A";
}

/* ============================================================
   一、腾讯 smartbox 全市场搜索（script 标签，无 CORS 问题）
   ============================================================ */
function parseVHint(txt){
  var m = String(txt || "").match(/v_hint\s*=\s*"([^"]*)"/);
  if(!m) return [];
  var hint = "";
  try{ hint = JSON.parse('"' + m[1] + '"'); }catch(e){ hint = m[1]; }
  var out = [];
  hint.split("^").forEach(function(x){
    var p = x.split("~");
    if(p.length < 5) return;
    var mk = p[0], code = p[1], name = p[2], py = p[3], type = p[4];
    if(mk !== "sh" && mk !== "sz" && mk !== "bj") return;
    if(!/^[0-9]{6}$/.test(code)) return;
    if(/\(|\（/.test(name)) return;            /* 过滤带括号的非标准品种 */
    out.push({code:code, name:name, py:py, mk:mk, type:type});
  });
  return out;
}

var _sbSeq = 0;
function txSmartbox(q, cb){
  if(!q) { cb([]); return; }
  var s = document.createElement("script");
  var done = false;
  var tag = "__sbq" + (++_sbSeq);
  var fin = function(items){
    if(done) return; done = true;
    try{ if(s.parentNode) s.parentNode.removeChild(s); }catch(e){}
    cb(items || []);
  };
  /* 先清空全局，避免读到上一次结果 */
  try{ window.v_hint = ""; }catch(e){}
  s.charset = "utf-8";
  s.onload = function(){
    var items = [];
    try{
      items = parseVHint(window.v_hint || "");
      if(!items.length) items = parseVHint(window[tag] || "");
    }catch(e){}
    fin(items);
  };
  s.onerror = function(){ fin([]); };
  s.src = "https://smartbox.gtimg.cn/s3/?q=" + encodeURIComponent(q) + "&t=all";
  (document.body || document.documentElement).appendChild(s);
  setTimeout(function(){ fin([]); }, 6000);
}

/* ============================================================
   二、本地索引检索（992 条）
   ============================================================ */
/* a 是否为 b 的子序列（gmt ⊂ gzmt） */
function isSubSeq(a, b){
  var i = 0, j = 0;
  while(i < a.length && j < b.length){ if(a.charAt(i) === b.charAt(j)) i++; j++; }
  return i === a.length;
}

function searchLocal(q, limit){
  q = String(q || "").trim().toLowerCase();
  if(!q) return [];
  limit = limit || 14;
  var res = [], seen = {}, codes = Object.keys(NAME_IDX), i, v, c;
  var push = function(code, tag){
    if(seen[code]) return false;
    seen[code] = 1;
    v = NAME_IDX[code];
    res.push({code:code, name:v.name, py:v.py, src:tag});
    return res.length >= limit;
  };
  /* 1. 代码前缀 */
  for(i = 0; i < codes.length; i++){ if(codes[i].indexOf(q) === 0){ if(push(codes[i], "代码")) return res; } }
  /* 2. 拼音首字母前缀 */
  if(/^[a-z]+$/.test(q)){
    for(i = 0; i < codes.length; i++){
      v = NAME_IDX[codes[i]];
      if(v.py && v.py.indexOf(q) === 0){ if(push(codes[i], "拼音")) return res; }
    }
  }
  /* 3. 拼音简写：首字母相同 + 是子序列（gmt ⊂ gzmt → 贵州茅台，优于 mgmt 的「麦格米特」） */
  if(/^[a-z]{2,6}$/.test(q)){
    for(i = 0; i < codes.length; i++){
      v = NAME_IDX[codes[i]];
      if(v.py && v.py.charAt(0) === q.charAt(0) && isSubSeq(q, v.py)){ if(push(codes[i], "拼音")) return res; }
    }
  }
  /* 4. 名称包含 */
  for(i = 0; i < codes.length; i++){
    v = NAME_IDX[codes[i]];
    if(v.name && v.name.toLowerCase().indexOf(q) >= 0){ if(push(codes[i], "名称")) return res; }
  }
  /* 4. 拼音包含 */
  if(/^[a-z]+$/.test(q)){
    for(i = 0; i < codes.length; i++){
      v = NAME_IDX[codes[i]];
      if(v.py && v.py.indexOf(q) > 0){ if(push(codes[i], "拼音")) return res; }
    }
  }
  /* 5. 代码包含 */
  for(i = 0; i < codes.length; i++){
    if(codes[i].indexOf(q) > 0){ if(push(codes[i], "代码")) return res; }
  }
  return res;
}

/* 合并检索：先给本地（即时），联网到达后回调第二次 */
function searchStock(q, cb, useNet){
  q = String(q || "").trim();
  if(!q){ cb([], true); return; }
  var local = searchLocal(q, 14);
  cb(local, false);                       /* 第一批：本地 */
  if(useNet === false) { cb(local, true); return; }
  var need = (local.length < 6) || /^[\u4e00-\u9fa5]{2,}$/.test(q);
  if(!need){ cb(local, true); return; }
  txSmartbox(q, function(items){
    var seen = {}, merged = [];
    local.forEach(function(x){ seen[x.code] = 1; merged.push(x); });
    items.forEach(function(it){
      if(seen[it.code]) return;
      seen[it.code] = 1;
      merged.push({code:it.code, name:it.name, py:it.py, src:"网络"});
    });
    cb(merged.slice(0, 18), true);
  });
}

/* ============================================================
   三、智能输入控件（任意 input.qa 自动绑定）
   ============================================================ */
var QA = {el:null, pop:null, items:[], idx:-1, timer:null, seq:0, onPick:null};

function qaEnsurePop(){
  if(QA.pop && document.body.contains(QA.pop)) return QA.pop;
  var p = document.createElement("div");
  p.id = "qaPop";
  p.style.cssText = "position:absolute;z-index:9999;display:none;max-height:330px;overflow:auto;" +
    "background:var(--card);border:1px solid var(--line);border-radius:10px;" +
    "box-shadow:0 12px 32px rgba(0,0,0,.45);min-width:280px";
  document.body.appendChild(p);
  QA.pop = p;
  return p;
}

function qaClose(){
  if(QA.pop) QA.pop.style.display = "none";
  QA.el = null; QA.items = []; QA.idx = -1;
}

function qaRender(){
  var pop = qaEnsurePop(), el = QA.el;
  if(!el) return;
  if(!QA.items.length){ pop.style.display = "none"; return; }
  var r = el.getBoundingClientRect();
  var top = r.bottom + window.scrollY + 4;
  var left = r.left + window.scrollX;
  var maxLeft = document.documentElement.clientWidth - 300;
  if(left > maxLeft) left = Math.max(8, maxLeft);
  pop.style.left = left + "px";
  pop.style.top = top + "px";
  pop.style.minWidth = Math.max(260, r.width) + "px";
  var html = "";
  QA.items.forEach(function(it, i){
    var hl = (i === QA.idx) ? "background:var(--accent);color:#fff" : "";
    var tag = it.src === "网络" ? '<span style="color:#6ee79f;font-size:11px">网</span>'
            : '<span style="opacity:.55;font-size:11px">' + it.src + '</span>';
    var inList = state.holdings.some(function(h){ return h.code === it.code; });
    html += '<div data-i="' + i + '" class="qa-item" style="padding:7px 11px;cursor:pointer;' + hl +
      'display:flex;gap:9px;align-items:center;font-size:13px">' +
      '<b style="font-family:ui-monospace,Consolas,monospace;min-width:52px">' + it.code + '</b>' +
      '<span style="flex:1">' + esc(it.name) + '</span>' + tag +
      (inList ? '<span style="font-size:11px;opacity:.7">已持有</span>' : '') +
      '</div>';
  });
  pop.innerHTML = html;
  pop.style.display = "block";
  Array.prototype.forEach.call(pop.querySelectorAll(".qa-item"), function(d){
    d.onmouseenter = function(){ QA.idx = +d.dataset.i; qaRender(); };
    d.onmousedown = function(e){ e.preventDefault(); qaPick(QA.items[+d.dataset.i]); };
  });
}

function qaPick(it){
  if(!it) return;
  var el = QA.el;
  qaClose();
  if(el){ el.value = it.code; }
  if(QA.onPick) QA.onPick(it);
  else qaAdd(it);
}

/* 默认行为：加入持仓 + 无数据则自动拉取 */
async function qaAdd(it, opt){
  opt = opt || {};
  var t = typeOfCode(it.code, it.name);
  var has = state.holdings.find(function(h){ return h.code === it.code; });
  if(!has){
    state.holdings.push({code:it.code, name:it.name, type:t, inReport:true, group:"持仓"});
    saveState();
  }
  var haveData = !!(state.stocks[it.code] && state.stocks[it.code].rows && state.stocks[it.code].rows.length > 20);
  if(!haveData){
    try{ await fetchStockData(it.code); }catch(e){}
  }
  if(typeof renderHoldings === "function") renderHoldings();
  if(typeof renderRail === "function") renderRail();
  if(typeof renderDash === "function") renderDash();
  if(opt.silent !== true){
    var n = (state.stocks[it.code] && state.stocks[it.code].rows) ? state.stocks[it.code].rows.length : 0;
    qaToast((has ? "已存在：" : "已添加：") + it.name + "（" + it.code + "）· " +
      (n > 0 ? n + " 根日K" : "暂无数据，可点「联网拉取」或粘贴"));
  }
  return it;
}

function qaToast(msg){
  var t = document.getElementById("qaToast");
  if(!t){
    t = document.createElement("div");
    t.id = "qaToast";
    t.style.cssText = "position:fixed;left:50%;bottom:38px;transform:translateX(-50%);z-index:10000;" +
      "background:var(--card);border:1px solid var(--line);border-radius:10px;padding:10px 18px;" +
      "font-size:13px;box-shadow:0 8px 26px rgba(0,0,0,.4);max-width:80vw";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.display = "block";
  clearTimeout(t._tm);
  t._tm = setTimeout(function(){ t.style.display = "none"; }, 2800);
}

function qaBind(el, onPick){
  if(!el || el._qa) return;
  el._qa = 1;
  el.setAttribute("autocomplete", "off");
  el.placeholder = el.placeholder || "输入代码 / 拼音 / 名称，如 600519、gmt、茅台";
  el.addEventListener("input", function(){
    QA.el = el; QA.onPick = onPick || null;
    var q = el.value.trim();
    clearTimeout(QA.timer);
    if(!q){ qaClose(); return; }
    var seq = ++QA.seq;
    QA.timer = setTimeout(function(){
      searchStock(q, function(items, done){
        if(seq !== QA.seq || QA.el !== el) return;
        QA.items = items; QA.idx = items.length ? 0 : -1;
        qaRender();
      });
    }, 200);
  });
  el.addEventListener("keydown", function(e){
    if(!QA.pop || QA.pop.style.display === "none") {
      if(e.key === "Enter" && el.value.trim()){ e.preventDefault(); qaSubmitRaw(el, onPick); }
      return;
    }
    if(e.key === "ArrowDown"){ e.preventDefault(); QA.idx = Math.min(QA.items.length - 1, QA.idx + 1); qaRender(); }
    else if(e.key === "ArrowUp"){ e.preventDefault(); QA.idx = Math.max(0, QA.idx - 1); qaRender(); }
    else if(e.key === "Enter"){
      e.preventDefault();
      qaPick(QA.items[QA.idx >= 0 ? QA.idx : 0]);
    }
    else if(e.key === "Escape"){ qaClose(); }
  });
  el.addEventListener("blur", function(){ setTimeout(qaClose, 180); });
}

/* 直接回车（未选候选）时也走一次检索 */
async function qaSubmitRaw(el, onPick){
  var q = el.value.trim();
  if(!q) return;
  var local = searchLocal(q, 1);
  if(local.length){ qaPick(local[0]); return; }
  txSmartbox(q, function(items){
    if(items.length){ qaPick({code:items[0].code, name:items[0].name, py:items[0].py, src:"网络"}); }
    else if(/^\d{6}$/.test(q)){
      qaPick({code:q, name:nameOf(q) || ("代码" + q), py:"", src:"代码"});
    }
    else qaToast("没找到「" + q + "」，换个关键词试试（支持代码 / 拼音首字母 / 名称）");
  });
}

function qaBindAll(root){
  var list = (root || document).querySelectorAll("input.qa");
  Array.prototype.forEach.call(list, function(el){ qaBind(el); });
}

/* ============================================================
   四、拉取 v2：多源 + 诊断（覆盖 engine3 的同名函数）
   ============================================================ */
var SRC_LABEL = {tx:"腾讯行情", sina:"新浪财经", em:"东方财富"};

function diagText(){
  if(!FETCH_DIAG.length) return "";
  return FETCH_DIAG.map(function(d){
    return "· " + (SRC_LABEL[d.src] || d.src) + "：" +
      (d.ok ? ("成功 " + d.n + " 根 / " + d.ms + "ms") : ("失败 — " + d.err + " / " + d.ms + "ms"));
  }).join("\n");
}

async function fetchStockData(code, opt){
  opt = opt || {};
  var n = opt.n || 320;
  code = String(code || "").replace(/\D/g, "").slice(0, 6);
  if(code.length !== 6) return 0;

  var order = (APICFG && APICFG.order && APICFG.order.length) ? APICFG.order.slice() : ["tx", "sina", "em"];
  /* 腾讯接口响应头带 ACAO:*，浏览器直连成功率最高，默认排最前 */
  if(order.indexOf("tx") < 0) order.unshift("tx");
  FETCH_DIAG = [];
  var rows = null, used = "";

  for(var i = 0; i < order.length; i++){
    var src = order[i];
    if(APICFG && APICFG.on && APICFG.on[src] === false) continue;
    var t0 = Date.now();
    try{
      var raw = null;
      if(src === "tx")        raw = await withTimeout(fetchTx(code, n), 10000);
      else if(src === "sina") raw = await withTimeout(fetchSinaN(code, n), 10000);
      else if(src === "em")   raw = await withTimeout(fetchEm(code, n), 10000);
      var ms = Date.now() - t0;
      var r = (raw && raw.length) ? normRaw(raw) : [];
      if(r.length >= 8){
        rows = r; used = src;
        FETCH_DIAG.push({src:src, ok:true, ms:ms, n:r.length});
        break;
      }
      FETCH_DIAG.push({src:src, ok:false, ms:ms, err:"返回数据不足（" + r.length + " 根）"});
    }catch(e){
      FETCH_DIAG.push({src:src, ok:false, ms:Date.now() - t0,
        err:String((e && e.message) || e || "未知").slice(0, 60)});
    }
  }

  if(typeof apiLog === "function"){
    apiLog({t:new Date().toISOString().slice(0, 19).replace("T", " "), src:used || "-",
      code:code, ok:!!rows, n:rows ? rows.length : 0,
      ms:(FETCH_DIAG.length ? FETCH_DIAG[FETCH_DIAG.length - 1].ms : 0)});
  }

  if(!rows || !rows.length){
    LAST_FETCH_ERR = "全部数据源均未取到数据\n" + diagText();
    return 0;
  }
  state.stocks[code] = {rows:rows};
  if(typeof clearAn === "function") clearAn(code);
  if(typeof saveState === "function") saveState();
  var h = state.holdings.find(function(x){ return x.code === code; });
  if(h && (!h.name || /^代码/.test(h.name))){
    h.name = (NAME_IDX[code] && NAME_IDX[code].name) || h.name;
  }
  LAST_FETCH_ERR = "";
  if(typeof renderAdmin === "function" && document.getElementById("admin") &&
     document.getElementById("admin").classList.contains("on")) renderAdmin();
  return rows.length;
}

/* 批量拉取：带进度回调 */
async function fetchMany(codes, onProgress){
  var done = 0, fail = [], i;
  for(i = 0; i < codes.length; i++){
    var c = codes[i];
    if(onProgress) onProgress(i, codes.length, c);
    try{
      var n = await fetchStockData(c);
      if(n > 0) done++; else fail.push(c);
    }catch(e){ fail.push(c); }
  }
  if(onProgress) onProgress(codes.length, codes.length, "");
  return {done:done, fail:fail};
}

/* 拉取失败时的可读引导 */
function fetchFailGuide(code){
  var name = nameOf(code) || code;
  var msg = "「" + name + "（" + code + "）」联网拉取未成功。\n\n尝试记录：\n" +
    (diagText() || "（未发起请求）") +
    "\n\n常见原因：\n" +
    "1. 当前网络无法访问外网行情接口（公司/校园网常屏蔽）\n" +
    "2. 浏览器插件（广告拦截 / 隐私防护）拦截了跨域请求\n" +
    "3. 用 file:// 打开时部分浏览器限制更严，可改用本地小服务器\n\n" +
    "建议：直接粘贴日K数据（支持 Excel / 通达信 / 同花顺复制）。\n" +
    "已为你准备好粘贴模板，点确定后可直接填入。";
  return msg;
}

/* 粘贴模板（一行表头 + 一行示例） */
function pasteTemplate(){
  return "日期,开盘,最高,最低,收盘,成交量\n2026-09-10,31.20,31.80,31.05,31.60,38210000";
}

/* ============================================================
   五、批量文本解析升级：支持"一句话"混排
   允许：600519 贵州茅台 / 茅台 / gmt / 600519,gmt / 多行
   ============================================================ */
function parseSmart(text){
  var out = [];
  if(!text) return out;
  var lines = String(text).split(/[\r\n;；]+/);
  for(var i = 0; i < lines.length; i++){
    var ln = lines[i].trim();
    if(!ln) continue;
    var parts = ln.split(/[,，、\t| ]+/);
    for(var j = 0; j < parts.length; j++){
      var p = String(parts[j]).trim();
      if(!p) continue;
      var hit = searchLocal(p, 1)[0];
      if(hit){ out.push({code:hit.code, name:hit.name}); continue; }
      /* 退一步：从整段里抠 6 位代码（处理「600519 贵州茅台」被切开的情况） */
      var mc = p.match(/\d{6}/);
      if(mc) out.push({code:mc[0], name:nameOf(mc[0]) || ("代码" + mc[0])});
    }
  }
  var seen = {}, res = [];
  out.forEach(function(x){
    if(seen[x.code]) return;
    seen[x.code] = 1;
    res.push({code:x.code, name:x.name, type:typeOfCode(x.code, x.name)});
  });
  return res;
}
