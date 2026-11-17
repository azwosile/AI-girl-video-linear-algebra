"""第五章全部 tex.json（TeX 里不放中文和 \\text）。用法：python ch05/_gen/s5.py → 各段 tex.json"""
import json
from pathlib import Path
HERE = Path(__file__).resolve().parents[1]
def bm(M, env='bmatrix'):
    return f'\\begin{{{env}}}' + r'\\'.join('&'.join(str(v) for v in r) for r in M) + f'\\end{{{env}}}'
v = lambda *xs: bm([[x] for x in xs])
I_ = r'\color{#F2B544}'; J_ = r'\color{#4FC1A6}'; P_ = r'\color{#E06A3A}'; F_ = r'\color{#E8577A}'; K_ = r'\color{#8C9DFF}'
ci = lambda s: '{' + I_ + str(s) + '}'; cj = lambda s: '{' + J_ + str(s) + '}'; cp = lambda s: '{' + P_ + str(s) + '}'; cf = lambda s: '{' + F_ + str(s) + '}'; ck = lambda s: '{' + K_ + str(s) + '}'
x, y, u, p, b, z, q, r, a = (r'\mathbf ' + c for c in 'xyupbzqra')
nx, ny = r'\|\mathbf x\|', r'\|\mathbf y\|'
T = {}
T['s5_1a'] = {
 'dotdef': x + '^T' + y + '=x_1y_1+x_2y_2+\\cdots+x_ny_n',
 'e1': x + '=' + v(3, -2, 1) + r',\;' + y + '=' + v(4, 3, 2),
 'e1c': x + '^T' + y + r'=3\cdot4+(-2)\cdot3+1\cdot2=' + cp(8),
 'len': nx + r'=\sqrt{' + x + '^T' + x + r'}=\sqrt{x_1^2+x_2^2}',
 'dist': r'd(' + x + ',' + y + r')=\|' + x + '-' + y + r'\|',
 'e2': r'\|' + y + '-' + x + r'\|=\sqrt{(-4)^2+3^2}=' + cp(5),
 'thm': x + '^T' + y + '=' + nx + r'\,' + ny + r'\cos\theta',
 'cosl': r'\|' + y + '-' + x + r'\|^2=' + nx + '^2+' + ny + '^2-2' + nx + ny + r'\cos\theta',
 'expd': r'\|' + y + '-' + x + r'\|^2=' + ny + '^2-' + cp('2' + x + '^T' + y) + '+' + nx + '^2',
 'e3': r'\cos\theta=\dfrac{25}{5\cdot5\sqrt2}=\dfrac{1}{\sqrt2},\quad\theta=\dfrac{\pi}{4}',
 'cs': r'|' + x + '^T' + y + r'|\le' + nx + r'\,' + ny,
 'orth': x + '^T' + y + r'=0\iff' + x + r'\perp' + y,
 'e4a': r'(3,2)\cdot(-4,6)=-12+12=' + cp(0),
 'e4b': r'(2,-3,1)\cdot(1,1,1)=2-3+1=' + cp(0),
 'cosn': r'\cos\theta=\dfrac{' + x + '^T' + y + '}{' + nx + r'\,' + ny + r'},\quad 0\le\theta\le\pi',
 'exp': r'\|' + x + '+' + y + r'\|^2=' + nx + '^2+' + cf('2' + x + '^T' + y) + '+' + ny + '^2',
 'py': r'\|' + x + '+' + y + r'\|^2=' + nx + '^2+' + ny + '^2',
 'tj': r'[' + x + ',' + y + ']=' + x + '^T' + y,
 'tju': r'\dfrac{' + x + '}{' + nx + '}',
 'cosq': r'\cos\theta=\dfrac{' + r'\mathbf d_1^T\mathbf d_2' + '}{' + r'\|\mathbf d_1\|\,\|\mathbf d_2\|' + '}',
}

