"""第四章全部 tex.json（TeX 里不放中文和 \\text）。用法：python ch04/_gen/s4.py → 各段 tex.json"""
import json
from pathlib import Path
HERE = Path(__file__).resolve().parents[1]
def bm(M, cls=None, env='bmatrix'):
    rows = []
    for i, r in enumerate(M):
        cells = []
        for j, v in enumerate(r):
            s = str(v); c = cls(i, j) if cls else None
            cells.append(f'\\class{{{c}}}{{{s}}}' if c else s)
        rows.append('&'.join(cells))
    return f'\\begin{{{env}}}' + r'\\'.join(rows) + f'\\end{{{env}}}'
col = lambda i, j: f'c{j+1}'
row = lambda i, j: f'r{i+1}'
v = lambda *xs: bm([[x] for x in xs])
I_ = r'\color{#F2B544}'; J_ = r'\color{#4FC1A6}'; P_ = r'\color{#E06A3A}'; F_ = r'\color{#E8577A}'; K_ = r'\color{#8C9DFF}'
bv = lambda s: r'\mathbf{' + s + '}'
T = {}
T['s4_1a'] = {
 'def': r'L(\alpha\mathbf v_1+\beta\mathbf v_2)=\alpha L(\mathbf v_1)+\beta L(\mathbf v_2)',
 'add': r'L(\mathbf v_1+\mathbf v_2)=L(\mathbf v_1)+L(\mathbf v_2)',
 'hom': r'L(\alpha\mathbf v)=\alpha L(\mathbf v)',
 'map': r'L:V\to W', 'op': r'L:V\to V',
 'e1': r'L(\mathbf x)=3\mathbf x', 'e2': r'L(\mathbf x)=x_1\mathbf e_1', 'e3': r'L(\mathbf x)=(x_1,\,-x_2)^T', 'e4': r'L(\mathbf x)=(-x_2,\,x_1)^T',
 'lin1': r'3(\alpha\mathbf x+\beta\mathbf y)=\alpha(3\mathbf x)+\beta(3\mathbf y)',
 'e6': r'M(\mathbf x)=\|\mathbf x\|=\sqrt{x_1^2+x_2^2}',
 'e6b': r'M(-\mathbf x)=\|\mathbf x\|\;\ne\;-\|\mathbf x\|=-M(\mathbf x)',
 'b1': r'L(\mathbf x)=(x_1x_2,\;x_1)^T',
 'b1b': r'L(2\mathbf x)=(\class{q}{4x_1x_2},\;2x_1)^T\ne 2L(\mathbf x)',
 'tr': r'L(\mathbf x)=\mathbf x+\mathbf a',
 'L0': r'L(\mathbf 0)=L(0\cdot\mathbf 0)=0\cdot L(\mathbf 0)=\mathbf 0',
 'L0a': r'L(\mathbf 0)=\mathbf a\ne\mathbf 0',
 'Mq': r'\begin{bmatrix}2&1\\1&3\end{bmatrix}\;?',
 'tjT': r'T(\alpha\mathbf a+\beta\mathbf b)=\alpha T(\mathbf a)+\beta T(\mathbf b)',
}

