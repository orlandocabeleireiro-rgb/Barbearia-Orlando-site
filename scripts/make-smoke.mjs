// Gera um vídeo de textura de fumo/luz em loop perfeito (12s) com ffmpeg.
// Substituível por um vídeo real: coloca-o em public/assets/video/textura.mp4
import { spawnSync } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const tmp = mkdtempSync(join(tmpdir(), 'smoke-'))
const run = (a) => {
  const r = spawnSync('ffmpeg', ['-v', 'error', '-y', ...a], { stdio: 'inherit' })
  if (r.status) process.exit(r.status)
}
for (const [i, seed, sig] of [[1, 7, 16], [2, 42, 26]]) {
  run(['-f', 'lavfi', '-i', 'color=c=gray:s=360x220', '-vf', `format=gray,noise=alls=100:all_seed=${seed},gblur=sigma=${sig},normalize=smoothing=0,scale=1800:1100:flags=bicubic,curves=all='0/0 0.45/0.02 0.75/0.35 1/1'`, '-frames:v', '1', join(tmp, `n${i}.png`)])
}
const P = '2*PI*t/12'
const fc = [
  `[0]format=gray,crop=1280:720:x='260+240*sin(${P})':y='190+150*cos(${P})'[a]`,
  `[1]format=gray,crop=1280:720:x='260+240*cos(${P})':y='190-150*sin(${P})'[b]`,
  `[a][b]blend=all_mode=lighten,gblur=sigma=5,format=rgb24,colorchannelmixer=rr=1:gg=0.76:bb=0.5,scale=960:540,format=yuv420p[v]`,
].join(';')
const common = ['-loop', '1', '-i', join(tmp, 'n1.png'), '-loop', '1', '-i', join(tmp, 'n2.png'), '-filter_complex', fc, '-map', '[v]', '-t', '12', '-r', '24', '-an']
run([...common, '-c:v', 'libx264', '-crf', '32', '-preset', 'slow', '-movflags', '+faststart', 'public/assets/video/textura.mp4'])
run([...common, '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '45', '-row-mt', '1', 'public/assets/video/textura.webm'])
run(['-i', 'public/assets/video/textura.mp4', '-frames:v', '1', '-vf', 'scale=480:-2', '-q:v', '70', 'public/assets/video/textura-poster.webp'])
rmSync(tmp, { recursive: true, force: true })
console.log('✓ public/assets/video/textura.{mp4,webm} + poster')
