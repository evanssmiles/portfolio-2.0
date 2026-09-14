import gsap from "gsap";

export function initMenu(): void {
  const burger = document.querySelector<HTMLButtonElement>(".nav__burger");
  const menu = document.querySelector<HTMLElement>("#mobile-menu");
  if (!burger || !menu) return;

  const links = menu.querySelectorAll("a");
  const tl = gsap.timeline({ paused: true })
    .set(menu, { display: "flex" })
    .fromTo(menu, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, ease: "power2.out" })
    .from(links, { autoAlpha: 0, y: 20, duration: 0.4, stagger: 0.06, ease: "power3.out" }, "-=0.1");

  let open = false;

  const close = () => {
    open = false;
    burger.setAttribute("aria-expanded", "false");
    burger.classList.remove("nav__burger--open");
    tl.reverse();
  };

  burger.addEventListener("click", () => {
    open = !open;
    burger.setAttribute("aria-expanded", String(open));
    burger.classList.toggle("nav__burger--open", open);
    if (open) tl.play();
    else tl.reverse();
  });

  links.forEach((link) => link.addEventListener("click", close));
}