T['s5_1b'] = {
 'dec': x + '=' + cp(p) + '+' + cf(z) + r',\quad ' + cp(p) + r'\parallel' + y + r',\;' + cf(z) + r'\perp' + y,
 'u': u + r'=\dfrac{' + y + '}{' + ny + r'},\quad ' + p + r'=\alpha' + u,
 'alpha': r'\alpha=' + nx + r'\cos\theta=\dfrac{' + x + '^T' + y + '}{' + ny + '}',
 'pf': cp(p) + r'=\dfrac{' + x + '^T' + y + '}{' + y + '^T' + y + r'}\,' + y,
 'two': r'\dfrac{' + x + '^T' + y + '}{' + ny + r'}\cdot\dfrac{' + y + '}{' + ny + r'}',
 'e5': r'\mathbf v=' + v(1, 4) + r',\;\mathbf w=' + v(3, 1),
 'e5c': r'\dfrac{\mathbf v^T\mathbf w}{\mathbf w^T\mathbf w}=\dfrac{7}{10},\quad Q=' + cp(r'(2.1,\;0.7)'),
 'pl': r'(P-P_0)\cdot\mathbf N=0',
 'ple': r'a(x-x_0)+b(y-y_0)+c(z-z_0)=0',
 'e6': r'2(x-2)+3(y+1)+4(z-3)=0',
 'e7': r'\mathbf N=\overrightarrow{P_1P_2}\times\overrightarrow{P_1P_3}=' + cp(r'(6,\,1,\,-8)^T'),
 'e7p': r'6(x-1)+(y-1)-8(z-2)=0',
 'e8': r'd=\dfrac{|\mathbf v^T\mathbf N|}{\|\mathbf N\|}=\dfrac{2}{3}',
 'tb1': x + r'=(1,1,2,2)^T,\;' + y + r'=(-2,1,2,0)^T',
 'tb1p': x + '^T' + y + r'=3,\;' + y + '^T' + y + r'=9,\;' + cp(p) + r'=\tfrac13' + y,
 'tb1z': r'(' + x + '-' + p + r')^T' + p + r'=-\tfrac{10}{9}+\tfrac29+\tfrac89+0=' + cp(0),
 'tb1py': r'\|' + p + r'\|^2+\|' + x + '-' + p + r'\|^2=1+9=10=\|' + x + r'\|^2',
 'tj': r'\dfrac{[\mathbf b,\mathbf a]}{[\mathbf a,\mathbf a]}\,\mathbf a',
}

T['s5_2'] = {
 'def': r'X\perp Y\iff ' + x + '^T' + y + r'=0\quad\forall\,' + x + r'\in X,\;' + y + r'\in Y',
 'wall': r'(1,1,0)\cdot(0,1,1)=' + cf(1) + r'\ne0',
 'cap': x + r'\in X\cap Y\Rightarrow ' + x + '^T' + x + r'=0\Rightarrow ' + x + r'=\mathbf 0',
 'comp': r'Y^\perp=\{' + x + r'\in\mathbb R^n:\;' + x + '^T' + y + r'=0\;\forall\,' + y + r'\in Y\}',
 'rows': r'A' + x + r'=\mathbf 0\iff ' + cp(r'\mathbf a_i^T') + x + r'=0,\;i=1,\dots,m',
 'nr': r'N(A)\perp R(A^T)',
 'thm': r'N(A)=R(A^T)^\perp,\qquad N(A^T)=R(A)^\perp',
 'A': r'A=' + bm([[1, 1, 2], [0, 1, 1], [1, 3, 4]]),
 'rref': r'U=' + bm([[1, 0, 1], [0, 1, 1], [0, 0, 0]]),
 'NA': r'N(A)=\mathrm{span}\{(-1,-1,1)^T\}',
 'NAT': r'N(A^T)=\mathrm{span}\{(-1,-2,1)^T\}',
 'RA': r'R(A):\;(1,0,1)^T,\;(0,1,2)^T',
 'dim': r'\dim S+\dim S^\perp=n',
 'dsum': r'\mathbb R^n=S\oplus S^\perp',
 'pp': r'(S^\perp)^\perp=S',
 'cor': r'A' + x + r'=' + b + r'\;\text{}' ,
 'fred': r'\exists\,' + y + r':\;A^T' + y + r'=\mathbf 0,\;' + y + '^T' + b + r'\ne0',
 'tj': r'R(A)+\dim N=n',
}
T['s5_2']['cor'] = r'A' + x + '=' + b + r'\;\;\mathrm{or}\;\;'
T['s5_2']['tj'] = r'r(A)+\dim S=n'

