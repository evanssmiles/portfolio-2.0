import gsap from "gsap";

export function initPreloader(): void {
  const el = document.querySelector<HTMLElement>("#preloader");
  const count = document.querySelector<HTMLElement>(".preloader__count");
  if (!el || !count) return;

  document.documentElement.classList.add("no-scroll");

  const progress = { value: 0 };
  const tl = gsap.timeline({
    onComplete: () => {
      document.documentElement.classList.remove("no-scroll");
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
