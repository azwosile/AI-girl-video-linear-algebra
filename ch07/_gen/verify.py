"""第七章 数值核对（sympy 精确 + numpy 浮点 + t 位十进制浮点模拟）。用法：python ch07/_gen/verify.py"""
import sympy as sp, numpy as np
from decimal import Decimal, ROUND_HALF_UP, getcontext
getcontext().prec = 60
M = sp.Matrix; R = sp.Rational
def p(*a): print(*a)

def fl(x, t):
    """t 位十进制浮点（四舍五入）"""
    x = Decimal(str(x))
    if x == 0: return Decimal(0)
    e = x.copy_abs().adjusted() + 1          # x = 0.d1d2… × 10^e
    q = Decimal(1).scaleb(e - t)
    return x.quantize(q, rounding=ROUND_HALF_UP)

p('===== 7.1')
p('Ex2 (0.236)_8×8² =', R(2, 8) * 64 + R(3, 64) * 64 + R(6, 512) * 64, ' (1.01011)_2×2⁴ =', (1 + R(1, 4) + R(1, 16) + R(1, 32)) * 16)
# Ex3 玩具系统：t=1, L=-1, U=1, β=10
S = sorted({0.0} | {s * d * 10.0 ** (e - 1) for s in (1, -1) for d in range(1, 10) for e in (-1, 0, 1)})
p('Ex3 个数', len(S), '|x|<0.1:', sum(1 for v in S if 0 < abs(v) < 0.1), '|x|<1:', sum(1 for v in S if 0 < abs(v) < 1), 'in [0,2]:', [v for v in S if 0 <= v <= 2])
# 表 1
for x in ['62133', '0.12658', '47.213']:
    xp = fl(x, 4); p('表1', x, '->', xp, 'abs', xp - Decimal(x), 'rel %.2e' % float((xp - Decimal(x)) / Decimal(x)))
p('表1 pi 3.142-pi', 3.142 - np.pi, 'rel', (3.142 - np.pi) / np.pi)
# Ex4 11.31 二进制
m = Decimal('0.31'); bits = []
for i in range(8): m *= 2; bits.append(int(m)); m -= int(m)
p('Ex4 0.31 的二进制位', bits, '取 6 位并进位 → .010100 =', 1 / 4 + 1 / 16, ' 11.3125 - 11.31 =', 11.3125 - 11.31, 'rel', (11.3125 - 11.31) / 11.31)
# Ex5
a, b = Decimal('2630'), Decimal('4.46')   # 书中 b′ = 0.446×10¹（和 0.263446×10⁴ 对得上）
p('Ex5 a+b', a + b, 'fl', fl(a + b, 3), 'abs', fl(a + b, 3) - (a + b), 'rel %.3e' % float((fl(a + b, 3) - (a + b)) / (a + b)))
p('Ex5 ab', a * b, 'fl', fl(a * b, 3), 'abs', fl(a * b, 3) - a * b, 'rel %.3e' % float((fl(a * b, 3) - a * b) / (a * b)))
p('机器ε 3位: fl(1+0.00499)=', fl(Decimal('1.00499'), 3), ' fl(1+0.005)=', fl(Decimal('1.005'), 3), ' 双精度 2^-52 =', 2.0 ** -52, np.finfo(float).eps)
# 结合律（Test A1 反例）
x, y, z = Decimal('1.00'), Decimal('0.004'), Decimal('0.004')
p('A1 (1+0.004)+0.004 =', fl(fl(x + y, 3) + z, 3), '  1+(0.004+0.004) =', fl(x + fl(y + z, 3), 3))
p('A1 双精度 (0.1+0.2)+0.3 =', repr((0.1 + 0.2) + 0.3), ' 0.1+(0.2+0.3) =', repr(0.1 + (0.2 + 0.3)))
# Ex6 抵消
c, d = Decimal('3.4215298'), Decimal('3.4213851'); cp_, dp_ = fl(c, 6), fl(d, 6)
p('Ex6 c\' =', cp_, 'd\' =', dp_, 'rel c %.2e' % float((cp_ - c) / c), 'rel d %.2e' % float((dp_ - d) / d), 'c\'-d\' =', cp_ - dp_, '真值', c - d,
  'abs', (cp_ - dp_) - (c - d), 'rel %.3e' % float(((cp_ - dp_) - (c - d)) / (c - d)))