xh = r'\hat{\mathbf x}'
T['s5_3a'] = {
 'over': r'A_{m\times n}' + x + '=' + b + r',\quad m>n',
 'res': cf(r) + r'(' + x + ')=' + b + r'-A' + x + r',\quad\min\|' + r + r'\|^2=\min\sum r_i^2',
 'thm1': r'\|' + b + r'-\mathbf y\|^2=\|' + b + '-' + p + r'\|^2+\|' + p + r'-\mathbf y\|^2',
 'perp': cf(b + '-' + p) + r'\perp S',
 'rn': cf(r) + r'\in R(A)^\perp=N(A^T)',
 'ne0': r'A^T(' + b + '-A' + xh + r')=\mathbf 0',
 'ne': cp(r'A^TA\,' + xh + r'=A^T' + b),
 'uniq': xh + r'=(A^TA)^{-1}A^T' + b,
 'P': p + '=A' + xh + r'=\underbrace{A(A^TA)^{-1}A^T}_{P}\,' + b,
 'e1': r'\begin{aligned}x_1+x_2&=3\\-2x_1+3x_2&=1\\2x_1-x_2&=2\end{aligned}',
 'e1A': r'A=' + bm([[1, 1], [-2, 3], [2, -1]]) + r',\;' + b + '=' + v(3, 1, 2),
 'e1n': r'A^TA=' + bm([[9, -7], [-7, 11]]) + r',\;A^T' + b + '=' + v(5, 4),
 'e1x': xh + r'=\left(\tfrac{83}{50},\;\tfrac{71}{50}\right)^T',
 'e1r': cf(r) + r'=\left(-\tfrac{2}{25},\;\tfrac{3}{50},\;\tfrac{1}{10}\right)^T,\quad A^T' + r + r'=\mathbf 0',
}
T['s5_3b'] = {
 'line': r'y=c_0+c_1x',
 'sys': r'A=' + bm([[1, 'x_1'], [1, 'x_2'], [r'\vdots', r'\vdots'], [1, 'x_m']]) + r',\;\mathbf c=' + v('c_0', 'c_1') + r',\;' + y + '=' + v('y_1', 'y_2', r'\vdots', 'y_m'),
 'e2A': r'A=' + bm([[1, 0], [1, 3], [1, 6]]) + r',\;' + y + '=' + v(1, 4, 5),
 'e2n': bm([[3, 9], [9, 45]]) + r'\mathbf c=' + v(10, 42) + r'\;\Rightarrow\;\mathbf c=' + v(r'\tfrac43', r'\tfrac23'),
 'e2f': cp(r'y=\tfrac43+\tfrac23x') + r',\quad\sum r_i^2=\tfrac23',
 'calc': r'\dfrac{\partial}{\partial c_0}\|\mathbf r\|^2=0,\;\dfrac{\partial}{\partial c_1}\|\mathbf r\|^2=0',
 'calc2': r'\begin{aligned}3c_0+9c_1&=10\\3c_0+15c_1&=14\end{aligned}',
 'quad': r'y=c_0+c_1x+c_2x^2,\quad A=' + bm([[1, 'x_i', 'x_i^2']]),
 'e3A': r'A=' + bm([[1, 0, 0], [1, 1, 1], [1, 2, 4], [1, 3, 9]]) + r',\;' + y + '=' + v(3, 2, 4, 4),
 'e3n': bm([[4, 6, 14], [6, 14, 36], [14, 36, 98]]) + r'\mathbf c=' + v(13, 22, 54),
 'e3f': cp(r'y=\tfrac{11}{4}-\tfrac14x+\tfrac14x^2'),
 'lin': r'y=c_1\sin x+c_2e^{x}+c_3',
 'tb7': r'(-1,1),\;(1,3),\;(2,3)',
 'tb7n': r'A^TA=' + bm([[3, 2], [2, 6]]) + r',\;A^T' + y + '=' + v(7, 8),
 'tb7f': cp(r'f(x)=\tfrac{13}{7}+\tfrac57x'),
 'tj': r'\hat b=\dfrac{\sum(x_i-\bar x)(y_i-\bar y)}{\sum(x_i-\bar x)^2}',
}

