//@ts-check
import templateData from "./template-data";
let shortestIndex = 0;

/**
 * @typedef {HTMLElement & { dataset: { filter: string } }} Gallery
 */
/**
 * Create a loader function for a gallery element.
 * @param {Gallery} galleryElm - The gallery element.
 * @returns {Function} A loader function.
 */
export const createLoader = (galleryElm) => {
  const unloadedData = templateData.crafts.filter((item) =>
    item.tags.some((tag) => galleryElm.dataset.filter.includes(tag))
  );
  const innerHTML = `載入中 <span class="spinner-border spinner-border-sm"></span>`;
  if (galleryElm.nextElementSibling instanceof HTMLAnchorElement) {
    galleryElm.nextElementSibling.innerHTML = innerHTML;
  } else {
    galleryElm.insertAdjacentHTML("afterend", `<a class="load-img btn btn-lg btn-primary-white">${innerHTML}</a>`);
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
        if (!(event.target instanceof HTMLElement)) return;
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
};

/**
 * Rerender the gallery with new image layout.
 * @param {Gallery} galleryElm - The gallery element.
 * @returns {NodeList} - The list of gallery images.
 */
export const rerender = (galleryElm) => {
  const colHTML = '<div class="col d-flex flex-column gap-6" ></div>';

  /** @type {NodeListOf<HTMLElement>} */
  const imgList = galleryElm.querySelectorAll(".gallery-img");
  shortestIndex = 0;
  if (window.innerWidth >= 0 && window.innerWidth < 576) {
    galleryElm.innerHTML = colHTML.repeat(1);
  } else if (window.innerWidth >= 576 && window.innerWidth < 992) {
    galleryElm.innerHTML = colHTML.repeat(2);
  } else {
    galleryElm.innerHTML = colHTML.repeat(3);
  }
  imgList.forEach((img) => pushImg(galleryElm, img));
  console.log(`rerender ${imgList.length} IMGs`);
  return imgList;
};

/**
 * Push an image element into the gallery.
 * @param {Gallery} galleryElm - The gallery element.
 * @param {HTMLElement} imgElm - The image element.
 * @returns {number[]} - Array of heights.
 */
export const pushImg = (galleryElm, imgElm) => {
  const itemHTML = `<a href="craft.html">${imgElm.outerHTML}</a>`;
  galleryElm.children[shortestIndex].innerHTML += itemHTML;

  /** @type {number[]} */
  const colsTotalHeights = getColsTotalHeights(galleryElm);
  const shortestHeight = Math.min(...colsTotalHeights);
  shortestIndex = colsTotalHeights.indexOf(shortestHeight);
  galleryElm.style.height = `${shortestHeight}px`;
  return colsTotalHeights;
};

/**
 * Get the total heights of the columns in the gallery.
 * @param {Gallery} galleryElm - The gallery element.
 * @returns {number[]} - Array of heights.
 */
export const getColsTotalHeights = (galleryElm) => {
  return [...galleryElm.children].map((col) =>
    col.lastChild instanceof HTMLElement ? col.lastChild.offsetTop + col.lastChild.clientHeight : 0
  );
};