# Ex7 IEEE 单精度
bs = '01000001100011000000000000000000'; e = int(bs[1:9], 2); mant = 1 + sum(int(bs[9 + i]) * 2.0 ** -(i + 1) for i in range(23))
p('Ex7 e =', e, 'k =', e - 127, 'x =', mant * 2 ** (e - 127), np.frombuffer(int(bs, 2).to_bytes(4, 'big'), '>f4')[0])
# Ex8 二次方程
b_ = -(1e7 + 1e-7); disc = np.sqrt(b_ * b_ - 4)
r1n, r2n = (-b_ + disc) / 2, (-b_ - disc) / 2
s = 1 if b_ >= 0 else -1; r1 = (-b_ - s * disc) / 2; r2 = 1 / r1
p('Ex8 公式: r1 = %r r2 = %r ; 改进: r1 = %r r2 = %r' % (r1n, r2n, r1, r2), ' r2 相对误差 %.3e' % ((r2n - 1e-7) / 1e-7))
p('x¹⁰ − 10⁻¹⁰ 的根模长', (1e-10) ** 0.1)

p('===== 7.2')
A = M([[2, 3, 1], [4, 1, 4], [3, 4, 6]]); Lm, U, _ = A.LUdecomposition(); p('Ex1 L', Lm.tolist(), 'U', U.tolist(), 'LU==A', Lm * U == A)
b = M([-4, 9, 0]); y = Lm.solve(b); x = U.solve(y); p('Ex2 y', y.T, 'x', x.T)
n = sp.Symbol('n'); k = sp.Symbol('k')
mul_elim = sp.summation((n - k) + (n - k) ** 2, (k, 1, n - 1)); mul_rhs = sp.summation(n - k, (k, 1, n - 1)); mul_sub = n * (n - 1) + n
p('乘除：消元', sp.expand(mul_elim), ' 前代+回代（含右端更新）', sp.expand(mul_sub), ' 合计', sp.expand(mul_elim + mul_sub))
add_elim = sp.summation((n - k) ** 2, (k, 1, n - 1)); add_rhs = sp.summation(n - k, (k, 1, n - 1)); add_sub = n * (n - 1)
p('加减：合计', sp.expand(add_elim + add_sub))
for nn in (3, 10, 100, 1000): p('  n =', nn, '乘除', int((sp.Rational(1, 3) * n ** 3 + n ** 2 - sp.Rational(1, 3) * n).subs(n, nn)), '  n³/3 ≈', round(nn ** 3 / 3))
p('乘法计数 (AB)x: n³+n² ; A(Bx): 2n²   n=1000 →', 1000 ** 3 + 1000 ** 2, 2 * 1000 ** 2)

