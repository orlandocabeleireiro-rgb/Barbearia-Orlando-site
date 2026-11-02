// "Fotografias" 3D de substituição (renderizadas offline com scripts/render-photos.cjs).
// Cada cena é escolhida com ?scene=nome. Não faz parte do build do site.
import { useEffect, type ReactNode } from 'react'
import ReactDOM from 'react-dom/client'
import { Canvas, useThree } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { EffectComposer, DepthOfField, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import { BarberPole } from '../src/three/BarberPole'
import { Bokeh, Bottle, Bowl, Brush, Chair, Clipper, Comb, Mirror, Razor, Scissors, Towel, useLabel, useMarble, usePlaster, useTiles, useWood } from './props'

type Cam = { pos: [number, number, number]; look: [number, number, number]; fov?: number; focus: [number, number, number]; blur?: number }

function Rig({ cam }: { cam: Cam }) {
  const { camera } = useThree()
  useEffect(() => {
    camera.position.set(...cam.pos)
    camera.lookAt(...cam.look)
    ;(camera as THREE.PerspectiveCamera).fov = cam.fov ?? 35
    camera.updateProjectionMatrix()
  }, [camera, cam])
  return null
}

function Studio({ cam, children, key1 = [-5, 9, 6] as [number, number, number], warm = 1 }: { cam: Cam; children: ReactNode; key1?: [number, number, number]; warm?: number }) {
  return (
    <>
      <Rig cam={cam} />
      <color attach="background" args={['#0b1018']} />
      <fog attach="fog" args={['#0b1018', 14, 40]} />
      <ambientLight intensity={0.12} />
      <spotLight position={key1} angle={0.5} penumbra={0.9} intensity={420 * warm} color="#ffcf94" castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0004} />
      <spotLight position={[6, 5, -6]} angle={0.6} penumbra={1} intensity={120} color="#9fb6e0" />
      <pointLight position={[2, 1.5, 4]} intensity={6} color="#ffd9a8" />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} color="#ffd9a8" position={[-4, 4, 3]} scale={[3, 8, 1]} />
        <Lightformer form="rect" intensity={1} color="#ffffff" position={[4, 2, 3]} scale={[2, 6, 1]} />
        <Lightformer form="ring" intensity={1.5} color="#B8925A" position={[0, 6, -4]} scale={4} />
      </Environment>
      {children}
      <EffectComposer multisampling={4}>
        <DepthOfField target={cam.focus} focalLength={0.045} bokehScale={(cam.blur ?? 5) * 1.6} height={1000} />
        <Bloom intensity={0.9} luminanceThreshold={0.8} mipmapBlur />
        <Vignette offset={0.25} darkness={0.75} />
      </EffectComposer>
    </>
  )
}

function Counter({ y = 0, tex, size = 30 }: { y?: number; tex: THREE.Texture; size?: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]} receiveShadow>
      <planeGeometry args={[size, size]} />
      <meshPhysicalMaterial map={tex} roughness={0.35} clearcoat={0.6} clearcoatRoughness={0.25} />
    </mesh>
  )
}

function Wall({ z = -6, tex }: { z?: number; tex: THREE.Texture }) {
  return (
    <mesh position={[0, 5, z]} receiveShadow>
      <planeGeometry args={[60, 30]} />
      <meshStandardMaterial map={tex} roughness={0.95} />
    </mesh>
  )
}

/* ------------------------------ cenas ------------------------------ */

