/* ApexFit — service worker (PWA). Wersja pamięci podręcznej: 1.3.5-f332e9bd */
"use strict";
const VER = "1.3.5-f332e9bd";
const CORE = "apexfit-core-" + VER, RUN = "apexfit-run-" + VER;
const CORE_URLS = ["./", "index.html", "manifest.webmanifest", "apple-touch-icon.png", "css/style.css", "css/assistant.css", "css/web.css", "js/web.js", "js/ai.js", "js/app.js", "js/assistant.js", "js/data.js", "js/ex.js", "js/videos.js", "fonts/fraunces.woff2", "fonts/outfit.woff2", "img/favicon.svg", "img/splash-ekipa7.webp", "img/icons/icon-192.png", "img/icons/icon-512.png", "img/asst/atena-angry.webp", "img/asst/atena-happy.webp", "img/asst/atena-irritated.webp", "img/asst/atena-laugh.webp", "img/asst/atena-motivated.webp", "img/asst/atena-neutral.webp", "img/asst/atena-sleepy.webp", "img/asst/atena-warning.webp", "img/asst/lapka-angry.webp", "img/asst/lapka-happy.webp", "img/asst/lapka-irritated.webp", "img/asst/lapka-laugh.webp", "img/asst/lapka-motivated.webp", "img/asst/lapka-neutral.webp", "img/asst/lapka-sleepy.webp", "img/asst/lapka-warning.webp", "img/asst/marta-angry.webp", "img/asst/marta-happy.webp", "img/asst/marta-irritated.webp", "img/asst/marta-laugh.webp", "img/asst/marta-motivated.webp", "img/asst/marta-neutral.webp", "img/asst/marta-sleepy.webp", "img/asst/marta-warning.webp", "img/asst/oliwka-angry.webp", "img/asst/oliwka-happy.webp", "img/asst/oliwka-irritated.webp", "img/asst/oliwka-laugh.webp", "img/asst/oliwka-motivated.webp", "img/asst/oliwka-neutral.webp", "img/asst/oliwka-sleepy.webp", "img/asst/oliwka-warning.webp", "img/asst/pitbull-angry.webp", "img/asst/pitbull-happy.webp", "img/asst/pitbull-irritated.webp", "img/asst/pitbull-laugh.webp", "img/asst/pitbull-motivated.webp", "img/asst/pitbull-neutral.webp", "img/asst/pitbull-sleepy.webp", "img/asst/pitbull-warning.webp", "img/asst/rico-angry.webp", "img/asst/rico-happy.webp", "img/asst/rico-irritated.webp", "img/asst/rico-laugh.webp", "img/asst/rico-motivated.webp", "img/asst/rico-neutral.webp", "img/asst/rico-sleepy.webp", "img/asst/rico-warning.webp", "img/asst/zajac-angry.webp", "img/asst/zajac-happy.webp", "img/asst/zajac-irritated.webp", "img/asst/zajac-laugh.webp", "img/asst/zajac-motivated.webp", "img/asst/zajac-neutral.webp", "img/asst/zajac-sleepy.webp", "img/asst/zajac-warning.webp"];
const WARM_URLS = ["img/anim/atena-hop.webp", "img/anim/atena-idle.webp", "img/anim/atena-irritated.webp", "img/anim/atena-jump.webp", "img/anim/atena-laugh.webp", "img/anim/atena-motivated.webp", "img/anim/atena-sleepy.webp", "img/anim/atena-warning.webp", "img/anim/atena-wave.webp", "img/anim/lapka-hop.webp", "img/anim/lapka-idle.webp", "img/anim/lapka-irritated.webp", "img/anim/lapka-jump.webp", "img/anim/lapka-laugh.webp", "img/anim/lapka-motivated.webp", "img/anim/lapka-sleepy.webp", "img/anim/lapka-warning.webp", "img/anim/lapka-wave.webp", "img/anim/marta-hop.webp", "img/anim/marta-idle.webp", "img/anim/marta-irritated.webp", "img/anim/marta-jump.webp", "img/anim/marta-laugh.webp", "img/anim/marta-motivated.webp", "img/anim/marta-sleepy.webp", "img/anim/marta-warning.webp", "img/anim/marta-wave.webp", "img/anim/oliwka-hop.webp", "img/anim/oliwka-idle.webp", "img/anim/oliwka-irritated.webp", "img/anim/oliwka-jump.webp", "img/anim/oliwka-laugh.webp", "img/anim/oliwka-motivated.webp", "img/anim/oliwka-sleepy.webp", "img/anim/oliwka-warning.webp", "img/anim/oliwka-wave.webp", "img/anim/pitbull-hop.webp", "img/anim/pitbull-idle.webp", "img/anim/pitbull-irritated.webp", "img/anim/pitbull-jump.webp", "img/anim/pitbull-laugh.webp", "img/anim/pitbull-motivated.webp", "img/anim/pitbull-sleepy.webp", "img/anim/pitbull-warning.webp", "img/anim/pitbull-wave.webp", "img/anim/rico-hop.webp", "img/anim/rico-idle.webp", "img/anim/rico-irritated.webp", "img/anim/rico-jump.webp", "img/anim/rico-laugh.webp", "img/anim/rico-motivated.webp", "img/anim/rico-sleepy.webp", "img/anim/rico-warning.webp", "img/anim/rico-wave.webp", "img/anim/zajac-hop.webp", "img/anim/zajac-idle.webp", "img/anim/zajac-irritated.webp", "img/anim/zajac-jump.webp", "img/anim/zajac-laugh.webp", "img/anim/zajac-motivated.webp", "img/anim/zajac-sleepy.webp", "img/anim/zajac-warning.webp", "img/anim/zajac-wave.webp", "img/ex/abdmachine-k.jpg", "img/ex/abduction-k.jpg", "img/ex/airsquat-k.jpg", "img/ex/airsquat-m.jpg", "img/ex/archer-k.jpg", "img/ex/archer-m.jpg", "img/ex/archerpull-m.jpg", "img/ex/australian-k.jpg", "img/ex/australian-m.jpg", "img/ex/bandpulldown-k.jpg", "img/ex/bandpulldown-m.jpg", "img/ex/bandrow-k.jpg", "img/ex/bandrow-m.jpg", "img/ex/bench-m.jpg", "img/ex/benchdip-k.jpg", "img/ex/benchdip-m.jpg", "img/ex/bike-k.jpg", "img/ex/bulgarian-k.jpg", "img/ex/bulgarian-m.jpg", "img/ex/burpee-k.jpg", "img/ex/burpee-m.jpg", "img/ex/bwlunge-k.jpg", "img/ex/bwlunge-m.jpg", "img/ex/cablekick-k.jpg", "img/ex/cablepushdown-m.jpg", "img/ex/cablerow-k.jpg", "img/ex/cablerow-m.jpg", "img/ex/calf-m.jpg", "img/ex/dbbench-k.jpg", "img/ex/dbbench-m.jpg", "img/ex/dbext-m.jpg", "img/ex/dbfloor-k.jpg", "img/ex/dbfloor-m.jpg", "img/ex/dbpress-k.jpg", "img/ex/dbpress-m.jpg", "img/ex/dbrdl-k.jpg", "img/ex/dbrdl-m.jpg", "img/ex/dbrow-k.jpg", "img/ex/dbrow-m.jpg", "img/ex/deadlift-m.jpg", "img/ex/diamond-k.jpg", "img/ex/diamond-m.jpg", "img/ex/dip-k.jpg", "img/ex/dip-m.jpg", "img/ex/dragonflag-k.jpg", "img/ex/dragonflag-m.jpg", "img/ex/elevpike-k.jpg", "img/ex/elevpike-m.jpg", "img/ex/facepull-k.jpg", "img/ex/floor-k.jpg", "img/ex/glutebridge-k.jpg", "img/ex/glutebridge-m.jpg", "img/ex/goblet-k.jpg", "img/ex/goblet-m.jpg", "img/ex/hammer-m.jpg", "img/ex/hipthrust-k.jpg", "img/ex/hipthrust-m.jpg", "img/ex/hollow-k.jpg", "img/ex/hollow-m.jpg", "img/ex/inclinepush-k.jpg", "img/ex/inclinepush-m.jpg", "img/ex/kbswing-k.jpg", "img/ex/kbswing-m.jpg", "img/ex/kickback-k.jpg", "img/ex/knee-k.jpg", "img/ex/latpull-k.jpg", "img/ex/latpull-m.jpg", "img/ex/legcurl-m.jpg", "img/ex/legpress-m.jpg", "img/ex/legraise-k.jpg", "img/ex/legraise-m.jpg", "img/ex/lsit-k.jpg", "img/ex/lsit-m.jpg", "img/ex/lsitpull-k.jpg", "img/ex/lsitpull-m.jpg", "img/ex/machinechest-m.jpg", "img/ex/negpull-k.jpg", "img/ex/negpull-m.jpg", "img/ex/ohp-k.jpg", "img/ex/pike-k.jpg", "img/ex/pike-m.jpg", "img/ex/pistol-k.jpg", "img/ex/pistol-m.jpg", "img/ex/plank-k.jpg", "img/ex/plank-m.jpg", "img/ex/pseudoplanche-k.jpg", "img/ex/pseudoplanche-m.jpg", "img/ex/pullup-k.jpg", "img/ex/pushup-k.jpg", "img/ex/pushup-m.jpg", "img/ex/rdl-k.jpg", "img/ex/rope-k.jpg", "img/ex/row-k.jpg", "img/ex/rowerg-m.jpg", "img/ex/shrimp-k.jpg", "img/ex/shrimp-m.jpg", "img/ex/slbridge-k.jpg", "img/ex/slbridge-m.jpg", "img/ex/smithsquat-m.jpg", "img/ex/squat-k.jpg", "img/ex/stepup-k.jpg", "img/ex/stepup-m.jpg", "img/ex/sumo-k.jpg", "img/ex/sumo-m.jpg", "img/ex/treadmill-m.jpg", "img/ex/wallhs-k.jpg", "img/ex/wallhs-m.jpg", "img/face-pull-z-guma.jpg", "img/hero/atena.jpg", "img/hero/lapka.jpg", "img/hero/marta.jpg", "img/hero/oliwka.jpg", "img/hero/pitbull.jpg", "img/hero/rico.jpg", "img/hero/zajac.jpg", "img/martwy-ciag-rumunski.jpg", "img/podciaganie-nachwytem.jpg", "img/podciaganie-podchwytem.jpg", "img/prostowanie-ramion-z-guma.jpg", "img/przysiad-ze-sztanga.jpg", "img/rowerek-stacjonarny.jpg", "img/skakanka.jpg", "img/trenerzy/atena.jpg", "img/trenerzy/lapka.jpg", "img/trenerzy/marta.jpg", "img/trenerzy/oliwka.jpg", "img/trenerzy/pitbull.jpg", "img/trenerzy/rico.jpg", "img/trenerzy/zajac.jpg", "img/uginanie-ramion-z-hantlami.jpg", "img/unoszenie-hantli-bokiem.jpg", "img/unoszenie-kolan-w-zwisie.jpg", "img/wioslowanie-w-opadzie.jpg", "img/wyciskanie-lezac-na-podlodze.jpg", "img/wyciskanie-zolnierskie.jpg", "img/wykroki-z-hantlami.jpg"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CORE).then((c) => Promise.all(CORE_URLS.map((u) => c.add(new Request(u, { cache: "reload" })).catch(() => { /* pojedynczy brak nie blokuje instalacji */ })))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith("apexfit-") && k !== CORE && k !== RUN).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("message", (e) => {
  if (!e.data || e.data.type !== "warm") return;
  e.waitUntil(caches.open(RUN).then(async (c) => { for (const u of WARM_URLS) { try { if (!(await c.match(u))) await c.add(u); } catch (err) { /* offline */ } } }));
});

