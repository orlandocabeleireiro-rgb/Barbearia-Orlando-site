import { useEffect, useRef } from 'react'
import { useScrollSetup } from '../hooks/useScrollSetup'
import { gsap } from '../lib/gsap'
import { useMotion } from '../context/MotionContext'
import { useInView } from '../hooks/useInView'

const WORDS = ['Cada', 'cabelo', 'tem', 'a', 'sua', 'forma.']

export function Manifesto() {
  const root = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const { reduced } = useMotion()
  const near = useInView(root, '200px')

  // vídeo só carrega/toca quando perto do ecrã
  useEffect(() => {
    const v = video.current
    if (!v || reduced) return
    if (near) {
      if (v.preload !== 'auto') {
        v.preload = 'auto'
        v.load()
      }
      v.play().catch(() => {})
    } else v.pause()
  }, [near, reduced])

  useScrollSetup(() => {
    const el = root.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.set('.mf-word', { opacity: 0.1, filter: 'blur(6px)' })
      gsap.set('.mf-sign .mask > span', { yPercent: 110 })
      gsap.set('.mf-rule', { scaleX: 0 })
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: el, start: 'top top', end: '+=180%', pin: stage.current, scrub: 0.6 },
      })
      tl.fromTo('.mf-word', { opacity: 0.1, filter: 'blur(6px)' }, { opacity: 1, filter: 'blur(0px)', stagger: 0.5, duration: 0.6 })
        .fromTo('.mf-forma', { color: '#EDE3CC' }, { color: '#A8322D', duration: 0.6 }, '-=0.4')
        .fromTo('.mf-rule', { scaleX: 0 }, { scaleX: 1, duration: 0.8 }, '-=0.2')
        .fromTo('.mf-sign .mask > span', { yPercent: 110 }, { yPercent: 0, duration: 0.6, stagger: 0.1 }, '<')
        .fromTo('.mf-video', { scale: 1.25 }, { scale: 1, duration: tl.duration(), ease: 'none' }, 0)
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="relative" aria-label="Manifesto">
      <div ref={stage} className="relative flex min-h-[100svh] items-center overflow-hidden bg-abyss">
        {!reduced && (
          <video
            ref={video}
            className="mf-video pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60"
            style={{ filter: 'blur(28px) brightness(.38) saturate(1.2)', mixBlendMode: 'screen' }}
            muted
            loop
            playsInline
            preload="none"
            poster="/assets/video/textura-poster.webp"
            aria-hidden
          >
            <source src="/assets/video/textura.webm" type="video/webm" />
            <source src="/assets/video/textura.mp4" type="video/mp4" />
          </video>
        )}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(60% 60% at 50% 50%, transparent 0%, rgba(14,20,29,.85) 100%)' }}
        />

        <div className="pad relative z-10 w-full py-24">
          <span className="label text-brass">Manifesto · desde 2015</span>
          <h2 className="display mt-6 text-[17vw] text-cream md:text-[10.5vw]">
            {WORDS.map((w, i) => (
              <span key={i} className="mf-word mr-[0.18em] inline-block">
                {w === 'forma.' ? (
                  <em className="mf-forma font-normal italic text-barber">
                    forma<span className="text-cream">.</span>
                  </em>
                ) : (
                  w
                )}
              </span>
            ))}
          </h2>
          <div className="mt-10 flex flex-col gap-6 md:mt-14 md:flex-row md:items-end md:justify-between">
            <span className="mf-rule block h-px w-40 origin-left bg-brass" />
            <div className="mf-sign max-w-md font-serif text-lg text-cream/75 md:text-xl">
              <span className="mask"><span>Não há dois cortes iguais. Olhamos para o remoinho,</span></span>
              <span className="mask"><span>para o crescimento, para a cara — e só depois</span></span>
              <span className="mask"><span>pegamos na máquina.</span></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
