import { useEffect, useRef, useState } from 'react'
import { useScrollSetup } from '../hooks/useScrollSetup'
import { gsap } from '../lib/gsap'
import { useMotion } from '../context/MotionContext'
import { getCached, getSequenceManifest, loadImage, sequenceFrames } from '../lib/assetLoader'
import { drawCover, sizeCanvas } from '../lib/imageSequence'
import { CORTE_FALLBACK } from './corteAssets'

const PHASES = [
  { n: '01', word: 'Máquina', line: 'A base. Pente a pente, sem pressa.' },
  { n: '02', word: 'Degradê', line: 'A passagem invisível do curto ao comprido.' },
  { n: '03', word: 'Navalha', line: 'Toalha quente. Lâmina. Linha limpa.' },
  { n: '04', word: 'Resultado', line: 'O teu cabelo, na forma que é dele.' },
]

const easeInOut = (t: number) => t * t * (3 - 2 * t)

export function Corte() {
  const root = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const { reduced, mobile } = useMotion()
  const [frames, setFrames] = useState<string[] | null>(null)
  const progress = useRef(0)
  const drawRef = useRef<() => void>(() => {})

  useEffect(() => {
    getSequenceManifest().then((m) => setFrames(m ? sequenceFrames(m, mobile) : []))
  }, [mobile])

  // desenho: sequência real ou substituto (wipe + zoom lento)
  useEffect(() => {
    const c = canvas.current
    if (!c || frames === null) return
    const ctx = c.getContext('2d', { alpha: false })!
    const useSeq = frames.length > 0

    const draw = () => {
      const { w, h } = sizeCanvas(c, mobile ? 1.5 : 2)
      const p = progress.current
      ctx.fillStyle = '#0E141D'
      ctx.fillRect(0, 0, w, h)
      if (useSeq) {
        // procura o frame carregado mais próximo (no telemóvel alguns chegam depois)
        const target = Math.round(p * (frames.length - 1))
        let img: HTMLImageElement | undefined
        for (let d = 0; d < frames.length && !img; d++) img = getCached(frames[target - d]) ?? getCached(frames[target + d])
        if (img) drawCover(ctx, img, w, h)
      } else {
        const [a, b] = CORTE_FALLBACK.map((src) => getCached(src))
        if (a) drawCover(ctx, a, w, h, 1.04 + p * 0.22, 0.5, 0.45)
        // wipe diagonal para o resultado entre 55% e 80%
        const t = easeInOut(Math.min(1, Math.max(0, (p - 0.55) / 0.25)))
        if (b && t > 0) {
          ctx.save()
          ctx.beginPath()
          const x = -0.3 * w + t * 1.6 * w
          ctx.moveTo(x - 0.3 * w, 0)
          ctx.lineTo(x + 0.3 * w, 0)
          ctx.lineTo(x, h)
          ctx.lineTo(x - 0.6 * w, h)
          ctx.closePath()
          ctx.moveTo(-w, 0)
          ctx.lineTo(x - 0.3 * w, 0)
          ctx.lineTo(x - 0.6 * w, h)
          ctx.lineTo(-w, h)
          ctx.closePath()
          ctx.clip()
          drawCover(ctx, b, w, h, 1.18 - t * 0.12 + Math.max(0, p - 0.8) * 0.2, 0.5, 0.45)
          ctx.restore()
          // fio de latão na aresta do wipe
          if (t < 1) {
            ctx.strokeStyle = 'rgba(184,146,90,.85)'
            ctx.lineWidth = 2 * (mobile ? 1.5 : 2)
            ctx.beginPath()
            ctx.moveTo(x + 0.3 * w, 0)
            ctx.lineTo(x, h)
            ctx.stroke()
          }
        }
      }
    }
    drawRef.current = draw

    // garantir as imagens (caso o preloader tenha sido ultrapassado)
    const needed = useSeq ? [frames[0]] : CORTE_FALLBACK
    Promise.all(needed.map(loadImage)).then(draw)
    const ro = new ResizeObserver(draw)
    ro.observe(c)
    return () => ro.disconnect()
  }, [frames, mobile])

  // pin ~400vh com scrub exato
  useScrollSetup(() => {
    const el = root.current
    if (!el) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: '+=400%',
          pin: stage.current,
          scrub: true,
          onUpdate: (st) => {
            progress.current = st.progress
            drawRef.current()
          },
        },
      })
      tl.fromTo('.corte-canvas', { scale: 1.12, clipPath: 'inset(18% 22% 18% 22%)' }, { scale: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6, ease: 'power2.out' }, 0)
      gsap.set('[class*="corte-phase-"] .mask > span', { yPercent: 110, rotate: 4 })
      PHASES.forEach((_, i) => {
        const at = 0.25 + i * 1
        const sel = `.corte-phase-${i} .mask > span`
        tl.fromTo(sel, { yPercent: 110, rotate: 4 }, { yPercent: 0, rotate: 0, duration: 0.3, stagger: 0.05, ease: 'power3.out', immediateRender: false }, at)
        tl.to(`.corte-tick-${i}`, { scaleX: 1, duration: 1 }, at - 0.25)
        if (i < PHASES.length - 1)
          tl.fromTo(sel, { yPercent: 0, rotate: 0 }, { yPercent: -130, rotate: -3, duration: 0.25, stagger: 0.04, ease: 'power2.in', immediateRender: false }, at + 0.7)
      })
      tl.to({}, { duration: 0.3 })
    }, el)
    return () => ctx.revert()
  }, [])

  if (reduced) return <CorteStatic />

  return (
    <section id="corte" ref={root} className="relative" aria-label="O corte">
      <div ref={stage} className="relative h-[100svh] w-full overflow-hidden bg-abyss">
        <canvas ref={canvas} className="corte-canvas absolute inset-0 h-full w-full" data-cursor="view" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(14,20,29,.55) 0%, transparent 30%, transparent 50%, rgba(14,20,29,.85) 100%)' }}
        />

        <div className="pad pointer-events-none absolute inset-x-0 top-24 flex justify-between text-cream/70">
          <span className="label">O corte</span>
          <span className="label">Scroll</span>
        </div>

        {PHASES.map((ph, i) => (
          <div key={ph.n} className={`corte-phase-${i} pad pointer-events-none absolute inset-x-0 bottom-[14svh] md:bottom-[10svh]`}>
            <span className="mask"><span className="label text-brass">{ph.n} / 04</span></span>
            <h2 className="display mt-2 text-[21vw] text-cream md:text-[14vw]">
              <span className="mask"><span>{ph.word === 'Resultado' ? <em className="font-normal italic">{ph.word}</em> : ph.word}</span></span>
            </h2>
            <span className="mask mt-3 max-w-md"><span className="font-serif text-lg text-cream/80 md:text-xl">{ph.line}</span></span>
          </div>
        ))}

        <div className="pad absolute inset-x-0 bottom-6 flex gap-2">
          {PHASES.map((_, i) => (
            <span key={i} className="relative h-px flex-1 overflow-hidden bg-cream/20">
              <span className={`corte-tick-${i} absolute inset-0 origin-left scale-x-0 bg-brass`} />
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

function CorteStatic() {
  return (
    <section id="corte" className="pad bg-abyss py-24" aria-label="O corte">
      <div className="grid gap-4 md:grid-cols-2">
        {CORTE_FALLBACK.map((s, i) => (
          <img key={s} src={s} alt={i ? 'Resultado do corte' : 'Barbeiro a trabalhar'} loading="lazy" className="aspect-[4/3] w-full object-cover" />
        ))}
      </div>
      <ol className="mt-10 grid gap-6 md:grid-cols-4">
        {PHASES.map((p) => (
          <li key={p.n}>
            <span className="label text-brass">{p.n}</span>
            <h2 className="display text-5xl text-cream">{p.word}</h2>
            <p className="mt-2 text-cream/70">{p.line}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
