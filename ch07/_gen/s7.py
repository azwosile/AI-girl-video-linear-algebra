"""第七章全部 tex.json（TeX 里不放中文和 \\text）。用法：python ch07/_gen/s7.py → 各段 tex.json"""
import json
from pathlib import Path
HERE = Path(__file__).resolve().parents[1]
def bm(M, env='bmatrix'):
    return f'\\begin{{{env}}}' + r'\\'.join('&'.join(str(v) for v in r) for r in M) + f'\\end{{{env}}}'
v = lambda *xs: bm([[x] for x in xs])
I_ = r'\color{#F2B544}'; J_ = r'\color{#4FC1A6}'; P_ = r'\color{#E06A3A}'; F_ = r'\color{#E8577A}'; K_ = r'\color{#8C9DFF}'
ci = lambda s: '{' + I_ + str(s) + '}'; cj = lambda s: '{' + J_ + str(s) + '}'; cp = lambda s: '{' + P_ + str(s) + '}'; cf = lambda s: '{' + F_ + str(s) + '}'; ck = lambda s: '{' + K_ + str(s) + '}'
x = r'\mathbf x'; y = r'\mathbf y'; b = r'\mathbf b'; r_ = r'\mathbf r'; e = r'\mathbf e'; u = r'\mathbf u'; vv = r'\mathbf v'; c = r'\mathbf c'; q = r'\mathbf q'; z = r'\mathbf z'
fl = r'\mathrm{fl}'; eps = r'\epsilon'; cond = r'\mathrm{cond}'
nm = lambda s, k='': r'\|' + s + r'\|' + (('_' + str(k)) if k != '' else '')
f3 = r'\tfrac13'; h = r'\tfrac12'
T = {}
T['s7_1a'] = {
 'fdef': r'\pm\left(\frac{d_1}{\beta}+\frac{d_2}{\beta^2}+\cdots+\frac{d_t}{\beta^t}\right)\times\beta^{e}',
 'fdig': r'0\le d_i\le\beta-1,\qquad L\le e\le U',
 'ex1': r'0.53216\times10^{-4},\qquad -0.81724\times10^{21}',
 'norm': r'0.00112\times10^{8}=' + cp(r'0.11200\times10^{6}'),
 'err': r"\underbrace{x'-x}_{\mathrm{abs}}\qquad\underbrace{\frac{x'-x}{x}}_{\mathrm{rel}}",
 'b11': r'11=(1011)_2',
 'b1131': r'11.31\approx(1011.010100)_2=' + cp('11.3125'),
 'fladd': fl + r"(a'+b')=" + cp(r'0.263\times10^{4}'),
 'flmul': fl + r"(a'b')=" + cp(r'0.117\times10^{5}'),
 'epsdef': fl + r'(1+' + eps + r')>1',
 'eps3': fl + r'(1+0.00499)=1,\quad ' + fl + r'(1+0.005)=1.01',
 'epsb': eps + r'=\tfrac12\,\beta^{1-t}',
 'delta': fl + r"(a'\circ b')=(a'\circ b')(1+\delta),\quad|\delta|<" + eps,
 'ieee': r'x=(-1)^{s}\times(1.m)_2\times2^{\,e-127}',
 'ex7': r'(1+\tfrac1{16}+\tfrac1{32})\times2^4=' + cp('17.5'),
 'dbl': eps + r'=2^{-52}\approx' + cp(r'2.22\times10^{-16}'),
}
T['s7_1b'] = {
 'assoc1': r'(1.00+0.004)+0.004=' + cf('1.00'),
 'assoc2': r'1.00+(0.004+0.004)=' + cj('1.01'),
 'assocd': r'(0.1+0.2)+0.3=0.6000000000000001',
 'cd': r"c'-d'=0.000140\qquad c-d=0.0001447",
 'cdrel': r'\mathrm{rel}\approx' + cf(r'3.2\times10^{-2}'),
 'quad': r'x^2-(10^{7}+10^{-7})\,x+1=0',
 'qf': r'x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}',
 'r2bad': r'r_2=' + cf(r'9.965\times10^{-8}'),
 'r1': r'r_1=\frac{-b-s\sqrt{b^2-4ac}}{2a},\quad s=\mathrm{sign}(b)',
 'r2good': r'r_2=\frac{c}{a\,r_1}=' + cj(r'1.000\times10^{-7}'),
 'p10': r'x^{10}=0\;\to\;x^{10}-10^{-10}=0',
 'p10r': r'|x|=0\;\to\;|x|=' + cf('0.1'),
}
A72 = [[2, 3, 1], [4, 1, 4], [3, 4, 6]]
T['s7_2'] = {
 'mult1': r'l_{21}=\tfrac42=' + cp(2) + r',\quad l_{31}=' + cp(r'\tfrac32'),
 'mult2': r'l_{32}=\frac{-1/2}{-5}=' + cp(r'\tfrac1{10}'),
 'LU': r'A=' + bm([[1, 0, 0], [cp(2), 1, 0], [cp(r'\tfrac32'), cp(r'\tfrac1{10}'), 1]]) + bm([[2, 3, 1], [0, -5, 2], [0, 0, '4.3']]),
 'solve': r'L' + y + '=' + b + r',\qquad U' + x + '=' + y,
 'fwd': y + '=' + v(-4, 17, '4.3'),
 'bwd': x + '=' + cp(v(2, -3, 1)),
 'cnt1': r'\sum_{k=1}^{n-1}(n-k)^2\approx\tfrac13n^3',
 'cntm': r'\times\div:\;\tfrac13n^3+n^2-\tfrac13n',
 'cnta': r'+-:\;\tfrac13n^3+\tfrac12n^2-\tfrac56n',
 'abx': r'(AB)' + x + r':\;n^3+n^2\qquad A(B' + x + r'):\;2n^2',
}
T['s7_3'] = {
 'PA': r'P=' + bm([[0, 0, 1], [1, 0, 0], [0, 1, 0]]),
 'PALU': r'PA=' + bm([[1, 0, 0], [cp(3), 1, 0], [cp(2), cp(-4), 1]]) + bm([[2, -1, 1], [0, -1, -1], [0, 0, -5]]),
 'ex2': c + '=P' + b + '=' + v(-1, -2, 4) + r'\;\to\;' + y + '=' + v(-1, 1, 10) + r'\;\to\;' + x + '=' + cp(v(1, 1, -2)),
 'sys3': r'\begin{aligned}0.0001x_1+2x_2&=4\\x_1+x_2&=3\end{aligned}',
 'exact3': x + r'\approx(1.00005,\;1.99995)^T',
 'bad3': r'-20000\,x_2=-40000\;\Rightarrow\;x_2=2,\;x_1=' + cf(0),
 'good3': r'2x_2=4\;\Rightarrow\;x_2=2,\;x_1=' + cj(1),
 'pp': r'|l_{ki}|\le1',
}
A74 = [[-3, 2, 4, -3], [5, -2, -3, 5], [2, 1, -6, 4], [1, 1, 1, 1]]
T['s7_4a'] = {
 'F': nm('A', 'F') + r'=\Big(\sum_{i,j}a_{ij}^2\Big)^{1/2}',
 'iv': nm('AB') + r'\le' + nm('A') + nm('B'),
 'sub': nm('A') + r'=\max_{' + x + r'\ne0}\frac{' + nm('A' + x) + '}{' + nm(x) + '}',
 'two': nm('A', 2) + '=' + cp(r'\sigma_1'),
 'Am': r'A=' + bm([[2, 1], [1, 3]]) + r',\quad\sigma_1\approx3.618',
 'one': nm('A', 1) + r'=\max_j\sum_i|a_{ij}|',
 'inf': nm('A', r'\infty') + r'=\max_i\sum_j|a_{ij}|',
 'compat': nm('A' + x) + r'\le' + nm('A') + nm(x),
 'IF': nm('I', 2) + r'=1,\qquad' + nm('I', 'F') + r'=\sqrt n',
 'Q2': nm('Q', 2) + '=1',
}
T['s7_4b'] = {
 'sysA': r'\begin{aligned}2x_1+2x_2&=6\\2x_1+' + cp('2.0005') + r'x_2&=6.001\end{aligned}\;\Rightarrow\;' + x + '=' + v(1, 2),
 'sysB': r'\begin{aligned}2x_1+2x_2&=6\\2x_1+' + cf('2.001') + r'x_2&=6.001\end{aligned}\;\Rightarrow\;' + x + '=' + cf(v(2, 1)),
 'res': r_ + '=' + b + "-A" + x + "'",
 'ex4': r'A=' + bm([[3, 3], [4, 5]]) + r',\;' + b + '=' + v(6, 9) + r",\;" + x + "'=" + v('2.0', '0.1'),
 'ex4r': r_ + '=' + v('-0.3', '0.5') + r',\;\frac{' + nm(r_, r'\infty') + '}{' + nm(b, r'\infty') + r'}=\frac1{18}',
 'ex4e': x + '=' + v(1, 1) + r",\;\frac{" + nm(x + "-" + x + "'", r'\infty') + '}{' + nm(x, r'\infty') + '}=' + cf(1),
 'ineq': r'\frac1{' + cond + r'(A)}\frac{' + nm(r_) + '}{' + nm(b) + r'}\le\frac{' + nm(x + "-" + x + "'") + '}{' + nm(x) + r'}\le' + cp(cond + r'(A)') + r'\frac{' + nm(r_) + '}{' + nm(b) + '}',
 'cond': cond + r'(A)=' + nm('A') + nm('A^{-1}'),
 'ex3': r'A^{-1}=\tfrac13' + bm([[5, -3], [-4, 3]]) + r',\;' + cond + r'_\infty(A)=9\cdot\tfrac83=' + cp(24),
 'chk': r'1\le24\cdot\tfrac1{18}=\tfrac43',
 'c2': cond + r'_2(A)=\frac{\sigma_1}{\sigma_n}',
 'hil': r'h_{ij}=\frac1{i+j-1}',
 'h12': x + r'=(1,\dots,1)^T:\;\mathrm{err}=' + cf('0.28') + r',\;\mathrm{res}=1.4\times10^{-16}',
 'digits': r'\mathrm{lost}\approx\log_{10}' + cond + '(A)',
 'ex5': cond + r'_\infty=100\times2^{99}\approx' + cf(r'6.34\times10^{31}'),
}
T['s7_5'] = {
 'Qe': nm(r'Q' + e, 2) + '=' + nm(e, 2),
 'H': r'H=I-2' + u + u + r'^T,\quad H^T=H,\;H^2=I',
 'v': vv + '=' + x + r'-\alpha' + e + r'_1,\quad\alpha=\pm' + nm(x, 2),
 'ex1': x + '=' + v(1, 2, 2) + r',\;\alpha=-3,\;' + vv + '=' + v(4, 2, 2) + r',\;\beta=12',
 'ex1H': r'H=\tfrac13' + bm([[-1, -2, -2], [-2, 2, -1], [-2, -1, 2]]) + r',\;H' + x + '=' + cp(v(-3, 0, 0)),
 'ex2': r'H' + y + r'=H' + v(3, 1, 2, 2) + '=' + cp(v(3, -3, 0, 0)),
 'hqr': r'H_{n-1}\cdots H_2H_1A=R\;\Rightarrow\;A=QR',
 'cost': r'\tfrac23n^3\;\;(=2\times\tfrac13n^3)',
 'G3': r'R=' + bm([[r'-\tfrac35', r'\tfrac45'], [r'-\tfrac45', r'-\tfrac35']]) + r',\;R' + v(-3, 4) + '=' + cp(v(5, 0)),
 'G3r': r'G=' + bm([[r'-\tfrac35', r'\tfrac45'], [r'\tfrac45', r'\tfrac35']]) + r',\;G' + v(-3, 4) + '=' + cp(v(5, 0)),
 'G4': r'R=' + bm([[r'\tfrac5{13}', 0, r'\tfrac{12}{13}'], [0, 1, 0], [r'-\tfrac{12}{13}', 0, r'\tfrac5{13}']]) + r',\;R' + v(5, 8, 12) + '=' + cp(v(13, 8, 0)),
}
T['s7_6'] = {
 'thm': r'\min_i|\lambda' + "'" + r'-\lambda_i|\le' + cp(cond + r'_2(X)') + nm('E', 2),
 'sym': r'A=A^T:\;\min_i|\lambda' + "'" + r'-\lambda_i|\le' + nm('E', 2),
 'ns': bm([[1, 1], [cf(r'10^{-10}'), 1]]) + r':\;\lambda=1\pm' + cf(r'10^{-5}'),
 'pw': r'A^k' + vv + r'_0=\alpha_1' + cp(r'\lambda_1^k') + r'\mathbf x_1+\alpha_2\lambda_2^k\mathbf x_2+\cdots',
 'pstep': vv + r'_{k+1}=A' + u + r'_k,\quad' + u + r'_{k+1}=\frac{' + vv + r'_{k+1}}{(' + vv + r'_{k+1})_{j}}',
 'pA': r'A=' + bm([[2, 1], [1, 2]]) + r',\;' + u + r'_0=' + v(2, 1),
 'rate': r'\left|\frac{\lambda_2}{\lambda_1}\right|^k=\left(\tfrac13\right)^k',
 'qr': r'A_k=Q_kR_k,\qquad A_{k+1}=' + cp(r'R_kQ_k'),
 'sim': r'R_kQ_k=Q_k^T(Q_kR_k)Q_k=Q_k^TA_kQ_k',
 'A2': r'A_2=' + bm([['2.8', '-0.6'], ['-0.6', '1.2']]),
 'A3': r'A_3\approx' + bm([['2.976', '0.220'], ['0.220', '1.024']]),
}
T['s7_7'] = {
 'ne': r'A^TA' + x + '=A^T' + b,
 'Al': r'A=' + bm([[1, 1], [1, r'1+10^{-6}'], [1, r'1-10^{-6}']]),
 'sq': cond + r'_2(A^TA)=' + cf(cond + r'_2(A)^2'),
 'mgs': r'c_k=' + q + r'_k^T' + b + r'_k,\quad' + b + r'_{k+1}=' + b + r'_k-c_k' + q + '_k',
 'hqr': r'Q^TA=' + bm([['R_1'], ['O']]) + r',\quad Q^T' + b + '=' + bm([[c + '_1'], [c + '_2']]),
 'split': nm(b + '-A' + x, 2) + r'^2=' + nm(c + '_1-R_1' + x, 2) + r'^2+' + cf(nm(c + '_2', 2) + '^2'),
 'pinv': r'A^+=V\Sigma^+U^T,\quad\Sigma^+=\mathrm{diag}(\tfrac1{\sigma_1},\dots,\tfrac1{\sigma_r},0,\dots)',
 'mn': x + '=A^+' + b + r',\qquad' + nm(z, 2) + '>' + nm(x, 2),
 'two': r'y_i=\frac{\mathbf u_i^T' + b + r'}{\sigma_i},\quad' + x + r'=y_1\mathbf v_1+\cdots+y_r\mathbf v_r',
 'svs': r'|\sigma_i-\omega_i|\le' + nm('A-B', 2),
}
T['s7_xa'] = {
 'q1': fl + r'(' + fl + r'(a+b)+c)=' + fl + r'(a+' + fl + r'(b+c))',
 'q2': r'A(BC)\;\;\mathrm{vs}\;\;(AB)C:\;\mathrm{same\;flops}',
 'q3': r'\mathrm{stable}\;\Rightarrow\;\mathrm{small\;rel.\;error}',
 'q4': r'A=A^T,\;\mathrm{stable}\;\Rightarrow\;\lambda\;\mathrm{accurate}',
 'q5': r'A\ne A^T,\;\mathrm{stable}\;\Rightarrow\;\lambda\;\mathrm{accurate}',
 'q6': r'A^{-1}' + b + r'\;\;\mathrm{vs}\;\;LU' + x + '=' + b,
 'q7': r'A=A^T\;\Rightarrow\;' + nm('A', 1) + '=' + nm('A', r'\infty'),
 'q8': nm('A', 2) + '=' + nm('A', 'F'),
 'q9': r'\mathrm{rank}\,n:\;\mathrm{all\;LS\;methods\;accurate}',
 'q10': nm('A-B', 2) + r'<\epsilon\;\Rightarrow\;' + nm('A^+-B^+', 2) + r'<\delta',
 'a1': r'(1.00+0.004)+0.004=1.00\ne1.01',
 'a2': r'(1\times n)(n\times1)(1\times n):\;2n\;\;\mathrm{vs}\;\;2n^2',
 'a3': r'\mathrm{err}\approx' + cp(cond + r'(A)') + r'\times\mathrm{small}',
 'a4': cond + r'_2(Q)=1\;\Rightarrow\;|\Delta\lambda|\le' + nm('E', 2),
 'a5': bm([[1, 1], [r'10^{-10}', 1]]) + r':\;\lambda=1\pm10^{-5}',
 'a6': r'A^{-1}' + b + r':\;n^2\qquad LU:\;n^2',
 'a7': nm('A', 1) + '=' + nm('A^T', r'\infty'),
 'IF': nm('I', 2) + r'=1,\qquad' + nm('I', 'F') + r'=\sqrt n',
 'a8': nm('A', 2) + r'=\sigma_1,\;\;' + nm('A', 'F') + r'=\sqrt{\sigma_1^2+\cdots+\sigma_r^2}',
 'a9': cond + r'(A^TA)=' + cond + r'(A)^2',
 'a10': r'B=' + bm([[1, 0], [0, r'\epsilon']]) + r',\;B^+=' + bm([[1, 0], [0, cf(r'1/\epsilon')]]),
}
T['s7_xb'] = {
 'b1a': r'(AB)' + x + r':\;n^3+n^2\;\times,\;\;n^3-n\;+',
 'b1b': r'A(B' + x + r'):\;2n^2\;\times,\;\;2n^2-2n\;+',
 'b2A': r'A=' + bm([[2, 3, 6], [4, 4, 8], [1, 3, 4]]) + r',\;' + b + '=' + v(3, 0, 4) + r',\;' + c + '=' + v(1, 8, 2),
 'b2P': r'P=' + bm([[0, 1, 0], [0, 0, 1], [1, 0, 0]]),
 'b2LU': r'L=' + bm([[1, 0, 0], [cp(r'\tfrac14'), 1, 0], [cp(r'\tfrac12'), cp(r'\tfrac12'), 1]]) + r',\;U=' + bm([[4, 4, 8], [0, 2, 2], [0, 0, 1]]),
 'b2x': x + '_b=' + cp(v(-3, 1, 1)) + r',\qquad' + x + '_c=' + cp(v(5, 3, -3)),
 'b3': nm('Q' + x, 2) + '=' + nm(x, 2) + r'\Rightarrow' + nm('Q', 2) + r'=1,\quad' + nm('Q', 'F') + r'=\sqrt{4}=2',
 'b4n': nm('H', 1) + r'=\tfrac{25}{12},\quad' + nm('H^{-1}', 1) + '=13620',
 'b4c': cond + r'_1(H)=28375,\quad' + nm(b, 1) + '=50',
 'b4e': r'\frac{' + nm(x + "-" + x + "'", 1) + '}{' + nm(x, 1) + r'}\le\frac{28375\times0.36\times10^{-11}}{50}\approx' + cp(r'2.04\times10^{-9}'),
 'b5': r'5\times10^6\times2\times\tfrac12\times10^{-14}=' + cp(r'5\times10^{-8}'),
}
T['s7_xc'] = {
 'b6H': x + '=' + v(1, 2, -2) + r',\;' + vv + '=' + v(4, 2, -2) + r',\;\beta=12,\;H' + x + '=' + cp(v(-3, 0, 0)),
 'b6G': r'G=' + bm([[1, 0, 0], [0, r'\tfrac1{\sqrt2}', r'-\tfrac1{\sqrt2}'], [0, r'\tfrac1{\sqrt2}', r'\tfrac1{\sqrt2}']]) + r',\;G' + x + '=' + cp(v(1, r'2\sqrt2', 0)),
 'b7': r'B=RQ=Q^T(QR)Q=Q^TAQ',
 'b7v': r'A' + x + r'=\lambda' + x + r'\;\Rightarrow\;B(Q^T' + x + r')=\lambda(Q^T' + x + ')',
 'b8': r'A=' + bm([[1, 2], [4, 3]]) + r',\;\lambda_1=' + cp(5) + r',\;' + x + '_1=' + v(1, 2),
 'b9a': r'U^T' + b + '=' + v(7, -1, 7, -3) + r',\;y_1=\tfrac7{12},\;y_2=-\tfrac16',
 'b9x': x + '=A^+' + b + '=' + cp(v(r'\tfrac13', r'\tfrac12', r'\tfrac1{12}')),
 'b10A': r'A=' + bm([[1, 5], [1, 5], [1, 6], [1, 2]]) + r',\;' + b + '=' + v(2, 4, 5, 3),
 'b10H1': r'H_1A=' + bm([[-2, -9], [0, r'\tfrac13'], [0, r'\tfrac43'], [0, r'-\tfrac83']]) + r',\;H_1' + b + '=' + v(-7, 1, 2, 0),
 'b10R': r'R=' + bm([[-2, -9], [0, -3], [0, 0], [0, 0]]) + r',\;' + c + '=' + v(-7, -1, r'\tfrac65', r'\tfrac85'),
 'b10x': x + '=' + cp(v(2, r'\tfrac13')) + r',\quad' + nm(r'\mathbf r', 2) + r'=\left\|\left(\tfrac65,\tfrac85\right)\right\|=2',
}

if __name__ == '__main__':
    import sys
    for seg, d in T.items():
        if len(sys.argv) > 1 and seg not in sys.argv[1:]: continue
        (HERE / seg / 'tex.json').write_text(json.dumps(d, ensure_ascii=False, indent=1), encoding='utf-8'); print(seg, len(d))
