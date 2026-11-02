// Converte JPG/PNG de public/assets (incl. espaco/) em WebP otimizado e
// regenera src/data/espaco.json.
// Uso: npm run images
import sharp from 'sharp'
import { readdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs'
import { join, parse } from 'node:path'

const dirs = ['public/assets', 'public/assets/espaco']
const SKIP = new Set(['logo.png'])

for (const dir of dirs) {
  if (!existsSync(dir)) continue
  for (const f of readdirSync(dir)) {
    const { name, ext } = parse(f)
    if (!/\.(jpe?g|png)$/i.test(ext) || SKIP.has(f)) continue
    const outPath = join(dir, `${name}.webp`)
    await sharp(join(dir, f)).rotate().resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true }).webp({ quality: 76 }).toFile(outPath)
    console.log('✓', outPath)
  }
}

// dados da galeria (src/data/espaco.json): usa as fotos reais (não-substitutos) se existirem
const esp = 'public/assets/espaco'
if (existsSync(esp)) {
  const real = readdirSync(esp).filter((f) => /\.(jpe?g|png)$/i.test(f)).map((f) => parse(f).name)
  if (real.length) {
    const old = existsSync('src/data/espaco.json') ? JSON.parse(readFileSync('src/data/espaco.json', 'utf8')) : []
    const captions = Object.fromEntries(old.map((o) => [o.src, o.caption]))
    const list = real.sort().map((n) => ({ src: `/assets/espaco/${n}.webp`, caption: captions[`/assets/espaco/${n}.webp`] ?? n.replace(/[-_]/g, ' ') }))
    writeFileSync('src/data/espaco.json', JSON.stringify(list, null, 2))
    console.log('✓ manifest espaço:', list.length, 'fotos')
  }
}
