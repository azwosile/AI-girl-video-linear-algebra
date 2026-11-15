from sympy import *
M=Matrix
def p(*a): print(*a)
a,b,al,be,t,x=symbols('a b alpha beta t x')
# ---- A 方程组
A=M([[1,1,3],[1,2,4],[1,3,a]]); bb=M([2,3,b])
p('18-19Q1 rref aug', M.hstack(A,bb).echelon_form(), 'det',A.det())
for av in [5]:
    for bv in [4,0]:
        p(' a=5 b=',bv, M.hstack(A.subs(a,5),bb.subs(b,bv)).rref()[0].tolist())
A=M([[1,2,1],[-1,4,3],[2,-2,al]]); bb=M([1,2,be])
p('24-25Q2 det',factor(A.det()), M.hstack(A,bb).subs(al,A.det().as_poly(al).all_roots()[0] if False else solve(A.det(),al)[0]).echelon_form())
p(' sol al', solve(A.det(),al))
Aa=A.subs(al,solve(A.det(),al)[0]); p(' aug ref', M.hstack(Aa,bb).echelon_form())
A=M([[1,2,1],[1,al,3],[2,-2,0]]); p('25-26Q2 det', factor(A.det()))
B=M([[1,-1,0,-2],[0,1,0,1],[0,0,1,-1]]); p('17-18 1(i) N', B.nullspace())
# ---- B 矩阵
A=M([[3,1],[5,2]]);B=M([[1,2],[3,4]]); p('20-21Q2 X',A.inv()*B,' Y',B*(A-eye(2)).inv())
P=M([[0,0,1,0,0],[0,1,0,0,0],[1,0,0,0,0],[0,0,0,0,1],[0,0,0,1,0]]); p('24-25Q3 det',P.det(), P.inv()==P)
A=M([[2,1,1],[6,4,5],[4,1,3]]);B=M([[3,0,-1],[0,1,0],[0,0,0]])
L,U,_=A.LUdecomposition(); p('24-25Q5 L',L,'U',U,'X',A.inv()*B,'rankB',B.rank(), B.columnspace())
A=M([[1,0,1],[3,3,4],[2,2,3]]); L,U,_=A.LUdecomposition(); p('18-19Q2 L',L,'U',U,'inv',A.inv(),'x',A.inv()*M([-2,1,0]))
E1=M([[1,0,0],[-2,1,0],[0,0,1]]);E2=M([[1,0,0],[0,1,0],[0,3,1]]); p('17-18 1(ii) L',(E2*E1).inv())
A=M([[1,1,1],[3,5,6],[-2,2,7]]); L,U,_=A.LUdecomposition(); p('20-21Q3 L',L,'U',U,'inv',A.inv(),'det',A.det())
A=M([[-2,1,2],[4,1,-2],[-6,-3,4]]); L,U,_=A.LUdecomposition(); p('21-22Q4 L',L,'U',U,'inv',A.inv())
A=M([[1,0,1],[-1,1,1],[-1,-2,-4]]); L,U,_=A.LUdecomposition(); p('25-26Q3 L',L,'U',U)
# ---- D 行列式
A=M([[0,1,2,3],[1,1,1,1],[-2,-2,3,3],[1,2,-2,-3]]); B1=M([[0,1,2,3],[-2,-2,3,3],[1,2,-2,-3],[1,1,1,1]]); B2=M([[0,1,2,3],[1,1,1,1],[-1,-1,4,4],[2,3,-1,-2]])
p('17-18Q4 detA',A.det(),'detB',(B1+B2).det(), 'B1',B1.det(),'B2',B2.det())
A=M([[0,2,3,0],[0,4,5,0],[0,1,0,3],[2,0,1,3]]); C=A.adjugate().T
p('18-19Q5 det',A.det(),'det adj',A.adjugate().det(),'A11+A21-A31+2A41',C[0,0]+C[1,0]-C[2,0]+2*C[3,0])
V=M([[1,1,1,1],[1,2,4,8],[1,3,9,27],[1,-1,1,-1]]); C=V.adjugate().T
p('20-21Q4 det',V.det(),'A32+A33+A34',C[2,1]+C[2,2]+C[2,3], ' 21-22: ',C[2,0]+2*C[2,1]+3*C[2,2]+4*C[2,3])
A=M([[1,1,1],[2,-1,0],[1,0,1]]);B=M([[1,0,0],[2,1,0],[0,2,1]]); p('21-22Q3',(A*B+eye(3)).det())
A=M([[1,-2,2],[-2,-2,4],[2,4,-2]]); C=A.adjugate().T; p('24-25 1(2)',C[1,0]+C[1,1]+2*C[1,2],' det A',A.det(),' det(A-2I)',(A-2*eye(3)).det(), 'eig',A.eigenvals())
p(' 1(3) det(-2A^-1) with detA=2:', (-2)**3/Rational(2))
p('23-24 1(1) |A adjA| n=4:',2**4,'  22-23 n=3:',2**3)
A=M([[2,2,1],[2,3,5],[2,5,3]]); p('23-24Q7',A.det())
# ---- E/F 空间
p('25-26Q6: p=a0+a1x+a2x2+a3x3 ∫: a0+a1/2+a2/3+a3/4=0 basis', [x-Rational(1,2), x**2-Rational(1,3), x**3-Rational(1,4)])
for c in [(x,x+2,x**2),(-x,x+1,x**2),(1-x**2,x+2,x**2),(x+2,x-4,x**2-2*x+3),(x+2,x+1,x**2-1)]:
    Mc=M([[Poly(q,x).coeff_monomial(x**k) for k in range(3)] for q in c]).T; p(' P3',c,'det',Mc.det())
