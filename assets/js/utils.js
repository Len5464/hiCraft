import { Modal } from "bootstrap";

/**
 * 表單送出時切換顯示下一個 bootstrap modal
 * @param {string} currentModalSelector 當前 modal 的 選擇器
 * @param {string} nextModalSelector 目標 modal 的 選擇器
 */
export function defineModalSwitchOnSubmit(currentModalSelector, nextModalSelector) {
  const sourceModalElement = document.querySelector(currentModalSelector);
  const targetModalElement = document.querySelector(nextModalSelector);

  if (!sourceModalElement || !targetModalElement) {
    throw new Error(`${currentModalSelector} 或 ${nextModalSelector} 不是有效的選擇器`);
  }
  if (!sourceModalElement.classList.contains("modal") || !targetModalElement.classList.contains("modal")) {
    throw new Error(`${currentModalSelector} 或 ${nextModalSelector} 沒有 modal class`);
  }

  sourceModalElement.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    if (form.checkValidity()) {
      const sourceModal = Modal.getOrCreateInstance(sourceModalElement);
      const targetModal = Modal.getOrCreateInstance(targetModalElement);
      targetModal.show();
      sourceModal.hide();
    } else {
      event.stopPropagation();
    }
    form.classList.add("was-validated");
  });
}

/**
 * 給函數加上連續執行限制
 * @param {(...args: any[]) => void} callback - 要限制的函數.
 * @param {number} delay - 過幾毫秒才可以再次執行.
 * @returns {(...args: any[]) => void} - 改造後的函數.
 */
export function throttle(callback, delay = 500) {
  /**
   * @type {NodeJS.Timeout | undefined}
   */
  let timer;
  /**
   * @param {any[]} args
   */
  return (...args) => {
    if (timer) return;
    timer = setTimeout(() => {
      callback(...args);
      timer = undefined;
    }, delay);
  };
}
/**
 * 函數去彈跳
 * @param {(...args: any[]) => void} callback - 要去彈跳的函數.
 * @param {number} delay - 判定彈跳的時間間隔(ms).
 * @returns {(...args: any[]) => void} - 改造後的函數.
 */
export function debounce(callback, delay = 500) {
  /**
   * @type {NodeJS.Timeout | undefined}
   */
  let timer;
  /**
   * @param {any[]} args
   */
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}
