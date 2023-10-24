import templateData from "./template-data";
let shortestIndex = 0;
export const createLoader = (galleryElm) => {
  const conditions = galleryElm.dataset.filter.split(" ");
  const unloadedData = templateData.crafts.filter((item) => item.tags.some((tag) => conditions.includes(tag)));
  if (!conditions.length) throw new Error(".gallery缺少data-filter屬性");
  return (num) => {
    let loadCounter = 0;
    const loadBtnHTML = `
        <a class="load-img btn btn-lg btn-primary-white">載入中 <span class="spinner-border spinner-border-sm"></span></a>
    `;
    if (galleryElm.nextElementSibling)
      galleryElm.nextElementSibling.innerHTML = `載入中 <span class="spinner-border spinner-border-sm"></span>`;
    else galleryElm.insertAdjacentHTML("afterend", loadBtnHTML);
    unloadedData.splice(0, num).forEach((item) => {
      const newImg = document.createElement("img");
      newImg.src = item.imgURLs[0];
      newImg.alt = item.title;
      newImg.classList = "gallery-img w-100 d-block";
      newImg.onload = (event) => {
        pushImg(galleryElm, event.target);
        loadCounter++;
        console.log(`loading(${loadCounter}/${num}) ${event.target.alt}`);
        if (loadCounter === num) galleryElm.nextElementSibling.textContent = "看更多";
      };
    });
    if (unloadedData.length === 0) {
      galleryElm.style.height = "";
      galleryElm.nextElementSibling.textContent = "到底了";
    }
  };
};
export const rerender = (galleryElm) => {
  const colHTML = '<div class="col d-flex flex-column gap-6" ></div>';
  const imgs = galleryElm.querySelectorAll(".gallery-img");
  shortestIndex = 0;
  if (window.innerWidth >= 0 && window.innerWidth < 576) galleryElm.innerHTML = colHTML.repeat(1);
  else if (window.innerWidth >= 576 && window.innerWidth < 992) galleryElm.innerHTML = colHTML.repeat(2);
  else galleryElm.innerHTML = colHTML.repeat(3);
  imgs.forEach((img) => {
    pushImg(galleryElm, img);
  });
  console.log(`rerender ${imgs.length} IMGs`);
  return imgs;
};
export const pushImg = (galleryElm, imgElm) => {
  const itemHTML = `<a href="craft.html">${imgElm.outerHTML}</a>`;
  galleryElm.children[shortestIndex].innerHTML += itemHTML;
  const colsTotalHights = getColsTotalHights(galleryElm);
  const shortestHight = Math.min(...colsTotalHights);
  shortestIndex = colsTotalHights.indexOf(shortestHight);
  galleryElm.style.height = `${shortestHight}px`;
  return colsTotalHights;
};

export const getColsTotalHights = (galleryElm) =>
  [...galleryElm.children].map((col) => (col.lastChild ? col.lastChild.offsetTop + col.lastChild.clientHeight : 0));