const isVideo = (req, url) => /\.mp4$/i.test(url.pathname) || req.destination === "video";

async function fromCache(req) { return (await caches.open(CORE).then((c) => c.match(req, { ignoreSearch: true }))) || (await caches.open(RUN).then((c) => c.match(req, { ignoreSearch: true }))); }

// Safari wymaga obsługi nagłówka Range dla <video> — wycinamy fragment z zapisanej, pełnej odpowiedzi
async function rangeResponse(req, full) {
  const buf = await full.arrayBuffer(), size = buf.byteLength;
  const m = /bytes=(\d*)-(\d*)/.exec(req.headers.get("range") || "");
  let s = m && m[1] ? parseInt(m[1], 10) : 0, e2 = m && m[2] ? parseInt(m[2], 10) : size - 1;
  if (m && !m[1] && m[2]) { s = Math.max(0, size - parseInt(m[2], 10)); e2 = size - 1; }
  e2 = Math.min(e2, size - 1);
  return new Response(buf.slice(s, e2 + 1), { status: 206, statusText: "Partial Content", headers: { "Content-Type": full.headers.get("Content-Type") || "video/mp4", "Content-Range": `bytes ${s}-${e2}/${size}`, "Content-Length": String(e2 - s + 1), "Accept-Ranges": "bytes" } });
}
const pendingVid = new Set();
async function videoFetch(req, url) {
  const key = url.origin + url.pathname;
  const hit = await fromCache(new Request(key));
  if (hit) return req.headers.has("range") ? rangeResponse(req, hit.clone()) : hit;
  // brak w pamięci: pierwsze odtwarzanie idzie z sieci, a w tle zapisujemy cały plik (leniwie, tylko oglądane filmy)
  if (!pendingVid.has(key)) {
    pendingVid.add(key);
    fetch(key).then((r) => { if (r.ok && r.status === 200) return caches.open(RUN).then((c) => c.put(key, r)); }).catch(() => { /* brak */ }).finally(() => pendingVid.delete(key));
  }
  return fetch(req);
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // API AI i zewnętrzne strony — zawsze prosto z sieci
  if (isVideo(req, url)) { e.respondWith(videoFetch(req, url)); return; }
  if (req.mode === "navigate") { // dokument: najpierw sieć (aktualizacje), offline → zapisany index
    e.respondWith(fetch(req).then((r) => { if (r.ok) { const cp = r.clone(); caches.open(CORE).then((c) => c.put(new Request("index.html"), cp)); } return r; }).catch(() => caches.open(CORE).then((c) => c.match("index.html", { ignoreSearch: true }))));
    return;
  }
  // zasoby statyczne: z pamięci, w tle odświeżenie (stale-while-revalidate)
  e.respondWith(fromCache(req).then((hit) => {
    const net = fetch(req).then((r) => { if (r.ok && r.status === 200) { const cp = r.clone(); caches.open(RUN).then((c) => c.put(req, cp)); } return r; }).catch(() => hit);
    return hit || net;
  }));
});
