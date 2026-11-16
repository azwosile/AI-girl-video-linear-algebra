import re
def edit(p, reps, code=None, anchor=None, draw=None, pre='', post='', sfx='', anchor_sfx=None):
    s=open(p,encoding='utf-8').read()
    for a,b in reps:
        assert s.count(a)==1,(p,a); s=s.replace(a,b)
    if code:
        assert s.count(anchor)==1,(p,anchor); s=s.replace(anchor, code+anchor)
    if draw:
        a,b=draw; assert s.count(a)==1,(p,a); s=s.replace(a,b)
    if pre: s=re.sub(r'pre: \{ ', 'pre: { '+pre+', ', s, count=1)
    if post: s=re.sub(r'post: \{ ', 'post: { '+post+', ', s, count=1)
    if sfx:
        assert s.count(anchor_sfx)==1,(p,anchor_sfx); s=s.replace(anchor_sfx, anchor_sfx+'\n  // 扩写三 sfx\n'+sfx)
    open(p,'w',encoding='utf-8').write(s)

OUT="\n  function shotOutro() {"
# ═══ x2 ═══
edit('x2/scene.js',[
 ("a = B.win(s('C30l'), s('C31') - 0.2);","a = B.win(s('C30l'), s('C30o') - 0.2);"),
 ("B.paper(EX, 'y2425_q3', { t0: s('C30l') + 0.2, dock: cue('C30l', '一个五阶') - 0.3, out: s('C31') - 0.3 });",
  "B.paper(EX, 'y2425_q3', { t0: s('C30l') + 0.2, dock: cue('C30l', '一个五阶') - 0.3, out: s('C30o') - 0.3 });\n    B.paper(EX, 'y2526_q3', { t0: s('C30o') + 0.2, dock: cue('C30o', '求A的LU') - 0.3, out: s('C31') - 0.3 });"),
 ("'y2425_q5', 'y2425_q3'])","'y2425_q5', 'y2425_q3', 'y2526_q3'])")],
 code=r"""
  // ════ 扩写三：25–26 Q3 LU + 初等矩阵乘积 ════
  function shotR3() {
    const a = B.win(s('C30o'), s('C31') - 0.2); if (a <= 0) return;
    const A = a * gin(s('C30o') + 0.4);
    B.qhead('2025–2026 期中 · 第 3 题 · 12 分', A);
    const E1 = [[1, 0, 0], [-1, 1, 0], [0, 0, 1]], E2 = [[1, 0, 0], [0, 1, 0], [-1, 0, 1]], E3 = [[1, 0, 0], [0, 1, 0], [0, -2, 1]];
    const P = [[1, 0, 1], [0, 1, 0], [0, 0, 1]], Q = [[1, 0, 0], [0, 1, 2], [0, 0, 1]];
    const tL = cue('C30q', '所以L'), D1 = s('D06c');
    B.drill(A, [
      { mat: [[[1, 0, 1], [-1, 1, 1], [-1, -2, -4]], [[1, 0, 1], [0, 1, 2], [-1, -2, -4]], [[1, 0, 1], [0, 1, 2], [0, -2, -3]], [[1, 0, 1], [0, 1, 2], [0, 0, 1]]],
        T: [-1, cue('C30p', '第二行加第一行') + 0.6, cue('C30p', '第三行加第一行') + 0.6, cue('C30q', '第三行加两倍') + 0.6],
        ops: [null, [[1, 'R₂ + R₁']], [[2, 'R₃ + R₁']], [[2, 'R₃ + 2R₂']]], x: DX - 120, y: DY - 170, px: 40, t: s('C30o') + 0.8, u: D1 },
      { txt: 'ℓ₂₁ = −1', x: DX + 260, y: DY - 250, px: 28, col: C.i, t: cue('C30p', '倍数是'), u: D1 },
      { txt: 'ℓ₃₁ = −1', x: DX + 260, y: DY - 195, px: 28, col: C.i, t: cue('C30p', '倍数是') + 0.6, u: D1 },
      { txt: 'ℓ₃₂ = −2', x: DX + 260, y: DY - 140, px: 28, col: C.i, t: s('C30q') + 0.3, u: D1 },
      { txt: 'L =', x: DX - 230, y: DY + 70, px: 32, col: C.i, t: tL, u: D1 },
      { mat: [[[1, 0, 0], [-1, 1, 0], [-1, -2, 1]]], x: DX - 90, y: DY + 70, px: 32, t: tL, u: D1, hi: (i, j) => i > j ? C.i : null },
      { txt: 'U = 上面的结果', x: DX + 170, y: DY + 70, px: 28, t: tL + 0.8, u: D1 },
      { txt: 'E₃E₂E₁A = U', x: DX, y: DY - 270, px: 32, t: s('C30r') + 0.3 },
      { txt: 'A = E₁⁻¹ E₂⁻¹ E₃⁻¹ · U', x: DX, y: DY - 205, px: 34, col: C.i, t: cue('C30r', '所以A等于') },
      ...[[E1, 'E₁⁻¹：R₂ − R₁'], [E2, 'E₂⁻¹：R₃ − R₁'], [E3, 'E₃⁻¹：R₃ − 2R₂']].flatMap(([m, lab], k) => [
        { mat: [m], x: DX - 280 + k * 280, y: DY - 40, px: 26, t: cue('C30r', '变号') + k * 0.5, hi: (i, j) => i !== j && m[i][j] ? C.j : null },
        { txt: lab, x: DX - 280 + k * 280, y: DY - 115, px: 22, col: C.j, t: cue('C30r', '变号') + k * 0.5 }]),
      { txt: 'U =', x: DX - 280, y: DY + 140, px: 30, t: cue('C30s', '第一行减第三行') },
      { mat: [P], x: DX - 130, y: DY + 140, px: 26, t: cue('C30s', '所以U也能'), hi: (i, j) => i === 0 && j === 2 ? C.peri : null },
      { mat: [Q], x: DX + 70, y: DY + 140, px: 26, t: cue('C30s', '所以U也能') + 0.4, hi: (i, j) => i === 1 && j === 2 ? C.peri : null },
      { txt: '初等！', x: DX + 230, y: DY + 140, px: 28, col: OK, t: cue('C30s', '所以U也能') + 1.0 },
      { txt: '−1·(1,0,1) − 2·(0,1,2) + (0,0,1) = (−1, −2, −4) ✓', x: DX, y: DY + 260, px: 26, card: C.gpt, t: s('G03c') + 0.3, burst: cue('G03c', '正是A') },
    ]);
  }
""", anchor="\n  // ════ 套路卡 ════", draw=("shotR2(); shotOutro();","shotR2(); shotR3(); shotOutro();"),
 pre="C30o: 1.0", post="C30p: 1.0, C30q: 1.4, D06c: 0.4, C30r: 1.4, C30s: 1.2, G03c: 1.2",
 sfx="""  TL.sfx('whoosh', s('C30o') + 0.2, 0.3); [cue('C30p', '第二行加第一行'), cue('C30p', '第三行加第一行'), cue('C30q', '第三行加两倍')].forEach(x => TL.sfx('pop', x + 0.6, 0.3));
  TL.sfx('pluck', cue('C30q', '所以L'), 0.3); TL.sfx('swoosh_soft', cue('C30r', '变号'), 0.3); TL.sfx('ding_hi', cue('C30s', '所以U也能') + 1.0, 0.3); TL.sfx('check', cue('G03c', '正是A'), 0.3);""",
 anchor_sfx="TL.sfx('bell_soft', s('C31'), 0.35); TL.sfx('shimmer', s('D07'), 0.35);")

