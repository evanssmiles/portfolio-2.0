import * as THREE from "three";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform float uHole;
  uniform vec2 uResolution;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 5; i++) {
      v += amp * noise(p);
      p *= 2.05;
      amp *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / uResolution.y;
    vec2 centered = (uv - 0.5) * vec2(aspect, 1.0);

    vec2 p = uv * vec2(aspect, 1.0) * 3.0 + vec2(uTime * 0.015, uTime * 0.008);
    float n = fbm(p);

    float dist = length(centered);
    float edge = dist + (n - 0.5) * 0.6;
    float cloudAlpha = smoothstep(uHole - 0.12, uHole + 0.12, edge);
    cloudAlpha *= 0.85 + n * 0.15;

    vec3 color = mix(vec3(0.78, 0.82, 0.88), vec3(1.0, 1.0, 1.0), n);

    gl_FragColor = vec4(color, clamp(cloudAlpha, 0.0, 1.0));
  }
`;

export function initCloudScene(canvas: HTMLCanvasElement): {
  setHole: (value: number) => void;
  destroy: () => void;
} {
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    uniforms: {
      uTime: { value: 0 },
      uHole: { value: 0 },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    },
  });

  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  scene.add(quad);

  const onResize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
  };
  window.addEventListener("resize", onResize);

  let frameId = 0;
  const clock = new THREE.Clock();

  const tick = () => {
    material.uniforms.uTime.value = clock.getElapsedTime();
    renderer.render(scene, camera);
    frameId = requestAnimationFrame(tick);
  };
  tick();

  return {
    setHole: (value: number) => {
      material.uniforms.uHole.value = value;
    },
    destroy: () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      quad.geometry.dispose();
      material.dispose();
      renderer.dispose();
    },
  };
}