T['s4_1b'] = {
 'e5': r'L(\mathbf x)=x_1+x_2', 'map5': r'L:\mathbb R^2\to\mathbb R^1', 'k5': r'x_1+x_2=0',
 'e7': r'L(\mathbf x)=(x_2,\;x_1,\;x_1+x_2)^T', 'map7': r'L:\mathbb R^2\to\mathbb R^3',
 'A7': 'A=' + bm([[0, 1], [1, 0], [1, 1]]), 'LA': r'L_A(\mathbf x)=A\mathbf x', 'LAmap': r'L_A:\mathbb R^n\to\mathbb R^m',
 'lin': r'A(\alpha\mathbf x+\beta\mathbf y)=\alpha A\mathbf x+\beta A\mathbf y',
 'p1': r'\mathrm{(i)}\quad L(\mathbf 0_V)=\mathbf 0_W',
 'p2': r'\mathrm{(ii)}\quad L(\alpha_1\mathbf v_1+\cdots+\alpha_n\mathbf v_n)=\alpha_1L(\mathbf v_1)+\cdots+\alpha_nL(\mathbf v_n)',
 'p3': r'\mathrm{(iii)}\quad L(-\mathbf v)=-L(\mathbf v)',
 'e8': r'I(\mathbf v)=\mathbf v', 'e9': r'L(f)=\int_a^b f(x)\,dx', 'e10': r"D(f)=f'",
 'ker': r'\ker(L)=\{\mathbf v\in V\mid L(\mathbf v)=\mathbf 0_W\}',
 'img': r'L(S)=\{\mathbf w\in W\mid \mathbf w=L(\mathbf v),\ \mathbf v\in S\}',
 'cl1': r'L(\mathbf v_1+\mathbf v_2)=\mathbf 0+\mathbf 0=\mathbf 0', 'cl2': r'L(\alpha\mathbf v)=\alpha\,\mathbf 0=\mathbf 0',
 'e11': r'L(\mathbf x)=(x_1,\;0)^T',
 'e12': r'L(\mathbf x)=(x_1+x_2,\;x_2+x_3)^T', 'sys12': r'x_1+x_2=0,\qquad x_2+x_3=0',
 'sol12': r'x_3=a,\quad x_2=-a,\quad x_1=a',
 'k12': r'\ker(L)=\operatorname{Span}\{(1,-1,1)^T\}', 'S12': r'L\big((a,0,b)^T\big)=(a,b)^T', 'LS12': r'L(S)=\mathbb R^2',
 'kn': r'\ker(L)=N(A)', 'rg': r'L(\mathbb R^n)=\operatorname{col}(A)',
 'dim': r'\dim\ker(L)+\dim L(V)=\dim V', 'rn12': r'1+2=3',
 'e13': r'D:P_3\to P_3', 'k13': r'\ker(D)=P_1', 'r13': r'D(P_3)=P_2',
 'tj1': r'\ker(L)\;\leftrightarrow\;T^{-1}(\mathbf 0)', 'tj2': r'L(V)\;\leftrightarrow\;T(V_n)',
}