p('===== 7.3')
A = M([[6, -4, 2], [4, 2, 1], [2, -1, 1]]); P = M([[0, 0, 1], [1, 0, 0], [0, 1, 0]]); Lm = M([[1, 0, 0], [3, 1, 0], [2, -4, 1]]); U = M([[2, -1, 1], [0, -1, -1], [0, 0, -5]])
p('Ex1 PA', (P * A).tolist(), 'LU', (Lm * U).tolist(), 'ok', P * A == Lm * U)
bb = M([-2, 4, -1]); c = P * bb; y = Lm.solve(c); x = U.solve(y); p('Ex2 c', c.T, 'y', y.T, 'x', x.T, 'check', (A * x).T)
# Ex3 小主元
p('Ex3 精确解', [R(2, 1) / R(19999, 10000), R(39997, 10000) / R(19999, 10000)], [float(R(20000, 19999)), float(R(39997, 19999))])
l = Decimal(1) / Decimal('0.0001'); a22 = fl(Decimal(1) - l * 2, 3); b2 = fl(Decimal(3) - l * 4, 3); x2 = fl(b2 / a22, 3); x1 = fl((Decimal(4) - 2 * x2) / Decimal('0.0001'), 3)
p('Ex3 不换行：l =', l, 'a22 =', a22, 'b2 =', b2, 'x2 =', x2, 'x1 =', x1)
l = Decimal('0.0001'); a22 = fl(Decimal(2) - l * 1, 3); b2 = fl(Decimal(4) - l * 3, 3); x2 = fl(b2 / a22, 3); x1 = fl(Decimal(3) - x2, 3)
p('Ex3 换行后：l =', l, 'a22 =', a22, 'b2 =', b2, 'x2 =', x2, 'x1 =', x1)

p('===== 7.4')
A = M([[-3, 2, 4, -3], [5, -2, -3, 5], [2, 1, -6, 4], [1, 1, 1, 1]])
p('Ex1 列和', [sum(abs(v) for v in A[:, j]) for j in range(4)], '行和', [sum(abs(v) for v in A[i, :]) for i in range(4)], 'F', sp.sqrt(sum(v * v for v in A)), '2-范', np.linalg.norm(np.array(A, float), 2))
A2 = M([[2, 1], [1, 3]]); An = np.array(A2, float); p('演示矩阵 [[2,1],[1,3]] σ', np.linalg.svd(An)[1], '‖·‖1', 4, '‖·‖∞', 4, 'F', np.sqrt(15))
for Aa in ([[1, 2], [0, 2]], [[3, 1], [0, 2]]): p('  ', Aa, 'σ', np.linalg.svd(np.array(Aa, float))[1], 'F', np.linalg.norm(Aa), '1', np.linalg.norm(Aa, 1), 'inf', np.linalg.norm(Aa, np.inf))
p('Ex2 (2,2;2,2.0005)\\(6,6.001)=', M([[2, 2], [2, R(20005, 10000)]]).solve(M([6, R(6001, 1000)])).T, '  (2,2;2,2.001)\\(6,6.001)=', M([[2, 2], [2, R(2001, 1000)]]).solve(M([6, R(6001, 1000)])).T,
  ' a22 rel', 0.0005 / 2.0005, ' cond∞', float(M([[2, 2], [2, R(20005, 10000)]]).norm(sp.oo) * M([[2, 2], [2, R(20005, 10000)]]).inv().norm(sp.oo)))