# ═══ x3 ═══
edit('x3/scene.js',[
 ("a = B.win(s('C27j'), s('C28') - 0.2);","a = B.win(s('C27j'), s('C27n') - 0.2);"),
 ("B.paper(EX, 'y2324_q7', { t0: s('C27j') + 0.2, dock: cue('C27j', '求行列式') - 0.3, out: s('C28') - 0.3 });",
  "B.paper(EX, 'y2324_q7', { t0: s('C27j') + 0.2, dock: cue('C27j', '求行列式') - 0.3, out: s('C27n') - 0.3 });\n    B.paper(EX, 'y2122_q3', { t0: s('C27n') + 0.2, dock: cue('C27n', '给了A和B') - 0.3, out: s('C28') - 0.3 });"),
 ("'y1718_q4', 'y2324_q7'])","'y1718_q4', 'y2324_q7', 'y2122_q3'])")],
 code=r"""
  // ════ 扩写三：21–22 Q3 det(AB + I) ════
  function shotR3() {
    const a = B.win(s('C27n'), s('C28') - 0.2); if (a <= 0) return;
    const A = a * gin(s('C27n') + 0.4);
    B.qhead('2021–2022 期中 · 第 3 题 · 10 分', A);
    const tO = s('C27o'), tG = s('G03c');
    B.drill(A, [
      { txt: 'A =', x: DX - 360, y: DY - 230, px: 32, t: s('C27n') + 0.8 },
      { mat: [[[1, 1, 1], [2, -1, 0], [1, 0, 1]]], x: DX - 220, y: DY - 230, px: 34, t: s('C27n') + 0.8, hi: (i) => i === 1 && B.t >= tO ? C.i : null },
      { txt: 'B =', x: DX + 20, y: DY - 230, px: 32, t: s('C27n') + 1.2 },
      { mat: [[[1, 0, 0], [2, 1, 0], [0, 2, 1]]], x: DX + 160, y: DY - 230, px: 34, t: s('C27n') + 1.2 },
      { txt: '只算 AB 的第 2 行', x: DX, y: DY - 120, px: 28, col: C.i, t: tO + 0.3, u: tG },
      { txt: '(2, −1, 0)·(1, 2, 0) = 0', x: DX, y: DY - 60, px: 30, t: cue('C27o', '第一列得零'), u: tG },
      { txt: '(2, −1, 0)·(0, 1, 2) = −1', x: DX, y: DY - 5, px: 30, t: cue('C27o', '第二列得负一'), u: tG },
      { txt: '(2, −1, 0)·(0, 0, 1) = 0', x: DX, y: DY + 50, px: 30, t: cue('C27o', '第三列得零'), u: tG },
      { txt: '(0, −1, 0) + (0, 1, 0) = (0, 0, 0)', x: DX, y: DY + 125, px: 32, col: C.free, t: cue('C27p', '再加上'), card: C.free },
      { txt: 'det(AB + I) = 0', x: DX, y: DY + 225, px: 38, card: OK, t: s('C27q') + 0.3, burst: true },
      { txt: '先扫：全零行 · 成比例 · 只有一个非零元', x: DX, y: DY - 20, px: 30, card: C.gpt, t: tG + 0.3, burst: true },
    ]);
  }
""", anchor=OUT, draw=("shotR2(); shotOutro();","shotR2(); shotR3(); shotOutro();"),
 pre="C27n: 1.0", post="C27n: 0.6, D06c: 0.4, C27o: 1.4, C27p: 1.2, C27q: 1.2, G03c: 1.0",
 sfx="""  TL.sfx('whoosh', s('C27n') + 0.2, 0.3); TL.sfx('sting', s('D06c') + 0.2, 0.25);
  ['第一列得零', '第二列得负一', '第三列得零'].forEach(p => TL.sfx('tick', cue('C27o', p), 0.3)); TL.sfx('slam', cue('C27p', '再加上'), 0.3);
  TL.sfx('impact', s('C27q') + 0.3, 0.35); TL.sfx('pop', s('G03c') + 0.3, 0.3);""",
 anchor_sfx="TL.sfx('bell_soft', s('C28'), 0.35); TL.sfx('shimmer', s('D07'), 0.35);")

