/* ApexFit — czat AI (v1.3.5): Gemini (domyślnie, darmowy plan), Grok (xAI), ChatGPT (OpenAI).
   W aplikacji na Androida zapytania i klucze obsługuje kod natywny (klucz szyfrowany w pamięci prywatnej, nigdy nie trafia do JS ani do logów).
   W przeglądarce (testy/podgląd) klucz trzymany jest w localStorage, a zapytania idą przez fetch. ?stubai=1 — atrapa odpowiedzi do testów. */
"use strict";
(function () {
  const CFG_KEY = "tw-ai";
  const PROV = {
    gemini: { label: "Gemini (Google)", short: "Gemini", models: ["gemini-3.8-flash", "gemini-3.6-flash", "gemini-2.5-flash"], keyUrl: "https://aistudio.google.com/app/apikey", note: "Darmowy plan Google (bez karty). Google może używać rozmów z darmowego planu do ulepszania modeli — nie podawaj prywatnych danych." },
    grok: { label: "Grok (xAI)", short: "Grok", models: ["grok-4.7", "grok-4.6", "grok-4.5"], keyUrl: "https://console.x.ai", note: "Wymaga konta xAI z doładowaniem." },
    openai: { label: "ChatGPT (OpenAI)", short: "ChatGPT", models: ["gpt-6-luna", "gpt-5.6-luna", "gpt-4o-mini"], keyUrl: "https://platform.openai.com/api-keys", note: "Klucz API jest osobny od subskrypcji ChatGPT Plus i wymaga doładowania konta." },
  };
  const ORDER = ["gemini", "grok", "openai"];
  const NB = () => window.AndroidBridge || null;
  const qs = new URLSearchParams(location.search);
  const STUB = qs.get("stubai");
  let cfg = Object.assign({ prov: "gemini", on: true, model: {} }, (() => { try { return JSON.parse(localStorage.getItem(CFG_KEY)) || {}; } catch (e) { return {}; } })());
  if (!PROV[cfg.prov]) cfg.prov = "gemini";
  cfg.model = cfg.model || {};
  const save = () => { try { localStorage.setItem(CFG_KEY, JSON.stringify(cfg)); } catch (e) { /* brak */ } };
  const wkey = (p) => "tw-ai-key-" + p; // tylko przeglądarka
  function hasKey(p) {
    p = p || cfg.prov;
    if (STUB === "nokey") return false;
    if (STUB) return true;
    const b = NB();
    if (b && b.aiHasKey) { try { return !!b.aiHasKey(p); } catch (e) { return false; } }
    try { return !!localStorage.getItem(wkey(p)); } catch (e) { return false; }
  }
  const modelsFor = (p) => { const m = (cfg.model[p] || "").trim(); const d = PROV[p].models; return m ? [m].concat(d.filter((x) => x !== m)) : d.slice(); };
  function keyLooksOk(k) { return typeof k === "string" && k.length >= 20 && k.length <= 400 && !/\s/.test(k); }
  function setKey(p, k) {
    k = String(k || "").trim();
    if (!keyLooksOk(k)) return false;
    const b = NB();
    if (b && b.aiSetKey) { try { return !!b.aiSetKey(p, k); } catch (e) { return false; } }
    try { localStorage.setItem(wkey(p), k); return true; } catch (e) { return false; }
  }
  function clearKey(p) { const b = NB(); if (b && b.aiClearKey) { try { b.aiClearKey(p); } catch (e) { /* brak */ } } try { localStorage.removeItem(wkey(p)); } catch (e) { /* brak */ } }
  async function readClipboard() {
    const b = NB();
    if (b && b.clipboardText) { try { return String(b.clipboardText() || ""); } catch (e) { return ""; } }
    try { return (await navigator.clipboard.readText()) || ""; } catch (e) { return ""; }
  }
  // kody błędów: nokey, auth, quota, model, net, other
  const ERR_TXT = { nokey: "Brak klucza API.", auth: "Klucz nie został przyjęty (sprawdź, czy jest poprawny i aktywny).", quota: "Limit zapytań wyczerpany albo konto bez środków. Spróbuj później.", model: "Model niedostępny dla tego klucza.", net: "Brak połączenia z internetem.", other: "Usługa AI nie odpowiedziała poprawnie." };
  const pending = {}; let rid = 0;
  function onNative(id, code, text) { const r = pending[id]; if (!r) return; delete pending[id]; if (code === "ok") r.res(String(text || "")); else r.rej(Object.assign(new Error(code), { code })); }
  // msgs: [{r:"user"|"model", t:"…"}]; zwraca Promise<string>
  function ask(sys, msgs, prov) {
    prov = prov || cfg.prov;
    if (STUB) {
      return new Promise((res, rej) => setTimeout(() => {
        if (STUB === "nokey") rej(Object.assign(new Error("nokey"), { code: "nokey" }));
        else if (STUB === "quota") rej(Object.assign(new Error("quota"), { code: "quota" }));
        else if (STUB === "net") rej(Object.assign(new Error("net"), { code: "net" }));
        else { const last = (msgs[msgs.length - 1] || {}).t || ""; res(window.__stubReply ? window.__stubReply(last, sys) : "To odpowiedź testowa AI na: " + last); }
      }, 350));
    }
    if (!hasKey(prov)) return Promise.reject(Object.assign(new Error("nokey"), { code: "nokey" }));
    const b = NB();
    if (b && b.aiAsk) return new Promise((res, rej) => { const id = "r" + (++rid); pending[id] = { res, rej }; try { b.aiAsk(id, prov, modelsFor(prov).join(","), sys, JSON.stringify(msgs)); } catch (e) { delete pending[id]; rej(Object.assign(e, { code: "other" })); } setTimeout(() => { if (pending[id]) { delete pending[id]; rej(Object.assign(new Error("net"), { code: "net" })); } }, 45000); });
    return webAsk(prov, sys, msgs);
  }
  async function webAsk(prov, sys, msgs) {
    const key = localStorage.getItem(wkey(prov)); let last = "other";
    for (const model of modelsFor(prov)) {
      try {
        let url, init;
        if (prov === "gemini") {
          url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
          init = { method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": key }, body: JSON.stringify({ systemInstruction: { parts: [{ text: sys }] }, contents: msgs.map((m) => ({ role: m.r === "user" ? "user" : "model", parts: [{ text: m.t }] })), generationConfig: { maxOutputTokens: 800 } }) };
        } else {
          url = prov === "grok" ? "https://api.x.ai/v1/chat/completions" : "https://api.openai.com/v1/chat/completions";
          init = { method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer " + key }, body: JSON.stringify({ model, messages: [{ role: "system", content: sys }].concat(msgs.map((m) => ({ role: m.r === "user" ? "user" : "assistant", content: m.t }))), max_completion_tokens: 800 }) };
        }
        const r = await fetch(url, init);
        if (r.status === 401 || r.status === 403) throw Object.assign(new Error("auth"), { code: "auth" });
        if (r.status === 429 || r.status === 402) throw Object.assign(new Error("quota"), { code: "quota" });
        if (r.status === 404 || r.status === 400) { let tx = ""; try { tx = await r.text(); } catch (e2) { /* brak */ } if (/API key not valid|API_KEY_INVALID|Incorrect API key|invalid[^"]{0,20}key/i.test(tx)) throw Object.assign(new Error("auth"), { code: "auth" }); last = "model"; continue; }
        if (!r.ok) throw Object.assign(new Error("other"), { code: "other" });
        const j = await r.json();
        const t = prov === "gemini" ? (((j.candidates || [])[0] || {}).content || {}).parts && j.candidates[0].content.parts.map((x) => x.text || "").join("") : (((j.choices || [])[0] || {}).message || {}).content;
        if (t && String(t).trim()) return String(t).trim();
        last = "other";
      } catch (e) { if (e.code) throw e; throw Object.assign(new Error("net"), { code: "net" }); }
    }
    throw Object.assign(new Error(last), { code: last });
  }
  async function validate(prov) {
    try { const t = await ask("Jesteś testem połączenia. Odpowiedz jednym słowem: OK.", [{ r: "user", t: "Test połączenia. Odpowiedz: OK" }], prov); return { ok: true, text: t.slice(0, 40) }; }
    catch (e) { return { ok: false, code: e.code || "other", text: ERR_TXT[e.code] || ERR_TXT.other }; }
  }
  window.TWAI = {
    PROV, ORDER, cfg: () => cfg, ERR_TXT, hasKey, setKey, clearKey, readClipboard, ask, validate, onNative, modelsFor, keyLooksOk,
    enabled: () => cfg.on !== false && hasKey(),
    setProv: (p) => { if (PROV[p]) { cfg.prov = p; save(); } }, setOn: (v) => { cfg.on = !!v; save(); }, setModel: (p, m) => { cfg.model[p] = String(m || "").trim(); save(); },
  };
})();
