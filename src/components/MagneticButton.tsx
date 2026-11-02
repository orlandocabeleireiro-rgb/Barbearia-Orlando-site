import { useRef } from 'react'
import { useMagnetic } from '../hooks/useMagnetic'
import { useMotion } from '../context/MotionContext'

/** Botão circular vermelho, magnético, com texto a rodar à volta. */
export function BookButton({ href, label = 'Marcar corte' }: { href: string; label?: string }) {
  const wrap = useRef<HTMLAnchorElement>(null)
  const inner = useRef<HTMLSpanElement>(null)
  const { finePointer, reduced } = useMotion()
  useMagnetic(wrap, 0.4, finePointer && !reduced)
  useMagnetic(inner, 0.25, finePointer && !reduced)
  const ring = ' MARCAR CORTE · BARBEARIA ORLANDO · PORTO · '
  return (
    <a ref={wrap} href={href} className="group relative block h-44 w-44 md:h-60 md:w-60" aria-label={label}>
      <svg viewBox="0 0 200 200" className={`absolute inset-0 h-full w-full ${reduced ? '' : 'animate-[spin_16s_linear_infinite]'}`} aria-hidden>
        <defs>
          <path id="ring" d="M100,100 m-84,0 a84,84 0 1,1 168,0 a84,84 0 1,1 -168,0" />
        </defs>
        <text className="fill-cream font-label text-[13px] font-semibold tracking-[0.32em]">
          <textPath href="#ring">{ring}</textPath>
        </text>
      </svg>
      <span
        ref={inner}
        className="absolute inset-[18%] flex items-center justify-center rounded-full bg-barber text-cream shadow-[0_20px_60px_rgba(168,50,45,.45)] transition-[background-color,transform] duration-500 group-hover:scale-110 group-hover:bg-[#bf3a34]"
      >
        <span className="text-center font-display text-xl italic leading-tight md:text-2xl">
          Marcar
          <br />
          corte
        </span>
      </span>
    </a>
  )
}
