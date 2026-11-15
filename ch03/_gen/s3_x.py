"""s3_xa / s3_xb：tex.json + math.json（TeX 里不放任何中文和 \\text）。"""
import json
def bm(M, cls=None):
    rows = []
    for i, r in enumerate(M):
        cells = []
        for j, v in enumerate(r):
            s = str(v); c = cls(i, j) if cls else None
            cells.append(f'\\class{{{c}}}{{{s}}}' if c else s)
        rows.append('&'.join(cells))
    return r'\begin{bmatrix}' + r'\\'.join(rows) + r'\end{bmatrix}'
cv = lambda v: bm([[q] for q in v])
col = lambda i, j: f'c{j+1}'

TA = {
 'q1': r'S\subseteq V:\ \ \mathbf{x}+\mathbf{y}\in S,\ \ \alpha\mathbf{x}\in S',
 'q1e': r'\mathbf{0}=0\cdot\mathbf{x}\in S,\qquad -\mathbf{x}=(-1)\,\mathbf{x}\in S',
 'q2': r'\mathbb{R}^2\subseteq\mathbb{R}^3\ ?',
 'q2a': r'(x_1,x_2)^{\mathsf T}\notin\mathbb{R}^3',
 'q2b': r'\{(x_1,x_2,0)^{\mathsf T}\}\subseteq\mathbb{R}^3',
 'q3': r'\dim S=\dim T=2,\quad S\cap T=\{\mathbf{0}\}\ ?',
 'q3a': r'a_1\mathbf{s}_1+a_2\mathbf{s}_2=-b_1\mathbf{t}_1-b_2\mathbf{t}_2\neq\mathbf{0}',
 'q4': r'S\cup T\ ?',
 'q4a': cv([1, 0]) + '+' + cv([0, 1]) + '=' + cv([1, 1]),
 'q5': r'S\cap T\ \checkmark',
 'q6': r'\operatorname{Span}(\mathbf{x}_1,\dots,\mathbf{x}_n)=\mathbb{R}^n\ \Rightarrow\ ?',
 'q6b': r'n=\dim\mathbb{R}^n',
 'q7': r'\operatorname{Span}(\mathbf{x}_1,\dots,\mathbf{x}_n)=V\ \Rightarrow\ ?',
 'q7a': r'\mathbf{e}_1+\mathbf{e}_2-(\mathbf{e}_1+\mathbf{e}_2)=\mathbf{0}',
 'q8': r'\operatorname{Span}(\mathbf{x}_1,\dots,\mathbf{x}_{k-1})=\operatorname{Span}(\mathbf{x}_1,\dots,\mathbf{x}_k)',
 'q8a': r'\mathbf{x}_k=c_1\mathbf{x}_1+\cdots+c_{k-1}\mathbf{x}_{k-1}',
 'q8b': r'c_1\mathbf{x}_1+\cdots+c_{k-1}\mathbf{x}_{k-1}-1\cdot\mathbf{x}_k=\mathbf{0}',
 'q10': r'\operatorname{nullity}(A)=\operatorname{nullity}(A^{\mathsf T})\ ?',
 'q9': r'\operatorname{rank}(A)=\operatorname{rank}(A^{\mathsf T})=r',
 'q10a': r'n-r\ \neq\ m-r',
 'q10b': r'A=\begin{bmatrix}1&1\end{bmatrix}:\ 2-1=1,\qquad A^{\mathsf T}:\ 1-1=0',
 'q12': r'\operatorname{col}(A)=\operatorname{col}(U)\ ?',
 'q12a': r'A=' + cv([1, 1]) + r'\ \longrightarrow\ U=' + cv([1, 0]),
 'q13': r'\mathbf{x}_{k+1}\notin\operatorname{Span}(\mathbf{x}_1,\dots,\mathbf{x}_k)\ \Rightarrow\ ?',
 'q13a': r'c_1\mathbf{x}_1+\cdots+c_k\mathbf{x}_k+c_{k+1}\mathbf{x}_{k+1}=\mathbf{0}',
 'q13b': r'c_{k+1}=0\ \Rightarrow\ c_1=\cdots=c_k=0',
 'q14': r'Z=XY\ ?',
 'q14a': r'[\mathbf{x}]_W=Y[\mathbf{x}]_V=YX[\mathbf{x}]_U',
 'q14b': r'Z=YX\neq XY',
 'q15': r'\operatorname{rank}A=\operatorname{rank}B\ \Rightarrow\ \operatorname{rank}A^2=\operatorname{rank}B^2\ ?',
 'q15a': r'A=\begin{bmatrix}0&1\\0&0\end{bmatrix},\ \ A^2=O',
 'q15b': r'B=\begin{bmatrix}1&0\\0&0\end{bmatrix},\ \ B^2=B',
}
MA = {"_note": "s3_xa 屏幕上出现的全部数字。",
 "adds": [{"desc": "第 4 题 两轴之和", "A": [1, 0], "B": [0, 1], "sum": [1, 1]}],
 "indep": [{"desc": "第 7 题 e1 e2 e1+e2", "vecs": [[1, 0], [0, 1], [1, 1]], "indep": False},
           {"desc": "第 3 题 四个向量必相关（例）", "vecs": [[1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 1, 1]], "indep": False}],
 "nulls": [{"desc": "第 10 题 A=(1 1)", "A": [[1, 1]], "basis": [[-1, 1]]}, {"desc": "第 10 题 Aᵀ", "A": [[1], [1]], "basis": []}],
 "ranks": [{"desc": "第 10 题 A", "A": [[1, 1]], "rank": 1}, {"desc": "第 12 题 U", "A": [[1], [0]], "rank": 1},
           {"desc": "第 15 题 A", "A": [[0, 1], [0, 0]], "rank": 1}, {"desc": "第 15 题 A²", "A": [[0, 0], [0, 0]], "rank": 0},
           {"desc": "第 15 题 B", "A": [[1, 0], [0, 0]], "rank": 1}],
 "matmul": [{"desc": "A² = O", "A": [[0, 1], [0, 0]], "B": [[0, 1], [0, 0]], "AB": [[0, 0], [0, 0]]},
            {"desc": "B² = B", "A": [[1, 0], [0, 0]], "B": [[1, 0], [0, 0]], "AB": [[1, 0], [0, 0]]}],
 "inspan": [{"desc": "第 12 题 (1,0) 不在 col(A)", "vecs": [[1, 1]], "x": [1, 0], "in": False}],
 "evals": [{"desc": "第 10 题", "expr": "2-1", "val": 1}, {"desc": "第 10 题 Aᵀ", "expr": "1-1", "val": 0}]}

