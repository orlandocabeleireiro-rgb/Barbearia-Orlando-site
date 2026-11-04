// Vai buscar as últimas publicações do Instagram da barbearia (API oficial) antes de cada publicação do site.
// Corre no GitHub (deploy.yml), com a chave guardada no segredo IG_TOKEN. Sem chave, não faz nada
// e o site mostra as fotos do espaço, como antes.
import sharp from 'sharp'
import { mkdirSync, writeFileSync } from 'node:fs'

const TOKEN = process.env.IG_TOKEN
const N = 4
if (!TOKEN) {
  console.log('IG_TOKEN não definido: mantém as fotos do espaço.')
  process.exit(0)
}
const api = process.env.IG_API || 'https://graph.instagram.com'
try {
  // prolonga a validade da chave (60 dias) sempre que o site é publicado
  await fetch(`${api}/refresh_access_token?grant_type=ig_refresh_token&access_token=${TOKEN}`).catch(() => {})
  const r = await fetch(`${api}/me/media?fields=id,media_type,media_url,thumbnail_url,permalink,caption,timestamp&limit=20&access_token=${TOKEN}`)
  if (!r.ok) throw new Error(`Instagram respondeu ${r.status}: ${(await r.text()).slice(0, 200)}`)
  const { data = [] } = await r.json()
  const posts = data.map((p) => ({ ...p, img: p.media_type === 'VIDEO' ? p.thumbnail_url : p.media_url })).filter((p) => p.img).slice(0, N)
  if (!posts.length) throw new Error('sem publicações com imagem')
  mkdirSync('public/assets/instagram', { recursive: true })
  const out = []
  for (const [i, p] of posts.entries()) {
    const buf = Buffer.from(await (await fetch(p.img)).arrayBuffer())
    const file = `assets/instagram/ig-${i + 1}.webp`
    await sharp(buf).resize(800, 800, { fit: 'cover' }).webp({ quality: 80 }).toFile(`public/${file}`)
    const alt = (p.caption ?? '').split('\n')[0].slice(0, 120)
    out.push({ src: file, url: p.permalink, alt, video: p.media_type === 'VIDEO' })
  }
  writeFileSync('src/data/instagram.json', JSON.stringify(out, null, 2))
  console.log(`✓ ${out.length} publicações do Instagram`)
} catch (e) {
  // nunca impede a publicação do site: fica com as fotos do espaço
  console.log('Instagram indisponível, mantém as fotos do espaço:', e.message)
}
