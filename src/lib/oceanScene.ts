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

  float fbm(vec2 p, int octaves) {
    float v = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 6; i++) {
      if (i >= octaves) break;
      v += amp * noise(p);
      p *= 2.05;
      amp *= 0.5;
    }
    return v;
  }

  float heightAt(vec2 p) {
    vec2 flow = vec2(uTime * 0.035, uTime * 0.02);
    vec2 q = vec2(
      fbm(p + flow, 4),
      fbm(p + vec2(5.2, 1.3) + flow, 4)
    );
    vec2 r = vec2(
      fbm(p + 3.2 * q + vec2(1.7, 9.2) + uTime * 0.05, 4),
      fbm(p + 3.2 * q + vec2(8.3, 2.8) + uTime * 0.045, 4)
    );
    return fbm(p + 3.2 * r, 5);
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / uResolution.y;
    vec2 p = vec2(uv.x * aspect, uv.y) * 3.5;

    float eps = 0.01;
    float h = heightAt(p);
    float hL = heightAt(p - vec2(eps, 0.0));
    float hR = heightAt(p + vec2(eps, 0.0));
    float hD = heightAt(p - vec2(0.0, eps));
    float hU = heightAt(p + vec2(0.0, eps));
    vec3 normal = normalize(vec3((hL - hR) * 2.2, (hD - hU) * 2.2, eps * 4.0));

    vec3 lightDir = normalize(vec3(0.35, 0.55, 0.75));
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    vec3 halfDir = normalize(lightDir + viewDir);

    float diff = clamp(dot(normal, lightDir), 0.0, 1.0);
    float spec = pow(clamp(dot(normal, halfDir), 0.0, 1.0), 180.0);

    vec3 deep = vec3(0.015, 0.08, 0.24);
    vec3 mid = vec3(0.04, 0.2, 0.48);
    vec3 color = mix(deep, mid, 0.35 + diff * 0.65);

    float shimmer = noise(p * 24.0 + uTime * 0.6);
    color += vec3(1.0, 0.98, 0.9) * pow(shimmer, 10.0) * 0.35 * diff;
    color += vec3(1.0, 0.97, 0.9) * spec * 1.4;

    float foam = smoothstep(0.78, 0.95, h);
    color = mix(color, vec3(0.88, 0.93, 0.97), foam * 0.25);

    float vignette = smoothstep(1.15, 0.35, length(uv - 0.5));
    color *= mix(0.72, 1.0, vignette);

    gl_FragColor = vec4(color, 1.0);
  }
`;

export function initOceanScene(canvas: HTMLCanvasElement): () => void {
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
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

  return () => {
    cancelAnimationFrame(frameId);
    window.removeEventListener("resize", onResize);
    quad.geometry.dispose();
    material.dispose();
    renderer.dispose();
  };
}
