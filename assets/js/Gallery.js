/**
 * @typedef {Object} GalleryConfig
 * @property {string[]} imgURLs -  image URL 陣列.
 * @property {HTMLElement} loadButton - 載入圖片按鈕.
 * @property {number} [loadAmount=8] - 每次載入的圖片數量.
 */

export default class Gallery {
  #unloadedImgCount = 0;
  #defaultButtonText;

  /**
   * 將容器元素轉換成圖片瀑布流，注意: 會修改傳入的元素。
   * @param {HTMLElement | string} element - 圖片瀑布流的容器元素 或 選擇器。
   * @param {GalleryConfig} config - 設定圖片瀑布流的物件。
   */
  constructor(element, config) {
    const container = element instanceof HTMLElement ? element : document.querySelector(element);
    if (!container) throw new Error("無效的 gallery 選擇器");

    const { imgURLs, loadButton, loadAmount = 8 } = config;
    if (!Array.isArray(imgURLs)) throw new Error("config物件中，imgURLs 必須是陣列");
    if (!(loadButton instanceof HTMLElement)) throw new Error("config物件中，loadButton 必須是 HTML 元素");

    this.container = container;
    this.rowHeight = parseInt(getComputedStyle(this.container).getPropertyValue("grid-auto-rows"));
    this.rowGap = parseInt(getComputedStyle(this.container).getPropertyValue("grid-row-gap"));
    this.imgURLs = imgURLs;
    this.loadAmount = loadAmount;
    this.loadButton = loadButton;
    this.#defaultButtonText = `${loadButton.textContent}`;

    loadButton.addEventListener("click", (event) => {
      event.preventDefault();
      this.loadItems(loadAmount);
    });

    this.loadItems(loadAmount);
  }

  /**
   * 載入圖片。
   * @param {number} amount
   */
  loadItems(amount) {
    const chunk = this.imgURLs.splice(0, amount);
    if (chunk.length > 0) {
      this.#unloadedImgCount = chunk.length;
      chunk.forEach((url) => this.genNewItem(url));
      this.loadButton.innerHTML = `<span class="spinner-border spinner-border-sm ms-4" role="status" aria-hidden="true"></span>載入中...`;
    } else {
      this.#unloadedImgCount = 0;
      this.loadButton.textContent = `沒有更多了`;
    }
  }

  /**
   * 在容器中生成一個新 gallery-item。
   * @param {string} imgURL - gallery-item 的圖片URL。
   */
  genNewItem(imgURL) {
    const img = document.createElement("img");
    const a = document.createElement("a");
    const item = document.createElement("li");

    img.onload = () => {
      this.resizeItem(item);
      this.#unloadedImgCount--;
      if (this.#unloadedImgCount === 0) {
        this.loadButton.innerHTML = this.#defaultButtonText;
      }
    };

    img.src = imgURL;
    img.alt = "craft image";
    img.classList.add("gallery-img");
    item.classList.add("gallery-item");
    a.href = "craft.html";
    a.appendChild(img);
    item.appendChild(a);
    this.container.appendChild(item);
  }

  /**
   * 調整 gallery-item 橫跨幾個row以適應圖片高度。
   * @param {HTMLElement} item - 要調整的 gallery-item。
   */
  resizeItem(item) {
    const img = item.querySelector(".gallery-img");
    if (!(img instanceof HTMLElement)) return;
    const rowSpan = Math.floor((img.getBoundingClientRect().height + this.rowGap) / (this.rowHeight + this.rowGap));
    item.style.gridRowEnd = `span ${rowSpan}`;
  }
}
