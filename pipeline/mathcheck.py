"""数学复核：用 sympy 独立验算 <段>/math.json 里的每一个数字。
用法: python pipeline/mathcheck.py ch01/s1_2b   → 末行 MATHCHECK PASS / FAIL n
检查项（有哪个字段就查哪个）：
  steps   — 逐步行变换 ops 的结果
  rref / rref_aug — 系数矩阵 / 增广矩阵的简化行阶梯形
  sol     — 参数解（含 t）代入 A x = b 恒成立；free 变量 = t
  nullity — n − rank(A)
  pick    — 取 t 的具体值后的数
  atoms   — 化学方程两边原子守恒（取 pick.x）
  inter   — 车流每个路口 进 = 出（取 pick.x）
  planes.line — 与每个法向量正交（n1、n2、n3share），且与 n3 不正交
  consistent: false — rank(A) < rank([A|b])
  products[] {A, x, Ax, terms?} / scal[] {k, A, kA} / adds[] {A, B, sum} / combos[] {c, vecs, result}
  vec {v, scal: [[k, kv]]}
"""
import json, sys
from pathlib import Path
import sympy as sp

seg = Path(sys.argv[1]); M = json.loads((seg / 'math.json').read_text(encoding='utf-8'))
bad = []; ok = 0
def chk(cond, msg):
    global ok
    if cond: ok += 1
    else: bad.append(msg)

t = sp.Symbol('t')
for name, S in M.get('systems', {}).items():
    A = sp.Matrix(S['A']); n = A.cols
    b = sp.Matrix(S.get('b', [0] * A.rows))
    if 'steps' in S:
        cur = sp.Matrix([[sp.nsimplify(v) for v in r] for r in S['A']])
        for k, (op, *args) in enumerate(S['ops']):
            if op == 'add': d, s_, c = args; cur[d, :] = cur[d, :] + sp.nsimplify(c) * cur[s_, :]
            elif op == 'swap': i, j = args; cur.row_swap(i, j)
            elif op == 'scale': i, c = args; cur[i, :] = sp.nsimplify(c) * cur[i, :]
            chk(cur == sp.Matrix([[sp.nsimplify(v) for v in r] for r in S['steps'][k]]), f'{name}: 第 {k+1} 步 {op}{args} 得 {cur.tolist()}，math.json 写的是 {S["steps"][k]}')
    if 'rref' in S:
        R = A.rref()[0]; chk(R == sp.Matrix(S['rref']), f'{name}: rref(A) = {R.tolist()}')
    if 'rref_aug' in S:
        R = A.row_join(b).rref()[0]; chk(R == sp.Matrix(S['rref_aug']), f'{name}: rref([A|b]) = {R.tolist()}')
    if 'nullity' in S:
        chk(n - A.rank() == S['nullity'], f'{name}: nullity = {n - A.rank()}，写的是 {S["nullity"]}')
    if 'sol' in S:
        x = sp.Matrix([sp.sympify(e, locals={'t': t}) for e in S['sol']])
        chk(sp.simplify(A * x - b) == sp.zeros(A.rows, 1), f'{name}: 解 {S["sol"]} 代入后 A x − b = {sp.simplify(A*x-b).T}')
        for v in S.get('free', []):
            chk(x[S['vars'].index(v)] == t, f'{name}: 自由变量 {v} 应等于 t')
        if 'pick' in S:
            xv = x.subs(t, S['pick']['t']); chk(list(xv) == S['pick']['x'], f'{name}: t={S["pick"]["t"]} 得 {list(xv)}')
    if 'atoms' in S and 'pick' in S:
        mol = list(S['atoms']); xv = S['pick']['x']
        for el in 'CHO':
            L = sum(xv[i] * S['atoms'][mol[i]].get(el, 0) for i in (0, 1))
            Rr = sum(xv[i] * S['atoms'][mol[i]].get(el, 0) for i in (2, 3))
            chk(L == Rr, f'{name}: {el} 原子 左 {L} ≠ 右 {Rr}')
    if 'inter' in S and 'pick' in S:
        x1, x2, x3, x4 = S['pick']['x']; I = S['inter']
        flows = {'A': (x1 + I['A'][0], x2 + I['A'][1]), 'B': (x2 + I['B'][0], x3 + I['B'][1]),
                 'C': (x3 + I['C'][0], x4 + I['C'][1]), 'D': (x4 + I['D'][0], x1 + I['D'][1])}
        for k, (i_, o_) in flows.items(): chk(i_ == o_, f'{name}: 路口 {k} 进 {i_} ≠ 出 {o_}')
        chk(all(v >= 0 for v in S['pick']['x']), f'{name}: 车流出现负数')

    if S.get('consistent') is False:
        r1, r2 = A.rank(), A.row_join(b).rank(); chk(r1 < r2, f'{name}: 应无解，但 rank(A)={r1}，rank([A|b])={r2}')

