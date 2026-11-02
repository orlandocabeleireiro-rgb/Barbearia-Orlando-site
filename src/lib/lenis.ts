import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap'

let lenis: Lenis | null = null
const velListeners = new Set<(v: number) => void>()

/** Lenis corre dentro do ticker do GSAP: um só ciclo para scroll suave + pins. */
export function startLenis(reduced: boolean) {
  if (lenis || reduced) return lenis
  lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), touchMultiplier: 1.4 })
  lenis.on('scroll', (e: Lenis) => {
    ScrollTrigger.update()
    velListeners.forEach((fn) => fn(e.velocity))
  })
  gsap.ticker.add((t) => lenis?.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
  return lenis
}

export const getLenis = () => lenis

export function onVelocity(fn: (v: number) => void) {
  velListeners.add(fn)
  return () => void velListeners.delete(fn)
}

export function scrollTo(target: string | number | HTMLElement) {
  if (lenis) lenis.scrollTo(target as never, { duration: 1.6 })
  else if (typeof target === 'string') document.querySelector(target)?.scrollIntoView()
  else if (typeof target === 'number') window.scrollTo(0, target)
  else target.scrollIntoView()
}

export function lockScroll(lock: boolean) {
  if (lenis) lock ? lenis.stop() : lenis.start()
  document.documentElement.style.overflow = lock ? 'hidden' : ''
}
