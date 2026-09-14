import gsap from "gsap";

export function initCursor(): void {
  const dot = document.querySelector<HTMLDivElement>(".cursor-dot");
  const ring = document.querySelector<HTMLDivElement>(".cursor-ring");
  if (!dot || !ring) return;

  const setDotX = gsap.quickSetter(dot, "x", "px");
  const setDotY = gsap.quickSetter(dot, "y", "px");
  const setRingX = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3.out" });
  const setRingY = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3.out" });

  window.addEventListener("mousemove", (e) => {
    setDotX(e.clientX);
    setDotY(e.clientY);
    setRingX(e.clientX);
    setRingY(e.clientY);
  });

  document.querySelectorAll<HTMLElement>("[data-cursor-hover]").forEach((el) => {
    el.addEventListener("mouseenter", () => ring.classList.add("cursor-ring--active"));
    el.addEventListener("mouseleave", () => ring.classList.remove("cursor-ring--active"));
  });
}
