import { OUTLINE, getFolds, buildNeurons, mulberry32 } from './brain.js'
import { FILE_TYPES, boxOf, drawFile, drawTextPage, drawChunkCard, drawRoundRect } from './icons.js'

const TAU = Math.PI * 2
const ACCENT = '#6258F5'
const ACCENT_SOFT = '#F0EEFF'
const INDEX_INK = '#424753'
const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
const lerp = (a, b, t) => a + (b - a) * t
const smooth = (a, b, x) => {
  const t = clamp((x - a) / (b - a), 0, 1)
  return t * t * (3 - 2 * t)
}
const easeOut = (t) => 1 - Math.pow(1 - clamp(t, 0, 1), 3)

const MONO = 'ui-monospace, "SF Mono", Menlo, Consolas, monospace'
const SANS = '"Inter", system-ui, -apple-system, "Segoe UI", sans-serif'

export const STEPS = [
  { title: 'Upload' },
  { title: 'Extract' },
  { title: 'Chunk' },
  { title: 'Index' },
  { title: 'Retrieve' },
  { title: 'Verify' },
  { title: 'Answer' },
]

const NEURONS = buildNeurons()

function buildPolyline(wps, r) {
  const out = [{ x: wps[0][0], y: wps[0][1] }]
  for (let i = 1; i < wps.length - 1; i++) {
    const a = wps[i - 1]
    const p = wps[i]
    const b = wps[i + 1]
    const l1 = Math.hypot(p[0] - a[0], p[1] - a[1])
    const l2 = Math.hypot(b[0] - p[0], b[1] - p[1])
    const rad = Math.min(r, l1 / 2, l2 / 2)
    const s = [p[0] - ((p[0] - a[0]) / l1) * rad, p[1] - ((p[1] - a[1]) / l1) * rad]
    const e = [p[0] + ((b[0] - p[0]) / l2) * rad, p[1] + ((b[1] - p[1]) / l2) * rad]
    out.push({ x: s[0], y: s[1] })
    for (let k = 1; k <= 12; k++) {
      const t = k / 12
      out.push({
        x: (1 - t) * (1 - t) * s[0] + 2 * (1 - t) * t * p[0] + t * t * e[0],
        y: (1 - t) * (1 - t) * s[1] + 2 * (1 - t) * t * p[1] + t * t * e[1],
      })
    }
  }
  const last = wps[wps.length - 1]
  out.push({ x: last[0], y: last[1] })
  const cum = [0]
  for (let i = 1; i < out.length; i++) cum.push(cum[i - 1] + Math.hypot(out[i].x - out[i - 1].x, out[i].y - out[i - 1].y))
  const total = cum[cum.length - 1]
  const res = []
  let j = 1
  for (let d = 0; d <= total; d += 1) {
    while (j < cum.length - 1 && cum[j] < d) j++
    const f = (d - cum[j - 1]) / (cum[j] - cum[j - 1] || 1)
    res.push({ x: lerp(out[j - 1].x, out[j].x, f), y: lerp(out[j - 1].y, out[j].y, f) })
  }
  res.push({ x: last[0], y: last[1] })
  return res
}

export class PipelineScene {
  constructor({ createCanvas, seed = 5 }) {
    this.createCanvas = createCanvas
    this.rnd = mulberry32(seed)
    this.t = 0
    this.W = 0
    this.H = 0
    this.dpr = 1
    this.files = []
    this.chunks = []
    this.packets = []
    this.inbrain = []
    this.memories = []
    this.pulses = []
    this.timers = []
    this.widgetMsgs = []
    this.energy = new Array(NEURONS.nodes.length).fill(0)
    this.spawnIn = 0.2
    this.qIn = 1.15
    this.ambientIn = 1
    this.glow = 0
    this.hasIndexedContent = false
    this.lastEntryPulse = -1
    this.bag = []
  }

  /* ----------------------------------------------------------- layout */

  resize(W, H, dpr = 1) {
    this.W = W
    this.H = H
    this.dpr = dpr
    const mobile = W < 768
    this.mobile = mobile
    let wps, R, C, lineY, cornerR
    const st = {}

    if (!mobile) {
      const s = clamp(Math.min(W / 1440, H / 880), 0.62, 1.45)
      const u = 1.05 * s
      R = 184 * s
      const x0 = W * 0.04
      const len = W * 0.92
      this.s = s
      this.u = u
      this.laneAmp = 66 * s
      this.gateR = 26 * u
      this.ramp = 64 * s
      this.abstainAmp = this.laneAmp
      const hdr = Math.max(this.laneAmp + this.gateR + 44 * s, 0.85 * R + 46 * s)
      lineY = Math.max(H * 0.37, 92 + hdr)
      this.hdr = hdr
      wps = [[x0, lineY], [x0 + len, lineY]]
      cornerR = 0
      const D = (f) => f * len
      Object.assign(st, {
        upload: 36 * s, ext: D(0.155), chunk: D(0.285), embed: D(0.338),
        index: D(0.392), retrieve: D(0.7), rerank: D(0.765), verify: D(0.83), answer: D(0.905), widget: len,
      })
      C = { x: x0 + D(0.531), y: lineY - 0.07 * R }
      this.stubOff = -100 * s
      this.speed = len * 0.068
      this.x0 = x0
    } else {
      const m = clamp(W / 390, 0.8, 1.6)
      const u = clamp((0.55 * W) / 390, 0.5, 0.95)
      this.s = m
      this.u = u
      R = clamp(W * 0.23, 56, 112)
      const xL = W * 0.2
      const xR = W * 0.84
      const bottomLimit = H - 350
      let yb = Math.min(H * 0.43, bottomLimit - 0.9 * R)
      yb = Math.max(yb, 250)
      const yTop = Math.max(yb - 262, 80)
      const L1 = yb - yTop
      const yTopR = yTop + 0.1 * L1
      const Lr = yb - yTopR
      lineY = yb
      wps = [[xL, yTop], [xL, yb], [xR, yb], [xR, yTopR]]
      cornerR = 16
      this.laneAmp = 29 * m
      this.gateR = 26 * u
      this.ramp = 0.12 * L1
      this.abstainAmp = 34 * m
      C = { x: W * 0.55, y: yb - 0.07 * R }
      this.stubOff = 40 * m
      this.speed = L1 * 0.3
      this.mobAnch = {
        left: (f) => [xL, yTop + f * L1],
        right: (f) => [xR, yb - f * Lr],
      }
      this.xL = xL
      this.xR = xR
      this.mobL1 = L1
      st._left = { upload: 0.07, ext: 0.37, chunk: 0.68, embed: 0.79, index: 0.9 }
      st._right = { retrieve: 0.15, rerank: 0.32, verify: 0.48, answer: 0.64, widget: 0.86 }
    }

    this.R = R
    this.C = C
    this.lineY = lineY
    this.pts = buildPolyline(wps, cornerR)
    this.len = this.pts.length - 1

    if (mobile) {
      const L1 = this.mobL1
      for (const [k, f] of Object.entries(st._left)) st[k] = f * L1
      for (const [k, f] of Object.entries(st._right)) {
        const a = this.mobAnch.right(f)
        st[k] = this.dOf(a[0], a[1])
      }
      delete st._left
      delete st._right
    }
    this.st = st

    this.outlinePx = OUTLINE.map((p) => [C.x + p[0] * R, C.y + p[1] * R])
    this.nodesPx = NEURONS.nodes.map((p) => [C.x + p[0] * R, C.y + p[1] * R])
    const tips = this.tips(lineY)
    this.tipL = { x: tips.l, y: lineY }
    this.tipR = { x: tips.r, y: lineY }
    st.brainIn = this.dOf(tips.l, lineY)
    st.brainOut = this.dOf(tips.r, lineY)

    // The final Answer marker belongs to the deployed Knowledge AI chat.
    this.stationD = [st.upload, st.ext, st.chunk, st.index, st.retrieve, st.verify, st.widget]
    this.buildAnchors()
    this.prerenderBrain()
  }

