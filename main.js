import "./assets/scss/all.scss";
import * as bootstrap from "bootstrap";
import templateData from "./template-data";
const navSearch = document.querySelector("#navSearch");
const tagListTips = document.querySelector("#tagListTips");
const galleries = document.querySelectorAll(".gallery");
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

galleries.forEach((gallery) => {
  const updateGallery = createResizeGalleryHandler(gallery, craftSelect);
  window.addEventListener("resize", debounce(updateGallery));
  window.addEventListener("load", updateGallery);
});

document.querySelectorAll('[data-bs-toggle="tab"]').forEach((tab, i) => {
  const updateGallery = createResizeGalleryHandler(galleries[i], craftSelect);
  tab.addEventListener("shown.bs.tab", updateGallery);
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
function createResizeGalleryHandler(rowElm, items) {
  const colHTML = '<div class="col d-flex flex-column" ></div>';
  return () => {
    if (window.innerWidth >= 768 && window.innerWidth < 3840) rowElm.innerHTML = colHTML.repeat(4);
    else if (window.innerWidth >= 576 && window.innerWidth < 768) rowElm.innerHTML = colHTML.repeat(3);
    else if (window.innerWidth >= 0 && window.innerWidth < 576) rowElm.innerHTML = colHTML.repeat(2);
    else return;
    items.forEach((i) => {
      const shortestColumn = findShortestColumn(rowElm);
      shortestColumn.innerHTML += `
      <a href="craft.html">
        <img class="gallery-img w-100 d-block py-3" src="../assets/images/select/craft-select${i}.png" >
      </a>`;
    });
    console.log("refresh gallery!");
  };
}

function findShortestColumn(rowElm) {
  const columnHeights = Array.from(rowElm.children, (column) => {
    const galleryImgs = [...column.querySelectorAll(".gallery-img")];
    return galleryImgs.reduce((acc, img) => acc + (img.offsetHeight || 0), 0);
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
function debounce(fn, delay = 500) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}