ci = lambda x: r'{\color{#F2B544}' + str(x) + '}'
cj = lambda x: r'{\color{#4FC1A6}' + str(x) + '}'
h3 = r'\tfrac{\sqrt3}{2}'
T['s4_2a'] = {
 'dec': r'\mathbf x=x_1' + ci(r'\hat\imath') + '+x_2' + cj(r'\hat\jmath'),
 'Ldec': r'L(\mathbf x)=x_1' + ci(r'L(\hat\imath)') + '+x_2' + cj(r'L(\hat\jmath)'),
 'x': r'\mathbf x=\begin{bmatrix}-1\\2\end{bmatrix}',
 'calc': r'-1' + ci(r'\begin{bmatrix}1\\-2\end{bmatrix}') + '+2' + cj(r'\begin{bmatrix}3\\0\end{bmatrix}') + r'=\begin{bmatrix}5\\2\end{bmatrix}',
 'M': r'\begin{bmatrix}' + ci(1) + '&' + cj(3) + r'\\' + ci(-2) + '&' + cj(0) + r'\end{bmatrix}',
 'Mx': r'\begin{bmatrix}' + ci(1) + '&' + cj(3) + r'\\' + ci(-2) + '&' + cj(0) + r'\end{bmatrix}\begin{bmatrix}-1\\2\end{bmatrix}=\begin{bmatrix}5\\2\end{bmatrix}',
 'thm': r'A=\big(L(\mathbf e_1),\;L(\mathbf e_2),\;\dots,\;L(\mathbf e_n)\big)', 'aj': r'\mathbf a_j=L(\mathbf e_j)',
 'ex1': r'L(\mathbf x)=(x_1+x_2,\;x_2+x_3)^T',
 'ex1e': r'L(\mathbf e_1)=\begin{bmatrix}1\\0\end{bmatrix},\;L(\mathbf e_2)=\begin{bmatrix}1\\1\end{bmatrix},\;L(\mathbf e_3)=\begin{bmatrix}0\\1\end{bmatrix}',
 'ex1A': r'A=\begin{bmatrix}1&1&0\\0&1&1\end{bmatrix}', 'ex1c': r'A\mathbf x=\begin{bmatrix}x_1+x_2\\x_2+x_3\end{bmatrix}',
 'rot': r'A=\begin{bmatrix}' + ci(r'\cos\theta') + '&' + cj(r'-\sin\theta') + r'\\' + ci(r'\sin\theta') + '&' + cj(r'\cos\theta') + r'\end{bmatrix}',
 'rot90': r'\theta=90^\circ:\quad\begin{bmatrix}0&-1\\1&0\end{bmatrix}',
 'b5': r'L(\mathbf x)=(x_1+x_2,\;x_1-x_2,\;3x_1+2x_2)^T',
 'b5A': r'A=\begin{bmatrix}' + ci(1) + '&' + cj(1) + r'\\' + ci(1) + '&' + cj(-1) + r'\\' + ci(3) + '&' + cj(2) + r'\end{bmatrix}',
 'b1a': r'\begin{bmatrix}x_1+x_2\\x_1\end{bmatrix}=\begin{bmatrix}1&1\\1&0\end{bmatrix}\mathbf x',
 'b2': r'L(\mathbf v_1)=\begin{bmatrix}2\\5\end{bmatrix},\;L(\mathbf v_2)=\begin{bmatrix}-3\\1\end{bmatrix},\;\mathbf v_3=\begin{bmatrix}1\\7\end{bmatrix}',
 'b2v': r'\mathbf v_3=3\mathbf v_1+2\mathbf v_2',
 'b2b': r'\mathbf v_1=\begin{bmatrix}1\\1\end{bmatrix},\;\mathbf v_2=\begin{bmatrix}-1\\2\end{bmatrix}',
 'th': r'\theta',
 'b2L': r'L(\mathbf v_3)=3\begin{bmatrix}2\\5\end{bmatrix}+2\begin{bmatrix}-3\\1\end{bmatrix}=\begin{bmatrix}0\\17\end{bmatrix}',
 'comp': r'L_2(L_1(\mathbf x))=B(A\mathbf x)=(BA)\mathbf x',
 'rs': r'\underbrace{\begin{bmatrix}1&1\\0&1\end{bmatrix}}_{B}\;\underbrace{\begin{bmatrix}0&-1\\1&0\end{bmatrix}}_{A}=\begin{bmatrix}' + ci(1) + '&' + cj(-1) + r'\\' + ci(1) + '&' + cj(0) + r'\end{bmatrix}',
 'b6R': r'R=\begin{bmatrix}' + h3 + r'&-\tfrac12\\\tfrac12&' + h3 + r'\end{bmatrix}', 'b6F': r'F=\begin{bmatrix}-1&0\\0&1\end{bmatrix}',
 'FR': r'FR=\begin{bmatrix}-' + h3 + r'&\tfrac12\\\tfrac12&' + h3 + r'\end{bmatrix}',
 'RF': r'RF=\begin{bmatrix}-' + h3 + r'&-\tfrac12\\-\tfrac12&' + h3 + r'\end{bmatrix}',
 'neq': r'FR\ne RF', 'sum1': r'\mathbf a_j=L(\mathbf e_j)', 'sum2': r'L_2\circ L_1\;\leftrightarrow\;BA',
}