Q = lambda v: sp.nsimplify(v) if isinstance(v, str) else v
Mx = lambda X: sp.Matrix([[Q(v) for v in row] for row in X]) if isinstance(X[0], list) else sp.Matrix([Q(v) for v in X])
for k, pr in enumerate(M.get('products', [])):
    A, x = Mx(pr['A']), Mx(pr['x']); chk(A * x == Mx(pr['Ax']), f'products[{k}] {pr.get("desc","")}: Ax = {list(A*x)}')
    if 'terms' in pr: chk([A[0, j] * x[j] for j in range(A.cols)] == pr['terms'], f'products[{k}]: 逐项乘积不对')
for k, sc in enumerate(M.get('scal', [])):
    chk(Q(sc['k']) * Mx(sc['A']) == Mx(sc['kA']), f'scal[{k}] {sc.get("desc","")}: kA = {(Q(sc["k"]) * Mx(sc["A"])).tolist()}')
for k, ad in enumerate(M.get('adds', [])):
    chk(Mx(ad['A']) + Mx(ad['B']) == Mx(ad['sum']), f'adds[{k}] {ad.get("desc","")}: 和 = {(Mx(ad["A"]) + Mx(ad["B"])).tolist()}')
for k, cb in enumerate(M.get('combos', [])):
    r = sum((Q(c) * Mx(v) for c, v in zip(cb['c'], cb['vecs'])), sp.zeros(len(cb['vecs'][0]), 1))
    chk(r == Mx(cb['result']), f'combos[{k}] {cb.get("desc","")}: = {list(r)}')
if 'vec' in M:
    v = Mx(M['vec']['v'])
    for kk, kv in M['vec'].get('scal', []): chk(Q(kk) * v == Mx(kv), f'vec: {kk}·v = {list(Q(kk)*v)}')

P = M.get('planes')
if P and 'line' in P:
    d = sp.Matrix(P['line'])
    for k in ('n1', 'n2', 'n3share'):
        if k in P: chk(sp.Matrix(P[k]).dot(d) == 0, f'planes: line 不在平面 {k} 上')
    if 'n3' in P: chk(sp.Matrix(P['n3']).dot(d) != 0, 'planes: n3 本应不含交线')
    if 'n1' in P and 'n2' in P:
        c = sp.Matrix(P['n1']).cross(sp.Matrix(P['n2'])); chk(c.cross(d) == sp.zeros(3, 1), f'planes: n1×n2 = {c.T} 与 line 不平行')
    # 与 systems 对齐
    S = M['systems']
    if 'ex2' in S: chk(S['ex2']['A'] == [P['n1'], P['n2']], 'planes: n1/n2 与 ex2.A 不一致')
    if 'ex3' in S: chk(S['ex3']['A'][2] == P['n3'], 'planes: n3 与 ex3.A 不一致')
    if 'ex3share' in S: chk(S['ex3share']['A'][2] == P['n3share'], 'planes: n3share 与 ex3share.A 不一致')

