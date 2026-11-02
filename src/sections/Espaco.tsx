import { useRef } from 'react'
import { useScrollSetup } from '../hooks/useScrollSetup'
import { gsap } from '../lib/gsap'
import { useMotion } from '../context/MotionContext'
import { MaskLines } from '../components/MaskLines'
import photos from '../data/espaco.json'

type Photo = { src: string; caption: string; placeholder?: boolean }

const SIZES = ['md:w-[34vw] md:h-[68vh]', 'md:w-[26vw] md:h-[50vh] md:self-end', 'md:w-[40vw] md:h-[58vh]', 'md:w-[24vw] md:h-[44vh]', 'md:w-[32vw] md:h-[70vh] md:self-end', 'md:w-[28vw] md:h-[52vh]']

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
          { xPercent: -14 },
          { xPercent: 14, ease: 'none', scrollTrigger: { trigger: img.parentElement!, containerAnimation: move, start: 'left right', end: 'right left', scrub: true } },
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
          className={`pad flex items-stretch gap-[3vw] ${reduced ? 'flex-col md:flex-row md:flex-wrap' : 'w-max'}`}
        >
          <div className="flex w-[82vw] shrink-0 flex-col justify-center md:w-[36vw]">
            <span className="label text-brass">O espaço</span>
            <MaskLines as="h2" className="display mt-4 text-[17vw] text-cream md:text-[8vw]" lines={['Rua Álvaro', <>de <em className="font-normal italic text-brass">Castelões</em></>, '222.']} />
            <p className="mt-6 max-w-sm font-serif text-lg text-cream/70">
              Cadeiras clássicas, espelhos antigos, o cheiro a loção. Uma barbearia no coração do Porto, desde 2015.
            </p>
          </div>
          {(photos as Photo[]).map((p, i) => (
            <figure key={p.src} className={`relative flex h-[60svh] w-[78vw] shrink-0 flex-col ${SIZES[i % SIZES.length]}`}>
              <div className="relative flex-1 overflow-hidden rounded-[18px] bg-navy" data-cursor="view">
                <img
                  src={p.src}
                  alt={p.placeholder ? '' : `${p.caption} — Barbearia Orlando, Porto`}
                  loading="lazy"
                  decoding="async"
                  className="esp-img absolute inset-y-0 -left-[15%] h-full w-[130%] max-w-none object-cover"
                />
                {p.placeholder && (
                  <span className="label absolute left-4 top-4 rounded-full bg-abyss/70 px-3 py-1.5 text-cream/70 backdrop-blur">
                    espaco/{p.caption}.jpg
                  </span>
                )}
              </div>
              <figcaption className="mt-3 flex justify-between">
                <span className="label text-cream/60">{String(i + 1).padStart(2, '0')}</span>
                <span className="font-display text-sm italic text-cream/80">{p.caption}</span>
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
