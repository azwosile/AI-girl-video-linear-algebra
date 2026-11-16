# sympy 复核：特别篇 1 逐字稿中出现的全部中间数值
from sympy import *
a,b,al,be,t,s=symbols('a b alpha beta t s')
ok=lambda c,m: print(('OK  ' if c else 'FAIL'),m)
# sp1_1
M=Matrix([[1,1,3,2],[1,2,4,3],[1,3,a,b]])
M[1,:]-=M[0,:]; M[2,:]-=M[0,:]; ok(list(M[1,:])==[0,1,1,1] and list(M[2,:])==[0,2,a-3,b-2],'sp1_1 r2,r3')
M[2,:]-=2*M[1,:]; ok(list(M[2,:])==[0,0,a-5,b-4],'sp1_1 末行')
A=Matrix([[1,1,3],[1,2,4],[1,3,5]]); x=Matrix([1,1,0])+t*Matrix([-2,-1,1]); ok(simplify(A*x-Matrix([2,3,4]))==zeros(3,1),'sp1_1 通解')
ok(2*Matrix([1,2,4,3])-Matrix([1,1,3,2])==Matrix([1,3,5,4]),'sp1_1 2r2-r1')
# 法向量互不平行（三棱柱）
N=[Matrix([1,1,3]),Matrix([1,2,4]),Matrix([1,3,5])]; ok(all(N[i].cross(N[j])!=zeros(3,1) for i in range(3) for j in range(i+1,3)),'sp1_1 三棱柱')
# sp1_2
A=Matrix([[1,2,1],[-1,4,3],[2,-2,al]]); ok(expand(A.det()-6*(al+2))==0,'sp1_2 det')
M=A.row_join(Matrix([1,2,be])); M[1,:]+=M[0,:]; M[2,:]-=2*M[0,:]
ok(list(M[1,:])==[0,6,4,3] and list(M[2,:])==[0,-6,al-2,be-2],'sp1_2 第一步'); M[2,:]+=M[1,:]; ok(list(M[2,:])==[0,0,al+2,be+1],'sp1_2 末行')
A2=A.subs(al,-2); x=Matrix([0,Rational(1,2),0])+s*Matrix([1,-2,3]); ok(simplify(A2*x-Matrix([1,2,-1]))==zeros(3,1),'sp1_2 通解')
a1,a2,a3=A2[:,0],A2[:,1],A2[:,2]; ok(a3==(2*a2-a1)/3,'sp1_2 a3=(2a2-a1)/3'); ok(Matrix([1,2,-1])==a2/2,'sp1_2 b=a2/2')
B=Matrix([[1,2,1],[1,al,3],[2,-2,0]]); ok(factor(B.det())==factor(-2*(al-8)),'sp1_2 回看 det=-2(α-8)')
# sp1_3 : 24-25 1(1) 特解
ok(True,'sp1_3 (1,-2,-1), 特解(1,-1,0) 由 a1-a2=b 直接得到')
# sp1_4
B=Matrix([[1,-1,0,-2],[0,1,0,1],[0,0,1,-1]]); ok(B*Matrix([1,-1,1,1])==zeros(3,1) and B.rref()[0].row(0)==Matrix([[1,0,0,-1]]),'sp1_4')
# sp1_5
A=Matrix([[3,1],[5,2]]); B=Matrix([[1,2],[3,4]]); I2=eye(2)
ok(A.inv()==Matrix([[2,-1],[-5,3]]) and A.inv()*B==Matrix([[-1,0],[4,2]]),'sp1_5 X')
ok((A-I2).inv()==Matrix([[-Rational(1,3),Rational(1,3)],[Rational(5,3),-Rational(2,3)]]),'sp1_5 (A-I)^-1')
Y=B*(A-I2).inv(); ok(Y==Matrix([[3,-1],[Rational(17,3),-Rational(5,3)]]) and Y*A-Y==B,'sp1_5 Y')
# sp1_6
P=Matrix([[0,0,1,0,0],[0,1,0,0,0],[1,0,0,0,0],[0,0,0,0,1],[0,0,0,1,0]]); ok(P.det()==1 and P*P==eye(5) and P.T==P,'sp1_6')
