// Gera public/assets/pole-portrait.webp e pole-landscape.webp a partir da cena 3D real.
// Requer: npm run dev a correr em :5173 e Playwright (já instalado no ambiente / npx playwright).
const { chromium } = require('playwright')
const sharp = require('sharp')
;(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
  for (const [name, w, h] of [['portrait', 430, 932], ['landscape', 1440, 900]]) {
    const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2.5 })
    await p.goto('http://127.0.0.1:5173/tools/render.html')
    await p.waitForFunction(() => window.__ready, null, { timeout: 120000 })
    const buf = await p.screenshot({ omitBackground: true, timeout: 120000 })
    await sharp(buf).resize(name === 'portrait' ? 900 : 1920).webp({ quality: 82, alphaQuality: 90 }).toFile(`public/assets/pole-${name}.webp`)
    console.log('✓ pole-' + name)
    await p.close()
  }
  await b.close()
})()