# ── 1.4–1.6 扩展：逆、奇异、转置、对称、幂、邻接图、初等矩阵、LU、分块 ──
def isElem(E):
    n = E.rows; I = sp.eye(n); D = E - I; nz = [(i, j) for i in range(n) for j in range(n) if D[i, j] != 0]
    if not nz: return True
    if len(nz) == 1: i, j = nz[0]; return i != j or E[i, i] != 0          # 倍加 或 倍乘
    if len(nz) == 4:                                                        # 交换
        r = sorted({i for i, _ in nz}); return len(r) == 2 and E == I.elementary_row_op('n<->m', row1=r[0], row2=r[1])
    return False
for k, iv in enumerate(M.get('inverses', [])):
    A, B = Mx(iv['A']), Mx(iv['inv']); I = sp.eye(A.rows)
    chk(A * B == I and B * A == I, f'inverses[{k}] {iv.get("desc","")}: A⁻¹ 应为 {A.inv().tolist() if A.det() != 0 else "不存在"}')
for k, sg in enumerate(M.get('singular', [])):
    chk(Mx(sg['A']).det() == 0, f'singular[{k}] {sg.get("desc","")}: det = {Mx(sg["A"]).det()} ≠ 0')
for k, tr in enumerate(M.get('transposes', [])):
    chk(Mx(tr['A']).T == Mx(tr['AT']), f'transposes[{k}] {tr.get("desc","")}: Aᵀ = {Mx(tr["A"]).T.tolist()}')
for k, sy in enumerate(M.get('symmetric', [])):
    chk(Mx(sy['A']) == Mx(sy['A']).T, f'symmetric[{k}] {sy.get("desc","")}: 不对称')
for k, pw in enumerate(M.get('powers', [])):
    chk(Mx(pw['A']) ** pw['n'] == Mx(pw['An']), f'powers[{k}] {pw.get("desc","")}: Aⁿ = {(Mx(pw["A"]) ** pw["n"]).tolist()}')
G = M.get('graph')
if G:
    n = len(G['A']); Adj = sp.zeros(n, n)
    for a, b in G['edges']: Adj[a - 1, b - 1] = Adj[b - 1, a - 1] = 1
    chk(Adj == sp.Matrix(G['A']), f'graph: 由边得邻接矩阵 {Adj.tolist()}')
    if 'walks11' in G:
        A2 = Adj ** 2; chk(len(G['walks11']) == A2[0, 0], f'graph: (A²)₁₁ = {A2[0,0]}，列出的路线 {len(G["walks11"])} 条')
        for w in G['walks11']: chk(all(Adj[w[i] - 1, w[i + 1] - 1] == 1 for i in range(len(w) - 1)), f'graph: 路线 {w} 不连通')
SY = {}
def MxS(X):
    out = []
    for row in X:
        r = []
        for v in row:
            if isinstance(v, str) and v.isidentifier(): SY.setdefault(v, sp.Symbol(v)); r.append(SY[v])
            elif isinstance(v, str) and any(ch.isalpha() for ch in v): r.append(sp.sympify(v, locals=SY))   # 表达式，如 'a+p'
            else: r.append(Q(v))
        out.append(r)
    return sp.Matrix(out)
for k, el in enumerate(M.get('elementary', [])):
    E = MxS(el['E']); d = el.get('desc', '')
    chk(isElem(E) if el.get('elem', True) else not isElem(E), f'elementary[{k}] {d}: E 不是初等矩阵')
    if 'A' in el and 'EA' in el: chk(E * MxS(el['A']) == MxS(el['EA']), f'elementary[{k}] {d}: EA = {(E*MxS(el["A"])).tolist()}')
    if 'inv' in el: chk(E * MxS(el['inv']) == sp.eye(E.rows), f'elementary[{k}] {d}: E⁻¹ 应为 {E.inv().tolist()}')
for k, lu in enumerate(M.get('lu', [])):
    A, Lm, U = Mx(lu['A']), Mx(lu['L']), Mx(lu['U']); n = A.rows; d = lu.get('desc', '')
    chk(Lm * U == A, f'lu[{k}] {d}: LU = {(Lm*U).tolist()}')
    chk(all(Lm[i, j] == 0 for i in range(n) for j in range(i + 1, n)) and all(Lm[i, i] == 1 for i in range(n)), f'lu[{k}] {d}: L 不是单位下三角')
    chk(all(U[i, j] == 0 for i in range(n) for j in range(i)), f'lu[{k}] {d}: U 不是上三角')
