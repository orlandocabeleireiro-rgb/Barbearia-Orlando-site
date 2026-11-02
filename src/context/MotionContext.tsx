import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type Prefs = { reduced: boolean; mobile: boolean; finePointer: boolean; ready: boolean; setReady: (v: boolean) => void }

const Ctx = createContext<Prefs>({ reduced: false, mobile: false, finePointer: true, ready: false, setReady: () => {} })

const mq = (q: string) => (typeof window !== 'undefined' ? window.matchMedia(q).matches : false)

export function MotionProvider({ children }: { children: ReactNode }) {
  const [reduced, setReduced] = useState(() => mq('(prefers-reduced-motion: reduce)'))
  const [mobile, setMobile] = useState(() => mq('(max-width: 767px)') || mq('(pointer: coarse)'))
  const [finePointer] = useState(() => mq('(pointer: fine)'))
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const r = window.matchMedia('(prefers-reduced-motion: reduce)')
    const m = window.matchMedia('(max-width: 767px)')
    const onR = () => setReduced(r.matches)
    const onM = () => setMobile(m.matches || mq('(pointer: coarse)'))
    r.addEventListener('change', onR)
    m.addEventListener('change', onM)
    return () => {
      r.removeEventListener('change', onR)
      m.removeEventListener('change', onM)
    }
  }, [])

  return <Ctx.Provider value={{ reduced, mobile, finePointer, ready, setReady }}>{children}</Ctx.Provider>
}

export const useMotion = () => useContext(Ctx)
