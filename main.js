import "./assets/scss/all.scss";
import * as bootstrap from "bootstrap";
import templateData from "./template-data";
const navSearch = document.querySelector("#navSearch");
const tagListTips = document.querySelector("#tagListTips");
const { craftSelect } = templateData;

if (tagListTips) {
  const popover = new bootstrap.Popover(tagListTips, {
    trigger: "focus",
  });
}
if (navSearch) {
  const toggleNavSearch = createScrollToggleHandler(navSearch);
  window.addEventListener("wheel", throttle(toggleNavSearch, 300));
  window.addEventListener("touchmove", throttle(toggleNavSearch, 300));
}

document.querySelectorAll(".gallery").forEach((gallery) => {
  const updateGallery = createResizeHandler(gallery, craftSelect);
  window.addEventListener("resize", updateGallery);
  window.addEventListener("load", updateGallery);
});
function createScrollToggleHandler(element) {
  let prevScrollPos = window.pageYOffset;
  const bsCollapse = new bootstrap.Collapse(element);
  return () => {
    if (element.classList.contains("collapsing")) return;
    const currentScrollPos = window.pageYOffset;
    currentScrollPos > prevScrollPos ? bsCollapse.hide() : bsCollapse.show();
    prevScrollPos = currentScrollPos;
  };
}
function createResizeHandler(rowElm, items) {
  const colHTML = '<div class="col d-flex flex-column gap-6" ></div>';
  return () => {
    if (rowElm.dataset.screen !== "md" && window.innerWidth >= 768 && window.innerWidth < 3840) {
      rowElm.innerHTML = colHTML.repeat(3);
      rowElm.dataset.screen = "md";
    } else if (rowElm.dataset.screen !== "sm" && window.innerWidth >= 576 && window.innerWidth < 768) {
      rowElm.innerHTML = colHTML.repeat(2);
      rowElm.dataset.screen = "sm";
    } else if (rowElm.dataset.screen !== "xs" && window.innerWidth >= 0 && window.innerWidth < 576) {
      rowElm.innerHTML = colHTML;
      rowElm.dataset.screen = "xs";
    } else {
      return;
    }
    items.forEach((i) => {
      const shortestColumn = findShortestColumn(rowElm);
      shortestColumn.innerHTML += `
      <a href="craft.html">
        <img class="gallery-img w-100 d-block" src="../assets/images/craft-select/craft-select${i}.png" >
      </a>`;
      // rowElm.children[
      //   index % rowElm.childElementCount
      // ].innerHTML += `<img class="gallery-img w-100 d-block" src="https://fakeimg.pl/${item}/">`;
    });
  };
}
function findShortestColumn(rowElm) {
  const columnHeights = Array.from(rowElm.children, (column) => {
    const galleryImgs = [...column.querySelectorAll(".gallery-img")];

    return galleryImgs.reduce((acc, img) => acc + (img.clientHeight || 0), 0);
  });
  const shortestColHeight = Math.min(...columnHeights);
  const shortestColIndex = columnHeights.indexOf(shortestColHeight);
  return rowElm.children[shortestColIndex];
}
function throttle(fn, delay = 500) {
  let timer = null;
  return (...args) => {
    if (timer) return;
    timer = setTimeout(() => {
      fn(...args);
      timer = null;
    }, delay);
  };
}
