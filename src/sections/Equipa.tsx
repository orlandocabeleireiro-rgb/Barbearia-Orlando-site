import { useRef } from 'react'
import { useScrollSetup } from '../hooks/useScrollSetup'
import { gsap } from '../lib/gsap'
import { SITE, TEAM } from '../data/site'
import { MaskLines } from '../components/MaskLines'

// ritmo vertical alternado (só em ecrãs largos)
const OFFSET = ['md:translate-y-0', 'md:translate-y-[6vh]', 'md:translate-y-[2vh]', 'md:translate-y-[8vh]']

/** A equipa: um cartão vertical por barbeiro, com foto ou, até haver foto, a inicial do nome. */
export function Equipa() {
  const root = useRef<HTMLElement>(null)

  useScrollSetup(() => {
    const el = root.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.eq-card',
        { yPercent: 18, clipPath: 'inset(100% 0% 0% 0% round 18px)' },
        {
          yPercent: 0,
          clipPath: 'inset(0% 0% 0% 0% round 18px)',
          duration: 1.3,
          ease: 'expo.out',
          stagger: 0.12,
          scrollTrigger: { trigger: '.eq-grid', start: 'top 82%', once: true },
        },
      )
      gsap.utils.toArray<HTMLElement>('.eq-media').forEach((m) => {
        gsap.fromTo(m, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: m.parentElement!, start: 'top bottom', end: 'bottom top', scrub: true } })
      })
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
        <p className="max-w-xs font-serif text-lg text-cream/70">Quatro barbeiros, a mesma exigência em cada corte. Escolhe com quem queres marcar.</p>
      </div>

      <ul className="eq-grid mt-[8vh] grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-4 md:gap-x-5">
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
    </section>
  )
}
