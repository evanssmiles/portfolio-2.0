import gsap from "gsap";
import type Lenis from "lenis";

export function initPreloader(lenis: Lenis): void {
  const el = document.querySelector<HTMLElement>("#preloader");
  const count = document.querySelector<HTMLElement>(".preloader__count");
  if (!el || !count) return;

  lenis.stop();

  const progress = { value: 0 };
  const tl = gsap.timeline({
    onComplete: () => {
      lenis.start();
      el.remove();
    },
  });

  tl.to(progress, {
    value: 100,
    duration: 1.4,
    ease: "power2.inOut",
    onUpdate: () => {
      count.textContent = String(Math.round(progress.value));
    },
  }).to(el, {
    autoAlpha: 0,
    duration: 0.6,
    ease: "power2.out",
  });
}
