import sympy as sp
M=sp.Matrix; R=sp.Rational
def p(*a): print(*a)
# 5.1
x=M([3,-2,1]); y=M([4,3,2]); p('ex1', x.dot(y))
x=M([3,4]); y=M([-1,7]); p('ex2 dist', (y-x).norm(), 'cos', sp.simplify(x.dot(y)/(x.norm()*y.norm())))
p('ex4', M([3,2]).dot(M([-4,6])), M([2,-3,1]).dot(M([1,1,1])))
v=M([1,4]); w=M([3,1]); p('ex5', (v.dot(w)/w.dot(w))*w.T)
N=M([1,2,4-1]); 
x=M([1,2,1]); y=M([2,-4,1]); p('ex7 N', x.cross(y).T)
N=M([1,2,2]); v=M([2,0,0]); p('ex8 d', abs(v.dot(N))/N.norm())
x=M([1,1,2,2]); y=M([-2,1,2,0]); pp=(x.dot(y)/y.dot(y))*y; p('TB1 p',pp.T,'x-p',(x-pp).T,'dot',(x-pp).dot(pp),'norms',x.dot(x),pp.dot(pp),(x-pp).dot(x-pp))
# opener example: x=(3,4)... projection 2D for disc  a=(4,1) onto b=(2,3)? choose
# 5.2
A=M([[1,1,2],[0,1,1],[1,3,4]]); p('ex4 rref',A.rref()[0].tolist(),'N',A.nullspace()[0].T,'AT rref',A.T.rref()[0].tolist(),'NAT',A.T.nullspace()[0].T)
p('floorwall', M([1,1,0]).dot(M([0,1,1])))
# 5.3
A=M([[1,1],[-2,3],[2,-1]]); b=M([3,1,2]); AtA=A.T*A; Atb=A.T*b; xh=AtA.solve(Atb); p('ls ex1',AtA.tolist(),Atb.T,xh.T,'p',(A*xh).T,'r',(b-A*xh).T,'Atr',(A.T*(b-A*xh)).T)
A=M([[1,0],[1,3],[1,6]]); yv=M([1,4,5]); c=(A.T*A).solve(A.T*yv); p('ex2',(A.T*A).tolist(),(A.T*yv).T,c.T,'res',(yv-A*c).T, (yv-A*c).dot(yv-A*c))
A=M([[1,0,0],[1,1,1],[1,2,4],[1,3,9]]); yv=M([3,2,4,4]); c=(A.T*A).solve(A.T*yv); p('ex3',(A.T*A).tolist(),(A.T*yv).T,c.T)
A=M([[1,-1],[1,1],[1,2]]); yv=M([1,3,3]); c=(A.T*A).solve(A.T*yv); p('TB7',(A.T*A).tolist(),(A.T*yv).T,c.T)
# 5.4
A=M([[1,1],[1,2],[3,3]]); B=M([[-1,1],[3,0],[-3,4]]); p('ex3 <A,B>',sum(A[i]*B[i] for i in range(6)), sp.sqrt(sum(a**2 for a in A)), sp.sqrt(sum(a**2 for a in B)))
X=sp.Symbol('x'); p('ex1',sp.integrate(X,(X,-1,1)),sp.integrate(1,(X,-1,1)),sp.integrate(X**2,(X,-1,1)),sp.integrate((1+X)**2,(X,-1,1)))
p('ex2',sp.integrate(sp.cos(X)*sp.sin(X),(X,-sp.pi,sp.pi))/sp.pi,sp.integrate(sp.cos(X)**2,(X,-sp.pi,sp.pi))/sp.pi)
x=M([4,-5,3]); p('ex5 norms',sum(abs(t) for t in x),x.norm(),max(abs(t) for t in x))
# 5.5
v1,v2,v3=M([1,1,1]),M([2,1,-3]),M([4,-5,1]); p('ex1',v1.dot(v2),v1.dot(v3),v2.dot(v3),v1.norm(),v2.norm(),v3.norm())
vv=M([3,4,5]); p('coord of (3,4,5)?',[sp.nsimplify(vv.dot(u)/u.dot(u)) for u in (v1,v2,v3)])
p('ex5 sin4',sp.integrate(sp.sin(X)**4,(X,-sp.pi,sp.pi)))
p('TB8', 2*3+(-2)*1+1*(-4), sp.sqrt(4+4+1))
th=sp.Symbol('t'); Q=M([[sp.cos(th),-sp.sin(th)],[sp.sin(th),sp.cos(th)]]); p('rot',sp.simplify(Q.T*Q))
U=M([[1,0],[0,1],[0,0]]); p('ex7',(U*U.T*M([5,3,4])).T)
# 5.6
A=M([[1,-1,4],[1,4,-2],[1,4,2],[1,-1,0]]); Qg,Rg=A.QRdecomposition(); p('GS ex2 Q',Qg.tolist(),'R',Rg.tolist())
A=M([[1,-2,-1],[2,0,1],[2,-4,2],[4,0,0]]); Qg,Rg=A.QRdecomposition(); p('ex3 Q',(5*Qg).tolist(),'R',Rg.tolist()); b=M([-1,1,1,-2]); qb=Qg.T*b; p('ex4 Qtb',qb.T,'x',Rg.solve(qb).T, 'normal', (A.T*A).solve(A.T*b).T)
# Tongji
a1,a2,a3=M([1,2,-1]),M([-1,3,1]),M([4,-1,0])
b1=a1; b2=a2-(a2.dot(b1)/b1.dot(b1))*b1; b3=a3-(a3.dot(b1)/b1.dot(b1))*b1-(a3.dot(b2)/b2.dot(b2))*b2
p('TJ b',b1.T,b2.T,b3.T,'coefs',a2.dot(b1)/b1.dot(b1),a3.dot(b1)/b1.dot(b1),a3.dot(b2)/b2.dot(b2))
p('TJ e',(b1/b1.norm()).T,(b2/b2.norm()).T,(b3/b3.norm()).T)
p('TJ ex3', M([[1,1,1]]).nullspace())
# TB10
A=M([[1,-3,-5],[1,1,-2],[1,-3,1],[1,1,4]]); b=M([-6,1,1,6]); Qg,Rg=A.QRdecomposition(); p('TB10 Q',(2*Qg).tolist(),'R',Rg.tolist(),'x',Rg.solve(Qg.T*b).T)
# TB6
x1,x2=M([1,0,2]),M([0,1,-2]); n=x1.cross(x2); p('TB6 n',n.T, 'P', (n*n.T/n.dot(n)).tolist())
# TB12  u1=1/sqrt2, u2=sqrt6/2 x ; h=x^(1/3)+x^(2/3)  -- on [-1,1] real cube root
h=sp.sign(X)*sp.Abs(X)**R(1,3)+sp.Abs(X)**R(2,3)
u1=1/sp.sqrt(2); u2=sp.sqrt(6)/2*X
c1=sp.integrate(h*u1,(X,-1,1)); c2=sp.integrate(h*u2,(X,-1,1)); p('TB12',sp.simplify(c1),sp.simplify(c2),sp.expand(c1*u1+c2*u2))
