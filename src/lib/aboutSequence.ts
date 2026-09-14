import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initAboutSequence(): void {
  const section = document.querySelector<HTMLElement>("[data-about-sequence]");
  const steps = document.querySelectorAll<HTMLElement>("[data-about-step]");
  const currentLabel = document.querySelector<HTMLElement>("[data-about-current]");
  if (!section || steps.length < 2) return;

  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const holdEach = 1;
    const transition = 0.4;
    const segment = holdEach + transition;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=250%",
        scrub: 0.6,
        pin: true,
        onUpdate: () => {
          if (!currentLabel) return;
          const index = Math.min(steps.length - 1, Math.floor(tl.time() / segment));
          currentLabel.textContent = String(index + 1).padStart(2, "0");
        },
      },
    });

    steps.forEach((step, i) => {
      if (i === steps.length - 1) return;
      const next = steps[i + 1];
      const at = i * segment + holdEach;

      tl.to(step, { autoAlpha: 0, y: -40, duration: transition, ease: "power2.inOut" }, at)
        .to(next, { autoAlpha: 1, y: 0, duration: transition, ease: "power2.inOut" }, at);
    });

    tl.to({}, { duration: holdEach });

    return () => ScrollTrigger.getAll().forEach((st) => st.kill());
  });
}
