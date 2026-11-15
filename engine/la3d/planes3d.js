// ℝ³ 里的平面与直线（three.js）：齐次方程 a·x = 0 是过原点的平面，两张平面交出一条直线。
// 风格与 space3d.js 一致：平涂、粗线（LineSegments2）、无光照。平面画成圆片（构成主义圆形母题），
// 边缘一圈粗线；交线、点永远画在最上层（depthTest 关闭），保证被平面挡住时仍然看得见。
// 用法：
//   const P3 = new Planes3D(900, { R: 3 });
//   P3.setPlane(0, [1, 2, -1], { color: C.i, alpha: 0.5, scale: 1 });   // x₁ + 2x₂ − x₃ = 0
//   P3.setLine(0, [-1, 1, 1], { grow: 1, color: C.peri });             // 过原点、方向 (−1,1,1) 的直线
//   P3.setPoint(0, [0, 0, 0], { r: 0.09, color: C.ink });
//   const cv = P3.render({ el: 24, az: -50, dist: 13 }); ctx.drawImage(cv, x, y, 900, 900);
//   P3.project([1, 0, 0]) → 画布像素坐标 [x, y]（在 render 之后调用）
import * as THREE from 'three';
import { LineSegments2 } from 'three/addons/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/addons/lines/LineSegmentsGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { C } from '../style/tokens.js';

const UP = new THREE.Vector3(0, 0, 1);

