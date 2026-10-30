import { useEffect, useRef } from 'react'

const VERTEX = `
attribute vec3 a_position;
attribute float a_size;
uniform float u_time;
uniform vec2 u_pointer;
uniform float u_aspect;
uniform float u_pixel_ratio;
varying float v_depth;
void main() {
  float t = u_time * 0.12;
  float cy = cos(t), sy = sin(t);
  vec3 p = a_position;
  float x = p.x * cy - p.z * sy;
  float z = p.x * sy + p.z * cy;
  float tilt = u_pointer.y * 0.15 + 0.035 * sin(u_time * 0.2);
  float cx = cos(tilt), sx = sin(tilt);
  float y = p.y * cx - z * sx;
  z = p.y * sx + z * cx;
  float yaw = u_pointer.x * 0.16;
  float c = cos(yaw), s = sin(yaw);
  float xx = x * c + z * s;
  z = -x * s + z * c;
  float perspective = 2.7 / (2.7 - z * 0.42);
  vec2 pos = vec2(xx * 0.78, y * 0.9) * perspective;
  pos.x /= u_aspect;
  gl_Position = vec4(pos, z * 0.32, 1.0);
  v_depth = z;
  gl_PointSize = a_size * u_pixel_ratio * (0.8 + (z + 1.0) * 0.48);
}
`
const DOT_FRAGMENT = `
precision mediump float;
uniform float u_time;
varying float v_depth;
void main() {
  vec2 p = gl_PointCoord - 0.5;
  float d = length(p);
  if (d > 0.5) discard;
  float alpha = smoothstep(0.5, 0.08, d) * (0.28 + (v_depth + 1.0) * 0.29);
  alpha *= 0.88 + 0.12 * sin(u_time * 1.5 + v_depth * 8.0);
  gl_FragColor = vec4(vec3(0.12 + (v_depth + 1.0) * 0.035), alpha);
}
`
const LINE_FRAGMENT = `
precision mediump float;
varying float v_depth;
void main() {
  gl_FragColor = vec4(vec3(0.28), 0.07 + (v_depth + 1.0) * 0.055);
}
`

