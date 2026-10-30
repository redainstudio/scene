// Monochrome file icons drawn with the canvas API. All drawing happens in a
// local, centred coordinate space; callers translate / scale beforehand.

export const DOC_W = 38
export const DOC_H = 48
export const FOLDER_W = 46
export const FOLDER_H = 36

export const FILE_TYPES = ['folder', 'pdf', 'xlsx', 'txt', 'docx', 'doc', 'img']

export function boxOf(type) {
  return type === 'folder' ? { w: FOLDER_W, h: FOLDER_H } : { w: DOC_W, h: DOC_H }
}

export function gridOf(type) {
  return type === 'folder' ? { cols: 5, rows: 4 } : { cols: 4, rows: 6 }
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
  const r = 2.5
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
  ctx.fillStyle = `rgba(0,0,0,${a})`
  ctx.fill()
  ctx.fillStyle = `rgba(255,255,255,${a})`
  ctx.font = `700 6.2px ${SANS}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(label, 0, y + h / 2 + 0.4)
}

function line(ctx, x1, y1, x2, y2, a, w = 1.2) {
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.strokeStyle = `rgba(0,0,0,${a})`
  ctx.lineWidth = w
  ctx.lineCap = 'round'
  ctx.stroke()
}

function drawDoc(ctx, type, a) {
  docPath(ctx)
  ctx.fillStyle = `rgba(255,255,255,${a})`
  ctx.fill()
  ctx.lineWidth = 1.2
  ctx.lineJoin = 'round'
  ctx.strokeStyle = `rgba(0,0,0,${a})`
  ctx.stroke()

  // Folded corner
  const x = -DOC_W / 2
  const y = -DOC_H / 2
  ctx.beginPath()
  ctx.moveTo(x + DOC_W - 9, y)
  ctx.lineTo(x + DOC_W - 9, y + 9)
  ctx.lineTo(x + DOC_W, y + 9)
  ctx.stroke()

  const lx = x + 6
  const t = y + 13
  const soft = 0.32 * a

  if (type === 'pdf') {
    line(ctx, lx, t, lx + 18, t, 0.8 * a, 2)
    line(ctx, lx, t + 6, lx + 26, t + 6, soft)
    line(ctx, lx, t + 11, lx + 26, t + 11, soft)
    line(ctx, lx, t + 16, lx + 15, t + 16, soft)
    badge(ctx, 'PDF', a)
  } else if (type === 'xlsx') {
    const gx = lx
    const gy = t - 2
    const gw = 26
    const gh = 19
    ctx.strokeStyle = `rgba(0,0,0,${0.55 * a})`
    ctx.lineWidth = 0.9
    ctx.strokeRect(gx, gy, gw, gh)
    for (let i = 1; i < 3; i++) line(ctx, gx + (gw / 3) * i, gy, gx + (gw / 3) * i, gy + gh, 0.4 * a, 0.9)
    for (let i = 1; i < 4; i++) line(ctx, gx, gy + (gh / 4) * i, gx + gw, gy + (gh / 4) * i, 0.4 * a, 0.9)
    ctx.fillStyle = `rgba(0,0,0,${0.75 * a})`
    ctx.fillRect(gx, gy, gw / 3, gh / 4)
    badge(ctx, 'XLS', a)
  } else if (type === 'img') {
    const gx = lx
    const gy = t - 2
    ctx.strokeStyle = `rgba(0,0,0,${0.55 * a})`
    ctx.lineWidth = 0.9
    ctx.strokeRect(gx, gy, 26, 19)
    ctx.beginPath()
    ctx.arc(gx + 18, gy + 6, 2.4, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(0,0,0,${0.7 * a})`
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(gx + 1, gy + 18)
    ctx.lineTo(gx + 9, gy + 9)
    ctx.lineTo(gx + 14, gy + 14)
    ctx.lineTo(gx + 18, gy + 11)
    ctx.lineTo(gx + 25, gy + 18)
    ctx.strokeStyle = `rgba(0,0,0,${0.7 * a})`
    ctx.stroke()
    badge(ctx, 'IMG', a)
  } else if (type === 'txt') {
    const lens = [26, 22, 26, 18, 24]
    lens.forEach((l, i) => line(ctx, lx, t - 1 + i * 5, lx + l, t - 1 + i * 5, soft * 1.25))
    badge(ctx, 'TXT', a)
  } else if (type === 'docx') {
    line(ctx, lx, t, lx + 20, t, 0.8 * a, 2)
    line(ctx, lx, t + 6, lx + 26, t + 6, soft)
    line(ctx, lx, t + 11, lx + 24, t + 11, soft)
    line(ctx, lx, t + 16, lx + 26, t + 16, soft)
    badge(ctx, 'DOCX', a)
  } else {
    line(ctx, lx, t, lx + 14, t, 0.8 * a, 2)
    line(ctx, lx, t + 6, lx + 26, t + 6, soft)
    line(ctx, lx, t + 11, lx + 26, t + 11, soft)
    line(ctx, lx, t + 16, lx + 20, t + 16, soft)
    badge(ctx, 'DOC', a)
  }
}

function drawFolder(ctx, a) {
  const x0 = -FOLDER_W / 2
  const x1 = FOLDER_W / 2
  const yTop = -FOLDER_H / 2
  const yBody = yTop + 6
  const yBot = FOLDER_H / 2
  ctx.beginPath()
  ctx.moveTo(x0, yBot)
  ctx.lineTo(x0, yTop + 2)
  ctx.lineTo(x0 + 2, yTop)
  ctx.lineTo(x0 + 14, yTop)
  ctx.lineTo(x0 + 18, yBody)
  ctx.lineTo(x1 - 2, yBody)
  ctx.lineTo(x1, yBody + 2)
  ctx.lineTo(x1, yBot - 2)
  ctx.lineTo(x1 - 2, yBot)
  ctx.closePath()
  ctx.fillStyle = `rgba(255,255,255,${a})`
  ctx.fill()
  ctx.lineWidth = 1.2
  ctx.lineJoin = 'round'
  ctx.strokeStyle = `rgba(0,0,0,${a})`
  ctx.stroke()
  line(ctx, x0 + 1, yBody + 6, x1 - 1, yBody + 6, 0.45 * a, 1)
  line(ctx, x0 + 7, yBody + 13, x0 + 22, yBody + 13, 0.32 * a)
  line(ctx, x0 + 7, yBody + 18, x0 + 17, yBody + 18, 0.32 * a)
}

export function drawFile(ctx, type, a = 1) {
  if (type === 'folder') drawFolder(ctx, a)
  else drawDoc(ctx, type, a)
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
