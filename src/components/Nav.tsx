import { lazy, Suspense, useEffect, useState } from 'react'
import { lockScroll, scrollTo } from '../lib/lenis'

// o menu (framer-motion) só é carregado quando é preciso
const loadMenu = () => import('./Menu')
const Menu = lazy(loadMenu)

export function Nav() {
  const [open, setOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const prefetch = () => loadMenu().then(() => setLoaded(true))

  useEffect(() => {
    lockScroll(open)
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [open])

  const go = (href: string) => {
    setOpen(false)
    setTimeout(() => scrollTo(href), 450)
  }

  return (
    <>
      <header className="pad fixed inset-x-0 top-0 z-[80] flex items-center justify-between py-5">
        <a href="#top" onClick={(e) => (e.preventDefault(), go('#top'))} className="flex items-center gap-3" aria-label="Barbearia Orlando — início">
          <img src="assets/logo-192.webp" alt="" width={40} height={40} className="h-10 w-10 rounded-full" />
          <span className="label hidden text-cream sm:inline">Barbearia Orlando</span>
        </a>
        <button
          onClick={() => setOpen((o) => !o)}
          onPointerEnter={prefetch}
          onTouchStart={prefetch}
          onFocus={prefetch}
          className="label group flex items-center gap-3 text-cream"
          aria-expanded={open}
          aria-controls="menu"
        >
          <span className="relative block h-[1.25em] overflow-hidden leading-[1.25]">
            <span className={`block transition-transform duration-500 ${open ? '-translate-y-full' : ''}`}>Menu</span>
            <span className={`absolute left-0 top-full block transition-transform duration-500 ${open ? '-translate-y-full' : ''}`}>Fechar</span>
          </span>
          <span className="relative h-3 w-7">
            <span className={`absolute left-0 top-0 h-px w-full bg-cream transition-transform duration-500 ${open ? 'translate-y-1.5 rotate-45' : ''}`} />
            <span className={`absolute bottom-0 left-0 h-px w-full bg-cream transition-transform duration-500 ${open ? '-translate-y-1.5 -rotate-45' : ''}`} />
          </span>
        </button>
      </header>

      <Suspense fallback={null}>{(open || loaded) && <Menu open={open} go={go} />}</Suspense>
    </>
  )
}
