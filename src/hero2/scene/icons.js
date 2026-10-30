// Monochrome file icons drawn with the canvas API. All drawing happens in a
// local, centred coordinate space; callers translate / scale beforehand.

export const DOC_W = 38
export const DOC_H = 48

export const FILE_TYPES = ['pdf', 'xlsx', 'txt', 'docx', 'doc', 'img']

export function boxOf(type) {
  return { w: DOC_W, h: DOC_H }
}

const SANS = '"Inter", system-ui, -apple-system, "Segoe UI", sans-serif'

function docPath(ctx) {
  const x = -DOC_W / 2
  const y = -DOC_H / 2
  const r = 3
  const f = 9
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + DOC_W - f, y)
  ctx.lineTo(x + DOC_W, y + f)
  ctx.lineTo(x + DOC_W, y + DOC_H - r)
  ctx.arcTo(x + DOC_W, y + DOC_H, x + DOC_W - r, y + DOC_H, r)
  ctx.lineTo(x + r, y + DOC_H)
  ctx.arcTo(x, y + DOC_H, x, y + DOC_H - r, r)
  ctx.lineTo(x, y + r)
  ctx.arcTo(x, y, x + r, y, r)
  ctx.closePath()
}

function badge(ctx, label, a) {
  const w = DOC_W - 10
  const h = 9
  const x = -w / 2
  const y = DOC_H / 2 - 14
  const r = 4.5
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
  ctx.fillStyle = `rgba(98,88,245,${0.13 * a})`
  ctx.fill()
  ctx.fillStyle = `rgba(80,72,190,${0.95 * a})`
  ctx.font = `700 6.1px ${SANS}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(label, 0, y + h / 2 + 0.4)
}

function line(ctx, x1, y1, x2, y2, a, w = 1.2) {
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.strokeStyle = `rgba(35,39,62,${a})`
  ctx.lineWidth = w
  ctx.lineCap = 'round'
  ctx.stroke()
}

function drawDoc(ctx, type, a) {
  const x = -DOC_W / 2
  const y = -DOC_H / 2
  docPath(ctx)
  const paper = ctx.createLinearGradient(x, y, x + DOC_W, y + DOC_H)
  paper.addColorStop(0, `rgba(255,255,255,${a})`)
  paper.addColorStop(1, `rgba(244,243,255,${a})`)
  ctx.fillStyle = paper
  ctx.shadowColor = `rgba(49,45,110,${0.12 * a})`
  ctx.shadowBlur = 5
  ctx.shadowOffsetY = 2
  ctx.fill()
  ctx.shadowColor = 'transparent'
  ctx.shadowBlur = 0
  ctx.shadowOffsetY = 0
  ctx.lineWidth = 1.25
  ctx.lineJoin = 'round'
  ctx.strokeStyle = `rgba(35,39,62,${0.88 * a})`
  ctx.stroke()

  // folded corner with a violet crease
  ctx.beginPath()
  ctx.moveTo(x + DOC_W - 9, y)
  ctx.lineTo(x + DOC_W - 9, y + 9)
  ctx.lineTo(x + DOC_W, y + 9)
  ctx.strokeStyle = `rgba(98,88,245,${0.72 * a})`
  ctx.lineWidth = 1
  ctx.stroke()

  const lx = x + 6
  const t = y + 13
  const soft = 0.38 * a
  ctx.beginPath()
  ctx.arc(lx + 1, t - 4, 1.5, 0, Math.PI * 2)
  ctx.fillStyle = `rgba(98,88,245,${0.85 * a})`
  ctx.fill()

  if (type === 'pdf' || type === 'docx' || type === 'doc') {
    const widths = type === 'pdf' ? [25, 20, 24, 17] : [25, 23, 26, 20, 24]
    widths.forEach((l, i) => line(ctx, lx, t + i * 5, lx + l, t + i * 5, i === 0 ? 0.72 * a : soft, i === 0 ? 1.6 : 1.1))
    badge(ctx, type.toUpperCase(), a)
  } else if (type === 'xlsx') {
    const gx = lx
    const gy = t - 2
    const gw = 26
    const gh = 19
    ctx.fillStyle = `rgba(98,88,245,${0.07 * a})`
    ctx.fillRect(gx, gy, gw, gh)
    ctx.strokeStyle = `rgba(35,39,62,${0.55 * a})`
    ctx.lineWidth = 0.9
    ctx.strokeRect(gx, gy, gw, gh)
    for (let i = 1; i < 3; i++) line(ctx, gx + (gw / 3) * i, gy, gx + (gw / 3) * i, gy + gh, 0.35 * a, 0.8)
    for (let i = 1; i < 4; i++) line(ctx, gx, gy + (gh / 4) * i, gx + gw, gy + (gh / 4) * i, 0.35 * a, 0.8)
    ctx.fillStyle = `rgba(98,88,245,${0.65 * a})`
    ctx.fillRect(gx, gy, gw / 3, gh / 4)
    badge(ctx, 'XLS', a)
  } else if (type === 'img') {
    const gx = lx
    const gy = t - 2
    ctx.fillStyle = `rgba(98,88,245,${0.06 * a})`
    ctx.fillRect(gx, gy, 26, 19)
    ctx.strokeStyle = `rgba(35,39,62,${0.55 * a})`
    ctx.lineWidth = 0.9
    ctx.strokeRect(gx, gy, 26, 19)
    ctx.beginPath()
    ctx.arc(gx + 18, gy + 6, 2.4, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(98,88,245,${0.78 * a})`
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(gx + 1, gy + 18)
    ctx.lineTo(gx + 9, gy + 9)
    ctx.lineTo(gx + 14, gy + 14)
    ctx.lineTo(gx + 18, gy + 11)
    ctx.lineTo(gx + 25, gy + 18)
    ctx.strokeStyle = `rgba(35,39,62,${0.7 * a})`
    ctx.stroke()
    badge(ctx, 'IMG', a)
  } else {
    const lens = [25, 22, 25, 18, 23]
    lens.forEach((l, i) => line(ctx, lx, t - 1 + i * 5, lx + l, t - 1 + i * 5, soft, 1.1))
    badge(ctx, 'TXT', a)
  }
}

