import gsap from "gsap";

export function initWorkModal(): void {
  const modal = document.querySelector<HTMLElement>("#work-modal");
  const panel = modal?.querySelector<HTMLElement>(".work-modal__panel");
  const title = modal?.querySelector<HTMLElement>(".work-modal__title");
  const desc = modal?.querySelector<HTMLElement>(".work-modal__desc");
  const img = modal?.querySelector<HTMLImageElement>(".work-modal__img");
  const initial = modal?.querySelector<HTMLElement>(".work-modal__initial");
  const media = modal?.querySelector<HTMLElement>(".work-modal__media");
  if (!modal || !panel || !title || !desc || !img || !initial || !media) return;

  const tl = gsap.timeline({ paused: true })
    .set(modal, { display: "flex" })
    .fromTo(modal, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, ease: "power2.out" })
    .fromTo(panel, { y: 32, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4, ease: "power3.out" }, "-=0.15");

  let open = false;

  const close = () => {
    if (!open) return;
    open = false;
    document.documentElement.classList.remove("no-scroll");
    tl.reverse();
  };

  const openWith = (trigger: HTMLElement) => {
    title.textContent = trigger.dataset.title ?? "";
    desc.textContent = trigger.dataset.desc ?? "";
    media.style.background = trigger.dataset.color ?? "#111827";

    const src = trigger.dataset.image;
    if (src) {
      img.src = src;
      img.hidden = false;
      initial.hidden = true;
    } else {
      img.hidden = true;
      initial.hidden = false;
      initial.textContent = (trigger.dataset.title ?? "?").charAt(0);
    }

    open = true;
    document.documentElement.classList.add("no-scroll");
    tl.play();
  };

  document.querySelectorAll<HTMLElement>("[data-work-trigger]").forEach((trigger) => {
    trigger.addEventListener("click", () => openWith(trigger));
  });

  modal.querySelectorAll<HTMLElement>("[data-work-close]").forEach((el) => {
    el.addEventListener("click", close);
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}
