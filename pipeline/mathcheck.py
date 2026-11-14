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
        cur = A.copy()
        for k, (op, *args) in enumerate(S['ops']):
            if op == 'add': d, s, c = args; cur[d, :] = cur[d, :] + c * cur[s, :]
            elif op == 'swap': i, j = args; cur.row_swap(i, j)
            elif op == 'scale': i, c = args; cur[i, :] = sp.nsimplify(c) * cur[i, :]
            chk(cur == sp.Matrix(S['steps'][k]), f'{name}: 第 {k+1} 步 {op}{args} 得 {cur.tolist()}，math.json 写的是 {S["steps"][k]}')
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

for m in bad: print('✗', m)
print(f'{ok} 项通过')
print('MATHCHECK PASS' if not bad else f'MATHCHECK FAIL {len(bad)}')
sys.exit(1 if bad else 0)