  tips(y) {
    let l = Infinity
    let r = -Infinity
    const P = this.outlinePx
    for (let i = 0; i < P.length; i++) {
      const a = P[i]
      const b = P[(i + 1) % P.length]
      if (a[1] <= y !== b[1] <= y) {
        const x = a[0] + ((y - a[1]) * (b[0] - a[0])) / (b[1] - a[1])
        l = Math.min(l, x)
        r = Math.max(r, x)
      }
    }
    return { l, r }
  }

  dOf(x, y) {
    let best = 0
    let bd = Infinity
    for (let i = 0; i < this.pts.length; i += 2) {
      const d = (this.pts[i].x - x) ** 2 + (this.pts[i].y - y) ** 2
      if (d < bd) {
        bd = d
        best = i
      }
    }
    return best
  }

  at(d) {
    const n = this.pts.length - 1
    d = clamp(d, 0, n)
    const i = Math.min(n - 1, Math.floor(d))
    const f = d - i
    const a = this.pts[i]
    const b = this.pts[i + 1]
    const j0 = Math.max(0, i - 3)
    const j1 = Math.min(n, i + 4)
    let tx = this.pts[j1].x - this.pts[j0].x
    let ty = this.pts[j1].y - this.pts[j0].y
    const l = Math.hypot(tx, ty) || 1
    tx /= l
    ty /= l
    return { x: lerp(a.x, b.x, f), y: lerp(a.y, b.y, f), tx, ty, nx: -ty, ny: tx }
  }

  pos(d, off = 0) {
    const p = this.at(d)
    return { x: p.x + p.nx * off, y: p.y + p.ny * off, tx: p.tx, ty: p.ty, nx: p.nx, ny: p.ny }
  }

  abstainOff(d) {
    return this.abstainAmp * smooth(this.st.verify, this.st.verify + this.ramp, d)
  }

  buildAnchors() {
    const { s, u } = this
    this.anchors = this.stationD.map((d, i) => {
      const p = i === 6 ? this.widgetPos() : this.pos(d)
      let bx
      let by
      if (!this.mobile) {
        by = this.lineY + this.laneAmp + this.gateR + 24 * s
        bx = p.x
      } else {
        by = i === 6 ? p.y + 64 * u : p.y
        bx = i === 6 ? p.x : i < 4 ? this.xL - 17 * s : this.xR - 17 * s
      }
      return { x: p.x, y: p.y, bx, by }
    })
    this.labelMode = 'full'
    if (!this.mobile) {
      let minPitch = Infinity
      const ds = this.anchors.map((_, i) => i)
      for (let k = 1; k < ds.length; k++) {
        if (k === 4) continue
        minPitch = Math.min(minPitch, this.anchors[k].x - this.anchors[k - 1].x)
      }
      this.labelMode = minPitch < 44 ? 'num' : 'full'
      this.titleFs = clamp(minPitch * 0.21, 9.5, 12.5 * s)
    } else this.labelMode = 'num'
    void u
  }

