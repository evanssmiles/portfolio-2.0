import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initScrollAnimations(): void {
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    gsap.from(".hero__eyebrow, .hero__title span, .hero__sub, .hero__cta", {
      autoAlpha: 0,
      y: 24,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.08,
      delay: 0.2,
    });

    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      gsap.from(el, {
        autoAlpha: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
        },
      });
    });

    document.querySelectorAll<HTMLElement>("[data-reveal-stagger]").forEach((group) => {
      gsap.from(group.children, {
        autoAlpha: 0,
        y: 30,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: group,
          start: "top 85%",
        },
      });
    });

    document.querySelectorAll<HTMLElement>("[data-pin]").forEach((el) => {
      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "+=100%",
        pin: true,
        pinSpacing: true,
      });
    });

    return () => ScrollTrigger.getAll().forEach((st) => st.kill());
  });
}