A = M([[3, 3], [4, 5]]); Ai = A.inv(); p('Ex3 A⁻¹', (3 * Ai).tolist(), '/3  ‖A‖∞', A.norm(sp.oo), '‖A⁻¹‖∞', Ai.norm(sp.oo), 'cond∞', A.norm(sp.oo) * Ai.norm(sp.oo))
xp = M([R(2), R(1, 10)]); r = M([6, 9]) - A * xp; xt = A.solve(M([6, 9])); e = xt - xp
p('Ex4 r', r.T, '‖r‖∞/‖b‖∞', r.norm(sp.oo) / 9, ' x', xt.T, 'e', e.T, '相对误差', e.norm(sp.oo) / xt.norm(sp.oo), ' 上界 cond·', 24 * r.norm(sp.oo) / 9, ' 下界', r.norm(sp.oo) / 9 / 24)
p('Ex5 100×2^99 =', '%.3e' % (100 * 2.0 ** 99))
H = M(4, 4, lambda i, j: R(1, i + j + 1)); Hi = H.inv(); p('Hilbert4 H⁻¹', Hi.tolist(), '‖H‖1', H.norm(1) if False else max(sum(H[:, j]) for j in range(4)), '‖H⁻¹‖1', max(sum(abs(v) for v in Hi[:, j]) for j in range(4)))
c1 = max(sum(H[:, j]) for j in range(4)) * max(sum(abs(v) for v in Hi[:, j]) for j in range(4)); bnorm = 50
p('  cond1(H)', c1, float(c1), ' 相对误差上界 cond·‖r‖/‖b‖ =', '%.3e' % (float(c1) * 0.36e-11 / bnorm), ' x_exact', H.solve(M([10, -10, 20, 10])).T)
for nn in (4, 8, 12): Hn = np.array([[1 / (i + j + 1) for j in range(nn)] for i in range(nn)]); p('  Hilbert', nn, 'cond2 %.2e' % np.linalg.cond(Hn))
Hn = np.array([[1 / (i + j + 1) for j in range(12)] for i in range(12)]); xs = np.ones(12); bs_ = Hn @ xs; xc = np.linalg.solve(Hn, bs_)
p('  H12 解全 1：相对误差 %.2e 残差 %.2e' % (np.linalg.norm(xc - xs, np.inf) / 1, np.linalg.norm(bs_ - Hn @ xc, np.inf) / np.linalg.norm(bs_, np.inf)))
p('TB5 log10(5e6) =', np.log10(5e6), ' 2ε·cond = 2×0.5e-14×5e6 =', 2 * 0.5e-14 * 5e6)
A = M([[R(1), 1], [1, R(10001, 10000)]]); p('近奇异 cond2', float(np.linalg.cond(np.array(A, float))))

p('===== 7.5')
x = M([1, 2, 2]); alpha = -x.norm(); v = M([x[0] - alpha, x[1], x[2]]); beta = alpha * (alpha - x[0]); Hh = sp.eye(3) - v * v.T / beta
p('HEx1 α', alpha, 'β', beta, 'v', v.T, 'H×3', (3 * Hh).tolist(), 'Hx', (Hh * x).T, 'HᵀH=I', Hh.T * Hh == sp.eye(3))
H4 = sp.diag(1, Hh); p('HEx2 Hy', (H4 * M([3, 1, 2, 2])).T)
x = M([-3, 4]); r_ = x.norm(); c, s = x[0] / r_, -x[1] / r_; Rr = M([[c, -s], [s, c]]); G = M([[c, x[1] / r_], [x[1] / r_, -c]])
p('GEx3 R', Rr.tolist(), 'Rx', (Rr * x).T, 'G', G.tolist(), 'Gx', (G * x).T, 'det R', Rr.det(), 'det G', G.det())
x = M([5, 8, 12]); r_ = sp.sqrt(25 + 144); c, s = 5 / r_, -12 / r_; Rr = M([[c, 0, -s], [0, 1, 0], [s, 0, c]]); p('GEx4 R', Rr.tolist(), 'Rx', (Rr * x).T)
e = np.array([1e-3, -2e-3]); th = 0.7; Q = np.array([[np.cos(th), -np.sin(th)], [np.sin(th), np.cos(th)]]); p('‖Qe‖ = ‖e‖', np.linalg.norm(Q @ e), np.linalg.norm(e))

p('===== 7.6')
A = M([[2, 1], [1, 2]]); u = M([2, 1]); seq = []
for k in range(1, 6):
    v = A * u; j = max(range(2), key=lambda i: abs(v[i])); seq.append((k, v.T, j, v[j])); u = v / v[j]; seq[-1] += (u.T,)
