(()=>{"use strict";var e,t,r,a,o,n={},b={};function c(e){var t=b[e];if(void 0!==t)return t.exports;var r=b[e]={id:e,loaded:!1,exports:{}};return n[e].call(r.exports,r,r.exports,c),r.loaded=!0,r.exports}c.m=n,c.c=b,e=[],c.O=(t,r,a,o)=>{if(!r){var n=1/0;for(d=0;d<e.length;d++){for(var[r,a,o]=e[d],b=!0,i=0;i<r.length;i++)(!1&o||n>=o)&&Object.keys(c.O).every((e=>c.O[e](r[i])))?r.splice(i--,1):(b=!1,o<n&&(n=o));if(b){e.splice(d--,1);var f=a();void 0!==f&&(t=f)}}return t}o=o||0;for(var d=e.length;d>0&&e[d-1][2]>o;d--)e[d]=e[d-1];e[d]=[r,a,o]},c.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return c.d(t,{a:t}),t},r=Object.getPrototypeOf?e=>Object.getPrototypeOf(e):e=>e.__proto__,c.t=function(e,a){if(1&a&&(e=this(e)),8&a)return e;if("object"==typeof e&&e){if(4&a&&e.__esModule)return e;if(16&a&&"function"==typeof e.then)return e}var o=Object.create(null);c.r(o);var n={};t=t||[null,r({}),r([]),r(r)];for(var b=2&a&&e;"object"==typeof b&&!~t.indexOf(b);b=r(b))Object.getOwnPropertyNames(b).forEach((t=>n[t]=()=>e[t]));return n.default=()=>e,c.d(o,n),o},c.d=(e,t)=>{for(var r in t)c.o(t,r)&&!c.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},c.f={},c.e=e=>Promise.all(Object.keys(c.f).reduce(((t,r)=>(c.f[r](e,t),t)),[])),c.u=e=>"assets/js/"+({61:"1f391b9e",138:"1a4e3797",251:"5969ba0b",332:"66c10cbb",334:"4a00c823",401:"17896441",528:"be6c8720",572:"bcb85c39",581:"935f2afb",583:"1df93b7f",714:"1be78505",806:"2b785902",864:"09d5ad39",877:"58b01185",893:"879aed75",904:"4cc4d2ba",982:"4cbb3e73"}[e]||e)+"."+{61:"24249360",138:"9d1c96fc",251:"4f2e138d",323:"b705945c",332:"d70a0147",334:"0d5262c7",401:"18bcc77f",489:"a771d9f2",528:"467815d0",572:"65515838",581:"e5418b89",583:"252d6cd1",714:"43771c11",741:"5dc1dc9a",774:"e21fb5ee",806:"27299456",864:"2a3bc8df",877:"ce174a2b",893:"f3cd727f",904:"69669602",982:"676d2553"}[e]+".js",c.miniCssF=e=>{},c.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),c.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),a={},o="nanopub-website:",c.l=(e,t,r,n)=>{if(a[e])a[e].push(t);else{var b,i;if(void 0!==r)for(var f=document.getElementsByTagName("script"),d=0;d<f.length;d++){var u=f[d];if(u.getAttribute("src")==e||u.getAttribute("data-webpack")==o+r){b=u;break}}b||(i=!0,(b=document.createElement("script")).charset="utf-8",b.timeout=120,c.nc&&b.setAttribute("nonce",c.nc),b.setAttribute("data-webpack",o+r),b.src=e),a[e]=[t];var l=(t,r)=>{b.onerror=b.onload=null,clearTimeout(s);var o=a[e];if(delete a[e],b.parentNode&&b.parentNode.removeChild(b),o&&o.forEach((e=>e(r))),t)return t(r)},s=setTimeout(l.bind(null,void 0,{type:"timeout",target:b}),12e4);b.onerror=l.bind(null,b.onerror),b.onload=l.bind(null,b.onload),i&&document.head.appendChild(b)}},c.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},c.p="/",c.gca=function(e){return e={17896441:"401","1f391b9e":"61","1a4e3797":"138","5969ba0b":"251","66c10cbb":"332","4a00c823":"334",be6c8720:"528",bcb85c39:"572","935f2afb":"581","1df93b7f":"583","1be78505":"714","2b785902":"806","09d5ad39":"864","58b01185":"877","879aed75":"893","4cc4d2ba":"904","4cbb3e73":"982"}[e]||e,c.p+c.u(e)},(()=>{var e={354:0,869:0};c.f.j=(t,r)=>{var a=c.o(e,t)?e[t]:void 0;if(0!==a)if(a)r.push(a[2]);else if(/^(354|869)$/.test(t))e[t]=0;else{var o=new Promise(((r,o)=>a=e[t]=[r,o]));r.push(a[2]=o);var n=c.p+c.u(t),b=new Error;c.l(n,(r=>{if(c.o(e,t)&&(0!==(a=e[t])&&(e[t]=void 0),a)){var o=r&&("load"===r.type?"missing":r.type),n=r&&r.target&&r.target.src;b.message="Loading chunk "+t+" failed.\n("+o+": "+n+")",b.name="ChunkLoadError",b.type=o,b.request=n,a[1](b)}}),"chunk-"+t,t)}},c.O.j=t=>0===e[t];var t=(t,r)=>{var a,o,[n,b,i]=r,f=0;if(n.some((t=>0!==e[t]))){for(a in b)c.o(b,a)&&(c.m[a]=b[a]);if(i)var d=i(c)}for(t&&t(r);f<n.length;f++)o=n[f],c.o(e,o)&&e[o]&&e[o][0](),e[o]=0;return c.O(d)},r=self.webpackChunknanopub_website=self.webpackChunknanopub_website||[];r.forEach(t.bind(null,0)),r.push=t.bind(null,r.push.bind(r))})()})();