import "./style.css";
import { initSmoothScroll } from "./lib/smoothScroll";
import { initCursor } from "./lib/cursor";
import { initHeroScene } from "./lib/heroScene";
import { initScrollAnimations } from "./lib/scrollAnimations";
import { initNav } from "./lib/nav";
import { initMenu } from "./lib/menu";
import { initPreloader } from "./lib/preloader";

initSmoothScroll();
initCursor();
initScrollAnimations();
initNav();
initMenu();

const canvas = document.querySelector<HTMLCanvasElement>("#hero-canvas");
if (canvas) initHeroScene(canvas);

initPreloader();
