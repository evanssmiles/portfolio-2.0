import * as THREE from "three";

export function initHeroScene(canvas: HTMLCanvasElement): () => void {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 12;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const count = 900;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 24;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    size: 0.045,
    color: 0xffffff,
    transparent: true,
    opacity: 0.55,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  const pointer = { x: 0, y: 0 };
  const onPointerMove = (e: PointerEvent) => {
    pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
    pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
  };
  window.addEventListener("pointermove", onPointerMove);

  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener("resize", onResize);

  let frameId = 0;
  const clock = new THREE.Clock();

  const tick = () => {
    const t = clock.getElapsedTime();
    points.rotation.y = t * 0.03 + pointer.x * 0.15;
    points.rotation.x = pointer.y * 0.08;
    renderer.render(scene, camera);
    frameId = requestAnimationFrame(tick);
  };
  tick();

  return () => {
    cancelAnimationFrame(frameId);
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("resize", onResize);
    geometry.dispose();
    material.dispose();
    renderer.dispose();
  };
}
