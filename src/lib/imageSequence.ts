/** Desenha imagens no canvas com “object-fit: cover” e escala opcional (zoom). */
export function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | ImageBitmap,
  w: number,
  h: number,
  zoom = 1,
  focusX = 0.5,
  focusY = 0.5,
) {
  const iw = img.width
  const ih = img.height
  const s = Math.max(w / iw, h / ih) * zoom
  const dw = iw * s
  const dh = ih * s
  ctx.drawImage(img, (w - dw) * focusX, (h - dh) * focusY, dw, dh)
}

export function sizeCanvas(canvas: HTMLCanvasElement, maxDpr: number) {
  const dpr = Math.min(window.devicePixelRatio || 1, maxDpr)
  const w = canvas.clientWidth
  const h = canvas.clientHeight
  if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
    canvas.width = Math.round(w * dpr)
    canvas.height = Math.round(h * dpr)
  }
  return { w: canvas.width, h: canvas.height }
}
