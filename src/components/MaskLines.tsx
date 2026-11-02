import { useRef, type ElementType, type ReactNode } from 'react'
import { gsap } from '../lib/gsap'
import { useScrollSetup } from '../hooks/useScrollSetup'

type Props = {
  lines: ReactNode[]
  as?: ElementType
  className?: string
  lineClassName?: string
  delay?: number
  stagger?: number
  start?: string
}

/** Texto por máscara: cada linha sobe de baixo de um recorte. Nunca fade simples. */
export function MaskLines({ lines, as: Tag = 'div', className, lineClassName, delay = 0, stagger = 0.09, start = 'top 85%' }: Props) {
  const ref = useRef<HTMLElement>(null)

  useScrollSetup(() => {
    const el = ref.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll('.mask > span'),
        { yPercent: 110, rotate: 3 },
        { yPercent: 0, rotate: 0, duration: 1.15, ease: 'expo.out', stagger, delay, scrollTrigger: { trigger: el, start, once: true } },
      )
    }, el)
    return () => ctx.revert()
  }, [delay, stagger, start])

  return (
    <Tag ref={ref} className={className}>
      {lines.map((l, i) => (
        <span key={i} className="mask">
          <span className={lineClassName} style={{ transformOrigin: '0 100%' }}>{l}</span>
        </span>
      ))}
    </Tag>
  )
}
