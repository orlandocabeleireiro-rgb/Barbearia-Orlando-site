import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import { useMotion } from '../context/MotionContext'
import { useInView } from '../hooks/useInView'
import { heroState } from '../three/state'
import { chars } from '../lib/split'
import { CssPole } from '../components/CssPole'

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
  // telemóvel: começa com o poste em CSS e só carrega o 3D na primeira interação
  const [want3D, setWant3D] = useState(!mobile)
  const [ready3D, setReady3D] = useState(false)
  useEffect(() => {
    if (!mobile || reduced) return setWant3D(!reduced)
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
      const tl = gsap.timeline({ delay: 0.15 })
      tl.to('.hero-char', { yPercent: 0, rotate: 0, duration: 1.3, ease: 'expo.out', stagger: { each: 0.035, from: 'center' } })
        .to('.hero-sub', { yPercent: 0, duration: 1, ease: 'expo.out', stagger: 0.08 }, '-=0.9')
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
          <div className={`absolute inset-0 z-10 transition-opacity duration-700 ${ready3D ? 'opacity-0' : ''}`}>
            {mobile ? <CssPole className="absolute left-1/2 top-[9svh] h-[54svh] w-[54svh] -translate-x-1/2" animate={!reduced} /> : reduced ? <StaticPole /> : null}
          </div>
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

/** Versão estática (prefers-reduced-motion): poste desenhado em CSS. */
function StaticPole() {
  return (
    <div className="absolute inset-0 flex items-center justify-center" aria-hidden>
      <div className="relative flex flex-col items-center">
        <div className="h-10 w-16 rounded-t-full bg-gradient-to-b from-[#d9b57f] to-brass" />
        <div
          className="h-[52svh] w-14 shadow-[inset_-10px_0_20px_rgba(0,0,0,.45),inset_8px_0_14px_rgba(255,255,255,.25)]"
          style={{ background: 'repeating-linear-gradient(-35deg,#A8322D 0 22px,#EDE3CC 22px 44px,#2C4467 44px 66px,#EDE3CC 66px 88px)' }}
        />
        <div className="h-10 w-16 rounded-b-full bg-gradient-to-t from-[#7d6038] to-brass" />
      </div>
    </div>
  )
}
