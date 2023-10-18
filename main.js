import "./assets/scss/all.scss";
import * as bootstrap from "bootstrap";
import templateData from "./template-data";
const navSearch = document.querySelector("#navSearch");
const tagListTips = document.querySelector("#tagListTips");
const signUpForm = document.querySelector("#SignUp-Form");
const loginForm = document.querySelector("#Login-Form");
const toastTrigger = document.querySelector("#resetPasswordForm");
const galleries = document.querySelectorAll(".gallery");

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
galleries.forEach((gallery) => {
  const onResize = () => {
    reloadGallery(gallery);
  };
  window.addEventListener("resize", debounce(onResize));
  reloadGallery(gallery);
});

document.querySelectorAll("#nav-hot-tab , #nav-newcomer-tab , #nav-topic-tab").forEach((tab, i) => {
  const onTabActive = () => {
    reloadGallery(galleries[i]);
  };
  tab.addEventListener("shown.bs.tab", onTabActive);
});
document.querySelectorAll(".load-img").forEach((btn) => {
  const gallery = btn.previousElementSibling;
  const loadIMGs = createImgLoadHandler(gallery, 9);
  btn.addEventListener("click", loadIMGs);
  loadIMGs();
});

function createImgLoadHandler(galleryElm, numToLoad) {
  const conditions = galleryElm.dataset.filter.split(" ");
  const items = templateData.crafts.filter((item) => item.tags.some((tag) => conditions.includes(tag)));
  let urls = items.map((item) => item.imgURLs[0]);
  let shortestIndex = 0;
  let shortestHight = 0;
  return () => {
    const chunk = urls.splice(0, numToLoad);
    if (urls.length === 0) galleryElm.nextElementSibling.textContent = "到底了";
    if (chunk.length) {
      console.log(`正在載入${chunk.length}個圖片`);
      chunk.forEach((url) => {
        const newImg = document.createElement("img");
        newImg.src = url;
        newImg.classList = "gallery-img w-100 d-block";
        newImg.onload = (event) => {
          const newItemHTML = `<a href='craft.html'>${event.target.outerHTML}</a>`;
          galleryElm.children[shortestIndex].innerHTML += newItemHTML;
          const colsHightArr = Array.from(galleryElm.children, (col) =>
            col.lastChild ? col.lastChild.lastChild.offsetTop + col.lastChild.lastChild.height : 0
          );
          shortestHight = Math.min(...colsHightArr);
          shortestIndex = colsHightArr.indexOf(shortestHight);
          galleryElm.style.height = `${shortestHight}px`;
        };
      });
    }
  };
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
function reloadGallery(galleryElm) {
  const colHTML = '<div class="col d-flex flex-column gap-6" ></div>';
  const imgNum = galleryElm.querySelectorAll(".gallery-img").length;
  if (window.innerWidth >= 992 && window.innerWidth < 3840) galleryElm.innerHTML = colHTML.repeat(3);
  else if (window.innerWidth >= 576 && window.innerWidth < 992) galleryElm.innerHTML = colHTML.repeat(2);
  else if (window.innerWidth >= 0 && window.innerWidth < 576) galleryElm.innerHTML = colHTML.repeat(1);
  else return;
  const loadIMGs = createImgLoadHandler(galleryElm, imgNum);
  loadIMGs();
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