T['s4_2b'] = {
 'cdv': r'\mathbf v', 'cdLv': r'L(\mathbf v)', 'cdve': r'[\mathbf v]_E', 'cdLf': r'[L(\mathbf v)]_F', 'cdL': r'L', 'cdA': r'A',
 'thm': r'[L(\mathbf v)]_F=A\,[\mathbf v]_E', 'aj': r'\mathbf a_j=[L(\mathbf v_j)]_F',
 'e3': r'L(\mathbf x)=x_1\mathbf b_1+(x_2+x_3)\mathbf b_2',
 'e3b': r'\mathbf b_1=\begin{bmatrix}1\\1\end{bmatrix},\;\mathbf b_2=\begin{bmatrix}-1\\1\end{bmatrix}',
 'e3c': r'L(\mathbf e_1)=1\mathbf b_1+0\mathbf b_2,\quad L(\mathbf e_2)=L(\mathbf e_3)=0\mathbf b_1+1\mathbf b_2',
 'e3A': r'A=\begin{bmatrix}' + ci(1) + r'&' + cj(0) + r'&{\color{#8C9DFF}0}\\' + ci(0) + r'&' + cj(1) + r'&{\color{#8C9DFF}1}\end{bmatrix}',
 'e4': r'L(\mathbf b_1)=\mathbf b_1,\quad L(\mathbf b_2)=\mathbf b_1+2\mathbf b_2',
 'e4A': r'A=\begin{bmatrix}' + ci(1) + '&' + cj(1) + r'\\' + ci(0) + '&' + cj(2) + r'\end{bmatrix}',
 'e5': r'D:P_3\to P_2', 'e5b': r'E=[x^2,\,x,\,1],\quad F=[x,\,1]',
 'e5A': r'A=\begin{bmatrix}' + ci(2) + '&' + cj(0) + r'&{\color{#8C9DFF}0}\\' + ci(0) + '&' + cj(1) + r'&{\color{#8C9DFF}0}\end{bmatrix}',
 'e5v': r'\begin{bmatrix}2&0&0\\0&1&0\end{bmatrix}\begin{bmatrix}a\\b\\c\end{bmatrix}=\begin{bmatrix}2a\\b\end{bmatrix}\;\Rightarrow\;2ax+b',
 'Buj': r'B\,\mathbf a_j=L(\mathbf u_j)', 't423': r'\mathbf a_j=B^{-1}L(\mathbf u_j)',
 'aug': r'\big(\,\mathbf b_1\;\cdots\;\mathbf b_m\;\big|\;L(\mathbf u_1)\;\cdots\;L(\mathbf u_n)\,\big)\;\longrightarrow\;\big(\,I\;\big|\;A\,\big)',
 'e6': r'L(\mathbf x)=(x_2,\;x_1+x_2,\;x_1-x_2)^T',
 'e6u': r'\mathbf u_1=\begin{bmatrix}1\\2\end{bmatrix},\;\mathbf u_2=\begin{bmatrix}3\\1\end{bmatrix}',
 'e6b': r'\mathbf b_1=\begin{bmatrix}1\\0\\0\end{bmatrix},\;\mathbf b_2=\begin{bmatrix}1\\1\\0\end{bmatrix},\;\mathbf b_3=\begin{bmatrix}1\\1\\1\end{bmatrix}',
 'e6L': r'L(\mathbf u_1)=\begin{bmatrix}2\\3\\-1\end{bmatrix},\;L(\mathbf u_2)=\begin{bmatrix}1\\4\\2\end{bmatrix}',
 'aug0': r'\left[\begin{array}{ccc|cc}1&1&1&2&1\\0&1&1&3&4\\0&0&1&-1&2\end{array}\right]',
 'aug1': r'\left[\begin{array}{ccc|cc}1&0&0&-1&-3\\0&1&0&4&2\\0&0&1&-1&2\end{array}\right]',
 'e6A': r'A=\begin{bmatrix}-1&-3\\4&2\\-1&2\end{bmatrix}',
 'chk': r'-1\begin{bmatrix}1\\0\\0\end{bmatrix}+4\begin{bmatrix}1\\1\\0\end{bmatrix}-1\begin{bmatrix}1\\1\\1\end{bmatrix}=\begin{bmatrix}2\\3\\-1\end{bmatrix}',
 'cdu': r'\mathbf u_1', 'cdLu': r'L(\mathbf u_1)', 'cdue': r'\begin{bmatrix}1\\0\end{bmatrix}', 'cdcol': r'\begin{bmatrix}-1\\4\\-1\end{bmatrix}',
 'tj': r'T(\alpha_1,\dots,\alpha_n)=(\alpha_1,\dots,\alpha_n)A',
}

