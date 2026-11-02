import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { onVelocity } from '../lib/lenis'
import { useMotion } from '../context/MotionContext'

const WORDS = ['Corte', 'Barba', 'Navalha', 'Porto']

function Row({ dir, tone }: { dir: 1 | -1; tone: 'red' | 'navy' }) {
  const track = useRef<HTMLDivElement>(null)
  const { reduced } = useMotion()

  useEffect(() => {
    const el = track.current
    if (!el || reduced) return
    let x = 0
    let vel = 0
    let sign = 1
    const half = () => el.scrollWidth / 2
    const off = onVelocity((v) => {
      vel = v
      if (Math.abs(v) > 0.4) sign = Math.sign(v)
    })
    // fallback sem Lenis (scroll nativo)
    let lastY = window.scrollY
    const native = () => {
      const d = window.scrollY - lastY
      lastY = window.scrollY
      if (Math.abs(d) > 0.5) {
        vel = d
        sign = Math.sign(d)
      }
    }
    window.addEventListener('scroll', native, { passive: true })
    let on = false
    const io = new IntersectionObserver(([e]) => (on = e.isIntersecting), { rootMargin: '100px' })
    io.observe(el)
    const tick = (_t: number, dt: number) => {
      if (!on) return
      const base = 60 // px/s
      const boost = Math.min(Math.abs(vel) * 28, 1600)
      x -= ((base + boost) * dir * sign * dt) / 1000
      vel *= 0.9
      const w = half()
      if (w) x = ((x % w) - w) % w
      el.style.transform = `translate3d(${x}px,0,0)`
    }
    gsap.ticker.add(tick)
    return () => {
      off()
      io.disconnect()
      window.removeEventListener('scroll', native)
      gsap.ticker.remove(tick)
    }
  }, [dir, reduced])

  const items = Array.from({ length: 4 }, () => WORDS).flat()
  const bg = tone === 'red' ? 'bg-barber text-cream' : 'bg-navy text-cream/90 border-y border-brass/30'
  return (
    <div className={`${bg} overflow-hidden py-4 md:py-6`}>
      <div ref={track} className="marquee-track">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center" aria-hidden={k === 1}>
            {items.map((w, i) => (
              <span key={i} className="flex items-center">
                <span className={`display px-5 text-[13vw] md:px-8 md:text-[7vw] ${i % 2 && tone === 'red' ? 'font-normal italic' : ''}`}>{w}</span>
                <span className="text-[5vw] text-brass md:text-[2.4vw]">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function Marquee() {
  return (
    <section className="relative overflow-hidden bg-abyss py-[14vh]" aria-label="Corte, barba, navalha, Porto">
      <div className="relative left-1/2 w-[130vw] -translate-x-1/2 -rotate-[4deg]">
        <Row dir={1} tone="red" />
      </div>
      <div className="relative left-1/2 -mt-6 w-[130vw] -translate-x-1/2 rotate-[3deg] opacity-90 md:-mt-10">
        <Row dir={-1} tone="navy" />
      </div>
    </section>
  )
}