ip = lambda a_, b_: r'\langle ' + a_ + ',' + b_ + r'\rangle'
T['s5_4'] = {
 'ip': ip(x, y) + r'\in\mathbb R',
 'ax1': r'\mathrm{I.}\;' + ip(x, x) + r'\ge0,\;=0\iff ' + x + r'=\mathbf 0',
 'ax2': r'\mathrm{II.}\;' + ip(x, y) + '=' + ip(y, x),
 'ax3': r'\mathrm{III.}\;' + ip(r'\alpha' + x + r'+\beta' + y, r'\mathbf z') + r'=\alpha' + ip(x, r'\mathbf z') + r'+\beta' + ip(y, r'\mathbf z'),
 'std': ip(x, y) + '=' + x + '^T' + y + r',\quad ' + ip(x, y) + r'=\sum w_ix_iy_i\;(w_i>0)',
 'mat': ip('A', 'B') + r'=\sum_{i,j}a_{ij}b_{ij}',
 'matE': r'A=' + bm([[1, 1], [1, 2], [3, 3]]) + r',\;B=' + bm([[-1, 1], [3, 0], [-3, 4]]),
 'matR': ip('A', 'B') + r'=' + cp(6) + r',\;\|A\|_F=5,\;\|B\|_F=6',
 'fun': ip('f', 'g') + r'=\int_a^b f(x)g(x)\,dx',
 'e1': ip('1', 'x') + r'=\int_{-1}^{1}x\,dx=' + cp(0),
 'e1n': r'\|1\|=\sqrt2,\;\|x\|=\tfrac{\sqrt6}{3}',
 'e1p': r'\|1+x\|^2=2+\tfrac23=\tfrac83',
 'e2': ip('f', 'g') + r'=\tfrac1\pi\int_{-\pi}^{\pi}f\,g\,dx,\quad\|\cos x\|=\|\sin x\|=1,\;' + ip(r'\cos x', r'\sin x') + '=0',
 'proj': cp(p) + r'=\dfrac{' + ip(u, r'\mathbf v') + '}{' + ip(r'\mathbf v', r'\mathbf v') + r'}\,\mathbf v,\quad (' + u + '-' + p + r')\perp ' + p,
 'cs': r'|' + ip(u, r'\mathbf v') + r'|\le\|' + u + r'\|\,\|\mathbf v\|',
 'cos': r'\cos\theta=\dfrac{' + ip(u, r'\mathbf v') + r'}{\|' + u + r'\|\,\|\mathbf v\|}\in[-1,1]',
 'norm': r'\|' + x + r'\|\ge0,\;\;\|\alpha' + x + r'\|=|\alpha|\,\|' + x + r'\|,\;\;\|' + x + '+' + y + r'\|\le\|' + x + r'\|+\|' + y + r'\|',
 'e5': x + r'=(4,-5,3)^T',
 'e5n': r'\|' + x + r'\|_1=' + ci(12) + r',\;\|' + x + r'\|_2=' + cj(r'5\sqrt2') + r',\;\|' + x + r'\|_\infty=' + ck(5),
}
T['s5_5'] = {
 'def': ip(r'\mathbf v_i', r'\mathbf v_j') + r'=0\;(i\ne j),\qquad\|\mathbf u_i\|=1',
 'e1': r'\mathbf v_1=' + v(1, 1, 1) + r',\;\mathbf v_2=' + v(2, 1, -3) + r',\;\mathbf v_3=' + v(4, -5, 1),
 'li': r'\sum c_i\mathbf v_i=\mathbf 0\;\Rightarrow\;c_j\|\mathbf v_j\|^2=0\;\Rightarrow\;c_j=0',
 'e2': r'\dfrac{\mathbf v_1}{\sqrt3},\;\dfrac{\mathbf v_2}{\sqrt{14}},\;\dfrac{\mathbf v_3}{\sqrt{42}}',
 'coord': r'\mathbf v=\sum c_i\mathbf u_i,\quad ' + cp(r'c_i=' + ip(r'\mathbf v', r'\mathbf u_i')),
 'pars': ip(u, r'\mathbf v') + r'=\sum a_ib_i,\qquad\|\mathbf v\|^2=\sum c_i^2',
 'e5': r'\sin^2x=\tfrac{1}{\sqrt2}\cdot\tfrac{1}{\sqrt2}+\left(-\tfrac12\right)\cos2x',
 'e5r': r'\tfrac1\pi\int_{-\pi}^{\pi}\sin^4x\,dx=\tfrac12+\tfrac14\;\Rightarrow\;\int_{-\pi}^{\pi}\sin^4x\,dx=' + cp(r'\tfrac{3\pi}{4}'),
 'Q': r'Q^TQ=I\iff Q^{-1}=Q^T',
 'rot': bm([[r'\cos\theta', r'-\sin\theta'], [r'\sin\theta', r'\cos\theta']]),
 'pres': ip(r'Q' + x, r'Q' + y) + '=' + ip(x, y) + r',\quad\|Q' + x + r'\|=\|' + x + r'\|',
 'perm': r'P=' + bm([[0, 1, 0], [0, 0, 1], [1, 0, 0]]),
 'ls': r'A^TA=I\;\Rightarrow\;' + r'\hat{\mathbf x}=A^T' + b,
 'pS': cp(p) + r'=\sum_{i=1}^k' + ip(b, r'\mathbf u_i') + r'\,\mathbf u_i',
 'UU': cp(p) + r'=UU^T' + b,
 'e7': r'UU^T' + v(5, 3, 4) + '=' + bm([[1, 0, 0], [0, 1, 0], [0, 0, 0]]) + v(5, 3, 4) + '=' + v(5, 3, 0),
 'tb8': x + r'=2\mathbf u_1-2\mathbf u_2+\mathbf u_3,\;' + y + r'=3\mathbf u_1+\mathbf u_2-4\mathbf u_3',
 'tb8r': ip(x, y) + r'=6-2-4=' + cp(0) + r',\quad\|' + x + r'\|=\sqrt{4+4+1}=' + cp(3),
 'tj': r'A^TA=E',
 'tj2': r'\det Q=\pm1,\qquad Q_1Q_2\;\mathrm{orthogonal}',
}

