import{d as f}from"./main-3d3740bf.js";import"./search-bar-sticky-top-11272228.js";import{G as w}from"./Gallery-a727a01d.js";const g=new URLSearchParams(window.location.search),s=g.get("query"),o="/hiCraft/",y=document.querySelector("#title-search-result");y.textContent=`${s} 有關的主題：`;window.addEventListener("load",async()=>{const n=await fetch(o+"data/crafts.json").catch(t=>{throw new Error("HTTP error! status: "+t.status)}),c=await fetch(o+"data/tags-i18n.json").catch(t=>{throw new Error("Failed to fetch tag-i18n data")}),[l,a]=await Promise.all([n.json(),c.json()]),i=m(s),d=l.filter(({tags:t})=>t.includes(i)).map(t=>t.imgURLs[0]),u=document.querySelector("#load-gallery-search-result"),r=new w("#gallery-search-result",{imgURLs:d,loadButton:u,loadAmount:8});window.addEventListener("resize",f(()=>r.container.querySelectorAll(".gallery-item").forEach(t=>r.resizeItem(t)),100));function m(t){for(const e in a){if(e.toLowerCase()===t.toLowerCase())return e;for(const h in a[e])if(a[e][h]===t)return e}}});