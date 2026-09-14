import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initAtmosphere(): void {
  const space = document.querySelector<HTMLElement>("#hero-canvas");
  const sky = document.querySelector<HTMLElement>(".sky");
  const earth = document.querySelector<HTMLElement>(".earth-horizon");
  const curtain = document.querySelector<HTMLElement>(".cloud-curtain");
  const left = document.querySelector<HTMLElement>(".cloud-curtain__panel--left");
  const right = document.querySelector<HTMLElement>(".cloud-curtain__panel--right");
  const work = document.querySelector<HTMLElement>("#work");
  const about = document.querySelector<HTMLElement>("#about");
  if (!space || !sky || !earth || !curtain || !left || !right || !work || !about) return;

  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    gsap.timeline({
      scrollTrigger: {
        trigger: work,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    })
      .to(space, { opacity: 0, duration: 0.35 }, 0)
      .to(sky, { opacity: 1, duration: 0.35 }, 0)
      .to(curtain, { opacity: 1, duration: 0.35 }, 0)
      .to(left, { xPercent: -100, duration: 0.45 }, 0.55)
      .to(right, { xPercent: 100, duration: 0.45 }, 0.55)
      .to(curtain, { opacity: 0, duration: 0.1 }, 0.9);

    gsap.timeline({
      scrollTrigger: {
        trigger: about,
        start: "top top",
        end: "+=250%",
        scrub: 1,
      },
    }).to(earth, { opacity: 1, duration: 1 });

    return () => ScrollTrigger.getAll().forEach((st) => st.kill());
  });
}