T['s4_2c'] = {
 'T0': r'T=\begin{bmatrix}0&1&1\\0&1&-1\end{bmatrix}', 'T1': r'T=\begin{bmatrix}0&1&1&{\color{#E06A3A}0}\\0&1&-1&{\color{#E06A3A}0}\end{bmatrix}',
 'AT': r'A\,T=\big(A\mathbf t_1,\;A\mathbf t_2,\;\dots\big)',
 'dil': r'L(\mathbf x)=c\,\mathbf x,\quad A=cI=\begin{bmatrix}1.5&0\\0&1.5\end{bmatrix}',
 'ref': r'A=\begin{bmatrix}-1&0\\0&1\end{bmatrix}',
 'rot': r'A=\begin{bmatrix}\tfrac12&-\tfrac{\sqrt3}{2}\\\tfrac{\sqrt3}{2}&\tfrac12\end{bmatrix}',
 'tr': r'L(\mathbf x)=\mathbf x+\mathbf a', 'tr0': r'L(\mathbf 0)=\mathbf a\ne\mathbf 0',
 'hom': r'\begin{bmatrix}x_1\\x_2\end{bmatrix}\;\longmapsto\;\begin{bmatrix}x_1\\x_2\\{\color{#E06A3A}1}\end{bmatrix}',
 'Ta': r'\begin{bmatrix}1&0&{\color{#E06A3A}6}\\0&1&{\color{#E06A3A}2}\\0&0&1\end{bmatrix}',
 'Tax': r'\begin{bmatrix}1&0&6\\0&1&2\\0&0&1\end{bmatrix}\begin{bmatrix}x_1\\x_2\\1\end{bmatrix}=\begin{bmatrix}x_1+6\\x_2+2\\1\end{bmatrix}',
 'emb': r'\begin{bmatrix}A&\mathbf 0\\\mathbf 0^T&1\end{bmatrix}',
 'd3': r'\begin{bmatrix}3&0&0\\0&3&0\\0&0&1\end{bmatrix}',
 'comp': r'\begin{bmatrix}1&0&6\\0&1&2\\0&0&1\end{bmatrix}\begin{bmatrix}1.5&0&0\\0&1.5&0\\0&0&1\end{bmatrix}=\begin{bmatrix}1.5&0&6\\0&1.5&2\\0&0&1\end{bmatrix}',
 'b7': r'\begin{bmatrix}1&0&2\\0&1&5\\0&0&1\end{bmatrix}',
 'b7x': r'\begin{bmatrix}1&0&2\\0&1&5\\0&0&1\end{bmatrix}\begin{bmatrix}x_1\\x_2\\1\end{bmatrix}=\begin{bmatrix}x_1+2\\x_2+5\\1\end{bmatrix}',
 'q': r'\left\{\begin{bmatrix}x\\y\\1\end{bmatrix}\right\}\subseteq\mathbb R^3\;?',
}

ck = lambda x: r'{\color{#8C9DFF}' + str(x) + '}'
T['s4_3'] = {
 'L': r'L(\mathbf x)=(2x_1,\;x_1+x_2)^T', 'A': r'A=\begin{bmatrix}2&0\\1&1\end{bmatrix}',
 'u': r'\mathbf u_1=\begin{bmatrix}1\\1\end{bmatrix},\;\mathbf u_2=\begin{bmatrix}-1\\1\end{bmatrix}',
 'Lu1': r'A\mathbf u_1=\begin{bmatrix}2\\2\end{bmatrix}=' + ci(2) + r'\mathbf u_1+' + ci(0) + r'\mathbf u_2',
 'Lu2': r'A\mathbf u_2=\begin{bmatrix}-2\\0\end{bmatrix}=' + cj(-1) + r'\mathbf u_1+' + cj(1) + r'\mathbf u_2',
 'B': r'B=\begin{bmatrix}' + ci(2) + '&' + cj(-1) + r'\\' + ci(0) + '&' + cj(1) + r'\end{bmatrix}',
 'U': r'U=(\mathbf u_1\;\mathbf u_2)=\begin{bmatrix}1&-1\\1&1\end{bmatrix}',
 'UAU': r'U^{-1}AU=\tfrac12\begin{bmatrix}1&1\\-1&1\end{bmatrix}\begin{bmatrix}2&0\\1&1\end{bmatrix}\begin{bmatrix}1&-1\\1&1\end{bmatrix}=\begin{bmatrix}2&-1\\0&1\end{bmatrix}',
 'Ui': r'U^{-1}', 'Ua': r'U', 'Aa': r'A',
 'thm': r'B=S^{-1}AS',
 'cvF': r'[\mathbf v]_F', 'cLF': r'[L(\mathbf v)]_F', 'cvE': r'[\mathbf v]_E', 'cLE': r'[L(\mathbf v)]_E', 'cS': r'S', 'cSi': r'S^{-1}', 'cA': r'A', 'cB': r'B',
 'def': r'B=S^{-1}AS',
 'sym': r'A=(S^{-1})^{-1}\,B\,S^{-1}', 'tra': r'A\sim B,\;B\sim C\;\Rightarrow\;A\sim C',
 'e1B': r'B=\begin{bmatrix}0&1&0\\0&0&2\\0&0&0\end{bmatrix}', 'e1A': r'A=\begin{bmatrix}0&2&0\\0&0&4\\0&0&0\end{bmatrix}',
 'e1S': r'S=\begin{bmatrix}1&0&-2\\0&2&0\\0&0&4\end{bmatrix}', 'e1r': r'A=S^{-1}BS',
 'e1d': r'D(2x)=2\cdot 1,\qquad D(4x^2-2)=8x=4\cdot(2x)',
 'e2A': r'A=\begin{bmatrix}2&2&0\\1&1&2\\1&1&2\end{bmatrix}',
 'e2y': r'\mathbf y_1=\begin{bmatrix}1\\-1\\0\end{bmatrix},\;\mathbf y_2=\begin{bmatrix}-2\\1\\1\end{bmatrix},\;\mathbf y_3=\begin{bmatrix}1\\1\\1\end{bmatrix}',
 'e2Ay': r'A\mathbf y_1=' + ci(0) + r',\quad A\mathbf y_2=' + cj(r'1\,\mathbf y_2') + r',\quad A\mathbf y_3=' + ck(r'4\,\mathbf y_3'),
 'e2D': r'Y^{-1}AY=D=\begin{bmatrix}' + ci(0) + r'&0&0\\0&' + cj(1) + r'&0\\0&0&' + ck(4) + r'\end{bmatrix}',
 'Dn': r'D^n=\begin{bmatrix}0&0&0\\0&1&0\\0&0&4^n\end{bmatrix}',
 'det': r'\det(S^{-1}AS)=\det(S^{-1})\det(A)\det(S)=\det(A)',
 'tr': r'\operatorname{tr}A=a_{11}+a_{22}+\cdots+a_{nn}', 'trab': r'\operatorname{tr}(AB)=\operatorname{tr}(BA)',
 'b10': r'\det(A-\lambda I)=\det(B-\lambda I)',
 'tj': r'P^{-1}AP=B',
}

