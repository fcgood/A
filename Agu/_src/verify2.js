const fs=require('fs'),vm=require('vm');
const html=fs.readFileSync('index.html','utf8');
const blocks=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
const src=blocks[blocks.length-1];
const dataSrc=blocks[0];
const all=dataSrc+"\n"+src;

function makeEl(id){
  const fn=function(){};fn._ds={};fn._v={};fn._id=id;fn._children=[];
  return new Proxy(fn,{
    get(o,p){
      if(p==='value')return o._v._val!==undefined?o._v._val:'';
      if(p==='dataset')return o._ds;
      if(p==='classList')return {toggle(){},add(){},remove(){},contains(){return false}};
      if(p==='style')return {};
      if(p==='checked')return o._v._ck!==undefined?o._v._ck:true;
      if(p==='selected')return false;
      if(p==='disabled')return false;
      if(p==='textContent'||p==='innerHTML')return o['_'+p]||'';
      if(p==='files')return [];
      if(p==='querySelectorAll')return ()=>[];
      if(p==='querySelector')return ()=>makeEl('q');
      if(p==='appendChild'||p==='removeChild'||p==='setAttribute'||p==='addEventListener'
         ||p==='focus'||p==='click'||p==='remove'||p==='resize'||p==='dispose')return ()=>{};
      if(p==='getAttribute')return ()=>null;
      if(p==='_c')return o._chart;
      return makeEl('x');
    },
    set(o,p,v){
      if(p==='value')o._v._val=v;
      else if(p==='checked')o._v._ck=v;
      else if(p==='_c')o._chart=v;
      else o['_'+p]=v;
      return true;
    },
    apply(){return makeEl('f');}
  });
}
const ELS={};
function getEl(id){ if(!ELS[id])ELS[id]=makeEl(id); return ELS[id]; }
const store={};
const chartStub=()=>({setOption(o){this._o=o;},dispose(){},resize(){},getDataURL(){return "data:image/png;base64,";},on(ev,fn){this["_on_"+ev]=fn;},getOption(){return this._o;}});
const sandbox={
  Math,JSON,Date,parseFloat,parseInt,isFinite,isNaN,setTimeout,setInterval,clearTimeout,console,
  Promise,Object,Array,String,Number,Boolean,RegExp,Error,Blob:function(){},URL:{createObjectURL:()=>"blob:",revokeObjectURL(){}},
  FileReader:function(){},
  requestAnimationFrame:(f)=>f(),
  alert:(m)=>console.log('[alert]',String(m).slice(0,80)),
  confirm:()=>false,
  echarts:{init:()=>chartStub(),version:'5'},
  document:{
    getElementById:getEl,
    querySelectorAll:()=>[],
    createElement:()=>makeEl('new'),
    body:makeEl('body'),
    addEventListener(){},
    readyState:'complete'
  },
  localStorage:{getItem:k=>store[k]||null,setItem:(k,v)=>store[k]=v,removeItem:k=>delete store[k]},
  location:{reload(){}},
  navigator:{userAgent:'node'}
};
sandbox.window=sandbox;
sandbox.window.addEventListener=()=>{};
vm.createContext(sandbox);
try{ vm.runInContext(all,sandbox,{filename:'app.js'}); }
catch(e){ console.log('LOAD_ERROR:',e.message); console.log(e.stack.split('\n').slice(0,4).join('\n')); process.exit(1); }
console.log('LOAD_OK');

const G=(e)=>vm.runInContext(e,sandbox);
const S=sandbox;
S.state=G('state'); S.SNAPSHOT_DATE=G('SNAPSHOT_DATE');
console.log('SNAPSHOT_DATE=',S.SNAPSHOT_DATE);
console.log('holdings=',S.state.holdings.length,'stocks=',Object.keys(S.state.stocks).length);

/* 逐只验证 */
let bad=[];
S.state.holdings.forEach(h=>{
  const an=S.getAn(h.code);
  if(!an){bad.push(h.code+':null');return;}
  const sc=an.score.total;
  const ok = sc>=0&&sc<=100 && Array.isArray(an.sigs) && an.tf && an.tf.length===3 && !!an.chan;
  console.log(
    (h.name+'        ').slice(0,10),
    'close='+an.close.toFixed(2),
    'score='+String(sc).padStart(3)+'('+an.score.label+')',
    'sigs='+String(an.sigs.length).padStart(3),
    'tf='+an.tf.map(t=>t.label).join('/'),
    'chan='+an.chan.dir,
    'poc='+(an.poc.poc!=null?an.poc.poc.toFixed(2):'-'),
    ok?'':'  <<< PROBLEM'
  );
  if(!ok)bad.push(h.code);
});
console.log('BAD:',bad.length?bad.join(','):'none');

/* 信号明细抽样 */
const an0=S.getAn('000933');
console.log('\n--- 神火股份 最近 6 个信号 ---');
an0.sigs.slice(0,6).forEach(s=>console.log('  ',s.date,s.side==='b'?'▲':'▼',s.nm,'|',s.ds.slice(0,60)));
console.log('--- 神火股份 三周期 ---');
an0.tf.forEach(t=>{console.log('  ['+t.tf+'] '+t.label);t.ev.forEach(e=>console.log('     ·',e));});
console.log('--- 神火股份 评分维度 ---',JSON.stringify(an0.score.dims));

/* markPoint / markLine */
S.CUR.code='000933';S.CUR.an=an0;S.CUR.period='daily';
const mp=S.buildMarkPoint(an0), ml=S.buildMarkLine(an0);
console.log('\nmarkPoint count=',mp.data.length,'sample=',JSON.stringify(mp.data[0]).slice(0,150));
console.log('markLine count=',ml.data.length,'sample=',JSON.stringify(ml.data[0]).slice(0,140));

/* drawKline 三种副图 + 周线 */
['macd','kdj','rsi'].forEach(s=>{S.CUR.sub=s;S.drawKline();console.log('drawKline sub='+s+' OK');});
S.CUR.period='weekly';S.drawKline();console.log('drawKline weekly OK');
S.CUR.period='daily';

/* 报告 */
const rep=S.genReport();
console.log('\nREPORT len=',rep.length);
['第一步','第二步','第三步','第四步','免责声明','多空技术信号','短 / 中 / 长 三周期研判','技术评分分解',
 '热门板块与主力资金','市场宽度','密集成交区 POC','趋势判断（相对均线'].forEach(k=>{
  console.log('  has "'+k+'":',rep.includes(k));
});
console.log('  RSI(14)= count:',(rep.match(/RSI\(14\)=/g)||[]).length);
console.log('  数据缺失 count:',(rep.match(/数据缺失/g)||[]).length);

/* 仪表盘 */
S.renderDash();
console.log('\nrenderDash OK; dashKpi len=',(ELS['dashKpi']||{})._innerHTML?ELS['dashKpi']._innerHTML.length:0);
console.log('rankTbl len=',((ELS['rankTbl']||{})._innerHTML||'').length);
console.log('sigFeed len=',((ELS['sigFeed']||{})._innerHTML||'').length);

/* 报告前若干行 */
console.log('\n===== 报告节选（大盘 + 个股首只）=====');
const lines=rep.split('\n');
const iStock=lines.findIndex(l=>l.indexOf('【')===0);
console.log(lines.slice(0,26).join('\n'));
console.log('...');
console.log(lines.slice(iStock,iStock+34).join('\n'));
