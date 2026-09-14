import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initCloudScene } from "./cloudScene";

gsap.registerPlugin(ScrollTrigger);

export function initAtmosphere(): void {
  const space = document.querySelector<HTMLElement>("#hero-canvas");
  const sky = document.querySelector<HTMLElement>(".sky");
  const ocean = document.querySelector<HTMLElement>("#ocean-canvas");
  const cloudCanvas = document.querySelector<HTMLCanvasElement>("#cloud-canvas");
  const work = document.querySelector<HTMLElement>("#work");
  if (!space || !sky || !ocean || !cloudCanvas || !work) return;

  const cloud = initCloudScene(cloudCanvas);

  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    gsap.timeline({
      scrollTrigger: {
        trigger: work,
        start: "top bottom",
        end: "top 20%",
        scrub: 1,
      },
    })
      .to(space, { opacity: 0, duration: 1 }, 0)
      .to(sky, { opacity: 1, duration: 1 }, 0)
      .to(ocean, { opacity: 1, duration: 1 }, 0)
      .to(cloudCanvas, { opacity: 1, duration: 1 }, 0);

    const holeState = { value: 0 };
    gsap.timeline({
      scrollTrigger: {
        trigger: work,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    }).to(holeState, {
      value: 1.3,
      duration: 1,
      ease: "power1.in",
      onUpdate: () => cloud.setHole(holeState.value),
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
      cloud.destroy();
    };
  });
}
