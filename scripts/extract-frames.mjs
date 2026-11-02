// Converte raw/corte.mp4 em frames WebP para a sequência de scroll.
//   desktop: 1600px de largura, ~120 frames
//   mobile:  720px de largura, ~60 frames (mais leve)
// Uso: npm run frames  [-- --input raw/corte.mp4 --desktop 120 --mobile 60]
import { spawnSync } from 'node:child_process'
import { mkdirSync, rmSync, readdirSync, writeFileSync, existsSync, statSync } from 'node:fs'
import { join } from 'node:path'

const args = Object.fromEntries(process.argv.slice(2).join(' ').split('--').filter(Boolean).map((s) => s.trim().split(/\s+/)))
const input = args.input ?? 'raw/corte.mp4'
const OUT = 'public/sequences/corte'
const targets = {
  desktop: { width: 1600, frames: Number(args.desktop ?? 120), quality: 72 },
  mobile: { width: 720, frames: Number(args.mobile ?? 60), quality: 62 },
}

if (!existsSync(input)) {
  console.error(`✗ Não encontrei ${input}. Coloca o vídeo lá e volta a correr.`)
  process.exit(1)
}
const ff = spawnSync('ffmpeg', ['-version'])
if (ff.status !== 0) {
  console.error('✗ ffmpeg não está instalado (brew install ffmpeg / apt install ffmpeg).')
  process.exit(1)
}

const probe = spawnSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'format=duration:stream=width,height', '-of', 'json', input], { encoding: 'utf8' })
const info = JSON.parse(probe.stdout)
const duration = Number(info.format.duration)
const { width: srcW, height: srcH } = info.streams[0]
console.log(`▶ ${input}: ${srcW}×${srcH}, ${duration.toFixed(2)}s`)

const manifest = { fps: 0, source: input, generated: new Date().toISOString() }
for (const [name, t] of Object.entries(targets)) {
  const dir = join(OUT, name)
  rmSync(dir, { recursive: true, force: true })
  mkdirSync(dir, { recursive: true })
  const fps = t.frames / duration
  const w = Math.min(t.width, srcW)
  const r = spawnSync(
    'ffmpeg',
    ['-v', 'error', '-i', input, '-vf', `fps=${fps.toFixed(5)},scale=${w}:-2:flags=lanczos`, '-frames:v', String(t.frames),
      '-c:v', 'libwebp', '-quality', String(t.quality), '-compression_level', '6', '-preset', 'photo', join(dir, '%04d.webp')],
    { stdio: 'inherit' },
  )
  if (r.status !== 0) process.exit(r.status ?? 1)
  const files = readdirSync(dir).filter((f) => f.endsWith('.webp'))
  const bytes = files.reduce((a, f) => a + statSync(join(dir, f)).size, 0)
  const h = Math.round((srcH * w) / srcW / 2) * 2
  manifest[name] = { count: files.length, width: w, height: h, path: `sequences/corte/${name}` }
  manifest.fps = Math.max(manifest.fps, fps)
  console.log(`✓ ${name}: ${files.length} frames, ${(bytes / 1024 / 1024).toFixed(2)} MB`)
}
writeFileSync(join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2))
console.log(`✓ ${OUT}/manifest.json`)
