import { Popover } from "bootstrap";
/**
 * @param {Event} event
 */
function toggleTags(event) {
  const tags = document.querySelector("#tag-selector-tags");
  const toggleBtn = event.target;
  if (tags instanceof HTMLUListElement && toggleBtn instanceof HTMLAnchorElement) {
    tags.classList.toggle("tags-list-fold");
    tags.classList.toggle("tags-list-expend");
    tags.parentElement?.classList.toggle("flex-wrap");
    toggleBtn.parentElement?.classList.toggle("rotate-180");
  }
}
document.querySelector("#tag-selector-toggle-btn")?.addEventListener("click", toggleTags);
Popover.getOrCreateInstance("#tag-selector-tips", {
  trigger: "focus",
});
