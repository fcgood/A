import io,re
html=io.open('index.html',encoding='utf-8').read()
# HTML 中定义的 id
ids=set(re.findall(r'\sid="([^"]+)"',html))
# JS 中引用的 $("xxx")
refs=set(re.findall(r'\$\("([^"]+)"\)',html))
# querySelector("[data-...]") 之类忽略
missing=sorted(r for r in refs if r not in ids)
print('HTML ids:',len(ids))
print('JS refs :',len(refs))
print('MISSING :',missing if missing else 'none')
unused=sorted(i for i in ids if i not in refs and i not in ('dash','market','sector','stock','holdings','report','help'))
print('unused ids:',unused)
# 重复 id 检查
allids=re.findall(r'\sid="([^"]+)"',html)
dup=[i for i in set(allids) if allids.count(i)>1]
print('DUPLICATE ids:',dup if dup else 'none')
# 检查 echarts 引用
print('has echarts script tag:', 'echarts.min.js' in html)
print('file size:',len(html))
