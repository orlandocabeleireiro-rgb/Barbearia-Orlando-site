import * as THREE from 'three'

/** Riscas helicoidais vermelho / creme / azul, com luz quente falsa e anti-aliasing. */
export function createStripeMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uTwist: { value: 2.2 },
      uRed: { value: new THREE.Color('#A8322D') },
      uCream: { value: new THREE.Color('#EDE3CC') },
      uBlue: { value: new THREE.Color('#2C4467') },
      uLight: { value: new THREE.Vector3(-0.6, 0.5, 0.9).normalize() },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      varying vec3 vN;
      varying vec3 vV;
      void main() {
        vUv = uv;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vN = normalize(normalMatrix * normal);
        vV = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime, uTwist;
      uniform vec3 uRed, uCream, uBlue, uLight;
      varying vec2 vUv;
      varying vec3 vN;
      varying vec3 vV;

      float band(float x, float a, float b, float w) {
        return smoothstep(a - w, a + w, x) - smoothstep(b - w, b + w, x);
      }

      void main() {
        float t = vUv.x * 2.0 + vUv.y * uTwist - uTime * 0.22;
        float s = fract(t);
        float w = max(fwidth(t) * 0.75, 0.002);
        // ciclo: vermelho, creme, azul, creme
        vec3 col = uCream;
        col = mix(col, uRed, band(s, 0.0, 0.25, w) + band(s, 1.0, 1.25, w));
        col = mix(col, uBlue, band(s, 0.5, 0.75, w));

        vec3 N = normalize(vN);
        vec3 V = normalize(vV);
        float diff = 0.38 + 0.62 * max(dot(N, uLight), 0.0);
        vec3 R = reflect(-uLight, N);
        float spec = pow(max(dot(R, V), 0.0), 36.0);
        float rim = pow(1.0 - max(dot(N, V), 0.0), 2.5);
        vec3 warm = vec3(1.0, 0.86, 0.66);
        vec3 c = col * diff * warm + spec * 0.55 * warm;
        c *= 1.0 - rim * 0.65;
        gl_FragColor = vec4(c, 1.0);
        #include <colorspace_fragment>
      }
    `,
  })
}

export function createDustMaterial(dpr: number) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uDpr: { value: dpr }, uColor: { value: new THREE.Color('#E9C48A') } },
    vertexShader: /* glsl */ `
      uniform float uTime, uDpr;
      attribute float aSeed;
      attribute float aSize;
      varying float vAlpha;
      void main() {
        vec3 p = position;
        float t = uTime * 0.06 + aSeed * 40.0;
        p.x += sin(t * 1.3) * 0.35 + uTime * 0.015;
        p.y += mod(uTime * 0.05 * (0.4 + aSeed) + aSeed * 8.0, 8.0) - 4.0;
        p.z += cos(t) * 0.3;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = aSize * uDpr * (22.0 / -mv.z);
        // mais visíveis dentro do feixe de luz (lado esquerdo superior)
        float beam = smoothstep(3.2, 0.0, abs(p.x + p.y * 0.45 + 0.6));
        vAlpha = (0.15 + 0.85 * beam) * (0.5 + 0.5 * sin(t * 6.0 + aSeed * 12.0));
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      varying float vAlpha;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.0, d);
        gl_FragColor = vec4(uColor, a * a * vAlpha * 0.75);
      }
    `,
  })
}
