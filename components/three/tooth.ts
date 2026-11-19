import * as THREE from "three";
import { MarchingCubes } from "three/examples/jsm/objects/MarchingCubes.js";

/**
 * Procedurele kies (molaar): signed distance field → marching cubes → compacte BufferGeometry.
 * Geen modelbestand nodig (0 KB download). Illustratief, niet anatomisch exact.
 */

type V = [number, number, number];
const len = (x: number, y: number, z: number) => Math.sqrt(x * x + y * y + z * z);
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/** Smooth union (polynomial smin) */
function smin(a: number, b: number, k: number) {
  const h = clamp(0.5 + (0.5 * (b - a)) / k, 0, 1);
  return mix(b, a, h) - k * h * (1 - h);
}
/** Smooth subtraction: a minus b */
function ssub(a: number, b: number, k: number) {
  const h = clamp(0.5 - (0.5 * (a + b)) / k, 0, 1);
  return mix(a, -b, h) + k * h * (1 - h);
}
function sdRoundBox(px: number, py: number, pz: number, b: V, r: number) {
  const qx = Math.abs(px) - b[0];
  const qy = Math.abs(py) - b[1];
  const qz = Math.abs(pz) - b[2];
  return len(Math.max(qx, 0), Math.max(qy, 0), Math.max(qz, 0)) + Math.min(Math.max(qx, Math.max(qy, qz)), 0) - r;
}
function sdSphere(px: number, py: number, pz: number, c: V, r: number) {
  return len(px - c[0], py - c[1], pz - c[2]) - r;
}
/** Tapered capsule (iq sdRoundCone, arbitrary endpoints) */
function sdRoundCone(px: number, py: number, pz: number, a: V, b: V, r1: number, r2: number) {
  const bax = b[0] - a[0], bay = b[1] - a[1], baz = b[2] - a[2];
  const l2 = bax * bax + bay * bay + baz * baz;
  const rr = r1 - r2;
  const a2 = l2 - rr * rr;
  const il2 = 1 / l2;
  const pax = px - a[0], pay = py - a[1], paz = pz - a[2];
  const y = pax * bax + pay * bay + paz * baz;
  const z = y - l2;
  const xx = pax * l2 - bax * y, xy = pay * l2 - bay * y, xz = paz * l2 - baz * y;
  const x2 = xx * xx + xy * xy + xz * xz;
  const y2 = y * y * l2;
  const z2 = z * z * l2;
  const k = Math.sign(rr) * rr * rr * x2;
  if (Math.sign(z) * a2 * z2 > k) return Math.sqrt(x2 + z2) * il2 - r2;
  if (Math.sign(y) * a2 * y2 < k) return Math.sqrt(x2 + y2) * il2 - r1;
  return (Math.sqrt(x2 * a2 * il2) + y * rr) * il2 - r1;
}

export function toothSDF(x: number, y: number, z: number) {
  // Kroon: afgeronde, licht bolle vorm (smaller richting de hals)
  const taper = 1 - 0.18 * clamp((0.25 - y) / 0.4, 0, 1);
  let d = sdRoundBox(x / taper, y - 0.27, z / taper, [0.24, 0.12, 0.2], 0.17) * taper;
  // Vier knobbels
  const cusps: V[] = [
    [-0.17, 0.48, -0.14],
    [0.17, 0.48, -0.14],
    [-0.17, 0.46, 0.15],
    [0.17, 0.47, 0.15],
  ];
  for (const c of cusps) d = smin(d, sdSphere(x, y, z, c, 0.15), 0.12);
  // Centrale groeve en fissuren
  d = ssub(d, sdSphere(x, y, z, [0, 0.66, 0], 0.13), 0.08);
  d = ssub(d, sdRoundBox(x, y - 0.62, z, [0.02, 0.05, 0.3], 0.03), 0.05);
  // Hals
  d = smin(d, sdRoundCone(x, y, z, [0, 0.12, 0], [0, -0.08, 0], 0.32, 0.27), 0.1);
  // Twee wortels, licht naar buiten gebogen
  const r1 = sdRoundCone(x, y, z, [-0.16, -0.02, 0.0], [-0.24, -0.78, 0.03], 0.16, 0.045);
  const r2 = sdRoundCone(x, y, z, [0.16, -0.02, 0.0], [0.22, -0.8, -0.03], 0.16, 0.045);
  d = smin(d, smin(r1, r2, 0.05), 0.14);
  return d;
}

export function buildToothGeometry(resolution = 72) {
  const mat = new THREE.MeshBasicMaterial();
  const mc = new MarchingCubes(resolution, mat, false, false, 90000);
  mc.reset();
  const s = mc.size;
  const h = s / 2;
  const scale = 1.18; // marge binnen de rand van het veld
  for (let k = 0; k < s; k++) {
    const fz = ((k - h) / h) * scale;
    for (let j = 0; j < s; j++) {
      const fy = ((j - h) / h) * scale;
      for (let i = 0; i < s; i++) {
        const fx = ((i - h) / h) * scale;
        mc.field[i + j * s + k * s * s] = mc.isolation - toothSDF(fx, fy, fz) * 600;
      }
    }
  }
  mc.update();
  const n = mc.count;
  const src = mc.geometry;
  const pos = (src.getAttribute("position").array as Float32Array).slice(0, n * 3);
  const nor = (src.getAttribute("normal").array as Float32Array).slice(0, n * 3);
  for (let i = 0; i < nor.length; i += 3) {
    const l = Math.hypot(nor[i], nor[i + 1], nor[i + 2]) || 1;
    nor[i] /= l;
    nor[i + 1] /= l;
    nor[i + 2] /= l;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("normal", new THREE.BufferAttribute(nor, 3));
  g.scale(scale, scale, scale);
  src.dispose();
  mat.dispose();
  g.computeBoundingSphere();
  return g;
}
