import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useMotion } from '../context/MotionContext'

type Mode = 'default' | 'link' | 'view'

/** Cursor personalizado: cresce sobre links, mostra “Ver” sobre imagens. Só desktop. */
export function Cursor() {
  const { finePointer, reduced } = useMotion()
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 520, damping: 40, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 520, damping: 40, mass: 0.6 })
  const [mode, setMode] = useState<Mode>('default')
  const [hidden, setHidden] = useState(true)

  useEffect(() => {
    if (!finePointer || reduced) return
    document.body.classList.add('has-cursor')
    const move = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setHidden(false)
      const t = e.target as HTMLElement
      const v = t.closest?.('[data-cursor="view"]')
      const l = t.closest?.('a,button,[data-cursor="link"]')
      setMode(v ? 'view' : l ? 'link' : 'default')
    }
    const leave = () => setHidden(true)
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerleave', leave)
    return () => {
      document.body.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', leave)
    }
  }, [finePointer, reduced, x, y])

  if (!finePointer || reduced) return null

  const size = mode === 'view' ? 96 : mode === 'link' ? 56 : 12
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] flex items-center justify-center rounded-full"
      style={{ x: sx, y: sy, translateX: '-50%', translateY: '-50%', borderWidth: 1, borderStyle: 'solid', mixBlendMode: mode === 'view' ? 'normal' : 'difference' }}
      animate={{
        width: size,
        height: size,
        opacity: hidden ? 0 : 1,
        backgroundColor: mode === 'view' ? 'rgba(168,50,45,0.92)' : mode === 'link' ? 'rgba(237,227,204,0)' : 'rgba(237,227,204,1)',
        borderColor: mode === 'link' ? 'rgba(237,227,204,1)' : 'rgba(237,227,204,0)',
      }}
      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
    >
      <motion.span
        className="label text-cream"
        animate={{ opacity: mode === 'view' ? 1 : 0, scale: mode === 'view' ? 1 : 0.6 }}
      >
        Ver
      </motion.span>
    </motion.div>
  )
}
