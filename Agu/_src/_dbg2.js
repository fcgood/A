/* 大盘 option 真实 ECharts SSR 渲染校验（验证 option 结构合法 + 像素占比） */
const fs = require('fs'), vm = require('vm'), path = require('path');
const echarts = require(path.join(__dirname, '..', 'echarts.min.js'));
const src = fs.readFileSync(path.join(__dirname, 'verify7.js'), 'utf8');
const cut = src.indexOf("sec('1.");
let head = src.slice(0, cut).replace(
  'setOption(o) { lastOpt = o; this._o = o; }',
  'setOption(o) { lastOpt = o; global.__LAST = o; this._o = o; }');
const G = eval(head + '\nG;');

const cases = [
  ['K线·日·全叠加',  'IDXV.mode="kline";IDXV.pick="000001";IDXV.period="day";IDXV.trend=true;IDXV.chan=true;IDXV.wave=true;IDXV.ma=true;IDXV.vol=true;IDXV.span=60;'],
  ['K线·周·波浪',    'IDXV.mode="kline";IDXV.pick="000001";IDXV.period="week";IDXV.trend=true;IDXV.chan=true;IDXV.wave=true;IDXV.ma=false;IDXV.vol=true;IDXV.span=60;'],
  ['收盘线·创业板',  'IDXV.mode="close";IDXV.pick="399006";IDXV.period="day";IDXV.trend=true;IDXV.chan=true;IDXV.wave=true;IDXV.ma=true;IDXV.vol=false;IDXV.span=120;'],
  ['三指数·归一化',  'IDXV.mode="norm";IDXV.ma=true;IDXV.fill=true;IDXV.span=60;'],
  ['三指数·涨跌%',   'IDXV.mode="chg";IDXV.ma=false;IDXV.fill=false;IDXV.span=120;'],
  ['K线·裸K',       'IDXV.mode="kline";IDXV.pick="399001";IDXV.period="day";IDXV.trend=false;IDXV.chan=false;IDXV.wave=false;IDXV.ma=false;IDXV.vol=false;IDXV.span=60;'],
];

let bad = 0;
cases.forEach(([nm, setup]) => {
  G(setup + 'renderIdxChart();');
  const o = global.__LAST;
  if (!o) { console.log(nm.padEnd(18), 'NO OPTION'); bad++; return; }
  try {
    const c = echarts.init(null, null, { renderer: 'svg', ssr: true, width: 1180, height: 520 });
    c.setOption(JSON.parse(JSON.stringify(o, (k, v) => typeof v === 'function' ? undefined : v)));
    const svg = c.renderToSVGString();
    const grids = Array.isArray(o.grid) ? o.grid : [o.grid];
    let occ = '-';
    if (o.series[0].type === 'candlestick') {
      const y = Array.isArray(o.yAxis) ? o.yAxis[0] : o.yAxis;
      let lo = Infinity, hi = -Infinity;
      o.series[0].data.forEach(d => { if (d[3] > hi) hi = d[3]; if (d[2] < lo) lo = d[2]; });
      occ = (((hi - lo) / (y.max - y.min)) * 100).toFixed(0) + '%';
    }
    const names = o.series.map(s => s.type).join(',');
    console.log(nm.padEnd(18), 'OK  svg', (svg.length / 1024).toFixed(0) + 'KB',
      '| grid', grids.length, '| series', o.series.length,
      '| 蜡烛占Y轴', occ, '|', names.slice(0, 60));
  } catch (e) {
    console.log(nm.padEnd(18), 'FAIL:', e.message.slice(0, 170)); bad++;
  }
});
console.log(bad ? '\n>>> ' + bad + ' 个场景渲染失败' : '\n>>> 全部场景 SSR 渲染通过');
/* 应用侧仍挂着引导/轮询定时器，显式退出避免进程挂起 */
process.exit(bad ? 1 : 0);