q_ = lambda i: r'\mathbf q_' + str(i)
T['s5_6'] = {
 'idea': r'\mathbf u_{k+1}=\dfrac{\mathbf x_{k+1}-\mathbf p_k}{\|\mathbf x_{k+1}-\mathbf p_k\|},\quad\mathbf p_k=\sum_{i\le k}' + ip(r'\mathbf x_{k+1}', r'\mathbf u_i') + r'\mathbf u_i',
 's1': r'\mathbf u_1=\dfrac{\mathbf x_1}{\|\mathbf x_1\|}',
 's2': r'\mathbf p_1=' + ip(r'\mathbf x_2', r'\mathbf u_1') + r'\mathbf u_1,\;\;\mathbf u_2=\dfrac{\mathbf x_2-\mathbf p_1}{\|\mathbf x_2-\mathbf p_1\|}',
 's3': r'\mathbf p_2=' + ip(r'\mathbf x_3', r'\mathbf u_1') + r'\mathbf u_1+' + ip(r'\mathbf x_3', r'\mathbf u_2') + r'\mathbf u_2',
 'span': r'\mathrm{span}(\mathbf u_1,\dots,\mathbf u_k)=\mathrm{span}(\mathbf x_1,\dots,\mathbf x_k)',
 'e2A': r'A=' + bm([[1, -1, 4], [1, 4, -2], [1, 4, 2], [1, -1, 0]]),
 'r11': r'r_{11}=\|\mathbf a_1\|=2,\;\;' + q_(1) + r'=\tfrac12(1,1,1,1)^T',
 'r12': r'r_{12}=' + q_(1) + r'^T\mathbf a_2=3,\;\;\mathbf a_2-3' + q_(1) + r'=\tfrac52(-1,1,1,-1)^T',
 'q2': r'r_{22}=5,\;\;' + q_(2) + r'=\tfrac12(-1,1,1,-1)^T',
 'r13': r'r_{13}=2,\;r_{23}=-2,\;\;\mathbf a_3-\mathbf p_2=(2,-2,2,-2)^T',
 'q3': r'r_{33}=4,\;\;' + q_(3) + r'=\tfrac12(1,-1,1,-1)^T',
 'QR': r'A=QR,\quad R=' + bm([[2, 3, 2], [0, 5, -2], [0, 0, 4]]),
 'thm': r'A_{m\times n}=Q_{m\times n}R_{n\times n},\;\;Q^TQ=I,\;\;r_{ii}>0',
 'cols': r'\begin{aligned}\mathbf a_1&=r_{11}' + q_(1) + r'\\\mathbf a_2&=r_{12}' + q_(1) + r'+r_{22}' + q_(2) + r'\\\mathbf a_3&=r_{13}' + q_(1) + r'+r_{23}' + q_(2) + r'+r_{33}' + q_(3) + r'\end{aligned}',
 'ls': cp(r'R\hat{\mathbf x}=Q^T' + b),
 'e4': r'R=' + bm([[5, -2, 1], [0, 4, -1], [0, 0, 2]]) + r',\;Q^T' + b + '=' + v(-1, -1, 2),
 'e4x': r'\hat{\mathbf x}=\left(-\tfrac25,\;0,\;1\right)^T',
 'poly': r'1,\;x,\;x^2\;\longrightarrow\;\mathrm{orthogonal\ polynomials}',
 'tjs': r'\mathbf b_1=\mathbf a_1,\quad\mathbf b_2=\mathbf a_2-\dfrac{[\mathbf a_2,\mathbf b_1]}{[\mathbf b_1,\mathbf b_1]}\mathbf b_1',
 'tjs3': r'\mathbf b_3=\mathbf a_3-\dfrac{[\mathbf a_3,\mathbf b_1]}{[\mathbf b_1,\mathbf b_1]}\mathbf b_1-\dfrac{[\mathbf a_3,\mathbf b_2]}{[\mathbf b_2,\mathbf b_2]}\mathbf b_2',
 'tje': r'\mathbf a_1=' + v(1, 2, -1) + r',\;\mathbf a_2=' + v(-1, 3, 1) + r',\;\mathbf a_3=' + v(4, -1, 0),
 'tjr': r'\mathbf b_2=\tfrac53' + v(-1, 1, 1) + r',\;\;\mathbf b_3=2' + v(1, 0, 1),
}