# ═══ x5 ═══
edit('x5/scene.js',[
 ("a = B.win(s('C19f'), s('C20') - 0.2);","a = B.win(s('C19f'), s('C19i') - 0.2);"),
 ("B.paper(EX, 'y2324_q6', { t0: s('C19f') + 0.2, dock: cue('C19f', 'x加二') - 0.3, out: s('C20') - 0.3 });",
  "B.paper(EX, 'y2324_q6', { t0: s('C19f') + 0.2, dock: cue('C19f', 'x加二') - 0.3, out: s('C19i') - 0.3 });\n    B.paper(EX, 'y2021_q8', { t0: s('C19i') + 0.2, dock: cue('C19i', '证明x') - 0.3, out: s('C20') - 0.3 });"),
 ("'y1718_q3', 'y2324_q6'])","'y1718_q3', 'y2324_q6', 'y2021_q8'])")],
 code=r"""
  // ════ 扩写三：20–21 Q8(2) {x, x + 2, x²} 张成 P₃ ════
  function shotR3() {
    const a = B.win(s('C19i'), s('C20') - 0.2); if (a <= 0) return;
    const A = a * gin(s('C19i') + 0.4);
    B.qhead('2020–2021 期中 · 第 8(2) 题 · 5 分', A);
    polyShot(A, { polys: ['x', 'x + 2', 'x²'], vec: [[0, 1, 0], [2, 1, 0], [0, 0, 1]], minor: '1 × (0·1 − 2·1)', calc: '= −2 ≠ 0', ans: 'det = −2 ≠ 0 ⇒ 线性无关' },
      { t0: s('C19i') + 0.6, read: [cue('C19j', 'x读成'), cue('C19j', 'x加二读成'), cue('C19j', 'x平方读成')], mat: cue('C19j', '排成三列'), det: s('C19k'), ans: cue('C19k', '三个向量'), fadeAns: 1e9 });
    B.drill(A, [{ txt: '无关 + 个数 = dim P₃ = 3  ⇒  基  ⇒  张成', x: DX, y: DY + 250, px: 30, card: OK, t: s('C19l') + 0.3, burst: cue('C19l', '记住') }]);
  }
""", anchor=OUT, draw=("shotPoly(); shotOutro();","shotPoly(); shotR3(); shotOutro();"),
 pre="C19i: 1.0", post="C19i: 0.6, C19j: 1.2, C19k: 1.2, C19l: 1.4, D04c: 0.6",
 sfx="""  TL.sfx('whoosh', s('C19i') + 0.2, 0.3); ['x读成', 'x加二读成', 'x平方读成'].forEach(p => TL.sfx('pop', cue('C19j', p), 0.3));
  TL.sfx('impact', cue('C19k', '三个向量') + 0.2, 0.3); TL.sfx('ding_hi', cue('C19l', '记住'), 0.3); TL.sfx('shimmer', s('D04c'), 0.3);""",
 anchor_sfx="TL.sfx('bell_soft', s('C20'), 0.35); TL.sfx('shimmer', s('D05'), 0.35);")

