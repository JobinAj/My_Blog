'use client'
import { useEffect, useState } from 'react'

export default function ReadingProgress() {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      const total = scrollHeight - clientHeight
      setPct(total > 0 ? Math.min(100, (scrollTop / total) * 100) : 0)
    }
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  if (pct <= 0) return null

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed', top: 0, left: 0, zIndex: 100,
        height: 2, width: `${pct}%`,
        background: 'var(--nl-accent)',
        boxShadow: '0 0 6px var(--nl-accent-glow)',
        transition: 'width 80ms linear',
        pointerEvents: 'none',
      }}
    />
  )
}
