if(!self.define){let e,i={};const n=(n,r)=>(n=new URL(n+".js",r).href,i[n]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()})).then((()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(r,s)=>{const f=e||("document"in self?document.currentScript.src:"")||location.href;if(i[f])return;let o={};const c=e=>n(e,f),a={module:{uri:f},exports:o,require:c};i[f]=Promise.all(r.map((e=>a[e]||c(e)))).then((e=>(s(...e),o)))}}define(["./workbox-5ffe50d4"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"apple-touch-icon.png",revision:"1fd3aeffc789597e1421199c2e392b67"},{url:"assets/main-BJH3rrJi.css",revision:null},{url:"assets/main-COM-36rN.js",revision:null},{url:"assets/material-symbols-rounded-CETx5mfg.woff2",revision:null},{url:"desktop-screenshot.png",revision:"203463c21a2d9112add3377bee156288"},{url:"favicon-96x96.png",revision:"f54759062de4c99d7564ff1351bbc363"},{url:"index.html",revision:"fa949febe6ad99a527d40bfa4c8f2f0b"},{url:"maks-icon.svg",revision:"b1a051478657c665732fd639a9507bcb"},{url:"mobile-screenshot.png",revision:"a499bc61e7bbff2d9b15e0ec055350bc"},{url:"pwa-192x192.png",revision:"5874702c77a04ab968cef3f063971b32"},{url:"pwa-512x512.png",revision:"7aef5bd7205f7dfbbff41dbaeb4f0abc"},{url:"registerSW.js",revision:"1872c500de691dce40960bb85481de07"},{url:"apple-touch-icon.png",revision:"1fd3aeffc789597e1421199c2e392b67"},{url:"pwa-192x192.png",revision:"5874702c77a04ab968cef3f063971b32"},{url:"pwa-512x512.png",revision:"7aef5bd7205f7dfbbff41dbaeb4f0abc"},{url:"manifest.webmanifest",revision:"3c84a175af6e8e93c82d3035a16f15ef"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
