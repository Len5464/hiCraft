import "./assets/scss/all.scss";
import * as bootstrap from "bootstrap";
import templateData from "./template-data";
const navSearch = document.querySelector("#navSearch");
const tagListTips = document.querySelector("#tagListTips");
const galleries = document.querySelectorAll(".gallery");
const signUpForm = document.querySelector("#SignUp-Form");
const loginForm = document.querySelector("#Login-Form");

if (signUpForm) {
  signUpForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const thisModal = bootstrap.Modal.getOrCreateInstance(event.target);
    const loginModal = bootstrap.Modal.getOrCreateInstance(document.querySelector("#Login-Form"));
    loginModal.show();
    thisModal.hide();
  });
}
if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const thisModal = bootstrap.Modal.getOrCreateInstance(event.target);
    const interestModal = bootstrap.Modal.getOrCreateInstance(document.querySelector("#interestModal"));
    interestModal.show();
    thisModal.hide();
  });
}

if (tagListTips) {
  const popover = bootstrap.Popover.getOrCreateInstance(tagListTips, {
    trigger: "focus",
  });
}
if (navSearch) {
  const toggleNavSearch = createScrollToggleHandler(navSearch);
  window.addEventListener("wheel", throttle(toggleNavSearch, 300));
  window.addEventListener("touchmove", throttle(toggleNavSearch, 300));
}

galleries.forEach((gallery) => {
  const updateGallery = createResizeGalleryHandler(gallery);
  window.addEventListener("resize", debounce(updateGallery));
  // window.addEventListener("DOMContentLoaded", updateGallery);
});

document.querySelectorAll("#nav-hot-tab , #nav-newcomer-tab , #nav-topic-tab").forEach((tab, i) => {
  const updateGallery = createResizeGalleryHandler(galleries[i]);
  tab.addEventListener("shown.bs.tab", updateGallery);
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
function createResizeGalleryHandler(rowElm) {
  const colHTML = '<div class="col d-flex flex-column" ></div>';
  return () => {
    if (window.innerWidth >= 992 && window.innerWidth < 3840) rowElm.innerHTML = colHTML.repeat(3);
    else if (window.innerWidth >= 576 && window.innerWidth < 992) rowElm.innerHTML = colHTML.repeat(2);
    else if (window.innerWidth >= 0 && window.innerWidth < 576) rowElm.innerHTML = colHTML.repeat(1);
    else return;
    const conditions = rowElm.dataset.filter.split(" ");
    const contentArr = templateData.crafts.filter((item) => item.tags.some((tag) => conditions.includes(tag)));
    contentArr.forEach((content) => {
      const shortestColumn = findShortestColumn(rowElm);
      shortestColumn.innerHTML += `
      <a href="craft.html">
        <img class="gallery-img w-100 d-block py-3" src="${content.imgURLs[0]}" >
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
