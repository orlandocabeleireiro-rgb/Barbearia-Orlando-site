// Recorta o logótipo em círculo (remove o fundo preto) e gera os tamanhos usados no site.
// Uso: node scripts/logo.mjs raw/brand/logo-original.png
import sharp from 'sharp'
const src = process.argv[2] ?? 'raw/brand/logo-original.png'
const meta = await sharp(src).metadata()
const S = Math.min(meta.width, meta.height)
// o selo ocupa ~80% da imagem, centrado
const r = Math.round(S * 0.4)
const cx = Math.round(meta.width / 2), cy = Math.round(meta.height / 2)
const crop = await sharp(src).extract({ left: cx - r, top: cy - r, width: r * 2, height: r * 2 }).toBuffer()
const mask = Buffer.from(`<svg width="${r * 2}" height="${r * 2}"><circle cx="${r}" cy="${r}" r="${r - 1}" fill="#fff"/></svg>`)
const round = await sharp(crop).composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer()
await sharp(round).resize(512).png({ palette: true, quality: 90, compressionLevel: 9 }).toFile('public/assets/logo.png')
await sharp(round).resize(192).webp({ quality: 85 }).toFile('public/assets/logo-192.webp')
await sharp(round).resize(720).webp({ quality: 82 }).toFile('public/assets/logo-720.webp')
await sharp(round).resize(180).flatten({ background: '#0E141D' }).png({ palette: true }).toFile('public/apple-touch-icon.png')
await sharp(round).resize(48).png().toFile('public/favicon.png')
console.log('✓ logo', S, '→ 512/192/720 + ícones')
