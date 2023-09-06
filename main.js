import "./assets/scss/all.scss";
import * as bootstrap from "bootstrap";
let prevScrollPos = window.pageYOffset;
const navSearch = document.querySelector("#navSearch");
if (navSearch) {
  const bsSearchCollapse = new bootstrap.Collapse("#navSearch");
  window.onscroll = function () {
    if (navSearch.classList.contains("collapsing")) return;
    const currentScrollPos = window.pageYOffset;
    currentScrollPos > prevScrollPos ? bsSearchCollapse.hide() : bsSearchCollapse.show();
    prevScrollPos = currentScrollPos;
  };
}
