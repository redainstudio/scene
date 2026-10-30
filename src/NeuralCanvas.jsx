import { useEffect, useRef } from 'react'
import { PipelineScene } from './scene/pipelineScene.js'

const makeCanvas = (w, h) => {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return c
}

export default function NeuralCanvas() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const scene = new PipelineScene({ createCanvas: makeCanvas })
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let raf = 0
    let last = 0
    let onScreen = true

    const fit = () => {
      const r = canvas.getBoundingClientRect()
      if (!r.width || !r.height) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(r.width * dpr)
      canvas.height = Math.round(r.height * dpr)
      scene.resize(r.width, r.height, dpr)
      if (reduce) {
        for (let i = 0; i < 700; i++) scene.step(1 / 60)
        scene.draw(ctx)
      }
    }

    const tick = (now) => {
      raf = requestAnimationFrame(tick)
      if (!onScreen || document.hidden) {
        last = 0
        return
      }
      const dt = last ? (now - last) / 1000 : 0
      last = now
      scene.step(dt)
      scene.draw(ctx)
    }

    // Hover / tap a step to read what it does.
    const local = (e) => {
      const r = canvas.getBoundingClientRect()
      return [e.clientX - r.left, e.clientY - r.top]
    }
    const onMove = (e) => {
      const [x, y] = local(e)
      const hit = scene.pointer(x, y)
      canvas.style.cursor = hit >= 0 ? 'pointer' : 'default'
      if (reduce) {
        scene.step(0)
        scene.draw(ctx)
      }
    }
    const onLeave = () => {
      scene.pointer(null)
      canvas.style.cursor = 'default'
    }
    const onDown = (e) => {
      const [x, y] = local(e)
      const hit = scene.pointer(x, y)
      if (hit >= 0) scene.pin(hit)
      if (e.pointerType !== 'mouse') scene.pointer(null)
    }

    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(canvas)
    const io = new IntersectionObserver(([e]) => (onScreen = e.isIntersecting))
    io.observe(canvas)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerleave', onLeave)
    canvas.addEventListener('pointerdown', onDown)
    if (!reduce) raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerleave', onLeave)
      canvas.removeEventListener('pointerdown', onDown)
    }
  }, [])

  return <canvas ref={ref} className="hero__canvas" aria-label="How the bot is built: upload, extract, chunk, embed, index, retrieve, rerank, verify, answer, deploy" role="img" />
}
