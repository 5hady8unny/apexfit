/* ApexFit — czat AI (v1.3.5): Gemini (domyślnie, darmowy plan), Grok (xAI), ChatGPT (OpenAI).
   W aplikacji na Androida zapytania i klucze obsługuje kod natywny (klucz szyfrowany w pamięci prywatnej, nigdy nie trafia do JS ani do logów).
   W przeglądarce (testy/podgląd) klucz trzymany jest w localStorage, a zapytania idą przez fetch. ?stubai=1 — atrapa odpowiedzi do testów. */
"use strict";
(function () {
  const CFG_KEY = "tw-ai";
  const PROV = {
    gemini: { label: "Gemini (Google)", short: "Gemini", models: ["gemini-3.8-flash", "gemini-3.6-flash", "gemini-3.5-flash-lite", "gemini-3.1-flash-lite"], keyUrl: "https://aistudio.google.com/app/apikey", note: "Darmowy plan Google (bez karty). Google może używać rozmów z darmowego planu do ulepszania modeli — nie podawaj prywatnych danych." },
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
  // Klucze Google AI Studio mają dziś dwa formaty: dawny „AIza…” i nowy „AQ.…” (kropka w środku). Czyścimy to, co dokleja schowek:
  // białe znaki, niewidzialne znaki, cudzysłowy/nawiasy wokół klucza, przedrostek „Bearer ”, „key=”, końcowy przecinek/średnik.
  function normKey(k) {
    k = String(k == null ? "" : k).replace(/[\u200b-\u200f\u2060\ufeff\u00a0]/g, "").trim();
    k = k.replace(/^(authorization:\s*)?bearer\s+/i, "").replace(/^(x-goog-api-key:|api[_ -]?key\s*[=:]|key\s*=)\s*/i, "");
    k = k.replace(/^["'`“”‘’<\[(]+/, "").replace(/["'`“”‘’>\])]+[,;.]?$/, "").replace(/[,;]$/, "");
    return k.trim();
  }
  function keyLooksOk(k) { return typeof k === "string" && k.length >= 20 && k.length <= 400 && /^[\x21-\x7e]+$/.test(k); }
  function setKey(p, k) {
    k = normKey(k);
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
  // kody błędów: nokey, auth, quota, region, model, net, dns, timeout, ssl, blocked, empty, other
  // fetch z limitem czasu 60 s (wolny model „myślący” nie jest już mylony z brakiem internetu)
  async function tfetch(url, init) {
    const ac = typeof AbortController === "function" ? new AbortController() : null; const t = ac ? setTimeout(() => ac.abort(), 60000) : 0;
    try { return await fetch(url, ac ? Object.assign({ signal: ac.signal }, init) : init); } finally { if (t) clearTimeout(t); }
  }
  function netErr(e) {
    const n = String((e && e.name) || "Error"), m = String((e && e.message) || "").replace(/key=[^&\s]+/g, "key=***").slice(0, 60);
    if (n === "AbortError") return Object.assign(new Error("timeout"), { code: "timeout", detail: "TIMEOUT" });
    return Object.assign(new Error("net"), { code: "net", detail: "FETCH: " + n + (m ? " " + m : "") });
  }
  const ERR_TXT = { nokey: "Brak klucza API.", auth: "Klucz nie został przyjęty (sprawdź, czy jest poprawny i aktywny).", quota: "Limit zapytań wyczerpany albo konto bez środków. Spróbuj później.", model: "Model niedostępny dla tego klucza.", net: "Nie udało się połączyć z usługą AI (sieć).", dns: "Nie można znaleźć serwera usługi AI (DNS). Sprawdź internet, VPN lub prywatny DNS w telefonie.", timeout: "Usługa AI odpowiada zbyt wolno (przekroczono czas). Spróbuj ponownie.", ssl: "Błąd bezpiecznego połączenia (SSL). Sprawdź datę i godzinę w telefonie, VPN lub program antywirusowy.",
    region: "Darmowy plan Gemini nie jest dostępny w Twoim kraju/regionie albo wymaga włączenia rozliczeń w Google AI Studio. Wybierz Grok lub ChatGPT.", blocked: "Usługa zablokowała tę odpowiedź (filtr bezpieczeństwa). Spróbuj inaczej sformułować pytanie.", empty: "Usługa AI zwróciła pustą odpowiedź.", other: "Usługa AI nie odpowiedziała poprawnie." };
  const errText = (code, detail) => (ERR_TXT[code] || ERR_TXT.other) + (detail ? " [" + detail + "]" : "");
  const pending = {}; let rid = 0;
  function onNative(id, code, text) { const r = pending[id]; if (!r) return; delete pending[id]; if (code === "ok") r.res(String(text || "")); else r.rej(Object.assign(new Error(code), { code, detail: String(text || "") })); }
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
    if (b && b.aiAsk) return new Promise((res, rej) => { const id = "r" + (++rid); pending[id] = { res, rej }; try { b.aiAsk(id, prov, modelsFor(prov).join(","), sys, JSON.stringify(msgs)); } catch (e) { delete pending[id]; rej(Object.assign(e, { code: "other" })); } setTimeout(() => { if (pending[id]) { delete pending[id]; rej(Object.assign(new Error("timeout"), { code: "timeout", detail: "TIMEOUT-JS" })); } }, 150000); });
    return webAsk(prov, sys, msgs);
  }
  // ---- Gemini: parsowanie odpowiedzi (czysta funkcja — testowana na przykładowych JSON-ach) ----
  // zwraca { code: "ok"|"auth"|"quota"|"region"|"model"|"think"|"retry"|"empty"|"blocked"|"other", text, detail }
  function parseGemini(status, body, key) {
    const hide = (t) => { t = String(t || ""); if (key) t = t.split(key).join("***"); return t.replace(/\s+/g, " ").trim().slice(0, 120); };
    let j = null; try { j = JSON.parse(body); } catch (e) { /* nie JSON */ }
    if (status < 200 || status >= 300) {
      const er = (j && j.error) || {}, st = String(er.status || ""), msg = String(er.message || "");
      const reason = ((er.details || []).map((d) => d && d.reason).filter(Boolean)[0]) || "";
      const tag = "HTTP " + status + (reason ? " · " + reason : st ? " · " + st : "");
      const all = (st + " " + reason + " " + msg).toLowerCase();
      if (status === 429 || /resource_exhausted|quota/.test(all)) return { code: "quota", detail: tag };
      if (/api_key_invalid|api key not valid|api key expired|unauthenticated|api_key_service_blocked|access_token_type_unsupported|api key.*(invalid|not found)/.test(all) || status === 401) return { code: "auth", detail: tag };
      if (/failed_precondition|location is not supported|free tier is not available|user location/.test(all)) return { code: "region", detail: tag };
      if (status === 403 || /permission_denied/.test(all)) return { code: "auth", detail: tag };
      if (/thinking/.test(all)) return { code: "think", detail: tag };
      if (status === 404 || /not_found|is not found|not supported for generatecontent/.test(all)) return { code: "model", detail: tag };
      if (status >= 500 || /unavailable|internal|deadline_exceeded|overloaded/.test(all)) return { code: "retry", detail: tag };
      return { code: "retry", detail: tag + (msg ? " · " + hide(msg) : "") };
    }
    if (!j) return { code: "retry", detail: "HTTP " + status + " · odpowiedź nie jest JSON" };
    const br = j.promptFeedback && j.promptFeedback.blockReason;
    if (br) return { code: "blocked", detail: String(br) };
    const c = (j.candidates || [])[0];
    if (!c) return { code: "empty", detail: "brak kandydatów" };
    const parts = (c.content && c.content.parts) || [];
    const text = parts.filter((x) => x && !x.thought && typeof x.text === "string").map((x) => x.text).join("").trim();
    if (text) return { code: "ok", text };
    const fr = String(c.finishReason || "");
    if (/SAFETY|RECITATION|PROHIBITED|BLOCKLIST|SPII/.test(fr)) return { code: "blocked", detail: fr };
    return { code: "empty", detail: fr || "pusta odpowiedź" };
  }
  const geminiBody = (model, sys, msgs, think) => {
    const gc = { maxOutputTokens: 2048 };
    if (think) { if (/^gemini-3/.test(model)) gc.thinkingConfig = { thinkingLevel: "low" }; else if (/^gemini-2\.5/.test(model)) gc.thinkingConfig = { thinkingBudget: 0 }; }
    return JSON.stringify({ systemInstruction: { parts: [{ text: sys }] }, contents: msgs.map((m) => ({ role: m.r === "user" ? "user" : "model", parts: [{ text: m.t }] })), generationConfig: gc });
  };
  // jedna próba modelu Gemini: najpierw nagłówek x-goog-api-key, potem ?key=, a dla kluczy „AQ.” na końcu Authorization: Bearer
  async function geminiOne(model, key, sys, msgs) {
    const base = "https://generativelanguage.googleapis.com/v1beta/models/" + encodeURIComponent(model) + ":generateContent";
    const methods = ["hdr", "qs"].concat(/^AQ\./.test(key) ? ["bearer"] : []);
    let lastAuth = null;
    for (const m of methods) {
      for (const think of [true, false]) {
        const headers = { "Content-Type": "application/json" }; let url = base;
        if (m === "hdr") headers["x-goog-api-key"] = key; else if (m === "qs") url += "?key=" + encodeURIComponent(key); else headers.Authorization = "Bearer " + key;
        const r = await tfetch(url, { method: "POST", headers, body: geminiBody(model, sys, msgs, think) });
        const out = parseGemini(r.status, await r.text(), key);
        if (out.code === "think" && think) continue;
        if (out.code === "auth") { lastAuth = out; break; }
        return out;
      }
    }
    return lastAuth || { code: "other", detail: "brak odpowiedzi" };
  }
  async function webAsk(prov, sys, msgs) {
    const key = normKey(localStorage.getItem(wkey(prov))); let last = { code: "other", detail: "" };
    for (const model of modelsFor(prov)) {
      try {
        if (prov === "gemini") {
          const out = await geminiOne(model, key, sys, msgs);
          if (out.code === "ok") return out.text;
          if (["model", "retry", "empty", "think"].includes(out.code)) { last = out; continue; }
          throw Object.assign(new Error(out.code), { code: out.code, detail: out.detail || "" });
        }
        const url = prov === "grok" ? "https://api.x.ai/v1/chat/completions" : "https://api.openai.com/v1/chat/completions";
        const init = { method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer " + key }, body: JSON.stringify({ model, messages: [{ role: "system", content: sys }].concat(msgs.map((m) => ({ role: m.r === "user" ? "user" : "assistant", content: m.t }))), max_completion_tokens: 800 }) };
        const r = await tfetch(url, init), tag = "HTTP " + r.status;
        if (r.status === 401 || r.status === 403) throw Object.assign(new Error("auth"), { code: "auth", detail: tag });
        if (r.status === 429 || r.status === 402) throw Object.assign(new Error("quota"), { code: "quota", detail: tag });
        if (r.status === 404 || r.status === 400) { let tx = ""; try { tx = await r.text(); } catch (e2) { /* brak */ } if (/incorrect api key|invalid[^"]{0,20}key/i.test(tx)) throw Object.assign(new Error("auth"), { code: "auth", detail: tag }); last = { code: "model", detail: tag }; continue; }
        if (!r.ok) { last = { code: "other", detail: tag }; continue; }
        const j = await r.json(); const t = (((j.choices || [])[0] || {}).message || {}).content;
        if (t && String(t).trim()) return String(t).trim();
        last = { code: "empty", detail: "pusta odpowiedź" };
      } catch (e) { if (e.code) throw e; throw netErr(e); }
    }
    throw Object.assign(new Error(last.code === "model" ? "model" : "other"), { code: last.code === "model" ? "model" : last.code === "empty" ? "empty" : "other", detail: last.detail || "" });
  }
  async function validate(prov) {
    try { const t = await ask("Jesteś testem połączenia. Odpowiedz jednym słowem: OK.", [{ r: "user", t: "Test połączenia. Odpowiedz: OK" }], prov); return { ok: true, text: t.slice(0, 40) }; }
    catch (e) { return { ok: false, code: e.code || "other", detail: e.detail || "", text: errText(e.code || "other", e.detail) }; }
  }
  window.TWAI = {
    PROV, ORDER, cfg: () => cfg, ERR_TXT, hasKey, setKey, clearKey, readClipboard, ask, validate, onNative, modelsFor, keyLooksOk, normKey, errText, _parseGemini: parseGemini,
    enabled: () => cfg.on !== false && hasKey(),
    setProv: (p) => { if (PROV[p]) { cfg.prov = p; save(); } }, setOn: (v) => { cfg.on = !!v; save(); }, setModel: (p, m) => { cfg.model[p] = String(m || "").trim(); save(); },
  };
})();
