const spinner = document.querySelector(".loading-mask");
if (!(spinner instanceof HTMLElement)) throw new Error(".loading-mask 不是 HTML元素");
spinner.classList.add("opacity-0");
spinner.ontransitionend = () => {
  spinner.classList.add("d-none");
};
