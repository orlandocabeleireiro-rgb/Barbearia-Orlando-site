import { useEffect, useState } from 'react'
import { SITE } from '../data/site'

/** Botão “Marcar” fixo no fundo, só no telemóvel. Esconde-se na secção final. */
export function MobileCTA() {
  const [hide, setHide] = useState(true)
  useEffect(() => {
    const onScroll = () => {
      const end = document.getElementById('marcar')
      const past = window.scrollY > window.innerHeight * 0.6
      const atEnd = end ? end.getBoundingClientRect().top < window.innerHeight * 0.6 : false
      setHide(!past || atEnd)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <a
      href={SITE.booking}
      className={`label fixed inset-x-4 bottom-[max(16px,env(safe-area-inset-bottom))] z-[75] flex items-center justify-between rounded-full bg-barber px-6 py-4 text-[13px] text-cream shadow-[0_10px_40px_rgba(0,0,0,.5)] transition-transform duration-500 md:hidden ${hide ? 'translate-y-[180%]' : ''}`}
    >
      <span>Marcar corte</span>
      <span aria-hidden>→</span>
    </a>
  )
}