function Trabalho() {
  const wood = useWood()
  const label = useLabel('ORLANDO', 'after shave')
  return (
    <Studio cam={{ pos: [0.6, 1.5, 5.2], look: [0, 0.35, 0], fov: 30, focus: [0.1, 0.1, 1.2], blur: 7 }}>
      <Counter tex={wood} />
      <Bokeh z={-14} n={60} y={2} />
      <Razor position={[-0.9, 0.06, 1.3]} rotation={[-Math.PI / 2, 0, 0.12]} open={2.6} scale={0.8} />
      <Scissors position={[1.5, 0.08, 1.0]} rotation={[-Math.PI / 2, 0, -0.9]} scale={0.6} />
      <Comb position={[0.3, 0.04, 2.3]} rotation={[-Math.PI / 2, 0, -0.08]} scale={0.55} />
      <Clipper position={[-2.3, 0.32, -0.1]} rotation={[-Math.PI / 2, 0, 0.7]} scale={0.85} />
      <Brush position={[1.9, 0, -0.9]} scale={0.75} />
      <Bottle position={[-0.4, 0, -1.6]} label={label} scale={0.95} />
      <Bottle position={[0.9, 0, -2.6]} color="#2a5a3a" h={2.1} />
      <group position={[-3.6, 0, -5]} scale={0.9}>
        <BarberPole quality="high" />
      </group>
    </Studio>
  )
}

function Resultado() {
  const marble = useMarble()
  const wall = usePlaster('#15202e')
  const l1 = useLabel('ORLANDO', 'loção')
  const l2 = useLabel('ORLANDO', 'pomada', '#1F2A3A', '#EDE3CC')
  return (
    <Studio cam={{ pos: [0, 2.2, 7], look: [0, 1, 0], focus: [0, 0.8, 0.4], blur: 7 }}>
      <Counter tex={marble} />
      <Wall tex={wall} />
      <Bokeh z={-12} n={50} />
      <Towel position={[-1.8, 0.42, 0.2]} rotation={[0, 0.25, 0]} />
      <Towel position={[-1.6, 0.42, -0.85]} rotation={[0, 0.2, 0]} color="#e9e1d1" />
      <Towel position={[-1.7, 1.2, -0.3]} rotation={[0, 0.3, 0]} />
      <Bottle position={[0.6, 0, 0]} label={l1} h={1.9} />
      <Bottle position={[1.9, 0, -0.6]} color="#3a1a10" label={l2} h={1.4} />
      <Brush position={[3.1, 0, 0.6]} scale={0.8} />
      <group position={[3.8, 0, -4.5]}>
        <BarberPole quality="high" />
      </group>
    </Studio>
  )
}

function Barba() {
  const wood = useWood('#3a2112')
  return (
    <Studio cam={{ pos: [0.4, 2.8, 6.2], look: [0, 0.6, 0], fov: 30, focus: [0, 0.85, 0.3], blur: 7 }} key1={[-4, 8, 4]} warm={0.45}>
      <Counter tex={wood} />
      <Bokeh z={-12} n={60} y={2} />
      <Bowl position={[0, 0, 0]} />
      <Brush position={[1.55, 0, 0.5]} scale={0.7} />
      <Razor position={[-1.0, 0.06, 1.7]} rotation={[-Math.PI / 2, 0, -0.35]} open={0.12} scale={0.75} />
      <Towel position={[-1.6, 0.42, -1.6]} rotation={[0, 0.5, 0]} />
    </Studio>
  )
}

