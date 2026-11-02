import { useRef } from 'react'
import { useScrollSetup } from '../hooks/useScrollSetup'
import { gsap } from '../lib/gsap'
import { SITE } from '../data/site'
import { BookButton } from '../components/MagneticButton'
import { chars } from '../lib/split'

const LINES = ['Senta-te', 'na cadeira.']

export function Marcar() {
  const root = useRef<HTMLElement>(null)

  useScrollSetup(() => {
    const el = root.current
    if (!el) return
    const ctx = gsap.context(() => {
      const letters = gsap.utils.toArray<HTMLElement>('.mk-char')
      gsap.fromTo(
        letters,
        {
          yPercent: () => gsap.utils.random(-160, 160),
          xPercent: () => gsap.utils.random(-60, 60),
          rotate: () => gsap.utils.random(-50, 50),
          opacity: 0,
        },
        {
          yPercent: 0,
          xPercent: 0,
          rotate: 0,
          opacity: 1,
          ease: 'none',
          immediateRender: true,
          stagger: { each: 0.02, from: 'random' },
          scrollTrigger: { trigger: el, start: 'top 75%', end: 'top 10%', scrub: 0.8 },
        },
      )
      gsap.from('.mk-info > *', { yPercent: 40, opacity: 0, duration: 1, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: '.mk-info', start: 'top 90%', once: true } })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section id="marcar" ref={root} className="pad relative overflow-hidden bg-abyss pb-10 pt-[20vh]" aria-label="Marcar corte">
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(50% 40% at 70% 40%, rgba(168,50,45,.12), transparent 70%)' }} />
      <span className="label relative text-brass">Marcações</span>
      <div className="relative mt-6 grid items-center gap-12 md:grid-cols-[1fr_auto]">
        <h2 className="display text-[19vw] text-cream md:text-[11vw]" aria-label="Senta-te na cadeira.">
          {LINES.map((l, li) => (
            <span key={li} className="block whitespace-nowrap" aria-hidden>
              {chars(l).map((c, i) => (
                <span key={i} className={`mk-char inline-block ${li === 1 && i >= 3 ? 'font-normal italic text-brass' : ''}`}>
                  {c === ' ' ? ' ' : c}
                </span>
              ))}
            </span>
          ))}
        </h2>
        <div className="justify-self-center md:justify-self-end">
          <BookButton href={SITE.booking} />
        </div>
      </div>

      <div className="mk-info relative mt-[12vh] grid gap-10 border-t border-cream/15 pt-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="label text-cream/50">Morada</h3>
          <a href={SITE.maps} target="_blank" rel="noopener" className="mt-3 block font-serif text-lg text-cream hover:text-brass">
            {SITE.address[0]}
            <br />
            {SITE.address[1]}
            <span className="label mt-2 block text-brass">Ver no mapa ↗</span>
          </a>
        </div>
        <div>
          <h3 className="label text-cream/50">Horário</h3>
          <dl className="mt-3 font-serif text-lg text-cream">
            {SITE.hours.map((h) => (
              <div key={h.days} className="mb-2">
                <dt className="text-cream/60">{h.days}</dt>
                <dd>{h.time}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div>
          <h3 className="label text-cream/50">Telemóvel · WhatsApp</h3>
          <a href={SITE.phoneHref} className="mt-3 block font-display text-3xl italic text-cream hover:text-brass">
            {SITE.phone}
          </a>
          <a href={SITE.whatsapp} target="_blank" rel="noopener" className="label mt-2 inline-block text-brass">
            Escrever no WhatsApp ↗
          </a>
        </div>
        <div>
          <h3 className="label text-cream/50">Instagram</h3>
          <a href={SITE.instagram} target="_blank" rel="noopener" className="mt-3 block font-display text-3xl italic text-cream hover:text-brass">
            {SITE.instagramLabel}
          </a>
          <a href={SITE.booking} className="label mt-2 inline-block text-brass">
            marcacoes.barbeariaorlando.pt ↗
          </a>
        </div>
      </div>

      <footer className="relative mt-[12vh] flex flex-col items-center gap-6 pb-24 md:flex-row md:justify-between md:pb-0">
        <img src="assets/logo-192.webp" alt="Barbearia Orlando, est. 2015" width={72} height={72} loading="lazy" className="h-[72px] w-[72px]" />
        <p className="label text-center text-cream/40">© {new Date().getFullYear()} Barbearia Orlando · Porto · Desde 2015</p>
      </footer>
    </section>
  )
}