for k, bl in enumerate(M.get('blocks', [])):
    A, B = Mx(bl['A']), Mx(bl['B']); d = bl.get('desc', '')
    if 'AB' in bl: chk(A * B == Mx(bl['AB']), f'blocks[{k}] {d}: AB = {(A*B).tolist()}')
    def parts(n, c):
        e = [0]; [e.append(e[-1] + x) for x in c]; e.append(n) if e[-1] != n else None; return list(zip(e[:-1], e[1:]))
    R, K, C2 = parts(A.rows, bl['rows']), parts(A.cols, bl['inner']), parts(B.cols, bl['cols'])
    blk = sp.zeros(A.rows, B.cols)
    for r0, r1 in R:
        for c0, c1 in C2:
            blk[r0:r1, c0:c1] = sum((A[r0:r1, k0:k1] * B[k0:k1, c0:c1] for k0, k1 in K), sp.zeros(r1 - r0, c1 - c0))
    chk(blk == A * B, f'blocks[{k}] {d}: 按块相乘与直接相乘不一致')

# ── 第二章：行列式 ──
#   dets[] {A, det}            — det(A)（A 可含符号，det 写成字符串表达式）
#   cofactors[] {A, i, j, minor, cof}  — 第 i 行第 j 列（从 1 起）的余子式 det(M_ij) 与代数余子式 A_ij
#   expand[] {A, along: 'row'|'col', k, terms: [..], det}  — 按第 k 行 / 列展开的每一项 a·A
#   adjs[] {A, adj}            — 伴随矩阵
#   cramer[] {A, b, dets: [det A1..], det, x}
#   detsteps {A, ops, steps, sign, diag, det}  — 消元求行列式：ops 逐步，最后 det = sign · ∏diag
for k, mm in enumerate(M.get('matmul', [])):                       # 矩阵乘积 {A, B, AB}
    chk(Mx(mm['A']) * Mx(mm['B']) == Mx(mm['AB']), f'matmul[{k}] {mm.get("desc","")}: AB = {(Mx(mm["A"]) * Mx(mm["B"])).tolist()}')
for k, dd in enumerate(M.get('dets', [])):
    A = MxS(dd['A']); want = sp.sympify(dd['det'], locals=SY) if isinstance(dd['det'], str) else dd['det']
    chk(sp.simplify(A.det() - want) == 0, f'dets[{k}] {dd.get("desc","")}: det = {sp.factor(A.det())}，写的是 {dd["det"]}')
for k, cf in enumerate(M.get('cofactors', [])):
    A = MxS(cf['A']); i, j = cf['i'] - 1, cf['j'] - 1; mn = A.minor_submatrix(i, j).det()
    if 'minor' in cf: chk(mn == Q(cf['minor']), f'cofactors[{k}] {cf.get("desc","")}: M{i+1}{j+1} = {mn}')
    if 'cof' in cf: chk(A.cofactor(i, j) == Q(cf['cof']), f'cofactors[{k}] {cf.get("desc","")}: A{i+1}{j+1} = {A.cofactor(i, j)}')
for k, ex in enumerate(M.get('expand', [])):
    A = MxS(ex['A']); kk = ex['k'] - 1; n = A.rows
    terms = [A[kk, j] * A.cofactor(kk, j) for j in range(n)] if ex['along'] == 'row' else [A[i, kk] * A.cofactor(i, kk) for i in range(n)]
    chk([sp.simplify(a - Q(b)) == 0 for a, b in zip(terms, ex['terms'])] == [True] * n, f'expand[{k}] {ex.get("desc","")}: 各项 = {terms}')
    chk(sum(terms) == Q(ex['det']) == A.det(), f'expand[{k}] {ex.get("desc","")}: 和 = {sum(terms)}，det = {A.det()}')
