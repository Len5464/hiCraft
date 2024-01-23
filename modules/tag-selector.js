import { Popover } from "bootstrap";
const tagsGroup = document.querySelector("#tag-selector .tags-group");
const tagsSelector = document.querySelector("#tag-selector");

/**
 * @param {Event} event
 */
function toggleTagsGroup(event) {
  const toggler = event.currentTarget;
  if (tagsGroup && tagsSelector && toggler instanceof HTMLElement) {
    tagsGroup.classList.toggle("tags-group-fold");
    tagsSelector.classList.toggle("flex-column");
    toggler.classList.toggle("rotate-180");
  }
}
/**
 * @param {Event} event
 */
function transferHorizonScroll(event) {
  const thisElement = event.currentTarget;
  if (!(event instanceof WheelEvent)) return;
  if (!(thisElement instanceof HTMLElement)) return;

  const newScrollPosition = thisElement.scrollLeft + event.deltaY;
  thisElement.scrollLeft = newScrollPosition;
  event.preventDefault();
}

document.querySelector("#tag-selector-toggler")?.addEventListener("click", toggleTagsGroup);
tagsGroup?.addEventListener("wheel", transferHorizonScroll, { passive: false });
Popover.getOrCreateInstance("#tag-selector-tips", {
  trigger: "focus",
});