T['s4_xa'] = {
 'q1': r'L(\mathbf x_1)=L(\mathbf x_2)\;\Rightarrow\;\mathbf x_1=\mathbf x_2',
 'q1b': r'L(\mathbf x_1)=L(\mathbf x_2)\iff\mathbf x_1-\mathbf x_2\in\ker(L)',
 'q2': r'(L_1+L_2)(\mathbf v)=L_1(\mathbf v)+L_2(\mathbf v)',
 'q2b': r'(L_1+L_2)(\alpha\mathbf v+\beta\mathbf w)=\alpha(L_1+L_2)(\mathbf v)+\beta(L_1+L_2)(\mathbf w)',
 'q3': r'\mathbf x\in\ker(L)\;\Rightarrow\;L(\mathbf v+\mathbf x)=L(\mathbf v)',
 'q3b': r'L(\mathbf v+\mathbf x)=L(\mathbf v)+\underbrace{L(\mathbf x)}_{\mathbf 0}',
 'q4': r'L_1=F\circ R_{60^\circ},\quad L_2=R_{60^\circ}\circ F\;\Rightarrow\;L_1=L_2',
 'q4b': r'FR\ne RF',
 'q5': r'W=\left\{(x,\,y,\,1)^T\right\}\subseteq\mathbb R^3',
 'q5b': r'\begin{bmatrix}x\\y\\1\end{bmatrix}+\begin{bmatrix}x\'\\y\'\\1\end{bmatrix}=\begin{bmatrix}x+x\'\\y+y\'\\{\color{#E8577A}2}\end{bmatrix}',
 'q6': r'L^2(\mathbf x)=L(L(\mathbf x))\;\Rightarrow\;L^2\leftrightarrow A^2',
 'q6b': r'L(L(\mathbf x))=A(A\mathbf x)=A^2\mathbf x',
 'q7': r'[L_1]_E=[L_2]_E\;\Rightarrow\;L_1=L_2',
 'q7b': r'L_1(\mathbf u_j)=L_2(\mathbf u_j)\ \ (j=1,\dots,n)\;\Rightarrow\;L_1=L_2',
 'q8': r'B=[L]_F\ (\exists F)\iff B\sim A',
 'q8b': r'B=S^{-1}AS\;\Rightarrow\;B=[L]_{F},\quad F=\{\mathbf s_1,\dots,\mathbf s_n\}',
 'q9': r'A\sim B,\;B\sim C\;\Rightarrow\;A\sim C',
 'q9b': r'A=S^{-1}(T^{-1}CT)S=(TS)^{-1}C\,(TS)',
 'q10': r'\operatorname{tr}A=\operatorname{tr}B\;\Rightarrow\;A\sim B',
 'q10a': r'I=\begin{bmatrix}1&0\\0&1\end{bmatrix},\quad\begin{bmatrix}2&0\\0&0\end{bmatrix}:\quad\operatorname{tr}=2',
 'q10b': r'S^{-1}IS=I', 'q10c': r'\det:\;1\ne 0',
}

