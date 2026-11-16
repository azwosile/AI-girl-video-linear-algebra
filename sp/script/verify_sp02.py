from sympy import *
R=Rational
ok=lambda c,m: print(('OK  ' if c else 'FAIL'),m)
def lu_steps(A):
    U=A.copy(); n=A.rows; L=eye(n); log=[]
    for j in range(n):
        for i in range(j+1,n):
            l=U[i,j]/U[j,j]; U[i,:]=U[i,:]-l*U[j,:]; L[i,j]=l; log.append((i+1,j+1,l,list(U[i,:])))
    return L,U,log
for name,A in [('sp2_1',Matrix([[-2,1,2],[4,1,-2],[-6,-3,4]])),('sp2_2',Matrix([[1,1,1],[3,5,6],[-2,2,7]])),('sp2_3',Matrix([[2,1,1],[6,4,5],[4,1,3]])),('sp2_4',Matrix([[1,0,1],[3,3,4],[2,2,3]])),('25-26Q3',Matrix([[1,0,1],[-1,1,1],[-1,-2,-4]]))]:
    L,U,log=lu_steps(A); ok(L*U==A,name+' LU'); print('   L=',L.tolist(),'U=',U.tolist(),'det=',A.det()); print('   steps',log); print('   inv=',A.inv().tolist())
A=Matrix([[2,1,1],[6,4,5],[4,1,3]]); B=Matrix([[3,0,-1],[0,1,0],[0,0,0]]); X=A.inv()*B; print('sp2_3 X=',X.tolist(),'rankB',B.rank())
L,U,_=lu_steps(A); y=L.LUsolve(B[:,0]) if False else L.inv()*B; print('  Y=L^-1 B=',y.tolist())
A=Matrix([[1,0,1],[3,3,4],[2,2,3]]); print('sp2_4 x=',(A.inv()*Matrix([-2,1,0])).T, ' y=',(Matrix([[1,0,0],[3,1,0],[2,R(2,3),1]]).inv()*Matrix([-2,1,0])).T)
E1=Matrix([[1,0,0],[-2,1,0],[0,0,1]]);E2=Matrix([[1,0,0],[0,1,0],[0,3,1]]); ok(E1.inv()*E2.inv()==Matrix([[1,0,0],[2,1,0],[0,-3,1]]),'sp2_5 L'); print('  E2E1=',(E2*E1).tolist(),' E2^-1E1^-1=',(E2.inv()*E1.inv()).tolist())
U5=Matrix([[2,4,2],[0,3,1],[0,0,8]]); print('  A=LU=',(E1.inv()*E2.inv()*U5).tolist())
A=Matrix([[1,1,1],[3,5,6],[-2,2,7]]); print('sp2_2 A*Ainv row1 check', (A[0,:]*A.inv()).tolist())
