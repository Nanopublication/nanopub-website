(()=>{"use strict";var e,t,r,a,o,n={},d={};function b(e){var t=d[e];if(void 0!==t)return t.exports;var r=d[e]={id:e,loaded:!1,exports:{}};return n[e].call(r.exports,r,r.exports,b),r.loaded=!0,r.exports}b.m=n,b.c=d,e=[],b.O=(t,r,a,o)=>{if(!r){var n=1/0;for(f=0;f<e.length;f++){for(var[r,a,o]=e[f],d=!0,i=0;i<r.length;i++)(!1&o||n>=o)&&Object.keys(b.O).every((e=>b.O[e](r[i])))?r.splice(i--,1):(d=!1,o<n&&(n=o));if(d){e.splice(f--,1);var c=a();void 0!==c&&(t=c)}}return t}o=o||0;for(var f=e.length;f>0&&e[f-1][2]>o;f--)e[f]=e[f-1];e[f]=[r,a,o]},b.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return b.d(t,{a:t}),t},r=Object.getPrototypeOf?e=>Object.getPrototypeOf(e):e=>e.__proto__,b.t=function(e,a){if(1&a&&(e=this(e)),8&a)return e;if("object"==typeof e&&e){if(4&a&&e.__esModule)return e;if(16&a&&"function"==typeof e.then)return e}var o=Object.create(null);b.r(o);var n={};t=t||[null,r({}),r([]),r(r)];for(var d=2&a&&e;"object"==typeof d&&!~t.indexOf(d);d=r(d))Object.getOwnPropertyNames(d).forEach((t=>n[t]=()=>e[t]));return n.default=()=>e,b.d(o,n),o},b.d=(e,t)=>{for(var r in t)b.o(t,r)&&!b.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},b.f={},b.e=e=>Promise.all(Object.keys(b.f).reduce(((t,r)=>(b.f[r](e,t),t)),[])),b.u=e=>"assets/js/"+({30:"09d5ad39",53:"935f2afb",85:"1f391b9e",234:"4a00c823",237:"1df93b7f",381:"2b785902",397:"bcb85c39",423:"66c10cbb",514:"1be78505",524:"4cbb3e73",532:"4cc4d2ba",777:"5969ba0b",828:"58b01185",877:"879aed75",918:"17896441",920:"1a4e3797",923:"be6c8720"}[e]||e)+"."+{30:"3a0e3b1b",53:"1707232a",85:"2a1e0750",234:"b6d708df",237:"4c7d54d1",381:"99ee3e51",397:"18706b83",423:"40e73abc",443:"178dd356",514:"140a40e0",524:"b2d27c41",525:"50bf5a6c",532:"bca380e4",739:"715adeb6",777:"70fc7757",828:"03bedf08",877:"c4b4a479",918:"acbf8355",920:"5f65611d",923:"7bd793a1",972:"3f808041"}[e]+".js",b.miniCssF=e=>{},b.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),b.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),a={},o="nanopub-website:",b.l=(e,t,r,n)=>{if(a[e])a[e].push(t);else{var d,i;if(void 0!==r)for(var c=document.getElementsByTagName("script"),f=0;f<c.length;f++){var u=c[f];if(u.getAttribute("src")==e||u.getAttribute("data-webpack")==o+r){d=u;break}}d||(i=!0,(d=document.createElement("script")).charset="utf-8",d.timeout=120,b.nc&&d.setAttribute("nonce",b.nc),d.setAttribute("data-webpack",o+r),d.src=e),a[e]=[t];var l=(t,r)=>{d.onerror=d.onload=null,clearTimeout(s);var o=a[e];if(delete a[e],d.parentNode&&d.parentNode.removeChild(d),o&&o.forEach((e=>e(r))),t)return t(r)},s=setTimeout(l.bind(null,void 0,{type:"timeout",target:d}),12e4);d.onerror=l.bind(null,d.onerror),d.onload=l.bind(null,d.onload),i&&document.head.appendChild(d)}},b.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},b.p="/",b.gca=function(e){return e={17896441:"918","09d5ad39":"30","935f2afb":"53","1f391b9e":"85","4a00c823":"234","1df93b7f":"237","2b785902":"381",bcb85c39:"397","66c10cbb":"423","1be78505":"514","4cbb3e73":"524","4cc4d2ba":"532","5969ba0b":"777","58b01185":"828","879aed75":"877","1a4e3797":"920",be6c8720:"923"}[e]||e,b.p+b.u(e)},(()=>{var e={303:0,312:0};b.f.j=(t,r)=>{var a=b.o(e,t)?e[t]:void 0;if(0!==a)if(a)r.push(a[2]);else if(/^3(03|12)$/.test(t))e[t]=0;else{var o=new Promise(((r,o)=>a=e[t]=[r,o]));r.push(a[2]=o);var n=b.p+b.u(t),d=new Error;b.l(n,(r=>{if(b.o(e,t)&&(0!==(a=e[t])&&(e[t]=void 0),a)){var o=r&&("load"===r.type?"missing":r.type),n=r&&r.target&&r.target.src;d.message="Loading chunk "+t+" failed.\n("+o+": "+n+")",d.name="ChunkLoadError",d.type=o,d.request=n,a[1](d)}}),"chunk-"+t,t)}},b.O.j=t=>0===e[t];var t=(t,r)=>{var a,o,[n,d,i]=r,c=0;if(n.some((t=>0!==e[t]))){for(a in d)b.o(d,a)&&(b.m[a]=d[a]);if(i)var f=i(b)}for(t&&t(r);c<n.length;c++)o=n[c],b.o(e,o)&&e[o]&&e[o][0](),e[o]=0;return b.O(f)},r=self.webpackChunknanopub_website=self.webpackChunknanopub_website||[];r.forEach(t.bind(null,0)),r.push=t.bind(null,r.push.bind(r))})()})();