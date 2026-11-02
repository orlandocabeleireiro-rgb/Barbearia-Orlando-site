import { lazy, startTransition, Suspense, useEffect, useState } from 'react'
import { useMotion } from './context/MotionContext'
import { startLenis } from './lib/lenis'
import { arm, requestRefresh } from './lib/scrollQueue'
import { Grain } from './components/Grain'
import { Nav } from './components/Nav'
import { MobileCTA } from './components/MobileCTA'
import { Hero } from './sections/Hero'
import { BelowFold } from './sections/BelowFold'

const Cursor = lazy(() => import('./components/Cursor').then((m) => ({ default: m.Cursor })))

export default function App() {
  const { reduced, mobile, ready, finePointer } = useMotion()
  // o resto da página monta numa transição (renderização fatiada, sem bloquear)
  const [rest, setRest] = useState(false)
  useEffect(() => startTransition(() => setRest(true)), [])

  // monta as animações de scroll das secções: desktop logo após o preloader;
  // telemóvel na 1.ª interação ou após 5s de inatividade (protege o carregamento)
  useEffect(() => {
    if (!ready) return
    if (!mobile) return arm()
    const evs = ['touchstart', 'pointerdown', 'wheel', 'scroll', 'keydown'] as const
    const go = () => arm()
    evs.forEach((e) => window.addEventListener(e, go, { once: true, passive: true }))
    const t = window.setTimeout(go, 5000)
    return () => {
      clearTimeout(t)
      evs.forEach((e) => window.removeEventListener(e, go))
    }
  }, [ready, mobile])

  useEffect(() => {
    startLenis(reduced || mobile)
    const r = () => requestRefresh(200)
    document.fonts.ready.then(r)
    window.addEventListener('load', r)
    return () => window.removeEventListener('load', r)
  }, [reduced, mobile])

  return (
    <>
      <Nav />
      <main>
        <Hero />
        {rest && <BelowFold />}
      </main>
      <MobileCTA />
      {finePointer && !reduced && (
        <Suspense fallback={null}>
          <Cursor />
        </Suspense>
      )}
      <Grain />
    </>
  )
}