pj = lambda a_, b_: r'\mathrm{proj}_{' + b_ + '}' + a_
T['s5_xa'] = {
 'q1': pj(x, y) + '=' + pj(y, x),
 'q1b': pj(x, y) + r'=\dfrac{' + x + '^T' + y + '}{' + y + '^T' + y + r'}\,' + cj(y) + r'\qquad ' + pj(y, x) + r'=\dfrac{' + x + '^T' + y + '}{' + x + '^T' + x + r'}\,' + ci(x),
 'q2': r'\|' + x + r'\|=\|' + y + r'\|=1,\;|' + x + '^T' + y + r'|=1\;\Rightarrow\;' + x + ',' + y + r'\;\mathrm{independent}',
 'q2b': r'|' + x + '^T' + y + r'|=\|' + x + r'\|\,\|' + y + r'\|\;\Rightarrow\;' + y + r'=\pm' + x,
 'q3': r'U\perp V,\;V\perp W\;\Rightarrow\;U\perp W',
 'q4': r'\exists\,' + y + r'\in R(A),\;' + y + r'\ne\mathbf 0,\;A^T' + y + r'=\mathbf 0',
 'q4b': r'R(A)\cap N(A^T)=\{\mathbf 0\}',
 'q5': r'\mathrm{rank}(AA^T)=\mathrm{rank}(A^TA)',
 'q5b': r'A^TA' + x + r'=\mathbf 0\Rightarrow ' + x + r'^TA^TA' + x + r'=\|A' + x + r'\|^2=0\Rightarrow A' + x + r'=\mathbf 0',
 'q5c': r'N(A^TA)=N(A)\;\Rightarrow\;\mathrm{rank}(A^TA)=\mathrm{rank}(A)=\mathrm{rank}(AA^T)',
 'q6': r'A\;\mathrm{dependent\ columns}\;\Rightarrow\;' + p + r'\;\mathrm{not\ unique}',
 'q6b': r'A\hat{\mathbf x}_1=A\hat{\mathbf x}_2=' + cp(p),
 'q7': r'N(A)=\{\mathbf 0\}\;\Rightarrow\;\hat{\mathbf x}\;\mathrm{unique}',
 'q8': r'Q_1,Q_2\;\mathrm{orthogonal}\;\Rightarrow\;Q_1Q_2\;\mathrm{orthogonal}',
 'q8b': r'(Q_1Q_2)^T(Q_1Q_2)=Q_2^T' + cp(r'Q_1^TQ_1') + r'Q_2=Q_2^TQ_2=I',
 'q9': r'U=(\mathbf u_1,\dots,\mathbf u_k)\;\Rightarrow\;U^TU=I_k',
 'q9b': r'(U^TU)_{ij}=\mathbf u_i^T\mathbf u_j=\delta_{ij}',
 'q10': r'U=(\mathbf u_1,\dots,\mathbf u_k)\;\Rightarrow\;UU^T=I_n',
 'q10b': r'UU^T' + v(5, 3, 4) + '=' + v(5, 3, 0) + r'\ne' + v(5, 3, 4),
 'tool': r'\|A' + x + r'\|^2=' + x + r'^TA^TA' + x,
}

