import { useEffect, useRef } from 'react'

const VERTEX = `
precision mediump float;
attribute vec3 a_position;
attribute float a_size;
uniform float u_time;
uniform vec2 u_pointer;
uniform float u_aspect;
uniform float u_pixel_ratio;
varying mediump float v_depth;
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
varying mediump float v_depth;
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
varying mediump float v_depth;
void main() {
  gl_FragColor = vec4(vec3(0.28), 0.07 + (v_depth + 1.0) * 0.055);
}
`

function makeShader(gl, type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader) || 'Unknown shader compilation error'
    gl.deleteShader(shader)
    throw new Error(message)
  }
  return shader
}

function makeProgram(gl, fragment) {
  const program = gl.createProgram()
  const vertex = makeShader(gl, gl.VERTEX_SHADER, VERTEX)
  const pixel = makeShader(gl, gl.FRAGMENT_SHADER, fragment)
  gl.attachShader(program, vertex)
  gl.attachShader(program, pixel)
  gl.linkProgram(program)
  gl.deleteShader(vertex)
  gl.deleteShader(pixel)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program) || 'Unknown shader link error'
    gl.deleteProgram(program)
    throw new Error(message)
  }
  return program
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
    dots.set([...p, i % 23 === 0 ? 4.4 : i % 5 === 0 ? 3 : 1.8], i * 4)
    for (const step of [1, 11, 27]) {
      const j = i + step
      if (j >= count || (step !== 1 && i % 2)) continue
      edges.push(...p, ...pointAt(j))
    }
  }
  for (let ring = 0; ring < 5; ring++) {
    const lat = -.72 + ring * .36
    const radius = Math.sqrt(1 - lat * lat)
    let previous = null
    for (let k = 0; k <= 180; k++) {
      const angle = k / 180 * Math.PI * 2
      const point = [Math.cos(angle) * radius, lat, Math.sin(angle) * radius]
      if (previous) edges.push(...previous, ...point)
      previous = point
    }
  }
  for (let meridian = 0; meridian < 8; meridian++) {
    const longitude = meridian / 8 * Math.PI
    let previous = null
    for (let k = 0; k <= 120; k++) {
      const angle = -Math.PI / 2 + k / 120 * Math.PI
      const point = [Math.cos(angle) * Math.cos(longitude), Math.sin(angle), Math.cos(angle) * Math.sin(longitude)]
      if (previous) edges.push(...previous, ...point)
      previous = point
    }
  }
  return { dots, edges: new Float32Array(edges) }
}

