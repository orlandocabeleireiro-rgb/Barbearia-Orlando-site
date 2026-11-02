import { useRef } from 'react'
import { useScrollSetup } from '../hooks/useScrollSetup'
import { gsap } from '../lib/gsap'
import { SERVICES, SITE } from '../data/site'
import { PriceCounter } from '../components/Counter'
import { MaskLines } from '../components/MaskLines'

/** Cartões empilhados: cada cartão fica preso e é tapado pelo seguinte, que encolhe o anterior. */
export function Servicos() {
  const root = useRef<HTMLElement>(null)

  useScrollSetup(() => {
    const el = root.current
    if (!el) return
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.svc-card')
      cards.forEach((card, i) => {
        const next = cards[i + 1]
        if (next) {
          gsap.to(card.querySelector('.svc-inner'), {
            scale: 0.9,
            filter: 'brightness(.5)',
            ease: 'none',
            scrollTrigger: { trigger: next, start: 'top 70%', end: 'top 12%', scrub: true },
          })
        }
        gsap.fromTo(
          card.querySelector('.svc-img'),
          { scale: 1.25, yPercent: -6 },
          { scale: 1.02, yPercent: 6, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true } },
        )
      })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section id="servicos" ref={root} className="pad relative bg-abyss pb-[10vh] pt-[18vh]" aria-label="Serviços">
      <div className="mb-[8vh] flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <MaskLines as="h2" className="display text-[16vw] text-cream md:text-[9vw]" lines={['Serviços', <em className="font-normal italic text-brass">& preços</em>]} />
        <p className="max-w-xs font-serif text-cream/70">Três rituais. Preço fechado, sem surpresas. Marcação online ou por telefone.</p>
      </div>

      <ol>
        {SERVICES.map((s, i) => (
          <li key={s.name} className="svc-card sticky mb-[6vh]" style={{ top: `calc(10svh + ${i * 22}px)` }}>
            <article className="svc-inner relative grid min-h-[78svh] origin-top overflow-hidden rounded-[28px] border border-brass/25 bg-navy md:grid-cols-[1.1fr_1fr]">
              <div className="relative z-10 flex flex-col justify-between gap-10 p-6 md:p-12">
                <div className="flex items-center justify-between">
                  <span className="label text-brass">0{i + 1} / 0{SERVICES.length}</span>
                  <span className="label rounded-full border border-cream/25 px-3 py-1.5 text-cream/80">{s.minutes} min</span>
                </div>
                <div>
                  <h3 className="display text-[15vw] text-cream md:text-[7vw]">
                    {s.name.includes(' e ') ? (
                      <>
                        {s.name.split(' e ')[0]} <em className="font-normal italic text-brass">e</em> {s.name.split(' e ')[1]}
                      </>
                    ) : (
                      s.name
                    )}
                  </h3>
                  <p className="mt-4 max-w-sm font-serif text-lg text-cream/70">{s.note}</p>
                </div>
                <div className="flex items-end justify-between gap-4 border-t border-cream/15 pt-6">
                  <PriceCounter value={s.price} className="font-display text-5xl italic text-cream md:text-7xl" />
                  <a href={SITE.booking} className="label group flex items-center gap-2 text-cream">
                    Marcar <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </a>
                </div>
              </div>
              <div className="relative min-h-[34svh] overflow-hidden md:min-h-0" data-cursor="view">
                <img src={s.image} alt={`${s.name} na Barbearia Orlando`} loading="lazy" decoding="async" className="svc-img absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/70 to-transparent md:bg-gradient-to-r" />
              </div>
            </article>
          </li>
        ))}
      </ol>
    </section>
  )
}