# ═══ x6 ═══
edit('x6/scene.js',[
 ("a = B.win(s('C16q'), s('C17') - 0.2);","a = B.win(s('C16q'), s('C16t') - 0.2);"),
 ("B.paper(EX, 'y1516_q3', { t0: s('C16q') + 0.2, dock: cue('C16q', '已知v一') , out: s('C17') - 0.3 });",
  "B.paper(EX, 'y1516_q3', { t0: s('C16q') + 0.2, dock: cue('C16q', '已知v一') , out: s('C16t') - 0.3 });\n    B.paper(EX, 'y2324_q3', { t0: s('C16t') + 0.2, dock: cue('C16t', '第一问') - 0.3, out: s('C17') - 0.3 });")],
 code=r"""
  // ════ 扩写三：23–24 Q3 标准基 → {u} ════
  function shotR3() {
    const a = B.win(s('C16t'), s('C17') - 0.2); if (a <= 0) return;
    const A = a * gin(s('C16t') + 0.4);
    B.qhead('2023–2024 期中 · 第 3 题 · 12 分', A);
    const tV = s('C16v'), tX = s('C16x');
    const R = [[1, 1, 2, 1, 0, 0], [1, 2, 4, 0, 1, 0], [1, 3, 5, 0, 0, 1]];
    const st = [R]; const op = (f) => { const n = st[st.length - 1].map(r => r.slice()); f(n); st.push(n); };
    op(n => n[1] = n[1].map((v, j) => v - n[0][j])); op(n => n[2] = n[2].map((v, j) => v - n[0][j])); op(n => n[2] = n[2].map((v, j) => v - 2 * n[1][j]));
    op(n => n[2] = n[2].map(v => -v)); op(n => n[1] = n[1].map((v, j) => v - 2 * n[2][j])); op(n => n[0] = n[0].map((v, j) => v - 2 * n[2][j])); op(n => n[0] = n[0].map((v, j) => v - n[1][j]));
    const T = [-1, cue('C16v', '第二行减第一行'), cue('C16v', '第三行减第一行'), cue('C16v', '再第三行减'), cue('C16w', '第三行乘负一'), cue('C16w', '第二行减两倍'), cue('C16w', '第一行减两倍'), cue('C16w', '再减第二行')].map((x, i) => i ? x + 0.5 : x);
    const ops = [null, [[1, 'R₂ − R₁']], [[2, 'R₃ − R₁']], [[2, 'R₃ − 2R₂']], [[2, '× (−1)']], [[1, 'R₂ − 2R₃']], [[0, 'R₁ − 2R₃']], [[0, 'R₁ − R₂']]];
    const tS = cue('C16w', '右边就是S');
    B.drill(A, [
      { txt: 'u₁ = (1, 1, 1)    u₂ = (1, 2, 3)    u₃ = (2, 4, 5)', x: DX, y: DY - 300, px: 30, col: C.i, t: s('C16t') + 1.0, u: tX },
      { txt: 'S = F⁻¹E', x: DX, y: DY - 200, px: 38, t: s('C16u') + 0.3, u: tV },
      { txt: 'E = I（标准基），F = U = [u₁ u₂ u₃]', x: DX, y: DY - 130, px: 30, t: cue('C16u', '新基矩阵'), u: tV },
      { txt: 'S = U⁻¹', x: DX, y: DY - 40, px: 40, card: C.peri, t: cue('C16u', '所以S等于'), u: tV, burst: true },
      { txt: '[ U | I ]', x: DX, y: DY - 290, px: 28, col: C.peri, t: tV, u: tX },
      { mat: st, T, ops, x: DX, y: DY - 150, px: 34, bar: 3, t: tV + 0.2, u: tX, hi: (i, j, k) => k === 7 && j >= 3 ? OK : null },
      { txt: 'I    |    S = U⁻¹', x: DX + 20, y: DY - 20, px: 30, col: OK, t: tS, u: tX, burst: true },
      { txt: 'S =', x: DX - 230, y: DY - 170, px: 32, t: tX },
      { mat: [st[7].map(r => r.slice(3))], x: DX - 70, y: DY - 170, px: 34, t: tX, hi: () => OK },
      { txt: 'S (3, 2, 5)ᵀ = (4, 7, −4)', x: DX, y: DY, px: 32, t: cue('C16x', '三、二、五的坐标') },
      { txt: 'S (2, 3, 2)ᵀ = (1, −3, 2)', x: DX, y: DY + 60, px: 32, t: cue('C16x', '二、三、二的坐标') },
      { txt: '4u₁ + 7u₂ − 4u₃ = (3, 2, 5) ✓', x: DX, y: DY + 170, px: 30, card: C.gpt, t: s('G03e') + 0.3, burst: cue('G03e', '对上了') },
      { txt: '标准基 → {u}：S = U⁻¹', x: DX, y: DY + 255, px: 30, col: C.ds, t: s('D04c') + 0.2 },
    ]);
  }
""", anchor=OUT, draw=("shotR2(); shotOutro();","shotR2(); shotR3(); shotOutro();"),
 pre="C16t: 1.0", post="C16t: 0.6, C16u: 1.2, C16v: 1.4, C16w: 1.6, C16x: 1.4, G03e: 1.0, D04c: 0.6",
 sfx="""  TL.sfx('whoosh', s('C16t') + 0.2, 0.3); TL.sfx('ding_hi', cue('C16u', '所以S等于'), 0.3);
  [cue('C16v', '第二行减第一行'), cue('C16v', '第三行减第一行'), cue('C16v', '再第三行减'), cue('C16w', '第三行乘负一'), cue('C16w', '第二行减两倍'), cue('C16w', '第一行减两倍'), cue('C16w', '再减第二行')].forEach(x => TL.sfx('pop', x + 0.5, 0.28));
  TL.sfx('impact', cue('C16w', '右边就是S'), 0.3); TL.sfx('tick', cue('C16x', '三、二、五的坐标'), 0.3); TL.sfx('tick', cue('C16x', '二、三、二的坐标'), 0.3); TL.sfx('check', cue('G03e', '对上了'), 0.3);""",
 anchor_sfx="TL.sfx('bell_soft', s('C17'), 0.35); TL.sfx('shimmer', s('D05'), 0.35);")
