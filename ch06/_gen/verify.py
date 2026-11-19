import sympy as sp
M=sp.Matrix; R=sp.Rational; l=sp.Symbol('lambda'); t=sp.Symbol('t')
def p(*a): print(*a)
def eig(A,name):
    A=M(A); cp=sp.factor((A-l*sp.eye(A.rows)).det()); p(name,'charpoly',cp,'evs',A.eigenvects())
# 6.1
A=M([[R(7,10),R(2,10)],[R(3,10),R(8,10)]]); w=M([8000,2000]); p('marr w1',(A*w).T,'w10',[round(x) for x in (A**10*w)],'Ax1',(A*M([2,3])).T,'Ax2',(A*M([-1,1])).T)
p('w0 decomposition', M([[2,-1],[3,1]]).solve(w).T)
eig([[4,-2],[1,1]],'ex2'); eig([[3,2],[3,-2]],'ex3'); eig([[2,-3,1],[1,-2,1],[1,-3,2]],'ex4'); eig([[1,2],[-2,1]],'ex5'); eig([[5,-18],[1,-1]],'ex6')
S=M([[5,3],[3,2]]); T=M([[2,1],[0,3]]); A=S.inv()*T*S; p('ex7 A',A.tolist()); eig(A,'ex7')
eig([[2,1],[1,2]],'opener 2x2 sym')
# 6.2
A=M([[3,4],[3,2]]); eig(A,'6.2 ex1'); X=M([[4,1],[3,-1]]); c=X.solve(M([6,1])); p('IVP c',c.T)
Y=c[0]*sp.exp(6*t)*M([4,3])+c[1]*sp.exp(-t)*M([1,-1]); p('Y',Y.T,'check',sp.simplify(Y.diff(t)-A*Y).T,Y.subs(t,0).T)
eig([[1,1],[-2,3]],'6.2 ex2')
# 6.3
eig([[2,-3],[2,-5]],'6.3 ex1'); X=M([[3,1],[1,2]]); D=sp.diag(1,-4); A=M([[2,-3],[2,-5]]); p('XDXinv',(X*D*X.inv()).tolist(),'Xinv',X.inv().tolist(),'A^5',(A**5).tolist(),(X*D**5*X.inv()).tolist())
eig([[3,-1,-2],[2,0,-2],[2,-1,-1]],'6.3 ex2')
eig([[1,1],[0,1]],'ex3 shear'); eig([[2,0,0],[0,4,0],[1,0,2]],'ex4 A'); eig([[2,0,0],[-1,4,0],[-3,6,2]],'ex4 B')
# Markov marriage
A=M([[R(7,10),R(2,10)],[R(3,10),R(8,10)]]); eig(A,'markov'); 
# matrix exp
A=M([[-2,-6],[1,3]]); eig(A,'ex6 expA'); p('expA',sp.simplify(A.exp()).tolist())
A=M([[3,4],[3,2]]); p('etA Y0',sp.simplify((A*t).exp()*M([6,1])).T)
# 6.4
A=M([[0,2,-1],[2,3,-2],[-1,-2,0]]); eig(A,'6.4 ex4'); U=M([[1/sp.sqrt(2),-1/sp.sqrt(3),-1/sp.sqrt(6)],[0,1/sp.sqrt(3),-2/sp.sqrt(6)],[1/sp.sqrt(2),1/sp.sqrt(3),1/sp.sqrt(6)]]); p('UtAU',sp.simplify(U.T*A*U).tolist(),'UtU',sp.simplify(U.T*U).tolist())
H=M([[2,1-sp.I],[1+sp.I,3]]); p('herm', H.eigenvals(), H.eigenvects())
# 6.5
A=M([[1,1],[1,1],[0,0]]); p('svd AtA',(A.T*A).tolist(), (A.T*A).eigenvals())
U=M([[1/sp.sqrt(2),1/sp.sqrt(2),0],[1/sp.sqrt(2),-1/sp.sqrt(2),0],[0,0,1]]); S=M([[2,0],[0,0],[0,0]]); V=M([[1,1],[1,-1]])/sp.sqrt(2); p('USVt',sp.simplify(U*S*V.T).tolist())
A=M([[3,0],[4,5]]); p('2x2 svd AtA',(A.T*A).tolist(),(A.T*A).eigenvects(), 'sig', [sp.sqrt(v) for v in (A.T*A).eigenvals()])
v1=M([1,1])/sp.sqrt(2); v2=M([-1,1])/sp.sqrt(2); p('Av1',(A*v1).T,'Av2',(A*v2).T, (A*v1).norm(), (A*v2).norm())
# 6.6
A=M([[3,1],[1,3]]); eig(A,'conic 3x2+2xy+3y2=8')
A=M([[2,-2],[-2,5]]); eig(A,'q 2x2-4xy+5y2')
# Hessian test B6
x,y=sp.symbols('x y'); f=x**3*y+x**2+y**2-2*x-y+4; Hs=sp.hessian(f,(x,y)).subs({x:1,y:0}); p('grad',[sp.diff(f,v).subs({x:1,y:0}) for v in (x,y)],'H',Hs.tolist(),Hs.eigenvals(), Hs.det())
# 6.7
A=M([[4,2,-2],[2,10,2],[-2,2,5]]); p('pd minors',[A[:k,:k].det() for k in (1,2,3)], A.eigenvals()); Lm,U,_=A.LUdecomposition(); p('L',Lm.tolist(),'U',U.tolist()); Lc=A.cholesky(); p('chol',Lc.tolist())
A=M([[4,2,2],[2,10,10],[2,10,14]]); p('TB5 minors',[A[:k,:k].det() for k in (1,2,3)]); Lm,U,_=A.LUdecomposition(); p('L',Lm.tolist(),'U',U.tolist(), 'chol', A.cholesky().tolist())
# Test B1
A=M([[1,0,0],[1,1,-1],[1,2,-2]]); eig(A,'TB1'); P_,D_=A.diagonalize(); p('P',P_.tolist(),'D',D_.tolist(),'A7',(A**7).tolist())
# TB7
A=M([[1,-2],[3,-4]]); eig(A,'TB7'); p('etA Y0', sp.simplify((A*t).exp()*M([1,2])).T)
# Tongji
eig([[-1,1,0],[-4,3,0],[1,0,2]],'TJ ex6 defective'); eig([[-2,1,1],[0,2,0],[-4,1,3]],'TJ ex7'); eig([[0,-1,1],[-1,0,1],[1,1,0]],'TJ sym')
A=M([[0,-1,1],[-1,0,1],[1,1,0]]); P_,D_=A.diagonalize(); p(P_.tolist(),D_.tolist())
f=M([[5,2,-4],[2,1,-2],[-4,-2,5]]); p('TJ posdef minors',[f[:k,:k].det() for k in (1,2,3)])
g=M([[-5,2,2],[2,-6,0],[2,0,-4]]); p('TJ negdef minors',[g[:k,:k].det() for k in (1,2,3)], g.eigenvals())
# param posdef: f = x1^2 + x2^2 +5x3^2 + 2a x1x2 -2x1x3 +4x2x3
a=sp.Symbol('a'); Am=M([[1,a,-1],[a,1,2],[-1,2,5]]); p('param minors',[sp.factor(Am[:k,:k].det()) for k in (1,2,3)], sp.solve(Am.det(),a))
