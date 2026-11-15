"""s3_5：tex.json + math.json（TeX 里不放中文和 \\text）。重建版。"""
import json
def bm(M, cls=None):
    rows=[]
    for i,r in enumerate(M):
        rows.append('&'.join((f'\\class{{{cls(i,j)}}}{{{v}}}' if cls and cls(i,j) else str(v)) for j,v in enumerate(r)))
    return r'\begin{bmatrix}'+r'\\'.join(rows)+r'\end{bmatrix}'
cv=lambda *v: bm([[x] for x in v])
U=[[3,1],[2,1]]; Ui=[[1,-1],[-2,3]]; V=[[5,7],[2,3]]; S=[[3,4],[-4,-5]]; Si=[[-5,-4],[4,3]]; YZ=[[2,1],[1,4]]
c1=lambda i,j: 'c1' if j==0 else None
T={
 'x77': r'\mathbf{x}='+cv(7,7)+r'=7\mathbf{e}_1+7\mathbf{e}_2',
 'yz': r'\mathbf{y}='+cv(2,1)+r',\quad\mathbf{z}='+cv(1,4),
 'x31': r'\mathbf{x}=3\mathbf{y}+1\mathbf{z}',
 'c77': r'[\mathbf{x}]_E='+cv(7,7), 'c31': r'[\mathbf{x}]_{yz}='+cv(3,1),
 'xUc': r'\mathbf{x}=c_1\mathbf{u}_1+c_2\mathbf{u}_2=U\mathbf{c}',
 'cUx': r'\mathbf{c}=U^{-1}\mathbf{x}',
 'U2': r'U='+bm(U)+r',\quad\mathbf{x}='+cv(7,4),
 'Ui': r'U^{-1}='+bm(Ui),
 'c2': r'U^{-1}\mathbf{x}='+bm(Ui)+cv(7,4)+'='+cv(3,-2),
 'chk2': r'3\mathbf{u}_1-2\mathbf{u}_2='+cv('9-2','6-2')+'='+cv(7,4),
 'S': r'S=U^{-1}V', 'xu': r'[\mathbf{x}]_u=S\,[\mathbf{x}]_v',
 'V4': r'V='+bm(V),
 'S4': r'S=U^{-1}V='+bm(Ui)+bm(V)+'='+bm(S,c1),
 'chk4': r'3\mathbf{u}_1-4\mathbf{u}_2='+cv('9-4','6-4')+'='+cv(5,2)+r'=\mathbf{v}_1',
 'Sinv': r'S^{-1}=V^{-1}U='+bm(Si),
 'leon': r'[\mathbf{x}]_u=U^{-1}V\,[\mathbf{x}]_v',
 'tj': r'(\mathbf{u}_1,\dots,\mathbf{u}_n)=(\mathbf{v}_1,\dots,\mathbf{v}_n)P',
 'tjP': r'P=V^{-1}U',
 'tjL': r'V^{-1}U=S^{-1}',
 'p3b': r'[1,\ x,\ x^2]\ \longrightarrow\ [1,\ 2x,\ 4x^2-2]',
 'p3': r'3+2x+4x^2=c_1\cdot 1+c_2\cdot 2x+c_3(4x^2-2)',
 'p3c': r'c_3=1,\quad c_2=1,\quad c_1-2=3',
 'p3r': r'\mathbf{c}='+cv(5,1,1),
 'p3M': bm([[1,0,-2],[0,2,0],[0,0,4]],c1),
}
json.dump(T,open('/home/user/la/src/ch03/s3_5/tex.json','w',encoding='utf-8'),ensure_ascii=False,indent=1)
M={"_note":"s3_5 屏幕上出现的全部数字。",
 "coords":[{"desc":"开场 (7,7) = 3y + z","basis":[[2,1],[1,4]],"x":[7,7],"c":[3,1]},
   {"desc":"例 2","basis":[[3,2],[1,1]],"x":[7,4],"c":[3,-2]},
   {"desc":"例 4 v1 在 u 下","basis":[[3,2],[1,1]],"x":[5,2],"c":[3,-4]},
   {"desc":"例 4 v2 在 u 下","basis":[[3,2],[1,1]],"x":[7,3],"c":[4,-5]},
   {"desc":"P3：3+2x+4x² 在 [1,2x,4x²−2] 下","basis":[[1,0,0],[0,2,0],[-2,0,4]],"x":[3,2,4],"c":[5,1,1]}],
 "inverses":[{"desc":"例 2 U⁻¹","A":U,"inv":Ui},{"desc":"S⁻¹","A":S,"inv":Si}],
 "matmul":[{"desc":"例 4 S = U⁻¹V","A":Ui,"B":V,"AB":S},{"desc":"例 2 U⁻¹x","A":Ui,"B":[[7],[4]],"AB":[[3],[-2]]},
   {"desc":"S⁻¹ = V⁻¹U","A":[[3,-7],[-2,5]],"B":U,"AB":Si}],
 "evals":[{"desc":"9−2","expr":"9-2","val":7},{"desc":"6−2","expr":"6-2","val":4},{"desc":"9−4","expr":"9-4","val":5}]}
json.dump(M,open('/home/user/la/src/ch03/s3_5/math.json','w',encoding='utf-8'),ensure_ascii=False,indent=1)
print('ok')
