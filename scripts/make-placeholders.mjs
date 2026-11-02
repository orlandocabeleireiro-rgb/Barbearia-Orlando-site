// Gera imagens de substituição elegantes (só cria se o ficheiro não existir).
// Uso: node scripts/make-placeholders.mjs
import sharp from 'sharp'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

const C = { navy: '#1F2A3A', abyss: '#0E141D', red: '#A8322D', cream: '#EDE3CC', brass: '#B8925A' }

function frameSvg(w, h, title, sub, hue = C.brass) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <defs>
    <radialGradient id="l" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="#3a3428"/><stop offset=".45" stop-color="${C.navy}"/><stop offset="1" stop-color="${C.abyss}"/></radialGradient>
    <pattern id="p" width="28" height="28" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)"><rect width="14" height="28" fill="${hue}" opacity=".05"/></pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#l)"/><rect width="100%" height="100%" fill="url(#p)"/>
  <rect x="${w * 0.04}" y="${h * 0.04}" width="${w * 0.92}" height="${h * 0.92}" fill="none" stroke="${C.brass}" stroke-opacity=".35"/>
  <text x="50%" y="50%" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="${Math.round(w / 9)}" fill="${C.cream}" fill-opacity=".85">${title}</text>
  <text x="50%" y="${h * 0.5 + w / 12}" text-anchor="middle" font-family="Arial Narrow,Arial,sans-serif" letter-spacing="6" font-size="${Math.round(w / 60)}" fill="${C.brass}">${sub}</text>
</svg>`
}

async function out(path, svg, fmt = 'webp') {
  if (existsSync(path)) return console.log('· existe', path)
  mkdirSync(dirname(path), { recursive: true })
  let img = sharp(Buffer.from(svg))
  img = fmt === 'png' ? img.png() : fmt === 'jpg' ? img.jpeg({ quality: 82 }) : img.webp({ quality: 78 })
  await img.toFile(path)
  console.log('✓', path)
}

await out('public/assets/trabalho.webp', frameSvg(1600, 1000, 'O trabalho', 'SUBSTITUIR · TRABALHO.JPG'))
await out('public/assets/resultado.webp', frameSvg(1600, 1000, 'O resultado', 'SUBSTITUIR · RESULTADO.JPG', C.red))
await out('public/assets/barba.webp', frameSvg(1200, 1500, 'A barba', 'SUBSTITUIR · BARBA.JPG'))
await out(
  'public/assets/logo.png',
  `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><circle cx="256" cy="256" r="250" fill="${C.navy}" stroke="${C.brass}" stroke-width="8"/><text x="50%" y="58%" text-anchor="middle" font-family="Georgia,serif" font-weight="900" font-size="210" fill="${C.cream}">O</text><text x="50%" y="80%" text-anchor="middle" font-family="Arial Narrow,Arial" letter-spacing="10" font-size="34" fill="${C.brass}">2015</text></svg>`,
  'png',
)
await out(
  'public/og-image.jpg',
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="100%" height="100%" fill="${C.abyss}"/>
  <g transform="translate(980 60) rotate(0)"><rect width="70" height="510" fill="${C.cream}"/>${Array.from({ length: 14 }, (_, i) => `<polygon points="0,${i * 40 - 40} 70,${i * 40 - 80} 70,${i * 40 - 60} 0,${i * 40 - 20}" fill="${i % 2 ? '#2C4467' : C.red}"/>`).join('')}</g>
  <text x="80" y="300" font-family="Georgia,serif" font-weight="900" font-size="120" fill="${C.cream}">BARBEARIA</text>
  <text x="80" y="420" font-family="Georgia,serif" font-weight="900" font-size="120" fill="${C.cream}">ORLANDO</text>
  <text x="84" y="490" font-family="Georgia,serif" font-style="italic" font-size="40" fill="${C.brass}">Porto · Desde 2015</text></svg>`,
  'jpg',
)

// fotos do espaço (substitutos com o nome do ficheiro)
const espaco = ['cadeira', 'balcao', 'espelho', 'ferramentas', 'montra', 'detalhe']
for (const n of espaco) await out(`public/assets/espaco/${n}.webp`, frameSvg(1100, 1400, n, `SUBSTITUIR · ESPACO/${n.toUpperCase()}.JPG`))
if (!existsSync('src/data/espaco.json')) {
  writeFileSync(
    'src/data/espaco.json',
    JSON.stringify(espaco.map((n) => ({ src: `assets/espaco/${n}.webp`, caption: n, placeholder: true })), null, 2),
  )
}