for s_ in seq: p('幂法 Ex1 k=%d v=%s j=%d λ≈%s u=%s' % (s_[0], s_[1], s_[2], s_[3], s_[4]), [float(t) for t in s_[4]], float(s_[3]))
G1 = M([[2, 1], [1, -2]]) / sp.sqrt(5); A2 = sp.simplify(G1 * A * G1); p('QR Ex2 A2', A2.tolist())
G2 = M([[R(28, 10), R(-6, 10)], [R(-6, 10), R(-28, 10)]]) / sp.sqrt(R(82, 10)); A3 = sp.simplify(G2 * A2 * G2); p('QR Ex2 A3', [[float(v) for v in r] for r in A3.tolist()], A3.tolist())
An = np.array([[2., 1], [1, 2]]); Ak = An.copy()
for k in range(1, 7):
    Q_, R_ = np.linalg.qr(Ak); Ak = R_ @ Q_; p('  QR 迭代 k=%d' % k, np.round(Ak, 5).tolist())
# x^10 扰动
p('x¹⁰ 扰动 10⁻¹⁰：根模', abs(np.roots([1] + [0] * 9 + [-1e-10])).round(6)[:3])
# 非对称敏感（Test A5 反例）
for eps in (1e-6, 1e-10): Ae = np.array([[1, 1], [eps, 1]]); p('  A5 [[1,1],[ε,1]] ε=%g 特征值' % eps, np.linalg.eigvals(Ae))
eps = 1e-10; As = np.array([[1, 0], [0, 1]]) + np.array([[0, 0], [eps, 0]]); p('  A4 对称 I+E 特征值', np.linalg.eigvals(As + As.T - np.eye(2) - np.eye(2) + np.eye(2) * 2 - np.eye(2)))
# 幂法收敛速度示意矩阵 [[3,1],[1,3]]? 用 Ex1 即可：|λ2/λ1| = 1/3
p('收敛比 1/3 的幂：', [(1 / 3) ** k for k in range(1, 6)])

p('===== 7.7')
A = np.array([[1., 1], [1, 1 + 1e-6], [1, 1 - 1e-6]]); p('cond(A) %.3e  cond(AᵀA) %.3e' % (np.linalg.cond(A), np.linalg.cond(A.T @ A)))
# 经典 vs 修正 Gram-Schmidt（Läuchli 例）
e_ = 1e-8; A = np.array([[1, 1, 1], [e_, 0, 0], [0, e_, 0], [0, 0, e_]])
def cgs(A):
    Q = np.zeros_like(A)
    for k in range(A.shape[1]):
        v = A[:, k].copy()
        for j in range(k): v -= (Q[:, j] @ A[:, k]) * Q[:, j]
        Q[:, k] = v / np.linalg.norm(v)
    return Q
def mgs(A):
    V = A.copy(); Q = np.zeros_like(A)
    for k in range(A.shape[1]):
        Q[:, k] = V[:, k] / np.linalg.norm(V[:, k])
        for j in range(k + 1, A.shape[1]): V[:, j] -= (Q[:, k] @ V[:, j]) * Q[:, k]
    return Q
Qc, Qm = cgs(A), mgs(A); p('Läuchli ε=1e-8  q2·q3: CGS %.3f  MGS %.2e' % (Qc[:, 1] @ Qc[:, 2], Qm[:, 1] @ Qm[:, 2]))
# Test B9 SVD 最小范数
A = M([[5, 2, 4], [5, 2, 4], [3, 6, 0], [3, 6, 0]]); b = M([5, 1, -1, 9]); h = R(1, 2)
U = M([[h, h, h, h], [h, h, -h, -h], [h, -h, -h, h], [h, -h, h, -h]]); S = M([[12, 0, 0], [0, 6, 0], [0, 0, 0], [0, 0, 0]]); V = M([[2, 2, 1], [1, -2, 2], [-2, -1, 2]]).T / 3
p('TB9 USVᵀ==A', sp.simplify(U * S * V.T - A) == sp.zeros(4, 3), 'Uᵀb', (U.T * b).T, 'y', [(U[:, 0].T * b)[0] / 12, (U[:, 1].T * b)[0] / 6], 'A⁺b', (A.pinv() * b).T,
  'x', ((U[:, 0].T * b)[0] / 12 * V[:, 0] + (U[:, 1].T * b)[0] / 6 * V[:, 1]).T, 'rank', A.rank())