export class Planes3D {
  constructor(size = 900, { R = 3, nPlanes = 3, nLines = 2, nPoints = 4 } = {}) {
    this.size = size; this.R = R; this.mats = [];
    const r = this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    r.setPixelRatio(1); r.setSize(size, size, false); r.setClearColor(0x000000, 0);
    this.canvas = r.domElement;
    this.scene = new THREE.Scene();
    this.cam = new THREE.PerspectiveCamera(30, 1, 0.1, 200); this.cam.up.set(0, 0, 1);
    // 坐标轴（正半轴实线、负半轴淡）+ 地面网格虚影
    const A = R * 1.25;
    this.axesPos = this.lines([[0, 0, 0], [A, 0, 0], [0, 0, 0], [0, A, 0], [0, 0, 0], [0, 0, A]], C.ink, 3, 0.9);
    this.axesNeg = this.lines([[0, 0, 0], [-A, 0, 0], [0, 0, 0], [0, -A, 0], [0, 0, 0], [0, 0, -A]], C.ink, 2, 0.3);
    const g = []; for (let k = -R; k <= R; k++) { g.push([k, -R, 0], [k, R, 0], [-R, k, 0], [R, k, 0]); }
    this.floor = this.lines(g, C.gridOld, 1.2, 0.14);
    // 平面：圆片 + 圆周粗线
    this.planes = [];
    for (let i = 0; i < nPlanes; i++) {
      const grp = new THREE.Group();
      const mat = new THREE.MeshBasicMaterial({ color: C.i, transparent: true, opacity: 0.4, side: THREE.DoubleSide, depthWrite: false });
      const mesh = new THREE.Mesh(new THREE.CircleGeometry(R, 96), mat); grp.add(mesh);
      const ring = []; const N = 96;
      for (let k = 0; k < N; k++) { const a0 = k / N * Math.PI * 2, a1 = (k + 1) / N * Math.PI * 2; ring.push([R * Math.cos(a0), R * Math.sin(a0), 0], [R * Math.cos(a1), R * Math.sin(a1), 0]); }
      const edge = this.lines(ring, C.i, 3, 1, grp);
      // 圆片上的几条平行线（丝网印刷感，也帮助看出倾斜）
      const hatch = []; for (let k = -R + 0.5; k < R; k += 0.75) { const h = Math.sqrt(Math.max(0, R * R - k * k)); hatch.push([k, -h, 0], [k, h, 0]); }
      const hat = this.lines(hatch, C.i, 1.2, 0.35, grp);
      this.scene.add(grp); this.planes.push({ grp, mesh, mat, edge, hat });
    }
    // 直线
    this.lns = [];
    for (let i = 0; i < nLines; i++) {
      const l = this.lines([[0, 0, 0], [0, 0, 1]], C.peri, 7, 1); l.material.depthTest = false; l.renderOrder = 10; this.lns.push(l);
    }
    // 点
    this.pts = [];
    for (let i = 0; i < nPoints; i++) {
      const m = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), new THREE.MeshBasicMaterial({ color: C.ink, transparent: true, depthTest: false }));
      m.renderOrder = 11; this.scene.add(m); this.pts.push(m);
    }
    this.reset();
  }
  lines(pts, color, width, opacity = 1, parent = this.scene) {
    const g = new LineSegmentsGeometry(); g.setPositions(pts.flat());
    const m = new LineMaterial({ color, linewidth: width, transparent: true, opacity, depthWrite: false });
    m.resolution.set(this.size, this.size); this.mats.push(m);
    const l = new LineSegments2(g, m); parent.add(l); return l;
  }
  /** 每帧开头调用：全部隐藏，场景再按需打开 */
  reset() {
    this.planes.forEach(p => { p.grp.visible = false; });
    this.lns.forEach(l => { l.visible = false; });
    this.pts.forEach(p => { p.visible = false; });
    this.axesA = 1; return this;
  }
  /** 平面 n·x = d（默认 d = 0，过原点）。scale 0..1 圆片从原点长出；tilt 0..1 从水平面转到目标姿态 */
  setPlane(i, n, { color = C.i, alpha = 0.42, scale = 1, tilt = 1, d = 0 } = {}) {
    const p = this.planes[i]; if (alpha <= 0.003 || scale <= 0.003) return this;
    const N = new THREE.Vector3(...n).normalize();
    p.grp.position.copy(N.clone().multiplyScalar(d / Math.hypot(...n)));   // d ≠ 0：平面 n·x = d（第三章「推离原点」）
    const q = new THREE.Quaternion().setFromUnitVectors(UP, N);
    p.grp.quaternion.copy(new THREE.Quaternion().slerp(q, tilt));
    p.grp.scale.setScalar(scale); p.grp.visible = true;
    p.mat.color.set(color); p.mat.opacity = alpha;
    p.edge.material.color.set(color); p.edge.material.opacity = Math.min(1, alpha * 2.2);
    p.hat.material.color.set(color); p.hat.material.opacity = alpha * 0.8;
    return this;
  }
  /** 过点 p0、方向 d 的直线，grow 0..1 从 p0 向两端长出；half 半长 */
  setLine(i, d, { p0 = [0, 0, 0], grow = 1, color = C.peri, alpha = 1, half = null, width = 7 } = {}) {
    const l = this.lns[i]; if (alpha <= 0.003 || grow <= 0.003) return this;
    const u = new THREE.Vector3(...d).normalize().multiplyScalar((half ?? this.R * 1.05) * grow), o = new THREE.Vector3(...p0);
    l.geometry.setPositions([o.x - u.x, o.y - u.y, o.z - u.z, o.x + u.x, o.y + u.y, o.z + u.z]);
    l.material.color.set(color); l.material.opacity = alpha; l.material.linewidth = width; l.visible = true;
    return this;
  }
  setPoint(i, p, { r = 0.09, color = C.ink, alpha = 1 } = {}) {
    const m = this.pts[i]; if (alpha <= 0.003 || r <= 0.001) return this;
    m.position.set(...p); m.scale.setScalar(r); m.material.color.set(color); m.material.opacity = alpha; m.visible = true;
    return this;
  }
  /** 相机（度）。axesA / floorA：坐标轴与地面网格透明度 */
  render({ el = 24, az = -50, dist = 13, target = [0, 0, 0], axesA = 1, floorA = 1 } = {}) {
    const T = new THREE.Vector3(...target), e = el * Math.PI / 180, a = az * Math.PI / 180;
    this.cam.position.set(T.x + dist * Math.cos(e) * Math.cos(a), T.y + dist * Math.cos(e) * Math.sin(a), T.z + dist * Math.sin(e));
    this.cam.lookAt(T); this.cam.updateMatrixWorld();
    this.axesPos.material.opacity = 0.9 * axesA; this.axesNeg.material.opacity = 0.3 * axesA; this.floor.material.opacity = 0.14 * floorA;
    this.axesPos.visible = this.axesNeg.visible = axesA > 0.01; this.floor.visible = floorA > 0.01;
    this.renderer.render(this.scene, this.cam);
    return this.canvas;
  }
  /** 三维点 → 画布像素（0..size），用于在 2D 层贴标签 */
  project(p) {
    const v = new THREE.Vector3(...p).project(this.cam);
    return [(v.x + 1) / 2 * this.size, (1 - v.y) / 2 * this.size];
  }
}