T['s5_xb'] = {
 'tb4': r'A_{7\times5},\;\mathrm{rank}\,A=4',
 'tb4a': r'\dim N(A^T)=7-4=' + cp(3) + r',\quad N(A^T)^\perp=R(A)',
 'tb4b': x + r'\in R(A)\cap N(A^T)\;\Rightarrow\;\|' + x + r'\|=0',
 'tb4c': r'\dim N(A^TA)=\dim N(A)=5-4=' + cp(1),
 'tb6': r'\mathbf x_1=' + v(1, 0, 2) + r',\;\mathbf x_2=' + v(0, 1, -2),
 'tb6n': r'S^\perp=\mathrm{span}\{' + cp(r'\mathbf n') + r'\},\;\;\mathbf n=\mathbf x_1\times\mathbf x_2=' + v(-2, 2, 1),
 'tb6p': r'P=\dfrac{\mathbf n\mathbf n^T}{\mathbf n^T\mathbf n}=\dfrac19' + bm([[4, -4, -2], [-4, 4, 2], [-2, 2, 1]]),
 'tb10': r'A=' + bm([[1, -3, -5], [1, 1, -2], [1, -3, 1], [1, 1, 4]]) + r',\;' + b + '=' + v(-6, 1, 1, 6),
 'tb10q': r'\mathbf q_1=\tfrac12' + v(1, 1, 1, 1) + r',\;\mathbf q_2=\tfrac12' + v(-1, 1, -1, 1),
 'tb10r': r'r_{13}=-1,\;r_{23}=3,\;\mathbf a_3-\mathbf p_2=(-3,-3,3,3)^T,\;r_{33}=6',
 'tb10q3': r'\mathbf q_3=\tfrac12(-1,-1,1,1)^T,\quad R=' + bm([[2, -2, -1], [0, 4, 3], [0, 0, 6]]),
 'tb10x': r'Q^T' + b + r'=(1,6,6)^T\;\Rightarrow\;' + cp(r'\hat{\mathbf x}=\left(\tfrac74,\;\tfrac34,\;1\right)^T'),
 'tj1': r'\mathbf a_1=' + v(1, 1, 1) + r',\quad x_1+x_2+x_3=0',
 'tj1b': r'\boldsymbol\xi_1=' + v(1, 0, -1) + r',\;\boldsymbol\xi_2=' + v(0, 1, -1) + r',\quad[\boldsymbol\xi_1,\boldsymbol\xi_2]=' + cf(1) + r'\ne0',
 'tj1c': r'\mathbf a_2=\boldsymbol\xi_1,\;\;\mathbf a_3=\boldsymbol\xi_2-\tfrac12\boldsymbol\xi_1=' + v(r'-\tfrac12', 1, r'-\tfrac12'),
 'tj2': r'A=\dfrac19' + bm([[1, -8, -4], [-8, 1, -4], [-4, -4, 7]]) + r',\quad A^TA=I',
 'rec': r'\perp\;=\;\mathrm{closest}',
 'eig': r'A' + x + r'=\lambda' + x,
 'diag': bm([[0, 0, 0], [0, 1, 0], [0, 0, 4]]),
}
#__TAIL__
if __name__ == '__main__':
    import sys
    for seg, d in T.items():
        if len(sys.argv) > 1 and seg not in sys.argv[1:]: continue
        (HERE / seg / 'tex.json').write_text(json.dumps(d, ensure_ascii=False, indent=1), encoding='utf-8'); print(seg, len(d))