A4 = [[1, 3, 3, 2], [2, 6, 9, 7], [-1, -3, 3, 4]]; R4 = [[1, 3, 0, -1], [0, 0, 1, 1], [0, 0, 0, 0]]
TB = {
 'sub1': r'\{\mathbf{x}\in\mathbb{R}^3\mid x_3=x_1\ \lor\ x_3=x_2\}',
 'sub1c': cv([1, 0, 1]) + '+' + cv([0, 1, 1]) + '=' + cv([1, 1, 2]),
 'sub8': r'S=\{\mathbf{x}\in\mathbb{R}^3\mid x_3=x_1-x_2\}',
 'sub8g': r'\begin{bmatrix}x_1\\x_2\\x_1-x_2\end{bmatrix}=x_1' + cv([1, 0, 1]) + '+x_2' + cv([0, 1, -1]),
 'sub8d': r'S=\operatorname{Span}\big((1,0,1)^{\mathsf T},(0,1,-1)^{\mathsf T}\big),\quad\dim S=2',
 'y': r'\mathbf{y}_1=\mathbf{x}_1+\mathbf{x}_2,\quad\mathbf{y}_2=\mathbf{x}_2+\mathbf{x}_3,\quad\mathbf{y}_3=\mathbf{x}_3+\mathbf{x}_1',
 'yC': r'(\mathbf{y}_1,\mathbf{y}_2,\mathbf{y}_3)=(\mathbf{x}_1,\mathbf{x}_2,\mathbf{x}_3)' + bm([[1, 0, 1], [1, 1, 0], [0, 1, 1]], col),
 'yc0': r'(\mathbf{x}_1,\mathbf{x}_2,\mathbf{x}_3)\,C\mathbf{c}=\mathbf{0}\ \Rightarrow\ C\mathbf{c}=\mathbf{0}',
 'ydet': r'\det C=2\neq0\ \Rightarrow\ \mathbf{c}=\mathbf{0}',
 'yv': r'\mathbf{y}_3=\mathbf{x}_3-\mathbf{x}_1:\ \ \det' + bm([[1, 0, -1], [1, 1, 0], [0, 1, 1]]) + '=0',
 'yrel': r'\mathbf{y}_1-\mathbf{y}_2+\mathbf{y}_3=\mathbf{0}',
 'poly': r'x+2,\ x+1,\ x^2-1:\ \ \det' + bm([[2, 1, -1], [1, 1, 0], [0, 0, 1]]) + '=1',
 'PVU': r'V=' + bm([[1, 1, 0], [0, 1, 1], [1, 0, 1]]) + r',\qquad U=' + bm([[2, 1, 2], [3, 2, 0], [1, 0, 3]]),
 'dets': r'\det V=2,\qquad\det U=-1',
 'conv': r'(\mathbf{u}_1,\mathbf{u}_2,\mathbf{u}_3)=(\mathbf{v}_1,\mathbf{v}_2,\mathbf{v}_3)\,S',
 'Sf': r'S=V^{-1}U,\qquad V^{-1}=\tfrac12' + bm([[1, -1, 1], [1, 1, -1], [-1, 1, 1]]),
 'S': r'S=' + bm([[0, r'-\tfrac12', r'\tfrac52'], [2, r'\tfrac32', r'-\tfrac12'], [1, r'\tfrac12', r'\tfrac12']], lambda i, j: 'c1' if j == 0 else None),
 'chk': r'0\,\mathbf{v}_1+2\,\mathbf{v}_2+1\,\mathbf{v}_3=' + cv([2, 3, 1]) + r'=\mathbf{u}_1\ \checkmark',
 'Sinv': r'S^{-1}',
 'A4': 'A=' + bm(A4, col), 'R4': bm(R4, col),
 'rk4': r'\operatorname{rank}(A)=2',
 'row4': r'(1,3,0,-1),\ \ (0,0,1,1)',
 'col4': cv([1, 2, -1]) + r',\ ' + cv([3, 9, 3]),
 'N4': cv([-3, 1, 0, 0]) + r',\ ' + cv([1, 0, -1, 1]),
 'yA': r'\mathbf{y}^{\mathsf T}A=\mathbf{0}^{\mathsf T},\qquad\dim N(A^{\mathsf T})=3-2=1',
 'rel4': r'5R_1-2R_2+R_3=\mathbf{0}',
 'y4': r'\mathbf{y}=(5,-2,1)^{\mathsf T}',
 'dot4': r'5-4-1=0,\qquad 15-18+3=0',
 'dims4': r'4=2+2,\qquad 3=2+1',
 'rn': r'\operatorname{rank}+\operatorname{nullity}=n',
}
MB = {"_note": "s3_xb 屏幕上出现的全部数字。",
 "adds": [{"desc": "① 并集反例", "A": [1, 0, 1], "B": [0, 1, 1], "sum": [1, 1, 2]}],
 "indep": [{"desc": "① 第 8 题两向量", "vecs": [[1, 0, 1], [0, 1, -1]], "indep": True}],
 "combos": [{"desc": "① 一般向量 x1=2,x2=5", "c": [2, 5], "vecs": [[1, 0, 1], [0, 1, -1]], "result": [2, 5, -3]},
            {"desc": "② y1−y2+y3 系数（变式）", "c": [1, -1, 1], "vecs": [[1, 1, 0], [0, 1, 1], [-1, 0, 1]], "result": [0, 0, 0]},
            {"desc": "③ 验算第一列", "c": [0, 2, 1], "vecs": [[1, 0, 1], [1, 1, 0], [0, 1, 1]], "result": [2, 3, 1]},
            {"desc": "④ 5R1−2R2+R3", "c": [5, -2, 1], "vecs": A4, "result": [0, 0, 0, 0]}],
 "dets": [{"desc": "② C", "A": [[1, 0, 1], [1, 1, 0], [0, 1, 1]], "det": 2}, {"desc": "② 变式", "A": [[1, 0, -1], [1, 1, 0], [0, 1, 1]], "det": 0},
          {"desc": "② 多项式", "A": [[2, 1, -1], [1, 1, 0], [0, 0, 1]], "det": 1},
          {"desc": "③ V", "A": [[1, 1, 0], [0, 1, 1], [1, 0, 1]], "det": 2}, {"desc": "③ U", "A": [[2, 1, 2], [3, 2, 0], [1, 0, 3]], "det": -1}],
 "inverses": [{"desc": "③ V⁻¹", "A": [[1, 1, 0], [0, 1, 1], [1, 0, 1]], "inv": [["1/2", "-1/2", "1/2"], ["1/2", "1/2", "-1/2"], ["-1/2", "1/2", "1/2"]]}],
 "trans": [{"desc": "③ (u)=(v)S", "V": [[1, 0, 1], [1, 1, 0], [0, 1, 1]], "U": [[2, 3, 1], [1, 2, 0], [2, 0, 3]],
            "S": [[0, "-1/2", "5/2"], [2, "3/2", "-1/2"], [1, "1/2", "1/2"]]}],
 "ranks": [{"desc": "④", "A": A4, "rank": 2}],
 "rowbasis": [{"desc": "④", "A": A4, "rows": [[1, 3, 0, -1], [0, 0, 1, 1]]}],
 "colbasis": [{"desc": "④", "A": A4, "cols": [1, 3]}],
 "nulls": [{"desc": "④ N(A)", "A": A4, "basis": [[-3, 1, 0, 0], [1, 0, -1, 1]]},
           {"desc": "④ N(Aᵀ)", "A": [[1, 2, -1], [3, 6, -3], [3, 9, 3], [2, 7, 4]], "basis": [[5, -2, 1]]}],
 "evals": [{"desc": "④ 点积 1", "expr": "5-4-1", "val": 0}, {"desc": "④ 点积 2", "expr": "15-18+3", "val": 0}, {"desc": "④ dim N(Aᵀ)", "expr": "3-2", "val": 1}]}

for seg, T, M in (('s3_xa', TA, MA), ('s3_xb', TB, MB)):
    json.dump(T, open(f'/home/user/la/src/ch03/{seg}/tex.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    json.dump(M, open(f'/home/user/la/src/ch03/{seg}/math.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('ok')
