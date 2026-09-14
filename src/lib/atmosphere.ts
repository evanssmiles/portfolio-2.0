import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initAtmosphere(): void {
  const space = document.querySelector<HTMLElement>("#hero-canvas");
  const sky = document.querySelector<HTMLElement>(".sky");
  const glow = document.querySelector<HTMLElement>(".atmosphere-glow");
  const ocean = document.querySelector<HTMLElement>("#ocean-canvas");
  const work = document.querySelector<HTMLElement>("#work");
  const about = document.querySelector<HTMLElement>("#about");
  if (!space || !sky || !glow || !ocean || !work || !about) return;

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
      .to(glow, { opacity: 1, scale: 1.3, duration: 0.4, ease: "power2.out" }, 0.15)
      .to(glow, { opacity: 0, duration: 0.25 }, 0.55);

    gsap.timeline({
      scrollTrigger: {
        trigger: about,
        start: "top top",
        end: "+=250%",
        scrub: 1,
      },
    }).to(ocean, { opacity: 1, duration: 1 });

    return () => ScrollTrigger.getAll().forEach((st) => st.kill());
  });
}
