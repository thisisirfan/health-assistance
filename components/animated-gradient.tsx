'use client'

import { useEffect, useRef } from 'react'

export function AnimatedGradient() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createGradient = (t: number) => {
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height) / 2
      )
      gradient.addColorStop(0, `hsla(${(t * 0.02) % 360}, 100%, 70%, 0.8)`)
      gradient.addColorStop(0.3, `hsla(${((t * 0.02 + 60) % 360)}, 100%, 65%, 0.6)`)
      gradient.addColorStop(0.6, `hsla(${((t * 0.02 + 120) % 360)}, 100%, 60%, 0.4)`)
      gradient.addColorStop(1, `hsla(${((t * 0.02 + 180) % 360)}, 100%, 55%, 0.2)`)
      return gradient
    }

    const animate = (t: number) => {
      ctx.fillStyle = createGradient(t)
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      animationFrameId = requestAnimationFrame(animate)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    animate(0)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10" />
}