export default function KnowledgeWebGL() {
  const ref = useRef(null)
  const pointer = useRef([0, 0])

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return

    let gl
    let observer
    let raf = 0
    let dotBuffer
    let lineBuffer
    let dotProgram
    let lineProgram
    let onMove
    let onLeave
    let onContextLost
    let onContextRestored
    let disposed = false

    const fallback = (error) => {
      canvas.dataset.fallback = 'true'
      canvas.setAttribute('aria-label', 'Knowledge network visualization')
      canvas.style.background = 'radial-gradient(ellipse at 50% 50%, rgba(35,35,40,.13), transparent 56%), repeating-radial-gradient(ellipse at 50% 50%, transparent 0 36px, rgba(40,40,45,.055) 37px 38px, transparent 39px 62px)'
      if (error) console.error('KnowledgeWebGL fallback:', error)
    }

    try {
      gl = canvas.getContext('webgl', { alpha: true, antialias: true, powerPreference: 'high-performance' })
      if (!gl) {
        fallback()
        return
      }

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const data = geometry()
      dotProgram = makeProgram(gl, DOT_FRAGMENT)
      lineProgram = makeProgram(gl, LINE_FRAGMENT)

      const createBuffer = (values) => {
        const buffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        gl.bufferData(gl.ARRAY_BUFFER, values, gl.STATIC_DRAW)
        return buffer
      }
      dotBuffer = createBuffer(data.dots)
      lineBuffer = createBuffer(data.edges)

      const locations = (program) => ({
        position: gl.getAttribLocation(program, 'a_position'),
        size: gl.getAttribLocation(program, 'a_size'),
        time: gl.getUniformLocation(program, 'u_time'),
        pointer: gl.getUniformLocation(program, 'u_pointer'),
        aspect: gl.getUniformLocation(program, 'u_aspect'),
        pixel: gl.getUniformLocation(program, 'u_pixel_ratio'),
      })
      const dotLocations = locations(dotProgram)
      const lineLocations = locations(lineProgram)

      let width = 1
      let height = 1
      let dpr = 1
      let start = 0

      const resize = () => {
        const rect = canvas.getBoundingClientRect()
        width = Math.max(1, rect.width)
        height = Math.max(1, rect.height)
        dpr = Math.min(window.devicePixelRatio || 1, 1.7)
        canvas.width = Math.round(width * dpr)
        canvas.height = Math.round(height * dpr)
        gl.viewport(0, 0, canvas.width, canvas.height)
      }
      observer = new ResizeObserver(resize)
      observer.observe(canvas)
      resize()

      const draw = (program, locations, buffer, count, mode, stride, sized, time) => {
        gl.useProgram(program)
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        if (locations.position >= 0) {
          gl.enableVertexAttribArray(locations.position)
          gl.vertexAttribPointer(locations.position, 3, gl.FLOAT, false, stride, 0)
        }
        if (sized && locations.size >= 0) {
          gl.enableVertexAttribArray(locations.size)
          gl.vertexAttribPointer(locations.size, 1, gl.FLOAT, false, stride, 12)
        }
        if (locations.time) gl.uniform1f(locations.time, time)
        if (locations.pointer) gl.uniform2f(locations.pointer, pointer.current[0], pointer.current[1])
        if (locations.aspect) gl.uniform1f(locations.aspect, width / height)
        if (locations.pixel) gl.uniform1f(locations.pixel, dpr)
        gl.drawArrays(mode, 0, count)
      }

      const render = (now) => {
        if (disposed) return
        start = start || now
        const time = reduced ? .3 : (now - start) / 1000
        gl.clearColor(1, 1, 1, 0)
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.enable(gl.BLEND)
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
        gl.disable(gl.DEPTH_TEST)
        draw(lineProgram, lineLocations, lineBuffer, data.edges.length / 3, gl.LINES, 12, false, time)
        draw(dotProgram, dotLocations, dotBuffer, data.dots.length / 4, gl.POINTS, 16, true, time)
        if (!reduced) raf = requestAnimationFrame(render)
      }

      onMove = (event) => {
        const rect = canvas.getBoundingClientRect()
        pointer.current = [((event.clientX - rect.left) / rect.width - .5) * 2, (.5 - (event.clientY - rect.top) / rect.height) * 2]
      }
      onLeave = () => { pointer.current = [0, 0] }
      onContextLost = (event) => {
        event.preventDefault()
        cancelAnimationFrame(raf)
        fallback(new Error('WebGL context lost'))
      }
      onContextRestored = () => window.location.reload()

      canvas.addEventListener('pointermove', onMove)
      canvas.addEventListener('pointerleave', onLeave)
      canvas.addEventListener('webglcontextlost', onContextLost)
      canvas.addEventListener('webglcontextrestored', onContextRestored)
      raf = requestAnimationFrame(render)

      return () => {
        disposed = true
        cancelAnimationFrame(raf)
        observer?.disconnect()
        canvas.removeEventListener('pointermove', onMove)
        canvas.removeEventListener('pointerleave', onLeave)
        canvas.removeEventListener('webglcontextlost', onContextLost)
        canvas.removeEventListener('webglcontextrestored', onContextRestored)
        if (dotBuffer) gl.deleteBuffer(dotBuffer)
        if (lineBuffer) gl.deleteBuffer(lineBuffer)
        if (dotProgram) gl.deleteProgram(dotProgram)
        if (lineProgram) gl.deleteProgram(lineProgram)
      }
    } catch (error) {
      cancelAnimationFrame(raf)
      observer?.disconnect()
      fallback(error)
      return () => { disposed = true }
    }
  }, [])

  return <canvas ref={ref} className="knowledge-webgl" aria-label="Interactive three-dimensional knowledge network" role="img" />
}
