import "./style.css";
import { initSmoothScroll } from "./lib/smoothScroll";
import { initCursor } from "./lib/cursor";
import { initHeroScene } from "./lib/heroScene";
import { initOceanScene } from "./lib/oceanScene";
import { initScrollAnimations } from "./lib/scrollAnimations";
import { initNav } from "./lib/nav";
import { initMenu } from "./lib/menu";
import { initPreloader } from "./lib/preloader";
import { initWorkModal } from "./lib/workModal";
import { initAboutSequence } from "./lib/aboutSequence";
import { initAtmosphere } from "./lib/atmosphere";

const lenis = initSmoothScroll();
initCursor();
initScrollAnimations();
initNav();
initMenu();
initWorkModal(lenis);
initAboutSequence();
initAtmosphere();

const canvas = document.querySelector<HTMLCanvasElement>("#hero-canvas");
if (canvas) initHeroScene(canvas);

const oceanCanvas = document.querySelector<HTMLCanvasElement>("#ocean-canvas");
if (oceanCanvas) initOceanScene(oceanCanvas);

initPreloader(lenis);
