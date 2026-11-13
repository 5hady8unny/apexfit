/* Trening w domu — logika aplikacji (vanilla JS, bez zależności). Nawigacja ekranowa na hashach. */
"use strict";
(function () {
  const WEEKS = [1, 2, 3, 4];
  const TABS = ["dzis", "trening", "cwiczenia", "zywienie", "ustawienia"];
  const STORE_KEY = "trening-w-domu:v1", LOG_KEY = "trening-w-domu:log", WK_KEY = "trening-w-domu:sesja";
  const PROF_DEF = { m: { goal: "masa", weight: "80", kf: "34", pf: "2.0" }, k: { goal: "k_odch", weight: "62", kf: "25", pf: "2.0" } };
  const defaults = { week: 1, day: todayIndex(), weight: "80", kf: "34", pf: "2.0", nWeek: 1, nDay: todayIndex(), nTab: "menu", goal: "masa", grp: "wszystko", onlyAv: false, bought: {},
    sex: "m", style: "klas", loc: "dom", equip: Object.assign({}, HOME_DEFAULT), level: 1, prof: {}, kcalMode: { m: "auto", k: "auto" }, kcalManual: {} };
  let S = Object.assign({}, defaults, load(STORE_KEY));
  S.equip = Object.assign({}, HOME_DEFAULT, S.equip || {});
  if (!["m", "k"].includes(S.sex)) S.sex = "m";
  if (!["klas", "kal"].includes(S.style)) S.style = "klas";
  if (!["dom", "silownia"].includes(S.loc)) S.loc = "dom";
  if (![1, 2, 3].includes(S.level)) S.level = 1;
  if (!(S.day >= 0 && S.day < 7)) S.day = todayIndex();
  S.kcalMode = Object.assign({ m: "auto", k: "auto" }, S.kcalMode || {});
  S.kcalManual = Object.assign({}, S.kcalManual || {});
  const LOG = Object.assign({ ex: {}, sessions: [] }, load(LOG_KEY));
  { const qx = new URLSearchParams(location.search).get("sex"); if (qx === "k" || qx === "m") { S.sex = qx; Object.assign(S, PROF_DEF[qx]); } } // tylko do testów podglądu

  function load(k) { try { return JSON.parse(localStorage.getItem(k)) || {}; } catch (e) { return {}; } }
  function save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(S)); } catch (e) { /* tryb prywatny */ } }
  function saveLog() { try { localStorage.setItem(LOG_KEY, JSON.stringify(LOG)); } catch (e) { /* pełna pamięć */ } }
  function todayIndex() { return (new Date().getDay() + 6) % 7; }
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const $app = document.getElementById("app");
  const buzz = (ms) => { try { if (navigator.vibrate) navigator.vibrate(ms || 12); } catch (e) { /* brak */ } };

  // ---------- ikony ----------
  const sv = (d, extra) => `<svg viewBox="0 0 24 24" aria-hidden="true" ${extra || ""}>${d}</svg>`;
  const I = {
    back: sv('<path d="M15 5l-7 7 7 7"/>'), close: sv('<path d="M6 6l12 12M18 6L6 18"/>'), chev: sv('<path d="M9 5l7 7-7 7"/>'),
    play: sv('<path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none"/>'), check: sv('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
    prev: sv('<path d="M15 5l-7 7 7 7"/>'), next: sv('<path d="M9 5l7 7-7 7"/>'), search: sv('<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>'),
    timer: sv('<circle cx="12" cy="13" r="7.5"/><path d="M12 9.5V13l2.5 2M9.5 2.5h5"/>'), fire: sv('<path d="M12 21c-3.9 0-7-2.8-7-6.6 0-3.1 2.2-5 3.6-7.4.4 1.8 1.4 2.9 2.4 3.4C11 6.6 12.6 4 15 2.5c-.2 3 1.6 4.6 2.8 6.3 1 1.4 1.2 2.6 1.2 3.9 0 4.6-3.1 8.3-7 8.3z"/>'),
    list: sv('<path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01"/>'), cart: sv('<path d="M3 4h2.5l2.2 11h10.6L20.5 7H7"/><circle cx="9.5" cy="19.5" r="1.3"/><circle cx="17" cy="19.5" r="1.3"/>'),
    book: sv('<path d="M5 4.5A1.5 1.5 0 016.5 3H19v15H6.5A1.5 1.5 0 005 19.5zM5 19.5A1.5 1.5 0 006.5 21H19"/>'), calc: sv('<rect x="5" y="3" width="14" height="18" rx="2.5"/><path d="M8.5 7.5h7M8.5 12h.01M12 12h.01M15.5 12h.01M8.5 16h.01M12 16h.01M15.5 16h.01"/>'),
    chart: sv('<path d="M4 20V10M10 20V4M16 20v-7M21 20H3"/>'), cal: sv('<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/>'),
    heart: sv('<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0112 7.2a4.3 4.3 0 017.5 2.6C19.5 15.4 12 20 12 20z"/>'), user: sv('<circle cx="12" cy="8" r="4"/><path d="M4.5 20.5c1.2-3.8 4-5.5 7.5-5.5s6.3 1.7 7.5 5.5"/>'),
    target: sv('<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r=".8" fill="currentColor"/>'), home: sv('<path d="M4 11l8-6.5 8 6.5V20H4z"/><path d="M10 20v-5h4v5"/>'),
    dumbbell: sv('<path d="M3 10v4M6 7v10M18 7v10M21 10v4M6 12h12"/>'), shield: sv('<path d="M12 3l7.5 3v5.5c0 4.5-3.2 8-7.5 9.5-4.3-1.5-7.5-5-7.5-9.5V6z"/>'),
    trash: sv('<path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13"/>'), food: sv('<path d="M12 21c-4.5 0-8-3.5-8-8 0-3.5 2.5-6 5-6 1.2 0 2.2.4 3 1 .8-.6 1.8-1 3-1 2.5 0 5 2.5 5 6 0 4.5-3.5 8-8 8z"/><path d="M12 8c0-2.5 1.5-4.5 4-5"/>'),
    moon: sv('<path d="M19.5 14.5A8 8 0 019.5 4.5a8 8 0 1010 10z"/>'), bike: sv('<circle cx="6" cy="16" r="3.5"/><circle cx="18" cy="16" r="3.5"/><path d="M6 16l4-7h5l3 7M10 9l-1.5-3H6"/>'),
  };

  // ---------- Muzyka (Spotify) — tylko otwieramy link; nic nie odtwarzamy w aplikacji ----------
  const SPOTIFY_DEFAULT = "https://open.spotify.com/search/trening";
  // Przyjmuje link https://open.spotify.com/…, spotify.link/…, albo URI spotify:playlist:ID; zwraca link https albo "" gdy niepoprawny
  function spotifyNorm(raw) {
    const v = String(raw || "").trim();
    if (!v) return "";
    let m = v.match(/^spotify:(playlist|album|artist|track|show|episode):([A-Za-z0-9]{10,40})$/);
    if (m) return `https://open.spotify.com/${m[1]}/${m[2]}`;
    m = v.match(/^spotify:user:[^:]+:playlist:([A-Za-z0-9]{10,40})$/);
    if (m) return `https://open.spotify.com/playlist/${m[1]}`;
    m = v.match(/^(?:https?:\/\/)?open\.spotify\.com\/(?:intl-[a-z]{2}(?:-[a-zA-Z]{2})?\/)?(playlist|album|artist|track|show|episode)\/([A-Za-z0-9]{10,40})(?:[/?#].*)?$/);
    if (m) return `https://open.spotify.com/${m[1]}/${m[2]}`;
    m = v.match(/^(?:https?:\/\/)?spotify\.link\/([A-Za-z0-9]{4,40})\/?$/);
    if (m) return `https://spotify.link/${m[1]}`;
    return "";
  }
  const spotifyHref = () => spotifyNorm(S.spotify) || SPOTIFY_DEFAULT;
  const SPOTIFY_ICON = '<svg class="sp-ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#1DB954"/><path d="M10 16.5V8.2l6-1.4v7.7" fill="none" stroke="#06140b" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="8.6" cy="16.6" r="1.9" fill="#06140b"/><circle cx="14.6" cy="14.7" r="1.9" fill="#06140b"/></svg>';
  const spotifyBtn = (cls) => `<a class="spotify-btn ${cls || ""}" href="${esc(spotifyHref())}" target="_blank" rel="noopener" data-spotify aria-label="Muzyka w Spotify">${SPOTIFY_ICON}<span>Muzyka w Spotify</span></a>`;

  // ---------- pomocnicze ----------
  function seg(name, options, value, extraClass) {
    return `<div class="seg ${extraClass || ""}" role="group" data-seg="${name}">` + options.map((o) =>
      `<button type="button" data-val="${esc(o.value)}" aria-pressed="${String(o.value) === String(value)}" class="${o.cls || ""}">${o.label}</button>`).join("") + `</div>`;
  }
  const weekOpts = () => WEEKS.map((x) => ({ value: x, label: `<span class="lw">Tydzień </span><span class="sw">Tydz. </span>${x}` }));
  const dayOpts = () => DAYS.map((x, i) => ({ value: i, label: esc(x.short), cls: i === todayIndex() ? "today" : "" }));
  // Animacje ćwiczeń: zapętlone MP4 (jak GIF) — bez dźwięku, bez kontrolek
  const VIDS = (typeof EXVID !== "undefined") ? EXVID : { m: new Set(), k: new Set() };
  function vidSrc(ex) {
    if (VIDS[S.sex] && VIDS[S.sex].has(ex.id)) return { src: `video/ex/${ex.id}-${S.sex}.mp4`, poster: still(ex, S.sex) };
    if (S.sex === "m" && ex.video) return { src: `video/${ex.video}.mp4`, poster: `img/${ex.video}.jpg` };
    return null;
  }
  const loopVideo = (v, ex, cls) => `<video class="${cls || ""}" autoplay muted loop playsinline disablepictureinpicture preload="metadata" poster="${v.poster}" aria-label="${esc(altOf(ex))}"><source src="${v.src}" type="video/mp4"></video>`;
  const altOf = (ex) => ex.alt || `${ex.name} — ilustracja ćwiczenia`;
  function still(ex, who) { return `img/ex/${ex.id}-${who}.jpg`; }
  function stillSrc(ex) {
    if (S.sex === "k" && IMG.k.has(ex.id)) return still(ex, "k");
    if (IMG.m.has(ex.id)) return still(ex, "m");
    if (ex.video) return `img/${ex.video}.jpg`;
    return still(ex, "k");
  }
  function thumbSrc(ex) {
    if (S.sex === "k" && IMG.k.has(ex.id)) return still(ex, "k");
    if (ex.video) return `img/${ex.video}.jpg`;
    if (IMG.m.has(ex.id)) return still(ex, "m");
    return still(ex, "k");
  }
  // cls: "cover" (miniatury) lub "contain" (pełny ekran — bez przycinania głowy i stóp)
  function media(ex, cls) {
    const v = S.sex === "k" && IMG.k.has(ex.id) && !(VIDS.k && VIDS.k.has(ex.id)) ? null : vidSrc(ex);
    if (v) return loopVideo(v, ex, cls);
    return `<img class="${cls || ""}" src="${stillSrc(ex)}" alt="${esc(altOf(ex))}" width="480" height="848">`;
  }
  const hasMedia = (ex) => S.sex === "k" ? IMG.k.has(ex.id) : (!!ex.video || IMG.m.has(ex.id));
  const ctx = () => ({ sex: S.sex, style: S.style, gym: S.loc === "silownia", have: haveFor(S.loc, S.equip), level: S.level, goal: S.goal });
  const plan = () => { fixGoal(); return buildPlan(ctx()); };
  const SEX_L = { m: "Mężczyźni", k: "Kobiety" }, STYLE_L = { klas: "Klasyczny", kal: "Kalistenika" }, LOC_L = { dom: "Dom", silownia: "Siłownia" };
  function row(label, html) { return `<div class="set-row"><span class="set-label">${label}</span>${html}</div>`; }
  function summary() {
    const eq = S.loc === "dom" ? Object.keys(EQUIP).filter((k) => EQUIP[k].home && S.equip[k]).map((k) => EQUIP[k].n.toLowerCase()) : [];
    return `${SEX_L[S.sex]} · ${STYLE_L[S.style]}${S.style === "kal" ? ` (${LVL[S.level].toLowerCase()})` : ""} · ${LOC_L[S.loc]}${S.loc === "dom" ? `: ${eq.length ? eq.join(", ") : "tylko masa ciała"}` : ""}`;
  }
  function table(cols, rows, hl, numCols) {
    numCols = numCols || [];
    return `<div class="table-wrap"><table><thead><tr>${cols.map((c, i) => `<th${numCols.includes(i) ? ' class="n"' : ""}>${c}</th>`).join("")}</tr></thead><tbody>` +
      rows.map((r, ri) => `<tr${ri === hl ? ' class="hl"' : ""}>${r.map((c, i) => `<td${numCols.includes(i) ? ' class="n"' : ""}>${c}</td>`).join("")}</tr>`).join("") + `</tbody></table></div>`;
  }
  // Ekran z nagłówkiem (strzałka wstecz + tytuł); ekrany główne (zakładki) bez strzałki
  function screen(title, body, o) {
    o = o || {};
    return `<div class="screen ${o.cls || ""}"><header class="top${o.back ? "" : " root"}">${o.back ? `<a class="icon-btn" href="${o.back}" data-back aria-label="Wstecz">${I.back}</a>` : ""}
      <div class="top-t">${o.eyebrow ? `<span class="eyebrow">${o.eyebrow}</span>` : ""}<h1>${title}</h1></div>${o.action || ""}${o.back ? "" : `<span class="top-brand" aria-label="ApexFit">${I.dumbbell}ApexFit</span>`}</header><div class="screen-body">${body}</div></div>`;
  }
  // Lista-menu (wiersze prowadzące do osobnych ekranów)
  const rowLink = (href, icon, title, sub, extra) => `<a class="row" href="${href}"${extra || ""}><span class="ric">${icon}</span><span class="rtx"><b>${title}</b>${sub ? `<small>${sub}</small>` : ""}</span><span class="rchev">${I.chev}</span></a>`;
  const group = (title, rows) => `<section class="group">${title ? `<h2 class="group-t">${title}</h2>` : ""}<div class="rows">${rows}</div></section>`;
  const fmtDate = (t) => new Date(t).toLocaleDateString("pl-PL", { weekday: "short", day: "numeric", month: "short" });
  const fmtTime = (sec) => { sec = Math.max(0, Math.round(sec)); const m = Math.floor(sec / 60), s = sec % 60; return `${m}:${String(s).padStart(2, "0")}`; };
  // ---------- Żywienie ----------
  const G = () => goalOf(S.goal);
  function fixGoal() {
    if (!GOALS[S.goal] || GOALS[S.goal].sex !== S.sex) S.goal = PROF_DEF[S.sex].goal;
    const g = G();
    if (!g.kf.some(([v]) => v === S.kf)) S.kf = g.kfDef;
    if (!g.pf.includes(S.pf)) S.pf = g.pfDef;
  }
  // Ręczne kalorie: zakres 1500–5000 kcal, krok 50, osobno dla mężczyzn i kobiet
  const KCAL_MIN = 1500, KCAL_MAX = 5000, KCAL_STEP = 50;
  const clampKcal = (v) => { const n = Math.round(Number(v) / KCAL_STEP) * KCAL_STEP; return Number.isFinite(n) ? Math.min(KCAL_MAX, Math.max(KCAL_MIN, n)) : null; };
  const isManual = () => S.kcalMode[S.sex] === "manual";
  function kcalTarget() {
    fixGoal();
    const wNum = Number(String(S.weight).replace(",", "."));
    const valid = wNum >= 40 && wNum <= 180;
    const kg = valid ? wNum : Number(PROF_DEF[S.sex].weight);
    const raw = Math.round((kg * Number(S.kf)) / 10) * 10, floor = kcalFloor();
    let kcal = Math.max(raw, floor || 0), floored = !!floor && raw < floor;
    let prot = Math.round(kg * Number(S.pf));
    let fat = Math.round(kg * G().fat);
    const manual = isManual();
    let protCapped = false, fatLowered = false;
    if (manual) {
      kcal = clampKcal(S.kcalManual[S.sex]) || clampKcal(kcal) || KCAL_MIN; floored = false;
      const pCap = Math.floor((kcal * 0.35) / 4); // białko maks. 35% energii
      if (prot > pCap) { prot = pCap; protCapped = true; }
      if (kcal - prot * 4 - fat * 9 < 0) { // za mało energii na węglowodany — obniż tłuszcz, ale nie poniżej 0,6 g/kg
        fat = Math.max(Math.round(kg * 0.6), Math.floor((kcal - prot * 4) / 9)); fatLowered = true;
      }
    }
    const carb = Math.max(0, Math.round((kcal - prot * 4 - fat * 9) / 4));
    // W trybie ręcznym porcje dobierane są przede wszystkim pod kalorie (białko/tłuszcz jako cel pomocniczy)
    return { kg, kcal, prot, fat, carb, valid, floor, floored, raw, manual, protCapped, fatLowered, wt: manual ? [100, 2, 1] : null };
  }
  // Twarde minimum energii: kobiety 1500 kcal (każdy cel), mężczyźni na redukcji 1800 kcal
  function kcalFloor() { return S.sex === "k" ? 1500 : S.goal === "redukcja" ? 1800 : 0; }
  function floorNote() {
    const f = kcalFloor();
    return f ? `<p class="note floor-note" style="margin:12px 0 0"><b>Bezpieczne minimum:</b> plan nigdy nie schodzi poniżej ${f} kcal dziennie — jeśli wynik z mnożnika jest niższy, kalorie, jadłospis i zakupy liczone są dla ${f} kcal.</p>` : "";
  }
  // Wybrane przez użytkownika dania (klucz: cel:tydzień:dzień:posiłek)
  const choiceKey = (w, d, si) => `${S.goal}:${w}:${d}:${si}`;
  function chosenMeals(w, d) {
    S.choice = S.choice || {};
    return mealsFor(S.goal, w, d).map((x, si) => {
      const id = S.choice[choiceKey(w, d, si)], alt = id && dishById(id);
      return alt ? { label: x.label, meal: alt.meal, si, picked: true, def: x.meal } : Object.assign({ si, def: x.meal }, x);
    });
  }
  function altsFor(w, d, si) { // 3–4 alternatywy o podobnych kaloriach + domyślne danie
    const base = mealsFor(S.goal, w, d)[si].meal, bk = macroOf(base.items).k;
    const pool = poolsFor(S.goal)[si].concat(ALT_NEW[si] || []);
    const seen = {}; const uniq = pool.filter((m) => { const k = slug(m.name); if (seen[k] || k === slug(base.name)) return false; seen[k] = 1; return true; });
    uniq.sort((a, b) => Math.abs(macroOf(a.items).k - bk) - Math.abs(macroOf(b.items).k - bk));
    const nw = (ALT_NEW[si] || []).filter((m) => slug(m.name) !== slug(base.name));
    return [base].concat(uniq.filter((m) => !nw.includes(m)).slice(0, 3), nw);
  }
  // Plan dnia z podmienionym daniem (podgląd porcji alternatywy)
  function planWith(w, d, si, meal) {
    const T = kcalTarget(); let meals = chosenMeals(w, d).map((x) => x.si === si ? Object.assign({}, x, { meal }) : x), f = dayFactors(meals, T);
    for (let n = 0; n < (T.manual ? 3 : 2) && T.kcal >= (T.manual ? 2500 : 3500) && (f.P >= 2 || f.C >= 2 || dayKcal(meals, f) < T.kcal * 0.95); n++) {
      meals = meals.concat([{ label: EXTRA_LABEL + ["", " II", " III"][n], meal: EXTRA[(d + w + n * 2) % EXTRA.length], extra: true }]); f = dayFactors(meals, T);
    }
    return { meals, f };
  }
  const dayKcal = (meals, f) => meals.reduce((a, x) => a + macroOf(scaleItems(x.meal.items, f)).k, 0);
  function dayPlan(w, d) { return planWith(w, d, -1, null); }
  function goalPicker() {
    return `<div class="goal-pick" role="radiogroup" aria-label="Wybierz cel">${goalsFor(S.sex).map((k) =>
      `<button type="button" role="radio" data-goal="${k}" aria-checked="${S.goal === k}"><b>${esc(GOALS[k].label)}</b><small>${esc(GOALS[k].short)} · ${GOALS[k].kf[0][0]}–${GOALS[k].kf[GOALS[k].kf.length - 1][0]} kcal/kg</small></button>`).join("")}</div>`;
  }
  function goalSelect() {
    return `<label class="field goal-inline">Wybierz cel<select id="goal-sel">${goalsFor(S.sex).map((k) => `<option value="${k}" ${S.goal === k ? "selected" : ""}>${esc(GOALS[k].label)}</option>`).join("")}</select></label>`;
  }
  const recipeHref = (m, w, d) => `#zywienie/przepis/${slug(m.name)}` + (w != null ? `/${w + 1}/${d}` : "");
  const dayKey = (t) => { const d = new Date(t); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; };
  const emit = (type, x) => { try { window.dispatchEvent(new CustomEvent("tw:event", { detail: Object.assign({ type }, x || {}) })); } catch (e) { /* brak */ } };
  function mealCard(x, f, w, d, eat) {
    const items = scaleItems(x.meal.items, f), m = macroOf(items);
    const ek = eat ? (x.si != null ? x.si : "x" + slug(x.label)) : null, eaten = eat && ((S.eaten || {})[eat] || {})[ek] != null;
    return `<article class="meal"><div class="meal-head"><span class="label">${esc(x.label)}${x.picked ? ' <span class="badge alt">wybrane</span>' : ""}</span><span class="kcal">${Math.round(m.k)} kcal</span></div>
      <h3><a class="recipe-link" href="${recipeHref(x.meal, w, d)}">${esc(x.meal.name)}</a></h3>
      <ul>${items.map(([id, g]) => `<li>${esc(ING[id].n.toLowerCase())} <b>${qty(id, g)}</b></li>`).join("")}</ul>
      <div class="macros">B ${Math.round(m.p)} g · T ${Math.round(m.f)} g · W ${Math.round(m.c)} g</div>
      <div class="meal-act"><a class="meal-more" href="${recipeHref(x.meal, w, d)}">Przepis · ${x.meal.time} min →</a>${x.si != null && w != null ? `<a class="btn-chip" href="#zywienie/zamien/${w + 1}/${d}/${x.si}">Zamień danie</a>` : ""}</div>${eat ? `<label class="eaten-tick"><input type="checkbox" data-eaten="${ek}" data-k="${Math.round(m.k)}" ${eaten ? "checked" : ""}><span>Zjedzone</span></label>` : ""}</article>`;
  }
  function nutritionResults() {
    const t = kcalTarget();
    return `<p>${t.valid ? "" : '<span class="badge alt">Podaj masę 40–180 kg — liczę dla ${PROF_DEF[S.sex].weight} kg</span> '}Dla ${fmt(t.kg)} kg (szacunek; skoryguj po 2 tygodniach obserwacji masy ciała):</p>
      <div class="metrics">
        <div class="metric main"><b>${t.kcal} kcal</b><span>Energia dziennie</span><small>${t.manual ? "ustawione samodzielnie" : t.floored ? `minimum ${t.floor} kcal (z mnożnika ${t.raw})` : `${S.kf} kcal/kg`}</small></div>
        <div class="metric"><b>${t.prot} g</b><span>Białko</span><small>${t.protCapped ? `${fmt(Math.round((t.prot / t.kg) * 10) / 10)} g/kg · maks. 35% kcal` : `${fmt(S.pf)} g/kg`}</small></div>
        <div class="metric"><b>${t.fat} g</b><span>Tłuszcze</span><small>${t.fatLowered ? `obniżone do ${fmt(Math.round((t.fat / t.kg) * 10) / 10)} g/kg` : `${fmt(G().fat)} g/kg`}</small></div>
        <div class="metric"><b>${t.carb} g</b><span>Węglowodany</span><small>reszta energii</small></div>
      </div>${t.manual ? manualNote(t) : floorNote()}`;
  }
  function manualNote(t) {
    const pct = (g, k) => Math.round((g * k * 100) / t.kcal);
    let extra = "";
    if (t.protCapped) extra += " Białko ograniczono do 35% energii.";
    if (t.fatLowered) extra += " Przy tak niskich kaloriach tłuszcze obniżono (minimum 0,6 g/kg), żeby zostało miejsce na węglowodany.";
    if (S.sex === "m" && S.goal === "redukcja" && t.kcal < 1800) extra += " Uwaga: przy redukcji u mężczyzn zalecamy co najmniej 1800 kcal dziennie.";
    if (dayPlan(S.nWeek - 1, S.nDay).meals.some((x) => x.extra)) extra += " Przy wysokich kaloriach do jadłospisu dochodzi dodatkowa przekąska, żeby porcje nie były przesadnie duże.";
    return `<p class="note floor-note" style="margin:12px 0 0"><b>Kalorie ustawione samodzielnie:</b> jadłospis, plan na Dziś, lista zakupów i porcje w przepisach liczone są dla ${t.kcal} kcal dziennie (zakres 1500–5000 kcal; poniżej 1500 kcal nie schodzimy). Białko i tłuszcze wynikają z celu i masy ciała, resztę energii dają węglowodany — podział: B ${pct(t.prot, 4)}% · T ${pct(t.fat, 9)}% · W ${pct(t.carb, 4)}%.${extra} Porcje dobierane są pod kalorie, więc faktyczne makro dnia (suma pod menu) może się nieco różnić — zwykle jest w nim więcej białka.</p>`;
  }
  function kcalControls() {
    const m = isManual(), v = clampKcal(S.kcalManual[S.sex]) || clampKcal(kcalTarget().kcal);
    return `<div class="kcal-mode">${row("Kalorie", seg("kcalMode", [{ value: "auto", label: "Automatycznie (z kalkulatora)" }, { value: "manual", label: "Ustaw samodzielnie" }], m ? "manual" : "auto", "kcalbar"))}
      ${m ? `<div class="kcal-manual"><input id="kcal-range" type="range" min="${KCAL_MIN}" max="${KCAL_MAX}" step="${KCAL_STEP}" value="${v}" aria-label="Kalorie dziennie (suwak)"><div class="kcal-scale"><span>1500</span><span>5000 kcal</span></div>
        <label class="field">Kalorie dziennie (kcal)<input id="kcal-num" type="number" inputmode="numeric" min="${KCAL_MIN}" max="${KCAL_MAX}" step="${KCAL_STEP}" value="${v}"></label></div>` : ""}</div>`;
  }
  function shoppingList(nw) {
    const tot = {};
    for (let dd = 0; dd < 7; dd++) {
      const { meals, f } = dayPlan(nw, dd);
      meals.forEach((x) => scaleItems(x.meal.items, f).forEach(([id, g]) => { tot[id] = (tot[id] || 0) + g; }));
    }
    return SHOP_CATS.map(([cat, label]) => ({
      label, rows: Object.keys(tot).filter((id) => ING[id].cat === cat).sort((a, b) => tot[b] - tot[a]).map((id) => [id, ING[id].n, bulk(id, tot[id])]),
    })).filter((g) => g.rows.length);
  }
  const boughtKey = () => `${S.goal}:${S.nWeek}`;
  function shopView() {
    const kcal = kcalTarget().kcal, bought = S.bought[boughtKey()] || {}, list = shoppingList(S.nWeek - 1);
    const n = list.reduce((a, g) => a + g.rows.length, 0), done = list.reduce((a, g) => a + g.rows.filter(([id]) => bought[id]).length, 0);
    return `<div class="sec-head"><h2>Lista zakupów — tydzień ${S.nWeek}</h2><span class="badge">${done} / ${n} kupione</span></div>
      <p class="caption">Ilości dla 1 osoby na 7 dni (poniedziałek–niedziela), zsumowane z jadłospisu tygodnia ${S.nWeek} i przeliczone do ${kcal} kcal dziennie. Zaznaczenia zapisują się w przeglądarce. Przyprawy (sól, pieprz, papryka, oregano, kumin, cynamon, czosnek, zioła) i cytrynę dokup według potrzeby.</p>
      <div class="shop">${list.map((g) => `<div class="shop-group"><h3>${esc(g.label)}</h3>${g.rows.map(([id, nm, q]) =>
        `<label><input type="checkbox" data-buy="${id}" ${bought[id] ? "checked" : ""}><span>${esc(nm)}</span><span class="qty">${q}</span></label>`).join("")}</div>`).join("")}</div>
      <p style="margin:14px 0 0"><button type="button" class="btn" id="clear-buy">Wyczyść zaznaczenia</button></p>`;
  }
  function firstUse(id) {
    for (let w = 0; w < 4; w++) for (let d = 0; d < 7; d++) { const m = mealsFor(S.goal, w, d); const i = m.findIndex((x) => slug(x.meal.name) === id); if (i >= 0) return { w, d, label: m[i].label }; }
    return null;
  }
  function usesOf(id) {
    let n = 0;
    for (let w = 0; w < 4; w++) for (let d = 0; d < 7; d++) n += mealsFor(S.goal, w, d).filter((x) => slug(x.meal.name) === id).length;
    return n;
  }

  // ---------- Trening: dane dnia ----------
  function warmItems() {
    const have = haveFor(S.loc, S.equip);
    return [
      have.rowerek ? ["Rowerek stacjonarny — 5 min", "Lekki opór, stopniowo przyspieszaj."] : have.bieznia ? ["Bieżnia — 5 min", "Szybki marsz, stopniowo przyspieszaj."] : ["Marsz w miejscu i krążenia ramion — 5 min", "Stopniowo przyspieszaj, unoś wyżej kolana."],
      have.skakanka ? ["Skakanka — 3 × 45 s", "Spokojny rytm, 30 s przerwy."] : ["Pajacyki — 3 × 30 s", "Spokojny rytm, 30 s przerwy."],
      have.guma ? ["Guma oporowa — 2 × 15", "Face pull i rozciąganie gumy przed klatką dla barków."] : ["Mobilizacja barków i bioder — 2 × 10", "Krążenia ramion, wykroki z rotacją, przysiady bez obciążenia."],
      ["Serie wstępne", "2–3 lżejsze serie pierwszego ćwiczenia (50% i 75% ciężaru roboczego)."],
    ];
  }
  const warmList = () => `<ol class="steps">${warmItems().map(([t, d]) => `<li><div><strong>${esc(t)}</strong><span>${esc(d)}</span></div></li>`).join("")}</ol>`;
  // "3 × 10", "4 × 6–8", "3 rundy × 12–15", "3 × 15–20 s"
  function parseSets(txt) {
    const m = /^(\d+)\s*(rundy|rund)?\s*×\s*(.+)$/.exec(txt || "");
    if (!m) return { n: 1, target: txt || "", round: false, hold: false };
    const t = m[3].trim(), hold = /s$/.test(t);
    return { n: Number(m[1]), target: hold ? t : `${t} powt.`, round: !!m[2], hold };
  }
  // "2–3 min" → 150 s, "60–90 s" → 75 s, "2 min" → 120 s
  function restSec(txt) {
    const m = /(\d+)(?:\s*[–-]\s*(\d+))?\s*(min|s)/.exec(txt || "");
    if (!m) return 0;
    const a = Number(m[1]), b = m[2] ? Number(m[2]) : a, v = ((a + b) / 2) * (m[3] === "min" ? 60 : 1);
    return Math.round(v / 15) * 15;
  }
  function parseInterval(txt) { // "6 min: 30 s pracy / 30 s przerwy", "8 min: 40 s / 20 s"
    const m = /(\d+)\s*min:\s*(\d+)\s*s[^/]*\/\s*(\d+)\s*s/.exec(txt || "");
    if (!m) return { work: 30, rest: 30, rounds: 6 };
    const work = Number(m[2]), rest = Number(m[3]);
    return { work, rest, rounds: Math.round((Number(m[1]) * 60) / (work + rest)) };
  }
  function buildSession(di, w) {
    const d = plan()[di], steps = [{ type: "warm" }];
    const sl = d.slots;
    for (let i = 0; i < sl.length; i++) {
      const s = sl[i], p = PRESC[s.kind], ex = exById(s.ex);
      if (s.kind === "finisz") { steps.push(Object.assign({ type: "interval", ex: ex.id, label: p.sets[w] }, parseInterval(p.sets[w]))); continue; }
      if (s.kind === "obwod") { // obwód: kolejne ćwiczenia po kolei w rundach
        const grp = []; while (i < sl.length && sl[i].kind === "obwod") grp.push(sl[i++]); i--;
        const ps = parseSets(PRESC.obwod.sets[w]);
        for (let r = 1; r <= ps.n; r++) grp.forEach((g, j) => steps.push({ type: "set", ex: g.ex, kind: "obwod", set: r, of: ps.n, round: true, target: ps.target, tempo: PRESC.obwod.tempo, rest: j === grp.length - 1 ? 90 : 30 }));
        continue;
      }
      const ps = parseSets(p.sets[w]);
      for (let k = 1; k <= ps.n; k++) steps.push({ type: "set", ex: ex.id, kind: s.kind, set: k, of: ps.n, round: ps.round, hold: ps.hold, target: ps.target, tempo: p.tempo, rest: restSec(p.rest) });
    }
    steps.push({ type: "done" });
    return steps;
  }
  const sessionMin = () => S.style === "kal" ? "45–60" : "60–75";
  function weekStart() { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - todayIndex()); return d.getTime(); }
  const doneThisWeek = () => LOG.sessions.filter((x) => x.t >= weekStart()).length;
  const trainingDays = () => plan().filter((d) => d.type === "trening").length;
  function ring(done, total) {
    const r = 34, c = 2 * Math.PI * r, pct = total ? Math.min(1, done / total) : 0;
    return `<svg class="ring" viewBox="0 0 80 80" role="img" aria-label="Treningi w tym tygodniu: ${done} z ${total}"><circle cx="40" cy="40" r="${r}" class="ring-bg"/>
      <circle cx="40" cy="40" r="${r}" class="ring-fg" stroke-dasharray="${(c * pct).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 40 40)"/><text x="40" y="38" text-anchor="middle" class="ring-n">${done}/${total}</text><text x="40" y="53" text-anchor="middle" class="ring-l">treningi</text></svg>`;
  }
  function lastLog(exId, n) {
    const L = (LOG.ex[exId] || []).slice().reverse(), days = [], by = {};
    L.forEach((e) => { const k = new Date(e.t).toDateString(); if (!by[k]) { by[k] = []; days.push(k); } by[k].unshift(e); });
    return days.slice(0, n || 3).map((k) => ({ t: by[k][0].t, sets: by[k] }));
  }
  const fmtSet = (e) => `${e.w ? `${fmt(e.w)} kg × ` : ""}${e.r || "—"}`;

  // ---------- Dziś (pulpit) ----------
  const MEAL_H = [7, 10, 13, 16, 19, 21, 22, 22];
  const heroChar = () => { try { return (window.TWA && window.TWA.charOfDay()) || (S.sex === "k" ? "atena" : "rico"); } catch (e) { return "rico"; } };
  function viewToday() {
    const di = todayIndex(), w = S.week - 1, pd = plan()[di];
    const date = new Date().toLocaleDateString("pl-PL", { weekday: "long", day: "numeric", month: "long" });
    const t = kcalTarget(), { meals, f } = dayPlan(w, di), h = new Date().getHours();
    let ni = meals.findIndex((x, i) => (MEAL_H[i] || 22) >= h); if (ni < 0) ni = meals.length - 1;
    const nm = meals[ni], nmk = macroOf(scaleItems(nm.meal.items, f));
    const tr = pd.type === "trening";
    const wo = tr ? `<div class="hero-meta">${pd.slots.length} ćwiczeń · ok. ${sessionMin()} min · tydzień ${S.week}</div>
        <div class="hero-ex">${pd.slots.slice(0, 4).map((s) => `<span>${esc(exById(s.ex).name)}</span>`).join("")}${pd.slots.length > 4 ? `<span>+${pd.slots.length - 4}</span>` : ""}</div>
        <a class="btn-primary big" href="#trening/sesja/${di}" data-start>${I.play}<span>Start treningu</span></a>`
      : pd.type === "cardio" ? `<div class="hero-meta">${esc(cardioPlan(ctx(), w).text)}</div><a class="btn-ghost" href="#trening/dzien/${di}">Szczegóły dnia</a>`
      : `<div class="hero-meta">${pd.short === "Śr" ? "Dzień bez ciężarów — spacer i rozciąganie." : "Pełny odpoczynek. Zadbaj o sen i posiłki na kolejne dni."}</div>`;
    const body = `
      <section class="hero"><div class="hero-img"><img src="img/hero/${heroChar()}.jpg" alt="" width="720" height="576"><div class="hero-top"><span class="pill">${esc(DAYS[di].full)}</span>${tr ? `<a class="hero-link" href="#trening/dzien/${di}">Szczegóły ${I.chev}</a>` : ""}</div></div>
        <div class="hero-body"><h2>${esc(pd.name)}</h2>${wo}</div></section>
      <div class="dash-grid">
        <section class="tile ring-tile">${ring(doneThisWeek(), trainingDays())}<div><b>Ten tydzień</b><small>${doneThisWeek() >= trainingDays() ? "Plan wykonany — świetnie!" : "Ukończone treningi (z historii)"}</small></div></section>
        <a class="tile kcal-tile" href="#zywienie/kalkulator"><span class="tile-l">${I.fire} Kalorie${t.manual ? " · ręcznie" : ""}</span><b>${t.kcal} kcal</b>
          <span class="chips-row"><span class="mchip p">B ${t.prot} g</span><span class="mchip f">T ${t.fat} g</span><span class="mchip c">W ${t.carb} g</span></span></a>
      </div>
      <a class="tile meal-tile" href="${recipeHref(nm.meal, w, di)}"><span class="tile-l">${I.food} Następny posiłek · ${esc(nm.label)}</span><b>${esc(nm.meal.name)}</b><small>ok. ${Math.round(nmk.k / 10) * 10} kcal · B ${Math.round(nmk.p)} g · ${nm.meal.time} min</small></a>
      ${spotifyBtn("wide")}
      <div class="week-pick">${seg("week", weekOpts(), S.week, "weeks")}<p class="caption">${esc(WEEK_NOTE[w])}</p></div>
      <div class="quick">
        <a href="#dzis/jadlospis">${I.list}<span>Jadłospis dnia</span></a>
        <a href="#zywienie/zakupy" data-ntab="zakupy">${I.cart}<span>Zakupy</span></a>
        <a href="#trening/plan">${I.cal}<span>Plan tygodnia</span></a>
        <a href="#ustawienia">${I.user}<span>Ustawienia</span></a>
      </div>`;
    return screen("Dziś", body, { eyebrow: esc(date), cls: "dash" });
  }
  function viewTodayMeals() {
    const di = todayIndex(), w = S.week - 1, { meals, f } = dayPlan(w, di);
    return screen("Jadłospis na dziś", `<p class="caption">Tydzień ${w + 1}, ${esc(DAYS[di].full.toLowerCase())} · cel ok. ${kcalTarget().kcal} kcal${isManual() ? " (ustawione samodzielnie)" : ""}. Dotknij dania, aby otworzyć przepis.</p>
      <div class="meals">${meals.map((x) => mealCard(x, f, w, di, dayKey(Date.now()))).join("")}</div>${dayTotals(meals, f)}`, { back: "#dzis" });
  }
  function dayTotals(meals, f) {
    const tot = meals.reduce((a, x) => { const m = macroOf(scaleItems(x.meal.items, f)); return { k: a.k + m.k, p: a.p + m.p, f: a.f + m.f, c: a.c + m.c }; }, { k: 0, p: 0, f: 0, c: 0 });
    return `<div class="metrics" id="day-total"><div class="metric main"><b>${Math.round(tot.k)} kcal</b><span>Suma dnia</span></div><div class="metric"><b>${Math.round(tot.p)} g</b><span>Białko</span></div>
      <div class="metric"><b>${Math.round(tot.f)} g</b><span>Tłuszcze</span></div><div class="metric"><b>${Math.round(tot.c)} g</b><span>Węglowodany</span></div></div>`;
  }

  // ---------- Trening ----------
  const dayIcon = (d) => d.type === "trening" ? I.dumbbell : d.type === "cardio" ? I.bike : I.moon;
  function viewTraining() {
    const P = plan(), td = todayIndex();
    const days = P.map((d, i) => rowLink(`#trening/dzien/${i}`, dayIcon(d), `${esc(d.full)}${i === td ? ' <span class="badge">dziś</span>' : ""}`,
      d.type === "trening" ? `${esc(d.name)} · ${d.slots.length} ćwiczeń` : esc(d.name), ` data-day="${i}"`)).join("");
    return screen("Trening", `<div class="week-pick">${seg("week", weekOpts(), S.week, "weeks")}<p class="caption">${esc(WEEK_NOTE[S.week - 1])}</p></div>
      ${group(`Tydzień ${S.week} — wybierz dzień`, days)}
      ${group("Plan", rowLink("#trening/progresja", I.chart, "Progresja w miesiącu", "Serie i powtórzenia w tygodniach 1–4") + rowLink("#trening/plan", I.cal, "Plan tygodnia", "Wszystkie sesje od poniedziałku do niedzieli") + rowLink("#trening/cardio", I.heart, "Cardio przy wybranym celu", esc(G().label)))}
      <p class="caption center">${esc(summary())} · <a href="#ustawienia">zmień</a></p>`, { eyebrow: "Plan na 4 tygodnie" });
  }
  function viewDay(di) {
    di = Number(di); if (!(di >= 0 && di < 7)) di = todayIndex();
    const w = S.week - 1, d = plan()[di];
    if (S.day !== di) { S.day = di; save(); }
    let body;
    if (d.type === "trening") {
      body = `<a class="btn-primary big" href="#trening/sesja/${di}" data-start>${I.play}<span>Start treningu</span></a>
        <p class="caption">Tydzień ${w + 1} · ${d.slots.length} ćwiczeń · ok. ${sessionMin()} min. Tempo: sekundy opuszczania – pauzy – podnoszenia.</p>
        <div class="ex-rows">${d.slots.map((s, i) => { const ex = exById(s.ex), p = PRESC[s.kind];
          return `<a class="ex-row" href="#cwiczenia/${ex.id}"><img src="${thumbSrc(ex)}" alt="" loading="lazy" width="480" height="848"><span class="rtx"><b><span class="num">${i + 1}</span>${esc(ex.name)}</b>
            <small>${esc(p.sets[w])} · przerwa ${esc(p.rest)}</small><span class="badges"><span class="badge${s.kind === "glowne" ? "" : " alt"}">${KIND_LABEL[s.kind]}</span>${S.style === "kal" ? ` <span class="badge alt">Poziom ${ex.lvl}</span>` : ""}</span></span><span class="rchev">${I.chev}</span></a>`; }).join("")}</div>
        <details class="card fold"><summary>Rozgrzewka (ok. 12 min)</summary>${warmList()}</details>`;
    } else if (d.type === "cardio") {
      const cp = cardioPlan(ctx(), w), have = haveFor(S.loc, S.equip);
      body = `<section class="card"><ol class="steps"><li><div><strong>${esc(cp.text)}</strong><span>Intensywność umiarkowana: możesz swobodnie mówić.</span></div></li>
        <li><div><strong>Rozciąganie${have.guma ? " z gumą" : ""} — 10 min</strong><span>Biodra, tył ud, klatka i barki.</span></div></li></ol></section>
        <div class="ex-rows">${cp.ex.map((ex) => `<a class="ex-row" href="#cwiczenia/${ex.id}"><img src="${thumbSrc(ex)}" alt="" loading="lazy"><span class="rtx"><b>${esc(ex.name)}</b><small>${esc(eqText(ex))}</small></span><span class="rchev">${I.chev}</span></a>`).join("")}</div>`;
    } else {
      const have = haveFor(S.loc, S.equip);
      body = `<section class="card rest-card"><p>${d.short === "Śr" ? `Dzień bez ciężarów. Opcjonalnie 20 minut ${have.rowerek ? "spokojnej jazdy na rowerku lub spacer" : "spaceru"} oraz 10 minut rozciągania${have.guma ? " z gumą" : ""}.` : "Pełny odpoczynek. Zadbaj o 7–9 godzin snu i przygotuj posiłki na kolejny tydzień."}</p></section>`;
    }
    return screen(`${esc(d.name)}`, body, { back: "#trening", eyebrow: `${esc(d.full)} · tydzień ${w + 1}` });
  }
  function viewProgression() {
    const w = S.week - 1, P = plan(), kinds = [];
    P.forEach((d) => d.slots.forEach((s) => { if (!kinds.includes(s.kind)) kinds.push(s.kind); }));
    const order = ["glowne", "kal", "pomocnicze", "wlasne", "izol", "obwod", "brzuch", "hold", "finisz"];
    kinds.sort((a, b) => order.indexOf(a) - order.indexOf(b));
    const prog = table(["Tydzień"].concat(kinds.map((k) => KIND_LABEL[k]), ["Zapas powt."]), WEEKS.map((x, i) => [`Tydzień ${x}`].concat(kinds.map((k) => PRESC[k].sets[i]), [["3", "2–3", "2", "1"][i]])), w);
    const have = haveFor(S.loc, S.equip);
    const note = S.style === "kal"
      ? `Poziom: ${esc(LVL[S.level].toLowerCase())}. Ćwiczenia dobierane są z łańcuchów progresji. Gdy spełnisz kryterium „Kiedy przejść dalej” w karcie ćwiczenia, zmień poziom wyżej w Ustawieniach.`
      : `${have.drazek && have.guma ? "Jeśli nie wykonasz 5 podciągnięć, użyj gumy oporowej zaczepionej o drążek jako asysty. " : ""}Gdy zrobisz wszystkie serie w górnym zakresie powtórzeń, dodaj ciężar w kolejnym tygodniu.`;
    return screen("Progresja w miesiącu", `<section class="card">${prog}</section><p class="note">${note}</p>`, { back: "#trening" });
  }
  function viewWeekPlan() {
    const w = S.week - 1, P = plan(), td = todayIndex();
    const cards = P.map((x, i) => {
      const chips = x.type === "trening" ? x.slots.map((s) => `<span>${esc(exById(s.ex).name)}</span>`).join("") : "";
      const sub = x.type === "trening" ? `${x.slots.length} ćwiczeń` : x.type === "cardio" ? esc(cardioPlan(ctx(), w).text) : x.short === "Śr" ? "Spacer i rozciąganie" : "Odpoczynek";
      return `<a class="wp-day ${x.type}${i === td ? " today" : ""}" href="#trening/dzien/${i}"><span class="wp-ic">${dayIcon(x)}</span><span class="wp-t"><span class="wp-h"><b>${esc(x.full)}</b>${i === td ? '<span class="badge">dziś</span>' : ""}</span><strong>${esc(x.name)}</strong><small>${sub}</small>${chips ? `<span class="wp-ex">${chips}</span>` : ""}</span><span class="rchev">${I.chev}</span></a>`;
    }).join("");
    return screen("Plan tygodnia", `<p class="caption">Tydzień ${S.week} · ${esc(summary())}</p><div class="week-pick">${seg("week", weekOpts(), S.week, "weeks")}</div><div class="wp-list">${cards}</div>`, { back: "#trening" });
  }
  function viewCardio() {
    return screen("Cardio", `${goalSelect()}<section class="card"><p style="margin:0">${esc(G().cardio)}</p></section>`, { back: "#trening", eyebrow: "Przy wybranym celu" });
  }

  // ---------- Ćwiczenia ----------
  function inPlan(ex) {
    return plan().filter((x) => x.slots.some((s) => s.ex === ex.id)).map((x) => `${x.full} (${x.name})`).join(", ") ||
      (["bike", "rope", "treadmill", "rowerg", "burpee"].includes(ex.id) ? "Rozgrzewka i cardio (jeśli masz sprzęt)" : "Nie ma go w Twoim obecnym planie — możesz nim zastąpić ćwiczenie z tej samej grupy");
  }
  const isCal = (e) => !!e.cal || Object.values(CHAINS).some((c) => c.list.includes(e.id));
  const norm = (s) => String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ł/g, "l");
  let libQ = "";
  function libList() {
    const have = haveFor(S.loc, S.equip), q = norm(libQ.trim());
    return EX.filter((e) => hasMedia(e) && (S.grp === "wszystko" || (S.grp === "kal" ? isCal(e) : e.group === S.grp)) && (!S.onlyAv || eqOk(e, have)) &&
      (!q || norm(e.name + " " + e.muscles + " " + GROUPS[e.group]).includes(q)));
  }
  function libItems() {
    const list = libList();
    return list.length ? `<div class="lib">${list.map((e) => `<a href="#cwiczenia/${e.id}"><span class="thumb"><img src="${thumbSrc(e)}" alt="${esc(altOf(e))}" loading="lazy" width="480" height="848">${vidSrc(e) ? `<span class="vbadge">${I.play}</span>` : ""}</span><span class="t"><strong>${esc(e.name)}</strong><small>${esc(GROUPS[e.group])} · ${esc(LVL[e.lvl])}</small></span></a>`).join("")}</div>`
      : `<p class="empty">Brak ćwiczeń dla tego filtra.</p>`;
  }
  function viewLibrary() {
    const tags = ["wszystko"].concat(Object.keys(GROUPS), ["kal"]);
    return screen("Ćwiczenia", `<label class="search">${I.search}<input id="lib-q" type="search" placeholder="Szukaj ćwiczenia lub mięśnia" value="${esc(libQ)}" aria-label="Szukaj ćwiczenia" autocomplete="off"></label>
      <div class="chips" role="group" aria-label="Filtr grupy mięśniowej">${tags.map((t) => `<button type="button" class="chip" data-grp="${t}" aria-pressed="${S.grp === t}">${t === "wszystko" ? "Wszystkie" : t === "kal" ? "Kalistenika" : GROUPS[t]}</button>`).join("")}</div>
      <label class="toggle"><span>Tylko dostępne przy moim sprzęcie (${esc(LOC_L[S.loc])})</span><input type="checkbox" id="only-av" ${S.onlyAv ? "checked" : ""}><i></i></label>
      <div id="lib-items">${libItems()}</div>`, { eyebrow: `${EX.filter(hasMedia).length} ćwiczeń z instrukcją` });
  }
  function exLink(v) { const t = v && exByIdStrict(v); return t ? `<a href="#cwiczenia/${t.id}">${esc(t.name)}</a>` : esc(v || "—"); }
  function planSlot(ex) { // jeśli ćwiczenie jest w planie — preskrypcja na bieżący tydzień
    const P = plan(); for (const d of P) { const s = d.slots.find((x) => x.ex === ex.id); if (s) return { d, s, p: PRESC[s.kind] }; } return null;
  }
  function historyHtml(exId) {
    const H = lastLog(exId, 3);
    return H.length ? `<ul class="hist">${H.map((h) => `<li><b>${esc(fmtDate(h.t))}</b><span>${h.sets.map(fmtSet).map(esc).join(" · ")}</span></li>`).join("")}</ul>`
      : `<p class="caption" style="margin:0">Brak zapisów. Podczas treningu wpisz ciężar i powtórzenia — pojawią się tutaj.</p>`;
  }
  function viewExercise(id) {
    const ex = EX.find((e) => e.id === id);
    if (!ex) return viewLibrary();
    let L = libList(); if (!L.includes(ex)) L = EX.filter(hasMedia); if (!L.includes(ex)) L = EX;
    const i = L.indexOf(ex), prev = L[(i + L.length - 1) % L.length], next = L[(i + 1) % L.length];
    const ok = eqOk(ex, haveFor(S.loc, S.equip)), ps = planSlot(ex), w = S.week - 1;
    const sets = ps ? ps.p.sets[w] : ex.presc && ex.presc.sets, tempo = ps ? ps.p.tempo : ex.presc && ex.presc.tempo, rest = ps ? ps.p.rest : ex.presc && ex.presc.rest;
    return `<div class="fs ex-fs"><div class="fs-media">${media(ex, "contain")}
      <a class="icon-btn fs-close" href="#cwiczenia" data-back aria-label="Zamknij">${I.close}</a></div>
      <div class="fs-sheet"><div class="eyebrow">${esc(GROUPS[ex.group])} · ${esc(LVL[ex.lvl])}${isCal(ex) ? " · kalistenika" : ""}</div><h1>${esc(ex.name)}</h1>
        <div class="stats">${sets ? `<div><b>${esc(sets)}</b><span>Serie × powt.${ps ? ` (tydz. ${w + 1})` : ""}</span></div>` : ""}${tempo ? `<div><b>${esc(tempo)}</b><span>Tempo</span></div>` : ""}${rest ? `<div><b>${esc(rest)}</b><span>Przerwa</span></div>` : ""}</div>
        <p class="meta"><span>${esc(ex.muscles)}</span><span>${esc(eqText(ex))} ${ok ? `<span class="badge">Dostępne</span>` : `<span class="badge warn">Brak sprzętu</span>`}</span></p>
        <details class="fold" open><summary>Jak wykonać</summary><ol class="steps">${ex.steps.map((s) => `<li><div><strong>${esc(s.title)}</strong><span>${esc(s.detail)}</span></div></li>`).join("")}</ol></details>
        <details class="fold"><summary>Częste błędy</summary><ul class="cons">${ex.mistakes.map((m) => `<li>${esc(m)}</li>`).join("")}</ul></details>
        <details class="fold"><summary>Wersje i plan</summary><dl class="props"><div><dt>Łatwiej</dt><dd>${exLink(ex.easier)}</dd></div><div><dt>Trudniej</dt><dd>${exLink(ex.harder)}</dd></div>
          ${ex.next ? `<div><dt>Kiedy przejść dalej</dt><dd>${esc(ex.next)}</dd></div>` : ""}<div><dt>W planie</dt><dd>${esc(inPlan(ex))}</dd></div></dl></details>
        <section class="fold-static"><h2>Ostatnio</h2>${historyHtml(ex.id)}</section>
        <nav class="pager" aria-label="Inne ćwiczenia"><a class="btn-ghost" href="#cwiczenia/${prev.id}" data-replace>${I.prev}<span>${esc(prev.name)}</span></a><a class="btn-ghost" href="#cwiczenia/${next.id}" data-replace><span>${esc(next.name)}</span>${I.next}</a></nav>
      </div></div>`;
  }

  // ---------- Żywienie ----------
  function viewNutritionMenu() {
    const t = kcalTarget();
    return screen("Żywienie", `<a class="tile kcal-tile wide" href="#zywienie/kalkulator"><span class="tile-l">${I.fire} ${esc(G().label)}${t.manual ? " · kalorie ustawione samodzielnie" : ""}</span><b>${t.kcal} kcal dziennie</b>
        <span class="chips-row"><span class="mchip p">B ${t.prot} g</span><span class="mchip f">T ${t.fat} g</span><span class="mchip c">W ${t.carb} g</span></span></a>
      ${group("", rowLink("#zywienie/kalkulator", I.calc, "Kalkulator i kalorie", "Cel, masa ciała, kalorie automatyczne lub ręczne") + rowLink("#zywienie/menu", I.list, "Menu dnia", "Jadłospis na 28 dni z gramaturą") +
        rowLink("#zywienie/zakupy", I.cart, "Lista zakupów", "Na cały tydzień, z odhaczaniem") + rowLink("#zywienie/przepisy", I.book, "Przepisy", `${allDishes(S.goal).length} dań dla wybranego celu`))}`, { eyebrow: "Dieta dopasowana do celu" });
  }
  function calcBody() {
    const g = G();
    return `<section class="card"><h2>Cel</h2>${goalPicker()}<p class="note" style="margin:14px 0 0">${esc(g.note)}</p></section>
      <section class="card"><h2>Twoje dzienne zapotrzebowanie</h2>
        <span class="formula">kcal = masa ciała (kg) × ${g.kf[0][0]}–${g.kf[g.kf.length - 1][0]}</span><span class="formula">białko = masa × ${fmt(g.pf[0])}–${fmt(g.pf[g.pf.length - 1])} g</span><span class="formula">tłuszcze = masa × ${fmt(g.fat)} g</span>
        <div class="form">
          <label class="field">Masa ciała (kg)<input id="weight" type="number" inputmode="decimal" min="40" max="180" step="0.5" value="${esc(S.weight)}"></label>
          <label class="field">Mnożnik kcal<select id="kf"${isManual() ? ' disabled title="Nieużywany przy kaloriach ustawionych samodzielnie"' : ""}>${g.kf.map(([v, l]) => `<option value="${v}" ${S.kf === v ? "selected" : ""}>${v} kcal/kg — ${l}</option>`).join("")}</select></label>
          <label class="field">Białko (g/kg)<select id="pf">${g.pf.map((v) => `<option value="${v}" ${S.pf === v ? "selected" : ""}>${fmt(v)} g/kg</option>`).join("")}</select></label>
        </div>${kcalControls()}<div id="nutri-results">${nutritionResults()}</div></section>`;
  }
  function viewCalc(back) { kcalTarget(); return screen("Kalkulator i kalorie", calcBody(), { back: back || "#zywienie" }); }
  function viewMenuDay() {
    const nw = S.nWeek - 1, nd = S.nDay, { meals, f } = dayPlan(nw, nd);
    return screen("Menu dnia", `${seg("nWeek", weekOpts(), S.nWeek, "weeks")}${seg("nDay", dayOpts(), S.nDay, "days")}
      <div id="meal-plan"><h2 class="sub">${esc(DAYS[nd].full)}, tydzień ${S.nWeek}</h2><p class="caption">Gramatura produktów przed obróbką; B — białko, T — tłuszcze, W — węglowodany.</p>
      <div class="meals">${meals.map((x) => mealCard(x, f, nw, nd, nw === S.week - 1 && nd === todayIndex() ? dayKey(Date.now()) : null)).join("")}</div>${dayTotals(meals, f)}
      <p class="note">Woda: ok. 35 ml na kg masy ciała dziennie, więcej w dni treningowe. Posiłek z największą porcją węglowodanów zjedz 1–2 godziny przed treningiem lub po nim.</p></div>`, { back: "#zywienie", eyebrow: `${kcalTarget().kcal} kcal` });
  }
  function viewShop() {
    return screen("Lista zakupów", `${seg("nWeek", weekOpts(), S.nWeek, "weeks")}<div id="meal-plan">${shopView()}</div>`, { back: "#zywienie" });
  }
  function viewRecipes() {
    const list = allDishes(S.goal);
    return screen("Przepisy", `<p class="caption">Wszystkie dania z 28-dniowego jadłospisu dla celu „${esc(G().label)}”. Dotknij, aby zobaczyć gramaturę i kroki.</p>
      ${SLOTS.map((s) => { const xs = list.filter((x) => x.slot === s.label); return group(esc(s.label), xs.map((x) => {
        const u = firstUse(x.id), { f } = dayPlan(u.w, u.d), m = macroOf(scaleItems(x.meal.items, f));
        return rowLink(recipeHref(x.meal), I.food, esc(x.meal.name), `${x.meal.time} min · ok. ${Math.round(m.k / 10) * 10} kcal · ${Math.round(m.p)} g białka`); }).join("")); }).join("")}`, { back: "#zywienie" });
  }
  function viewRecipe(id, wq, dq, sq) {
    const x = dishById(id);
    if (!x) return viewRecipes();
    fixGoal();
    let w = Number(wq) - 1, d = Number(dq), cx = "";
    if (!(w >= 0 && w < 4 && d >= 0 && d < 7)) { const u = firstUse(id); if (u) { w = u.w; d = u.d; } else w = -1; }
    let f = { P: 1, F: 1, C: 1, V: 1 };
    const si = Number(sq);
    if (w >= 0) { f = (si >= 0 && si < 5 ? planWith(w, d, si, x.meal) : dayPlan(w, d)).f; cx = `Porcja przeliczona do Twojego zapotrzebowania (${kcalTarget().kcal} kcal) — tydzień ${w + 1}, ${esc(DAYS[d].full.toLowerCase())}.`; }
    else cx = "To danie nie występuje w jadłospisie wybranego celu — pokazuję porcję bazową.";
    const items = scaleItems(x.meal.items, f), m = macroOf(items), uses = usesOf(id);
    return screen(esc(x.meal.name), `<section class="card"><div class="metrics rec-metrics">
        <div class="metric main"><b>${x.meal.time} min</b><span>Czas</span></div><div class="metric"><b>ok. ${Math.round(m.k / 10) * 10} kcal</b><span>Na porcję</span></div>
        <div class="metric"><b>${Math.round(m.p)} g</b><span>Białko</span></div><div class="metric"><b>${Math.round(m.f)} / ${Math.round(m.c)} g</b><span>Tłuszcze / węgl.</span></div>
      </div><p class="caption" style="margin:12px 0 0">${cx}${uses ? ` W jadłospisie: ${uses} ${uses === 1 ? "raz" : "razy"} w 28 dni.` : ""}</p></section>
      <section class="card"><h2>Składniki (1 porcja)</h2><ul class="ing">${items.map(([iid, g]) => `<li><span>${esc(ING[iid].n)}</span><b>${qty(iid, g)}</b></li>`).join("")}<li class="muted"><span>Sól, pieprz, przyprawy</span><b>do smaku</b></li></ul>
        <p class="caption" style="margin:10px 0 0">Gramatura produktów przed obróbką (ryż, kasza, makaron — suche).</p></section>
      <section class="card"><h2>Przygotowanie</h2><ol class="steps">${x.meal.steps.map((s, i) => `<li>${esc(s)}</li>`).join("")}</ol></section>`,
      { back: "#zywienie/przepisy", eyebrow: `Przepis · ${esc(x.slot)}` });
  }
  function viewSwap(wq, dq, sq) {
    const w = Number(wq) - 1, d = Number(dq), si = Number(sq);
    if (!(w >= 0 && w < 4 && d >= 0 && d < 7 && si >= 0 && si < 5)) return viewMenuDay();
    const cur = chosenMeals(w, d)[si], alts = altsFor(w, d, si);
    if (cur.picked && !alts.some((m) => slug(m.name) === slug(cur.meal.name))) alts.splice(1, 0, cur.meal);
    const cards = alts.map((m, i) => {
      const { f } = planWith(w, d, si, m), mm = macroOf(scaleItems(m.items, f)), on = slug(m.name) === slug(cur.meal.name);
      return `<article class="alt${on ? " on" : ""}"><div class="alt-h"><b>${esc(m.name)}</b>${on ? '<span class="badge">Wybrane</span>' : i === 0 ? '<span class="badge alt">Z planu</span>' : ""}</div>
        <div class="chips-row"><span class="mchip k">${Math.round(mm.k)} kcal</span><span class="mchip p">B ${Math.round(mm.p)} g</span><span class="mchip f">T ${Math.round(mm.f)} g</span><span class="mchip c">W ${Math.round(mm.c)} g</span><span class="mchip t">${I.timer} ${m.time} min</span></div>
        <p class="caption">${scaleItems(m.items, f).map(([id, g]) => `${esc(ING[id].n.toLowerCase())} ${qty(id, g)}`).join(" · ")}</p>
        <div class="alt-act"><a class="btn-ghost" href="${recipeHref(m, w, d)}/${si}">Przepis</a>${on ? "" : `<button type="button" class="btn-primary" data-pick="${slug(m.name)}" data-key="${choiceKey(w, d, si)}" data-def="${i === 0 ? 1 : ""}">Wybierz</button>`}</div></article>`;
    }).join("");
    return screen(`Zamień: ${esc(cur.label.toLowerCase())}`, `<p class="caption">${esc(DAYS[d].full)}, tydzień ${w + 1}. Porcje przeliczone do ${kcalTarget().kcal} kcal dziennie — po wyborze jadłospis i lista zakupów tego tygodnia przeliczą się automatycznie.</p><div class="alts">${cards}</div>`,
      { back: "#zywienie/menu", eyebrow: "Wybierz danie" });
  }

  // ---------- Ustawienia ----------
  function viewSettings() {
    const t = kcalTarget(), nLog = LOG.sessions.length;
    return screen("Ustawienia", `
      ${group("Profil", `<div class="row static"><span class="ric">${I.user}</span><span class="rtx"><b>Dla kogo</b></span>${seg("sex", [{ value: "m", label: "Mężczyźni" }, { value: "k", label: "Kobiety" }], S.sex, "mini")}</div>`)}
      ${group("Trening", `<div class="row static"><span class="ric">${I.dumbbell}</span><span class="rtx"><b>Styl</b></span>${seg("style", [{ value: "klas", label: "Klasyczny" }, { value: "kal", label: "Kalistenika" }], S.style, "mini")}</div>
        ${S.style === "kal" ? `<div class="row static col"><span class="rtx"><b>Poziom kalisteniki</b></span>${seg("level", [1, 2, 3].map((l) => ({ value: l, label: LVL[l] })), S.level, "mini")}</div>` : ""}
        <div class="row static"><span class="ric">${I.home}</span><span class="rtx"><b>Miejsce</b></span>${seg("loc", [{ value: "silownia", label: "Siłownia" }, { value: "dom", label: "Dom" }], S.loc, "mini")}</div>
        ${S.loc === "dom" ? rowLink("#ustawienia/sprzet", I.list, "Sprzęt w domu", esc(Object.keys(EQUIP).filter((k) => EQUIP[k].home && S.equip[k]).map((k) => EQUIP[k].n).join(", ") || "tylko masa ciała")) : ""}`)}
      ${group("Dieta", rowLink("#ustawienia/cel", I.target, "Cel", esc(G().label)) + rowLink("#ustawienia/kalorie", I.fire, "Kalorie", `${t.kcal} kcal · ${t.manual ? "ustawione samodzielnie" : "automatycznie z kalkulatora"}`))}
      ${group("Muzyka", `<div class="row static col"><span class="rtx"><b>Własna playlista Spotify (opcjonalnie)</b><small>Wklej link do playlisty (np. https://open.spotify.com/playlist/…). Przycisk „Muzyka w Spotify” otworzy ją w aplikacji Spotify. Bez linku otworzy wyszukiwanie „trening”. Muzyka nie jest odtwarzana w tej aplikacji.</small></span>
        <label class="field wide">Link do playlisty<input id="spotify-url" type="url" inputmode="url" autocomplete="off" spellcheck="false" placeholder="https://open.spotify.com/playlist/…" value="${esc(S.spotify || "")}"></label>
        <p class="caption" id="spotify-msg" aria-live="polite">${S.spotify ? (spotifyNorm(S.spotify) ? "Zapisano — przycisk otworzy Twoją playlistę." : "Ten link nie wygląda na link Spotify — przycisk otworzy wyszukiwanie.") : ""}</p>
        <div class="alt-act">${spotifyBtn()}${S.spotify ? '<button type="button" class="btn-ghost" id="spotify-clear">Usuń link</button>' : ""}</div></div>`)}
      ${window.TWA ? window.TWA.settingsHtml() : ""}
      ${group("Dane", `<button type="button" class="row" id="clear-log"><span class="ric">${I.trash}</span><span class="rtx"><b>Wyczyść historię treningów</b><small>${nLog} zapisanych treningów</small></span></button>`)}
      <section class="card safety"><h2>${I.shield} Bezpieczeństwo</h2><p>Przed rozpoczęciem planu skonsultuj się z lekarzem, jeśli masz choroby przewlekłe, urazy lub przyjmujesz leki. Przerwij ćwiczenie przy bólu, zawrotach głowy lub duszności. Plan ma charakter ogólny i nie zastępuje porady lekarza ani dietetyka.</p>
        <p class="caption" style="margin:0">Ustawienia i historia zapisują się tylko na tym urządzeniu.</p></section>`, { eyebrow: esc(summary()) });
  }
  function viewEquip() {
    const homeEq = Object.keys(EQUIP).filter((k) => EQUIP[k].home);
    return screen("Sprzęt w domu", `${group("", homeEq.map((k) => `<label class="row toggle"><span class="rtx"><b>${esc(EQUIP[k].n)}</b></span><input type="checkbox" data-eq="${k}" ${S.equip[k] ? "checked" : ""}><i></i></label>`).join(""))}
      <p class="caption">Ćwiczenia z masą ciała (pompki, przysiady, mostki, deska) są zawsze dostępne. Plan wybiera tylko ćwiczenia, do których masz zaznaczony sprzęt.</p>`, { back: "#ustawienia" });
  }
  function viewGoal() { return screen("Cel", `${goalPicker()}<p class="note">${esc(G().note)}</p>`, { back: "#ustawienia" }); }

  // ---------- Tryb treningu (pełny ekran) ----------
  let WK = load(WK_KEY); if (!WK.steps) WK = null;
  const saveWK = () => { try { if (WK) localStorage.setItem(WK_KEY, JSON.stringify(WK)); else localStorage.removeItem(WK_KEY); } catch (e) { /* brak */ } };
  let AC = null;
  function beep(n) {
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)();
      if (AC.state === "suspended") AC.resume();
      for (let k = 0; k < (n || 2); k++) {
        const t = AC.currentTime + k * 0.22, o = AC.createOscillator(), g = AC.createGain();
        o.type = "sine"; o.frequency.value = 880; o.connect(g); g.connect(AC.destination);
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.35, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
        o.start(t); o.stop(t + 0.18);
      }
    } catch (e) { /* brak dźwięku */ }
    buzz([180, 90, 180]);
  }
  let wakeLock = null;
  async function wake(on) {
    try {
      if (on && !wakeLock && "wakeLock" in navigator && document.visibilityState === "visible") { wakeLock = await navigator.wakeLock.request("screen"); wakeLock.addEventListener("release", () => { wakeLock = null; }); }
      if (!on && wakeLock) { await wakeLock.release(); wakeLock = null; }
    } catch (e) { wakeLock = null; }
  }
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible" && WK && !WK.finished && isSessionRoute()) wake(true); });
  const isSessionRoute = () => /^#trening\/sesja\//.test(location.hash);
  function startSession(di) {
    WK = { di, w: S.week - 1, steps: buildSession(di, S.week - 1), i: 0, t0: Date.now(), done: [], restEnd: null, iv: null, finished: false };
    saveWK();
  }
  function prefill(st) {
    const mine = WK.done.filter((x) => x.ex === st.ex);
    if (mine.length) return mine[mine.length - 1];
    const L = (LOG.ex[st.ex] || []).filter((e) => e.t < WK.t0);
    return L.filter((e) => e.s === st.set).pop() || L.pop() || {};
  }
  function nextLabel(i) {
    const st = WK.steps[i];
    if (!st || st.type === "done") return "Koniec treningu";
    if (st.type === "interval") return `Finisz: ${exById(st.ex).name}`;
    return `${exById(st.ex).name} — ${st.round ? "runda" : "seria"} ${st.set} z ${st.of}`;
  }
  function viewSession(di) {
    di = Number(di);
    const d = plan()[di];
    if (!d || d.type !== "trening") return viewDay(di);
    if (!WK || WK.di !== di) startSession(di);
    { const q = new URLSearchParams(location.search), sp = q.get("wkstep"); if (sp != null && !viewSession.hk) { viewSession.hk = 1; WK.i = Math.min(WK.steps.length - 1, Number(sp)); if (q.get("wkrest")) WK.restEnd = Date.now() + 90000; } } // tylko testy podglądu
    const st = WK.steps[WK.i], n = WK.steps.length - 1, pct = Math.round((WK.i / n) * 100);
    const head = `<header class="ws-top"><button type="button" class="icon-btn" data-exit aria-label="Zakończ trening">${I.close}</button>
      <div class="ws-title"><b>${esc(d.name)}</b><small>${st.type === "done" ? "Ukończono" : `Krok ${WK.i + 1} z ${n}`} · ${fmtTime((Date.now() - WK.t0) / 1000)}</small></div>${spotifyBtn("compact")}</header>
      <div class="ws-bar" aria-label="Postęp treningu: ${pct}%" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><i style="width:${pct}%"></i></div>`;
    let body = "";
    if (st.type === "warm") {
      body = `<div class="ws-body"><div class="ws-hero">${I.fire}<h1>Rozgrzewka</h1><p class="caption">Ok. 12 minut — przygotuj stawy i mięśnie.</p></div>${warmList()}</div>
        <div class="ws-foot"><button type="button" class="btn-primary big" data-wk="next">${I.check}<span>Rozgrzewka zrobiona</span></button></div>`;
    } else if (st.type === "done") {
      if (!WK.finished) { WK.finished = true; WK.t1 = Date.now(); LOG.sessions.push({ t: WK.t0, di, w: WK.w, dur: Math.round((WK.t1 - WK.t0) / 1000), sets: WK.done.length }); saveLog(); saveWK(); wake(false); emit("workout-done", { di }); }
      const byEx = {}; WK.done.forEach((x) => { (byEx[x.ex] = byEx[x.ex] || []).push(x); });
      body = `<div class="ws-body"><div class="ws-hero done">${I.check}<h1>Trening ukończony!</h1><p class="caption">${esc(d.full)} · tydzień ${WK.w + 1}</p></div>
        <div class="metrics"><div class="metric main"><b>${fmtTime((WK.t1 - WK.t0) / 1000)}</b><span>Czas</span></div><div class="metric"><b>${WK.done.length}</b><span>Serie zrobione</span></div><div class="metric"><b>${Object.keys(byEx).length}</b><span>Ćwiczenia</span></div></div>
        <ul class="hist">${Object.keys(byEx).map((id) => `<li><b>${esc(exById(id).name)}</b><span>${byEx[id].map(fmtSet).map(esc).join(" · ")}</span></li>`).join("")}</ul></div>
        <div class="ws-foot"><button type="button" class="btn-primary big" data-wk="finish">${I.home}<span>Gotowe</span></button></div>`;
    } else if (st.type === "interval") {
      const ex = exById(st.ex), iv = WK.iv;
      body = `<div class="ws-media">${media(ex, "contain")}</div><div class="ws-body"><div class="ws-name"><span class="pill">Finisz kondycyjny</span><h1>${esc(ex.name)}</h1></div>
        <div class="ws-target"><b id="wk-iv-phase">${iv ? "PRACA" : `${st.rounds} rund`}</b><span id="wk-iv-info">${iv ? "" : esc(st.label)}</span></div>
        <div class="timer-big" id="wk-iv-time">${iv ? "" : fmtTime(st.work)}</div></div>
        <div class="ws-foot">${iv ? `<button type="button" class="btn-ghost" data-wk="ivstop">Zakończ finisz</button>` : `<button type="button" class="btn-primary big" data-wk="ivstart">${I.play}<span>Start finiszu</span></button>`}
          <div class="ws-nav"><button type="button" class="icon-btn" data-wk="prev" aria-label="Poprzedni krok">${I.prev}</button><button type="button" class="icon-btn" data-wk="fwd" aria-label="Następny krok">${I.next}</button></div></div>`;
    } else if (WK.restEnd) {
      const left = (WK.restEnd - Date.now()) / 1000, nx = WK.steps[WK.i];
      body = `<div class="ws-body rest"><span class="pill">Przerwa</span><div class="timer-big" id="wk-timer">${fmtTime(left)}</div>
        <div class="rest-actions"><button type="button" class="btn-ghost" data-wk="plus">+15 s</button><button type="button" class="btn-primary" data-wk="skip">Pomiń</button></div>
        <div class="up-next"><small>Następnie</small><b>${esc(nextLabel(WK.i))}</b>${nx && nx.type === "set" ? `<span>${esc(nx.target)}</span>` : ""}</div></div>`;
    } else {
      const ex = exById(st.ex), pf = prefill(st);
      const dots = Array.from({ length: st.of }, (_, k) => `<i class="${k + 1 < st.set ? "done" : k + 1 === st.set ? "cur" : ""}"></i>`).join("");
      body = `<div class="ws-media">${media(ex, "contain")}</div><div class="ws-body"><div class="ws-name"><div class="ws-setrow"><span class="pill">${st.round ? "Runda" : "Seria"} ${st.set} z ${st.of}</span><span class="ws-dots" aria-hidden="true">${dots}</span></div><h1>${esc(ex.name)}</h1></div>
        <div class="ws-target card"><b>${esc(st.target)}</b><span>Tempo ${esc(st.tempo)} · przerwa ${st.rest ? fmtTime(st.rest) : "—"}</span></div>
        <div class="ws-log"><label class="field">Ciężar (kg)<input id="wk-w" type="number" inputmode="decimal" min="0" step="0.5" value="${esc(pf.w || "")}" placeholder="—"></label>
          <label class="field">${st.hold ? "Czas (s)" : "Powtórzenia"}<input id="wk-r" type="number" inputmode="numeric" min="0" step="1" value="${esc(pf.r || "")}" placeholder="${esc(st.target.replace(/ powt\.$/, ""))}"></label></div></div>
        <div class="ws-foot"><div class="ws-nav"><button type="button" class="icon-btn" data-wk="prev" aria-label="Poprzedni krok">${I.prev}</button></div><button type="button" class="btn-primary big" data-wk="done">${I.check}<span>Seria zrobiona</span></button>
          <div class="ws-nav"><button type="button" class="icon-btn" data-wk="fwd" aria-label="Następny krok">${I.next}</button></div></div>`;
    }
    return `<div class="fs ws">${head}${body}</div>`;
  }
  function wkAction(a) {
    if (!WK) return;
    const st = WK.steps[WK.i];
    if (AC && AC.state === "suspended") AC.resume();
    if (a === "next" || a === "fwd") { WK.i = Math.min(WK.steps.length - 1, WK.i + 1); WK.restEnd = null; WK.iv = null; buzz(15); }
    else if (a === "prev") { WK.i = Math.max(0, WK.i - 1); WK.restEnd = null; WK.iv = null; buzz(10); }
    else if (a === "done" && st.type === "set") {
      const wv = Number(String((document.getElementById("wk-w") || {}).value || "").replace(",", ".")) || 0, rv = Number((document.getElementById("wk-r") || {}).value) || 0;
      const e = { ex: st.ex, set: st.set, w: wv, r: rv, t: Date.now() };
      WK.done.push(e);
      const L = LOG.ex[st.ex] = LOG.ex[st.ex] || []; L.push({ t: e.t, w: wv, r: rv, s: st.set }); if (L.length > 80) L.splice(0, L.length - 80); saveLog();
      WK.i = Math.min(WK.steps.length - 1, WK.i + 1);
      const nx = WK.steps[WK.i];
      WK.restEnd = st.rest && nx.type !== "done" ? Date.now() + st.rest * 1000 : null;
      buzz(30);
      if (!AC) beep(0);
    }
    else if (a === "plus" && WK.restEnd) WK.restEnd += 15000;
    else if (a === "skip") WK.restEnd = null;
    else if (a === "ivstart") { WK.iv = { start: Date.now(), last: "" }; buzz(30); if (!AC) beep(0); }
    else if (a === "ivstop") { WK.iv = null; WK.i = Math.min(WK.steps.length - 1, WK.i + 1); }
    else if (a === "finish") { WK = null; saveWK(); go("#dzis"); return; }
    saveWK(); render();
  }
  setInterval(() => {
    if (!WK || !isSessionRoute()) return;
    const st = WK.steps[WK.i];
    if (WK.restEnd) {
      const left = (WK.restEnd - Date.now()) / 1000, el = document.getElementById("wk-timer");
      if (left <= 0) { WK.restEnd = null; saveWK(); beep(2); render(); return; }
      if (el) el.textContent = fmtTime(left);
    } else if (st && st.type === "interval" && WK.iv) {
      const el = (Date.now() - WK.iv.start) / 1000, cyc = st.work + st.rest, round = Math.floor(el / cyc) + 1;
      if (round > st.rounds) { beep(3); WK.iv = null; WK.i = Math.min(WK.steps.length - 1, WK.i + 1); saveWK(); render(); return; }
      const inWork = el % cyc < st.work, left = inWork ? st.work - (el % cyc) : cyc - (el % cyc), ph = (inWork ? "w" : "r") + round;
      if (WK.iv.last && WK.iv.last !== ph) beep(1);
      WK.iv.last = ph;
      const P = document.getElementById("wk-iv-phase"), T = document.getElementById("wk-iv-time"), N = document.getElementById("wk-iv-info");
      if (P) P.textContent = inWork ? "PRACA" : "PRZERWA"; if (T) T.textContent = fmtTime(left); if (N) N.textContent = `Runda ${round} z ${st.rounds}`;
    }
  }, 250);

  // ---------- okno potwierdzenia ----------
  function modal(title, text, okLabel, onOk, cancelLabel) {
    const m = document.createElement("div");
    m.className = "modal"; m.setAttribute("role", "dialog"); m.setAttribute("aria-modal", "true");
    m.innerHTML = `<div class="modal-card"><h2>${title}</h2><p>${text}</p><div class="modal-act"><button type="button" class="btn-ghost" data-m="no">${cancelLabel || "Anuluj"}</button><button type="button" class="btn-primary" data-m="ok">${okLabel}</button></div></div>`;
    document.body.appendChild(m);
    m.querySelector('[data-m="ok"]').focus();
    m.addEventListener("click", (e) => { const b = e.target.closest("[data-m]"); if (!b && e.target !== m) return; m.remove(); if (b && b.dataset.m === "ok") onOk(); });
  }
  function confirmExit(target) {
    if (document.querySelector(".modal")) return;
    modal("Przerwać trening?", "Zrobione serie zostaną zapisane w historii ćwiczeń.", "Zakończ trening", () => { const di = WK ? WK.di : 0; WK = null; emit("workout-exit", { di }); saveWK(); wake(false); go(target || `#trening/dzien/${di}`); }, "Wróć do treningu");
  }

  // ---------- render i nawigacja ----------
  let replacing = false;
  const navStack = [location.hash || "#dzis"];
  let prevHash = location.hash || "#dzis";
  function parts() { return (location.hash || "#dzis").slice(1).split("/"); }
  function render() {
    const p = parts(), v = TABS.includes(p[0]) ? p[0] : "dzis";
    let html, fs = false;
    if (v === "dzis") html = p[1] === "jadlospis" ? viewTodayMeals() : viewToday();
    else if (v === "trening") {
      if (p[1] === "sesja") { html = viewSession(p[2]); fs = true; }
      else html = p[1] === "dzien" ? viewDay(p[2]) : p[1] === "progresja" ? viewProgression() : p[1] === "plan" ? viewWeekPlan() : p[1] === "cardio" ? viewCardio() : viewTraining();
    } else if (v === "cwiczenia") { if (p[1] && EX.find((e) => e.id === p[1])) { html = viewExercise(p[1]); fs = true; } else html = viewLibrary(); }
    else if (v === "zywienie") html = p[1] === "kalkulator" ? viewCalc() : p[1] === "menu" ? viewMenuDay() : p[1] === "zakupy" ? viewShop() : p[1] === "przepisy" ? viewRecipes()
      : p[1] === "przepis" ? viewRecipe(p[2], p[3], p[4], p[5]) : p[1] === "zamien" ? viewSwap(p[2], p[3], p[4]) : viewNutritionMenu();
    else html = p[1] === "trenerzy" && window.TWA ? screen("Trenerzy", window.TWA.trainersHtml(), { back: "#ustawienia", eyebrow: "Asystent" }) : p[1] === "sprzet" ? viewEquip() : p[1] === "cel" ? viewGoal() : p[1] === "kalorie" ? viewCalc("#ustawienia") : viewSettings();
    const y = window.scrollY, same = location.hash === render.last;
    $app.innerHTML = html;
    document.body.classList.toggle("is-fs", fs);
    document.querySelectorAll("#nav a").forEach((a) => { if (a.dataset.view === v) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
    const h1 = $app.querySelector("h1");
    document.title = `${h1 ? h1.textContent : "ApexFit"} · ApexFit`;
    if (!same) { window.scrollTo(0, 0); const sc = $app.firstElementChild; if (sc) sc.classList.add("enter"); } else window.scrollTo(0, y);
    render.last = location.hash;
    if (fs && p[0] === "trening" && WK && !WK.finished) wake(true); else if (!fs || p[0] !== "trening") wake(false);
    setupVideos();
    { const g = new URLSearchParams(location.search).get("goto"); if (g && !render.went) { render.went = 1; setTimeout(() => { const e = document.getElementById(g); if (e) e.scrollIntoView({ block: "start" }); window.scrollBy(0, -70); }, 350); } } // tylko testy podglądu
    emit("render", { route: location.hash });
  }
  let io;
  function setupVideos() {
    if (io) io.disconnect();
    const vids = $app.querySelectorAll("video");
    io = "IntersectionObserver" in window ? new IntersectionObserver((entries) => entries.forEach((en) => {
      const v = en.target;
      if (en.isIntersecting) { const pr = v.play(); if (pr && pr.catch) pr.catch(() => {}); } else v.pause();
    }), { threshold: 0.25 }) : null;
    vids.forEach((v) => { v.muted = true; v.defaultMuted = true; if (io) io.observe(v); else { const pr = v.play(); if (pr && pr.catch) pr.catch(() => {}); } });
  }
  function goBack(fallback) {
    if (navStack.length > 1) history.back(); else go(fallback || "#dzis");
  }
  window.addEventListener("hashchange", () => {
    const h = location.hash || "#dzis";
    // wyjście z trwającego treningu (np. przycisk Wstecz w Androidzie) — najpierw potwierdzenie
    if (/^#trening\/sesja\//.test(prevHash) && !/^#trening\/sesja\//.test(h) && WK && !WK.finished) {
      history.pushState(null, "", prevHash);
      confirmExit(h);
      return;
    }
    if (navStack.length > 1 && navStack[navStack.length - 2] === h) navStack.pop();
    else if (replacing) navStack[navStack.length - 1] = h;
    else navStack.push(h);
    replacing = false; prevHash = h;
    render();
  });
    function go(h) { if (h === location.hash) return render(); replacing = true; location.replace(h); }
  function updateNutrition() {
    const res = document.getElementById("nutri-results");
    if (res) res.innerHTML = nutritionResults();
    save();
  }

  // ---------- zdarzenia ----------
  document.addEventListener("click", (e) => {
    const t = e.target;
    const wk = t.closest("[data-wk]"); if (wk) { wkAction(wk.dataset.wk); return; }
    if (t.closest("[data-exit]")) { confirmExit(); return; }
    const bk = t.closest("a[data-back]"); if (bk) { e.preventDefault(); goBack(bk.getAttribute("href")); return; }
    const rp = t.closest("a[data-replace]"); if (rp) { e.preventDefault(); go(rp.getAttribute("href")); return; }
    if (t.closest("[data-start]")) { buzz(25); if (WK && WK.finished) { WK = null; saveWK(); } }
    if (!$app.contains(t)) return;
    const b = t.closest(".seg button");
    if (b) {
      const name = b.parentElement.dataset.seg, raw = b.dataset.val;
      buzz(8);
      if (name === "sex") { switchSex(raw); return; }
      if (name === "kcalMode") {
        if (raw === "manual" && !clampKcal(S.kcalManual[S.sex])) S.kcalManual[S.sex] = clampKcal(kcalTarget().kcal);
        S.kcalMode[S.sex] = raw === "manual" ? "manual" : "auto"; save(); render(); return;
      }
      S[name] = /^\d+$/.test(raw) ? Number(raw) : raw;
      save(); render(); return;
    }
    const gb = t.closest("[data-goal]"); if (gb) { buzz(10); setGoal(gb.dataset.goal); return; }
    const nt = t.closest("[data-ntab]"); if (nt) { S.nWeek = S.week; save(); }
    if (t.id === "clear-buy") { delete S.bought[boughtKey()]; save(); render(); return; }
    const c = t.closest(".chip[data-grp]");
    if (c) { S.grp = c.dataset.grp; save(); buzz(8); c.parentElement.querySelectorAll(".chip").forEach((x) => x.setAttribute("aria-pressed", String(x === c))); refreshLib(); return; }
    const pk = t.closest("[data-pick]");
    if (pk) {
      S.choice = S.choice || {};
      if (pk.dataset.def) delete S.choice[pk.dataset.key]; else S.choice[pk.dataset.key] = pk.dataset.pick;
      const kp = pk.dataset.key.split(":"); S.nWeek = Number(kp[1]) + 1; S.nDay = Number(kp[2]);
      save(); buzz(30); const pv = navStack[navStack.length - 2]; if (pv === "#zywienie/menu" || pv === "#dzis/jadlospis") history.back(); else go("#zywienie/menu"); return;
    }
    if (t.closest("[data-spotify]")) buzz(15);
    if (t.id === "spotify-clear") { S.spotify = ""; save(); render(); return; }
    if (t.closest("#clear-log")) {
      modal("Wyczyścić historię?", "Usunie to zapisane serie (ciężar, powtórzenia) i ukończone treningi. Tej operacji nie można cofnąć.", "Wyczyść", () => { LOG.ex = {}; LOG.sessions = []; saveLog(); render(); });
    }
  });
  function refreshLib() { const el = document.getElementById("lib-items"); if (el) { el.innerHTML = libItems(); setupVideos(); } }
  $app.addEventListener("input", (e) => {
    const t = e.target;
    if (t.id === "lib-q") { libQ = t.value; refreshLib(); return; }
    if (t.id === "weight") { S.weight = t.value; updateNutrition(); }
    if (t.id === "kcal-range") { const v = clampKcal(t.value); S.kcalManual[S.sex] = v; const n = document.getElementById("kcal-num"); if (n) n.value = v; updateNutrition(); }
    if (t.id === "kcal-num") { const v = Number(t.value); if (v >= KCAL_MIN && v <= KCAL_MAX) { S.kcalManual[S.sex] = clampKcal(v); const r = document.getElementById("kcal-range"); if (r) r.value = S.kcalManual[S.sex]; updateNutrition(); } }
  });
  $app.addEventListener("change", (e) => {
    const t = e.target;
    if (t.id === "kf" || t.id === "pf") { S[t.id] = t.value; updateNutrition(); }
    if (t.id === "kcal-num") { const v = clampKcal(t.value) || clampKcal(S.kcalManual[S.sex]) || KCAL_MIN; S.kcalManual[S.sex] = v; t.value = v; const r = document.getElementById("kcal-range"); if (r) r.value = v; updateNutrition(); }
    if (t.id === "goal-sel") setGoal(t.value);
    if (t.dataset.eq) { S.equip[t.dataset.eq] = t.checked; save(); buzz(8); return; }
    if (t.id === "only-av") { S.onlyAv = t.checked; save(); refreshLib(); return; }
    if (t.id === "spotify-url") {
      const v = t.value.trim(), n = spotifyNorm(v);
      S.spotify = n || v; save();
      if (!v || n) { render(); return; }
      const msg = document.getElementById("spotify-msg"); if (msg) msg.textContent = "Ten link nie wygląda na link Spotify (open.spotify.com, spotify.link lub spotify:playlist:…) — przycisk otworzy wyszukiwanie.";
      document.querySelectorAll("[data-spotify]").forEach((a) => a.setAttribute("href", spotifyHref()));
      return;
    }
    if (t.dataset.eaten != null) {
      const k = dayKey(Date.now()); S.eaten = S.eaten || {};
      Object.keys(S.eaten).forEach((d) => { if (d !== k && Object.keys(S.eaten).length > 14) delete S.eaten[d]; });
      const E = S.eaten[k] = S.eaten[k] || {};
      if (t.checked) E[t.dataset.eaten] = Number(t.dataset.k) || 0; else delete E[t.dataset.eaten];
      save(); buzz(t.checked ? 25 : 8); emit("meal-eaten", { on: t.checked, kcal: Number(t.dataset.k) || 0 }); return;
    }
    if (t.dataset.buy) { const k = boughtKey(); S.bought[k] = S.bought[k] || {}; S.bought[k][t.dataset.buy] = t.checked; save(); buzz(8); }
  });
  function setGoal(k) {
    if (!GOALS[k] || k === S.goal) return;
    S.goal = k; S.kf = GOALS[k].kfDef; S.pf = GOALS[k].pfDef; save(); render();
  }
  function switchSex(n) {
    if (!PROF_DEF[n] || n === S.sex) return;
    S.prof[S.sex] = { goal: S.goal, weight: S.weight, kf: S.kf, pf: S.pf };
    S.sex = n;
    Object.assign(S, PROF_DEF[n], S.prof[n] || {});
    save(); render();
  }
  window.TW = { plan, ctx, state: () => S, dayPlan, kcalTarget, buildSession, chosenMeals, altsFor, spotifyNorm, spotifyHref, log: () => LOG, session: () => WK, render, dayKey };
  render();
})();
