import { debounce } from "../assets/js/utils";
import templateData from "../template-data";
let shortestIndex = 0;
window.addEventListener("load", () => {
  const galleries = document.querySelectorAll(".gallery");
  const notActivatedGalleries = [...document.querySelectorAll(".tab-pane:not(.show) .gallery")];

  document.querySelectorAll("#nav-hot-tab,#nav-newcomer-tab,#nav-topic-tab").forEach((tab) => {
    if (!(tab instanceof HTMLElement)) return;

    const { bsTarget } = tab.dataset;
    if (!bsTarget) return;

    const elm = document.querySelector(`${tab.dataset.bsTarget} .gallery`);
    if (!(elm instanceof HTMLElement)) return;

    tab.addEventListener("shown.bs.tab", () => {
      initGallery(elm);
    });
  });
  for (let elm of galleries) {
    if (notActivatedGalleries.includes(elm) || !(elm instanceof HTMLElement)) continue;
    initGallery(elm);
    window.addEventListener(
      "resize",
      debounce(() => {
        const galleryElm = document.querySelector(".tab-pane.show .gallery") ?? elm;
        if (galleryElm instanceof HTMLElement) rerender(galleryElm);
      })
    );
  }
});
/**
 *
 * @param {HTMLElement} elm
 */
function initGallery(elm) {
  const imgs = rerender(elm);
  if (imgs.length === 0) {
    const loadImgs = createLoader(elm);
    loadImgs(9);
    const loadBtn = elm.nextElementSibling;
    if (loadBtn instanceof HTMLAnchorElement) loadBtn.onclick = () => loadImgs(6);
  }
}

/**
 * Create a loader function for a gallery element.
 * @param {HTMLElement} galleryElm - The gallery element.
 * @returns {Function} A loader function.
 */
function createLoader(galleryElm) {
  const { filter } = galleryElm.dataset;
  const unloadedData = templateData.crafts.filter((item) => item.tags.some((tag) => filter?.includes(tag)));
  const spinnerHTML = `載入中 <span class="spinner-border spinner-border-sm"></span>`;

  if (galleryElm.nextElementSibling instanceof HTMLAnchorElement) {
    galleryElm.nextElementSibling.innerHTML = spinnerHTML;
  } else {
    galleryElm.insertAdjacentHTML("afterend", `<a class="load-img btn btn-lg btn-primary-white">${spinnerHTML}</a>`);
  }
  /**
   * Load images into the gallery.
   * @param {number} num - The number of images to load.
   */
  return (num) => {
    let loadCounter = 0;
    unloadedData.splice(0, num).forEach((item) => {
      const newImg = document.createElement("img");
      newImg.src = item.imgURLs[0];
      newImg.alt = item.title;
      newImg.classList.add("gallery-img", "w-100", "d-block");
      newImg.onload = (event) => {
        if (!(event.target instanceof HTMLImageElement)) return;
        pushImg(galleryElm, event.target);
        loadCounter++;
        console.log(`loading #${loadCounter}`, event.target);

        // @ts-ignore
        if (loadCounter === num) galleryElm.nextElementSibling.textContent = "看更多";
      };
    });
    if (unloadedData.length === 0) {
      galleryElm.style.height = "";

      // @ts-ignore
      galleryElm.nextElementSibling.textContent = "到底了";
    }
  };
}

/**
 * Rerender the gallery with new image layout.
 * @param {HTMLElement} galleryElm - The gallery element.
 * @returns {NodeList} - The list of gallery images.
 */
function rerender(galleryElm) {
  /** @type {NodeListOf<HTMLElement>} */
  const galleryImages = galleryElm.querySelectorAll(".gallery-img");
  const colHTML = '<div class="col d-flex flex-column gap-6" ></div>';
  const isSmallScreen = window.innerWidth >= 0 && window.innerWidth < 576;
  const isMediumScreen = window.innerWidth >= 576 && window.innerWidth < 992;
  let columnCount = 0;
  shortestIndex = 0;

  if (isSmallScreen) columnCount = 1;
  else if (isMediumScreen) columnCount = 2;
  else columnCount = 3;
  galleryElm.innerHTML = colHTML.repeat(columnCount);
  galleryImages.forEach((img) => pushImg(galleryElm, img));
  console.log(`rerender ${galleryImages.length} IMGs`);
  return galleryImages;
}

/**
 * Push an image element into the gallery.
 * @param {HTMLElement} galleryElm - The gallery element.
 * @param {HTMLElement} imgElm - The image element.
 * @returns {number[]} - Array of heights.
 */
function pushImg(galleryElm, imgElm) {
  const itemHTML = `<a href="craft.html">${imgElm.outerHTML}</a>`;
  galleryElm.children[shortestIndex].innerHTML += itemHTML;

  /** @type {number[]} */
  const colsTotalHeights = getColsTotalHeights(galleryElm);
  const shortestHeight = Math.min(...colsTotalHeights);
  shortestIndex = colsTotalHeights.indexOf(shortestHeight);
  galleryElm.style.height = `${shortestHeight}px`;
  return colsTotalHeights;
}

/**
 * Get the total heights of the columns in the gallery.
 * @param {HTMLElement} galleryElm - The gallery element.
 * @returns {number[]} - Array of heights.
 */
function getColsTotalHeights(galleryElm) {
  return [...galleryElm.children].map((col) =>
    col.lastChild instanceof HTMLElement ? col.lastChild.offsetTop + col.lastChild.clientHeight : 0
  );
}
