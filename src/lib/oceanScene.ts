import * as THREE from "three";

const vertexShader = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    vUv = uv;
    vec3 pos = position;
    float elevation =
      sin(pos.x * 0.045 + uTime * 0.6) * 1.1 +
      sin(pos.z * 0.03 + uTime * 0.4) * 1.1 +
      sin((pos.x + pos.z) * 0.02 + uTime * 0.9) * 0.6;
    pos.y += elevation;
    vElevation = elevation;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColorDeep;
  uniform vec3 uColorShallow;
  uniform vec3 uSunColor;
  uniform vec3 uFogColor;
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    vec3 color = mix(uColorDeep, uColorShallow, smoothstep(-1.2, 1.2, vElevation));

    float glint = pow(max(0.0, 1.0 - abs(vUv.x - 0.5) * 2.2), 10.0);
    glint *= smoothstep(0.15, 0.75, vUv.y);
    color += uSunColor * glint * 0.65;

    float fog = smoothstep(0.55, 1.0, vUv.y);
    color = mix(color, uFogColor, fog);

    gl_FragColor = vec4(color, 1.0);
  }
`;

export function initOceanScene(canvas: HTMLCanvasElement): () => void {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera.position.set(0, 55, 140);
  camera.lookAt(0, -10, -400);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const geometry = new THREE.PlaneGeometry(1400, 1400, 140, 140);
  geometry.rotateX(-Math.PI / 2);

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uColorDeep: { value: new THREE.Color(0x0a3d5c) },
      uColorShallow: { value: new THREE.Color(0x2fa5c9) },
      uSunColor: { value: new THREE.Color(0xfff2d0) },
      uFogColor: { value: new THREE.Color(0xdff1fb) },
    },
  });

  const ocean = new THREE.Mesh(geometry, material);
  ocean.position.y = -20;
  scene.add(ocean);

  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
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
    geometry.dispose();
    material.dispose();
    renderer.dispose();
  };
}