s=open('x6/scene.js',encoding='utf-8').read()
i=s.index('loadExam(['); j=s.index('])',i); s=s[:j]+", 'y2324_q3'"+s[j:]; open('x6/scene.js','w',encoding='utf-8').write(s)

# ═══ x7 ═══
edit('x7/scene.js',[
 ("const a = B.win(s('C17j'), s('C18') - 0.2); if (a <= 0) return;","const a = B.win(s('C17j'), s('C17t') - 0.2); if (a <= 0) return;"),
 ("B.paper(EX, 'y2526_q4', { t0: s('C17j') + 0.2, dock: cue('C17j', '这次没有给U') - 0.3, out: s('C18') - 0.3 });",
  "B.paper(EX, 'y2526_q4', { t0: s('C17j') + 0.2, dock: cue('C17j', '这次没有给U') - 0.3, out: s('C17t') - 0.3 });\n    B.paper(EX, 'y2324_n2', { t0: s('C17t') + 0.2, dock: cue('C17t', '求A和B') - 0.3, out: s('C18') - 0.3 });")],
 code=r"""
  // ════ 扩写三：23–24 Q2′ 零空间 ════
  function shotR3() {
    const a = B.win(s('C17t'), s('C18') - 0.2); if (a <= 0) return;
    const A = a * gin(s('C17t') + 0.4);
    B.qhead('2023–2024 期中 · 第 2′ 题 · 14 分', A);
    const tW = s('C17w'), tV = s('C17v');
    B.drill(A, [
      { txt: 'A =', x: DX - 250, y: DY - 210, px: 32, t: s('C17t') + 0.8, u: tW },
      { mat: [[[1, -1, 4, 2], [-2, -4, 7, 5]], [[1, -1, 4, 2], [0, -6, 15, 9]], [[1, -1, 4, 2], [0, 1, '-5/2', '-3/2']], [[1, 0, '3/2', '1/2'], [0, 1, '-5/2', '-3/2']]],
        T: [-1, cue('C17u', '第二行加两倍') + 0.5, cue('C17u', '除以负六') + 0.5, cue('C17u', '第一行加第二行') + 0.5],
        ops: [null, [[1, 'R₂ + 2R₁']], [[1, 'R₂ ÷ (−6)']], [[0, 'R₁ + R₂']]], x: DX - 20, y: DY - 210, px: 34, cw: 90, lx: DX + 290, t: s('C17t') + 0.8, u: tW,
        hi: (i, j, k) => k === 3 && i === j ? C.i : (k === 3 && j >= 2 && B.t >= tV ? C.free : null) },
      { txt: '主元：第 1、2 列    自由：x₃、x₄', x: DX, y: DY - 110, px: 28, col: C.free, t: tV + 0.2, u: tW },
      { txt: 'x₃ = 1, x₄ = 0  →  (−3/2, 5/2, 1, 0)', x: DX, y: DY - 40, px: 30, t: cue('C17v', '令x三等于一'), u: tW },
      { txt: 'x₃ = 0, x₄ = 1  →  (−1/2, 3/2, 0, 1)', x: DX, y: DY + 20, px: 30, t: cue('C17v', '令x三等于零'), u: tW },
      { txt: 'N(A) = Span{(−3, 5, 2, 0), (−1, 3, 0, 2)}', x: DX, y: DY + 130, px: 32, card: OK, t: s('G03e') + 0.3, u: tW, burst: true },
      { txt: 'B =', x: DX - 200, y: DY - 190, px: 32, t: tW },
      { mat: [[[1, 2, -4], [2, 1, -1], [-1, 1, -3]], [[1, 2, -4], [0, -3, 7], [-1, 1, -3]], [[1, 2, -4], [0, -3, 7], [0, 3, -7]], [[1, 2, -4], [0, -3, 7], [0, 0, 0]]],
        T: [-1, cue('C17w', '第二行减两倍') + 0.5, cue('C17w', '第三行加第一行') + 0.5, cue('C17w', '两行一加') + 0.4],
        ops: [null, [[1, 'R₂ − 2R₁']], [[2, 'R₃ + R₁']], [[2, 'R₃ + R₂']]], x: DX - 40, y: DY - 190, px: 36, lx: DX + 200, t: tW, hi: (i, j, k) => k === 3 && i === 2 ? C.free : null },
      { txt: 'x₂ = 7x₃ / 3', x: DX, y: DY - 30, px: 30, t: s('C17x') + 0.3 },
      { txt: 'x₁ = −2x₂ + 4x₃ = −2x₃ / 3', x: DX, y: DY + 30, px: 30, t: cue('C17x', 'x一等于') },
      { txt: 'N(B) = Span{(−2, 7, 3)}', x: DX, y: DY + 140, px: 34, card: OK, t: cue('C17x', '取x三等于三'), burst: true },
      { txt: '自由变量轮流取 1，其余取 0', x: DX, y: DY + 245, px: 30, col: C.ds, t: s('D04e') + 0.2 },
    ]);
  }
""", anchor=OUT, draw=("shotQ4(); shotOutro();","shotQ4(); shotR3(); shotOutro();"),
 pre="C17t: 1.0, C17w: 0.6", post="C17t: 0.6, C17u: 1.6, C17v: 1.4, G03e: 1.2, C17w: 1.4, C17x: 1.4, D04e: 0.6",
 sfx="""  TL.sfx('whoosh', s('C17t') + 0.2, 0.3); ['第二行加两倍', '除以负六', '第一行加第二行'].forEach(p => TL.sfx('pop', cue('C17u', p) + 0.5, 0.3));
  TL.sfx('tick', cue('C17v', '令x三等于一'), 0.3); TL.sfx('tick', cue('C17v', '令x三等于零'), 0.3); TL.sfx('impact', s('G03e') + 0.3, 0.3);
  ['第二行减两倍', '第三行加第一行', '两行一加'].forEach(p => TL.sfx('pop', cue('C17w', p) + 0.5, 0.3)); TL.sfx('impact', cue('C17x', '取x三等于三'), 0.35);""",
 anchor_sfx="TL.sfx('bell_soft', s('C18'), 0.35); TL.sfx('shimmer', s('D05'), 0.35);")