xs = A.pinv() * b; p('  正规方程检查 AᵀA x = Aᵀb', (A.T * A * xs - A.T * b).T, '‖x‖²', (xs.T * xs)[0], '零空间', A.nullspace()[0].T)
# Test B10 Householder 最小二乘
A = M([[1, 5], [1, 5], [1, 6], [1, 2]]); b = M([2, 4, 5, 3])
def house(x):
    a_ = -sp.sign(x[0]) * x.norm() if x[0] != 0 else -x.norm(); v = sp.Matrix(list(x)); v[0] = x[0] - a_; beta = a_ * (a_ - x[0]); return sp.eye(len(x)) - v * v.T / beta, a_, v, beta
H1, a1, v1, b1 = house(A[:, 0]); A1 = sp.simplify(H1 * A); bb1 = sp.simplify(H1 * b); p('TB10 H1: α', a1, 'v', v1.T, 'β', b1, 'H1A', A1.tolist(), 'H1b', bb1.T)
x2 = A1[1:, 1]; H2s, a2, v2, b2_ = house(x2); H2 = sp.diag(1, H2s); A2 = sp.simplify(H2 * A1); bb2 = sp.simplify(H2 * bb1)
p('  H2: α', a2, 'v', v2.T, 'β', b2_, 'R', A2.tolist(), 'c', bb2.T)
xls = A2[:2, :2].solve(bb2[:2, 0]); p('  x', xls.T, '正规方程', (A.T * A).solve(A.T * b).T, '残差范数', sp.sqrt(sum(v * v for v in bb2[2:, 0])), sp.sqrt(((b - A * xls).T * (b - A * xls))[0]))

p('===== Test B')
A = M([[2, 3, 6], [4, 4, 8], [1, 3, 4]]); b = M([3, 0, 4]); c = M([1, 8, 2])
P = M([[0, 1, 0], [0, 0, 1], [1, 0, 0]]); PA = P * A; Lm, U, perm = PA.LUdecomposition(); p('TB2 PA', PA.tolist(), 'L', Lm.tolist(), 'U', U.tolist(), 'perm', perm)
p('  x(b)', A.solve(b).T, ' x(c)', A.solve(c).T, ' Pc', (P * c).T, ' y', Lm.solve(P * c).T)
x = M([1, 2, -2]); Hh, a_, v, beta = house(x); p('TB6 H: α', a_, 'v', v.T, 'β', beta, 'H×3', (3 * Hh).tolist(), 'Hx', (Hh * x).T)
r_ = sp.sqrt(8); cc, ss = 2 / r_, 2 / r_   # s = −x₃/r; G = M([[1, 0, 0], [0, cc, -ss], [0, ss, cc]]); p('  Givens(2,3)', G.tolist(), 'Gx', sp.simplify(G * x).T)
A = M([[1, 2], [4, 3]]); p('TB8 eig', A.eigenvects()); u = M([1, 1])
for k in range(1, 6): v = A * u; j = max(range(2), key=lambda i: abs(v[i])); u = v / v[j]; p('  k=%d v=%s λ≈%s u=%s' % (k, v.T, v[j], u.T), float(v[j]), [float(t) for t in u])
Q = np.linalg.qr(np.random.default_rng(1).normal(size=(4, 4)))[0]; p('TB3 ‖Q‖2', np.linalg.norm(Q, 2), '‖Q‖F', np.linalg.norm(Q))
Qs = M([[0, 1], [1, 0]]); Rs = M([[1, 2], [0, 3]]); p('TB7 QR vs RQ 特征值', (Qs * Rs).eigenvals(), (Rs * Qs).eigenvals(), ' RQ = Qᵀ(QR)Q', sp.simplify(Qs.T * (Qs * Rs) * Qs - Rs * Qs) == sp.zeros(2))
