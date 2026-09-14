import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initNav(): void {
  const nav = document.querySelector<HTMLElement>(".nav");
  if (!nav) return;

  ScrollTrigger.create({
    start: "top top",
    end: "max",
    onUpdate: (self) => {
      nav.classList.toggle("nav--scrolled", self.scroll() > 10);
      if (self.direction === 1 && self.scroll() > 120) {
        nav.classList.add("nav--hidden");
      } else {
        nav.classList.remove("nav--hidden");
      }
    },
  });
}
