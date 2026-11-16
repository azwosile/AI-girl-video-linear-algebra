from sympy import *
ok=lambda c,m: print(('OK  ' if c else 'FAIL'),m)
C=lambda *v: Matrix.hstack(*[Matrix(x) for x in v])
# sp6_2 25-26 Q4
A=Matrix([[1,3,3,2],[2,6,9,7],[-1,-3,3,4]]); b=Matrix([7,20,5]); R=A.row_join(b).rref()[0]; print('sp6_2 rref',R.tolist())
x0=Matrix([1,0,2,0]); n1=Matrix([-3,1,0,0]); n2=Matrix([1,0,-1,1]); ok(A*x0==b and A*n1==zeros(3,1) and A*n2==zeros(3,1),'sp6_2 solution'); ok(A[:,3]==A[:,2]-A[:,0],'sp6_2 a4=a3-a1')
print('  N(A^T)=',[v.T for v in A.T.nullspace()],' rank',A.rank())
M=A.row_join(b); M[1,:]-=2*M[0,:]; M[2,:]+=M[0,:]; print('  step1',M.tolist())
# sp6_3 24-25 Q4
U=Matrix([[1,1,0,0,0,4],[0,0,1,1,0,-6],[0,0,0,0,1,3],[0,0,0,0,0,0]])
a1,a3,a5=Matrix([1,-1,-2,0]),Matrix([1,0,0,1]),Matrix([1,1,3,3]); A=C(a1,a1,a3,a3,a5); bb=4*a1-6*a3+3*a5
ok(bb==Matrix([1,-1,1,3]) and A.row_join(bb).rref()[0]==U,'sp6_3 b, rref matches')
# sp6_4 20-21 Q7
U=Matrix([[1,0,0,-1],[0,1,0,1],[0,0,1,-1]]); al=[Matrix([-1,3,2]),Matrix([1,1,-1]),Matrix([-1,-1,-2])]; a4=-al[0]+al[1]-al[2]
A=C(*al,a4); ok(a4==Matrix([3,-1,-1]) and A.rref()[0]==U,'sp6_4 a4'); eta=Matrix([1,1,2,0]); ok(A*eta==Matrix([-2,2,-3]) and A*Matrix([1,-1,1,1])==zeros(3,1),'sp6_4 b=A eta')
# 21-22 Q2
R2=Matrix([[1,2,0,3,1,3],[0,0,1,2,4,6],[0,0,0,0,0,0],[0,0,0,0,0,0]]); a1=Matrix([1,1,3,4]); a3=Matrix([2,-1,1,3])
A=C(a1,2*a1,a3,3*a1+2*a3,a1+4*a3); b=3*a1+6*a3; ok(b==Matrix([15,-3,15,30]) and A.row_join(b).rref()[0]==R2,'sp6_4 21-22')
# sp6_5 22-23 Q2
a1=Matrix([-1,5,2,1]); a2=Matrix([4,-3,7,-1]); a3=2*a1+a2; a4=a1+4*a2; ok(a3==Matrix([2,7,11,1]) and a4==Matrix([15,-7,30,-3]),'sp6_5 a3 a4')
A=C(a1,a2,a3,a4); ok(A.rref()[0]==Matrix([[1,0,2,1],[0,1,1,4],[0,0,0,0],[0,0,0,0]]),'sp6_5 rref'); print('  N(A)',[v.T for v in A.nullspace()])
# sp6_6 17-18 Q8 bug
a1=Matrix([2,1,-3,2]); a2=Matrix([-1,2,3,1]); a3=2*a1+3*a2; b=Matrix([0,5,3,4]); x0=Matrix([3,2,0,2,0])
a4=(b-3*a1-2*a2)/2; print('sp6_6 a3',a3.T,' a4=',a4.T,' a4==-a1',a4==-a1, ' b in span(a1,a2)?', b==a1+2*a2)
print('  rank[a1 a2 a4]',C(a1,a2,a4).rank())
# sp6_7
A=Matrix([[1,-1,4,2],[-2,-4,7,5]]); print('sp6_7 N(A)',[v.T for v in A.nullspace()]); ok(A*Matrix([-3,5,2,0])==zeros(2,1) and A*Matrix([-1,3,0,2])==zeros(2,1),'sp6_7 N(A) given')
B=Matrix([[1,2,-4],[2,1,-1],[-1,1,-3]]); ok(B*Matrix([-2,7,3])==zeros(3,1) and B.rank()==2,'sp6_7 N(B)')
A6=Matrix([[4,-2],[1,3],[2,1],[3,4]]); ok(A6.rank()==2 and A6.T*Matrix([-5,-8,14,0])==zeros(2,1) and A6.T*Matrix([-5,-22,0,14])==zeros(2,1),'sp6_7 15-16 N(A^T)')
A2=Matrix([[3,4],[6,8]]); ok(A2*Matrix([-4,3])==zeros(2,1),'sp6_7 ker (-4,3)')
S=Matrix([[1,2,3,1]]); ok(all(S*v==zeros(1,1) for v in [Matrix([-2,1,0,0]),Matrix([-3,0,1,0]),Matrix([-1,0,0,1])]),'sp6_7 24-25 1(5)')
