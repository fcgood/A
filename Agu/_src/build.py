import io, os, re
base = os.path.dirname(os.path.abspath(__file__))
app = os.path.dirname(base)

def rd(p):
    return io.open(os.path.join(base, p), encoding='utf-8').read()

sh = rd('shell.html').replace('background:#2c3purple;background:#2c3850;', 'background:#2c3850;')
eng = '\n'.join(rd('engine%d.js' % i) for i in (0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13))
data = rd('data.js')
assert '/*__DATA__*/' in sh, 'data placeholder missing'
assert '/*__ENGINE__*/' in sh, 'engine placeholder missing'
out = sh.replace('/*__DATA__*/', data).replace('/*__ENGINE__*/', eng)
io.open(os.path.join(app, 'index.html'), 'w', encoding='utf-8').write(out)

# 提取主脚本做语法校验
blocks = re.findall(r'<script>([\s\S]*?)</script>', out)
io.open(os.path.join(base, '_check.js'), 'w', encoding='utf-8').write(blocks[-1])
print('built index.html  bytes=%d  scripts=%d' % (len(out), len(blocks)))
