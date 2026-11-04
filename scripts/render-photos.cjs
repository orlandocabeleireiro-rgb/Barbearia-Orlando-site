// Renderiza as "fotografias" 3D de substituição (tools/photos.tsx) para public/assets.
// Requer `npm run dev` em :5173. Uso: node scripts/render-photos.cjs [cena ...]
const { chromium } = require('playwright')
const sharp = require('sharp')
const JOBS = {
  'svc-cabelo': ['public/assets/servicos/cabelo.webp', 1400, 1400],
  'svc-barba': ['public/assets/servicos/barba.webp', 1400, 1400],
  'svc-completo': ['public/assets/servicos/cabelo-e-barba.webp', 1400, 1400],
  trabalho: ['public/assets/trabalho.webp', 1600, 1000],
  resultado: ['public/assets/resultado.webp', 1600, 1000],
  barba: ['public/assets/barba.webp', 1200, 1500],
  cadeira: ['public/assets/espaco/cadeira.webp', 1100, 1400],
  balcao: ['public/assets/espaco/balcao.webp', 1100, 1400],
  espelho: ['public/assets/espaco/espelho.webp', 1100, 1400],
  ferramentas: ['public/assets/espaco/ferramentas.webp', 1100, 1400],
  montra: ['public/assets/espaco/montra.webp', 1100, 1400],
  polo: ['public/assets/espaco/polo.webp', 1100, 1400],
}
;(async () => {
  const only = process.argv.slice(2)
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
  for (const [scene, [out, w, h]] of Object.entries(JOBS)) {
    if (only.length && !only.includes(scene)) continue
    const k = Number(process.env.SCALE || 1)
    const p = await b.newPage({ viewport: { width: Math.round(w * k), height: Math.round(h * k) } })
    p.on('pageerror', (e) => console.log(scene, 'ERRO', e.message))
    await p.goto(`http://127.0.0.1:5173/tools/photos.html?scene=${scene}`)
    await p.waitForFunction(() => window.__ready, null, { timeout: 240000 })
    const buf = await p.screenshot({ timeout: 240000 })
    await sharp(buf).webp({ quality: 80 }).toFile(process.env.OUT ? `${process.env.OUT}/${scene}.webp` : out)
    console.log('✓', scene, '→', out)
    await p.close()
  }
  await b.close()
})()