p('15-16Q2 rank',M([[1,0,1,1],[0,1,0,2],[0,1,1,3]]).rank(), M([[1,0,1,1],[0,1,0,2],[0,1,1,3]]).nullspace())
X=M([[2,3,2],[1,-1,6],[3,4,4]]); p('17-18Q6 det',X.det(),'null',X.nullspace(),'normal',M([2,1,3]).cross(M([3,-1,4])))
V4=M([[1,2,1,2],[1,-1,-1,1],[2,-5,-4,1],[4,2,0,6]]); p('18-19Q9 rank',V4.rank(),V4.nullspace())
W=wronskian([1,exp(x),exp(2*x),exp(3*x)],x); p('18-19Q8 W(0)',simplify(W.subs(x,0)), ' W(1..x^4)', wronskian([1,x,x**2,x**3,x**4],x))
p(' 1,sin,cos W', simplify(wronskian([1,sin(x),cos(x)],x)), ' e^x,e^-x', simplify(wronskian([exp(x),exp(-x)],x)))
A=M([[1,1,2],[2,1,1],[-1,0,1],[0,2,a]]); p('20-21Q6 ref',A.echelon_form(), solve(A.echelon_form()[2:,2],a))
# ---- G 过渡
E=M([[1,2,1],[1,3,5],[1,2,4]]);F=M([[1,1,1],[1,2,2],[0,0,1]]); S=F.inv()*E
p('25-26Q5 S=F^-1E',S,'x_F',S*M([3,2,-1]),'y_F',S*M([1,-3,2]))
V=M([[4,0,0],[6,1,1],[7,1,2]]);U=M([[1,1,2],[1,2,3],[1,2,4]]); S=U.inv()*V; p('17-18Q7 S',S,'x_u',S*M([2,3,-4]))
U=M([[1,1,2],[1,2,4],[1,3,5]]); p('23-24Q3 U^-1',U.inv(),'c1',U.inv()*M([3,2,5]),'c2',U.inv()*M([2,3,2]))
Q=M([[1,2,0],[0,1,0],[-1,0,1]]); p('24-25Q6 P=[new in std] cols',Q,'det',Q.det(),'S={1,x,x2}->new = P^-1',Q.inv())
p('24-25 1(6)',M([[1,2],[2,3]]).inv()*M([2,1]))
V=M([[2,1],[6,4]]);S=M([[4,1],[2,1]]); p('15-16Q3 U=V S^-1',V*S.inv())
F=M([[1,1,1],[1,1,0],[1,0,0]]); p('22-23Q3 det',F.det(),'S(e->F)=F^-1',F.inv())
V=M([[1,1,0],[0,1,1],[1,0,1]]);U=M([[2,1,2],[3,2,0],[1,0,3]]); p('20-21Q5 U^-1V',U.inv()*V,' V^-1U',V.inv()*U)
# ---- H RREF 反推
a1=M([1,-1,-2,0]);a3=M([1,0,0,1]);a5=M([1,1,3,3]); p('24-25Q4 a2=a1',a1.T,'a4=a3',a3.T,'b=4a1-6a3+3a5',(4*a1-6*a3+3*a5).T)
R=M([[1,1,0,0,0],[0,0,1,1,0],[0,0,0,0,1]]); p(' N',R.nullspace())
A=M([[1,3,3,2],[2,6,9,7],[-1,-3,3,4]]); bb=M([7,20,5]); p('25-26Q4 rref aug',M.hstack(A,bb).rref()[0], 'N',A.nullspace(),'NAT',A.T.nullspace())
a1=M([-1,3,2]);a2=M([1,1,-1]);a3=M([-1,-1,-2]); A=M.hstack(a1,a2,a3,-a1+a2-a3); p('20-21Q7 a4',(-a1+a2-a3).T,'b',(A*M([1,1,2,0])).T,'N',M([[1,0,0,-1],[0,1,0,1],[0,0,1,-1]]).nullspace(), 'rref chk',A.rref()[0])
a1=M([2,1,-3,2]);a2=M([-1,2,3,1]); U=M([[1,0,2,0,-1],[0,1,3,0,-2],[0,0,0,1,5],[0,0,0,0,0]])
x0=M([3,2,0,2,0]); bb=M([0,5,3,4]); a4=(bb-3*a1-2*a2)/2; a3=2*a1+3*a2; a5=-a1-2*a2+5*a4
A=M.hstack(a1,a2,a3,a4,a5); p('17-18Q8 a3',a3.T,'a4',a4.T,'a5',a5.T,'rref ok',A.rref()[0]==U,'N',U.nullspace())
U=M([[1,0,2,1],[0,1,1,4],[0,0,0,0],[0,0,0,0]]);a1=M([-1,5,2,1]);a2=M([4,-3,7,-1]); p('22-23Q2 a3',(2*a1+a2).T,'a4',(a1+4*a2).T,'N',U.nullspace())
A=M([[1,-1,4,2],[-2,-4,7,5]]); p('23-24Q2 N(A)',A.nullspace()); B=M([[1,2,-4],[2,1,-1],[-1,1,-3]]); p(' N(B)',B.nullspace())
A=M([[4,-2],[1,3],[2,1],[3,4]]); p('15-16Q6 rank',A.rank(),'NAT',A.T.nullspace())
A=M([[3,4],[6,8]]); p('22-23 1(2) ker',A.nullspace(),'range',A.columnspace())
A=M([[3,-1,-2],[2,0,-2],[2,-1,-1]]);V=M([[1,1,0],[1,2,-2],[1,0,1]]); p('15-16Q4 B=V^-1AV',V.inv()*A*V)
