import { useRef } from 'react'
import { gsap } from '../lib/gsap'
import { euro } from '../data/site'
import { useScrollSetup } from '../hooks/useScrollSetup'

/** Preço com contador animado quando entra no ecrã. */
export function PriceCounter({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  useScrollSetup(() => {
    const el = ref.current
    if (!el) return
    const o = { v: 0 }
    el.textContent = euro(0)
    const t = gsap.to(o, {
      v: value,
      duration: 1.6,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      onUpdate: () => {
        el.textContent = euro(o.v)
      },
    })
    return () => {
      t.scrollTrigger?.kill()
      t.kill()
      el.textContent = euro(value)
    }
  }, [value])
  return (
    <span ref={ref} className={`tabular-nums ${className ?? ''}`}>
      {euro(value)}
    </span>
  )
}
