import { useEffect, type RefObject } from 'react'
import { gsap } from '../lib/gsap'

/** Efeito magnético: o elemento é puxado na direção do rato. */
export function useMagnetic(ref: RefObject<HTMLElement>, strength = 0.35, enabled = true) {
  useEffect(() => {
    const el = ref.current
    if (!el || !enabled) return
    const xTo = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.35)' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.35)' })
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      xTo((e.clientX - (r.left + r.width / 2)) * strength)
      yTo((e.clientY - (r.top + r.height / 2)) * strength)
    }
    const leave = () => {
      xTo(0)
      yTo(0)
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [ref, strength, enabled])
}
