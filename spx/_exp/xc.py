# 往 scene.js 注入 extras()（逐步算式小卡）。用法：addxc(path, XC_js_list_string)
import re
BLK = r"""  // ── 扩写：逐步算式小卡 ──
  const XC = [
%s
  ];
  function extras() {
    for (const [id, y, rows, col] of XC) {
      const g = B.win(s(id), e(id) + 0.15); if (g <= 0) continue;
      const w = Math.max(...rows.map(r => [...r].reduce((q, ch) => q + (/[\u3000-\u9fff\uff00-\uffef]/.test(ch) ? 30 : 16), 0))) + 80, h = rows.length * 44 + 30;
      B.card(DX, y, Math.min(880, w), h, g * 0.95, col);
      rows.forEach((r, i) => ctag(r, DX, y - (rows.length - 1) * 22 + i * 44, { px: 29, a: g * gin(s(id) + 0.3 + i * 1.4), color: col === OK ? OK : C.ink, font: F.serif }));
    }
  }

"""
def addxc(path, items):
    s = open(path, encoding='utf-8').read()
    if '// ── 扩写：逐步算式小卡 ──' in s:
        s = re.sub(r"  // ── 扩写：逐步算式小卡 ──.*?\n  }\n  }\n\n", '', s, flags=re.S)
    i = s.index('  function draw(t) {'); s = s[:i] + BLK % items + s[i:]
    if 'extras();' not in s:
        m = re.search(r"papers\(\);", s); assert m; s = s[:m.end()] + ' extras();' + s[m.end():]
    open(path, 'w', encoding='utf-8').write(s)
