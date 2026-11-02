# Barbearia Orlando — motion site

Site institucional da Barbearia Orlando (Porto, desde 2015) em **barbeariaorlando.pt**.
Projeto independente: não partilha código nem deploy com o sistema de marcações
(`marcacoes.barbeariaorlando.pt`), que é apenas um link externo.

**Fontes:** alojadas em `public/fonts` (sem pedidos ao Google).

**Stack:** React 18 · Vite · TypeScript · Tailwind · GSAP + ScrollTrigger · Lenis · Framer Motion · Three.js (@react-three/fiber + drei)

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # gera dist/
npm run preview   # serve o build
```

## Secções

| # | Secção | Ficheiro |
|---|---|---|
| 1 | Hero 3D pinned (~200vh), dolly da câmara até às riscas | `src/sections/Hero.tsx`, `src/three/*` |
| 3 | Manifesto — palavras a acender, vídeo de fumo atrás | `src/sections/Manifesto.tsx` |
| 4 | Serviços — cartões empilhados com preço animado | `src/sections/Servicos.tsx` |
| 5 | Marquee diagonal reativo à velocidade do scroll | `src/sections/Marquee.tsx` |
| 6 | O Espaço — galeria horizontal pinned | `src/sections/Espaco.tsx` |
| 7 | Marcar — título letra a letra, botão magnético, contactos | `src/sections/Marcar.tsx` |

Textos, preços, horário e contactos estão todos em **`src/data/site.ts`**.

## Substituir conteúdos

### Fotos (trabalho, resultado, barba)
Coloca `trabalho.jpg`, `resultado.jpg` e `barba.jpg` em `public/assets/` e corre:
```bash
npm run images     # converte para WebP otimizado
```

### Fotos do espaço
Coloca as fotos (`.jpg`/`.png`) em `public/assets/espaco/`, apaga os `.webp` de substituição
que não quiseres e corre `npm run images`. A galeria é gerada em `src/data/espaco.json`
(podes editar as legendas lá).

### Vídeo de textura (manifesto)
`node scripts/make-smoke.mjs` gera um fumo procedural em loop. Para usar um vídeo
real, substitui `public/assets/video/textura.mp4` e `textura.webm`.

### Logótipo
`node scripts/logo.mjs caminho/para/logo.png` recorta em círculo e gera todos os tamanhos e ícones.
`node scripts/og.mjs` regenera a imagem de partilha (Open Graph).

## Performance
- Telemóvel: o hero mostra uma imagem renderizada do poste e carrega o 3D (three.js, lazy) logo a seguir;
  dpr máx. 1.5, 280 partículas (vs 1100), vidro sem transmissão.
- O 3D pausa (`frameloop="never"`) quando o hero sai do ecrã.
- Animações de scroll montadas por fila, uma secção por tarefa.
- `prefers-reduced-motion`: versão estática (sem pins, sem 3D, sem Lenis).
- Lighthouse mobile (local, build de produção): Performance 92–95 · Acessibilidade 100 · Boas práticas 100 · SEO 100.

## Deploy (GitHub Pages)
O workflow `.github/workflows/deploy.yml` faz build e publica a cada push para `main`.

1. No GitHub: **Settings → Pages → Source: GitHub Actions**.
2. **Settings → Pages → Custom domain:** `barbeariaorlando.pt` (o ficheiro `public/CNAME` já existe) e ativar **Enforce HTTPS**.
3. No fornecedor do domínio, só para o domínio principal e `www`:
   - `A` `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` `www` → `orlandocabeleireiro-rgb.github.io`
   - **Não mexer** no registo de `marcacoes` — as marcações continuam onde estão.

## Imagens de substituição (renders 3D)
Até haver fotos reais, as imagens de `public/assets` (trabalho, resultado, barba, espaço) são renders 3D
gerados por `tools/photos.tsx`. Para os refazer: `npm run dev` e depois `node scripts/render-photos.cjs [cena]`.
A imagem estática do poste (entrada do site) vem de `tools/render.tsx` via `node scripts/render-pole.cjs`.
Estas ferramentas não entram no build do site.
