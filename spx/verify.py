# 速成版全部数值的 sympy 复核
from sympy import *
a,b,al,be,x,t=symbols('a b alpha beta x t')
def P(*s): print(*s)
# x1 含参方程组
M=Matrix([[1,1,3,2],[1,2,4,3],[1,3,a,b]]); M[1,:]-=M[0,:]; M[2,:]-=M[0,:]; M[2,:]-=2*M[1,:]; P('1819Q1',M.tolist())
A=Matrix([[1,2,1],[1,al,3],[2,-2,0]]); P('2526Q2 det',factor(A.det()))
Ab=Matrix([[1,2,1,1],[1,8,3,2],[2,-2,0,be]]); P('2526Q2 a=8 rref',Ab.rref()[0].tolist())
A=Matrix([[1,2,1],[-1,4,3],[2,-2,al]]); P('2425Q2 det',factor(A.det()))
Ab=Matrix([[1,2,1,1],[-1,4,3,2],[2,-2,-2,be]]); P('2425Q2 a=-2 rref',Ab.rref()[0].tolist())
# x2 LU/逆
A=Matrix([[1,0,1],[3,3,4],[2,2,3]]); L,U,_=A.LUdecomposition(); P('1819Q2 L',L.tolist(),'U',U.tolist(),'inv',A.inv().tolist(),'x',(A.inv()*Matrix([-2,1,0])).T.tolist())
A=Matrix([[-2,1,2],[4,1,-2],[-6,-3,4]]); L,U,_=A.LUdecomposition(); P('2324Q5 L',L.tolist(),'U',U.tolist(),'inv',A.inv().tolist())
A=Matrix([[3,1],[5,2]]); B=Matrix([[1,2],[3,4]]); P('2021Q2 X',(A.inv()*B).tolist(),'Y',(B*(A-eye(2)).inv()).tolist())
# x3 行列式
A=Matrix([[1,-2,2],[-2,-2,4],[2,4,-2]]); P('A det',A.det(),'eig',A.eigenvals(),'det(A-2I)',(A-2*eye(3)).det())
Ac=A.adjugate().T  # cofactor matrix C[i,j]=A_ij
P('A21+A22+2A23',Ac[1,0]+Ac[1,1]+2*Ac[1,2])
A=Matrix([[0,2,3,0],[0,4,5,0],[0,1,0,3],[2,0,1,3]]); Ac=A.adjugate().T
P('1819Q5 det',A.det(),'adj',A.adjugate().det(),'comb',Ac[0,0]+Ac[1,0]-Ac[2,0]+2*Ac[3,0])
A=Matrix([[1,1,1,1],[1,2,4,8],[1,3,9,27],[1,-1,1,-1]]); Ac=A.adjugate().T; P('2021Q4 det',A.det(),'A32+A33+A34',Ac[2,1]+Ac[2,2]+Ac[2,3])
# x5 相关
X=Matrix([[2,3,2],[1,-1,6],[3,4,4]]); P('1718Q6 rank',X.rank(),'null',X.nullspace()[0].T, 'normal',Matrix([2,1,3]).cross(Matrix([3,-1,4])).T)
V=Matrix([[1,1,2,4],[2,-1,-5,2],[1,-1,-4,0],[2,1,1,6]]).T; P('1819Q9 rank',V.rank(),V.nullspace())
A=Matrix([[1,2,-1,0],[1,1,0,2],[2,1,1,a]]); P('2021Q6 rref',A.echelon_form().tolist(),'a', solve(Matrix([[1,2,-1,0],[1,1,0,2],[2,1,1,a]]).echelon_form()[2,3],a))
P('1516Q2 rank',Matrix([[1,0,0],[0,1,1],[1,0,1],[1,2,3]]).T.rank())
# x4 子空间
p=lambda c: c[0]+c[1]*x+c[2]*x**2+c[3]*x**3
for q in [x-Rational(1,2), x**2-Rational(1,3), x**3-Rational(1,4)]: P('int',integrate(q,(x,0,1)))
# x6 过渡
E=Matrix([[1,2,1],[1,3,5],[1,2,4]]); F=Matrix([[1,1,1],[1,2,2],[0,0,1]]); S=F.inv()*E; P('2526Q5 S',S.tolist(),'xF',(S*Matrix([3,2,-1])).T,'yF',(S*Matrix([1,-3,2])).T)
P('detE',E.det(),'detF',F.det())
# x7 RREF 反推
a1=Matrix([1,-1,-2,0]); a3=Matrix([1,0,0,1]); a5=Matrix([1,1,3,3]); Aful=Matrix.hstack(a1,a1,a3,a3,a5); bb=4*a1-6*a3+3*a5
P('2425Q4 b',bb.T,'rref',Matrix.hstack(Aful,bb).rref()[0].tolist())
P('N(A)',Aful.nullspace())
# x8 判断
P('2526 (5)',True)
