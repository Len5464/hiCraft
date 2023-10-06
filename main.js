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
  const loadGallery = createGalleryLoadHandler(gallery);
  window.addEventListener("resize", debounce(loadGallery));
  loadGallery();
});

document.querySelectorAll("#nav-hot-tab , #nav-newcomer-tab , #nav-topic-tab").forEach((tab, i) => {
  const loadGallery = createGalleryLoadHandler(galleries[i]);
  tab.addEventListener("shown.bs.tab", loadGallery);
});

function fetchImgURLs(galleryElm) {
  const conditions = galleryElm.dataset.filter.split(" ");
  const items = templateData.crafts.filter((item) => item.tags.some((tag) => conditions.includes(tag)));
  return items.map((item) => item.imgURLs[0]);
}

function createScrollToggleHandler(toggleElm) {
  let prevScrollPos = window.pageYOffset;
  const bsCollapse = new bootstrap.Collapse(toggleElm);
  return () => {
    if (toggleElm.classList.contains("collapsing")) return;
    const currentScrollPos = window.pageYOffset;
    currentScrollPos > prevScrollPos ? bsCollapse.hide() : bsCollapse.show();
    prevScrollPos = currentScrollPos;
  };
}

function createGalleryLoadHandler(galleryElm) {
  const colHTML = '<div class="col d-flex flex-column gap-6" ></div>';
  const imgURLs = fetchImgURLs(galleryElm);
  return () => {
    if (window.innerWidth >= 992 && window.innerWidth < 3840) galleryElm.innerHTML = colHTML.repeat(3);
    else if (window.innerWidth >= 576 && window.innerWidth < 992) galleryElm.innerHTML = colHTML.repeat(2);
    else if (window.innerWidth >= 0 && window.innerWidth < 576) galleryElm.innerHTML = colHTML.repeat(1);
    else return;
    imgURLs.forEach((url) => {
      const newImg = document.createElement("img");
      newImg.src = url;
      newImg.classList = "gallery-img w-100 d-block";
      newImg.onload = (event) => {
        const colsHightArr = Array.from(galleryElm.children, (col) =>
          col.lastChild ? col.lastChild.lastChild.offsetTop + col.lastChild.lastChild.height : 0
        );
        const shortestIndex = colsHightArr.indexOf(Math.min(...colsHightArr));
        const newItemHTML = `<a href='craft.html'>${event.target.outerHTML}</a>`;
        galleryElm.children[shortestIndex].innerHTML += newItemHTML;
      };
    });
  };
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
