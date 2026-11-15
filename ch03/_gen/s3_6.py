"""s3_6a / s3_6b：tex.json + math.json（TeX 里不放中文和 \\text）。重建版。"""
import json
def bm(M, cls=None):
    rows=[]
    for i,r in enumerate(M):
        cells=[]
        for j,v in enumerate(r):
            s=str(v); c=cls(i,j) if cls else None
            cells.append(f'\\class{{{c}}}{{{s}}}' if c else s)
        rows.append('&'.join(cells))
    return r'\begin{bmatrix}'+r'\\'.join(rows)+r'\end{bmatrix}'
A1=[[1,0,0],[0,1,0]]
A2=[[1,-2,3],[2,-5,1],[1,-4,-7]]; U2=[[1,-2,3],[0,1,5],[0,0,0]]
A3=[[1,2,-1,1],[2,4,-3,0],[1,2,1,5]]; U3=[[1,2,0,3],[0,0,1,2],[0,0,0,0]]
A4=[[1,-2,1,1,2],[-1,3,0,2,-2],[0,1,1,3,4],[1,2,5,13,5]]; U4=[[1,-2,1,1,2],[0,1,1,3,0],[0,0,0,0,1],[0,0,0,0,0]]
B3=[[1,3,1,3,4],[0,0,1,1,1],[0,0,2,2,2],[0,0,3,3,3]]; R3=[[1,3,0,2,3],[0,0,1,1,1],[0,0,0,0,0],[0,0,0,0,0]]
M=[[1,0,1],[0,1,1],[1,1,2]]
col=lambda i,j: f'c{j+1}'; row=lambda i,j: f'r{i+1}'
piv=lambda i,j: 'p' if (i,j) in ((0,0),(1,2)) else None
T6a={
 'A1r': 'A='+bm(A1,row), 'A1c': 'A='+bm(A1,col),
 'row1': r'\{(\alpha,\beta,0)\}', 'col1': r'\mathbb{R}^2',
 'A2': 'A='+bm(A2), 'U2': 'U='+bm(U2,lambda i,j: 'z' if i==2 else None),
 'rk2': r'\operatorname{rank}(A)=2',
 'Ax': r'A\mathbf{x}=x_1\mathbf{a}_1+x_2\mathbf{a}_2+\cdots+x_n\mathbf{a}_n',
 'th2': r'A\mathbf{x}=\mathbf{b}',
 'A3': 'A='+bm(A3,col), 'U3': 'U='+bm(U3,col),
 'rel3u': r'\mathbf{u}_2=2\mathbf{u}_1,\quad\mathbf{u}_4=3\mathbf{u}_1+2\mathbf{u}_3',
 'rel3a': r'\mathbf{a}_2=2\mathbf{a}_1,\quad\mathbf{a}_4=3\mathbf{a}_1+2\mathbf{a}_3',
 'same': r'A\mathbf{x}=\mathbf{0}\iff U\mathbf{x}=\mathbf{0}',
 'A4': 'A='+bm(A4,col), 'U4': 'U='+bm(U4,col),
 'b4': r'\mathbf{a}_1,\ \mathbf{a}_2,\ \mathbf{a}_5',
}
T6b={
 'U3': 'U='+bm(U3,piv),
 'rn': r'\operatorname{rank}(A)+\operatorname{nullity}(A)=n',
 'rn3': r'2+1=3',
 'M': bm(M),
 'alg': r'r+(n-r)=n',
 'A3': 'A='+bm(A3), 'R3': bm(U3,piv),
 'N3': r'\mathbf{x}=\alpha\begin{bmatrix}-2\\1\\0\\0\end{bmatrix}+\beta\begin{bmatrix}-3\\0\\-2\\1\end{bmatrix}',
 'chk3': r'2+2=4',
 'q7': r'6\times4,\quad\operatorname{rank}=4',
 'q7a': r'\dim N(A)=4-4=0',
 'q7b': r'\dim\operatorname{col}(A)=4<6',
 'B3': 'A='+bm(B3,col), 'BR3': bm(R3,col),
 'n3': r'\operatorname{nullity}=5-2=3',
 'NB3': r'\begin{bmatrix}-3\\1\\0\\0\\0\end{bmatrix},\ \begin{bmatrix}-2\\0\\-1\\1\\0\end{bmatrix},\ \begin{bmatrix}-3\\0\\-1\\0\\1\end{bmatrix}',
 'NAT': r'\dim N(A^{\mathsf T})=m-r',
}
for seg,T in (('s3_6a',T6a),('s3_6b',T6b)):
    json.dump(T,open(f'/home/user/la/src/ch03/{seg}/tex.json','w',encoding='utf-8'),ensure_ascii=False,indent=1)
M6a={"_note":"s3_6a 屏幕上出现的全部数字。",
 "ranks":[{"desc":"例 1","A":A1,"rank":2},{"desc":"例 2","A":A2,"rank":2},{"desc":"例 2 U","A":U2,"rank":2}],
 "combos":[{"desc":"例 2 U 第二行 = 2r1 − r2","c":[2,-1],"vecs":[[1,-2,3],[2,-5,1]],"result":[0,1,5]},
   {"desc":"例 2 A 第三行 = u1 − 2u2","c":[1,-2],"vecs":[[1,-2,3],[0,1,5]],"result":[1,-4,-7]},
   {"desc":"例 3 a2 = 2a1","c":[2],"vecs":[[1,2,1]],"result":[2,4,2]},
   {"desc":"例 3 a4 = 3a1 + 2a3","c":[3,2],"vecs":[[1,2,1],[-1,-3,1]],"result":[1,0,5]},
   {"desc":"例 3 u4 = 3u1 + 2u3","c":[3,2],"vecs":[[1,0,0],[0,1,0]],"result":[3,2,0]}],
 "rowbasis":[{"desc":"例 3","A":A3,"rows":[[1,2,0,3],[0,0,1,2]]}],
 "colbasis":[{"desc":"例 3","A":A3,"cols":[1,3]},{"desc":"例 4","A":A4,"cols":[1,2,5]},{"desc":"例 4 U","A":U4,"cols":[1,2,5]}]}
M6b={"_note":"s3_6b 屏幕上出现的全部数字。",
 "nulls":[{"desc":"例 3","A":A3,"basis":[[-2,1,0,0],[-3,0,-2,1]]},{"desc":"Test B 3","A":B3,"basis":[[-3,1,0,0,0],[-2,0,-1,1,0],[-3,0,-1,0,1]]},
   {"desc":"演示矩阵 秩 2","A":M,"basis":[[1,1,-1]]}],
 "ranks":[{"desc":"例 3","A":A3,"rank":2},{"desc":"Test B 3","A":B3,"rank":2},{"desc":"演示矩阵","A":M,"rank":2}],
 "rowbasis":[{"desc":"例 3","A":A3,"rows":[[1,2,0,3],[0,0,1,2]]},{"desc":"Test B 3","A":B3,"rows":[[1,3,0,2,3],[0,0,1,1,1]]}],
 "colbasis":[{"desc":"例 3","A":A3,"cols":[1,3]},{"desc":"Test B 3","A":B3,"cols":[1,3]}],
 "evals":[{"desc":"秩–零化度 例 3","expr":"2+2","val":4},{"desc":"Test B 3","expr":"5-2","val":3},{"desc":"Test B 7","expr":"4-4","val":0}]}
for seg,Mj in (('s3_6a',M6a),('s3_6b',M6b)):
    json.dump(Mj,open(f'/home/user/la/src/ch03/{seg}/math.json','w',encoding='utf-8'),ensure_ascii=False,indent=1)
print('ok')
