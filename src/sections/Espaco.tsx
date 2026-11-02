import { useRef } from 'react'
import { useScrollSetup } from '../hooks/useScrollSetup'
import { gsap } from '../lib/gsap'
import { useMotion } from '../context/MotionContext'
import { MaskLines } from '../components/MaskLines'
import photos from '../data/espaco.json'

type Photo = { src: string; caption: string; pos?: string; placeholder?: boolean }

// ritmo vertical alternado (só em ecrãs largos)
const OFFSET = ['md:-translate-y-[4vh]', 'md:translate-y-[5vh]', 'md:-translate-y-[1vh]', 'md:translate-y-[6vh]', 'md:-translate-y-[3vh]', 'md:translate-y-[3vh]']

export function Espaco() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const { reduced } = useMotion()

  useScrollSetup(() => {
    const el = root.current
    const tr = track.current
    if (!el || !tr || !photos.length) return
    const ctx = gsap.context(() => {
      const dist = () => tr.scrollWidth - window.innerWidth
      const move = gsap.to(tr, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: 0.8, invalidateOnRefresh: true },
      })
      gsap.utils.toArray<HTMLElement>('.esp-img').forEach((img) => {
        gsap.fromTo(
          img,
          { xPercent: -5 },
          { xPercent: 5, ease: 'none', scrollTrigger: { trigger: img.parentElement!, containerAnimation: move, start: 'left right', end: 'right left', scrub: true } },
        )
      })
      gsap.to('.esp-progress', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: () => `+=${dist()}`, scrub: true } })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section id="espaco" ref={root} className="relative overflow-hidden bg-abyss" aria-label="O espaço">
      <div className={`flex h-[100svh] flex-col justify-center ${reduced ? 'h-auto py-24' : ''}`}>
        <div
          ref={track}
          className={`pad flex items-center gap-[4vw] md:gap-[3vw] ${reduced ? 'flex-col md:flex-row md:flex-wrap' : 'w-max'}`}
        >
          <div className="flex w-[82vw] shrink-0 flex-col justify-center md:w-[36vw]">
            <span className="label text-brass">O espaço</span>
            <MaskLines as="h2" className="display mt-4 text-[17vw] text-cream md:text-[8vw]" lines={['Rua Álvaro', <>de <em className="font-normal italic text-brass">Castelões</em></>, '222.']} />
            <p className="mt-6 max-w-sm font-serif text-lg text-cream/70">
              Cadeiras clássicas, espelhos antigos, o cheiro a loção. Uma barbearia no coração do Porto, desde 2015.
            </p>
          </div>
          {(photos as Photo[]).map((p, i) => (
            <figure key={p.src} className={`group relative shrink-0 ${OFFSET[i % OFFSET.length]}`}>
              <div className="relative aspect-[3/4] h-[56svh] overflow-hidden rounded-[18px] bg-navy shadow-[0_30px_80px_rgba(0,0,0,.55)] ring-1 ring-brass/20 md:h-[60vh]" data-cursor="view">
                <img
                  src={p.src}
                  alt={p.placeholder ? '' : `${p.caption} — Barbearia Orlando, Porto`}
                  loading="lazy"
                  decoding="async"
                  style={{ objectPosition: p.pos ?? '50% 50%' }}
                  className="esp-img photo-grade absolute inset-y-0 -left-[6%] h-full w-[112%] max-w-none object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-abyss/55 via-transparent to-abyss/10" />
              </div>
              <figcaption className="mt-4 flex items-baseline justify-between gap-6">
                <span className="label text-brass">{String(i + 1).padStart(2, '0')}</span>
                <span className="font-display text-base italic text-cream/85">{p.caption}</span>
              </figcaption>
            </figure>
          ))}
          <div className="w-[10vw] shrink-0" />
        </div>
        {!reduced && (
          <div className="pad absolute inset-x-0 bottom-8">
            <div className="h-px bg-cream/15">
              <div className="esp-progress h-px origin-left scale-x-0 bg-brass" />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