function makeShader(gl, type, source) {
  const s = gl.createShader(type)
  gl.shaderSource(s, source)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s))
  return s
}
function makeProgram(gl, fragment) {
  const p = gl.createProgram()
  gl.attachShader(p, makeShader(gl, gl.VERTEX_SHADER, VERTEX))
  gl.attachShader(p, makeShader(gl, gl.FRAGMENT_SHADER, fragment))
  gl.linkProgram(p)
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p))
  return p
}
function geometry() {
  const count = 1500
  const dots = new Float32Array(count * 4)
  const edges = []
  const golden = Math.PI * (3 - Math.sqrt(5))
  const pointAt = (i) => {
    const y = 1 - (i / (count - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const a = golden * i
    const shell = (i % 9 === 0 ? .72 : i % 4 === 0 ? .86 : 1) * (1 + .025 * Math.sin(i * 17))
    return [Math.cos(a) * r * shell, y * shell, Math.sin(a) * r * shell]
  }
  for (let i = 0; i < count; i++) {
    const p = pointAt(i)
    dots.set([...p, i % 23 === 0 ? 4.4 : i % 5 === 0 ? 3.0 : 1.8], i * 4)
    for (const step of [1, 11, 27]) {
      const j = i + step
      if (j >= count || (step !== 1 && i % 2)) continue
      edges.push(...p, ...pointAt(j))
    }
  }
  // Orbital latitude and longitude scaffolding.
  for (let ring = 0; ring < 5; ring++) {
    const lat = -.72 + ring * .36
    const rad = Math.sqrt(1 - lat * lat)
    let prev = null
    for (let k = 0; k <= 180; k++) {
      const a = k / 180 * Math.PI * 2
      const p = [Math.cos(a) * rad, lat, Math.sin(a) * rad]
      if (prev) edges.push(...prev, ...p)
      prev = p
    }
  }
  for (let meridian = 0; meridian < 8; meridian++) {
    const lon = meridian / 8 * Math.PI
    let prev = null
    for (let k = 0; k <= 120; k++) {
      const a = -Math.PI / 2 + k / 120 * Math.PI
      const p = [Math.cos(a) * Math.cos(lon), Math.sin(a), Math.cos(a) * Math.sin(lon)]
      if (prev) edges.push(...prev, ...p)
      prev = p
    }
  }
  return { dots, edges: new Float32Array(edges) }
}

export default function KnowledgeWebGL() {
  const ref = useRef(null)
  const pointer = useRef([0, 0])
  useEffect(() => {
    const canvas = ref.current
    const gl = canvas.getContext('webgl', { alpha: true, antialias: true, powerPreference: 'high-performance' })
    if (!gl) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0, start = 0, width = 1, height = 1, dpr = 1
    const data = geometry()
    const dotProgram = makeProgram(gl, DOT_FRAGMENT)
    const lineProgram = makeProgram(gl, LINE_FRAGMENT)
    const buffer = (values) => {
      const b = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, b)
      gl.bufferData(gl.ARRAY_BUFFER, values, gl.STATIC_DRAW)
      return b
    }
    const dotBuffer = buffer(data.dots)
    const lineBuffer = buffer(data.edges)
    const locations = (p) => ({
      pos: gl.getAttribLocation(p, 'a_position'),
      size: gl.getAttribLocation(p, 'a_size'),
      time: gl.getUniformLocation(p, 'u_time'),
      pointer: gl.getUniformLocation(p, 'u_pointer'),
      aspect: gl.getUniformLocation(p, 'u_aspect'),
      pixel: gl.getUniformLocation(p, 'u_pixel_ratio'),
    })
    const dl = locations(dotProgram), ll = locations(lineProgram)
    const resize = () => {
      const r = canvas.getBoundingClientRect()
      width = Math.max(1, r.width); height = Math.max(1, r.height)
      dpr = Math.min(window.devicePixelRatio || 1, 1.7)
      canvas.width = width * dpr; canvas.height = height * dpr
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    const observer = new ResizeObserver(resize)
    observer.observe(canvas); resize()
    const draw = (p, loc, b, count, mode, stride, sized, t) => {
      gl.useProgram(p); gl.bindBuffer(gl.ARRAY_BUFFER, b)
      gl.enableVertexAttribArray(loc.pos)
      gl.vertexAttribPointer(loc.pos, 3, gl.FLOAT, false, stride, 0)
      if (sized) {
        gl.enableVertexAttribArray(loc.size)
        gl.vertexAttribPointer(loc.size, 1, gl.FLOAT, false, stride, 12)
      }
      gl.uniform1f(loc.time, t)
      gl.uniform2f(loc.pointer, pointer.current[0], pointer.current[1])
      gl.uniform1f(loc.aspect, width / height)
      gl.uniform1f(loc.pixel, dpr)
      gl.drawArrays(mode, 0, count)
    }
    const render = (now) => {
      raf = requestAnimationFrame(render)
      start = start || now
      const t = reduced ? .3 : (now - start) / 1000
      gl.clearColor(1, 1, 1, 0); gl.clear(gl.COLOR_BUFFER_BIT)
      gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
      gl.disable(gl.DEPTH_TEST)
      draw(lineProgram, ll, lineBuffer, data.edges.length / 3, gl.LINES, 12, false, t)
      draw(dotProgram, dl, dotBuffer, data.dots.length / 4, gl.POINTS, 16, true, t)
      if (reduced) cancelAnimationFrame(raf)
    }
    const move = (e) => {
      const r = canvas.getBoundingClientRect()
      pointer.current = [((e.clientX - r.left) / r.width - .5) * 2, (.5 - (e.clientY - r.top) / r.height) * 2]
    }
    const leave = () => { pointer.current = [0, 0] }
    canvas.addEventListener('pointermove', move)
    canvas.addEventListener('pointerleave', leave)
    raf = requestAnimationFrame(render)
    return () => {
      cancelAnimationFrame(raf); observer.disconnect()
      canvas.removeEventListener('pointermove', move); canvas.removeEventListener('pointerleave', leave)
      gl.deleteBuffer(dotBuffer); gl.deleteBuffer(lineBuffer)
      gl.deleteProgram(dotProgram); gl.deleteProgram(lineProgram)
    }
  }, [])
  return <canvas ref={ref} className="knowledge-webgl" aria-label="Interactive three-dimensional knowledge network" role="img" />
}