for k, ad in enumerate(M.get('adjs', [])):
    A = MxS(ad['A']); chk(A.adjugate() == MxS(ad['adj']), f'adjs[{k}] {ad.get("desc","")}: adj = {A.adjugate().tolist()}')
    chk(A * A.adjugate() == A.det() * sp.eye(A.rows), f'adjs[{k}]: A·adj A ≠ det(A) I')
for k, cr in enumerate(M.get('cramer', [])):
    A = Mx(cr['A']); b = Mx(cr['b']); n = A.rows; dA = A.det()
    chk(dA == Q(cr['det']), f'cramer[{k}] {cr.get("desc","")}: det A = {dA}')
    for i in range(n):
        Ai = A.copy(); Ai[:, i] = b; chk(Ai.det() == Q(cr['dets'][i]), f'cramer[{k}]: det A{i+1} = {Ai.det()}')
    chk(list(A.solve(b)) == [Q(v) for v in cr['x']], f'cramer[{k}]: x = {list(A.solve(b))}')
DS = M.get('detsteps', {})
for name, S in (DS.items() if isinstance(DS, dict) else []):
    cur = sp.Matrix([[sp.nsimplify(v) for v in r] for r in S['A']]); sign = 1; scale = 1
    for kk, (op, *args) in enumerate(S['ops']):
        if op == 'add': d, s_, c = args; cur[d, :] = cur[d, :] + sp.nsimplify(c) * cur[s_, :]
        elif op == 'swap': i, j = args; cur.row_swap(i, j); sign = -sign
        elif op == 'scale': i, c = args; cur[i, :] = sp.nsimplify(c) * cur[i, :]; scale *= sp.nsimplify(c)
        chk(cur == sp.Matrix([[sp.nsimplify(v) for v in r] for r in S['steps'][kk]]), f'detsteps.{name}: 第 {kk+1} 步 {op}{args} 得 {cur.tolist()}')
    D0 = sp.Matrix([[sp.nsimplify(v) for v in r] for r in S['A']]).det()
    if 'det' in S: chk(D0 == Q(S['det']), f'detsteps.{name}: det = {D0}')
    if 'sign' in S: chk(sign == S['sign'], f'detsteps.{name}: 交换次数的符号应为 {sign}')
    if 'diag' in S: chk([cur[i, i] for i in range(cur.rows)] == [Q(v) for v in S['diag']] and sp.prod([cur[i, i] for i in range(cur.rows)]) * sign / scale == D0, f'detsteps.{name}: 对角元 {[cur[i,i] for i in range(cur.rows)]}')

for k, ev in enumerate(M.get('evals', [])):                         # 通用数值 {expr, val[, approx]}：sympy 精确比较；approx=True 时相对误差 < 1%
    got = sp.sympify(ev['expr']); want = sp.sympify(str(ev['val']))
    okv = abs(float(got) - float(want)) <= 0.01 * abs(float(want)) if ev.get('approx') else sp.simplify(got - want) == 0
    chk(okv, f'evals[{k}] {ev.get("desc","")}: {ev["expr"]} = {got}，写的是 {ev["val"]}')

for k, cx in enumerate(M.get('cross', [])):                         # 叉积 {x, y, xy[, w, wxy]}：xy = x × y；可选 w·(x×y) = det(w;x;y) = wxy
    x, y = Mx(cx['x']).reshape(3, 1), Mx(cx['y']).reshape(3, 1); xy = x.cross(y)
    chk(xy == Mx(cx['xy']).reshape(3, 1), f'cross[{k}] {cx.get("desc","")}: x×y = {list(xy)}')
    chk(x.dot(xy) == 0 and y.dot(xy) == 0, f'cross[{k}] 不垂直')
    if 'w' in cx:
        w = Mx(cx['w']).reshape(3, 1); dv = sp.Matrix.hstack(w, x, y).T.det()
        chk(w.dot(xy) == dv == Q(cx['wxy']), f'cross[{k}] w·(x×y) = {w.dot(xy)}, det = {dv}')

for m in bad: print('✗', m)
print(f'{ok} 项通过')
print('MATHCHECK PASS' if not bad else f'MATHCHECK FAIL {len(bad)}')
sys.exit(1 if bad else 0)