  prerenderBrain() {
    const { R, C, dpr } = this
    const m = 10
    const x0 = C.x - 1.12 * R - m
    const y0 = C.y - 0.95 * R - m
    const w = 2.24 * R + m * 2
    const h = 1.95 * R + m * 2
    const cv = this.createCanvas(Math.ceil(w * dpr), Math.ceil(h * dpr))
    const g = cv.getContext('2d')
    g.scale(dpr, dpr)
    g.translate(-x0, -y0)
    const outline = () => {
      g.beginPath()
      this.outlinePx.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])))
      g.closePath()
    }
    outline()
    g.fillStyle = '#ffffff'
    g.fill()
    g.save()
    g.clip()
    g.strokeStyle = 'rgba(49,55,80,0.32)'
    g.lineWidth = Math.max(0.7, R * 0.0042)
    g.lineCap = 'round'
    g.lineJoin = 'round'
    for (const c of getFolds(this.mobile ? 1 : 0)) {
      g.beginPath()
      c.forEach((p, i) => (i ? g.lineTo(C.x + p[0] * R, C.y + p[1] * R) : g.moveTo(C.x + p[0] * R, C.y + p[1] * R)))
      g.stroke()
    }
    g.restore()
    outline()
    g.lineWidth = Math.max(1.4, R * 0.007)
    g.lineJoin = 'round'
    g.strokeStyle = '#000'
    g.stroke()
    this.brainImg = { cv, x: x0, y: y0, w, h }
  }

  /* ------------------------------------------------------------- sim */

  nextType() {
    if (!this.bag.length) {
      this.bag = [...FILE_TYPES]
      for (let i = this.bag.length - 1; i > 0; i--) {
        const j = Math.floor(this.rnd() * (i + 1))
        ;[this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]]
      }
    }
    return this.bag.pop()
  }

  makeFile(type, d, extra = {}) {
    const { w, h } = boxOf(type)
    return { type, w, h, d, ph: this.rnd() * TAU, born: this.t, spread: 0, ...extra }
  }

  bitOf(seed, k = 0) {
    return ((Math.floor(this.t * 5 + seed * 40) + k) & 1) === 0 ? '0' : '1'
  }

  light(node, e) {
    if (e <= this.energy[node]) return
    this.energy[node] = e
    if (e * 0.6 > 0.28) {
      NEURONS.adj[node].forEach((n, k) => this.timers.push({ at: this.t + 0.13 + k * 0.05, node: n, e: e * 0.6 }))
    }
  }

  toBrain(count, seedBase) {
    const e = this.tipL
    this.hasIndexedContent = true
    this.glow = Math.min(1, this.glow + 0.34)
    if (this.t - this.lastEntryPulse > 0.2) {
      this.pulses.push({ x: e.x, y: e.y, t0: this.t, kind: 'entry' })
      this.lastEntryPulse = this.t
    }
    for (let i = 0; i < count; i++) {
      this.inbrain.push({
        node: Math.floor(this.rnd() * this.nodesPx.length),
        t: -i * 0.12,
        dur: 0.75 + this.rnd() * 0.45,
        bend: (this.rnd() - 0.5) * 60 * this.u,
        ch: this.bitOf(seedBase + i * 0.17, i),
      })
    }
  }

  spawnPacket() {
    const cands = []
    this.nodesPx.forEach((p, i) => {
      if (p[0] > this.C.x - this.R * 0.15) cands.push(i)
    })
    const pool = cands.length >= 5 ? cands : this.nodesPx.map((_, i) => i)
    const picked = []
    while (picked.length < 5) {
      const n = pool[Math.floor(this.rnd() * pool.length)]
      if (!picked.includes(n)) picked.push(n)
    }
    const form = [[30, -18], [30, 0], [30, 18], [52, -9], [52, 9]]
    const chips = picked.map((node, k) => {
      this.timers.push({ at: this.t + 0.05 + k * 0.06, node, e: 1 })
      return { node, start: this.t + 0.1 + k * 0.05, dur: 0.58, rel: form[k], attached: false, keep: k === 1 || k === 4, a: 1 }
    })
    this.packets.push({
      t0: this.t, state: 'drop', d: this.st.retrieve, drop: 0, abstain: this.rnd() < 0.24, chips,
      doneVerify: false, verdict: 0,
    })
  }

  step(dt) {
    if (!this.len) return
    dt = Math.min(dt, 0.05)
    this.t += dt
    const { st, s } = this
    const v = this.speed

    // spawn files
    this.spawnIn -= dt
    if (this.spawnIn <= 0 && this.files.length < 9) {
      this.files.push(this.makeFile(this.nextType(), 0))
      this.spawnIn = (this.mobile ? 1.9 : 1.55) + this.rnd() * 0.7
    }
    // spawn questions
    if (this.hasIndexedContent) {
      this.qIn -= dt
      if (this.qIn <= 0 && this.packets.length < 2) {
        this.spawnPacket()
        this.qIn = (this.mobile ? 4.6 : 4.1) + this.rnd() * 1.1
      }
    }

    // files
    for (let i = this.files.length - 1; i >= 0; i--) {
      const f = this.files[i]
      const near = 1 - 0.3 * Math.exp(-(((f.d - st.ext) / (60 * s)) ** 2))
      f.d += v * near * dt
      if (f.d >= st.chunk) {
        for (let k = 0; k < 3; k++) {
          this.chunks.push({ d: f.d, idx: k, born: this.t, seed: this.rnd(), ph: this.rnd() * TAU })
        }
        this.files.splice(i, 1)
      }
    }

    // chunks -> vectors -> brain
    for (let i = this.chunks.length - 1; i >= 0; i--) {
      const c = this.chunks[i]
      c.d += v * dt
      if (c.d >= st.brainIn - 3) {
        this.toBrain(2, c.seed)
        this.chunks.splice(i, 1)
      }
    }

    // in-brain travel to neurons
    for (let i = this.inbrain.length - 1; i >= 0; i--) {
      const p = this.inbrain[i]
      p.t += dt / p.dur
      if (p.t >= 1) {
        this.inbrain.splice(i, 1)
        this.light(p.node, 0.85)
        const n = this.nodesPx[p.node]
        this.pulses.push({ x: n[0], y: n[1], t0: this.t, kind: 'node' })
        this.memories.push({ x: n[0] + (this.rnd() - 0.5) * 18 * this.u, y: n[1] + (this.rnd() - 0.5) * 18 * this.u, ch: p.ch, born: this.t })
        if (this.memories.length > 26) this.memories.shift()
      }
    }

    // question packets
    for (let i = this.packets.length - 1; i >= 0; i--) {
      const pk = this.packets[i]
      const age = this.t - pk.t0
      const pv = v * 1.12
      if (pk.state === 'drop') {
        pk.drop = clamp(age / 0.8, 0, 1)
        if (age > 1.2) pk.state = 'travel'
        else if (age > 0.9 && pk.chips.every((c) => c.attached)) pk.state = 'travel'
      } else if (pk.state === 'travel') {
        const prev = pk.d
        const target = pk.abstain ? st.answer : st.widget - 38 * s
        pk.d = Math.min(target, pk.d + pv * dt)
        if (!pk.doneVerify && prev < st.verify && pk.d >= st.verify) pk.doneVerify = true
        pk.verdict = smooth(st.verify - 10 * s, st.verify + 14 * s, pk.d) *
          (1 - smooth(st.verify + 30 * s, st.verify + 46 * s, pk.d))
        if (pk.abstain && pk.d >= target) {
          pk.state = 'abstained'
          pk.endedAt = this.t
          const end = this.pos(st.answer, this.abstainAmp)
          this.pulses.push({ x: end.x, y: end.y, t0: this.t, kind: 'abstain' })
        } else if (!pk.abstain && pk.d >= target) {
          this.widgetMsgs.push({ born: this.t })
          if (this.widgetMsgs.length > 3) this.widgetMsgs.shift()
          this.pulses.push({ ...this.widgetPos(), t0: this.t, kind: 'widget' })
          this.packets.splice(i, 1)
        }
      } else if (pk.state === 'abstained' && this.t - pk.endedAt > 0.42) {
        this.packets.splice(i, 1)
      }
    }

    // neurons
    for (let i = this.timers.length - 1; i >= 0; i--) {
      const tm = this.timers[i]
      if (tm.at <= this.t) {
        this.timers.splice(i, 1)
        this.light(tm.node, tm.e)
      }
    }
    for (let i = 0; i < this.energy.length; i++) this.energy[i] = Math.max(0, this.energy[i] - dt * 0.8)
    this.ambientIn -= dt
    if (this.ambientIn <= 0) {
      this.light(Math.floor(this.rnd() * this.energy.length), 0.3)
      this.ambientIn = 0.8 + this.rnd() * 1.2
    }
    this.pulses = this.pulses.filter((p) => this.t - p.t0 < 1.2)
    this.glow = Math.max(0, this.glow - dt * 0.65)
  }

  /* ------------------------------------------------------------ draw */

  draw(ctx) {
    const { W, H, dpr } = this
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, W, H)
    this.drawTrack(ctx)
    if (!this.mobile) this.drawHeaders(ctx)
    this.drawGlow(ctx)
    this.drawBrain(ctx)
    this.drawLaserOutline(ctx)
    this.drawWidget(ctx)
    this.drawAbstainNode(ctx)
    this.drawFiles(ctx)
    this.drawChunks(ctx)
    this.drawPackets(ctx)
    this.drawInbrain(ctx)
    this.drawPulses(ctx)
    this.drawLabels(ctx)
  }

  strokeAlong(ctx, d0, d1, offFn, base, dash) {
    ctx.beginPath()
    for (let d = d0; d <= d1 + 0.5; d += 3) {
      const p = this.pos(d, offFn(Math.min(d, d1)))
      d === d0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)
    }
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = 1.3
    if (!dash) {
      ctx.setLineDash([])
      ctx.strokeStyle = `rgba(49,55,80,${base})`
    } else {
      ctx.setLineDash([3, 9])
      ctx.lineDashOffset = -this.t * 16
      ctx.strokeStyle = `rgba(98,88,245,${base * 0.55})`
    }
    ctx.stroke()
    ctx.setLineDash([])
  }

  drawTrack(ctx) {
    const { st } = this
    const lines = [
      [0, this.len, () => 0],
      [st.verify - 6, st.answer, (d) => this.abstainOff(d)],
    ]
    for (const [a, b, f] of lines) {
      this.strokeAlong(ctx, a, b, f, 0.12, false)
      this.strokeAlong(ctx, a, b, f, 0.55, true)
    }
    // visitor-question stub
    const top = this.pos(st.retrieve, this.stubOff)
    const bot = this.pos(st.retrieve, 0)
    ctx.beginPath()
    ctx.moveTo(top.x, top.y)
    ctx.lineTo(bot.x, bot.y)
    ctx.setLineDash([2, 5])
    ctx.strokeStyle = 'rgba(98,88,245,0.3)'
    ctx.lineWidth = 1.1
    ctx.stroke()
    ctx.setLineDash([])
    ctx.beginPath()
    ctx.arc(top.x, top.y, 3 * this.u, 0, TAU)
    ctx.fillStyle = ACCENT
    ctx.fill()
    if (!this.mobile) {
      ctx.font = `500 ${11 * this.s}px ${SANS}`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = 'rgba(0,0,0,0.5)'
      ctx.fillText('Visitor question', top.x, top.y - 14 * this.s)
    }
  }

  drawHeaders(ctx) {
    const { s, st } = this
    const y = this.lineY - this.hdr
    const x = (d) => this.pos(d).x
    const groups = [
      { t: 'BUILD YOUR KNOWLEDGE', a: x(st.upload) - this.gateR, b: x(st.index) + this.gateR },
      { t: 'ANSWERS WITH SOURCES', a: x(st.retrieve) - this.gateR, b: x(st.answer) + this.gateR },
      { t: 'READY TO EMBED', a: x(st.widget) - 40 * this.u, b: Math.min(this.W - 20 * s, x(st.widget) + 40 * this.u), align: 'right' },
    ]
    ctx.font = `600 ${10.5 * s}px ${SANS}`
    ctx.textBaseline = 'middle'
    for (const g of groups) {
      ctx.textAlign = g.align || 'left'
      ctx.fillStyle = 'rgba(49,55,80,0.62)'
      ctx.fillText(g.t, g.align === 'right' ? g.b : g.a, y)
      ctx.beginPath()
      ctx.moveTo(g.a, y + 12 * s)
      ctx.lineTo(g.b, y + 12 * s)
      ctx.strokeStyle = 'rgba(49,55,80,0.16)'
      ctx.lineWidth = 1
      ctx.stroke()
      for (const ex of [g.a, g.b]) {
        ctx.beginPath()
        ctx.moveTo(ex, y + 8 * s)
        ctx.lineTo(ex, y + 16 * s)
        ctx.stroke()
      }
    }
    // brain label
    ctx.textAlign = 'center'
    ctx.fillStyle = 'rgba(49,55,80,0.68)'
    ctx.fillText('YOUR KNOWLEDGE BASE', this.C.x, this.C.y - 0.86 * this.R - 16 * s)
  }

  brainPulse() {
    const wave = 0.5 + 0.5 * Math.sin(this.t * 1.4 - Math.PI / 2)
    return 0.08 + 0.42 * wave
  }

  drawGlow(ctx) {
    const { C, R } = this
    const strength = Math.max(this.glow, this.brainPulse())
    const e = 0.01 + 0.11 * strength
    const g = ctx.createRadialGradient(C.x, C.y, R * 0.2, C.x, C.y, R * 1.45)
    g.addColorStop(0, `rgba(98,88,245,${e * 0.36})`)
    g.addColorStop(0.58, `rgba(98,88,245,${0.004 + strength * 0.025})`)
    g.addColorStop(1, 'rgba(98,88,245,0)')
    ctx.fillStyle = g
    ctx.fillRect(C.x - R * 1.6, C.y - R * 1.5, R * 3.2, R * 3.1)
  }

  drawLaserOutline(ctx) {
    const strength = Math.max(this.glow, this.brainPulse())
    if (strength < 0.015) return

    const points = this.outlinePx
    let perimeter = 0
    for (let i = 0; i < points.length; i++) {
      const a = points[i]
      const b = points[(i + 1) % points.length]
      perimeter += Math.hypot(b[0] - a[0], b[1] - a[1])
    }
    ctx.save()
    ctx.beginPath()
    points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
    ctx.closePath()
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'

    // A soft violet aura sits just outside the brain contour.
    ctx.strokeStyle = `rgba(98,88,245,${0.9 * strength})`
    ctx.lineWidth = 1.55
    ctx.shadowColor = `rgba(98,88,245,${0.95 * strength})`
    ctx.shadowBlur = this.R * 0.16 * strength
    ctx.stroke()

    // A bright short segment travels around the contour like a laser scan.
    const trace = Math.min(perimeter * 0.16, this.R * 0.72)
    ctx.setLineDash([trace, Math.max(1, perimeter - trace)])
    ctx.lineDashOffset = -((this.t * this.R * 1.9) % perimeter)
    ctx.strokeStyle = `rgba(151,140,255,${0.98 * strength})`
    ctx.lineWidth = 2.5
    ctx.shadowColor = `rgba(98,88,245,${strength})`
    ctx.shadowBlur = this.R * 0.2 * strength
    ctx.stroke()
    ctx.setLineDash([])
    ctx.restore()
  }

  drawBrain(ctx) {
    const b = this.brainImg
    ctx.drawImage(b.cv, b.x, b.y, b.w, b.h)
    const { nodesPx, energy, u } = this
    ctx.lineCap = 'round'
    for (const [a, c] of NEURONS.edges) {
      const e = Math.max(energy[a], energy[c])
      if (e < 0.03) continue
      ctx.beginPath()
      ctx.moveTo(nodesPx[a][0], nodesPx[a][1])
      ctx.lineTo(nodesPx[c][0], nodesPx[c][1])
      ctx.strokeStyle = `rgba(49,55,80,${Math.min(0.58, e * 0.58)})`
      ctx.lineWidth = 1 + e * 0.5
      ctx.stroke()
    }
    for (let i = 0; i < nodesPx.length; i++) {
      const e = energy[i]
      const [x, y] = nodesPx[i]
      ctx.beginPath()
      ctx.arc(x, y, (1.6 + e * 3.2) * u, 0, TAU)
      ctx.fillStyle = e > 0.02 ? `rgba(49,55,80,${0.34 + e * 0.5})` : 'rgba(49,55,80,0.28)'
      ctx.fill()
      if (e > 0.05) {
        ctx.beginPath()
        ctx.arc(x, y, (5 + e * 7) * u, 0, TAU)
        ctx.strokeStyle = `rgba(49,55,80,${e * 0.3})`
        ctx.lineWidth = 1
        ctx.stroke()
      }
    }
    ctx.font = `500 ${6.5 * u}px ${MONO}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    for (const m of this.memories) {
      const a = 0.85 * (1 - smooth(0, 5.5, this.t - m.born))
      ctx.lineWidth = 2.4
      ctx.strokeStyle = `rgba(255,255,255,${0.92 * a})`
      ctx.strokeText(m.ch, m.x, m.y)
      ctx.fillStyle = `rgba(49,55,80,${a})`
      ctx.fillText(m.ch, m.x, m.y)
    }
  }

  drawWidget(ctx) {
    const { u } = this
    const p = this.widgetPos()
    const k = u * (this.mobile ? 1 : Math.min(1, this.W / 1100))
    const w = 86 * k
    const h = 112 * k
    const x = p.x - w / 2
    const y = p.y - h / 2
    const font = Math.max(6.2, 7 * k)
    ctx.save()
    drawRoundRect(ctx, x, y, w, h, 8 * k)
    ctx.fillStyle = '#fff'
    ctx.shadowColor = 'rgba(98,88,245,0.14)'
    ctx.shadowBlur = 22 * k
    ctx.shadowOffsetY = 7 * k
    ctx.fill()
    ctx.shadowColor = 'transparent'
    ctx.shadowBlur = 0
    ctx.shadowOffsetY = 0
    ctx.lineWidth = 1.3
    ctx.strokeStyle = 'rgba(35,39,62,0.82)'
    ctx.stroke()
    // assistant header
    ctx.beginPath()
    ctx.moveTo(x, y + 20 * k)
    ctx.lineTo(x + w, y + 20 * k)
    ctx.lineWidth = 1
    ctx.strokeStyle = 'rgba(35,39,62,0.12)'
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(x + 11 * k, y + 10 * k, 4 * k, 0, TAU)
    ctx.fillStyle = ACCENT
    ctx.fill()
    ctx.font = `600 ${Math.max(5.3, 6.2 * k)}px ${SANS}`
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = 'rgba(35,39,62,0.78)'
    ctx.fillText('KNOWLEDGE AI', x + 19 * k, y + 10 * k)

    // Visitor prompt
    const qx = x + w * 0.31
    const qy = y + 27 * k
    const qw = w * 0.6
    drawRoundRect(ctx, qx, qy, qw, 13 * k, 5 * k)
    ctx.fillStyle = 'rgba(35,39,62,0.92)'
    ctx.fill()
    ctx.fillStyle = 'rgba(255,255,255,0.76)'
    ctx.beginPath()
    ctx.moveTo(qx + 8 * k, qy + 6.5 * k)
    ctx.lineTo(qx + qw - 8 * k, qy + 6.5 * k)
    ctx.lineWidth = 1.3 * k
    ctx.stroke()

    // Source-backed answer
    drawRoundRect(ctx, x + 8 * k, y + 46 * k, w - 16 * k, 30 * k, 5 * k)
    ctx.fillStyle = 'rgba(98,88,245,0.055)'
    ctx.fill()
    ctx.font = `600 ${font}px ${SANS}`
    ctx.fillStyle = 'rgba(35,39,62,0.84)'
    ctx.fillText('Found in your files', x + 13 * k, y + 54 * k)
    ctx.strokeStyle = 'rgba(35,39,62,0.3)'
    ctx.lineWidth = 1.15 * k
    for (let i = 0; i < 2; i++) {
      const yy = y + (62 + i * 6) * k
      ctx.beginPath()
      ctx.moveTo(x + 13 * k, yy)
      ctx.lineTo(x + (i === 0 ? 62 : 51) * k, yy)
      ctx.stroke()
    }

    const newest = this.widgetMsgs[this.widgetMsgs.length - 1]
    const fresh = newest ? 1 - smooth(0, 1.3, this.t - newest.born) : 0
    const sx = x + 8 * k
    const sy = y + 81 * k
    const sw = 56 * k
    drawRoundRect(ctx, sx, sy, sw, 14 * k, 7 * k)
    ctx.fillStyle = ACCENT_SOFT
    ctx.fill()
    ctx.beginPath()
    ctx.arc(sx + 7 * k, sy + 7 * k, 2 * k + 1.5 * k * fresh, 0, TAU)
    ctx.fillStyle = ACCENT
    ctx.fill()
    ctx.font = `600 ${Math.max(5.1, 5.8 * k)}px ${SANS}`
    ctx.fillStyle = ACCENT
    ctx.fillText('SOURCES CITED', sx + 13 * k, sy + 7.2 * k)

    drawRoundRect(ctx, x + 8 * k, y + 99 * k, w - 16 * k, 7 * k, 3.5 * k)
    ctx.strokeStyle = 'rgba(35,39,62,0.2)'
    ctx.lineWidth = 1
    ctx.stroke()
    ctx.restore()
  }

  drawAbstainNode(ctx) {
    const { u, s } = this
    const p = this.pos(this.st.answer, this.abstainAmp)
    ctx.beginPath()
    ctx.arc(p.x, p.y, 8 * u, 0, TAU)
    ctx.fillStyle = '#fff'
    ctx.fill()
    ctx.setLineDash([2, 2.5])
    ctx.strokeStyle = 'rgba(0,0,0,0.6)'
    ctx.lineWidth = 1.1
    ctx.stroke()
    ctx.setLineDash([])
    ctx.beginPath()
    ctx.moveTo(p.x - 3 * u, p.y)
    ctx.lineTo(p.x + 3 * u, p.y)
    ctx.strokeStyle = 'rgba(0,0,0,0.6)'
    ctx.stroke()
    if (!this.mobile) {
      ctx.font = `500 ${10.5 * s}px ${SANS}`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = 'rgba(0,0,0,0.5)'
      ctx.fillText('\u201cI don\u2019t know\u201d', p.x, p.y + 20 * s)
    }
  }

  filePose(f) {
    const { s, u } = this
    const base = this.at(f.d)
    const spread = f.spread * Math.exp(-(this.t - f.born) * 3.5)
    const calm = smooth(this.st.upload, this.st.ext + 42 * s, f.d)
    const wob = Math.sin(f.ph + this.t * 1.4) * 0.12 * (1 - calm)
    const bob = Math.sin(f.ph * 1.7 + this.t * 2) * 1.5 * u * (1 - calm)
    const off = spread + bob
    return { x: base.x + base.nx * off, y: base.y + base.ny * off, rot: wob }
  }

  drawFiles(ctx) {
    const { st, s, u } = this
    const band = 30 * s
    const list = [...this.files].sort((a, b) => a.d - b.d)
    for (const f of list) {
      const pose = this.filePose(f)
      const appear = smooth(0, st.upload + 10, f.d) * smooth(0, 0.25, this.t - f.born + (f.born < 0.01 ? 1 : 0))
      const sc = u * lerp(0.6, 1, smooth(0, st.upload, f.d)) * (f.spread ? lerp(0.7, 1, smooth(0, 0.35, this.t - f.born)) : 1)
      const wipe = smooth(st.ext - band, st.ext + band, f.d)
      ctx.save()
      ctx.translate(pose.x, pose.y)
      ctx.rotate(pose.rot)
      ctx.scale(sc, sc)
      const fx = f.w / 2 - wipe * f.w
      const a = Math.max(0.0001, appear)
      if (wipe < 0.999) {
        ctx.save()
        ctx.beginPath()
        ctx.rect(-f.w, -f.h, fx + f.w, f.h * 2)
        ctx.clip()
        drawFile(ctx, f.type, a)
        ctx.restore()
      }
      if (wipe > 0.001) {
        ctx.save()
        ctx.beginPath()
        ctx.rect(fx, -f.h, f.w * 2, f.h * 2)
        ctx.clip()
        drawTextPage(ctx, a)
        ctx.restore()
        if (wipe < 0.999) {
          const g = ctx.createLinearGradient(fx - 8, 0, fx, 0)
          g.addColorStop(0, 'rgba(98,88,245,0)')
          g.addColorStop(1, 'rgba(98,88,245,0.2)')
          ctx.fillStyle = g
          ctx.fillRect(fx - 8, -f.h / 2 - 5, 8, f.h + 10)
          ctx.beginPath()
          ctx.moveTo(fx, -f.h / 2 - 7)
          ctx.lineTo(fx, f.h / 2 + 7)
          ctx.strokeStyle = ACCENT
          ctx.lineWidth = 1.35
          ctx.stroke()
        }
      }
      ctx.restore()
    }
  }

  chunkPose(c) {
    const { u } = this
    const base = this.at(c.d)
    const k = easeOut((this.t - c.born) / 0.62)
    const off = (c.idx - 1) * 27 * u * k
    return { x: base.x + base.nx * off, y: base.y + base.ny * off, k, angle: (c.idx - 1) * 0.035 * (1 - k) }
  }

  drawChunks(ctx) {
    const { st, u } = this
    const band = 25 * this.s
    for (const c of this.chunks) {
      const p = this.chunkPose(c)
      const vec = smooth(st.embed - band, st.embed + band, c.d)
      const cw = lerp(42, 35, p.k)
      const ch = lerp(28, 23, p.k)
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.angle)
      ctx.scale(u, u)
      ctx.globalAlpha = 1 - vec
      drawChunkCard(ctx, 1, cw, ch)
      ctx.globalAlpha = vec
      // Passage vectors emerge as the excerpts reach indexing.
      const dots = [[-9, -4], [0, -4], [9, -4], [-9, 5], [0, 5], [9, 5]]
      ctx.beginPath()
      dots.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))
      ctx.strokeStyle = INDEX_INK
      ctx.globalAlpha = vec * 0.48
      ctx.lineWidth = 1.25
      ctx.stroke()
      for (const [x, y] of dots) {
        ctx.beginPath()
        ctx.arc(x, y, 2.2, 0, TAU)
        ctx.fillStyle = INDEX_INK
        ctx.globalAlpha = vec
        ctx.fill()
      }
      ctx.restore()
    }
  }

  packetPos(pk) {
    const stub = this.stubOff * (1 - easeOut(pk.drop))
    const off = stub + (pk.abstain ? this.abstainOff(pk.d) : 0)
    return this.pos(pk.d, off)
  }

  widgetPos() {
    const d = this.mobile ? this.st.widget : this.st.widget - 16 * this.s
    const p = this.pos(d, this.mobile ? 54 * this.u : 0)
    const pad = this.mobile ? 12 * this.s : 24 * this.s
    p.x = clamp(p.x, 43 * this.u + pad, this.W - 43 * this.u - pad)
    return p
  }

  drawPackets(ctx) {
    const { u, st, s } = this
    for (const pk of this.packets) {
      const P = this.packetPos(pk)
      const verifyConv = pk.abstain
        ? smooth(st.verify - 8 * s, st.answer, pk.d)
        : smooth(st.verify, st.answer - 10 * s, pk.d)
      const reranked = smooth(st.rerank - 12 * s, st.rerank + 28 * s, pk.d)
      for (const c of pk.chips) {
        let cx
        let cy
        const u0 = (this.t - c.start) / c.dur
        let rx = c.rel[0]
        let ry = c.rel[1]
        let a = 1
        if (reranked > 0) {
          if (c.keep) {
            ry = lerp(ry, ry > 0 ? 8.5 : -8.5, reranked)
            rx = lerp(rx, 32, reranked)
          } else {
            ry += (ry >= 0 ? 1 : -1) * 18 * reranked
            a = 1 - reranked
          }
        }
        if (c.keep) {
          if (pk.abstain) a *= 1 - verifyConv
          else {
            rx = lerp(rx, 0, verifyConv)
            ry = lerp(ry, 0, verifyConv)
            a *= 1 - 0.9 * smooth(0.6, 1, verifyConv)
          }
        }
        const fx = P.x - P.tx * rx * u + P.nx * ry * u
        const fy = P.y - P.ty * rx * u + P.ny * ry * u
        if (u0 < 0) continue
        if (u0 < 1) {
          const k = u0 < 0.5 ? 2 * u0 * u0 : 1 - Math.pow(-2 * u0 + 2, 2) / 2
          const N = this.nodesPx[c.node]
          const E = this.tipR
          cx = (1 - k) * (1 - k) * N[0] + 2 * (1 - k) * k * E.x + k * k * fx
          cy = (1 - k) * (1 - k) * N[1] + 2 * (1 - k) * k * E.y + k * k * fy
          a *= smooth(0, 0.2, u0)
        } else {
          cx = fx
          cy = fy
          c.attached = true
        }
        if (a < 0.02) continue
        ctx.save()
        ctx.translate(cx, cy)
        ctx.scale(u * 0.82, u * 0.82)
        drawChunkCard(ctx, a, 28, 16)
        ctx.restore()
      }
      if (pk.state !== 'abstained') this.drawBubble(ctx, pk, P)
      if (pk.verdict > 0.02) this.drawVerdict(ctx, pk)
    }
  }

  drawBubble(ctx, pk, P) {
    const { u, st, s } = this
    const ans = pk.abstain ? 0 : smooth(st.answer - 18 * s, st.answer + 26 * s, pk.d)
    const w = lerp(30, 46, ans) * u
    const h = lerp(18, 28, ans) * u
    const x = P.x - w / 2
    const y = P.y - h / 2
    const a = (pk.abstain && pk.doneVerify ? 0.75 : 1) * smooth(0, 0.3, this.t - pk.t0)
    ctx.save()
    ctx.globalAlpha = a
    // tail
    ctx.beginPath()
    ctx.moveTo(x + 5 * u, y + h - 1)
    ctx.lineTo(x + 3 * u, y + h + 5 * u)
    ctx.lineTo(x + 11 * u, y + h - 1)
    ctx.fillStyle = '#fff'
    ctx.fill()
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 1.3
    ctx.stroke()
    drawRoundRect(ctx, x, y, w, h, 6 * u)
    ctx.fillStyle = '#fff'
    ctx.fill()
    if (pk.abstain && pk.doneVerify) ctx.setLineDash([2.5, 2.5])
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 1.3
    ctx.stroke()
    ctx.setLineDash([])
    if (ans < 0.5) {
      ctx.font = `600 ${11 * u}px ${SANS}`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = '#000'
      ctx.fillText(pk.abstain && pk.doneVerify ? '\u2013' : '?', P.x, P.y + 0.5)
    } else {
      const typed = clamp((ans - 0.5) * 2.2, 0, 1)
      const widths = [1, 0.82, 0.5]
      for (let i = 0; i < 3; i++) {
        const lw = (w - 14 * u) * widths[i] * clamp(typed * 3 - i, 0, 1)
        if (lw <= 0) continue
        ctx.beginPath()
        ctx.moveTo(x + 7 * u, y + (7 + i * 6) * u)
        ctx.lineTo(x + 7 * u + lw, y + (7 + i * 6) * u)
        ctx.strokeStyle = 'rgba(0,0,0,0.84)'
        ctx.lineWidth = 1.6
        ctx.lineCap = 'round'
        ctx.stroke()
      }
      if (typed > 0.85) {
        ctx.beginPath()
        ctx.arc(x + w - 2 * u, y + 1 * u, 5.5 * u, 0, TAU)
        ctx.fillStyle = ACCENT_SOFT
        ctx.fill()
        ctx.strokeStyle = ACCENT
        ctx.lineWidth = 1.2
        ctx.stroke()
        ctx.font = `700 ${7 * u}px ${SANS}`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = ACCENT
        ctx.fillText('1', x + w - 2 * u, y + 1.4 * u)
      }
    }
    ctx.restore()
  }

  drawVerdict(ctx, pk) {
    const { u } = this
    const g = this.pos(this.st.verify)
    const cx = g.x + g.nx * -(this.gateR + 16 * u) * (this.mobile ? -1 : 1)
    const cy = g.y + g.ny * -(this.gateR + 16 * u) * (this.mobile ? -1 : 1)
    const k = pk.verdict
    const r = 9 * u * lerp(0.6, 1, k)
    ctx.save()
    ctx.globalAlpha = k
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, TAU)
    ctx.fillStyle = pk.abstain ? '#fff' : ACCENT
    ctx.fill()
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 1.3
    ctx.stroke()
    ctx.beginPath()
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    if (pk.abstain) {
      ctx.moveTo(cx - 3.2 * u, cy - 3.2 * u)
      ctx.lineTo(cx + 3.2 * u, cy + 3.2 * u)
      ctx.moveTo(cx + 3.2 * u, cy - 3.2 * u)
      ctx.lineTo(cx - 3.2 * u, cy + 3.2 * u)
      ctx.strokeStyle = '#000'
    } else {
      ctx.moveTo(cx - 3.6 * u, cy + 0.2 * u)
      ctx.lineTo(cx - 1 * u, cy + 3 * u)
      ctx.lineTo(cx + 3.8 * u, cy - 2.8 * u)
      ctx.strokeStyle = '#fff'
    }
    ctx.lineWidth = 1.6
    ctx.stroke()
    ctx.restore()
  }

  drawInbrain(ctx) {
    const { u } = this
    const e = this.tipL
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    for (const p of this.inbrain) {
      if (p.t < 0) continue
      const n = this.nodesPx[p.node]
      const k = 1 - Math.pow(1 - p.t, 2.2)
      const mx = (e.x + n[0]) / 2 + p.bend
      const my = (e.y + n[1]) / 2 - p.bend * 0.4
      const x = (1 - k) * (1 - k) * e.x + 2 * (1 - k) * k * mx + k * k * n[0]
      const y = (1 - k) * (1 - k) * e.y + 2 * (1 - k) * k * my + k * k * n[1]
      ctx.font = `600 ${lerp(7.5, 4, k) * u}px ${MONO}`
      ctx.lineWidth = 2.4
      ctx.strokeStyle = 'rgba(255,255,255,0.85)'
      ctx.strokeText(p.ch, x, y)
      ctx.fillStyle = `rgba(49,55,80,${0.82 - 0.22 * k})`
      ctx.fillText(p.ch, x, y)
    }
  }

  drawPulses(ctx) {
    const { u } = this
    for (const p of this.pulses) {
      const dur = p.kind === 'entry' ? 0.6 : p.kind === 'widget' ? 0.9 : 1.1
      const k = (this.t - p.t0) / dur
      if (k >= 1) continue
      const r = (p.kind === 'node' ? 4 + k * 22 : 6 + k * (p.kind === 'widget' ? 40 : 26)) * u
      ctx.beginPath()
      ctx.arc(p.x, p.y, r, 0, TAU)
      const alpha = (p.kind === 'node' || p.kind === 'entry' || p.kind === 'abstain' ? 0.36 : 0.5) * (1 - k)
      ctx.strokeStyle = p.kind === 'widget'
        ? `rgba(98,88,245,${alpha})`
        : `rgba(49,55,80,${alpha})`
      ctx.lineWidth = 1.1
      ctx.stroke()
    }
  }

  drawLabels(ctx) {
    const { s } = this
    const full = this.labelMode === 'full'
    const bs = this.mobile ? 7.5 * s : 10.5 * s
    this.anchors.forEach((a, i) => {
      // guide tick (desktop)
      if (!this.mobile && i !== 6) {
        const top = i === 1 ? this.lineY + this.laneAmp + this.gateR + 6 : this.lineY + this.gateR + 6
        ctx.beginPath()
        ctx.moveTo(a.x, top)
        ctx.lineTo(a.x, a.by - bs - 4)
        ctx.setLineDash([1.5, 3.5])
        ctx.strokeStyle = 'rgba(0,0,0,0.2)'
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.setLineDash([])
      }
      ctx.beginPath()
      ctx.arc(a.bx, a.by, bs, 0, TAU)
      ctx.fillStyle = '#fff'
      ctx.fill()
      ctx.strokeStyle = 'rgba(0,0,0,0.55)'
      ctx.lineWidth = 1.1
      ctx.stroke()
      ctx.font = `600 ${(this.mobile ? 8 : 10.5) * s}px ${SANS}`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = '#000'
      ctx.fillText(String(i + 1), a.bx, a.by + 0.5)
      if (full) {
        ctx.font = `500 ${this.titleFs}px ${SANS}`
        ctx.fillStyle = 'rgba(0,0,0,0.68)'
        ctx.fillText(STEPS[i].title, a.bx, a.by + bs + 15 * s)
      }
    })
    // brain label (mobile)
    if (this.mobile) {
      ctx.font = `500 ${10 * s}px ${SANS}`
      ctx.textAlign = 'center'
      ctx.fillStyle = 'rgba(0,0,0,0.5)'
      ctx.fillText('Knowledge base', this.C.x, this.C.y + 0.9 * this.R + 14)
    }
  }

}
