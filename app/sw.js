/* KGG Trainingspläne – Offline-Speicher für das Programm (keine Patientendaten). Version 20261111104808 */
const CACHE="kgg-app-20261111104808";
const FILES=["./","index.html","patient.html","manifest.webmanifest","icon-180.png","icon-192.png","icon-512.png","icon-192-maskable.png","icon-512-maskable.png"];
self.addEventListener("install",e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())); });
self.addEventListener("activate",e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener("fetch",e=>{
  const r=e.request; if(r.method!=="GET"||new URL(r.url).origin!==location.origin) return;
  e.respondWith(caches.open(CACHE).then(async c=>{
    const key=r.mode==="navigate"?(/patient\.html$/.test(new URL(r.url).pathname)?"patient.html":"index.html"):r;
    const hit=await c.match(key,{ignoreSearch:true});
    const net=fetch(r).then(res=>{ if(res&&res.ok&&r.mode!=="navigate") c.put(r,res.clone()); return res; }).catch(()=>null);
    return hit||(await net)||new Response("Offline",{status:503});
  }));
});
