import{P as f,d}from"./main-523da3af.js";import"./search-bar-sticky-top-b6fb9707.js";import{G as m}from"./Gallery-5c5c8e1f.js";const s=document.querySelector("#tag-selector .tags-group"),a=document.querySelector("#tag-selector");function L(t){const o=t.currentTarget;s&&a&&o instanceof HTMLElement&&(s.classList.toggle("tags-group-fold"),a.classList.toggle("flex-column"),o.classList.toggle("rotate-180"))}function p(t){const o=t.currentTarget;if(!(t instanceof WheelEvent)||!(o instanceof HTMLElement))return;const n=o.scrollLeft+t.deltaY;o.scrollLeft=n,t.preventDefault()}var c;(c=document.querySelector("#tag-selector-toggler"))==null||c.addEventListener("click",L);s==null||s.addEventListener("wheel",p,{passive:!1});f.getOrCreateInstance("#tag-selector-tips",{trigger:"focus"});window.addEventListener("load",async()=>{const t=await fetch("/data/crafts.json").catch(e=>console.log(e)),o=await fetch("/user/0/account.json").catch(e=>console.log(e)),[n,l]=await Promise.all([t.json(),o.json()]),i=n.filter(e=>e.tags.some(u=>l.interestTags.includes(u))).map(e=>e.imgURLs[0]),g=document.querySelector("#load-gallery-interest"),r=new m("#gallery-interest",{imgURLs:i,loadButton:g,loadAmount:8});window.addEventListener("resize",d(()=>r.container.querySelectorAll(".gallery-item").forEach(e=>r.resizeItem(e)),100))});
