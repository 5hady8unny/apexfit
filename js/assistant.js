/* Trening w domu — interaktywny asystent (v1.3.3). Postać dnia, emocje, czat offline, mowa przez most Androida,
   tryb rozmowy głosowej (ciągła rozmowa), Zając jako cała, animowana postać. */
"use strict";
(function () {
  const KEY = "trening-w-domu:asystent", HIST = "trening-w-domu:asystent-czat";
  const EMO = ["neutral", "laugh", "irritated", "angry", "warning", "motivated", "happy", "sleepy"];
  const CHARS = {
    rico: { name: "Rico", who: "husky", g: "m", hi: "Auuu! Tu Rico.", style: "energiczny husky, który kocha ruch i żarty",
      about: "Jestem Rico, husky z charakterem! Kocham ruch, śnieg i dobre żarty. Będę Cię gonił do treningu jak psi zaprzęg — z uśmiechem, ale konsekwentnie.",
      jokes: ["Wiesz, czemu husky nie oszukuje na powtórzeniach? Bo ma wszystko pod kontrolą… oprócz ogona!", "Mówią, że pies to najlepszy przyjaciel człowieka. Ja dodaję: a przysiad — najlepszy przyjaciel nóg!", "Ostatnio próbowałem wyć w rytm Spotify. Sąsiedzi poprosili o krótszą przerwę między seriami."],
      tap: ["Hej! Gotowy na trening?", "Auuu! Działamy?", "Dotknij mnie dłużej — pogadamy!", "Rico melduje się na służbie!"],
      fallback: "Hmm, tego tropu nie złapałem. Zapytaj mnie o dzisiejszy trening, kalorie, przepis albo konkretne ćwiczenie!" },
    pitbull: { name: "Pitbull", who: "pitbull", g: "m", hi: "Siema. Pitbull na posterunku.", style: "spokojny, silny trener z miękkim sercem",
      about: "Jestem Pitbull. Wyglądam groźnie, ale serce mam miękkie. Mówię krótko i konkretnie: robimy plan, pilnujemy techniki, jemy porządnie.",
      jokes: ["Najcięższy ciężar na siłowni? Drzwi wejściowe. Resztę już podniesiemy razem.", "Mój ulubiony kardio? Bieg po miskę. Ale Ty zrób normalny trening.", "Mówią, że jestem twardy. To przez przysiady, nie przez charakter."],
      tap: ["Konkret: dziś robimy swoje.", "Spokojnie, ale do roboty.", "Przytrzymaj dłużej — pogadamy.", "Siła to nawyk."],
      fallback: "Nie łapię. Pytaj konkretnie: trening na dziś, kalorie, przepis, przerwy albo nazwa ćwiczenia." },
    zajac: { name: "Zając", who: "zając", g: "m", hi: "Hop, hop! Tu Zając!", style: "szybki, energiczny sprinter",
      about: "Jestem Zając — najszybszy trener w tej aplikacji! Kocham sprinty, skakankę i interwały. Mówię szybko, ćwiczę szybko, ale technikę zawsze robię porządnie. Nogi mam ze stali, a uszy z radaru — usłyszę każdą wymówkę!",
      jokes: ["Żółw wygrał ze mną wyścig tylko raz. Od tamtej pory robię interwały codziennie!", "Moje ulubione cardio? Ucieczka przed lisem. Twoje może być skakanka — bezpieczniej!", "Mówią, że zając ma tchórzliwe serce. Moje po interwałach bije 180 i się nie boi!", "Skąd mam takie łydki? Z podskoków. I z marchewek po treningu!"],
      tap: ["Hop! Szybciutko na trening?", "Jestem szybszy niż Twoja wymówka!", "Dotknij mnie dwa razy — pogadamy w biegu!", "Raz, dwa, trzy — sprint!"],
      fallback: "Ups, przeskoczyłem to pytanie! Zapytaj szybko o dzisiejszy trening, kalorie, przepis, cardio albo konkretne ćwiczenie!" },
    atena: { name: "Atena", who: "kotka brytyjska", g: "k", hi: "Witaj, tu Atena.", style: "mądra, spokojna strateżka",
      about: "Jestem Atena, kotka brytyjska. Lubię plan, porządek i mądre decyzje. Podpowiem Ci, jak ćwiczyć z głową i jeść tak, żeby mieć siłę.",
      jokes: ["Koty śpią 16 godzin na dobę. Ty nie musisz — wystarczy 7–9, żeby mięśnie rosły.", "Mój sekret elegancji? Proste plecy przy martwym ciągu.", "Mruczę z zadowolenia za każdą zrobioną serię. Dziś trochę pomruczymy?"],
      tap: ["Mrrr… Gotowa na plan na dziś?", "Spokojnie i z głową — tak wygrywamy.", "Przytrzymaj mnie dłużej, porozmawiamy.", "Technika przed ciężarem."],
      fallback: "Nie jestem pewna, o co pytasz. Spróbuj: trening na dziś, kalorie, przepis, przerwa albo nazwa ćwiczenia." },
    lapka: { name: "Łapka", who: "kotka", g: "k", hi: "Hejka! Tu Łapka!", style: "radosna, pełna energii kotka",
      about: "Jestem Łapka! Uwielbiam zabawę, dobrą muzykę i małe sukcesy. Będę Ci kibicować przy każdej serii i przypominać o posiłkach.",
      jokes: ["Próbowałam zrobić deskę… ale zasnęłam na macie. Ty wytrzymaj dłużej!", "Moja ulubiona część treningu? Przybijanie piątki po skończonej serii!", "Mam cztery łapki, a i tak najtrudniejsze są pompki!"],
      tap: ["Hejka! Ćwiczymy?", "Jesteś super! Łap piątkę!", "Przytrzymaj mnie dłużej — pogadamy!", "Mrau! Dziś będzie dobry dzień!"],
      fallback: "Ojej, nie zrozumiałam. Zapytaj mnie o trening na dziś, kalorie, przepis albo jakieś ćwiczenie!" },
    marta: { name: "Marta", who: "zajączka", g: "k", hi: "Cześć, tu Marta.", style: "spokojna, wspierająca, doświadczona trenerka",
      about: "Jestem Marta, zajączka z wieloletnim doświadczeniem na sali. Mówię spokojnie i rzeczowo: krok po kroku, bez presji, z dbałością o technikę i regenerację. Każdy postęp się liczy — a ja pomogę Ci go zauważyć.",
      jokes: ["Zające słyną z szybkości, ale ja wolę tempo kontrolowane — zwłaszcza przy opuszczaniu ciężaru!", "Moje uszy wyłapią każde westchnienie przy ostatnim powtórzeniu. Spokojnie — to znaczy, że pracujesz!", "Marchewka po treningu? Chętnie. Ale najpierw porcja białka!"],
      tap: ["Spokojnie, krok po kroku — dziś też damy radę.", "Jestem obok. Zaczniemy od rozgrzewki?", "Przytrzymaj mnie dłużej, porozmawiamy.", "Liczy się regularność, nie perfekcja."],
      fallback: "Nie jestem pewna, o co pytasz. Spróbuj zapytać o dzisiejszy trening, kalorie, przepis, przerwy albo konkretne ćwiczenie." },
    oliwka: { name: "Oliwka", who: "mała zajączka", g: "k", hi: "Hej, hej! Tu Oliwka!", style: "wesoła mała zajączka, która kocha zabawę",
      about: "Jestem Oliwka! Jestem małą zajączką i bardzo lubię skakać, biegać i się śmiać. Będę Ci kibicować najgłośniej na świecie! Ćwiczymy razem? To będzie super zabawa!",
      jokes: ["Wiesz, czemu zajączki mają duże uszy? Żeby słyszeć, jak mięśnie mówią „dziękuję”!", "Umiem skakać jak kangurek! No… prawie jak kangurek.", "Marchewka to moje paliwo rakietowe! Wziuuum!"],
      tap: ["Hej, hej! Pobawimy się w trening?", "Hop, hop! Jesteś super!", "Przytrzymaj mnie, to pogadamy!", "Piątka! Dasz radę!"],
      fallback: "Ojej, nie wiem, o co chodzi! Zapytaj mnie o trening na dziś, o jedzonko, kalorie albo jakieś ćwiczenie!" },
  };
  const def = { on: true, voice: false, mode: "text", overlay: false, pos: null, bx: null, first: 0, trainer: { m: "auto", k: "auto" } };
  let A = Object.assign({}, def, load(KEY));
  A.trainer = Object.assign({ m: "auto", k: "auto" }, A.trainer || {});
  const ROSTER = { m: ["rico", "pitbull", "zajac"], k: ["atena", "lapka", "marta", "oliwka"] };
  if (!A.first) { A.first = startOfDay(Date.now()); save(); }
  const NB = () => window.AndroidBridge || null;
  const TW = () => window.TW;
  function load(k) { try { return JSON.parse(localStorage.getItem(k)) || {}; } catch (e) { return {}; } }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(A)); } catch (e) { /* brak */ } }
  function startOfDay(t) { const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); }
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ł/g, "l").replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const sex = () => { const t = TW(); return t ? t.state().sex : "m"; };
  // Mężczyźni: Pn, Czw, Nd → Rico; Wt, Pt → Pitbull; Śr, Sob → Zając. Kobiety: Pn, Pt → Atena; Wt, Sob → Łapka; Śr, Nd → Marta; Czw → Oliwka
  function rotation(day, sx) {
    if (sx === "k") return [1, 5].includes(day) ? "atena" : [2, 6].includes(day) ? "lapka" : day === 4 ? "oliwka" : "marta";
    return [1, 4, 0].includes(day) ? "rico" : [2, 5].includes(day) ? "pitbull" : "zajac";
  }
  const QAS = new URLSearchParams(location.search).get("as");
  function charOfDay(d) {
    const sx = sex(), t = A.trainer[sx];
    if (QAS && CHARS[QAS] && ROSTER[sx].includes(QAS)) return QAS;
    if (t && t !== "auto" && ROSTER[sx].includes(t)) return t;
    return rotation((d || new Date()).getDay(), sx);
  }
  const rotText = (sx) => sx === "k" ? "pn, pt: Atena · wt, sob: Łapka · śr, nd: Marta · czw: Oliwka" : "pn, czw, nd: Rico · wt, pt: Pitbull · śr, sob: Zając";
  const C = () => CHARS[charOfDay()];
  const img = (c, e) => `img/asst/${c}-${EMO.includes(e) ? e : "neutral"}.webp`;
  const her = () => C().g === "k";

  // ---------- stan użytkownika → nastrój ----------
  const dayKey = (t) => { const d = new Date(t); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; };
  function doneOn(t) { const L = TW() ? TW().log().sessions : []; const k = dayKey(t); return L.some((x) => dayKey(x.t) === k); }
  function isTrainingDay(t) { const p = TW() && TW().plan(); if (!p) return false; const di = (new Date(t).getDay() + 6) % 7; return p[di] && p[di].type === "trening"; }
  function missedDays() { // treningi pominięte w ostatnich 7 dniach (nie liczymy dni sprzed pierwszego uruchomienia asystenta)
    let n = 0; const today = startOfDay(Date.now());
    for (let i = 1; i <= 7; i++) { const t = today - i * 864e5 + 36e5 * 12; if (t < A.first) break; if (isTrainingDay(t) && !doneOn(t)) n++; }
    // jeśli po pominięciu był zrobiony trening — liczymy tylko pominięcia po ostatnim treningu
    const L = TW() ? TW().log().sessions : []; const last = L.length ? L[L.length - 1].t : 0; let m = 0;
    for (let i = 1; i <= 7; i++) { const t = today - i * 864e5 + 36e5 * 12; if (t < A.first || t < last) break; if (isTrainingDay(t) && !doneOn(t)) m++; }
    return Math.min(n, m);
  }
  function kcalIssue() { // ręczne kalorie wyraźnie poza planem
    const t = TW(); if (!t) return null; const S = t.state(), T = t.kcalTarget();
    if (!T.manual) return null;
    const auto = Math.round((T.kg * Number(S.kf)) / 10) * 10, floor = T.floor || 0, base = Math.max(auto, floor);
    if (floor && T.kcal < floor) return { low: true, kcal: T.kcal, base };
    if (T.kcal < base * 0.8) return { low: true, kcal: T.kcal, base };
    if (T.kcal > base * 1.25) return { low: false, kcal: T.kcal, base };
    return null;
  }
  function eatenToday() { const t = TW(); if (!t) return { n: 0, k: 0 }; const e = (t.state().eaten || {})[dayKey(Date.now())] || {}; return Object.keys(e).reduce((a, k) => ({ n: a.n + 1, k: a.k + (Number(e[k]) || 0) }), { n: 0, k: 0 }); }
  function baseMood() {
    const h = new Date().getHours(), miss = missedDays(), kc = kcalIssue(), done = doneOn(Date.now()), eat = eatenToday();
    if (miss >= 2) return "angry";
    if (kc) return "warning";
    if (h >= 21 || h < 5) return "sleepy";
    if (h >= 20 && TW() && eat.n && eat.k < TW().kcalTarget().kcal * 0.6) return "warning";
    if (miss === 1 && !done) return "irritated";
    if (isTrainingDay(Date.now()) && !done) return "motivated";
    if (done || eat.n) return "happy";
    return "neutral";
  }
  function moodLine(m) {
    const c = C(), k = kcalIssue(), miss = missedDays(), f = her();
    switch (m) {
      case "angry": return `Hej! ${miss} treningi pominięte z rzędu. ${c.name} jest ${f ? "zła" : "zły"} — wracamy do planu dziś!`;
      case "warning": return k ? (k.low ? `Uwaga: ${k.kcal} kcal to za mało względem planu (ok. ${k.base} kcal). Zadbaj o energię!` : `Uwaga: ${k.kcal} kcal to sporo ponad plan (ok. ${k.base} kcal).`) : "Dziś zjedzone mniej niż 60% planu. Dorzuć porządny posiłek!";
      case "sleepy": return "Ziew… Już późno. Sen to też trening — regeneracja!";
      case "irritated": return "Wczoraj trening przepadł… Dziś nadrabiamy, dobrze?";
      case "motivated": return "Dziś dzień treningowy! Kliknij „Start treningu” i działamy.";
      case "happy": return doneOn(Date.now()) ? "Trening na dziś zrobiony. Jestem z Ciebie dumny!".replace("dumny", f ? "dumna" : "dumny") : "Posiłek zgodny z planem — tak trzymaj!";
      default: return pick(c.tap);
    }
  }

  // ---------- pływający awatar ----------
  // Zając: cała, animowana postać (animowane WebP z kanałem alfa). Pozostali: twarz w kółku (jak w 1.3).
  // v1.3.4: Zając większy — wysokość zależna od ekranu: clamp(170px, 26vh, 240px); r = szerokość/wysokość klipu
  // v1.3.5: wszystkie 7 postaci to całe, animowane figury. s = skala wysokości (wyrównanie widocznego wzrostu: dorośli ≈ Zając, Oliwka ≈ 76%);
  // klipy wszystkich siedmiu postaci są w aplikacji (img/anim/{postać}-{ruch}.webp, 168×333, ~6 kl./s).
  const BODY = { zajac: { r: 168 / 333, s: 1 }, rico: { r: 168 / 333, s: 1.1 }, pitbull: { r: 168 / 333, s: 1.1 }, atena: { r: 168 / 333, s: 1 },
    lapka: { r: 168 / 333, s: 1.1 }, marta: { r: 168 / 333, s: 1.1 }, oliwka: { r: 168 / 333, s: 0.95 } };
  const bodyH = () => Math.round(Math.min(240, Math.max(170, window.innerHeight * 0.26)) * ((BODY[body] || BODY.zajac).s));
  const CLIPS = { idle: 4000, hop: 1992, jump: 2988, laugh: 2988, wave: 2988, irritated: 2988, sleepy: 4000, motivated: 2988, warning: 2988 };
  const MOOD_CLIP = { neutral: "idle", happy: "wave", laugh: "laugh", irritated: "irritated", angry: "irritated", warning: "warning", motivated: "motivated", sleepy: "sleepy" };
  const RM = () => { try { return matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; } };
  let el, imgEl, bub, moodT, bubT, cur = "", tempUntil = 0;
  let body = null, bMood = "", clipT = null, wanderT = null, raf = null, bstate = "idle", lastAct = Date.now(), blobs = {};
  const clipSrc = (c, n) => `img/anim/${c}-${n}.webp`; // v1.3.5: wszystkie 7 zestawów klipów jest w aplikacji
  const isBody = () => !!BODY[charOfDay()];
  const SZ = () => { if (!body) return { w: 70, h: 70 }; const h = bodyH(); return { w: Math.round(h * BODY[body].r), h }; };
  function build() {
    if (el) return;
    el = document.createElement("div");
    el.className = "as-fab"; el.setAttribute("role", "button"); el.setAttribute("tabindex", "0");
    el.innerHTML = `<img alt="" draggable="false"><span class="as-dot" aria-hidden="true"></span>`;
    imgEl = el.querySelector("img");
    bub = document.createElement("div"); bub.className = "as-bub"; bub.setAttribute("aria-live", "polite");
    document.body.appendChild(el); document.body.appendChild(bub);
    bindDrag();
    el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); if (body) { if (quiet && convo) convoStop(); else doubleTap(); } else openChat(); } });
    window.addEventListener("resize", () => { if (body) { const z = SZ(); el.style.width = z.w + "px"; el.style.height = z.h + "px"; } place(); });
    let scrT; window.addEventListener("scroll", () => { el.classList.add("as-scr"); clearTimeout(scrT); scrT = setTimeout(() => el.classList.remove("as-scr"), 900); }, { passive: true });
    new MutationObserver(vis).observe(document.body, { attributes: true, attributeFilter: ["class"] });
  }
  function setLabel() { el.setAttribute("aria-label", body ? `Asystent ${C().name} — dotknij, aby zobaczyć reakcję; dotknij dwa razy, aby ${VOICE() ? "porozmawiać głosowo" : "otworzyć czat"}` : `Asystent ${C().name} — dotknij, aby zobaczyć reakcję; przytrzymaj, aby otworzyć czat`); }
  // tryb całej postaci: włącz/wyłącz zależnie od trenera dnia
  function applyLook() {
    const want = isBody() ? charOfDay() : null;
    if (want === body) return;
    body = want; cur = ""; bMood = ""; stopMove(); clearTimeout(clipT); clearTimeout(wanderT);
    el.classList.toggle("as-body", !!body);
    if (body) { const z = SZ(); el.style.width = z.w + "px"; el.style.height = z.h + "px"; preload(body); }
    else { el.style.width = ""; el.style.height = ""; }
    place();
  }
  function preload(c) {
    if (!window.fetch) return;
    Object.keys(CLIPS).forEach((n) => { const k = c + "-" + n; if (blobs[k]) return; blobs[k] = "…";
      fetch(clipSrc(c, n)).then((r) => r.ok ? r.blob() : null).then((b) => { blobs[k] = b ? URL.createObjectURL(b) : null; }).catch(() => { blobs[k] = null; }); });
  }
  let clipN = 0;
  function clipUrl(n) { const k = body + "-" + n, u = blobs[k]; return u && u !== "…" ? u + "#" + (++clipN) : `${clipSrc(body, n)}?v=${++clipN}`; }
  // odtwórz klip od pierwszej klatki; loop — powtarzaj; then — po zakończeniu
  function clip(n, loop, then) {
    if (!body || !CLIPS[n]) return;
    imgEl.src = clipUrl(n); cur = "anim:" + n; el.dataset.clip = n;
    clearTimeout(clipT);
    clipT = setTimeout(() => { if (loop) clip(n, true); else if (then) then(); else idle(); }, CLIPS[n]);
  }
  function idle() { if (!body) return; bstate = "idle"; clip("idle", true); scheduleWander(); }
  function scheduleWander() {
    clearTimeout(wanderT);
    if (!body) return;
    wanderT = setTimeout(() => {
      if (!body || bstate !== "idle" || el.hidden) { scheduleWander(); return; }
      if (Date.now() - lastAct > 60000 && bMood !== "sleepy") { clip("sleepy", false); lastAct = Date.now() - 30000; scheduleWander(); return; }
      if (bMood === "sleepy") { clip("sleepy", false); scheduleWander(); return; }
      if (!RM() && Math.random() < 0.7) walk(); else scheduleWander();
    }, 7000 + Math.random() * 7000);
  }
  // dolna krawędź dostępnego obszaru: nad pływającym paskiem zakładek (wysokość mierzona z DOM — działa też przy 3-przyciskowej nawigacji)
  function navTop() {
    const h = window.innerHeight; if (window.innerWidth >= 900) return h - 6;
    const n = document.querySelector(".sidebar"); if (!n || n.offsetParent === null && getComputedStyle(n).position !== "fixed") return h - 6;
    return Math.round(n.getBoundingClientRect().top) - 4;
  }
  function headerBottom() { const t = document.querySelector(".top"); return t ? Math.max(4, Math.round(t.getBoundingClientRect().bottom) + 2) : 4; }
  function ground() { return navTop() - SZ().h + 2; }
  function stopMove() { if (raf) cancelAnimationFrame(raf); raf = null; if (el) el.classList.remove("flip"); }
  function walk() {
    stopMove(); bstate = "walk"; clip("hop", true);
    const w = window.innerWidth, z = SZ(), p = el._p || place();
    const tx = Math.max(6, Math.min(w - z.w - 6, 12 + Math.random() * (w - z.w - 24))), dir = Math.sign(tx - p.x) || 1;
    el.classList.toggle("flip", dir < 0);
    let last = performance.now();
    const step = (t) => { const dt = Math.min(40, t - last); last = t; const q = el._p; let nx = q.x + dir * 0.075 * dt;
      const done = (dir > 0 && nx >= tx) || (dir < 0 && nx <= tx); if (done) nx = tx;
      place({ x: nx, y: ground() });
      if (done || el.hidden) { raf = null; el.classList.remove("flip"); A.bx = el._p.x; save(); idle(); return; }
      raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
  }
  // lot po rzucie (vy<0) albo opadanie po puszczeniu w powietrzu (vy≈0)
  function arc(vy, vx, jumpClip) {
    stopMove(); bstate = "air"; clip(jumpClip ? "jump" : "hop", false, () => {});
    let v = Math.max(-1.7, Math.min(0.2, vy)), hv = Math.max(-0.6, Math.min(0.6, vx * 0.5)), last = performance.now();
    const g = 0.0028, w = window.innerWidth;
    const step = (t) => { const dt = Math.min(32, t - last); last = t; v += g * dt; const q = el._p;
      let ny = q.y + v * dt, nx = Math.max(4, Math.min(w - SZ().w - 4, q.x + hv * dt)); if (ny < 6) { ny = 6; v = Math.abs(v) * 0.2; }
      const gy = ground();
      if (ny >= gy) { place({ x: nx, y: gy }); raf = null; land(); return; }
      place({ x: nx, y: ny }); raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
  }
  function land() {
    A.bx = el._p.x; save();
    try { imgEl.animate([{ transform: "scale(1.06,.9)", transformOrigin: "50% 100%" }, { transform: "none", transformOrigin: "50% 100%" }], { duration: 200, easing: "ease-out" }); } catch (e) { /* brak */ }
    clearTimeout(clipT); clipT = setTimeout(idle, el.dataset.clip === "jump" ? 600 : 150);
  }
  function show(m, ms) {
    if (!el) return;
    applyLook();
    el.dataset.mood = m;
    clearTimeout(moodT); tempUntil = ms ? Date.now() + ms : 0;
    if (body) {
      const n = MOOD_CLIP[m] || "idle";
      if (ms) { // chwilowa reakcja (dotyk, zdarzenie): klip raz, potem spoczynek
        if (bstate === "drag" || bstate === "air") return;
        stopMove(); bstate = "act"; clip(n === "idle" ? "wave" : n, false); return;
      }
      if (m === bMood && cur.startsWith("anim:")) return; // nastrój bez zmian — nie restartuj animacji
      bMood = m;
      if (bstate === "drag" || bstate === "air" || bstate === "walk") return;
      if (n === "idle") idle(); else { bstate = "act"; clip(n, false); }
      return;
    }
    const c = charOfDay(), src = img(c, m);
    if (cur !== src) { imgEl.src = src; cur = src; }
    if (ms) moodT = setTimeout(() => show(baseMood()), ms);
  }
  function say(text, ms) {
    if (!bub || !text) return;
    // v1.3.4: Zając w trybie głosowym — bez dymków z tekstem, tylko mówi (w trakcie rozmowy nie przerywa)
    if (body && VOICE()) { bub.classList.remove("on"); if (!convo && !el.hidden) speak(text); return; }
    bub.textContent = text; bub.classList.add("on"); placeBub();
    clearTimeout(bubT); bubT = setTimeout(() => bub.classList.remove("on"), ms || 3200);
  }
  function vis() {
    if (!el) return;
    const hide = !A.on || document.body.classList.contains("is-fs") || document.body.classList.contains("as-chat-open") || !!document.querySelector(".modal");
    el.hidden = hide; if (hide) { bub.classList.remove("on"); if (quiet && convo) convoStop(); if (body && (bstate === "walk")) { stopMove(); idle(); } }
  }
  function defPos() { const w = window.innerWidth; return { x: w - 70 - 14, y: navTop() - 70 - 6 }; }
  function place(p) {
    if (!el) return;
    const w = window.innerWidth, h = window.innerHeight, z = SZ();
    if (body) p = p || { x: A.bx != null ? A.bx : w - z.w - 14, y: ground() };
    else p = p || A.pos || defPos();
    p = { x: Math.min(Math.max(4, p.x), w - z.w - 4), y: Math.min(Math.max(headerBottom(), p.y), Math.max(headerBottom(), navTop() - z.h + 2)) };
    el.style.transform = `translate(${Math.round(p.x)}px, ${Math.round(p.y)}px)`; el._p = p; placeBub();
    return p;
  }
  function placeBub() {
    if (!bub || !el || !el._p) return;
    const p = el._p, w = window.innerWidth, bw = Math.min(260, w - 24), z = SZ(), hb = headerBottom(), nt = navTop();
    bub.style.maxWidth = bw + "px"; bub.style.width = bw + "px";
    const left = Math.min(Math.max(12, p.x + z.w / 2 - bw / 2), w - bw - 12);
    const roomAbove = p.y - hb - 8, roomBelow = nt - (p.y + z.h) - 8;
    bub.style.left = left + "px"; bub.style.maxHeight = "";
    if (roomAbove >= 64) { bub.style.top = ""; bub.style.bottom = (window.innerHeight - p.y + 8) + "px"; bub.style.maxHeight = roomAbove + "px"; }
    else if (roomBelow >= 64) { bub.style.bottom = ""; bub.style.top = (p.y + z.h + 8) + "px"; bub.style.maxHeight = roomBelow + "px"; }
    else { bub.style.bottom = ""; bub.style.top = (hb + 6) + "px"; bub.style.maxHeight = Math.max(64, nt - hb - 20) + "px"; }
  }
  function bindDrag() {
    let st = null, lp = null, taps = 0, tapT = null, track = [];
    el.addEventListener("pointerdown", (e) => {
      if (e.button) return;
      el.setPointerCapture(e.pointerId); lastAct = Date.now();
      st = { x: e.clientX, y: e.clientY, p: Object.assign({}, el._p), drag: false, long: false };
      track = [{ x: e.clientX, y: e.clientY, t: e.timeStamp }];
      // v1.3.4: Zając — przytrzymanie w aplikacji nic nie otwiera (można przeciągać); pozostali — przytrzymaj, aby otworzyć czat
      clearTimeout(lp); if (!body) lp = setTimeout(() => { if (st && !st.drag) { st.long = true; buzz(25); openChat(); } }, 550);
    });
    el.addEventListener("pointermove", (e) => {
      if (!st) return;
      const dx = e.clientX - st.x, dy = e.clientY - st.y;
      if (!st.drag && Math.hypot(dx, dy) > 9) { st.drag = true; clearTimeout(lp); el.classList.add("drag"); if (body) { stopMove(); bstate = "drag"; clearTimeout(wanderT); clip("hop", true); bub.classList.remove("on"); } }
      track.push({ x: e.clientX, y: e.clientY, t: e.timeStamp }); if (track.length > 8) track.shift();
      if (st.drag) { place({ x: st.p.x + dx, y: st.p.y + dy }); if (body && Math.abs(e.movementX || 0) > 1) el.classList.toggle("flip", e.movementX < 0); }
    });
    const end = (e, cancel) => {
      if (!st) return; clearTimeout(lp); lastAct = Date.now();
      const s = st; st = null; el.classList.remove("drag");
      if (s.long) return;
      if (s.drag) {
        const a = track[0], b = track[track.length - 1], dt = Math.max(1, b.t - a.t), vy = (b.y - a.y) / dt, vx = (b.x - a.x) / dt;
        if (body) {
          el.classList.remove("flip");
          if (!cancel && vy < -0.5 && Math.abs(vy) > Math.abs(vx) * 0.8) { arc(vy * 1.1, vx, true); say(pick(["Hop! Hahaha!", "Wiiii! Jeszcze raz!", "Skok jak po dobrym przysiadzie!"]), 2200); buzz(20); }
          else if (el._p.y < ground() - 2) arc(0.05, vx, false);
          else { A.bx = el._p.x; save(); idle(); }
          return;
        }
        A.pos = el._p; save();
        if (!cancel && vy < -0.9 && Math.abs(vy) > Math.abs(vx) * 1.2) jump();
        return;
      }
      if (cancel) return;
      if (body) { // v1.3.4: rozróżnienie dotknięć (~280 ms): 1 = reakcja, 2 = rozmowa głosowa / czat, 3–4 = śmiech, 5 = irytacja
        taps++; clearTimeout(tapT);
        if (taps >= 5) { taps = 0; show("irritated", 3500); say(pick(["Ej, ej! Wystarczy tego klikania!", "Auć! Nie jestem przyciskiem do windy!", "Spokojnie, ja nie uciekam!"])); buzz(40); return; }
        tapT = setTimeout(() => { const n = taps; taps = 0; onTaps(n); }, TAP_MS);
        return;
      }
      taps++; clearTimeout(tapT);
      if (taps >= 5) { show("irritated", 3500); say(pick(["Ej, ej! Wystarczy tego klikania!", "Auć! Nie jestem przyciskiem do windy!", "Spokojnie, ja nie uciekam!"])); buzz(40); taps = 0; return; }
      if (taps === 3) { show("laugh", 3000); say(pick(["Hahaha, łaskocze!", "Hihi, przestań!", "Ha! Ale masz tempo — tak rób powtórzenia!"])); buzz(20); }
      tapT = setTimeout(() => { if (taps < 3) { const m = baseMood(); show(m === "neutral" ? "happy" : m, 3000); say(moodLine(m)); buzz(10); } taps = 0; }, 330);
    };
    el.addEventListener("pointerup", (e) => end(e, false));
    el.addEventListener("pointercancel", (e) => end(e, true));
    el.addEventListener("contextmenu", (e) => e.preventDefault());
  }
  const TAP_MS = 280;
  function onTaps(n) {
    if (quiet && convo) { buzz(20); convoStop(); return; } // dotknięcie podczas rozmowy głosowej kończy ją
    if (n === 2) { buzz(25); doubleTap(); return; }
    if (n >= 3) { show("laugh", 3000); say(pick(["Hahaha, łaskocze!", "Hihi, przestań!", "Ha! Ale masz tempo — tak rób powtórzenia!"])); buzz(20); return; }
    const m = baseMood(); show(m === "neutral" ? "happy" : m, 3000); say(moodLine(m)); buzz(10);
  }
  // podwójne dotknięcie: tryb głosowy — rozmowa bez okna czatu; tryb tekstowy — okno czatu
  function doubleTap() {
    if (VOICE()) { bub.classList.remove("on"); convoStart(true, true); }
    else openChat();
  }
  function jump() {
    el.classList.remove("jump"); void el.offsetWidth; el.classList.add("jump");
    show("laugh", 2600); say(pick(["Hop! Hahaha!", "Wiiii! Jeszcze raz!", "Skok jak po dobrym przysiadzie!"]), 2200); buzz(20);
    setTimeout(() => el.classList.remove("jump"), 700);
  }
  const buzz = (ms) => { try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) { /* brak */ } };

  // ---------- zdarzenia z aplikacji ----------
  function onAppEvent(ev) {
    const d = ev.detail || {};
    if (d.type === "workout-done") { setTimeout(() => { show("laugh", 4500); say(her() ? "Brawo! Trening zaliczony! Jestem z Ciebie dumna!" : "Brawo! Trening zaliczony! Jestem z Ciebie dumny!", 4500); }, 400); }
    else if (d.type === "meal-eaten") { if (d.on) { show("happy", 3500); say(pick(["Mniam! Posiłek z planu — świetnie!", "Zjedzone zgodnie z planem. Tak trzymaj!", "Dobre paliwo dla mięśni!"])); } }
    else if (d.type === "workout-exit") { show("irritated", 3500); say("Przerwany trening? Następnym razem dociśniemy do końca!"); }
    else if (d.type === "render") { sync(); }
  }
  function sync() {
    if (!A.on) { if (el) vis(); return; }
    build(); applyLook(); setLabel(); vis(); place();
    if (Date.now() >= tempUntil) show(baseMood());
    const b = NB(); try { if (b && b.setSex) b.setSex(sex()); if (b && b.setTrainer) { b.setTrainer("m", A.trainer.m); b.setTrainer("k", A.trainer.k); } } catch (e) { /* brak */ }
  }
  let greeted = false;
  function greet() {
    if (document.getElementById("splash")) { setTimeout(greet, 400); return; }
    if (greeted || !A.on || !el || el.hidden) return; greeted = true;
    const m = baseMood();
    if (m !== "neutral") setTimeout(() => say(moodLine(m), 4200), 900);
  }

  // ---------- czat ----------
  let chat = null, hist = [];
  try { hist = JSON.parse(sessionStorage.getItem(HIST)) || []; } catch (e) { hist = []; }
  const saveHist = () => { try { sessionStorage.setItem(HIST, JSON.stringify(hist.slice(-60))); } catch (e) { /* brak */ } };
  function openChat() {
    if (!TW()) return;
    document.body.classList.add("as-chat-open"); vis();
    if (!chat) {
      chat = document.createElement("div"); chat.className = "as-chat"; chat.setAttribute("role", "dialog"); chat.setAttribute("aria-modal", "true");
      document.body.appendChild(chat);
      chat.addEventListener("click", onChatClick);
      chat.addEventListener("submit", (e) => { e.preventDefault(); const i = chat.querySelector(".as-in"); send(i.value); i.value = ""; });
    }
    const c = C(), ch = charOfDay();
    chat.innerHTML = `<div class="as-card"><header class="as-head"><img class="as-av" src="${img(ch, baseMood())}" alt=""><div class="as-ht"><b>${esc(c.name)}</b><small>Twój asystent na dziś · ${esc(c.who)}</small></div>
      <button type="button" class="icon-btn as-x" data-as="close" aria-label="Zamknij czat"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></header>
      <div class="as-vbar" hidden role="status"><span class="as-vdot" aria-hidden="true"></span><span class="as-vtx">Słucham…</span><button type="button" class="as-vstop" data-as="vstop">Stop</button></div>
      <div class="as-log" aria-live="polite"></div>
      <div class="as-sugg">${["Jaki mam dziś trening?", "Ile mam jeść kalorii?", "Co zjeść na obiad?", "Co to zapas powtórzeń?", "Zmotywuj mnie", "Opowiedz o sobie"].map((s) => `<button type="button" data-q="${esc(s)}">${esc(s)}</button>`).join("")}</div>
      <form class="as-form"><button type="button" class="as-mic" data-as="mic" aria-label="Mów do asystenta"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0013 0M12 17.5V21"/></svg></button>
        <input class="as-in" type="text" enterkeyhint="send" autocomplete="off" placeholder="Napisz do: ${esc(c.name)}…" aria-label="Wiadomość">
        <button type="submit" class="as-send" aria-label="Wyślij"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l16-8-6 16-2.5-6.5z"/></svg></button></form></div>`;
    const log = chat.querySelector(".as-log");
    if (!hist.length) addMsg("bot", `${c.hi} ${moodLine(baseMood())} Zapytaj mnie o trening, kalorie, przepisy albo technikę ćwiczeń.`, null, true);
    else hist.forEach((m) => log.appendChild(msgEl(m)));
    log.scrollTop = log.scrollHeight;
    chat.hidden = false;
    history.pushState({ asChat: 1 }, "", location.href);
    if (VOICE()) setTimeout(() => { if (chat && !chat.hidden && !convo) convoStart(true); }, 350);
  }
  function closeChat(fromPop) {
    if (!chat || chat.hidden) return;
    convoStop(); stopListen(); ttsStop();
    chat.hidden = true; document.body.classList.remove("as-chat-open"); vis();
    if (!fromPop && history.state && history.state.asChat) history.back();
  }
  window.addEventListener("popstate", () => { if (chat && !chat.hidden) closeChat(true); }, true);
  function msgEl(m) {
    const d = document.createElement("div"); d.className = "as-msg " + m.who;
    d.innerHTML = `<p>${esc(m.text).replace(/\n/g, "<br>")}</p>${m.links && m.links.length ? `<div class="as-links">${m.links.map(([h, l]) => `<a href="${esc(h)}" data-as="go">${esc(l)}</a>`).join("")}</div>` : ""}`;
    return d;
  }
  function addMsg(who, text, links, quiet) {
    const m = { who, text, links: links || [] }; hist.push(m); saveHist();
    if (chat) { const log = chat.querySelector(".as-log"); log.appendChild(msgEl(m)); log.scrollTop = log.scrollHeight; }
    if (who === "bot" && !quiet && wantVoice()) speak(text);
  }
  // v1.3.5: odpowiedź AI (Gemini/Grok/ChatGPT) w roli trenera; bez klucza, offline lub przy błędzie/limicie — dotychczasowe odpowiedzi offline
  const AIHIST = 12;
  function aiSystem(voice) {
    const c = C(), f = her(), t = TW(), S = t ? t.state() : {}, ch = charOfDay();
    let ctxTxt = "";
    try {
      const tg = t.kcalTarget(), p = t.plan(), di = (new Date().getDay() + 6) % 7, d = p[di], w = S.week - 1;
      const names = d && d.type === "trening" ? d.slots.map((x) => exById(x.ex).name).join(", ") : "";
      const meals = t.dayPlan(w, di).meals.map((x) => `${x.label}: ${x.meal.name}`).join("; ");
      const n = t.log().sessions.filter((x) => x.t >= (() => { const dd = new Date(); dd.setHours(0, 0, 0, 0); dd.setDate(dd.getDate() - di); return dd.getTime(); })()).length;
      ctxTxt = `Użytkownik: ${S.sex === "k" ? "kobieta" : "mężczyzna"}; styl: ${S.style === "kal" ? "kalistenika" : "klasyczny"}; miejsce: ${S.loc === "silownia" ? "siłownia" : "dom"}; cel: ${t.ctx().goal}; masa ciała: ${S.weight} kg; poziom: ${S.level}.\n` +
        `Cel kalorii: ${tg.kcal} kcal (białko ${tg.prot} g, tłuszcze ${tg.fat} g, węglowodany ${tg.carb} g). Tydzień planu: ${S.week} z 4.\n` +
        `Dziś (${d ? d.full : ""}): ${d ? (d.type === "trening" ? "trening „" + d.name + "” — " + names : d.type === "cardio" ? "dzień cardio" : "odpoczynek") : ""}.\nJadłospis na dziś: ${meals}.\n` +
        `Ukończone treningi w tym tygodniu: ${n}. Aktualny nastrój postaci: ${baseMood()}.`;
    } catch (e) { ctxTxt = ""; }
    return `Jesteś ${c.name} — ${c.who}, ${f ? "trenerka" : "trener"} i asystent${f ? "ka" : ""} w aplikacji treningowej ApexFit. Charakter: ${c.style}. ${c.about}\n` +
      `ZASADY: Zawsze odpowiadaj po polsku, jako ${c.name}, w ${f ? "rodzaju żeńskim" : "rodzaju męskim"}, zachowując swoją osobowość i rolę trenera. ` +
      (voice ? "Twoja odpowiedź zostanie przeczytana na głos: maksymalnie 2–3 krótkie zdania (do 45 słów), prosty język, bez list, bez markdown, bez emotikon i znaków specjalnych. " : "Odpowiadaj zwięźle (zwykle 1–4 zdania, do 90 słów), bez markdown i bez emotikon; listy tylko gdy konieczne, zwykłym tekstem. ") +
      `Odpowiadaj na każde pytanie (także spoza treningu), ale nawiązuj do planu użytkownika, gdy to pasuje. Nie wymyślaj danych o użytkowniku — korzystaj tylko z kontekstu poniżej. ` +
      `BEZPIECZEŃSTWO: dawaj wyłącznie ogólne porady o treningu i żywieniu; nie stawiaj diagnoz, nie zalecaj leków, suplementów w dawkach ani diet wyniszczających; przy bólu, urazie, chorobie, ciąży lub zaburzeniach odżywiania zalecaj kontakt z lekarzem lub dietetykiem. Odmawiaj treści nieodpowiednich lub niebezpiecznych.` +
      (ch === "oliwka" ? ` Jesteś małą zajączką — rozmowa musi być przyjazna dzieciom: bardzo prosty, ciepły i wesoły język, krótkie zdania, zero treści dla dorosłych, przemocy, diet odchudzających ani liczenia kalorii w negatywnym tonie; zachęcaj do ruchu jako zabawy i do rozmowy z rodzicem lub opiekunem w ważnych sprawach.` : "") +
      `\n\nKONTEKST:\n${ctxTxt}`;
  }
  function aiMsgs(text) {
    const m = hist.filter((x) => x.who === "me" || x.who === "bot").slice(-AIHIST * 2).map((x) => ({ r: x.who === "me" ? "user" : "model", t: x.text }));
    while (m.length && m[0].r !== "user") m.shift();
    if (!m.length || m[m.length - 1].t !== text || m[m.length - 1].r !== "user") m.push({ r: "user", t: text });
    // sąsiednie wiadomości tej samej roli łączymy (wymóg Gemini)
    const out = []; m.forEach((x) => { const l = out[out.length - 1]; if (l && l.r === x.r) l.t += "\n" + x.t; else out.push({ r: x.r, t: x.t }); });
    return out;
  }
  let aiNote = "";
  // zwraca Promise<{text, links, mood, ai}>
  function reply(q, voice) {
    const off = () => answer(q);
    const AI = window.TWAI;
    if (!AI || !AI.enabled()) return Promise.resolve(off());
    return AI.ask(aiSystem(voice), aiMsgs(q)).then((t) => {
      t = String(t || "").replace(/[*_`#]+/g, "").trim();
      if (!t) return off();
      aiNote = ""; const o = off();
      return { text: t, links: (o.links || []).slice(0, 2), mood: o.mood || "happy", ai: true };
    }).catch((e) => { aiNote = (e && e.code) || "other"; const o = off(); o.err = aiNote; return o; });
  }
  let sendBusy = 0;
  function send(q) {
    q = String(q || "").trim(); if (!q) return;
    addMsg("me", q);
    const log = chat && chat.querySelector(".as-log"); let typing = null;
    const AI = window.TWAI, useAI = AI && AI.enabled();
    if (log && useAI) { typing = document.createElement("div"); typing.className = "as-msg bot as-typing"; typing.innerHTML = "<p><i></i><i></i><i></i></p>"; log.appendChild(typing); log.scrollTop = log.scrollHeight; }
    const id = ++sendBusy;
    reply(q, VOICE() && convo).then((r) => {
      if (typing && typing.parentNode) typing.parentNode.removeChild(typing);
      if (r.mood) { const av = chat && chat.querySelector(".as-av"); if (av) av.src = img(charOfDay(), r.mood); }
      let note = null;
      if (r.err && !send.warned) { send.warned = true; note = r.err === "quota" ? "Limit AI wyczerpany — odpowiadam trybem offline." : r.err === "auth" ? "Klucz API nie działa — odpowiadam trybem offline. Sprawdź go w Ustawieniach." : r.err === "timeout" ? "AI odpowiada zbyt wolno — odpowiadam trybem offline." : (r.err === "net" || r.err === "dns" || r.err === "ssl") ? "Nie udało się połączyć z AI — odpowiadam trybem offline. Szczegóły: Ustawienia → Sprawdź połączenie." : "AI chwilowo niedostępne — odpowiadam trybem offline."; }
      setTimeout(() => { addMsg("bot", r.text, r.links); if (note) addMsg("bot", note, null, true); }, useAI ? 0 : 280);
    });
  }
  function onChatClick(e) {
    const t = e.target;
    if (t === chat) { closeChat(); return; }
    const a = t.closest("[data-as]"), q = t.closest("[data-q]");
    if (q) { send(q.dataset.q); return; }
    if (!a) return;
    if (a.dataset.as === "close") closeChat();
    else if (a.dataset.as === "mic") { if (VOICE()) { if (convo) convoStop(); else convoStart(false); } else toggleListen(); }
    else if (a.dataset.as === "vstop") convoStop();
    else if (a.dataset.as === "go") { e.preventDefault(); const h = a.getAttribute("href"); const st = history.state && history.state.asChat; closeChat(); setTimeout(() => { location.hash = h; }, st ? 80 : 0); }
  }

  // ---------- dopasowanie intencji (offline) ----------
  const has = (q, re) => re.test(q);
  function findEx(q) {
    if (typeof EX === "undefined") return null;
    const words = q.split(" ").filter((w) => w.length >= 4);
    let best = null, bs = 0;
    EX.forEach((ex) => {
      const nw = norm(ex.name).split(" ").filter((w) => w.length >= 4);
      let s = 0; nw.forEach((w) => { if (words.some((x) => x.slice(0, 5) === w.slice(0, 5))) s += 1; });
      const sc = s / Math.max(1, nw.length) + s * 0.25;
      if (s && sc > bs) { bs = sc; best = ex; }
    });
    return bs >= 0.7 ? best : null;
  }
  function findDish(q) {
    if (typeof ALL_DISHES === "undefined") return null;
    const words = q.split(" ").filter((w) => w.length >= 4);
    let best = null, bs = 0;
    ALL_DISHES.forEach((x) => {
      const nw = norm(x.meal.name).split(" ").filter((w) => w.length >= 4);
      let s = 0; nw.forEach((w) => { if (words.some((y) => y.slice(0, 5) === w.slice(0, 5))) s++; });
      if (s >= 2 && s > bs) { bs = s; best = x; }
    });
    return best;
  }
  function workoutText(off) {
    const t = TW(), S = t.state(), p = t.plan(), di = ((new Date().getDay() + 6) % 7 + off) % 7, d = p[di];
    const when = off ? "Jutro" : "Dziś";
    if (d.type === "trening") {
      const names = d.slots.map((s) => (typeof exById === "function" ? exById(s.ex).name : s.ex));
      return { text: `${when} (${d.full.toLowerCase()}): ${d.name}, tydzień ${S.week}. Ćwiczenia: ${names.join(", ")}.${!off && doneOn(Date.now()) ? " Ten trening masz już dziś zrobiony — brawo!" : ""}`,
        links: [[`#trening/sesja/${di}`, "Start treningu"], [`#trening/dzien/${di}`, "Szczegóły dnia"]], mood: "motivated" };
    }
    if (d.type === "cardio") return { text: `${when} (${d.full.toLowerCase()}) jest dzień kondycyjny: ${typeof cardioPlan === "function" ? cardioPlan(t.ctx(), S.week - 1).text : "lekkie cardio"}.`, links: [[`#trening/dzien/${di}`, "Szczegóły dnia"]], mood: "motivated" };
    return { text: `${when} (${d.full.toLowerCase()}) masz wolne od ciężarów. ${d.short === "Śr" ? "Spacer i rozciąganie dobrze Ci zrobią." : "Odpoczywaj, śpij i jedz zgodnie z planem — mięśnie rosną w przerwie."}`, mood: "happy" };
  }
  function exText(ex) {
    const steps = (ex.steps || []).map((s, i) => `${i + 1}. ${s.title}: ${s.detail}`).join("\n");
    const mist = ex.mistakes && ex.mistakes.length ? `\nNajczęstsze błędy: ${ex.mistakes.join("; ").toLowerCase()}.` : "";
    return { text: `${ex.name} — pracują: ${String(ex.muscles || "").toLowerCase()}.\n${steps}${mist}`, links: [[`#cwiczenia/${ex.id}`, "Pokaż ćwiczenie"]], mood: "motivated" };
  }
  function kcalText() {
    const T = TW().kcalTarget(), k = kcalIssue(), e = eatenToday();
    let s = `Twój cel to ${T.kcal} kcal dziennie: białko ${T.prot} g, tłuszcze ${T.fat} g, węglowodany ${T.carb} g${T.manual ? " (kalorie ustawione samodzielnie)" : ""}.`;
    if (e.n) s += ` Dziś odhaczone: ${e.n} ${e.n === 1 ? "posiłek" : e.n < 5 ? "posiłki" : "posiłków"}, ok. ${Math.round(e.k / 10) * 10} kcal.`;
    if (k) s += k.low ? ` Uwaga: to wyraźnie mniej niż wynika z planu (ok. ${k.base} kcal).` : ` Uwaga: to wyraźnie więcej niż wynika z planu (ok. ${k.base} kcal).`;
    return { text: s, links: [["#zywienie/kalkulator", "Kalkulator kalorii"]], mood: k ? "warning" : "happy" };
  }
  function mealsText(q) {
    const t = TW(), S = t.state(), di = (new Date().getDay() + 6) % 7, w = S.week - 1, { meals } = t.dayPlan(w, di);
    const slots = [["sniad", 0], ["drugie", 1], ["obiad", 2], ["podwiecz", 3], ["przekas", 3], ["kolac", 4]];
    const sl = slots.find(([k]) => q.includes(k));
    const list = sl ? meals.filter((x, i) => i === sl[1]) : meals;
    const slugf = typeof slug === "function" ? slug : norm;
    return { text: sl ? `${list[0].label}: ${list[0].meal.name} (ok. ${list[0].meal.time} min). Porcje masz przeliczone pod Twoje kalorie w przepisie.` : `Dziś w jadłospisie: ${list.map((x) => `${x.label.toLowerCase()} — ${x.meal.name}`).join("; ")}.`,
      links: (sl ? list : list.slice(0, 1)).map((x) => [`#zywienie/przepis/${slugf(x.meal.name)}/${w + 1}/${di}`, `Przepis: ${x.meal.name}`]).concat([["#dzis/jadlospis", "Jadłospis na dziś"]]), mood: "happy" };
  }
  const MOTIV = {
    zajac: ["Hop! Szybki start: 5 minut rozgrzewki i jesteś w grze!", "Nie myśl — skacz! Pierwsza seria trwa krócej niż wymówka.", "Szybciej zaczniesz, szybciej skończysz. Hop, hop, do roboty!"],
    rico: ["Auuu! Najtrudniejsze jest założenie butów. Resztę zrobimy razem!", "Pomyśl, jak dobrze poczujesz się po treningu. Biegiem do pierwszej serii!", "Zaprzęg nie ruszy bez lidera. Ty jesteś liderem!"],
    pitbull: ["Nie musisz mieć ochoty. Musisz zacząć. Pierwsza seria — teraz.", "Dyscyplina bije motywację. Robimy rozgrzewkę i zobaczysz.", "Silni nie są ci, którzy nie mają gorszych dni, tylko ci, którzy i tak ćwiczą."],
    atena: ["Mały krok dziś daje duży efekt za miesiąc. Zacznij od rozgrzewki.", "Nie szukaj idealnego dnia. Zrób dobry trening w zwykły dzień.", "Pamiętaj, po co zaczęłaś. Twój plan na Ciebie czeka."],
    lapka: ["Dasz radę! Ja już przybijam piątkę na zachętę!", "Włącz ulubioną muzykę i zróbmy chociaż rozgrzewkę — potem pójdzie samo!", "Każda seria to mały sukces. Zbierzmy ich dziś kilka!"],
    marta: ["Nie musisz robić wszystkiego dziś. Zrób rozgrzewkę i pierwszą serię — reszta przyjdzie sama.", "Gorszy dzień też się liczy. Lżejszy trening jest lepszy niż żaden.", "Oddychaj spokojnie. Jedno ćwiczenie po drugim — jestem z Tobą."],
    oliwka: ["Hop, hop! Kto pierwszy na macie, ten wygrywa! Gotowi? Start!", "Zróbmy to razem! Ja skaczę, a Ty robisz pierwszą serię!", "Jesteś silna jak tygrys! Rrrr! No to ćwiczymy!"],
  };
  function answer(raw) {
    const q = norm(raw), c = C(), ch = charOfDay(), f = her();
    if (has(q, /^(hej|hejka|czesc|siema|siemka|elo|witaj|dzien dobry|dobry wieczor|hello|hi|yo)\b/)) return { text: `${c.hi} ${moodLine(baseMood())}`, mood: "happy" };
    if (has(q, /jak (sie )?(masz|czujesz|leci)|co (tam|slychac)/)) return { text: pick([`Świetnie! ${f ? "Gotowa" : "Gotowy"} do działania.`, "Dobrze, dzięki! A Ty jak się czujesz przed treningiem?", "Mam energię za dwoje. Podzielić się?"]), mood: "happy" };
    if (has(q, /kim jestes|kto ty|przedstaw|o sobie|jak (sie )?nazywasz|jak masz na imie|twoj charakter|jaki jestes|jaka jestes/)) return { text: `${c.about} Dziś dyżur ma ${c.name}. Rotacja trenerów: ${rotText(sex())}. Stałego trenera wybierzesz w Ustawieniach → Asystent → Trener.`, links: [["#ustawienia/trenerzy", "Poznaj trenerów"]], mood: "happy" };
    if (has(q, /co (umiesz|potrafisz)|pomoc|pomocy|w czym (mi )?pomozesz/)) return { text: "Mogę powiedzieć, jaki masz dziś trening, wyjaśnić technikę ćwiczenia (np. „jak robić przysiad”), podać kalorie i makro, podpowiedzieć przepis, wyjaśnić przerwy, progresję i zapas powtórzeń, a także zmotywować. Możesz pisać albo mówić — przycisk mikrofonu.", mood: "happy" };
    if (has(q, /zart|dowcip|rozsmiesz|smiesz/)) return { text: pick(c.jokes), mood: "laugh" };
    if (has(q, /dzieki|dziekuje|dzieki|thx|super dzieki/)) return { text: pick(["Nie ma za co!", "Zawsze do usług!", "Od tego jestem!"]), mood: "happy" };
    if (has(q, /^(pa|papa|nara|narazie|do widzenia|do zobaczenia|dobranoc)\b/)) return { text: has(q, /dobranoc/) ? "Dobranoc! Sen to najlepsza regeneracja." : "Do zobaczenia! Pamiętaj o planie.", mood: has(q, /dobranoc/) ? "sleepy" : "happy" };
    if (has(q, /zapas|rir|w zapasie|ile powtorzen zostawic/)) return { text: "Zapas powtórzeń to liczba powtórzeń, które mógłbyś jeszcze zrobić z dobrą techniką, kończąc serię. Zapas 2 oznacza: kończysz serię, gdy czujesz, że dałbyś radę jeszcze dokładnie 2. W tym planie: tydzień 1 — zapas 3, tydzień 2 — 2–3, tydzień 3 — 2, tydzień 4 — 1. Dzięki temu rośnie siła, a ryzyko kontuzji jest małe.".replace(/mógłbyś/, f ? "mogłabyś" : "mógłbyś").replace(/dałbyś/, f ? "dałabyś" : "dałbyś"), links: [["#trening/progresja", "Progresja"]], mood: "neutral" };
    const ex = findEx(q);
    if (ex && (has(q, /jak|wyjasn|technik|opisz|na czym|co to|pokaz|robic|robi|wykon|blad/) || q.split(" ").length <= 4)) return exText(ex);
    if (has(q, /jutr/) && has(q, /trening|cwicz|plan|robie|robimy/)) return workoutText(1);
    if (has(q, /(dzis|dzisiaj|teraz|na dzis)?.*(trening|cwiczy|cwicze|cwiczen|robie dzis|robimy|plan na dzis|co dzis)/) && !has(q, /kalori|jesc|przepis/)) return workoutText(0);
    if (has(q, /ile (mam )?trening|w tym tygodniu|statyst|histori|ile zrobil/)) { const L = TW().log().sessions, ws = (() => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d.getTime(); })(); const n = L.filter((x) => x.t >= ws).length; return { text: `W tym tygodniu ukończone treningi: ${n}. Łącznie w historii: ${L.length}.${missedDays() ? ` Pominięte ostatnio: ${missedDays()}.` : ""}`, mood: n ? "happy" : "motivated" }; }
    if (has(q, /progres|zwieksz|dolozyc|dodac ciezar|obciazen|ciezar|kolejny tydzien|nastepny tydzien|tydzien [1-4]|cykl/)) { const w = TW().state().week; return { text: `Teraz jesteś w tygodniu ${w}. ${typeof WEEK_NOTE !== "undefined" ? WEEK_NOTE[w - 1] : ""} Zasada: gdy zrobisz górny zakres powtórzeń z zapasem, dołóż 2,5 kg (albo 1 powtórzenie w ćwiczeniach z masą ciała).`, links: [["#trening/progresja", "Progresja"]], mood: "motivated" }; }
    if (has(q, /przerw|odpocz|regener|zakwas|sen\b|spac|spanie|wyspac|dzien wolny|bol miesni/)) { const PR = typeof PRESC !== "undefined" ? PRESC : null; return { text: `Przerwy między seriami: ćwiczenia główne ${PR ? PR.glowne.rest : "2–3 min"}, pomocnicze ${PR ? PR.pomocnicze.rest : "60–90 s"}, z masą ciała ${PR ? PR.wlasne.rest : "2 min"}, brzuch ${PR ? PR.brzuch.rest : "60 s"}. Między treningami tej samej partii — co najmniej 48 godzin. Śpij 7–9 godzin, pij wodę, a zakwasy miną po 1–3 dniach; lekki spacer pomaga.`, mood: new Date().getHours() >= 21 ? "sleepy" : "neutral" }; }
    if (has(q, /kalori|kcal|makro|bialk|tluszcz|weglowodan|ile (mam )?jesc|zapotrzebow/)) return kcalText();
    const dish = findDish(q);
    if (dish) return { text: `${dish.meal.name}: ok. ${dish.meal.time} min. Pełne składniki i porcje przeliczone pod Twoje kalorie znajdziesz w przepisie.`, links: [[`#zywienie/przepis/${dish.id}`, "Otwórz przepis"]], mood: "happy" };
    if (has(q, /przepis|posil|jesc|zjesc|jedzen|obiad|sniadan|kolacj|przekask|podwieczor|jadlospis|danie|gotow|menu|glodn/)) return mealsText(q);
    if (has(q, /zakup|kupic|lista/)) return { text: "Lista zakupów na cały tydzień jest przeliczona pod Twoje kalorie i wybrane dania. Możesz odhaczać kupione produkty.", links: [["#zywienie/zakupy", "Lista zakupów"]], mood: "happy" };
    if (has(q, /muzyk|spotify|piosenk|playlist/)) return { text: "Przycisk „Muzyka w Spotify” otwiera Twoją playlistę w aplikacji Spotify. Link do własnej playlisty ustawisz w Ustawieniach.", links: [["#ustawienia", "Ustawienia"]], mood: "laugh" };
    if (has(q, /motyw|nie chce|nie mam sily|nie mam ochoty|leniw|zmeczon|zmotywuj|odpuscic|nie dam rady|nie moge|ciezko mi/)) return { text: pick(MOTIV[ch]), mood: "motivated" };
    if (has(q, /schud|redukc|chudn|spalic|brzuch.*(zrzuc|spal)|tluszczyk/)) return { text: "Na redukcję liczy się lekki deficyt kalorii, dużo białka i regularny trening siłowy. Wybierz cel redukcji w Ustawieniach → Cel, a kalorie i jadłospis przeliczą się same. Nie schodź poniżej bezpiecznego minimum.", links: [["#ustawienia/cel", "Zmień cel"]], mood: "neutral" };
    if (has(q, /mas[ae]|przytyc|urosnac|miesnie rosn/)) return { text: "Na masę potrzebujesz lekkiej nadwyżki kalorii, 1,6–2,2 g białka na kg masy ciała i stopniowego zwiększania ciężarów. Plan robi to za Ciebie — trzymaj się jadłospisu i progresji.", links: [["#ustawienia/cel", "Zmień cel"]], mood: "motivated" };
    if (has(q, /wod[aey]|pic|nawodn/)) return { text: "Pij ok. 35 ml wody na kg masy ciała dziennie, w dni treningowe więcej. Mała butelka obok podczas treningu to dobry nawyk.", mood: "neutral" };
    if (has(q, /cardio|kardio|bieg|sprint|interwal|skakank|kondycj|wytrzymal|szybk/)) return { text: (ch === "zajac" ? "Hop! Moja ulubiona działka! " : "") + "Cardio w tym planie: krótki finisz interwałowy po treningu (np. 30 s pracy / 30 s przerwy) i lekka kondycja w dni bez ciężarów. Zacznij spokojnie, co tydzień dodaj rundę albo kilka sekund pracy. Między interwałami oddychaj nosem i rozluźnij barki.", links: [["#trening/cardio", "Cardio w planie"]], mood: "motivated" };
    if (has(q, /trener|trenerzy|trenerow|postac|kto dzis|kto ma dyzur/)) return { text: `Dziś pomaga ${c.name}. Rotacja: ${rotText(sex())}.`, links: [["#ustawienia/trenerzy", "Poznaj trenerów"]], mood: "happy" };
    if (has(q, /rozgrzewk/)) return { text: "Rozgrzewka trwa ok. 12 minut: 5 min lekkiego cardio, skakanka lub pajacyki, mobilizacja barków i bioder, a potem 2–3 lżejsze serie pierwszego ćwiczenia.", mood: "motivated" };
    if (has(q, /kocham|lubie cie|fajny|fajna|super jestes|najlepsz/)) return { text: pick(["Ojej, aż się rumienię!", "Ty też jesteś super! A teraz — trening!", "Dziękuję! Razem tworzymy świetną drużynę."]), mood: "laugh" };
    if (has(q, /glupi|glupia|beznadziejn|nudny|nudna|wkurza/)) return { text: pick(["Hej, bez takich! Ale wybaczam, jeśli zrobisz dziś trening.", "Hmpf. Może jednak pogadamy o czymś miłym, np. o przysiadach?"]), mood: "irritated" };
    if (ex) return exText(ex);
    return { text: c.fallback, mood: "irritated" };
  }

  // ---------- mowa: rozpoznawanie (STT) i synteza (TTS) ----------
  const STT_ERR = { 1: "Przekroczono czas połączenia.", 2: "Brak połączenia z usługą rozpoznawania mowy.", 3: "Problem z mikrofonem.", 4: "Usługa rozpoznawania mowy nie odpowiada.", 5: "Rozpoznawanie mowy zostało przerwane.",
    6: "Nic nie usłyszałem/am — spróbuj jeszcze raz.", 7: "Nie udało się rozpoznać słów — spróbuj mówić wyraźniej.", 8: "Rozpoznawanie mowy jest zajęte — spróbuj za chwilę.", 9: "Brak zgody na mikrofon. Możesz ją włączyć w ustawieniach Androida.",
    11: "Za dużo prób — spróbuj za chwilę.", 12: "Usługa rozpoznawania mowy rozłączyła się.", 13: "Język polski nie jest obsługiwany przez rozpoznawanie mowy na tym urządzeniu.", 14: "Pobierz język polski do rozpoznawania mowy w ustawieniach Google.",
    100: "Rozpoznawanie mowy nie jest dostępne na tym urządzeniu. Możesz pisać.", 101: "Nie można uruchomić rozpoznawania mowy." };
  let listening = false, webRec = null;
  // tryb rozmowy głosowej: słuchaj → odpowiedz głosem → po zakończeniu mowy znów słuchaj (bez słuchania w trakcie mówienia)
  function WEBV() { return !NB() && !(window.TWWEB && window.TWWEB.voiceOK); } // przeglądarka bez rozpoznawania/syntezy mowy
  const WEBTTS = () => !!NB() || !!(window.TWWEB && window.TWWEB.ttsOK);
  const VOICE = () => A.mode === "voice" && !WEBV();
  const wantVoice = () => !!A.voice || VOICE();
  const SILENCE_MS = 45000;
  let convo = false, lastHeard = 0, speaking = false, speakT = null, retry = 0, listenT = null;
  // v1.3.4: quiet — rozmowa głosowa bez okna czatu (podwójne dotknięcie Zająca): bez tekstu, tylko wskaźnik wokół postaci
  let quiet = false;
  const QCLIP = { speak: "motivated", listen: "idle", wait: "idle", think: "idle" };
  function setQ(st) {
    if (!el) return;
    ["listen", "speak", "think"].forEach((k) => el.classList.toggle("as-v-" + k, st === k || (k === "listen" && st === "wait")));
    el.classList.toggle("as-v", !!st); el.dataset.vst = st || "";
    if (!body) return;
    if (st) { stopMove(); clearTimeout(wanderT); bstate = "talk"; const c = QCLIP[st]; if (el.dataset.clip !== c || !cur.startsWith("anim:")) clip(c, true); }
    else if (bstate === "talk") idle();
  }
  function setV(st) {
    if (quiet) { setQ(st); return; }
    const v = chat && chat.querySelector(".as-vbar"); if (!v) return;
    v.hidden = !st; v.dataset.st = st || "";
    const tx = { listen: "Słucham… mów śmiało", speak: `${C().name} mówi…`, think: "Myślę…", wait: "Uruchamiam mikrofon…" }[st] || "";
    v.querySelector(".as-vtx").textContent = tx;
  }
  function micState(on) { listening = on; const m = chat && chat.querySelector(".as-mic"); if (m) { m.classList.toggle("on", on || convo); m.setAttribute("aria-label", convo ? "Zakończ rozmowę głosową" : on ? "Zatrzymaj słuchanie" : "Mów do asystenta"); } const i = chat && chat.querySelector(".as-in"); if (i) i.placeholder = on ? "Słucham…" : `Napisz do: ${C().name}…`; if (convo && on) setV("listen"); }
  function toggleListen() { if (listening) stopListen(); else startListen(); }
  function convoStart(greet, q) {
    if (!q && (!chat || chat.hidden)) return;
    if (q && el && el.hidden) return;
    quiet = !!q; convo = true; lastHeard = Date.now(); retry = 0; micState(false);
    if (greet) speakThen(`${C().hi} Słucham.`); else listenSoon(0);
  }
  function convoStop(note) {
    const was = convo; convo = false; clearTimeout(listenT); clearTimeout(speakT); speaking = false;
    if (was) { stopListen(); ttsStop(); }
    setV(""); micState(false);
    const q = quiet; quiet = false;
    if (q) { setQ(""); if (note) speak(note); return; }
    if (note && chat && !chat.hidden) addMsg("bot", note, null, true);
  }
  function listenSoon(ms) { clearTimeout(listenT); listenT = setTimeout(() => { if (convo && !speaking && (quiet || (chat && !chat.hidden))) { setV("wait"); startListen(); } }, ms); }
  function startListen() {
    if (speaking) { if (convo) return; ttsStop(); }
    ttsStop();
    const b = NB();
    if (b && b.startListening) { try { micState(true); b.startListening(); } catch (e) { micState(false); speechError(101); } return; }
    const R = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!R) { speechError(100); return; }
    try {
      webRec = new R(); webRec.lang = "pl-PL"; webRec.interimResults = false; webRec.maxAlternatives = 1;
      let got = false;
      webRec.onresult = (e) => { got = true; const t = e.results[0] && e.results[0][0] ? e.results[0][0].transcript : ""; onSpeech(t); };
      webRec.onerror = (e) => { got = true; speechError(e.error === "not-allowed" ? 9 : e.error === "no-speech" ? 6 : e.error === "network" ? 2 : e.error === "aborted" ? 5 : 7); };
      webRec.onend = () => { if (!got && convo) speechError(6); else if (!convo) micState(false); };
      micState(true); webRec.start();
    } catch (e) { micState(false); speechError(101); }
  }
  function stopListen() { const b = NB(); try { if (listening && b && b.stopListening) b.stopListening(); if (webRec) { webRec.onend = null; webRec.abort(); webRec = null; } } catch (e) { /* brak */ } listening = false; micState(false); }
  function onSpeech(text) {
    listening = false; text = String(text || "").trim();
    if (!text) { speechError(7); return; }
    lastHeard = Date.now(); retry = 0;
    if (quiet && convo) { // bez czatu i bez zapisu tekstu: tylko odpowiedź głosem
      setV("think"); micState(false);
      hist.push({ who: "me", text, links: [] });
      reply(text, true).then((r) => { hist.push({ who: "bot", text: r.text, links: [] }); saveHist(); if (!convo || !quiet) return; speak(r.text); });
      return;
    }
    if (!chat || chat.hidden) openChat();
    if (convo) setV("think");
    micState(false); send(text);
  }
  function speechError(code) {
    listening = false; micState(false);
    if (convo) {
      if (code === 6 || code === 7) { // cisza / brak dopasowania → słuchaj dalej po cichu, do limitu ciszy
        if (Date.now() - lastHeard > SILENCE_MS) convoStop(quiet ? "Kończę rozmowę po dłuższej ciszy. Dotknij mnie dwa razy, aby wznowić." : "Rozmowa głosowa wstrzymana po dłuższej ciszy. Dotknij mikrofonu, aby wznowić.");
        else listenSoon(250);
        return;
      }
      if ((code === 5 || code === 8 || code === 11) && retry < 4) { retry++; listenSoon(700 * retry); return; }
      convoStop(STT_ERR[code] || "Rozpoznawanie mowy nie zadziałało — rozmowa głosowa zatrzymana. Możesz pisać.");
      return;
    }
    if (code === 5) return;
    const t = STT_ERR[code] || "Rozpoznawanie mowy nie zadziałało — spróbuj jeszcze raz albo napisz."; if (chat && !chat.hidden) addMsg("bot", t, null, true); else say(t);
  }
  function speakThen(text) { speak(text); }
  function speak(text) {
    const t = String(text).replace(/[„”"]/g, "").replace(/\n+/g, ". ").slice(0, 600), b = NB();
    if (convo || (body && VOICE())) { stopListen(); speaking = true; if (convo) setV("speak"); clearTimeout(speakT); speakT = setTimeout(ttsDone, Math.max(5000, t.length * 95) + 6000); }
    if (b && b.speak) { try { b.speak(t); } catch (e) { ttsDone(); } return; }
    try {
      if (window.speechSynthesis) { const u = new SpeechSynthesisUtterance(t); u.lang = "pl-PL"; u.onend = ttsDone; u.onerror = ttsDone; speechSynthesis.cancel(); speechSynthesis.speak(u); }
      else ttsDone();
    } catch (e) { ttsDone(); }
  }
  // koniec mówienia (most Androida: UtteranceProgressListener.onDone) → w trybie rozmowy znów słuchamy
  function ttsDone() { clearTimeout(speakT); if (!speaking) return; speaking = false; if (convo) listenSoon(350); else if (el && el.dataset.vst) setQ(""); }
  function ttsStop() { const b = NB(); try { if (b && b.stopSpeaking) b.stopSpeaking(); else if (window.speechSynthesis) speechSynthesis.cancel(); } catch (e) { /* brak */ } }
  function ttsError(code) { const was = speaking; ttsDone(); if (quiet && convo && code === 1 && !ttsError.shown) { ttsError.shown = true; convoStop(); say("Brak polskiego głosu do czytania odpowiedzi. Zainstaluj język polski w ustawieniach syntezy mowy Androida."); bub.classList.add("on"); bub.textContent = "Brak polskiego głosu syntezy mowy."; placeBub(); setTimeout(() => bub.classList.remove("on"), 4000); return was; } if (chat && !chat.hidden && !ttsError.shown) { ttsError.shown = true; addMsg("bot", code === 1 ? "Brak polskiego głosu do czytania odpowiedzi. Zainstaluj język polski w ustawieniach syntezy mowy Androida." : "Czytanie odpowiedzi na głos nie jest teraz dostępne.", null, true); } return was; }
  function onBackground() { if (convo) convoStop(); else stopListen(); ttsStop(); }
  document.addEventListener("visibilitychange", () => { if (document.hidden && !NB()) onBackground(); });

  // ---------- ustawienia ----------
  const ovAvail = () => { const b = NB(); return !!(b && b.canOverlay); };
  function settingsHtml() {
    const c = C(), k = sex() === "k", tog = (key, title, sub, on, dis) => `<label class="row toggle${dis ? " as-dis" : ""}"><span class="rtx"><b>${title}</b>${sub ? `<small>${sub}</small>` : ""}</span><input type="checkbox" data-asst="${key}" ${on ? "checked" : ""} ${dis ? "disabled" : ""}><i></i></label>`;
    return `<section class="group"><h2 class="group-t">Asystent</h2><div class="rows">
      <button type="button" class="row" data-asst-open><span class="ric as-ric"><img src="${img(charOfDay(), "happy")}" alt=""></span><span class="rtx"><b>Porozmawiaj: ${esc(c.name)}</b><small>Dziś pomaga ${esc(c.name)}${A.trainer[sex()] !== "auto" ? " (wybrany na stałe)" : ""}. Rotacja: ${rotText(sex())}.</small></span></button>
      <div class="row static col"><span class="rtx"><b>Trener</b><small>Dotyczy postaci w aplikacji i na ekranie głównym.</small></span><div class="as-seg" role="group" aria-label="Wybór trenera">${[["auto", "Automatycznie (rotacja dnia)"]].concat(ROSTER[sex()].map((x) => [x, CHARS[x].name])).map(([v, l]) => `<button type="button" data-trainer="${v}" aria-pressed="${A.trainer[sex()] === v}">${esc(l)}</button>`).join("")}</div></div>
      <a class="row" href="#ustawienia/trenerzy"><span class="ric as-ric"><img src="${img(k ? "lapka" : "zajac", "neutral")}" alt=""></span><span class="rtx"><b>Poznaj trenerów</b><small>${ROSTER[sex()].map((x) => CHARS[x].name).join(", ")}</small></span><span class="rchev"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></span></a>
      ${tog("on", "Asystent w aplikacji", isBody() ? "Pływająca postać: przeciągnij, podrzuć w górę, dotknij. Dotknij dwa razy: w trybie głosowym — rozmowa bez okna czatu, w tekstowym — czat." : "Pływająca postać: przeciągnij, podrzuć w górę, dotknij lub przytrzymaj, aby otworzyć czat.", A.on)}
      ${WEBV() ? '<div class="row static"><span class="rtx"><b>Rozmowa</b><small class="as-web-note">Rozmowa głosowa nie jest dostępna w tej przeglądarce (brak rozpoznawania lub syntezy mowy) — piszesz z asystentem w czacie.</small></span></div>' : `<div class="row static col"><span class="rtx"><b>Tryb rozmowy</b><small>${VOICE() ? (isBody() ? "Głosowy: dotknij Zająca dwa razy — słucha, odpowiada głosem i znów słucha, bez okna czatu i bez napisów. Dotknięcie kończy rozmowę; po ok. 45 s ciszy mikrofon wyłączy się sam." : "Głosowy: po otwarciu czatu asystent słucha, odpowiada głosem i znów słucha. Stop kończy rozmowę; po ok. 45 s ciszy mikrofon wyłączy się sam.") : "Tekstowy: piszesz w czacie; mikrofon działa na jedno pytanie."}</small></span><div class="as-seg" role="group" aria-label="Tryb rozmowy">${[["text", "Tekstowy"], ["voice", "Głosowy"]].map(([v, l]) => `<button type="button" data-asmode="${v}" aria-pressed="${A.mode === v}">${l}</button>`).join("")}</div></div>`}
      ${WEBTTS() ? tog("voice", "Odpowiedzi głosowe", VOICE() ? "W trybie głosowym zawsze włączone." : "Asystent czyta odpowiedzi na głos (polski głos syntezy mowy).", wantVoice(), VOICE()) : ""}
      ${NB() ? tog("overlay", "Pokaż asystenta na ekranie głównym", ovAvail() ? "Postać widoczna też poza aplikacją. Wymaga zgody „Wyświetlanie nad innymi aplikacjami”; w powiadomieniu jest przycisk „Wyłącz”." : "Dostępne w aplikacji na Androida.", A.overlay && ovAvail(), !ovAvail()) : '<div class="row static"><span class="rtx"><b>Asystent poza aplikacją</b><small class="as-web-note">Pływająca postać nad innymi aplikacjami i mikrofon w tle działają tylko w aplikacji na Androida. Na iPhonie asystent jest aktywny w otwartej aplikacji ApexFit.</small></span></div>'}
    </div></section>${aiSettingsHtml()}`;
  }
  function aiSettingsHtml() {
    const AI = window.TWAI; if (!AI) return "";
    const cfg = AI.cfg(), p = cfg.prov, P = AI.PROV[p], has = AI.hasKey(p);
    const provBtns = AI.ORDER.map((x) => `<button type="button" data-aiprov="${x}" aria-pressed="${p === x}">${esc(AI.PROV[x].short)}${AI.hasKey(x) ? " ✓" : ""}</button>`).join("");
    return `<section class="group" id="ai-sec"><h2 class="group-t">Asystent AI</h2><div class="rows">
      <label class="row toggle"><span class="rtx"><b>Odpowiedzi AI w internecie</b><small>Asystenci odpowiadają na każde pytanie jako ${esc(C().name)} i znają Twój plan. Bez klucza lub internetu działają odpowiedzi offline.</small></span><input type="checkbox" data-ai="on" ${cfg.on !== false ? "checked" : ""}><i></i></label>
      <div class="row static col"><span class="rtx"><b>Usługa AI</b><small>${esc(P.note)}</small></span><div class="as-seg" role="group" aria-label="Wybór usługi AI">${provBtns}</div></div>
      <div class="row static col"><span class="rtx"><b>Klucz API: ${esc(P.short)}</b><small id="ai-state">${has ? "Klucz zapisany w tej przeglądarce (pamięć lokalna tylko na tym urządzeniu; wysyłany jest wyłącznie do wybranej usługi AI)." : "Brak klucza — odpowiedzi offline."}</small></span>
        <div class="ai-btns"><a class="btn-primary" href="${esc(P.keyUrl)}" target="_blank" rel="noopener" data-ai="connect">${p === "gemini" ? "Połącz z Gemini" : "Zdobądź klucz " + esc(P.short)}</a><button type="button" class="btn-ghost" data-ai="paste">Wklej</button></div>
        <details class="fold ai-man"><summary>Wpisz klucz ręcznie</summary><label class="field wide">Klucz API<input id="ai-key" type="password" autocomplete="off" spellcheck="false" autocapitalize="off" placeholder="wklej klucz…"></label><div class="ai-btns"><button type="button" class="btn-ghost" data-ai="savekey">Zapisz i sprawdź</button></div></details>
        <div class="ai-btns">${has ? '<button type="button" class="btn-ghost" data-ai="test">Sprawdź połączenie</button><button type="button" class="btn-ghost" data-ai="clear">Usuń klucz</button>' : ""}</div>
        <p class="caption ai-msg" id="ai-msg" role="status" aria-live="polite"></p>
        <details class="fold ai-man"><summary>Model (zaawansowane)</summary><label class="field wide">Model ${esc(P.short)}<input id="ai-model" type="text" autocomplete="off" spellcheck="false" placeholder="${esc(P.models[0])}" value="${esc(cfg.model[p] || "")}"></label></details></div>
    </div></section>`;
  }
  const aiMsg = (t, cls) => { const m = document.getElementById("ai-msg"); if (m) { m.textContent = t; m.dataset.k = cls || ""; } };
  async function aiCheck(p) {
    const AI = window.TWAI; aiMsg("Sprawdzam połączenie…", "wait");
    const r = await AI.validate(p);
    aiMsg(r.ok ? `Połączono z usługą ${AI.PROV[p].short} — odpowiedzi AI są włączone.` : `Nie udało się: ${r.text}`, r.ok ? "ok" : "err");
    return r;
  }
  async function aiSaveKey(raw) {
    const AI = window.TWAI; let p = AI.cfg().prov; raw = AI.normKey(raw);
    if (!AI.keyLooksOk(raw)) { aiMsg(raw ? "To nie wygląda na klucz API (powinien być jednym ciągiem znaków bez spacji)." : "Schowek jest pusty. Skopiuj klucz na stronie usługi, a potem dotknij „Wklej”.", "err"); return; }
    const guess = /^(AIza|AQ\.)/.test(raw) ? "gemini" : /^xai-/.test(raw) ? "grok" : /^sk-/.test(raw) ? "openai" : p;
    if (guess !== p) { AI.setProv(guess); p = guess; }
    if (!AI.setKey(p, raw)) { aiMsg("Nie udało się zapisać klucza.", "err"); return; }
    const k = document.getElementById("ai-key"); if (k) k.value = "";
    const r = await aiCheck(p);
    const st = document.getElementById("ai-state"); if (st) st.textContent = "Klucz zapisany w tej przeglądarce (tylko na tym urządzeniu).";
    if (r.ok) { show("happy", 2500); }
    setTimeout(() => { const keep = document.getElementById("ai-msg") ? document.getElementById("ai-msg").textContent : "", kk = document.getElementById("ai-msg") ? document.getElementById("ai-msg").dataset.k : ""; rerender(); setTimeout(() => aiMsg(keep, kk), 30); }, 50);
  }
  document.addEventListener("click", (e) => {
    const t = e.target.closest && e.target.closest("[data-ai],[data-aiprov]"); if (!t) return;
    const AI = window.TWAI; if (!AI) return;
    if (t.dataset.aiprov) { AI.setProv(t.dataset.aiprov); rerender(); return; }
    const a = t.dataset.ai, p = AI.cfg().prov;
    if (a === "paste") { AI.readClipboard().then((c) => { if (c && String(c).trim()) { aiSaveKey(c); return; } const d = document.querySelector("details.ai-man"); if (d) { d.open = true; const k = document.getElementById("ai-key"); if (k) { k.focus(); } } aiMsg("Nie udało się odczytać schowka (przeglądarka mogła odmówić dostępu albo schowek jest pusty). Wklej klucz w polu „Wpisz klucz ręcznie” i dotknij „Zapisz i sprawdź”.", "err"); }); }
    else if (a === "savekey") { aiSaveKey((document.getElementById("ai-key") || {}).value); }
    else if (a === "test") { aiCheck(p); }
    else if (a === "clear") { AI.clearKey(p); rerender(); setTimeout(() => aiMsg("Klucz usunięty.", "ok"), 30); }
  });
  document.addEventListener("change", (e) => {
    const t = e.target; if (!t || !window.TWAI) return;
    if (t.dataset && t.dataset.ai === "on") window.TWAI.setOn(t.checked);
    if (t.id === "ai-model") window.TWAI.setModel(window.TWAI.cfg().prov, t.value);
  });
  // kontekst dla usługi nakładki (Android): sync JSON — prompt systemowy, odpowiedź offline, usługa i modele; zapytanie HTTP wykonuje kod natywny
  function aiContext(q) {
    try {
      const AI = window.TWAI, r = answer(String(q || "")), p = AI ? AI.cfg().prov : "gemini";
      return JSON.stringify({ sys: aiSystem(true), off: String(r.text || "").replace(/[„”"]/g, "").replace(/\n+/g, ". "), m: r.mood || "", prov: p, models: AI ? AI.modelsFor(p) : [], on: !!(AI && AI.cfg().on !== false), name: C().name });
    } catch (e) { return JSON.stringify({ off: "", m: "" }); }
  }
  function trainersHtml() {
    const sx = sex(), today = rotation(new Date().getDay(), sx);
    return `<p class="caption">Rotacja dnia: ${rotText(sx)}. Możesz też wybrać stałego trenera w Ustawieniach → Asystent → Trener.</p>
      <div class="as-trainers">${ROSTER[sx].map((x) => { const c = CHARS[x]; return `<article class="card as-tr"><img class="as-tr-img" src="img/trenerzy/${x}.jpg" alt="${esc(c.name)} — ${esc(c.who)}, trener w aplikacji" loading="lazy">
        <div class="as-tr-t"><h2>${esc(c.name)}${x === today ? ' <span class="badge">dziś</span>' : ""}${A.trainer[sx] === x ? ' <span class="badge alt">wybrany</span>' : ""}</h2><p class="caption">${esc(c.who)} · ${esc(c.style)}</p><p>${esc(c.about)}</p>
        <div class="alt-act"><button type="button" class="btn-ghost" data-trainer="${x}" data-trainer-chat>Wybierz i porozmawiaj</button></div></div></article>`; }).join("")}</div>`;
  }
  function setTrainer(v) {
    const sx = sex(); if (v !== "auto" && !ROSTER[sx].includes(v)) return;
    A.trainer[sx] = v; save(); cur = ""; greeted = true;
    const b = NB(); try { if (b && b.setTrainer) b.setTrainer(sx, v); } catch (e) { /* brak */ }
    rerender(); show("happy", 2500); say(`${C().hi} ${v === "auto" ? "Wracamy do rotacji dnia." : "Od teraz jestem Twoim trenerem!"}`);
  }
  function setMode(v) {
    if (v !== "text" && v !== "voice") return;
    A.mode = v; save(); if (v === "text") convoStop();
    rerender();
    const b = NB(); try { if (b && b.setAsstMode) b.setAsstMode(v); } catch (e) { /* brak */ }
    if (el) setLabel();
    if (v === "voice") { if (b && b.hasSpeech && !b.hasSpeech()) say("Rozpoznawanie mowy nie jest dostępne na tym urządzeniu — tryb głosowy może nie działać."); else say(isBody() ? "Tryb głosowy: dotknij mnie dwa razy i po prostu mów. Zapytam o zgodę na mikrofon." : "Tryb głosowy: otwórz czat i po prostu mów. Zapytam o zgodę na mikrofon."); }
    else say("Tryb tekstowy: piszemy w czacie.");
  }
  let ovPending = false;
  function setOverlay(on) {
    const b = NB(); if (!b || !b.canOverlay) return;
    if (on && !b.canOverlay()) {
      ovPending = true;
      modalMsg("Zgoda na wyświetlanie", "Aby asystent był widoczny na ekranie głównym, Android poprosi o zgodę „Wyświetlanie nad innymi aplikacjami”. Włącz ją dla aplikacji ApexFit i wróć tutaj.", "Przejdź do ustawień", () => { try { b.requestOverlay(); } catch (e) { ovPending = false; } }, () => { ovPending = false; A.overlay = false; save(); rerender(); });
      return;
    }
    A.overlay = on; save();
    try { b.setOverlay(on, sex()); } catch (e) { /* brak */ }
    if (on) say("Będę też na ekranie głównym! Wyłączysz mnie w powiadomieniu.");
  }
  function modalMsg(title, text, ok, onOk, onNo) {
    const m = document.createElement("div"); m.className = "modal"; m.setAttribute("role", "dialog"); m.setAttribute("aria-modal", "true");
    m.innerHTML = `<div class="modal-card"><h2>${esc(title)}</h2><p>${esc(text)}</p><div class="modal-act"><button type="button" class="btn-ghost" data-m="no">Anuluj</button><button type="button" class="btn-primary" data-m="ok">${esc(ok)}</button></div></div>`;
    document.body.appendChild(m); vis();
    m.addEventListener("click", (e) => { const b = e.target.closest("[data-m]"); if (!b && e.target !== m) return; m.remove(); vis(); if (b && b.dataset.m === "ok") onOk(); else if (onNo) onNo(); });
  }
  function rerender() { if (TW() && TW().render) TW().render(); }
  document.addEventListener("change", (e) => {
    const t = e.target; if (!t.dataset || !t.dataset.asst) return;
    const k = t.dataset.asst;
    if (k === "on") { A.on = t.checked; save(); sync(); if (A.on) { show("happy", 2500); say(`${C().hi} Jestem!`); } }
    else if (k === "voice") { A.voice = t.checked; save(); if (A.voice) speak(`${C().name} będzie czytać odpowiedzi na głos.`.replace("czytać", her() ? "czytać" : "czytał")); else ttsStop(); }
    else if (k === "overlay") setOverlay(t.checked);
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest) return;
    const tb = e.target.closest("[data-trainer]");
    if (tb) { setTrainer(tb.dataset.trainer); if (tb.hasAttribute("data-trainer-chat")) { hist = []; saveHist(); openChat(); } return; }
    const mb = e.target.closest("[data-asmode]");
    if (mb) { setMode(mb.dataset.asmode); return; }
    if (e.target.closest("[data-asst-open]")) openChat();
  });
  function onResume() {
    const b = NB(); if (!b || !b.canOverlay) return;
    try {
      if (ovPending) { ovPending = false; if (b.canOverlay()) { A.overlay = true; save(); b.setOverlay(true, sex()); say("Zgoda jest! Będę też na ekranie głównym."); } else { A.overlay = false; save(); say("Bez zgody na wyświetlanie nie mogę być na ekranie głównym."); } }
      else { const act = b.overlayEnabled ? b.overlayEnabled() : A.overlay; if (act !== A.overlay) { A.overlay = !!act; save(); } }
    } catch (e) { /* brak */ }
    const cb = document.querySelector('[data-asst="overlay"]'); if (cb) cb.checked = A.overlay;
    sync();
  }

  // v1.3.4: odpowiedź tekstowa dla asystenta na ekranie głównym (usługa Androida pyta przez ukryty WebView)
  function answerPlain(q) { try { const r = answer(String(q || "")); return JSON.stringify({ t: String(r.text || "").replace(/[„”"]/g, "").replace(/\n+/g, ". "), m: r.mood || "" }); } catch (e) { return JSON.stringify({ t: "", m: "" }); } }
  window.TWA = { answerPlain, aiContext, reply, quietActive: () => quiet && convo, charOfDay, rotation, settingsHtml, trainersHtml, setTrainer, openChat, closeChat, answer, baseMood, onSpeech, onSpeechError: speechError, onSpeechEnd: () => { listening = false; micState(false); }, onTtsError: ttsError, onTtsDone: ttsDone, onListenReady: () => { if (convo) setV("listen"); }, onBackground, onResume, setMode, state: () => A,
    emit: (type, x) => onAppEvent({ detail: Object.assign({ type }, x || {}) }) };
  window.addEventListener("tw:event", onAppEvent);
  function boot() {
    if (!TW()) { setTimeout(boot, 50); return; }
    sync(); setTimeout(greet, 600);
    const b = NB();
    try { if (b && b.consumeOpenChat && b.consumeOpenChat()) setTimeout(openChat, 300); } catch (e) { /* brak */ }
    try { if (b && b.overlayEnabled && b.overlayEnabled() !== A.overlay) { A.overlay = !!b.overlayEnabled(); save(); } } catch (e) { /* brak */ }
    try { if (b && b.setAsstMode) b.setAsstMode(A.mode === "voice" ? "voice" : "text"); } catch (e) { /* brak */ }
    if (/[?&]czat\b/.test(location.search) || location.hash === "#czat") setTimeout(openChat, 300);
    { const qp = new URLSearchParams(location.search), qa = qp.get("ask");
      if (qp.get("stubai")) window.__stubReply = (q) => `${C().hi} ${/trening|dzis|dziś/i.test(q) ? "Dziś masz trening nóg — zacznij od 12 minut rozgrzewki, a ja będę Ci kibicować przy każdej serii." : "Dobre pytanie! Krótko: słuchaj swojego ciała, jedz regularnie i nie zapominaj o wodzie."}`;
      if (qa) setTimeout(() => { if (!chat || chat.hidden) openChat(); setTimeout(() => send(qa), 500); }, 700); }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else setTimeout(boot, 0);
})();
