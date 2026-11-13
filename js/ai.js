/* ApexFit — czat AI (v1.3.5): Gemini (domyślnie, darmowy plan), Grok (xAI), ChatGPT (OpenAI).
   W aplikacji na Androida zapytania i klucze obsługuje kod natywny (klucz szyfrowany w pamięci prywatnej, nigdy nie trafia do JS ani do logów).
   W przeglądarce (testy/podgląd) klucz trzymany jest w localStorage, a zapytania idą przez fetch. ?stubai=1 — atrapa odpowiedzi do testów. */
"use strict";
(function () {
  const CFG_KEY = "tw-ai";
  const PROV = {
    gemini: { label: "Gemini (Google)", short: "Gemini", models: ["gemini-3.5-flash-lite", "gemini-3.1-flash-lite", "gemini-3.8-flash", "gemini-3.6-flash"], keyUrl: "https://aistudio.google.com/app/apikey", note: "Darmowy plan Google (bez karty). Google może używać rozmów z darmowego planu do ulepszania modeli — nie podawaj prywatnych danych." },
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
  // v1.3.9: najpierw model wybrany ręcznie, potem ostatnio działający (zapamiętany), potem reszta — przy udanej odpowiedzi nie ma łańcucha prób
  const modelsFor = (p) => { const m = (cfg.model[p] || "").trim(), g = (cfg.good && cfg.good[p]) || ""; const d = PROV[p].models; const first = m || (d.indexOf(g) >= 0 ? g : ""); return first ? [first].concat(d.filter((x) => x !== first)) : d.slice(); };
  const remember = (p, model, method) => { cfg.good = cfg.good || {}; if (cfg.good[p] !== model || (method && cfg.gm !== method)) { cfg.good[p] = model; if (method) cfg.gm = method; save(); } };
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
  async function tfetch(url, init, ms) {
    const ac = typeof AbortController === "function" ? new AbortController() : null; const t = ac ? setTimeout(() => ac.abort(), ms || 60000) : 0;
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
  function onNativeDelta(id, text) { const r = pending[id]; if (r && r.delta) { try { r.delta(String(text || "")); } catch (e) { /* UI */ } } }
  function onNative(id, code, text) { const r = pending[id]; if (!r) return; delete pending[id]; if (code === "ok") r.res(String(text || "")); else r.rej(Object.assign(new Error(code), { code, detail: String(text || "") })); }
  // msgs: [{r:"user"|"model", t:"…"}]; zwraca Promise<string>
  function ask(sys, msgs, prov, onDelta) {
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
    if (b && b.aiAsk) return new Promise((res, rej) => { const id = "r" + (++rid); pending[id] = { res, rej, delta: onDelta }; try { (b.aiAskStream && onDelta ? b.aiAskStream : b.aiAsk).call(b, id, prov, modelsFor(prov).join(","), sys, JSON.stringify(msgs)); } catch (e) { delete pending[id]; rej(Object.assign(e, { code: "other" })); } setTimeout(() => { if (pending[id]) { delete pending[id]; rej(Object.assign(new Error("timeout"), { code: "timeout", detail: "TIMEOUT-JS" })); } }, 70000); });
    return webAsk(prov, sys, msgs, onDelta);
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
  // v1.3.9: najniższy poziom myślenia, jaki dany model przyjmuje (zmierzone na żywym API: 3.8/3.7 nie akceptują „minimal”; 3.1-lite domyślnie nie myśli)
  const thinkLevel = (model) => /^gemini-3\.1-flash-lite/.test(model) ? null : /^gemini-3\.(5-flash-lite|6-flash)/.test(model) ? "minimal" : /^gemini-3/.test(model) ? "low" : null;
  const geminiBody = (model, sys, msgs, think, search) => {
    const gc = { maxOutputTokens: 2048 };
    if (think) { const lv = thinkLevel(model); if (lv) gc.thinkingConfig = { thinkingLevel: lv }; else if (/^gemini-2\.5/.test(model)) gc.thinkingConfig = { thinkingBudget: 0 }; }
    const body = { systemInstruction: { parts: [{ text: sys }] }, contents: msgs.map((m) => ({ role: m.r === "user" ? "user" : "model", parts: [{ text: m.t }] })), generationConfig: gc };
    if (search) body.tools = [{ google_search: {} }]; // v1.3.9: wyszukiwanie Google (aktualne informacje) — wg dokumentacji tylko płatny klucz
    return JSON.stringify(body);
  };
  // jedna próba modelu Gemini: najpierw nagłówek x-goog-api-key, potem ?key=, a dla kluczy „AQ.” na końcu Authorization: Bearer
  async function geminiOne(model, key, sys, msgs, search) {
    const base = "https://generativelanguage.googleapis.com/v1beta/models/" + encodeURIComponent(model) + ":generateContent";
    const methods = ["hdr", "qs"].concat(/^AQ\./.test(key) ? ["bearer"] : []);
    let lastAuth = null;
    for (const m of methods) {
      for (const think of [true, false]) {
        const headers = { "Content-Type": "application/json" }; let url = base;
        if (m === "hdr") headers["x-goog-api-key"] = key; else if (m === "qs") url += "?key=" + encodeURIComponent(key); else headers.Authorization = "Bearer " + key;
        const r = await tfetch(url, { method: "POST", headers, body: geminiBody(model, sys, msgs, think, search) });
        const out = parseGemini(r.status, await r.text(), key);
        if (out.code === "think" && think) continue;
        if (out.code === "auth") { lastAuth = out; break; }
        return out;
      }
    }
    return lastAuth || { code: "other", detail: "brak odpowiedzi" };
  }

  // ---- v1.3.9: streamGenerateContent (SSE) — tekst pojawia się na bieżąco; kolejny model dopiero, gdy pierwszy nie zacznie odpowiadać ----
  const T_FIRST = 10000, T_IDLE = 15000;
  async function geminiStream(model, key, sys, msgs, onDelta, search) {
    const base = "https://generativelanguage.googleapis.com/v1beta/models/" + encodeURIComponent(model) + ":streamGenerateContent?alt=sse";
    let methods = ["hdr", "qs"].concat(/^AQ\./.test(key) ? ["bearer"] : []);
    if (cfg.gm && methods.indexOf(cfg.gm) > 0) methods = [cfg.gm].concat(methods.filter((x) => x !== cfg.gm));
    let lastAuth = null;
    for (const m of methods) {
      for (const think of [true, false]) {
        const headers = { "Content-Type": "application/json" }; let url = base;
        if (m === "hdr") headers["x-goog-api-key"] = key; else if (m === "qs") url += "&key=" + encodeURIComponent(key); else headers.Authorization = "Bearer " + key;
        const ac = typeof AbortController === "function" ? new AbortController() : null; let timer = 0, timedOut = false;
        const arm = (ms) => { if (!ac) return; clearTimeout(timer); timer = setTimeout(() => { timedOut = true; ac.abort(); }, ms); };
        let acc = "", fin = "", block = "";
        try {
          arm(T_FIRST);
          const r = await fetch(url, Object.assign({ method: "POST", headers, body: geminiBody(model, sys, msgs, think, search) }, ac ? { signal: ac.signal } : {}));
          if (!r.ok) { clearTimeout(timer); const out = parseGemini(r.status, await r.text(), key); if (out.code === "think" && think) continue; if (out.code === "auth") { lastAuth = out; break; } return out; }
          const eat = (line) => {
            if (line.indexOf("data:") !== 0) return; let j; try { j = JSON.parse(line.slice(5)); } catch (e) { return; }
            if (j.promptFeedback && j.promptFeedback.blockReason) block = String(j.promptFeedback.blockReason);
            const c = (j.candidates || [])[0]; if (!c) return;
            if (c.finishReason) fin = String(c.finishReason);
            ((c.content && c.content.parts) || []).forEach((x) => { if (x && !x.thought && typeof x.text === "string") acc += x.text; });
            if (onDelta && acc) { try { onDelta(acc); } catch (e) { /* UI */ } }
          };
          if (r.body && r.body.getReader) {
            const rd = r.body.getReader(), dec = new TextDecoder(); let buf = "";
            for (;;) { arm(T_IDLE); const { done, value } = await rd.read(); if (done) break; buf += dec.decode(value, { stream: true }); let i; while ((i = buf.indexOf("\n")) >= 0) { eat(buf.slice(0, i).replace(/\r$/, "")); buf = buf.slice(i + 1); } }
            buf += dec.decode(); if (buf.trim()) eat(buf.trim());
          } else (await r.text()).split("\n").forEach((l) => eat(l.replace(/\r$/, "")));
          clearTimeout(timer);
          if (acc.trim()) return { code: "ok", text: acc.trim(), method: m };
          if (block) return { code: "blocked", detail: block };
          if (/SAFETY|RECITATION|PROHIBITED|BLOCKLIST|SPII/.test(fin)) return { code: "blocked", detail: fin };
          return { code: "empty", detail: fin || "pusta odpowiedź" };
        } catch (e) {
          clearTimeout(timer);
          if (acc.trim()) return { code: "ok", text: acc.trim(), method: m }; // przerwany strumień: pokazujemy to, co już przyszło
          if (timedOut) return { code: "retry", detail: "TIMEOUT " + (T_FIRST / 1000) + " s" };
          throw e;
        }
      }
    }
    return lastAuth || { code: "other", detail: "brak odpowiedzi" };
  }
  async function webAsk(prov, sys, msgs, onDelta) {
    const key = normKey(localStorage.getItem(wkey(prov))); let last = { code: "other", detail: "" };
    for (const model of modelsFor(prov)) {
      try {
        if (prov === "gemini") {
          let out = await geminiStream(model, key, sys, msgs, onDelta, !!cfg.search);
          // darmowy klucz nie obsługuje wyszukiwania Google — wtedy odpowiadamy bez niego (to tylko dodatek, nie podmiana odpowiedzi)
          if (cfg.search && out.code !== "ok" && out.code !== "auth" && out.code !== "net") out = await geminiStream(model, key, sys, msgs, onDelta, false);
          if (out.code === "ok") { remember(prov, model, out.method); return out.text; }
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

  // ================= v1.3.9: obrazy i muzyka (Gemini; obrazy także ChatGPT i Grok) =================
  // Wg dokumentacji (listopad 2026): obrazy — gemini-3.1-flash-image / gemini-3.1-flash-lite-image (generateContent, responseModalities IMAGE),
  // muzyka — lyria-3-clip-preview (30 s) i lyria-3.5 (cała piosenka), obie bez darmowego planu w API. Grok: grok-imagine-image-2.0, ChatGPT: gpt-image-2.5-flare / gpt-image-2.
  const MEDIA_MODELS = {
    image: { gemini: ["gemini-3.1-flash-image", "gemini-3.1-flash-lite-image"], openai: ["gpt-image-2.5-flare", "gpt-image-2"], grok: ["grok-imagine-image-2.0"] },
    music: { gemini: ["lyria-3-clip-preview"], gemini_song: ["lyria-3.5", "lyria-3-pro-preview"] },
  };
  const MEDIA_ERR = {
    quota: { image: "Generowanie obrazów wymaga płatnego klucza (konta z rozliczeniami) albo limit został wyczerpany — darmowy plan Gemini tego nie obejmuje.", music: "Generowanie muzyki (Lyria) wymaga płatnego klucza Gemini (konta z rozliczeniami) albo limit został wyczerpany — darmowy plan tego nie obejmuje." },
    model: { image: "Model do generowania obrazów jest niedostępny dla tego klucza lub w Twoim regionie.", music: "Model muzyczny Lyria jest niedostępny dla tego klucza lub w Twoim regionie." },
    blocked: { image: "Usługa zablokowała ten obraz (filtr bezpieczeństwa). Spróbuj opisać coś innego.", music: "Usługa zablokowała tę muzykę (filtr bezpieczeństwa lub prawa autorskie). Spróbuj opisać coś innego." },
    nomedia: { image: "Usługa nie zwróciła obrazu.", music: "Usługa nie zwróciła muzyki." },
    unsupported: { image: "Ten dostawca nie generuje obrazów.", music: "Muzykę generuje tylko Gemini — wybierz Gemini w Ustawieniach i użyj klucza Google AI Studio z rozliczeniami." },
  };
  function mediaErrText(kind, code, detail) {
    const m = MEDIA_ERR[code] && MEDIA_ERR[code][kind];
    return m ? m + (detail ? " [" + detail + "]" : "") : errText(code, detail);
  }
  function parseGeminiMedia(status, body, key, kind) {
    if (status < 200 || status >= 300) return parseGemini(status, body, key);
    let j; try { j = JSON.parse(body); } catch (e) { return { code: "retry", detail: "HTTP " + status + " · odpowiedź nie jest JSON" }; }
    const br = j.promptFeedback && j.promptFeedback.blockReason; if (br) return { code: "blocked", detail: String(br) };
    const c = (j.candidates || [])[0]; if (!c) return { code: "empty", detail: "brak kandydatów" };
    const parts = (c.content && c.content.parts) || [], want = kind === "music" ? /^audio\//i : /^image\//i;
    let media = null, text = [];
    parts.forEach((x) => {
      const d = x && (x.inlineData || x.inline_data);
      if (d && d.data && want.test(d.mimeType || d.mime_type || "") && !x.thought && !media) media = { mime: d.mimeType || d.mime_type, b64: d.data };
      else if (x && typeof x.text === "string" && !x.thought) text.push(x.text);
    });
    const t = text.join("").trim();
    if (media) return { code: "ok", mime: media.mime, b64: media.b64, text: t };
    const fr = String(c.finishReason || "");
    if (/SAFETY|RECITATION|PROHIBITED|BLOCKLIST|SPII|IMAGE_OTHER/.test(fr)) return { code: "blocked", detail: fr };
    if (t) return { code: "nomedia", detail: "", text: t };
    return { code: "empty", detail: fr || "pusta odpowiedź" };
  }
  function mediaBody(kind, prompt) {
    const gc = kind === "music" ? { responseModalities: ["AUDIO", "TEXT"] } : { responseModalities: ["TEXT", "IMAGE"], imageConfig: { aspectRatio: "1:1" } };
    return JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: gc });
  }
  async function geminiMedia(kind, prompt, key, song) {
    const list = kind === "music" ? MEDIA_MODELS.music[song ? "gemini_song" : "gemini"] : MEDIA_MODELS.image.gemini;
    let last = { code: "other", detail: "" };
    for (const model of list) {
      const base = "https://generativelanguage.googleapis.com/v1beta/models/" + encodeURIComponent(model) + ":generateContent";
      let res = null;
      for (const m of ["hdr", "qs"].concat(/^AQ\./.test(key) ? ["bearer"] : [])) {
        const headers = { "Content-Type": "application/json" }; let url = base;
        if (m === "hdr") headers["x-goog-api-key"] = key; else if (m === "qs") url += "?key=" + encodeURIComponent(key); else headers.Authorization = "Bearer " + key;
        const r = await tfetch(url, { method: "POST", headers, body: mediaBody(kind, prompt) }, 180000);
        res = parseGeminiMedia(r.status, await r.text(), key, kind);
        if (res.code !== "auth") break;
      }
      if (res.code === "ok" || res.code === "nomedia") return res;
      last = res;
      if (!["model", "retry", "empty"].includes(res.code)) break; // quota/auth/region/blocked — kolejny model nic nie zmieni
    }
    return last;
  }
  async function compatImage(prov, prompt, key) {
    const url = prov === "grok" ? "https://api.x.ai/v1/images/generations" : "https://api.openai.com/v1/images/generations";
    let last = { code: "other", detail: "" };
    for (const model of MEDIA_MODELS.image[prov]) {
      const body = prov === "grok" ? { model, prompt, response_format: "b64_json" } : { model, prompt, size: "1024x1024" };
      const r = await tfetch(url, { method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer " + key }, body: JSON.stringify(body) }, 180000);
      const tag = "HTTP " + r.status; let tx = ""; try { tx = await r.text(); } catch (e) { /* brak */ }
      if (r.ok) { try { const j = JSON.parse(tx), d = (j.data || [])[0] || {}; if (d.b64_json) return { code: "ok", mime: "image/" + (prov === "grok" ? "jpeg" : "png"), b64: d.b64_json, text: "" }; } catch (e) { /* niżej */ } last = { code: "empty", detail: tag + " · brak obrazu" }; continue; }
      if (r.status === 401) return { code: "auth", detail: tag };
      if (r.status === 429 || r.status === 402 || /billing|quota|insufficient|credit/i.test(tx)) return { code: "quota", detail: tag };
      if (/safety|moderation|content[_ ]policy|blocked/i.test(tx)) return { code: "blocked", detail: tag };
      if (r.status === 403) return { code: "auth", detail: tag };
      last = { code: r.status === 404 || r.status === 400 ? "model" : "retry", detail: tag };
    }
    return last;
  }
  // kind: "image" | "music"; zwraca Promise<{mime,b64,text}> albo odrzuca z {code, detail}
  async function media(kind, prompt, prov, song) {
    prov = prov || cfg.prov;
    if (kind === "music" && prov !== "gemini") throw Object.assign(new Error("unsupported"), { code: "unsupported", detail: "" });
    if (!hasKey(prov)) throw Object.assign(new Error("nokey"), { code: "nokey" });
    const b = NB();
    if (b && b.aiMedia) {
      return new Promise((res, rej) => {
        const id = "m" + (++rid); pending[id] = { res, rej, media: true };
        try { b.aiMedia(id, kind, prov, String(prompt), !!song); } catch (e) { delete pending[id]; rej(Object.assign(new Error("other"), { code: "other", detail: "IO: " + String((e && e.name) || "Error") })); return; }
        setTimeout(() => { if (pending[id]) { delete pending[id]; rej(Object.assign(new Error("timeout"), { code: "timeout", detail: "TIMEOUT-JS" })); } }, 240000);
      });
    }
    const key = normKey(localStorage.getItem(wkey(prov)));
    let out;
    try { out = prov === "gemini" ? await geminiMedia(kind, prompt, key, song) : await compatImage(prov, prompt, key); } catch (e) { if (e.code) throw e; throw netErr(e); }
    if (out.code === "ok" || out.code === "nomedia") return out;
    throw Object.assign(new Error(out.code), { code: out.code, detail: out.detail || "" });
  }
  function onNativeMedia(id, code, payload) {
    const r = pending[id]; if (!r) return; delete pending[id];
    if (code === "ok" || code === "nomedia") { let o = {}; try { o = JSON.parse(payload); } catch (e) { /* brak */ } o.code = code; r.res(o); }
    else r.rej(Object.assign(new Error(code), { code, detail: String(payload || "") }));
  }
  // intencja prośby o obraz / muzykę (po normalizacji bez polskich znaków)
  function mediaIntent(raw) {
    const q = String(raw || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ł/g, "l").replace(/\s+/g, " ").trim();
    const verb = "(narysuj|namaluj|wygeneruj|generuj|stworz|zrob|utworz|przygotuj|pokaz|wyczaruj|zaprojektuj)";
    if (new RegExp("\\b(" + verb.slice(1, -1) + "|napisz|ulozyl|ulozysz)\\b.{0,40}\\b(muzyk|piosenk|melodi|utwor muzyczn|kawalek muzyczn|podklad|jingiel|jingle|beat|soundtrack|nut)").test(q) || /\b(skomponuj|zagraj|zaspiewaj)\b/.test(q)) return { kind: "music", song: /piosenk|zaspiewaj|tekst|refren|zwrotk|cala|pelna|utwor/.test(q) };
    if (new RegExp("\\b" + verb + "\\b.{0,40}\\b(obraz|obrazek|obrazk|zdjec|fotk|foto|grafik|rysun|ilustracj|plakat|logo|portret|wizualizacj|tapet|avatar|ikon|mem)").test(q) || /^(narysuj|namaluj)\b/.test(q)) return { kind: "image" };
    return null;
  }

  // ================= v1.3.9: oryginalne głosy trenerów online (Gemini TTS) =================
  // gemini-3.8-flash-tts (zapas: gemini-3.8-flash-lite-tts), generateContent, responseModalities AUDIO, speechConfig.voiceConfig.voice, styl w speechMetadata.style; odpowiedź: WAV 24 kHz mono (base64).
  const TTS_VOICES = {
    rico: ["Orus", "deep, confident, warm and motivating male gym coach; steady, strong delivery"],
    pitbull: ["Algenib", "gruff, low, tough-but-kind male coach with a slightly raspy voice; calm and slow"],
    zajac: ["Fenrir", "very energetic, fast, cheerful and excitable young male; bubbly and quick"],
    atena: ["Despina", "calm, composed, elegant and smooth female; measured, graceful pace"],
    lapka: ["Zephyr", "bright, playful and upbeat young female; light, smiling, a bit teasing"],
    marta: ["Gacrux", "warm, mature, caring female, like a kind older sister or mother; soft and reassuring"],
    oliwka: ["Leda", "cheerful, youthful, child-like upbeat girl; sweet, excited and sparkling"],
  };
  const TTS_MODELS = ["gemini-3.8-flash-tts", "gemini-3.8-flash-lite-tts"];
  function pcmWav(b64, rate) {
    const bin = atob(b64), n = bin.length, u = new Uint8Array(44 + n), dv = new DataView(u.buffer);
    const w = (o, t) => { for (let i = 0; i < t.length; i++) u[o + i] = t.charCodeAt(i); };
    w(0, "RIFF"); dv.setUint32(4, 36 + n, true); w(8, "WAVEfmt "); dv.setUint32(16, 16, true); dv.setUint16(20, 1, true); dv.setUint16(22, 1, true); dv.setUint32(24, rate, true); dv.setUint32(28, rate * 2, true); dv.setUint16(32, 2, true); dv.setUint16(34, 16, true); w(36, "data"); dv.setUint32(40, n, true);
    for (let i = 0; i < n; i++) u[44 + i] = bin.charCodeAt(i);
    let o = ""; for (let i = 0; i < u.length; i += 8192) o += String.fromCharCode.apply(null, u.subarray(i, i + 8192)); return btoa(o);
  }
  function ttsBody(text, who) {
    const v = TTS_VOICES[who] || TTS_VOICES.rico;
    return JSON.stringify({ contents: [{ role: "user", parts: [{ text, speechMetadata: { style: v[1] } }] }], generationConfig: { responseModalities: ["AUDIO"], speechConfig: { voiceConfig: { voice: v[0] }, languageCode: "pl-PL" } } });
  }
  function parseTts(status, body, key) {
    if (status < 200 || status >= 300) return parseGemini(status, body, key);
    let j; try { j = JSON.parse(body); } catch (e) { return { code: "retry", detail: "HTTP " + status + " · odpowiedź nie jest JSON" }; }
    const c = (j.candidates || [])[0]; if (!c) return { code: "empty", detail: "brak kandydatów" };
    for (const x of ((c.content && c.content.parts) || [])) {
      const d = x && (x.inlineData || x.inline_data); if (!d || !d.data) continue;
      const mt = String(d.mimeType || d.mime_type || "");
      if (/^audio\//i.test(mt)) { const m = /rate=(\d+)/.exec(mt); return /wav|wave/i.test(mt) ? { code: "ok", mime: "audio/wav", b64: d.data } : { code: "ok", mime: "audio/wav", b64: pcmWav(d.data, m ? +m[1] : 24000) }; }
    }
    return { code: "empty", detail: String(c.finishReason || "brak audio") };
  }
  async function geminiTts(text, who, key) {
    let last = { code: "other", detail: "" };
    for (const model of TTS_MODELS) {
      const base = "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent"; let res = null;
      for (const m of ["hdr", "qs"].concat(/^AQ\./.test(key) ? ["bearer"] : [])) {
        const headers = { "Content-Type": "application/json" }; let url = base;
        if (m === "hdr") headers["x-goog-api-key"] = key; else if (m === "qs") url += "?key=" + encodeURIComponent(key); else headers.Authorization = "Bearer " + key;
        const r = await tfetch(url, { method: "POST", headers, body: ttsBody(text, who) }, 45000);
        res = parseTts(r.status, await r.text(), key);
        if (res.code !== "auth") break;
      }
      if (res.code === "ok") return res;
      last = res;
      if (!["quota", "model", "retry", "empty"].includes(res.code)) break; // auth/region/blocked: drugi model nic nie zmieni
    }
    return last;
  }
  const ttsMem = new Map();
  // zwraca Promise<{mime,b64}> albo odrzuca {code, detail}; pamięć podręczna na tekst+trenera (pamięć + Cache API w przeglądarce, plik w aplikacji Androida)
  async function tts(text, who) {
    text = String(text || "").trim().slice(0, 700); who = TTS_VOICES[who] ? who : "rico";
    if (!text) throw Object.assign(new Error("empty"), { code: "empty", detail: "" });
    if (!hasKey("gemini")) throw Object.assign(new Error("nokey"), { code: "nokey", detail: "" });
    const ck = who + "|" + text; if (ttsMem.has(ck)) return ttsMem.get(ck);
    const b = NB(); let out;
    if (b && b.aiTts) {
      out = await new Promise((res, rej) => {
        const id = "t" + (++rid); pending[id] = { res, rej, tts: true };
        try { b.aiTts(id, text, who); } catch (e) { delete pending[id]; rej(Object.assign(new Error("other"), { code: "other", detail: "IO: " + String((e && e.name) || "Error") })); return; }
        setTimeout(() => { if (pending[id]) { delete pending[id]; rej(Object.assign(new Error("timeout"), { code: "timeout", detail: "TIMEOUT-JS" })); } }, 90000);
      });
    } else {
      const key = normKey(localStorage.getItem(wkey("gemini")));
      let cache = null, req = null;
      try { if (window.caches) { cache = await caches.open("tw-tts-v1"); req = new Request("/__tts/" + who + "/" + encodeURIComponent(text)); const hit = await cache.match(req); if (hit) { out = await hit.json(); } } } catch (e) { cache = null; }
      if (!out) {
        let r; try { r = await geminiTts(text, who, key); } catch (e) { throw e.code ? e : netErr(e); }
        if (r.code !== "ok") throw Object.assign(new Error(r.code), { code: r.code, detail: r.detail || "" });
        out = { mime: r.mime, b64: r.b64 };
        try { if (cache) await cache.put(req, new Response(JSON.stringify(out), { headers: { "Content-Type": "application/json" } })); } catch (e) { /* brak miejsca */ }
      }
    }
    if (ttsMem.size > 12) ttsMem.delete(ttsMem.keys().next().value);
    ttsMem.set(ck, out); return out;
  }
  function onNativeTts(id, code, payload) {
    const r = pending[id]; if (!r) return; delete pending[id];
    if (code === "ok") r.res({ mime: "audio/wav", b64: String(payload || "") }); else r.rej(Object.assign(new Error(code), { code, detail: String(payload || "") }));
  }
  window.TWAI = {
    PROV, ORDER, cfg: () => cfg, ERR_TXT, hasKey, setKey, clearKey, readClipboard, ask, validate, onNative, onNativeDelta, onNativeMedia, tts, onNativeTts, TTS_VOICES, _parseTts: parseTts, media, mediaIntent, mediaErrText, MEDIA_MODELS, _parseGeminiMedia: parseGeminiMedia, setSearch: (v) => { cfg.search = !!v; save(); const b = NB(); try { if (b && b.aiSetSearch) b.aiSetSearch(!!v); } catch (e) { /* brak */ } }, search: () => !!cfg.search, modelsFor, keyLooksOk, normKey, errText, _parseGemini: parseGemini,
    enabled: () => cfg.on !== false && hasKey(),
    setProv: (p) => { if (PROV[p]) { cfg.prov = p; save(); } }, setOn: (v) => { cfg.on = !!v; save(); }, setModel: (p, m) => { cfg.model[p] = String(m || "").trim(); save(); },
  };
})();
