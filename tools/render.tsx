// Página só de desenvolvimento: renderiza o poste 3D numa imagem estática
// (usada antes do 3D carregar e em prefers-reduced-motion). Ver scripts/render-pole.cjs
import ReactDOM from 'react-dom/client'
import HeroScene from '../src/three/HeroScene'

ReactDOM.createRoot(document.getElementById('r')!).render(
  <HeroScene variant="hero" quality="high" active particles={0} onReady={() => setTimeout(() => ((window as any).__ready = true), 1500)} />,
)
