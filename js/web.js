/* ApexFit PWA (iPhone / przeglądarka) — dodatki wersji webowej: wykrywanie platformy, wskazówka instalacji,
   odblokowanie mowy na iOS, rejestracja service workera. Ładowany tylko w wersji PWA. */
"use strict";
(function () {
  const ua = navigator.userAgent || "";
  const qs = new URLSearchParams(location.search);
  const ios = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const standalone = !!(navigator.standalone || (window.matchMedia && matchMedia("(display-mode: standalone)").matches));
  const android = /Android/i.test(ua);
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  window.TWWEB = {
    ios, standalone, android, native: !!window.AndroidBridge,
    sttOK: !!SR, ttsOK: !!(window.speechSynthesis && window.SpeechSynthesisUtterance),
    voiceOK: !!(SR && window.speechSynthesis && window.SpeechSynthesisUtterance)
  };
  document.documentElement.classList.add("web-pwa");
  if (ios) document.documentElement.classList.add("is-ios");
  if (standalone) document.documentElement.classList.add("is-standalone");

  // iOS: mowa (speechSynthesis) działa dopiero po pierwszym geście użytkownika — „odblokowujemy” ją pustą wypowiedzią
  let unlocked = false;
  function unlock() {
    if (unlocked) return; unlocked = true;
    try { if (window.speechSynthesis) { const u = new SpeechSynthesisUtterance(" "); u.volume = 0; speechSynthesis.speak(u); } } catch (e) { /* brak */ }
    ["pointerdown", "touchend", "click"].forEach((t) => document.removeEventListener(t, unlock, true));
  }
  ["pointerdown", "touchend", "click"].forEach((t) => document.addEventListener(t, unlock, true));
  try { if (window.speechSynthesis) speechSynthesis.getVoices(); } catch (e) { /* brak */ }

  // baner „Zainstaluj na iPhonie” — tylko w Safari (nie w zainstalowanej aplikacji)
  const HINT_KEY = "tw-ios-hint";
  function hintHidden() { try { const t = Number(localStorage.getItem(HINT_KEY) || 0); return t && Date.now() - t < 14 * 86400000; } catch (e) { return false; } }
  function showHint() {
    if (document.getElementById("ios-hint")) return;
    const d = document.createElement("div");
    d.id = "ios-hint"; d.setAttribute("role", "region"); d.setAttribute("aria-label", "Zainstaluj na iPhonie");
    d.innerHTML = '<span class="ih-ic" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V3M8 7l4-4 4 4"/><path d="M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1"/></svg></span>' +
      '<span class="ih-tx"><b>Zainstaluj na iPhonie</b><small>Dotknij <i>Udostępnij</i> (kwadrat ze strzałką) → <i>Do ekranu początkowego</i>. Aplikacja będzie działać na pełnym ekranie i offline.</small></span>' +
      '<button type="button" class="ih-x" aria-label="Zamknij podpowiedź">✕</button>';
    d.querySelector(".ih-x").addEventListener("click", () => { try { localStorage.setItem(HINT_KEY, String(Date.now())); } catch (e) { /* brak */ } d.remove(); });
    document.body.appendChild(d);
    setTimeout(() => { if (d.parentNode) { d.style.transition = "opacity .4s"; d.style.opacity = "0"; setTimeout(() => d.remove(), 450); } }, 16000); // znika sam; ✕ ukrywa na 14 dni
  }
  function maybeHint() {
    if (qs.get("ioshint") === "1") { showHint(); return; }
    if (ios && !standalone && !hintHidden()) setTimeout(showHint, 3800); // po ekranie startowym
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", maybeHint); else maybeHint();

  // service worker: offline po pierwszym uruchomieniu
  if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol) && !qs.get("nosw")) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").then((reg) => {
        const warm = () => { try { (reg.active || reg.waiting || reg.installing).postMessage({ type: "warm" }); } catch (e) { /* brak */ } };
        if (reg.active) setTimeout(warm, 4000); else navigator.serviceWorker.ready.then(() => setTimeout(warm, 4000));
      }).catch(() => { /* brak */ });
    });
  }
})();
