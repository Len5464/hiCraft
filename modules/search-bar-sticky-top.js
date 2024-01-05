import { Collapse } from "bootstrap";
import { throttle } from "../assets/js/utils.js";
/**
 * @param {HTMLElement} toggleElm 目標元素
 * @returns {()=>void} 根據Y軸變化展開/折疊元素的函數
 */
function createScrollToggleHandler(toggleElm) {
  let prevScrollPos = window.scrollY;
  const bsCollapse = new Collapse(toggleElm);
  return () => {
    if (toggleElm.classList.contains("collapsing")) return;
    const currentScrollPos = window.scrollY;
    currentScrollPos > prevScrollPos ? bsCollapse.hide() : bsCollapse.show();
    prevScrollPos = currentScrollPos;
  };
}

const searchBar = document.querySelector("#search-bar-sticky-top");
if (!(searchBar instanceof HTMLElement)) throw new Error("找不到 #search-bar-sticky-top");
const toggleSearchBar = createScrollToggleHandler(searchBar);
const onScroll = throttle(toggleSearchBar, 300);
window.addEventListener("wheel", onScroll);
window.addEventListener("touchmove", onScroll);
