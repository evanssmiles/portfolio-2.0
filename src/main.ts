import "./style.css";
import { initSmoothScroll } from "./lib/smoothScroll";
import { initCursor } from "./lib/cursor";
import { initHeroScene } from "./lib/heroScene";
import { initScrollAnimations } from "./lib/scrollAnimations";
import { initNav } from "./lib/nav";

initSmoothScroll();
initCursor();
initScrollAnimations();
initNav();

const canvas = document.querySelector<HTMLCanvasElement>("#hero-canvas");
if (canvas) initHeroScene(canvas);
