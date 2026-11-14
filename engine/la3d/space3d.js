// 3D 线性变换空间（three.js）。离屏 WebGL 画布，每帧由 renderAt(t) 驱动后合成到主 Canvas。
// 数学坐标 z 向上。风格：平涂三色、粗线（LineSegments2），不用光照。
import * as THREE from 'three';
import { LineSegments2 } from 'three/addons/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/addons/lines/LineSegmentsGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { C } from '../style/tokens.js';

const m4 = M => new THREE.Matrix4().set(M[0][0], M[0][1], M[0][2], 0, M[1][0], M[1][1], M[1][2], 0, M[2][0], M[2][1], M[2][2], 0, 0, 0, 0, 1);

export class Space3D {
  constructor(size = 900, { R = 4 } = {}) {
    this.size = size; this.R = R;
    const r = this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    r.setPixelRatio(1); r.setSize(size, size, false); r.setClearColor(0x000000, 0);
    this.canvas = r.domElement;
    this.scene = new THREE.Scene();
    this.cam = new THREE.PerspectiveCamera(30, 1, 0.1, 200); this.cam.up.set(0, 0, 1);
    this.mats = [];
    // 网格：xy 平面整数线（变换后）+ 原始虚影
    const segs = [];
    for (let k = -R; k <= R; k++) { if (k) segs.push([k, -R, 0], [k, R, 0], [-R, k, 0], [R, k, 0]); }
    this.gridSrc = segs;
    this.grid = this.lines(segs, C.gridNew, 2.0, 0.85); this.ghost = this.lines(segs, C.gridOld, 1.2, 0.22);
    // 竖直方向的格线（x=k 平面与 z 轴方向），只画边框柱，暗示空间
    this.axes = this.lines([[-R, 0, 0], [R, 0, 0], [0, -R, 0], [0, R, 0], [0, 0, -0.01], [0, 0, R * 0.8]], C.ink, 3);
    // 单位立方体
    const cube = new THREE.Group(); cube.matrixAutoUpdate = false; this.cube = cube;
    const tones = [C.peri, C.periLt, C.mist];
    const faces = [ // [法向轴, 位置, 色调]
      ['x', 1, 1], ['x', 0, 1], ['y', 1, 2], ['y', 0, 2], ['z', 1, 0], ['z', 0, 0]];
    this.faceMats = [];
    for (const [ax, pos, tone] of faces) {
      const g = new THREE.PlaneGeometry(1, 1); const mat = new THREE.MeshBasicMaterial({ color: tones[tone], transparent: true, opacity: 0.78, side: THREE.DoubleSide, depthWrite: false });
      const mat2 = mat; const m = new THREE.Mesh(g, mat2);
      if (ax === 'x') { m.rotation.y = Math.PI / 2; m.position.set(pos, 0.5, 0.5); }
      if (ax === 'y') { m.rotation.x = Math.PI / 2; m.position.set(0.5, pos, 0.5); }
      if (ax === 'z') { m.position.set(0.5, 0.5, pos); }
      cube.add(m); this.faceMats.push(mat);
    }
    const E = []; for (const a of [0, 1]) for (const b of [0, 1]) { E.push([0, a, b], [1, a, b], [a, 0, b], [a, 1, b], [a, b, 0], [a, b, 1]); }
    this.cubeEdges = this.lines(E, C.ink, 2.5, 1, cube);
    this.scene.add(cube);
    // 基向量箭头
    this.arrows = [C.i, C.j, C.k].map(col => this.arrow(col));
  }
  lines(pts, color, width, opacity = 1, parent = this.scene) {
    const g = new LineSegmentsGeometry(); g.setPositions(pts.flat());
    const m = new LineMaterial({ color, linewidth: width, transparent: opacity < 1, opacity, depthWrite: opacity >= 1 });
    m.resolution.set(this.size, this.size); this.mats.push(m);
    const l = new LineSegments2(g, m); parent.add(l); return l;
  }
  arrow(color) {
    const g = new THREE.Group();
    const shaft = this.lines([[0, 0, 0], [0, 1, 0]], color, 8, 1, g);
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.24, 24), new THREE.MeshBasicMaterial({ color }));
    g.add(cone); this.scene.add(g); return { g, shaft, cone };
  }
  setArrow(a, v, alpha = 1) {
    const d = new THREE.Vector3(...v), L = d.length(); a.g.visible = alpha > 0.01 && L > 0.05; if (!a.g.visible) return;
    const u = d.clone().normalize(), base = u.clone().multiplyScalar(Math.max(0, L - 0.22));
    a.shaft.geometry.setPositions([0, 0, 0, base.x, base.y, base.z]);
    a.cone.position.copy(u.clone().multiplyScalar(L - 0.12));
    a.cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), u);
  }
  /** M 3×3；cam {el, az, dist}（度）；opt：alpha 各部分 */
  render({ M, el = 30, az = -60, dist = 14, target = [0.4, 0.4, 0.5], cubeA = 1, gridA = 1, arrowGrow = 1 }) {
    const T = new THREE.Vector3(...target), e = el * Math.PI / 180, a = az * Math.PI / 180;
    this.cam.position.set(T.x + dist * Math.cos(e) * Math.cos(a), T.y + dist * Math.cos(e) * Math.sin(a), T.z + dist * Math.sin(e));
    this.cam.lookAt(T);
    const ap = p => [M[0][0] * p[0] + M[0][1] * p[1] + M[0][2] * p[2], M[1][0] * p[0] + M[1][1] * p[1] + M[1][2] * p[2], M[2][0] * p[0] + M[2][1] * p[1] + M[2][2] * p[2]];
    this.grid.geometry.setPositions(this.gridSrc.map(ap).flat()); this.grid.material.opacity = 0.85 * gridA; this.grid.material.transparent = true;
    this.ghost.material.opacity = 0.22 * gridA;
    this.cube.matrix.copy(m4(M)); this.cube.matrixWorldNeedsUpdate = true; this.cube.visible = cubeA > 0.01;
    this.faceMats.forEach(m => m.opacity = 0.62 * cubeA); this.cubeEdges.material.opacity = cubeA; this.cubeEdges.material.transparent = cubeA < 1;
    [[1, 0, 0], [0, 1, 0], [0, 0, 1]].forEach((b, i) => this.setArrow(this.arrows[i], ap(b).map(x => x * arrowGrow), arrowGrow));
    this.renderer.render(this.scene, this.cam);
    return this.canvas;
  }
}
