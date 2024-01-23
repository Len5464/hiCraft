const url = new URL(window.location.href);
const currentPageName = url.searchParams.get("page");
const navBtn = document.querySelector(`#link-${currentPageName}`);
if (navBtn) {
  navBtn.classList.add("active");
  navBtn.ariaCurrent = "page";
}
