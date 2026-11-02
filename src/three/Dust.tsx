import { useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { createDustMaterial } from './poleShader'

export function Dust({ count }: { count: number }) {
  const dpr = useThree((s) => s.viewport.dpr)
  const material = useMemo(() => createDustMaterial(dpr), [dpr])
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const pos = new Float32Array(count * 3)
    const seed = new Float32Array(count)
    const size = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 9
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6 - 0.5
      seed[i] = Math.random()
      size[i] = 0.4 + Math.random() * Math.random() * 2.4
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1))
    g.setAttribute('aSize', new THREE.BufferAttribute(size, 1))
    return g
  }, [count])

  useFrame((_, dt) => {
    material.uniforms.uTime.value += dt
  })

  return <points geometry={geometry} material={material} frustumCulled={false} />
}
