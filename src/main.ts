import "./style.css";
import { initSmoothScroll } from "./lib/smoothScroll";
import { initCursor } from "./lib/cursor";
import { initHeroScene } from "./lib/heroScene";
import { initScrollAnimations } from "./lib/scrollAnimations";

initSmoothScroll();
initCursor();
initScrollAnimations();

const canvas = document.querySelector<HTMLCanvasElement>("#hero-canvas");
if (canvas) initHeroScene(canvas);