s=open('x7/scene.js',encoding='utf-8').read()
i=s.index('loadExam(['); j=s.index('])',i); s=s[:j]+", 'y2324_n2'"+s[j:]; open('x7/scene.js','w',encoding='utf-8').write(s)

# ═══ x8 ═══
EXS = [['A 是 3 阶，det A = 2', 'det(3A) = 3³ × 2 = 54（不是 6）'], ['A 是 4 阶，|A| = 2', '|A · adj A| = |2I| = 2⁴ = 16'], ['A₂₁ + A₂₂ + 2A₂₃', '= 第 2 行换成 (1, 1, 2) 后的行列式'],
 ['末行 (0, 0, a − 1 | b − 2)', 'a ≠ 1 唯一 · a = 1, b ≠ 2 无解 · a = 1, b = 2 无穷多'], ['[[2, 1], [6, 4]]：倍数 6 ÷ 2 = 3', 'L = [[1, 0], [3, 1]]，U = [[2, 1], [0, 1]]'],
 ['[[3, 1], [5, 2]]⁻¹，det = 1', '主对角互换、副对角变号 → [[2, −1], [−5, 3]]'], ['{x : x₁ + x₂ = 1}', '0 + 0 ≠ 1 → 不是子空间'], ['R³ 里 4 个向量', '4 > 3 → 必相关'],
 ['旧基是标准基：E = I', 'S = F⁻¹'], ['RREF 第 3 列 (2, 3, 0, 0)ᵀ', 'a₃ = 2a₁ + 3a₂']]
