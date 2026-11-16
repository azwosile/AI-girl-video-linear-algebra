from sympy import *
ok=lambda c,m: print(('OK  ' if c else 'FAIL'),m)
C=lambda *v: Matrix.hstack(*[Matrix(x) for x in v])
E=C((1,1,1),(2,3,2),(1,5,4)); F=C((1,1,0),(1,2,0),(1,2,1)); S=F.inv()*E
ok(S==Matrix([[1,1,-3],[-1,-1,0],[1,2,4]]),'sp5_1 S=F^-1E'); ok(S*Matrix([3,2,-1])==Matrix([8,-5,3]) and S*Matrix([1,-3,2])==Matrix([-8,2,3]),'sp5_1 coords')
ok(E*Matrix([3,2,-1])==Matrix([6,4,3]) and F*Matrix([8,-5,3])==Matrix([6,4,3]),'sp5_1 x=(6,4,3)'); print('  y=',(E*Matrix([1,-3,2])).T, ' detE detF',E.det(),F.det())
print('  [F|E] rref ->', F.row_join(E).rref()[0][:,3:]==S)
V=C((4,6,7),(0,1,1),(0,1,2)); U=C((1,1,1),(1,2,2),(2,3,4)); S2=U.inv()*V
ok(S2==Matrix([[1,-1,-2],[1,1,0],[1,0,1]]) and S2*Matrix([2,3,-4])==Matrix([7,5,-2]) and V*Matrix([2,3,-4])==Matrix([8,11,9]),'sp5_2')
U3=C((1,1,1),(1,2,3),(2,4,5)); ok(U3.inv()==Matrix([[2,-1,0],[1,-3,2],[-1,2,-1]]) and U3.inv()*Matrix([3,2,5])==Matrix([4,7,-4]) and U3.inv()*Matrix([2,3,2])==Matrix([1,-3,2]),'sp5_3 23-24'); print('  detU3',U3.det())
F3=C((1,1,1),(1,1,0),(1,0,0)); ok(F3.det()==-1 and F3.inv()==Matrix([[0,0,1],[0,1,-1],[1,-1,0]]),'sp5_3 22-23')
ok(C((1,2),(2,3)).inv()*Matrix([2,1])==Matrix([-4,3]),'sp5_3 24-25 (-4,3)')
P=Matrix([[1,2,0],[0,1,0],[-1,0,1]]); ok(P.inv()==Matrix([[1,-2,0],[0,1,0],[1,-2,1]]),'sp5_4 P^-1')
V5=C((2,6),(1,4)); S5=Matrix([[4,1],[2,1]]); U5=V5*S5.inv(); ok(U5==C((0,-1),(1,5)) and U5*S5==V5,'sp5_5 u1=(0,-1),u2=(1,5)')
