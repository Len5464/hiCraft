import "./assets/scss/all.scss";
import * as bootstrap from "bootstrap";
import * as gallery from "./gallery";
const navSearch = document.querySelector("#navSearch");
const tagListTips = document.querySelector("#tagListTips");
const signUpForm = document.querySelector("#SignUp-Form");
const loginForm = document.querySelector("#Login-Form");
const toastTrigger = document.querySelector("#resetPasswordForm");
const spinner = document.querySelector(".loading-mask");
const galleries = document.querySelectorAll(".gallery");
const notActivatedGalleries = [...document.querySelectorAll(".tab-pane:not(.show) .gallery")];
if (spinner) {
  window.addEventListener("load", () => {
    spinner.classList.add("opacity-0");
  });
  spinner.addEventListener("transitionend", () => {
    spinner.classList.add("d-none");
  });
}
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
if (toastTrigger) {
  toastTrigger.addEventListener("submit", showToast);
}
document.querySelectorAll("#nav-hot-tab,#nav-newcomer-tab,#nav-topic-tab").forEach((tab) => {
  const elm = document.querySelector(`${tab.dataset.bsTarget} .gallery`);
  tab.addEventListener("shown.bs.tab", () => {
    initGallery(elm);
  });
});
for (let elm of galleries) {
  if (notActivatedGalleries.includes(elm)) continue;
  initGallery(elm);
  window.addEventListener(
    "resize",
    debounce(() => {
      const galleryElm = document.querySelector(".tab-pane.show .gallery") || elm;
      gallery.rerender(galleryElm);
    })
  );
}
function initGallery(elm) {
  const imgs = gallery.rerender(elm);
  if (imgs.length === 0) {
    const loadImgs = gallery.createLoader(elm);
    loadImgs(9);
    elm.nextElementSibling.onclick = () => loadImgs(6);
  }
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

function showToast(event) {
  event.preventDefault();
  document.querySelectorAll(".toast").forEach((toastElm) => {
    const toast = bootstrap.Toast.getOrCreateInstance(toastElm);
    toast.show();
  });
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
