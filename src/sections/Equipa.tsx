import { useRef } from 'react'
import { useScrollSetup } from '../hooks/useScrollSetup'
import { gsap } from '../lib/gsap'
import { SITE, TEAM } from '../data/site'
import { MaskLines } from '../components/MaskLines'
import { useMotion } from '../context/MotionContext'

// ritmo vertical alternado (só em ecrãs largos)
const OFFSET = ['md:translate-y-0', 'md:translate-y-[6vh]', 'md:translate-y-[2vh]', 'md:translate-y-[8vh]']

/** A equipa: um cartão vertical por barbeiro, com foto ou, até haver foto, a inicial do nome. */
export function Equipa() {
  const root = useRef<HTMLElement>(null)

  const { reduced } = useMotion()

  useScrollSetup(() => {
    const el = root.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.eq-media').forEach((m) => {
        gsap.fromTo(m, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: m.parentElement!, start: 'top bottom', end: 'bottom top', scrub: true } })
      })

      // passagem: tesoura grande abre, corta três vezes ao longo de uma linha e o ecrã abre-se pelo corte
      const b1 = '.eq-blade-a'
      const b2 = '.eq-blade-b'
      gsap.set('.eq-fx', { autoAlpha: 1 })
      gsap.set('.eq-scissors', { xPercent: -50, yPercent: -50 })
      gsap.set(b1, { rotation: -26, svgOrigin: '0 0' })
      gsap.set(b2, { rotation: 26, svgOrigin: '0 0' })

      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: { trigger: '.eq-stage', start: 'center center', end: '+=130%', pin: true, scrub: 0.6, anticipatePin: 1 },
      })
      tl.fromTo('.eq-scissors', { scale: 0.45, autoAlpha: 0, rotation: -35 }, { scale: 1, autoAlpha: 1, rotation: 0, duration: 1, ease: 'back.out(1.4)' })
      for (let k = 0; k < 3; k++) {
        tl.to(b1, { rotation: -1, duration: 0.35, ease: 'power3.in' })
          .to(b2, { rotation: 1, duration: 0.35, ease: 'power3.in' }, '<')
          .to('.eq-line', { scaleX: (k + 1) / 3, duration: 0.35, ease: 'power3.in' }, '<')
          .to('.eq-scissors', { x: '+=2%', duration: 0.35 }, '<')
        if (k < 2) tl.to(b1, { rotation: -26, duration: 0.3 }).to(b2, { rotation: 26, duration: 0.3 }, '<')
      }
      tl.to('.eq-scissors', { scale: 1.7, autoAlpha: 0, duration: 0.6, ease: 'power2.in' }, '+=0.15')
        .to('.eq-cover-top', { yPercent: -100, duration: 1.3 }, '-=0.25')
        .to('.eq-cover-bot', { yPercent: 100, duration: 1.3 }, '<')
        .to('.eq-line', { autoAlpha: 0, duration: 0.3 }, '<')
        .fromTo('.eq-card', { scale: 1.12 }, { scale: 1, duration: 1.3, stagger: 0.06 }, '<')
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section id="equipa" ref={root} className="pad relative bg-abyss pb-[12vh] pt-[18vh]" aria-label="A equipa">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="label text-brass">A equipa</span>
          <MaskLines as="h2" className="display mt-4 text-[16vw] text-cream md:text-[8vw]" lines={['Quatro', <em className="font-normal italic text-brass">tesouras.</em>]} />
        </div>
        <p className="max-w-xs font-serif text-lg text-cream/70">Quatro profissionais, a mesma exigência em cada corte. Escolhe com quem queres marcar.</p>
      </div>

      <div className="eq-stage relative mt-[4vh] overflow-hidden py-[5vh] md:pb-[12vh]">
      <ul className="eq-grid grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-4 md:gap-x-5">
        {TEAM.map((b, i) => (
          <li key={b.name} className={OFFSET[i % OFFSET.length]}>
            <a href={SITE.booking} target="_blank" rel="noopener" className="group block" data-cursor="view" aria-label={`Marcar com ${b.name}`}>
              <div className="eq-card relative aspect-[3/4] overflow-hidden rounded-[18px] bg-navy shadow-[0_30px_80px_rgba(0,0,0,.55)] ring-1 ring-brass/20">
                {b.photo ? (
                  <img
                    src={b.photo}
                    alt={`${b.name}, Barbearia Orlando`}
                    loading="lazy"
                    decoding="async"
                    style={{ objectPosition: b.pos ?? '50% 35%' }}
                    className="eq-media photo-grade absolute inset-x-0 -top-[8%] h-[116%] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="eq-media absolute inset-0 flex items-center justify-center bg-[radial-gradient(120%_80%_at_50%_20%,rgba(184,146,90,.18),transparent_60%)]">
                    <span aria-hidden className="display select-none text-[38vw] italic text-brass/25 transition-colors duration-700 group-hover:text-brass/45 md:text-[15vw]">
                      {b.name[0]}
                    </span>
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-abyss/80 via-transparent to-abyss/10" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 md:p-5">
                  <span className="display text-[8vw] text-cream md:text-[2.6vw]">{b.name}</span>
                  <span className="label translate-y-1 text-brass opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">Marcar ↗</span>
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between gap-4">
                <span className="label text-brass">{String(i + 1).padStart(2, '0')}</span>
                <span className="font-display text-sm italic text-cream/70 md:text-base">Corte · Barba</span>
              </div>
            </a>
          </li>
        ))}
      </ul>
      {!reduced && (
        <div className="eq-fx pointer-events-none invisible absolute inset-0 z-10" aria-hidden>
          <div className="eq-cover-top absolute inset-x-0 top-0 h-1/2 bg-abyss" />
          <div className="eq-cover-bot absolute inset-x-0 bottom-0 h-1/2 bg-abyss" />
          <div className="eq-line absolute inset-x-0 top-1/2 h-px scale-x-0 bg-brass shadow-[0_0_14px_rgba(184,146,90,.8)]" />
          <Scissors className="eq-scissors absolute left-1/2 top-1/2 w-[78vw] text-brass drop-shadow-[0_20px_40px_rgba(0,0,0,.6)] md:w-[38vw]" />
        </div>
      )}
      </div>
    </section>
  )
}

/** Tesoura em SVG: duas lâminas que rodam à volta do parafuso (0,0). */
function Scissors({ className }: { className?: string }) {
  const half = (
    <>
      <path d="M-8,-8 C40,-16 120,-14 196,-2 C198,-1 198,1 196,1 C120,2 40,4 -8,7 Z" fill="currentColor" />
      <path d="M10,-5 C70,-10 140,-8 190,-1.5" stroke="#EDE3CC" strokeOpacity=".55" strokeWidth="1.5" fill="none" />
      <path d="M6,2 L-82,30 C-90,33 -92,40 -88,46 L-76,44 L4,14 Z" fill="currentColor" />
      <circle cx="-118" cy="52" r="30" fill="none" stroke="currentColor" strokeWidth="11" />
      <circle cx="-118" cy="52" r="30" fill="none" stroke="#EDE3CC" strokeOpacity=".25" strokeWidth="2" />
    </>
  )
  return (
    <svg viewBox="-170 -110 380 220" className={className} overflow="visible">
      <g className="eq-blade-b">
        <g transform="scale(1,-1)">{half}</g>
      </g>
      <g className="eq-blade-a">{half}</g>
      <circle r="9" fill="#1F2A3A" stroke="#EDE3CC" strokeWidth="2.5" />
      <circle r="2.5" fill="#EDE3CC" />
    </svg>
  )
}
