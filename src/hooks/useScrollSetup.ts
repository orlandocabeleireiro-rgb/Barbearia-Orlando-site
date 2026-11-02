import { useEffect, type DependencyList } from 'react'
import { useMotion } from '../context/MotionContext'
import { cancel, enqueue } from '../lib/scrollQueue'

/**
 * Monta animações de scroll só depois do preloader, em fila (uma secção por tarefa).
 * Desativado em prefers-reduced-motion.
 */
export function useScrollSetup(setup: () => void | (() => void), deps: DependencyList, enabled = true) {
  const { ready, reduced } = useMotion()
  useEffect(() => {
    if (!ready || reduced || !enabled) return
    let cleanup: void | (() => void)
    let done = false
    const id = enqueue(() => {
      if (!done) cleanup = setup()
    })
    return () => {
      done = true
      cancel(id)
      cleanup?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, reduced, enabled, ...deps])
}
