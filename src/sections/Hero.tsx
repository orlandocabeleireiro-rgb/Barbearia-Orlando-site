import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import { useMotion } from '../context/MotionContext'
import { useInView } from '../hooks/useInView'
import { heroState } from '../three/state'
import { chars } from '../lib/split'

const HeroScene = lazy(() => import('../three/HeroScene'))

function Letters({ text, className }: { text: string; className?: string }) {
  return (
    <span className={`mask ${className ?? ''}`} aria-hidden>
      <span className="flex justify-center">
        {chars(text).map((c, i) => (
          <span key={i} className="hero-char inline-block will-change-transform">
            {c === ' ' ? ' ' : c}
          </span>
        ))}
      </span>
    </span>
  )
}

export function Hero() {
  const root = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const { reduced, mobile, ready } = useMotion()
  const visible = useInView(root, '100px')
  // telemóvel: mostra a imagem renderizada do poste (igual ao 3D) e só carrega
  // o 3D no primeiro toque/scroll — protege o carregamento inicial
  const [want3D, setWant3D] = useState(!mobile && !reduced)
  const [ready3D, setReady3D] = useState(false)
  useEffect(() => {
    if (reduced) return setWant3D(false)
    if (!mobile) return setWant3D(true)
    const go = () => setWant3D(true)
    const evs = ['touchstart', 'pointerdown', 'wheel', 'scroll', 'keydown'] as const
    evs.forEach((e) => window.addEventListener(e, go, { once: true, passive: true }))
    return () => evs.forEach((e) => window.removeEventListener(e, go))
  }, [mobile, reduced])

  // rato → parallax do poste
  useLayoutEffect(() => {
    if (reduced || mobile) return
    const move = (e: PointerEvent) => {
      heroState.px = (e.clientX / window.innerWidth) * 2 - 1
      heroState.py = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [reduced, mobile])

  // entrada do título (quando o preloader termina)
  useLayoutEffect(() => {
    const el = root.current
    if (!el || reduced) return
    const ctx = gsap.context(() => {
      gsap.set('.hero-char', { yPercent: 115, rotate: 6 })
      gsap.set('.hero-sub', { yPercent: 120 })
      if (!ready) return
      const tl = gsap.timeline()
      tl.to('.hero-char', { yPercent: 0, rotate: 0, duration: 1.3, ease: 'expo.out', stagger: { each: 0.035, from: 'center' } })
        .to('.hero-sub', { yPercent: 0, duration: 0.9, ease: 'expo.out', stagger: 0.05 }, 0.05)
        .from('.hero-hint', { opacity: 0, y: 12, duration: 0.8 }, '-=0.5')
    }, el)
    return () => ctx.revert()
  }, [ready, reduced])

  // pin ~200vh + dolly da câmara
  useLayoutEffect(() => {
    const el = root.current
    if (!el || reduced) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: '+=200%',
          pin: stage.current,
          scrub: true,
          onUpdate: (st) => (heroState.progress = st.progress),
        },
      })
      tl.to('.hero-title', { yPercent: -35, scale: 1.25, letterSpacing: '0.02em', opacity: 0, ease: 'power2.in', duration: 0.5 }, 0)
        .to('.hero-meta', { opacity: 0, y: -40, duration: 0.25 }, 0)
        .to('.hero-glow', { opacity: 0, duration: 0.6 }, 0.2)
        .to('.hero-fade', { opacity: 1, duration: 0.06, ease: 'none' }, 0.94)
    }, el)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section id="top" ref={root} className="relative" aria-label="Barbearia Orlando">
      <div ref={stage} className="relative h-[100svh] w-full overflow-hidden bg-abyss">
        {/* poça de luz quente atrás do poste */}
        <div
          className="hero-glow pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(38% 55% at 50% 42%, rgba(232,176,108,.22), rgba(232,176,108,.06) 45%, transparent 70%), radial-gradient(30% 40% at 18% 8%, rgba(255,214,160,.10), transparent 70%)',
          }}
        />

        {(reduced || !ready3D) && (
          <picture className={`absolute inset-0 z-10 transition-opacity duration-700 ${ready3D ? 'opacity-0' : ''}`}>
            <source media="(orientation: portrait)" srcSet="assets/pole-portrait.webp" />
            <img src="assets/pole-landscape.webp" alt="" aria-hidden className="h-full w-full object-cover" fetchPriority="high" />
          </picture>
        )}
        {!reduced && want3D && (
          <div className={`absolute inset-0 z-10 transition-opacity duration-700 ${ready3D ? '' : 'opacity-0'}`}>
            <Suspense fallback={null}>
              <HeroScene variant="hero" quality={mobile ? 'low' : 'high'} active={visible} particles={mobile ? 280 : 1100} onReady={() => setReady3D(true)} />
            </Suspense>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 flex h-full flex-col items-center justify-end pb-[12svh] text-center md:justify-center md:pb-0">
          <h1 className="hero-title display relative z-0 text-cream" aria-label="Barbearia Orlando">
            <Letters text="BARBEARIA" className="text-[16.5vw] md:text-[12.5vw]" />
            <Letters text="ORLANDO" className="-mt-[0.06em] text-[16.5vw] md:text-[12.5vw]" />
          </h1>
          <div className="hero-meta relative z-20 mt-6 flex items-center gap-4">
            <span className="mask"><span className="hero-sub h-px w-10 bg-brass" style={{ marginTop: '0.6em' }} /></span>
            <span className="mask"><span className="hero-sub font-display text-xl italic text-brass md:text-2xl">Porto · Desde 2015</span></span>
            <span className="mask"><span className="hero-sub h-px w-10 bg-brass" style={{ marginTop: '0.6em' }} /></span>
          </div>
        </div>

        <div className="hero-hint hero-meta label absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 text-cream/60 md:block">
          Desce devagar
        </div>
        <div className="hero-fade pointer-events-none absolute inset-0 z-20 bg-abyss opacity-0" />
      </div>
    </section>
  )
}