import json
js = json.dumps(EXS, ensure_ascii=False)
edit('x8/scene.js',[("      ctag('✓', x + 370, y, { px: lerp(60, 36, gin(tTen[k] + 0.8)), a: g * gin(tTen[k] + 0.8), color: OK });\n    });",
"""      ctag('✓', x + 370, y, { px: lerp(60, 36, gin(tTen[k] + 0.8)), a: g * gin(tTen[k] + 0.8), color: OK });
      const id = 'C20' + 'abcdefghij'[k], ga = a * B.win(s(id), e(id) + 0.25);
      if (ga > 0) {
        ctx.save(); ctx.globalAlpha = ga; ctx.strokeStyle = C.peri; ctx.lineWidth = 3; ctx.strokeRect(x - 30, y - 34, 430, 68); ctx.restore();
        B.card(DX - 40, DY + 225, 740, 110, ga * 0.95, C.i);
        ctag(EXS[k][0], DX - 40, DY + 198, { px: 28, a: ga * gin(s(id) + 0.3), color: C.ink, font: F.serif });
        ctag(EXS[k][1], DX - 40, DY + 250, { px: 28, a: ga * gin(s(id) + 1.4), color: C.i, font: F.serif });
      }
    });""")],
 code="\n  const EXS = " + js + ";\n", anchor="\n  function shotTen() {",
 post="C20z: 0.6, C20a: 1.0, C20b: 1.0, C20c: 1.0, C20d: 1.4, C20e: 1.0, C20f: 1.2, C20g: 1.0, C20h: 0.8, C20i: 1.0, C20j: 1.2",
 sfx="  'abcdefghij'.split('').forEach(c => TL.sfx('pop', s('C20' + c) + 0.3, 0.25));",
 anchor_sfx="tTen.forEach(t => TL.sfx('tick2', t, 0.3));")

