import { useEffect, type RefObject } from 'react'

/**
 * Garante que as linhas de um título grande cabem na largura disponível.
 * Alguns Android (ex.: navegador do Instagram, ou "tamanho de letra" do sistema aumentado)
 * aumentam o texto e as letras ficavam cortadas; aqui mede-se cada linha e, se for mais
 * larga do que o espaço, reduz-se só essa linha. Usa offsetLeft/offsetWidth (ignora as animações).
 */
export function useFitLines(root: RefObject<HTMLElement>, lineSelector: string, charSelector: string, margin = 0.96) {
  useEffect(() => {
    const el = root.current
    if (!el) return
    const fit = () => {
      const lines = Array.from(el.querySelectorAll<HTMLElement>(lineSelector))
      lines.forEach((l) => (l.style.fontSize = ''))
      const avail = (el.parentElement ?? el).clientWidth * margin
      lines.forEach((l) => {
        const chars = Array.from(l.querySelectorAll<HTMLElement>(charSelector))
        if (!chars.length) return
        let min = Infinity
        let max = -Infinity
        chars.forEach((c) => {
          min = Math.min(min, c.offsetLeft)
          max = Math.max(max, c.offsetLeft + c.offsetWidth)
        })
        const w = max - min
        if (w > avail) l.style.fontSize = `${(parseFloat(getComputedStyle(l).fontSize) * avail) / w}px`
      })
    }
    fit()
    document.fonts?.ready.then(fit)
    window.addEventListener('resize', fit)
    window.addEventListener('orientationchange', fit)
    return () => {
      window.removeEventListener('resize', fit)
      window.removeEventListener('orientationchange', fit)
    }
  }, [root, lineSelector, charSelector, margin])
}
