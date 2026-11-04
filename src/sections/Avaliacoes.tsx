import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { useScrollSetup } from '../hooks/useScrollSetup'
import { useMotion } from '../context/MotionContext'
import { MaskLines } from '../components/MaskLines'
import { RATING, REVIEWS } from '../data/site'

const one = (n: number) => n.toLocaleString('pt-PT', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

function Stars({ className }: { className?: string }) {
  return (
    <span className={`inline-flex gap-[0.12em] text-brass ${className ?? ''}`} aria-hidden>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 24 24" className="h-[1em] w-[1em]" fill="currentColor">
          <path d="m12 2.6 2.9 6 6.6.8-4.9 4.6 1.3 6.5L12 17.3l-5.9 3.2 1.3-6.5-4.9-4.6 6.6-.8z" />
        </svg>
      ))}
    </span>
  )
}

function Card({ r }: { r: (typeof REVIEWS)[number] }) {
  return (
    <figure className="relative flex w-[80vw] shrink-0 snap-start flex-col justify-between gap-6 rounded-[18px] bg-navy p-6 ring-1 ring-brass/20 md:w-[32vw] md:p-7 lg:w-[26vw]">
      {r.sample && <span className="label absolute right-4 top-4 rounded-full bg-barber px-2 py-1 text-[9px] text-cream">Exemplo</span>}
      <div>
        <Stars className="text-lg" />
        <blockquote className={`mt-5 font-display italic leading-snug text-cream/90 ${r.text.length > 200 ? 'text-[15px] md:text-base' : r.text.length > 120 ? 'text-base md:text-lg' : 'text-lg md:text-xl'}`}>“{r.text}”</blockquote>
      </div>
      <figcaption className="flex items-baseline justify-between gap-4 border-t border-cream/10 pt-4">
        <span className="label text-cream">{r.name}</span>
        <span className="label text-right text-cream/40">{r.when} · Google{r.translated ? ' · traduzido' : ''}</span>
      </figcaption>
    </figure>
  )
}

/** Avaliações do Google: nota em grande (contador) e faixa de cartões a passar devagar. */
export function Avaliacoes() {
  const root = useRef<HTMLElement>(null)
  const score = useRef<HTMLSpanElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const { reduced, finePointer } = useMotion()
  const auto = finePointer && !reduced

  useScrollSetup(() => {
    const el = score.current
    if (!el) return
    const o = { v: 0 }
    el.textContent = one(0)
    const t = gsap.to(o, { v: RATING.score, duration: 1.8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true }, onUpdate: () => {
        el.textContent = one(o.v)
      } })
    return () => {
      t.scrollTrigger?.kill()
      t.kill()
      el.textContent = one(RATING.score)
    }
  }, [])

  // computador: a faixa passa sozinha e pára com o rato por cima; toque: desliza com o dedo
  useEffect(() => {
    const el = track.current
    if (!el || !auto) return
    let x = 0
    let on = false
    let hover = false
    const io = new IntersectionObserver(([e]) => (on = e.isIntersecting), { rootMargin: '100px' })
    io.observe(el)
    const enter = () => (hover = true)
    const leave = () => (hover = false)
    el.addEventListener('pointerenter', enter)
    el.addEventListener('pointerleave', leave)
    const tick = (_t: number, dt: number) => {
      if (!on || hover) return
      const w = el.scrollWidth / 2
      x -= (38 * dt) / 1000
      if (w) x %= w
      el.style.transform = `translate3d(${x}px,0,0)`
    }
    gsap.ticker.add(tick)
    return () => {
      io.disconnect()
      el.removeEventListener('pointerenter', enter)
      el.removeEventListener('pointerleave', leave)
      gsap.ticker.remove(tick)
    }
  }, [auto])

  const list = auto ? [...REVIEWS, ...REVIEWS] : REVIEWS

  return (
    <section id="avaliacoes" ref={root} className="relative overflow-hidden bg-abyss pb-[8vh] pt-[16vh]" aria-label="Avaliações">
      <div className="pad flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="label text-brass">Avaliações</span>
          <MaskLines as="h2" className="display mt-4 text-[14vw] text-cream md:text-[7.5vw]" lines={['O que dizem', <em className="font-normal italic text-brass">os clientes.</em>]} />
        </div>
        <a href={RATING.url} target="_blank" rel="noopener" className="group flex items-end gap-5 self-start md:self-auto" aria-label={`${one(RATING.score)} em 5 estrelas, ${RATING.count} avaliações no Google`}>
          <span ref={score} className="display tabular-nums text-[24vw] leading-[0.8] text-cream md:text-[9vw]">
            {one(RATING.score)}
          </span>
          <span className="pb-2">
            <Stars className="text-2xl md:text-3xl" />
            <span className="label mt-3 block text-cream/60 transition-colors group-hover:text-brass">{RATING.count} avaliações no Google ↗</span>
          </span>
        </a>
      </div>

      <div className={`mt-12 ${auto ? '' : 'no-scrollbar snap-x snap-mandatory overflow-x-auto'} pad`} style={auto ? undefined : { scrollPaddingLeft: 'max(16px, 4vw)' }}>
        <div ref={track} className={`flex gap-4 md:gap-6 ${auto ? 'w-max will-change-transform' : 'w-max pr-[max(16px,4vw)]'}`}>
          {list.map((r, i) => (
            <Card key={i} r={r} />
          ))}
        </div>
      </div>

      <div className="pad mt-10 flex flex-wrap gap-3">
        <a href={RATING.url} target="_blank" rel="noopener" className="label group inline-flex items-center gap-3 rounded-full border border-cream/30 px-6 py-4 text-cream transition-colors hover:border-brass hover:text-brass">
          Ver todas no Google <span className="transition-transform duration-300 group-hover:translate-x-1">↗</span>
        </a>
        {RATING.write && (
          <a href={RATING.write} target="_blank" rel="noopener" className="label inline-flex items-center gap-3 rounded-full bg-barber px-6 py-4 text-cream transition-colors hover:bg-[#bf3a34]">
            Deixar avaliação ★
          </a>
        )}
      </div>
    </section>
  )
}