T['s4_xb'] = {
 'b3': r'L(\mathbf x)=(x_2-x_1,\;x_3-x_2,\;x_3-x_1)^T,\quad S=\operatorname{Span}\{(1,0,1)^T\}',
 'b3s': r'x_2-x_1=0,\quad x_3-x_2=0,\quad x_3-x_1=0\;\Rightarrow\;x_1=x_2=x_3',
 'b3k': r'\ker(L)=\operatorname{Span}\{(1,1,1)^T\}',
 'b3L': r'L\big((1,0,1)^T\big)=(-1,\,1,\,0)^T', 'b3S': r'L(S)=\operatorname{Span}\{(-1,1,0)^T\}',
 'b3c': r'L\big(c\,(1,0,1)^T\big)=c\,(-1,1,0)^T',
 'b4': r'L(\mathbf x)=(x_2,\;x_1,\;x_1+x_2)^T',
 'b4A': r'A=\begin{bmatrix}' + ci(0) + '&' + cj(1) + r'&{\color{#8C9DFF}0}\\' + ci(1) + '&' + cj(0) + r'&{\color{#8C9DFF}0}\\' + ci(1) + '&' + cj(1) + r'&{\color{#8C9DFF}0}\end{bmatrix}',
 'b4y': r'\mathbf y=a' + ci(r'\begin{bmatrix}0\\1\\1\end{bmatrix}') + '+b' + cj(r'\begin{bmatrix}1\\0\\1\end{bmatrix}') + r'=\begin{bmatrix}b\\a\\a+b\end{bmatrix}',
 'b4e': r'L(\mathbb R^3)=\{\mathbf y:\;y_3=y_1+y_2\}',
 'b9': r'\mathbf u_1=\begin{bmatrix}3\\1\end{bmatrix},\;\mathbf u_2=\begin{bmatrix}5\\2\end{bmatrix};\quad\mathbf v_1=\begin{bmatrix}1\\-2\end{bmatrix},\;\mathbf v_2=\begin{bmatrix}1\\-1\end{bmatrix}',
 'b9A': r'A=[L]_{U}=\begin{bmatrix}2&1\\3&2\end{bmatrix}',
 'chV': r'V', 'chU': r'U^{-1}',
 'b9S': r'S=U^{-1}V=\begin{bmatrix}2&-5\\-1&3\end{bmatrix}\begin{bmatrix}1&1\\-2&-1\end{bmatrix}=\begin{bmatrix}12&7\\-7&-4\end{bmatrix}',
 'b9c': r'12\,\mathbf u_1-7\,\mathbf u_2=\begin{bmatrix}36-35\\12-14\end{bmatrix}=\begin{bmatrix}1\\-2\end{bmatrix}=\mathbf v_1',
 'b9B0': r'B=S^{-1}AS',
 'b9B': r'B=\begin{bmatrix}-4&-7\\7&12\end{bmatrix}\begin{bmatrix}2&1\\3&2\end{bmatrix}\begin{bmatrix}12&7\\-7&-4\end{bmatrix}=\begin{bmatrix}-222&-131\\383&226\end{bmatrix}',
 'b9t': r'\operatorname{tr}:\;2+2=4,\qquad -222+226=4',
 'b9d': r'\det:\;4-3=1,\qquad -50172+50173=1',
 'tj': r'\begin{bmatrix}2&0&0\\0&0&1\\0&1&x\end{bmatrix}\sim\begin{bmatrix}2&0&0\\0&y&0\\0&0&-1\end{bmatrix}',
 'tjt': r'\operatorname{tr}:\;2+x=1+y', 'tjd': r'\det:\;-2=-2y',
 'tjs': r'y=1,\quad x=0',
 'tjb': r'\begin{bmatrix}0&1\\1&0\end{bmatrix}',
 'sum5': r'B=S^{-1}AS',
}

if __name__ == '__main__':
    import sys
    for s, d in T.items():
        if len(sys.argv) > 1 and s not in sys.argv[1:]: continue
        (HERE / s / 'tex.json').write_text(json.dumps(d, ensure_ascii=False, indent=1), encoding='utf-8'); print(s, len(d), 'keys')