export function drawFile(ctx, type, a = 1) {
  drawDoc(ctx, type, a)
}


// Plain extracted text: a page with lines and no badge.
export function drawTextPage(ctx, a = 1) {
  docPath(ctx)
  ctx.fillStyle = `rgba(255,255,255,${a})`
  ctx.fill()
  ctx.lineWidth = 1.2
  ctx.lineJoin = 'round'
  ctx.strokeStyle = `rgba(0,0,0,${a})`
  ctx.stroke()
  const x = -DOC_W / 2
  const y = -DOC_H / 2
  ctx.beginPath()
  ctx.moveTo(x + DOC_W - 9, y)
  ctx.lineTo(x + DOC_W - 9, y + 9)
  ctx.lineTo(x + DOC_W, y + 9)
  ctx.stroke()
  const lens = [26, 22, 26, 20, 26, 14]
  lens.forEach((l, i) => line(ctx, x + 6, y + 14 + i * 5.4, x + 6 + l, y + 14 + i * 5.4, 0.55 * a, 1.3))
}

function rr(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.arcTo(x + w, y, x + w, y + r, r)
  ctx.lineTo(x + w, y + h - r)
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
  ctx.lineTo(x + r, y + h)
  ctx.arcTo(x, y + h, x, y + h - r, r)
  ctx.lineTo(x, y + r)
  ctx.arcTo(x, y, x + r, y, r)
  ctx.closePath()
}

// A retrieved / chunked passage.
export function drawChunkCard(ctx, a = 1, w = 28, h = 16) {
  rr(ctx, -w / 2, -h / 2, w, h, 3)
  ctx.fillStyle = `rgba(255,255,255,${a})`
  ctx.fill()
  ctx.lineWidth = 1.1
  ctx.strokeStyle = `rgba(0,0,0,${a})`
  ctx.stroke()
  if (h > 11) {
    const k = Math.min(1, (h - 11) / 5)
    ctx.fillStyle = `rgba(0,0,0,${a * k})`
    ctx.fillRect(-w / 2 + 3, -h / 2 + 3.5, 2.2, h - 7)
    line(ctx, -w / 2 + 8, -2.2, w / 2 - 4, -2.2, 0.5 * a * k, 1.2)
    line(ctx, -w / 2 + 8, 2.6, w / 2 - 10, 2.6, 0.35 * a * k, 1.2)
  }
}

export function drawRoundRect(ctx, x, y, w, h, r) {
  rr(ctx, x, y, w, h, r)
}
