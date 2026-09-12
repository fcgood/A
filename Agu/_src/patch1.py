import io
p='_src/engine1.js'
s=io.open(p,encoding='utf-8').read()

old_f1='function f1(x){return x==null?"数据缺失":(Math.round(x*10)/10).toFixed(1);}'
new_f1=old_f1+'\nfunction f3(x){return x==null?"数据缺失":(Math.round(x*1000)/1000).toFixed(3);}'
assert old_f1 in s
s=s.replace(old_f1,new_f1,1)

reps=[
 ('macdSig=`DIF=${f2(dif[i])}，DEA=${f2(dea[i])}，柱=${f2(bar[i])}',
  'macdSig=`DIF=${f3(dif[i])}，DEA=${f3(dea[i])}，柱=${f3(bar[i])}'),
 ('`DIF ${f2(an.dif[k])} 上穿 DEA ${f2(an.dea[k])}`',
  '`DIF ${f3(an.dif[k])} 上穿 DEA ${f3(an.dea[k])}`'),
 ('`DIF ${f2(an.dif[k])} 下穿 DEA ${f2(an.dea[k])}`',
  '`DIF ${f3(an.dif[k])} 下穿 DEA ${f3(an.dea[k])}`'),
]
for a,b in reps:
    assert a in s, a[:50]
    s=s.replace(a,b)

io.open(p,'w',encoding='utf-8').write(s)
print('f3:',s.count('function f3'),'| macdSig f3:',s.count('DIF=${f3(dif[i])}'),'| signals f3:',s.count('DIF ${f3(an.dif[k])}'))
