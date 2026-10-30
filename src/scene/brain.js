// Procedural brain: silhouette outline, coral-style cortex folds and neuron graph.
// Everything lives in unit space (x: -1..1 across the brain, y down), so the
// scene can scale it to any size.

const TAU = Math.PI * 2

export function mulberry32(a) {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Side view, facing right: cerebrum, cerebellum bump and brain stem.
const CONTROL_POINTS = [
  [-0.99, 0.02], [-0.93, -0.3], [-0.72, -0.58], [-0.38, -0.74],
  [0.02, -0.78], [0.42, -0.72], [0.78, -0.5], [0.97, -0.18],
  [0.99, 0.12], [0.88, 0.3], [0.66, 0.35], [0.5, 0.46],
  [0.28, 0.46], [0.16, 0.38], [0.15, 0.6], [0.2, 0.88],
  [0.04, 0.9], [-0.06, 0.6], [-0.12, 0.5], [-0.32, 0.64],
  [-0.58, 0.62], [-0.72, 0.46], [-0.8, 0.28], [-0.94, 0.2],
]

function catmullClosed(pts, seg) {
  const out = []
  const n = pts.length
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n]
    const p1 = pts[i]
    const p2 = pts[(i + 1) % n]
    const p3 = pts[(i + 2) % n]
    for (let j = 0; j < seg; j++) {
      const t = j / seg
      const t2 = t * t
      const t3 = t2 * t
      const f = (k) =>
        0.5 *
        (2 * p1[k] +
          (-p0[k] + p2[k]) * t +
          (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 +
          (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3)
      out.push([f(0), f(1)])
    }
  }
  return out
}

function buildOutline() {
  const base = catmullClosed(CONTROL_POINTS, 14)
  const n = base.length
  // Gentle cortex bumps along the outward normal.
  return base.map((p, i) => {
    const a = base[(i - 1 + n) % n]
    const b = base[(i + 1) % n]
    let nx = b[1] - a[1]
    let ny = -(b[0] - a[0])
    const l = Math.hypot(nx, ny) || 1
    nx /= l
    ny /= l
    const bump = 0.016 * Math.sin((i / n) * TAU * 13) + 0.008 * Math.sin((i / n) * TAU * 29)
    return [p[0] + nx * bump, p[1] + ny * bump]
  })
}

export const OUTLINE = buildOutline()

export function inside(poly, x, y) {
  let c = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0]
    const yi = poly[i][1]
    const xj = poly[j][0]
    const yj = poly[j][1]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c
  }
  return c
}

// Space-filling, self-avoiding curves – reads as cortical folds.
function genFolds(d, seed) {
  const rnd = mulberry32(seed)
  const step = d * 0.2
  const cell = d
  const grid = new Map()
  const key = (i, j) => (i + 500) * 1000 + (j + 500)
  const add = (x, y, id, idx) => {
    const k = key(Math.floor(x / cell), Math.floor(y / cell))
    let a = grid.get(k)
    if (!a) grid.set(k, (a = []))
    a.push(x, y, id, idx)
  }
  const minGap = Math.ceil((d * 1.6) / step) + 2
  const conflict = (x, y, id, idx) => {
    const ci = Math.floor(x / cell)
    const cj = Math.floor(y / cell)
    for (let di = -1; di <= 1; di++) {
      for (let dj = -1; dj <= 1; dj++) {
        const a = grid.get(key(ci + di, cj + dj))
        if (!a) continue
        for (let k = 0; k < a.length; k += 4) {
          const oid = a[k + 2]
          if (oid === id && Math.abs(idx - a[k + 3]) < minGap) continue
          const dx = x - a[k]
          const dy = y - a[k + 1]
          const lim = oid === -1 ? d * 0.62 : d
          if (dx * dx + dy * dy < lim * lim) return true
        }
      }
    }
    return false
  }

  // Seed the boundary so curves keep clear of the outline.
  for (let i = 0; i < OUTLINE.length; i++) {
    const a = OUTLINE[i]
    const b = OUTLINE[(i + 1) % OUTLINE.length]
    const len = Math.hypot(b[0] - a[0], b[1] - a[1])
    const n = Math.max(1, Math.ceil(len / (d * 0.4)))
    for (let k = 0; k < n; k++) add(a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n, -1, 0)
  }

  const grow = (sx, sy, theta, dir, id) => {
    const pts = []
    let x = sx
    let y = sy
    let kap = 0
    let idx = 0
    for (let n = 0; n < 500; n++) {
      kap = Math.max(-7, Math.min(7, kap + (rnd() - 0.5) * 1.6)) * 0.97
      const s = kap >= 0 ? 1 : -1
      let moved = false
      for (const da of [0, 0.5 * s, -0.5 * s, 1.0 * s, -1.0 * s]) {
        const th = theta + kap * step + da
        const nx = x + Math.cos(th) * step
        const ny = y + Math.sin(th) * step
        if (!inside(OUTLINE, nx, ny)) continue
        if (conflict(nx, ny, id, idx + dir)) continue
        idx += dir
        x = nx
        y = ny
        theta = th
        add(x, y, id, idx)
        pts.push([x, y])
        moved = true
        break
      }
      if (!moved) break
    }
    return pts
  }

  const curves = []
  let id = 0
  for (let attempt = 0; attempt < 7000; attempt++) {
    const x = -1.05 + rnd() * 2.1
    const y = -0.9 + rnd() * 1.9
    if (!inside(OUTLINE, x, y) || conflict(x, y, -99, 0)) continue
    id++
    add(x, y, id, 0)
    const th = rnd() * TAU
    const f = grow(x, y, th, 1, id)
    const b = grow(x, y, th + Math.PI, -1, id)
    const poly = [...b.reverse(), [x, y], ...f]
    if (poly.length >= 4) curves.push(poly)
  }
  return curves
}

const foldCache = new Map()
export function getFolds(tier) {
  if (!foldCache.has(tier)) foldCache.set(tier, genFolds(tier === 0 ? 0.05 : 0.09, 7 + tier))
  return foldCache.get(tier)
}

// Neuron graph (unit space).
export function buildNeurons() {
  const rnd = mulberry32(31)
  const nodes = []
  let guard = 0
  while (nodes.length < 38 && guard++ < 4000) {
    const x = -0.95 + rnd() * 1.9
    const y = -0.72 + rnd() * 1.2
    if (!inside(OUTLINE, x, y) || y > 0.42) continue
    if (nodes.some((n) => Math.hypot(n[0] - x, n[1] - y) < 0.2)) continue
    nodes.push([x, y])
  }
  const edges = []
  const seen = new Set()
  nodes.forEach((a, i) => {
    const near = nodes
      .map((b, j) => ({ j, d: Math.hypot(a[0] - b[0], a[1] - b[1]) }))
      .filter((o) => o.j !== i)
      .sort((p, q) => p.d - q.d)
      .slice(0, 3)
    near.forEach(({ j }) => {
      const k = i < j ? `${i}-${j}` : `${j}-${i}`
      if (!seen.has(k)) {
        seen.add(k)
        edges.push([i, j])
      }
    })
  })
  const adj = nodes.map(() => [])
  edges.forEach(([a, b]) => {
    adj[a].push(b)
    adj[b].push(a)
  })
  return { nodes, edges, adj }
}
