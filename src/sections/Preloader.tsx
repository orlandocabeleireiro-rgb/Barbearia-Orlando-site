import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import { useMotion } from '../context/MotionContext'
import { getSequenceManifest, loadAll, sequenceFrames } from '../lib/assetLoader'
import { lockScroll } from '../lib/lenis'
import { CORTE_FALLBACK } from './corteAssets'

const HeroScene = lazy(() => import('../three/HeroScene'))

/**
 * Preloader: o poste gira enquanto o contador mostra o progresso REAL do
 * carregamento (frames da sequência, imagens críticas, fontes, chunk 3D).
 * No fim, uma cortina divide-se ao meio e revela o hero.
 */
const KEY = 'bo-visited'
const DAYS = 30

/** Visita recente? (o preloader completo aparece só na primeira visita / a cada 30 dias) */
function isReturning() {
  try {
    const t = Number(localStorage.getItem(KEY))
    return !!t && Date.now() - t < DAYS * 864e5
  } catch {
    return false
  }
}
function markVisited() {
  try {
    localStorage.setItem(KEY, String(Date.now()))
  } catch {
    /* sem armazenamento: mostra sempre o preloader */
  }
}

export function Preloader() {
  const [returning] = useState(isReturning)
  return returning ? <QuickStart /> : <FullPreloader />
}

/** Visitas seguintes: abre logo no início, com a entrada do título. */
function QuickStart() {
  const { setReady } = useMotion()
  useEffect(() => {
    document.getElementById('boot')?.remove()
    window.scrollTo(0, 0)
    markVisited()
    setReady(true)
  }, [setReady])
  return null
}

function FullPreloader() {
  const { reduced, mobile, setReady } = useMotion()
  const [pct, setPct] = useState(0)
  const [gone, setGone] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const shown = useRef({ v: 0 })
  const counter = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    // remove o preloader estático do index.html (pintado antes do JS)
    document.getElementById('boot')?.remove()
    lockScroll(true)
    window.scrollTo(0, 0)
    let alive = true
    const parts = { frames: 0, fonts: 0, three: 0 }
    const update = () => setPct(parts.frames * 0.75 + parts.fonts * 0.1 + parts.three * 0.15)

    const fonts = document.fonts.ready.then(() => ((parts.fonts = 1), update()))
    const three = reduced || mobile
      ? Promise.resolve().then(() => ((parts.three = 1), update()))
      : import('../three/HeroScene').then(() => ((parts.three = 1), update()))
    const frames = getSequenceManifest().then((m) => {
      const list = m ? sequenceFrames(m, mobile) : CORTE_FALLBACK
      // no telemóvel bloqueia só no primeiro terço; o resto continua em segundo plano
      const critical = mobile && m ? list.filter((_, i) => i % 3 === 0) : list
      return loadAll(critical, (p) => ((parts.frames = p), update())).then(() => {
        if (critical !== list) loadAll(list, () => {}, 3)
      })
    })
    const minTime = new Promise((r) => setTimeout(r, reduced ? 200 : mobile ? 900 : 1400))
    const maxTime = new Promise((r) => setTimeout(r, 9000))

    Promise.race([Promise.all([fonts, three, frames, minTime]), maxTime]).then(() => {
      if (!alive) return
      parts.frames = parts.fonts = parts.three = 1
      update()
    })
    return () => {
      alive = false
    }
  }, [mobile, reduced])

  // contador com inércia, para nunca saltar números
  useEffect(() => {
    const t = gsap.to(shown.current, {
      v: pct * 100,
      duration: pct >= 1 ? 0.6 : 1.2,
      ease: 'power2.out',
      onUpdate: () => {
        if (counter.current) counter.current.textContent = String(Math.round(shown.current.v)).padStart(3, '0')
      },
      onComplete: () => {
        if (pct >= 1) reveal()
      },
    })
    return () => void t.kill()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pct])

  const reveal = () => {
    const el = root.current
    if (!el) return
    const done = () => {
      markVisited()
      lockScroll(false)
      setGone(true)
    }
    if (reduced) {
      setReady(true)
      gsap.to(el, { opacity: 0, duration: 0.4, onComplete: done })
      return
    }
    const tl = gsap.timeline({ onComplete: done })
    tl.to('.pre-ui', { yPercent: -120, duration: 0.7, ease: 'expo.in', stagger: 0.04 })
      .to('.pre-pole', { scale: 0.6, opacity: 0, duration: 0.6, ease: 'expo.in' }, '<')
      .add(() => setReady(true), '-=0.1')
      .to('.pre-top', { yPercent: -100, duration: 1.2, ease: 'expo.inOut' }, '-=0.05')
      .to('.pre-bot', { yPercent: 100, duration: 1.2, ease: 'expo.inOut' }, '<')
      .to('.pre-seam', { scaleX: 0, duration: 0.5, ease: 'expo.in' }, '<')
  }

  if (gone) return null

  return (
    <div ref={root} className="fixed inset-0 z-[95]" role="status" aria-live="polite" aria-label={`A carregar ${Math.round(pct * 100)}%`}>
      <div className="pre-top absolute inset-x-0 top-0 h-1/2 bg-navy" />
      <div className="pre-bot absolute inset-x-0 bottom-0 h-1/2 bg-navy" />
      <div className="pre-seam absolute inset-x-0 top-1/2 h-px origin-center bg-brass/60" />

      {!reduced && (
        <div className="pre-pole absolute left-1/2 top-1/2 h-[46svh] w-[46svh] -translate-x-1/2 -translate-y-1/2">
          {mobile ? (
            <img src="assets/pole-cutout.webp" alt="" className="pre-float mx-auto h-full w-auto object-contain" />
          ) : (
            <Suspense fallback={null}>
              <HeroScene variant="preloader" quality="low" active />
            </Suspense>
          )}
        </div>
      )}

      <div className="pad absolute inset-x-0 bottom-8 flex items-end justify-between text-cream">
        <span className="mask"><span className="pre-ui label text-cream/60">Barbearia Orlando · Porto</span></span>
        <span className="mask">
          <span className="pre-ui display flex items-baseline text-[22vw] leading-none md:text-[11vw]">
            <span ref={counter} className="tabular-nums">000</span>
            <span className="ml-1 font-display text-[0.3em] italic text-brass">%</span>
          </span>
        </span>
      </div>
    </div>
  )
}
