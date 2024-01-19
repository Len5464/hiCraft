var g=(n,e,t)=>{if(!e.has(n))throw TypeError("Cannot "+t)};var h=(n,e,t)=>(g(n,e,"read from private field"),t?t.call(n):e.get(n)),d=(n,e,t)=>{if(e.has(n))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(n):e.set(n,t)},s=(n,e,t,o)=>(g(n,e,"write to private field"),o?o.call(n,t):e.set(n,t),t);var m=(n,e,t,o)=>({set _(i){s(n,e,i,t)},get _(){return h(n,e,o)}});var r,a;class f{constructor(e,t){d(this,r,0);d(this,a,void 0);const o=e instanceof HTMLElement?e:document.querySelector(e);if(!o)throw new Error("無效的 gallery 選擇器");const{imgURLs:i,loadButton:l,loadAmount:c=8}=t;if(!Array.isArray(i))throw new Error("config物件中，imgURLs 必須是陣列");if(!(l instanceof HTMLElement))throw new Error("config物件中，loadButton 必須是 HTML 元素");this.container=o,this.rowHeight=parseInt(getComputedStyle(this.container).getPropertyValue("grid-auto-rows")),this.rowGap=parseInt(getComputedStyle(this.container).getPropertyValue("grid-row-gap")),this.imgURLs=i,this.loadAmount=c,this.loadButton=l,s(this,a,`${l.textContent}`),l.addEventListener("click",u=>{u.preventDefault(),this.loadItems(c)}),this.loadItems(c)}loadItems(e){const t=this.imgURLs.splice(0,e);t.length>0?(s(this,r,t.length),t.forEach(o=>this.genNewItem(o)),this.loadButton.innerHTML='<span class="spinner-border spinner-border-sm ms-4" role="status" aria-hidden="true"></span>載入中...'):(s(this,r,0),this.loadButton.textContent="沒有更多了")}genNewItem(e){const t=document.createElement("img"),o=document.createElement("a"),i=document.createElement("li");t.onload=()=>{this.resizeItem(i),m(this,r)._--,h(this,r)===0&&(this.loadButton.innerHTML=h(this,a))},t.src=e,t.alt="craft image",t.classList.add("gallery-img"),i.classList.add("gallery-item"),o.href="craft.html",o.appendChild(t),i.appendChild(o),this.container.appendChild(i)}resizeItem(e){const t=e.querySelector(".gallery-img");if(!(t instanceof HTMLElement))return;const o=Math.floor((t.getBoundingClientRect().height+this.rowGap)/(this.rowHeight+this.rowGap));e.style.gridRowEnd=`span ${o}`}}r=new WeakMap,a=new WeakMap;export{f as G};