function Cadeira() {
  const tiles = useTiles()
  const wall = usePlaster('#1F2A3A')
  return (
    <Studio cam={{ pos: [3.2, 3.6, 8.5], look: [0, 2.1, 0], fov: 38, focus: [0, 2, 0], blur: 4 }} key1={[-3, 10, 5]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshPhysicalMaterial map={tiles} roughness={0.25} clearcoat={0.8} />
      </mesh>
      <Wall z={-5} tex={wall} />
      <Mirror position={[0, 5, -4.85]} w={3.4} h={3.4} />
      <Chair rotation={[0, -0.35, 0]} />
      <group position={[-3.4, 3, -4.4]} scale={0.8}>
        <BarberPole quality="high" />
      </group>
      <Bokeh z={-4.8} n={14} spread={8} y={7} />
    </Studio>
  )
}

function Balcao() {
  const marble = useMarble()
  const wall = usePlaster('#18222f')
  const labels = [useLabel('ORLANDO', 'loção'), useLabel('ORLANDO', 'óleo'), useLabel('ORLANDO', 'tónico', '#1F2A3A', '#EDE3CC')]
  const colors = ['#8a4b14', '#2a5a3a', '#5a1a14', '#c58b2a', '#1e3550', '#8a4b14']
  return (
    <Studio cam={{ pos: [2.6, 2.2, 6], look: [0, 1.1, 0], fov: 34, focus: [0.4, 1, 0.4], blur: 7 }}>
      <Counter tex={marble} />
      <Wall tex={wall} z={-3} />
      <Mirror position={[0, 4.2, -2.85]} w={6} h={3} />
      <Bokeh z={-2.6} n={10} spread={4} y={4} />
      {colors.map((c, i) => (
        <Bottle key={i} position={[-3 + i * 1.25, 0, (i % 2) * -0.7]} color={c} h={1.3 + (i % 3) * 0.35} label={labels[i % 3]} />
      ))}
      <Scissors position={[0.4, 0.08, 1.6]} rotation={[-Math.PI / 2, 0, 0.5]} scale={0.8} />
    </Studio>
  )
}

function Espelho() {
  const wall = usePlaster('#1F2A3A')
  const wood = useWood('#2e1a0e')
  return (
    <Studio cam={{ pos: [1.2, 4.2, 7.5], look: [0, 4, 0], fov: 36, focus: [0, 4, -2], blur: 3 }} key1={[-3, 9, 3]}>
      <Wall tex={wall} z={-2.2} />
      <Mirror position={[0, 4.6, -2.1]} w={2.8} h={3.8} />
      <mesh position={[0, 2.2, -1.5]} castShadow receiveShadow>
        <boxGeometry args={[5, 0.15, 1.2]} />
        <meshPhysicalMaterial map={wood} roughness={0.35} clearcoat={0.5} />
      </mesh>
      <Bottle position={[-1.4, 2.28, -1.5]} scale={0.6} />
      <Bottle position={[-0.7, 2.28, -1.6]} scale={0.6} color="#2a5a3a" h={2} />
      <Brush position={[1.2, 2.28, -1.4]} scale={0.6} />
      {/* candeeiros de parede */}
      {[-2.2, 2.2].map((x) => (
        <group key={x} position={[x, 5.6, -2]}>
          <mesh>
            <sphereGeometry args={[0.28, 24, 16]} />
            <meshBasicMaterial color="#ffd9a8" toneMapped={false} />
          </mesh>
          <pointLight intensity={8} color="#ffcf94" distance={6} />
          <mesh position={[0, -0.4, 0]}>
            <cylinderGeometry args={[0.06, 0.1, 0.5, 16]} />
            <meshStandardMaterial color="#B8925A" metalness={1} roughness={0.25} />
          </mesh>
        </group>
      ))}
    </Studio>
  )
}

function Ferramentas() {
  const leather = useWood('#2a1610')
  return (
    <Studio cam={{ pos: [0, 9, 0.8], look: [0, 0, 0], fov: 34, focus: [0, 0, 0], blur: 1.5 }} key1={[-4, 10, 2]}>
      <Counter tex={leather} />
      <Razor position={[-1.4, 0.06, -1.6]} rotation={[-Math.PI / 2, 0, 0.0]} open={Math.PI * 0.95} />
      <Scissors position={[1.1, 0.08, 0.2]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} />
      <Comb position={[-1.5, 0.04, 1.4]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={0.8} />
      <Brush position={[-0.2, 0.45, 1.9]} rotation={[0, 0, Math.PI / 2]} scale={0.75} />
      <Clipper position={[-0.3, 0.32, -0.2]} rotation={[-Math.PI / 2, 0, 0.1]} scale={0.8} />
    </Studio>
  )
}

function Montra() {
  const wall = usePlaster('#141b26')
  const glassText = useLabelGlass()
  return (
    <Studio cam={{ pos: [0, 3.5, 8], look: [0, 3.4, 0], fov: 38, focus: [0, 4.2, 0], blur: 4 }} key1={[-2, 9, -3]}>
      <Wall tex={wall} z={-6} />
      <Bokeh z={-5} n={40} spread={7} y={3} />
      <group position={[2.2, 1.6, -3]} scale={0.8}>
        <BarberPole quality="high" />
      </group>
      <Chair position={[-1.6, 0, -3.5]} rotation={[0, 0.5, 0]} scale={0.8} />
      {/* vidro da montra com letras douradas */}
      <mesh position={[0, 3.5, 0]}>
        <planeGeometry args={[8, 7]} />
        <meshPhysicalMaterial transparent opacity={0.12} roughness={0.05} metalness={0} clearcoat={1} color="#ffffff" />
      </mesh>
      <mesh position={[0, 4.4, 0.01]}>
        <planeGeometry args={[6, 3]} />
        <meshStandardMaterial map={glassText} transparent metalness={0.8} roughness={0.25} emissive="#B8925A" emissiveIntensity={0.15} />
      </mesh>
      {/* caixilho */}
      {[
        [0, 7, 8.4, 0.25],
        [0, 0, 8.4, 0.25],
        [-4.1, 3.5, 0.25, 7.2],
        [4.1, 3.5, 0.25, 7.2],
      ].map(([x, y, w, h], i) => (
        <mesh key={i} position={[x, y, 0.05]}>
          <boxGeometry args={[w, h, 0.2]} />
          <meshPhysicalMaterial color="#1F2A3A" roughness={0.3} clearcoat={1} />
        </mesh>
      ))}
    </Studio>
  )
}

function useLabelGlass() {
  const c = document.createElement('canvas')
  c.width = 1200
  c.height = 600
  const g = c.getContext('2d')!
  g.textAlign = 'center'
  g.fillStyle = '#d7b273'
  g.font = '900 150px "Playfair Display", Georgia, serif'
  g.fillText('ORLANDO', 600, 260)
  g.font = 'italic 64px "Playfair Display", Georgia, serif'
  g.fillText('barbearia · desde 2015', 600, 360)
  g.font = '600 34px "Barlow Condensed", Arial'
  g.fillText('C O R T E   ·   B A R B A   ·   N A V A L H A', 600, 450)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

function Detalhe() {
  const wall = usePlaster()
  return (
    <Studio cam={{ pos: [0.9, 1.9, 2.4], look: [0, 1.3, 0], fov: 30, focus: [0, 1.6, 0.4], blur: 8 }} key1={[-3, 6, 4]}>
      <Wall tex={wall} z={-4} />
      <Bokeh z={-8} n={50} spread={8} y={1} />
      <group rotation={[0, 0, -0.05]}>
        <BarberPole quality="high" />
      </group>
    </Studio>
  )
}

const SCENES: Record<string, () => JSX.Element> = {
  trabalho: Trabalho,
  resultado: Resultado,
  barba: Barba,
  cadeira: Cadeira,
  balcao: Balcao,
  espelho: Espelho,
  ferramentas: Ferramentas,
  montra: Montra,
  detalhe: Detalhe,
}

function App() {
  const name = new URLSearchParams(location.search).get('scene') ?? 'trabalho'
  const Scene = SCENES[name]
  return (
    <Canvas
      shadows
      dpr={1}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
      camera={{ fov: 35, near: 0.1, far: 80 }}
      onCreated={() => setTimeout(() => ((window as unknown as { __ready: boolean }).__ready = true), 4000)}
    >
      <Scene />
    </Canvas>
  )
}

document.fonts.load('900 72px "Playfair Display"').finally(() => ReactDOM.createRoot(document.getElementById('r')!).render(<App />))
