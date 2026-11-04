import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useScrollSetup } from '../hooks/useScrollSetup'
import { gsap } from '../lib/gsap'
import { SITE, TEAM } from '../data/site'
import { MaskLines } from '../components/MaskLines'
import { useMotion } from '../context/MotionContext'
import { useInView } from '../hooks/useInView'
import { scissorsState } from '../three/state'

const ScissorsScene = lazy(() => import('../three/ScissorsScene'))

// ritmo vertical alternado (só em ecrãs largos)
const OFFSET = ['md:translate-y-0', 'md:translate-y-[6vh]', 'md:translate-y-[2vh]', 'md:translate-y-[8vh]']

/** A equipa: um cartão vertical por barbeiro, com foto ou, até haver foto, a inicial do nome. */
export function Equipa() {
  const root = useRef<HTMLElement>(null)

  const runway = useRef<HTMLDivElement>(null)
  const { reduced, mobile } = useMotion()
  // a cena 3D só é carregada quando a passagem se aproxima e só desenha enquanto está à vista
  const near = useInView(runway, '60% 0px')
  const [want3D, setWant3D] = useState(false)
  useEffect(() => {
    if (near && !reduced) setWant3D(true)
  }, [near, reduced])

  useScrollSetup(() => {
    const el = root.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.eq-media').forEach((m) => {
        gsap.fromTo(
          m,
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: 'none',
            scrollTrigger: {
              trigger: m.parentElement!,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        )
      })

      // passagem: a camada fica presa por CSS (sticky, suave também no toque); uma tesoura 3D em latão
      // (como o poste do início) entra de lado, dá uma só tesourada e o ecrã abre-se pelo corte
      gsap.set('.eq-fx', { autoAlpha: 1 })
      gsap.set('.eq-line', { scaleX: 0, transformOrigin: '50% 50%' })
      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: {
          trigger: '.eq-runway',
          start: 'top 40%',
          end: 'bottom bottom',
          scrub: 0.4,
          onUpdate: (st) => (scissorsState.progress = st.progress),
        },
      })
      // posições em fração do percurso (0–1), alinhadas com a cena 3D
      tl.to('.eq-line', { scaleX: 1, duration: 0.03, ease: 'power4.in' }, 0.475)
        .fromTo('.eq-flash', { opacity: 0 }, { opacity: 1, duration: 0.03, ease: 'none' }, 0.485)
        .to('.eq-flash', { opacity: 0, duration: 0.1, ease: 'power1.out' }, 0.515)
        .to('.eq-cover-top', { yPercent: -100, duration: 0.28, ease: 'power2.out' }, 0.54)
        .to('.eq-cover-bot', { yPercent: 100, duration: 0.28, ease: 'power2.out' }, 0.54)
        .to('.eq-line', { autoAlpha: 0, duration: 0.06 }, 0.57)
        .to('.eq-glow', { opacity: 0, duration: 0.2 }, 0.54)
        .fromTo('.eq-head', { scale: 1.06 }, { scale: 1, duration: 0.3, ease: 'power2.out' }, 0.54)
        .set({}, {}, 1)
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section id="equipa" ref={root} className="relative bg-abyss" aria-label="A equipa">
      {!reduced && (
        <div ref={runway} className="eq-runway relative h-[200lvh]" aria-hidden>
          <div className="eq-fx pointer-events-none invisible sticky top-0 z-20 h-[100lvh] overflow-hidden">
            <div className="eq-cover-top absolute inset-x-0 top-0 h-1/2 bg-abyss" />
            <div className="eq-cover-bot absolute inset-x-0 bottom-0 h-1/2 bg-abyss" />
            <div
              className="eq-glow absolute inset-0"
              style={{ background: 'radial-gradient(45% 40% at 50% 50%, rgba(232,176,108,.16), rgba(232,176,108,.04) 50%, transparent 72%)' }}
            />
            <div className="eq-line absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-[#ffe2b0] shadow-[0_0_18px_4px_rgba(232,176,108,.75)]" />
            <div className="eq-flash absolute inset-0 opacity-0" style={{ background: 'radial-gradient(60% 18% at 50% 50%, rgba(255,226,176,.35), transparent 70%)' }} />
            {want3D && (
              <Suspense fallback={null}>
                <ScissorsScene quality={mobile ? 'low' : 'high'} active={near} particles={mobile ? 160 : 600} />
              </Suspense>
            )}
          </div>
        </div>
      )}
      <div id="equipa-barbeiros" className={`pad relative pb-[12vh] pt-[18vh] ${reduced ? '' : '-mt-[100lvh]'}`}>
        <div className="eq-head flex origin-top-left flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="label text-brass">A equipa</span>
            <MaskLines as="h2" className="display mt-4 text-[16vw] text-cream md:text-[8vw]" lines={['Barbeiros']} />
          </div>
          <p className="max-w-xs font-serif text-lg text-cream/70">Quatro profissionais, a mesma exigência em cada corte. Escolhe com quem queres marcar.</p>
        </div>

        <div className="eq-stage relative mt-[4vh] py-[5vh] md:pb-[12vh]">
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
                      <div className="eq-media absolute inset-x-0 -top-[8%] flex h-[116%] items-center justify-center bg-[radial-gradient(120%_80%_at_50%_20%,rgba(184,146,90,.18),transparent_60%)]">
                        <span
                          aria-hidden
                          className="display select-none text-[38vw] italic text-brass/25 transition-colors duration-700 group-hover:text-brass/45 md:text-[15vw]"
                        >
                          {b.name[0]}
                        </span>
                      </div>
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-abyss/80 via-transparent to-abyss/10" />
                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 md:p-5">
                      <span className="display text-[8vw] text-cream md:text-[2.6vw]">{b.name}</span>
                      <span className="label translate-y-1 text-brass opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                        Marcar ↗
                      </span>
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
        </div>
      </div>
    </section>
  )
}