# ═══ x0 ═══
edit('x0/scene.js',[
 ("const g2 = a * gin(s('G02') + 0.4);","const g2 = a * gin(s('G02') + 0.4) * (1 - gin(s('C08a')));"),
 ("ctag('考前过一遍 = 复习提纲', DX, DY + 300, { px: 32, a: a * gin(cue('G02', '考前')), color: C.gpt });","ctag('考前过一遍 = 复习提纲', DX, DY + 300, { px: 32, a: g2 * gin(cue('G02', '考前')), color: C.gpt });")],
 code=r"""
  function shotTips() {
    const a = B.win(s('C08a'), s('C09')); if (a <= 0) return;
    B.drill(a, [
      { txt: '原题上屏 → 暂停 → 自己做 2 分钟', x: DX, y: DY - 230, px: 34, card: C.peri, t: s('C08a') + 0.3, burst: true },
      { txt: '卡住的那一步 = 最该记的', x: DX, y: DY - 155, px: 30, col: C.ink, t: cue('C08a', '被卡住') },
      { txt: '验算：代回去 · 抽查一格', x: DX, y: DY - 40, px: 34, card: C.gpt, t: s('G02a') + 0.3, burst: true },
      { txt: '留 2 分钟验算 = 最便宜的保分', x: DX, y: DY + 35, px: 30, col: C.ink, t: cue('G02a', '考场上') },
      { txt: '先写能写的：定义 · 消元第一步 · 套路卡第一行', x: DX - 30, y: DY + 150, px: 30, card: C.i, w: 720, t: s('C08b') + 0.3, burst: true },
      { txt: '按步骤给分：写对一半 = 一半的分', x: DX - 30, y: DY + 225, px: 30, col: C.ink, t: cue('C08b', '大题按步骤') },
    ]);
  }
""", anchor="\n  function shotGo() {", draw=("shotBeats(); shotGo();","shotBeats(); shotTips(); shotGo();"),
 post="C08a: 1.2, G02a: 1.2, D02a: 0.4, C08b: 1.4",
 sfx="  TL.sfx('whoosh', s('C08a') + 0.3, 0.3); TL.sfx('check', s('G02a') + 0.3, 0.3); TL.sfx('sting', s('D02a') + 0.2, 0.2); TL.sfx('pop', s('C08b') + 0.3, 0.3);",
 anchor_sfx="TL.sfx('count_go', s('D03') + 0.2, 0.3); TL.sfx('whoosh', s('C09') + 0.4, 0.3);")
print('ok')
