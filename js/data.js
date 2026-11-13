/* Dane planu: ćwiczenia, plan tygodnia, progresja, produkty i jadłospis. */
"use strict";
                                                 

const EX       = [
  { id: "squat", name: "Przysiad ze sztangą", muscles: "Czworogłowe ud, pośladki, przywodziciele, mięśnie głębokie tułowia", gear: "Sztanga", video: "przysiad-ze-sztanga", alt: "Animowany husky Rico wykonuje przysiad ze sztangą na plecach, widok z boku.",
    steps: [
      { title: "Ustawienie", detail: "Sztanga na górnej części mięśnia czworobocznego, stopy na szerokość barków, palce lekko na zewnątrz." },
      { title: "Napięcie", detail: "Weź wdech do brzucha, napnij tułów, łopatki ściągnięte." },
      { title: "Zejście", detail: "Biodra w tył i w dół, kolana podążają nad palcami, plecy proste. Zejdź co najmniej do równoległej ud." },
      { title: "Wstawanie", detail: "Wypchnij podłogę całą stopą, biodra i barki wznoszą się razem. Wydech na górze." },
    ],
    mistakes: ["Kolana uciekające do środka", "Odrywanie pięt od podłogi", "Zaokrąglanie dolnego odcinka pleców", "Zbyt płytkie zejście przy zbyt dużym ciężarze"] },
  { id: "floor", name: "Wyciskanie sztangi leżąc na podłodze", muscles: "Klatka piersiowa, triceps, przednie aktony barków", gear: "Sztanga, mata", video: "wyciskanie-lezac-na-podlodze", alt: "Animowany pitbull leży na macie i wyciska sztangę nad klatką piersiową.",
    steps: [
      { title: "Pozycja", detail: "Połóż się na macie, kolana ugięte, stopy płasko. Chwyt nieco szerszy niż barki." },
      { title: "Start", detail: "Sztanga nad dolną częścią klatki, łopatki ściągnięte i wciśnięte w podłogę." },
      { title: "Opuszczanie", detail: "Opuszczaj powoli, łokcie ok. 45° od tułowia, aż ramiona dotkną podłogi. Krótka pauza." },
      { title: "Wyciskanie", detail: "Wyciśnij sztangę pionowo w górę do wyprostu ramion." },
    ],
    mistakes: ["Odbijanie łokci od podłogi", "Łokcie rozłożone pod kątem 90°", "Brak pauzy na dole", "Wyginanie nadgarstków do tyłu"] },
  { id: "row", name: "Wiosłowanie sztangą w opadzie", muscles: "Najszersze grzbietu, czworoboczny, równoległoboczne, biceps", gear: "Sztanga", video: "wioslowanie-w-opadzie", alt: "Animowany husky Rico w opadzie tułowia przyciąga sztangę do brzucha.",
    steps: [
      { title: "Opad", detail: "Chwyt nachwytem na szerokość barków. Pochyl tułów ok. 45°, biodra w tył, kolana lekko ugięte." },
      { title: "Plecy", detail: "Kręgosłup neutralny, wzrok na podłogę przed sobą." },
      { title: "Przyciąganie", detail: "Przyciągnij sztangę do dolnych żeber, prowadząc łokcie wzdłuż tułowia. Ściągnij łopatki." },
      { title: "Powrót", detail: "Opuść sztangę pod kontrolą do pełnego wyprostu ramion." },
    ],
    mistakes: ["Szarpanie całym tułowiem", "Okrągłe plecy", "Przyciąganie do klatki zamiast do brzucha", "Zbyt wyprostowany tułów"] },
  { id: "ohp", name: "Wyciskanie żołnierskie (stojąc)", muscles: "Barki, triceps, górna część klatki, mięśnie tułowia", gear: "Sztanga", video: "wyciskanie-zolnierskie", alt: "Animowany pitbull stojąc wyciska sztangę nad głowę.",
    steps: [
      { title: "Start", detail: "Sztanga na wysokości obojczyków, chwyt nieco szerszy niż barki, łokcie lekko przed sztangą." },
      { title: "Napięcie", detail: "Pośladki i brzuch napięte, żebra w dół." },
      { title: "Wyciskanie", detail: "Wypchnij sztangę pionowo, cofając lekko głowę; po minięciu czoła wsuń głowę pod sztangę." },
      { title: "Zakończenie", detail: "Pełny wyprost nad środkiem stopy, potem kontrolowane opuszczenie." },
    ],
    mistakes: ["Wyginanie lędźwi do tyłu", "Wyciskanie przed siebie zamiast w pionie", "Pomaganie sobie nogami", "Luźny brzuch"] },
  { id: "rdl", name: "Martwy ciąg rumuński", muscles: "Dwugłowe ud, pośladki, prostowniki grzbietu", gear: "Sztanga", video: "martwy-ciag-rumunski", alt: "Animowany husky Rico wykonuje martwy ciąg rumuński ze sztangą, widok z boku.",
    steps: [
      { title: "Start", detail: "Stań prosto ze sztangą przy udach, stopy na szerokość bioder, kolana lekko ugięte." },
      { title: "Zawias biodrowy", detail: "Przesuwaj biodra w tył, sztanga sunie blisko nóg, plecy proste." },
      { title: "Zakres", detail: "Schodź do połowy piszczeli lub do momentu mocnego rozciągnięcia tyłu ud." },
      { title: "Powrót", detail: "Wypchnij biodra w przód i wyprostuj się, napinając pośladki." },
    ],
    mistakes: ["Zaokrąglanie pleców", "Odsuwanie sztangi od nóg", "Zamienianie ruchu w przysiad", "Przeprost w lędźwiach na górze"] },
  { id: "pullup", name: "Podciąganie nachwytem", muscles: "Najszersze grzbietu, obły większy, biceps, przedramiona", gear: "Drążek (opcjonalnie guma do asysty)", top: true, video: "podciaganie-nachwytem", alt: "Animowany pitbull podciąga się na drążku nachwytem.",
    steps: [
      { title: "Zwis", detail: "Chwyt nachwytem nieco szerzej niż barki, pełny zwis, brzuch napięty." },
      { title: "Inicjacja", detail: "Ściągnij łopatki w dół, zanim ugniesz łokcie." },
      { title: "Podciąganie", detail: "Ciągnij łokcie w dół do żeber, aż broda minie drążek." },
      { title: "Opuszczanie", detail: "Zejdź powoli (2–3 s) do pełnego wyprostu." },
    ],
    mistakes: ["Bujanie i wymachy nogami", "Niepełny zakres ruchu", "Wysunięta do przodu głowa", "Gwałtowne opadanie"] },
  { id: "chinup", name: "Podciąganie podchwytem", muscles: "Najszersze grzbietu, biceps, ramienny", gear: "Drążek (opcjonalnie guma do asysty)", top: true, video: "podciaganie-podchwytem", alt: "Animowany husky Rico podciąga się na drążku podchwytem.",
    steps: [
      { title: "Chwyt", detail: "Dłonie skierowane do siebie, na szerokość barków." },
      { title: "Napięcie", detail: "Łopatki w dół, nogi razem, pośladki napięte." },
      { title: "Ruch", detail: "Podciągnij się, aż broda znajdzie się nad drążkiem." },
      { title: "Kontrola", detail: "Opuszczaj się powoli do pełnego zwisu." },
    ],
    mistakes: ["Skracanie ruchu na dole", "Wymachy biodrami", "Unoszenie barków do uszu", "Za szybkie opuszczanie"] },
  { id: "curl", name: "Uginanie ramion z hantlami", muscles: "Biceps, ramienny, ramienno-promieniowy", gear: "Hantle", video: "uginanie-ramion-z-hantlami", alt: "Animowany pitbull stojąc ugina ramiona z hantlami.",
    steps: [
      { title: "Pozycja", detail: "Stań prosto, hantle w dłoniach, kciuki na zewnątrz, łokcie przy tułowiu." },
      { title: "Uginanie", detail: "Unieś hantle do wysokości barków, nie przesuwając łokci." },
      { title: "Spięcie", detail: "Zatrzymaj na 1 s na górze." },
      { title: "Opuszczanie", detail: "Opuszczaj powoli do pełnego wyprostu." },
    ],
    mistakes: ["Bujanie tułowiem", "Wysuwanie łokci do przodu", "Niepełny wyprost na dole", "Zbyt duży ciężar"] },
  { id: "lunge", name: "Wykroki z hantlami", muscles: "Czworogłowe ud, pośladki, przywodziciele", gear: "Hantle", video: "wykroki-z-hantlami", alt: "Animowany husky Rico wykonuje wykroki w przód z hantlami w dłoniach.",
    steps: [
      { title: "Start", detail: "Stań prosto, hantle wzdłuż tułowia." },
      { title: "Krok", detail: "Zrób długi krok w przód, tułów pionowo." },
      { title: "Zejście", detail: "Opuść tylne kolano tuż nad podłogę; oba kolana ugięte ok. 90°." },
      { title: "Powrót", detail: "Odepchnij się przednią nogą do pozycji wyjściowej, zmień nogę." },
    ],
    mistakes: ["Zbyt krótki krok", "Przednie kolano uciekające do środka", "Pochylanie tułowia", "Uderzanie kolanem o podłogę"] },
  { id: "facepull", name: "Face pull z gumą", muscles: "Tylne aktony barków, rotatory zewnętrzne, czworoboczny", gear: "Guma oporowa", video: "face-pull-z-guma", alt: "Animowany pitbull przyciąga gumę oporową do twarzy z wysoko uniesionymi łokciami.",
    steps: [
      { title: "Mocowanie", detail: "Zaczep gumę na wysokości twarzy, chwyć oba końce." },
      { title: "Pozycja", detail: "Odsuń się, by guma była napięta, ramiona wyprostowane przed sobą." },
      { title: "Przyciąganie", detail: "Ciągnij w stronę twarzy, łokcie wysoko i szeroko, dłonie kończą przy uszach." },
      { title: "Powrót", detail: "Ściągnij łopatki na 1 s i wróć powoli." },
    ],
    mistakes: ["Opuszczone łokcie", "Odchylanie tułowia", "Za mocna guma", "Szarpany ruch"] },
  { id: "pushdown", name: "Prostowanie ramion z gumą", muscles: "Triceps", gear: "Guma oporowa, drążek do zaczepienia", video: "prostowanie-ramion-z-guma", alt: "Animowany husky Rico prostuje ramiona w dół z gumą zaczepioną nad głową.",
    steps: [
      { title: "Mocowanie", detail: "Zaczep gumę wysoko, np. o drążek." },
      { title: "Pozycja", detail: "Łokcie przy tułowiu, lekki pochył w przód." },
      { title: "Prostowanie", detail: "Wyprostuj przedramiona w dół do pełnego wyprostu, spięcie 1 s." },
      { title: "Powrót", detail: "Wróć powoli do wysokości klatki; ramiona nieruchome." },
    ],
    mistakes: ["Odsuwanie łokci od tułowia", "Pomaganie sobie barkami", "Niepełny wyprost", "Zbyt szybki powrót"] },
  { id: "lateral", name: "Unoszenie hantli bokiem", muscles: "Boczne aktony barków", gear: "Hantle (lekkie)", video: "unoszenie-hantli-bokiem", alt: "Animowany pitbull unosi lekkie hantle bokiem do wysokości barków.",
    steps: [
      { title: "Start", detail: "Stań prosto, hantle przy udach, łokcie lekko ugięte." },
      { title: "Unoszenie", detail: "Unieś ramiona bokiem do wysokości barków, prowadząc łokciami." },
      { title: "Góra", detail: "Krótka pauza, barki daleko od uszu." },
      { title: "Opuszczanie", detail: "Opuszczaj powoli przez 2–3 s." },
    ],
    mistakes: ["Za ciężkie hantle i bujanie", "Unoszenie powyżej barków z wzruszaniem", "Proste, zablokowane łokcie", "Za szybkie opuszczanie"] },
  { id: "knee", name: "Unoszenie kolan w zwisie", muscles: "Mięśnie brzucha, zginacze bioder", gear: "Drążek", top: true, video: "unoszenie-kolan-w-zwisie", alt: "Animowany husky Rico w zwisie na drążku unosi ugięte kolana do klatki.",
    steps: [
      { title: "Zwis", detail: "Chwyć drążek, ciało nieruchome, łopatki lekko ściągnięte." },
      { title: "Unoszenie", detail: "Podciągnij kolana w stronę klatki, podwijając miednicę." },
      { title: "Szczyt", detail: "Zatrzymaj na 1 s." },
      { title: "Opuszczanie", detail: "Opuść nogi powoli, bez bujania." },
    ],
    mistakes: ["Bujanie całym ciałem", "Unoszenie tylko do poziomu bioder", "Brak podwinięcia miednicy", "Szybkie opadanie nóg"] },
  { id: "rope", name: "Skakanka", muscles: "Łydki, układ krążenia, koordynacja", gear: "Skakanka", video: "skakanka", alt: "Animowany pitbull skacze na skakance w spokojnym rytmie.",
    steps: [
      { title: "Długość", detail: "Stojąc na środku skakanki, uchwyty sięgają pod pachy." },
      { title: "Pozycja", detail: "Łokcie blisko tułowia, kręcenie z nadgarstków." },
      { title: "Skoki", detail: "Niskie skoki na śródstopiu, kolana lekko ugięte." },
      { title: "Rytm", detail: "Równe tempo; zacznij od 30–60 s pracy." },
    ],
    mistakes: ["Za wysokie skoki", "Kręcenie całymi ramionami", "Lądowanie na piętach", "Twarda nawierzchnia bez amortyzacji"] },
  { id: "bike", name: "Rowerek stacjonarny", muscles: "Układ krążenia, czworogłowe ud, pośladki", gear: "Rowerek stacjonarny", video: "rowerek-stacjonarny", alt: "Animowany husky Rico jedzie na rowerku stacjonarnym w spokojnym tempie.",
    steps: [
      { title: "Siodełko", detail: "Na wysokości biodra; na dole kolano lekko ugięte." },
      { title: "Postawa", detail: "Plecy proste, ręce luźno na kierownicy." },
      { title: "Tempo", detail: "Rozgrzewka: lekko. Cardio: tempo pozwalające na rozmowę." },
      { title: "Czas", detail: "5 min przed treningiem, 20–30 min w dni cardio." },
    ],
    mistakes: ["Za nisko ustawione siodełko", "Zbyt duży opór na rozgrzewce", "Garbienie się", "Za intensywne cardio, które utrudnia regenerację"] },
];

const exById = (id        )     => EX.find((e    ) => e.id === id) ?? EX[0];

const PRESC                                                                = {
  glowne: { sets: ["3 × 10", "4 × 8", "4 × 6–8", "5 × 5"], rest: "2–3 min", tempo: "3–1–1" },
  pomocnicze: { sets: ["3 × 12", "3 × 12–15", "4 × 10–12", "4 × 10–12"], rest: "60–90 s", tempo: "2–1–1" },
  wlasne: { sets: ["3 × 5–8", "4 × 5–8", "4 × 6–10", "5 × 6–10"], rest: "2 min", tempo: "2–0–2" },
  brzuch: { sets: ["3 × 10", "3 × 12", "4 × 12", "4 × 15"], rest: "60 s", tempo: "2–1–2" },
};

const DAYS        = [
  { short: "Pn", full: "Poniedziałek", name: "Góra A", type: "trening", slots: [
    { ex: "floor", kind: "glowne" }, { ex: "row", kind: "glowne" }, { ex: "pullup", kind: "wlasne" },
    { ex: "lateral", kind: "pomocnicze" }, { ex: "pushdown", kind: "pomocnicze" }, { ex: "curl", kind: "pomocnicze" } ] },
  { short: "Wt", full: "Wtorek", name: "Dół A", type: "trening", slots: [
    { ex: "squat", kind: "glowne" }, { ex: "rdl", kind: "pomocnicze" }, { ex: "lunge", kind: "pomocnicze" }, { ex: "knee", kind: "brzuch" } ] },
  { short: "Śr", full: "Środa", name: "Regeneracja aktywna", type: "odpoczynek", slots: [] },
  { short: "Cz", full: "Czwartek", name: "Góra B", type: "trening", slots: [
    { ex: "ohp", kind: "glowne" }, { ex: "chinup", kind: "wlasne" }, { ex: "floor", kind: "pomocnicze" },
    { ex: "row", kind: "pomocnicze" }, { ex: "facepull", kind: "pomocnicze" }, { ex: "curl", kind: "pomocnicze" } ] },
  { short: "Pt", full: "Piątek", name: "Dół B", type: "trening", slots: [
    { ex: "rdl", kind: "glowne" }, { ex: "squat", kind: "pomocnicze" }, { ex: "lunge", kind: "pomocnicze" }, { ex: "knee", kind: "brzuch" } ] },
  { short: "So", full: "Sobota", name: "Lekkie cardio", type: "cardio", slots: [] },
  { short: "Nd", full: "Niedziela", name: "Odpoczynek", type: "odpoczynek", slots: [] },
];

const WEEK_NOTE           = [
  "Tydzień 1 — wprowadzenie. Dobierz ciężar tak, by w każdej serii zostały 3 powtórzenia zapasu. Zapisz ciężary.",
  "Tydzień 2 — dodaj serię w ćwiczeniach głównych i 2,5 kg (lub 1 powtórzenie w pomocniczych). Zapas: 2–3 powtórzenia.",
  "Tydzień 3 — mniej powtórzeń, większy ciężar: kolejne 2,5–5 kg w ćwiczeniach głównych. Zapas: 2 powtórzenia.",
  "Tydzień 4 — najcięższy tydzień: 5 × 5 w ćwiczeniach głównych, zapas 1 powtórzenie. Po nim zrób 3–4 dni lżejsze i zacznij nowy cykl od ciężarów z tygodnia 2.",
];
const CARDIO           = [
  "Rowerek 25 min w tempie rozmowy",
  "Rowerek 25 min + skakanka 5 × 1 min (1 min przerwy)",
  "Rowerek 30 min + skakanka 6 × 1 min (1 min przerwy)",
  "Rowerek 30 min + skakanka 6 × 1 min (1 min przerwy)",
];
const KIND_LABEL                       = { glowne: "Główne", pomocnicze: "Pomocnicze", wlasne: "Masa ciała", brzuch: "Brzuch" };

// ---------- Żywienie ----------
// g: grupa do przeliczania porcji (P — białko, F — tłuszcze, C — węglowodany, V — warzywa stałe)
const ING = {
  owies: { n: "Płatki owsiane", k: 370, p: 13, f: 7, c: 60, cat: "zb", g: "C" },
  mleko: { n: "Mleko 2%", k: 50, p: 3.4, f: 2, c: 4.8, cat: "nab", g: "C", ml: true },
  jajko: { n: "Jajka", k: 140, p: 12.5, f: 9.7, c: 0.7, cat: "nab", g: "P", szt: 55 },
  chleb: { n: "Chleb żytni razowy", k: 230, p: 6.5, f: 1.5, c: 45, cat: "zb", g: "C" },
  twarog: { n: "Twaróg półtłusty", k: 133, p: 18, f: 4.7, c: 3.7, cat: "nab", g: "P" },
  skyr: { n: "Skyr naturalny", k: 65, p: 11, f: 0.2, c: 4, cat: "nab", g: "P" },
  serek: { n: "Serek wiejski", k: 97, p: 11, f: 4.5, c: 2.5, cat: "nab", g: "P" },
  kefir: { n: "Kefir", k: 50, p: 3.4, f: 2, c: 4.5, cat: "nab", g: "C", ml: true },
  ser: { n: "Ser żółty", k: 350, p: 25, f: 27, c: 0, cat: "nab", g: "F" },
  banan: { n: "Banany", k: 95, p: 1.1, f: 0.3, c: 22, cat: "ow", g: "C" },
  jablko: { n: "Jabłka", k: 52, p: 0.3, f: 0.2, c: 12, cat: "ow", g: "C" },
  borowki: { n: "Owoce jagodowe (mrożone)", k: 50, p: 0.7, f: 0.3, c: 11, cat: "ow", g: "C" },
  brokul: { n: "Warzywa mieszane / brokuł (mrożone)", k: 35, p: 3, f: 0.4, c: 5, cat: "war", g: "V" },
  pomidor: { n: "Pomidory", k: 18, p: 0.9, f: 0.2, c: 3.5, cat: "war", g: "V" },
  ogorek: { n: "Ogórki", k: 15, p: 0.7, f: 0.1, c: 3, cat: "war", g: "V" },
  papryka: { n: "Papryka", k: 30, p: 1, f: 0.3, c: 6, cat: "war", g: "V" },
  ziemniak: { n: "Ziemniaki", k: 77, p: 2, f: 0.1, c: 17, cat: "war", g: "C" },
  awokado: { n: "Awokado", k: 160, p: 2, f: 15, c: 2, cat: "tl", g: "F" },
  kurczak: { n: "Pierś z kurczaka", k: 110, p: 23, f: 1.5, c: 0, cat: "mie", g: "P" },
  indyk: { n: "Pierś z indyka", k: 105, p: 23, f: 1, c: 0, cat: "mie", g: "P" },
  wolowina: { n: "Wołowina mielona chuda", k: 170, p: 20, f: 10, c: 0, cat: "mie", g: "P" },
  losos: { n: "Łosoś", k: 200, p: 20, f: 13, c: 0, cat: "mie", g: "P" },
  dorsz: { n: "Dorsz lub mintaj", k: 75, p: 17, f: 0.7, c: 0, cat: "mie", g: "P" },
  tunczyk: { n: "Tuńczyk w sosie własnym (po odsączeniu)", k: 110, p: 25, f: 1, c: 0, cat: "mie", g: "P" },
  szynka: { n: "Szynka z indyka", k: 105, p: 19, f: 2.5, c: 1.5, cat: "mie", g: "P" },
  ryz: { n: "Ryż (suchy)", k: 350, p: 7, f: 0.7, c: 78, cat: "zb", g: "C" },
  kasza: { n: "Kasza gryczana (sucha)", k: 345, p: 12.5, f: 3, c: 69, cat: "zb", g: "C" },
  makaron: { n: "Makaron pełnoziarnisty (suchy)", k: 350, p: 13, f: 2.5, c: 66, cat: "zb", g: "C" },
  tortilla: { n: "Tortille pełnoziarniste", k: 300, p: 9, f: 7, c: 48, cat: "zb", g: "C", szt: 60 },
  fasola: { n: "Fasola czerwona (puszka, po odsączeniu)", k: 110, p: 7.5, f: 0.5, c: 18, cat: "inne", g: "C" },
  passata: { n: "Passata pomidorowa", k: 35, p: 1.5, f: 0.2, c: 6, cat: "inne", g: "V" },
  oliwa: { n: "Oliwa z oliwek", k: 880, p: 0, f: 100, c: 0, cat: "tl", g: "F" },
  maslo_orz: { n: "Masło orzechowe", k: 600, p: 25, f: 50, c: 15, cat: "tl", g: "F" },
  orzechy: { n: "Orzechy włoskie", k: 650, p: 15, f: 65, c: 7, cat: "tl", g: "F" },
  hummus: { n: "Hummus", k: 250, p: 7, f: 18, c: 14, cat: "inne", g: "F" },
  miod: { n: "Miód", k: 320, p: 0.3, f: 0, c: 80, cat: "inne", g: "C" },
};
const SHOP_CATS = [["mie", "Mięso i ryby"], ["nab", "Nabiał i jaja"], ["zb", "Pieczywo i zboża"], ["war", "Warzywa"], ["ow", "Owoce"], ["tl", "Tłuszcze i orzechy"], ["inne", "Inne"]];

// Każde danie: składniki porcji bazowej (g), czas (min) i kroki przepisu.
const D = (name, items, time, steps) => ({ name, items, time, steps });
const B = [
  D("Owsianka z bananem i masłem orzechowym", [["owies", 90], ["mleko", 300], ["banan", 120], ["maslo_orz", 20]], 10,
    ["Zagotuj mleko w garnku.", "Wsyp płatki i gotuj 3–4 min na małym ogniu, mieszając.", "Przełóż do miski i dodaj pokrojonego banana.", "Na wierzch nałóż masło orzechowe."]),
  D("Jajecznica z chlebem i pomidorem", [["jajko", 220], ["chleb", 120], ["pomidor", 150]], 10,
    ["Rozbij jajka do miski i roztrzep ze szczyptą soli.", "Smaż na patelni z powłoką na małym ogniu 3–4 min, mieszając, aż się zetną.", "Pokrój pomidora w plastry, dopraw pieprzem.", "Podawaj z chlebem."]),
  D("Twarożek z ogórkiem, chleb, orzechy", [["twarog", 200], ["chleb", 120], ["ogorek", 150], ["orzechy", 15]], 7,
    ["Rozgnieć twaróg widelcem z 2–3 łyżkami wody lub mleka.", "Pokrój ogórka w drobną kostkę i wymieszaj z twarogiem; dopraw solą, pieprzem i szczypiorkiem.", "Posyp posiekanymi orzechami.", "Podawaj z chlebem."]),
  D("Omlet owsiany z bananem", [["jajko", 165], ["owies", 60], ["banan", 100], ["mleko", 100]], 12,
    ["Wymieszaj jajka, płatki i mleko; odstaw na 3 min, by płatki zmiękły.", "Wylej masę na rozgrzaną patelnię z powłoką.", "Smaż pod przykryciem 3–4 min, przewróć i smaż jeszcze 1–2 min.", "Podawaj z pokrojonym bananem."]),
  D("Kanapki z szynką, serem i papryką", [["chleb", 150], ["szynka", 100], ["ser", 40], ["papryka", 100]], 5,
    ["Pokrój chleb w kromki.", "Ułóż na nich szynkę i ser.", "Dodaj paprykę pokrojoną w paski."]),
  D("Skyr z płatkami, owocami i orzechami", [["skyr", 300], ["owies", 60], ["borowki", 150], ["orzechy", 20]], 5,
    ["Rozmroź owoce (wieczorem w lodówce albo 1 min w mikrofalówce).", "Przełóż skyr do miski i wymieszaj z płatkami.", "Na wierzch wyłóż owoce i posiekane orzechy."]),
  D("Tortilla z jajkami, serem i awokado", [["tortilla", 80], ["jajko", 165], ["ser", 30], ["pomidor", 100], ["awokado", 50]], 12,
    ["Usmaż jajecznicę na małym ogniu.", "Podgrzej tortillę na suchej patelni po 30 s z każdej strony.", "Rozgnieć awokado widelcem i posmaruj tortillę.", "Dodaj jajecznicę, starty ser i pokrojonego pomidora, zwiń."]),
];
const S1 = [
  D("Skyr z bananem i orzechami", [["skyr", 200], ["banan", 120], ["orzechy", 15]], 3,
    ["Przełóż skyr do miski.", "Dodaj pokrojonego banana.", "Posyp posiekanymi orzechami."]),
  D("Kanapka z tuńczykiem i jabłko", [["chleb", 80], ["tunczyk", 80], ["ogorek", 80], ["jablko", 150]], 5,
    ["Odsącz tuńczyka i rozgnieć go widelcem z pieprzem i kroplą soku z cytryny.", "Nałóż na chleb i dodaj plastry ogórka.", "Jabłko zjedz jako dodatek."]),
  D("Kefir z płatkami owsianymi", [["kefir", 400], ["owies", 50]], 3,
    ["Wsyp płatki do kubka lub słoika.", "Zalej kefirem i wymieszaj.", "Odstaw na 5–10 min (albo na noc do lodówki), aż płatki zmiękną."]),
  D("Serek wiejski z chlebem i pomidorem", [["serek", 200], ["chleb", 80], ["pomidor", 100]], 4,
    ["Przełóż serek do miseczki, dopraw pieprzem i szczypiorkiem.", "Pokrój pomidora.", "Podawaj z chlebem."]),
  D("Skyr, jabłko z masłem orzechowym", [["skyr", 150], ["jablko", 180], ["maslo_orz", 30]], 4,
    ["Pokrój jabłko w ósemki.", "Maczaj kawałki jabłka w maśle orzechowym.", "Skyr zjedz obok, np. z odrobiną cynamonu."]),
  D("Mini tortilla z hummusem i jajkami", [["tortilla", 60], ["hummus", 40], ["jajko", 110], ["papryka", 100]], 15,
    ["Ugotuj jajka na twardo (9–10 min), przelej zimną wodą i obierz.", "Posmaruj tortillę hummusem.", "Dodaj pokrojone jajka i paprykę, zwiń."]),
  D("Skyr z owocami i płatkami", [["skyr", 250], ["borowki", 150], ["owies", 30]], 4,
    ["Rozmroź owoce.", "Wymieszaj skyr z płatkami.", "Dodaj owoce."]),
];
const L = [
  D("Kurczak, ryż, brokuł", [["kurczak", 200], ["ryz", 100], ["brokul", 250], ["oliwa", 10]], 25,
    ["Ugotuj ryż według opakowania (ok. 15 min).", "Pokrój kurczaka w kostkę i dopraw solą, pieprzem i słodką papryką.", "Smaż na oliwie 6–8 min, aż mięso będzie białe w środku.", "Brokuł ugotuj na parze lub w wodzie 5–6 min.", "Podawaj razem."]),
  D("Spaghetti z wołowiną w sosie pomidorowym", [["makaron", 110], ["wolowina", 150], ["passata", 200], ["oliwa", 10]], 25,
    ["Ugotuj makaron al dente.", "Na oliwie podsmaż wołowinę 5–6 min, rozbijając grudki.", "Wlej passatę, dopraw solą, pieprzem, oregano i czosnkiem; duś 10 min.", "Wymieszaj sos z makaronem."]),
  D("Łosoś z ziemniakami i warzywami", [["losos", 150], ["ziemniak", 350], ["brokul", 200], ["oliwa", 5]], 30,
    ["Obierz ziemniaki i ugotuj w osolonej wodzie (ok. 20 min).", "Łososia dopraw solą, pieprzem i cytryną; piecz 12–15 min w 200°C.", "Warzywa ugotuj na parze 5–6 min i skrop oliwą.", "Podawaj razem."]),
  D("Indyk z kaszą gryczaną i warzywami", [["indyk", 200], ["kasza", 100], ["brokul", 250], ["oliwa", 10]], 25,
    ["Ugotuj kaszę (1 część kaszy na 2 części wody, ok. 15 min).", "Pokrój indyka w paski, dopraw i usmaż na oliwie 6–7 min.", "Dodaj warzywa i podsmaż razem 4–5 min.", "Podawaj z kaszą."]),
  D("Chili con carne z ryżem", [["wolowina", 150], ["fasola", 150], ["ryz", 90], ["papryka", 150], ["passata", 100]], 30,
    ["Ugotuj ryż.", "Podsmaż wołowinę na patelni 5 min.", "Dodaj pokrojoną paprykę i smaż 3 min.", "Wlej passatę, dodaj odsączoną fasolę, dopraw kuminem, papryką, chili i solą; duś 10–15 min.", "Podawaj z ryżem."]),
  D("Dorsz z ryżem i warzywami", [["dorsz", 250], ["ryz", 100], ["brokul", 250], ["oliwa", 15]], 25,
    ["Ugotuj ryż.", "Rybę dopraw solą, pieprzem i koperkiem; usmaż na części oliwy po 3–4 min z każdej strony.", "Warzywa ugotuj na parze i polej resztą oliwy.", "Podawaj razem."]),
  D("Makaron z kurczakiem, warzywami i serem", [["kurczak", 200], ["makaron", 100], ["brokul", 200], ["ser", 20], ["oliwa", 10]], 25,
    ["Ugotuj makaron.", "Pokrój kurczaka i usmaż na oliwie 6–8 min.", "Dodaj warzywa i smaż jeszcze 4–5 min.", "Wymieszaj z makaronem i posyp startym serem."]),
];
const S2 = [
  D("Kanapka z masłem orzechowym i bananem", [["chleb", 60], ["maslo_orz", 25], ["banan", 120]], 3,
    ["Posmaruj chleb masłem orzechowym.", "Ułóż plasterki banana."]),
  D("Kefir, banan, orzechy", [["kefir", 400], ["banan", 120], ["orzechy", 15]], 3,
    ["Zmiksuj kefir z bananem na koktajl (albo pokrój banana do miski i zalej kefirem).", "Posyp posiekanymi orzechami."]),
  D("Skyr z miodem i płatkami", [["skyr", 200], ["miod", 15], ["owies", 40]], 3,
    ["Wymieszaj skyr z płatkami.", "Polej miodem."]),
  D("Kanapki z szynką i jabłko", [["chleb", 100], ["szynka", 60], ["pomidor", 100], ["jablko", 150]], 5,
    ["Ułóż szynkę i plastry pomidora na kromkach chleba.", "Jabłko zjedz jako dodatek."]),
  D("Serek wiejski z owocami i orzechami", [["serek", 200], ["borowki", 150], ["orzechy", 15]], 4,
    ["Rozmroź owoce.", "Wymieszaj serek z owocami.", "Posyp posiekanymi orzechami."]),
  D("Koktajl: mleko, banan, płatki, masło orzechowe", [["mleko", 300], ["banan", 120], ["owies", 40], ["maslo_orz", 15]], 5,
    ["Włóż wszystkie składniki do blendera.", "Miksuj 30–60 s do gładkości.", "Wypij od razu."]),
  D("Twaróg z miodem i jabłkiem", [["twarog", 150], ["miod", 15], ["jablko", 150]], 5,
    ["Rozgnieć twaróg z odrobiną wody lub mleka.", "Dodaj startego lub pokrojonego w kostkę jabłka.", "Polej miodem, opcjonalnie posyp cynamonem."]),
];
const K = [
  D("Omlet z serem i warzywami, chleb", [["jajko", 165], ["ser", 30], ["brokul", 150], ["chleb", 80]], 15,
    ["Podgrzej warzywa na patelni 3–4 min.", "Roztrzep jajka ze szczyptą soli i wylej na warzywa.", "Smaż pod przykryciem na małym ogniu 4–5 min; pod koniec posyp startym serem.", "Podawaj z chlebem."]),
  D("Sałatka z tuńczykiem i ryżem", [["tunczyk", 120], ["ryz", 70], ["ogorek", 100], ["pomidor", 100], ["oliwa", 10]], 20,
    ["Ugotuj ryż i ostudź.", "Pokrój ogórka i pomidora.", "Wymieszaj ryż, odsączonego tuńczyka i warzywa.", "Polej oliwą, dopraw solą, pieprzem i sokiem z cytryny."]),
  D("Wrap z kurczakiem, papryką i hummusem", [["tortilla", 120], ["kurczak", 150], ["papryka", 100], ["hummus", 40]], 15,
    ["Pokrój kurczaka w paski, dopraw i usmaż 6–8 min.", "Podgrzej tortille na suchej patelni.", "Posmaruj hummusem, dodaj kurczaka i paprykę w paskach, zwiń."]),
  D("Twaróg z pomidorem, chleb", [["twarog", 200], ["chleb", 120], ["pomidor", 150], ["oliwa", 5]], 5,
    ["Rozgnieć twaróg, dopraw solą, pieprzem i bazylią.", "Dodaj pokrojonego pomidora i skrop oliwą.", "Podawaj z chlebem."]),
  D("Indyk z kaszą i warzywami", [["indyk", 150], ["kasza", 70], ["brokul", 200], ["oliwa", 10]], 25,
    ["Ugotuj kaszę (ok. 15 min).", "Pokrój indyka w kostkę, dopraw i usmaż na oliwie 6–7 min.", "Dodaj warzywa i duś pod przykryciem 5 min.", "Podawaj z kaszą."]),
  D("Kanapki z łososiem i serkiem", [["losos", 100], ["chleb", 120], ["serek", 100], ["ogorek", 100]], 20,
    ["Upiecz łososia 12–15 min w 200°C (albo odłóż porcję z obiadu) i rozdrobnij widelcem.", "Posmaruj chleb serkiem wiejskim.", "Ułóż łososia i plastry ogórka, dopraw pieprzem i koperkiem."]),
  D("Jajka sadzone z ziemniakami i ogórkiem", [["jajko", 165], ["ziemniak", 300], ["ogorek", 150], ["oliwa", 5]], 25,
    ["Ugotuj ziemniaki w osolonej wodzie (ok. 20 min).", "Usmaż jajka sadzone na oliwie 3–4 min.", "Pokrój ogórka w plastry i dopraw.", "Podawaj razem."]),
];
// Zamienniki dań zależne od celu
const ALT = {
  owsSkyr: D("Owsianka ze skyrem i owocami jagodowymi", [["owies", 60], ["mleko", 200], ["skyr", 150], ["borowki", 150]], 10,
    ["Zagotuj mleko i ugotuj w nim płatki 3–4 min.", "Lekko przestudź i wmieszaj skyr.", "Dodaj rozmrożone owoce."]),
  serekWarz: D("Serek wiejski z pomidorem i ogórkiem", [["serek", 200], ["pomidor", 150], ["ogorek", 100]], 4,
    ["Pokrój pomidora i ogórka w kostkę.", "Wymieszaj z serkiem, dopraw pieprzem i szczypiorkiem."]),
  skyrOw: D("Skyr z owocami jagodowymi", [["skyr", 250], ["borowki", 150]], 3,
    ["Rozmroź owoce.", "Wymieszaj ze skyrem."]),
  jajkaPap: D("Jajka na twardo z papryką", [["jajko", 110], ["papryka", 150]], 12,
    ["Ugotuj jajka na twardo (9–10 min), przelej zimną wodą i obierz.", "Pokrój paprykę w paski.", "Dopraw jajka solą i pieprzem."]),
  kefirOw: D("Kefir z owocami jagodowymi", [["kefir", 300], ["borowki", 100]], 3,
    ["Zmiksuj kefir z owocami w blenderze.", "Wypij od razu."]),
  twarogWarz: D("Twarożek z ogórkiem i papryką", [["twarog", 150], ["ogorek", 100], ["papryka", 100]], 5,
    ["Rozgnieć twaróg z 2 łyżkami wody.", "Dodaj pokrojone warzywa, dopraw solą, pieprzem i szczypiorkiem."]),
  salTunczyk: D("Sałatka z tuńczykiem i warzywami", [["tunczyk", 80], ["pomidor", 150], ["ogorek", 100], ["oliwa", 5]], 7,
    ["Pokrój pomidora i ogórka.", "Dodaj odsączonego tuńczyka.", "Skrop oliwą i sokiem z cytryny, dopraw."]),
  jablkoSkyr: D("Jabłko i skyr naturalny", [["skyr", 200], ["jablko", 150]], 2,
    ["Pokrój jabłko.", "Zjedz ze skyrem (możesz posypać cynamonem)."]),
  kanMiod: D("Kanapka z serkiem, miodem i bananem", [["chleb", 80], ["serek", 100], ["miod", 15], ["banan", 120]], 4,
    ["Posmaruj chleb serkiem.", "Ułóż plasterki banana i polej miodem."]),
  ryzMleko: D("Ryż na mleku z owocami", [["ryz", 60], ["mleko", 300], ["borowki", 150], ["miod", 10]], 25,
    ["Zagotuj mleko, wsyp ryż i gotuj pod przykryciem na małym ogniu ok. 20 min, często mieszając.", "Dosłodź miodem.", "Podawaj z rozmrożonymi owocami."]),
  makTunczyk: D("Makaron z tuńczykiem w sosie pomidorowym", [["makaron", 90], ["tunczyk", 120], ["passata", 200], ["oliwa", 5]], 20,
    ["Ugotuj makaron.", "Podgrzej passatę z oliwą, czosnkiem i oregano 5 min.", "Dodaj odsączonego tuńczyka i wymieszaj z makaronem."]),
};
const SLOTS = [
  { label: "Śniadanie", pool: B, off: 1 },
  { label: "II śniadanie", pool: S1, off: 3 },
  { label: "Obiad", pool: L, off: 2 },
  { label: "Podwieczorek", pool: S2, off: 5 },
  { label: "Kolacja", pool: K, off: 4 },
];
// Cele: mnożniki kcal, białko i tłuszcze (g/kg), zamiany dań [slot, indeks, danie] lub cała pula
const GOALS = {
  masa: { sex: "m", label: "Budowa masy mięśniowej", short: "Nadwyżka kalorii", kf: [["33", "mało ruchu poza treningiem"], ["34", "umiarkowana aktywność"], ["35", "dużo ruchu w ciągu dnia"]], kfDef: "34",
    pf: ["1.6", "1.8", "2.0", "2.2"], pfDef: "2.0", fat: 0.9, swaps: [],
    note: "Niewielka nadwyżka energii (ok. 10–15% ponad utrzymanie). Jeśli przez 2 tygodnie masa ciała stoi w miejscu, dodaj ok. 150–200 kcal dziennie (np. większa porcja ryżu lub płatków).",
    cardio: "Cardio lekkie: sobota 25–30 min w tempie rozmowy, w środę opcjonalnie spacer. Więcej nie trzeba — za dużo cardio utrudnia regenerację." },
  redukcja: { sex: "m", label: "Redukcja tkanki tłuszczowej", short: "Deficyt kalorii", kf: [["25", "mało ruchu poza treningiem"], ["26", "umiarkowana aktywność"], ["27", "dużo ruchu w ciągu dnia"]], kfDef: "26",
    pf: ["2.0", "2.2", "2.4"], pfDef: "2.2", fat: 0.8, cond: true,
    swaps: [[0, 0, ALT.owsSkyr], [3, null, [ALT.serekWarz, ALT.skyrOw, ALT.jajkaPap, ALT.kefirOw, ALT.twarogWarz, ALT.salTunczyk, ALT.jablkoSkyr]]],
    note: "Deficyt ok. 15–20%. Celuj w spadek 0,5–1% masy ciała na tydzień; jeśli przez 2 tygodnie waga stoi, odejmij 100–150 kcal. Wyższe białko pomaga zachować mięśnie, a lżejsze podwieczorki ułatwiają trzymanie kalorii.",
    cardio: "Dodaj 2–3 sesje spokojnego rowerka po 25–35 min (np. środa, sobota, niedziela) i celuj w 8–10 tys. kroków dziennie. Trening siłowy zostaw bez zmian — to on chroni mięśnie w deficycie." },
  utrzymanie: { sex: "m", label: "Utrzymanie wagi", short: "Bilans zerowy", kf: [["29", "mało ruchu poza treningiem"], ["30", "umiarkowana aktywność"], ["31", "dużo ruchu w ciągu dnia"]], kfDef: "30",
    pf: ["1.6", "1.8", "2.0"], pfDef: "1.8", fat: 0.9, swaps: [],
    note: "Energia zbliżona do wydatku. Jeśli waga zmieni się o więcej niż 1 kg w ciągu 2 tygodni, skoryguj o 100–150 kcal w odpowiednią stronę.",
    cardio: "Sobotnie cardio jak w planie plus jedna dodatkowa sesja 20–30 min rowerka w środę." },
  kondycja: { sex: "m", label: "Lepsza kondycja", short: "Więcej węglowodanów", kf: [["30", "mało ruchu poza treningiem"], ["31", "umiarkowana aktywność"], ["32", "dużo ruchu w ciągu dnia"]], kfDef: "30",
    pf: ["1.6", "1.8"], pfDef: "1.6", fat: 0.7, cond: true,
    swaps: [[1, 5, ALT.kanMiod], [3, 4, ALT.ryzMleko], [4, 6, ALT.makTunczyk]],
    note: "Mniej tłuszczu, więcej węglowodanów jako paliwa do cardio i interwałów. Posiłek z największą porcją węglowodanów zjedz 2–3 godziny przed wysiłkiem.",
    cardio: "3 sesje cardio: środa — rowerek 30–40 min w tempie rozmowy; sobota — interwały na rowerku 8 × 30 s szybko / 90 s spokojnie + skakanka 6 × 1 min; niedziela — 30–45 min spaceru lub lekkiej jazdy. W tygodniu 4 skróć interwały o połowę." },
};
// Cele w wersji dla kobiet (niższe mnożniki kcal, domyślnie 62 kg)
Object.assign(GOALS, {
  k_odch: { sex: "k", label: "Odchudzanie", short: "Deficyt kalorii", kf: [["24", "mało ruchu poza treningiem"], ["25", "umiarkowana aktywność"], ["26", "dużo ruchu w ciągu dnia"], ["27", "bardzo aktywny dzień"]], kfDef: "25",
    pf: ["1.8", "1.9", "2.0"], pfDef: "2.0", fat: 0.8, cond: true, circuit: true, swaps: GOALS.redukcja.swaps,
    note: "Deficyt ok. 15–20%. Celuj w spadek 0,5–1% masy ciała na tydzień; jeśli przez 2 tygodnie waga stoi, odejmij 100 kcal lub dodaj 2000 kroków dziennie. Wysokie białko i trening siłowy chronią mięśnie i sylwetkę.",
    cardio: "Ćwiczenia pomocnicze wykonuj w obwodzie, a na koniec każdego treningu dodaj krótki finisz kondycyjny. Dodatkowo 2–3 spokojne sesje cardio po 30–40 min (np. środa, sobota, niedziela) i 8–10 tys. kroków dziennie." },
  k_uj: { sex: "k", label: "Ujędrnienie i sylwetka", short: "Bilans zerowy, dużo białka", kf: [["27", "mało ruchu poza treningiem"], ["28", "umiarkowana aktywność"], ["29", "dużo ruchu w ciągu dnia"]], kfDef: "28",
    pf: ["1.6", "1.8", "2.0"], pfDef: "1.8", fat: 0.9, swaps: [],
    note: "Kalorie blisko utrzymania przy wysokim białku — sylwetka zmienia się dzięki treningowi siłowemu. Mierz obwody co 2 tygodnie; jeśli waga rośnie szybciej niż 0,5 kg na miesiąc, odejmij 100 kcal.",
    cardio: "Sobotnie cardio jak w planie plus jedna sesja 20–30 min w środę. Priorytetem jest progresja ciężarów w ćwiczeniach na pośladki i nogi." },
  k_sila: { sex: "k", label: "Budowa siły i mięśni", short: "Lekka nadwyżka", kf: [["30", "mało ruchu poza treningiem"], ["31", "umiarkowana aktywność"], ["32", "dużo ruchu w ciągu dnia"]], kfDef: "31",
    pf: ["1.6", "1.8", "2.0"], pfDef: "1.8", fat: 1.0, swaps: [],
    note: "Lekka nadwyżka energii (ok. 5–10%). Jeśli przez 3 tygodnie waga i ciężary stoją w miejscu, dodaj 100–150 kcal (np. większa porcja płatków lub ryżu).",
    cardio: "Cardio lekkie: sobota 25–30 min w tempie rozmowy. Więcej energii zostaw na trening siłowy." },
  k_utrz: { sex: "k", label: "Utrzymanie wagi", short: "Bilans zerowy", kf: [["28", "mało ruchu poza treningiem"], ["29", "umiarkowana aktywność"], ["30", "dużo ruchu w ciągu dnia"]], kfDef: "29",
    pf: ["1.4", "1.6", "1.8"], pfDef: "1.6", fat: 0.9, swaps: [],
    note: "Energia zbliżona do wydatku. Jeśli waga zmieni się o więcej niż 1 kg w ciągu 2 tygodni, skoryguj o 100 kcal w odpowiednią stronę.",
    cardio: "Sobotnie cardio jak w planie plus jedna dodatkowa sesja 20–30 min w środę." },
  k_kond: { sex: "k", label: "Lepsza kondycja", short: "Więcej węglowodanów", kf: [["29", "mało ruchu poza treningiem"], ["30", "umiarkowana aktywność"], ["31", "dużo ruchu w ciągu dnia"]], kfDef: "30",
    pf: ["1.4", "1.6"], pfDef: "1.6", fat: 0.8, cond: true, swaps: GOALS.kondycja.swaps,
    note: "Mniej tłuszczu, więcej węglowodanów jako paliwa do cardio i interwałów. Posiłek z największą porcją węglowodanów zjedz 2–3 godziny przed wysiłkiem.",
    cardio: "3 sesje cardio: środa — 30–40 min w tempie rozmowy; sobota — interwały 8 × 30 s szybko / 90 s spokojnie + skakanka lub burpees 6 × 40 s; niedziela — 30–45 min spaceru. Na koniec treningów siłowych krótki finisz kondycyjny." },
});
const goalsFor = (sex) => Object.keys(GOALS).filter((k) => GOALS[k].sex === sex);
const goalOf = (g) => GOALS[g] || GOALS.masa;
const slug = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ł/g, "l").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const poolsFor = (g) => SLOTS.map((s, i) => {
  let pool = s.pool.slice();
  goalOf(g).swaps.forEach(([si, idx, d]) => { if (si === i) { if (idx === null) pool = d.slice(); else pool[idx] = d; } });
  return pool;
});
const mealsFor = (g, w, d) => { const P = poolsFor(g); return SLOTS.map((s, i) => ({ label: s.label, meal: P[i][(d + w * s.off) % 7] })); };
const allDishes = (g) => { const seen = {}; const out = []; poolsFor(g).forEach((p, i) => p.forEach((m) => { const id = slug(m.name); if (!seen[id]) { seen[id] = 1; out.push({ id, slot: SLOTS[i].label, meal: m }); } })); return out; };
// Dodatkowe przekąski — dokładane do dnia, gdy przy wysokich kaloriach same porcje 5 posiłków byłyby za duże
const EXTRA_LABEL = "Dodatkowa przekąska";
const EXTRA = [
  D("Koktajl owsiany z bananem i masłem orzechowym", [["mleko", 400], ["owies", 60], ["banan", 120], ["maslo_orz", 20]], 5,
    ["Wsyp płatki do blendera i zalej mlekiem.", "Dodaj banana i masło orzechowe.", "Zmiksuj na gładko (ok. 1 min)."]),
  D("Kanapki z indykiem, serem i pomidorem", [["chleb", 100], ["indyk", 100], ["ser", 30], ["pomidor", 120]], 5,
    ["Pokrój chleb i pomidora w plasterki.", "Ułóż na chlebie indyka, ser i pomidor.", "Dopraw pieprzem i ziołami."]),
  D("Twarożek z miodem, orzechami i jabłkiem", [["twarog", 200], ["miod", 15], ["orzechy", 20], ["jablko", 180]], 5,
    ["Rozgnieć twaróg widelcem z miodem.", "Posyp posiekanymi orzechami.", "Podawaj z pokrojonym jabłkiem."]),
];
// Dodatkowe dania do wyboru w „Zamień danie” (po jednym na posiłek; reszta alternatyw pochodzi z puli posiłku)
const ALT_NEW = [
  [D("Jajecznica ze szczypiorkiem, chleb i pomidor", [["jajko", 165], ["chleb", 80], ["pomidor", 150], ["oliwa", 5]], 10,
    ["Rozgrzej oliwę na patelni na małym ogniu.", "Wbij jajka, mieszaj delikatnie 3–4 min, aż się zetną. Posyp szczypiorkiem.", "Podawaj z chlebem i pokrojonym pomidorem."])],
  [D("Kefir z bananem i orzechami", [["kefir", 400], ["banan", 120], ["orzechy", 15]], 3,
    ["Pokrój banana w plasterki.", "Wlej kefir do miski lub kubka, dodaj banana.", "Posyp posiekanymi orzechami."])],
  [D("Dorsz pieczony z ryżem i papryką", [["dorsz", 180], ["ryz", 80], ["papryka", 150], ["oliwa", 10]], 30,
    ["Ugotuj ryż według instrukcji na opakowaniu.", "Dorsza i pokrojoną paprykę skrop oliwą, dopraw solą, pieprzem i papryką słodką.", "Piecz w 200°C ok. 15–18 min, aż ryba będzie się rozwarstwiać.", "Podawaj z ryżem."])],
  [D("Twarożek z borówkami i miodem", [["twarog", 150], ["borowki", 150], ["miod", 10]], 3,
    ["Rozgnieć twaróg widelcem.", "Wymieszaj z miodem.", "Wyłóż borówki na wierzch."])],
  [D("Sałatka z tuńczykiem, fasolą i chlebem", [["tunczyk", 100], ["fasola", 120], ["pomidor", 100], ["ogorek", 100], ["chleb", 60], ["oliwa", 5]], 10,
    ["Odsącz tuńczyka i fasolę, fasolę przepłucz.", "Pokrój pomidora i ogórka w kostkę.", "Wymieszaj wszystko z oliwą, dopraw solą, pieprzem i ziołami.", "Podawaj z chlebem."])],
];
const ALL_DISHES = (() => { const seen = {}; const out = []; Object.keys(GOALS).forEach((g) => allDishes(g).forEach((x) => { if (!seen[x.id]) { seen[x.id] = 1; out.push(x); } }));
  ALT_NEW.forEach((l, i) => l.forEach((m) => { const id = slug(m.name); if (!seen[id]) { seen[id] = 1; out.push({ id, slot: SLOTS[i].label, meal: m }); } }));
  EXTRA.forEach((m) => { const id = slug(m.name); if (!seen[id]) { seen[id] = 1; out.push({ id, slot: EXTRA_LABEL, meal: m }); } }); return out; })();
const dishById = (id) => ALL_DISHES.find((x) => x.id === id);

const macroOf = (items) => items.reduce((a, [id, g]) => {
  const i = ING[id];
  return { k: a.k + (i.k * g) / 100, p: a.p + (i.p * g) / 100, f: a.f + (i.f * g) / 100, c: a.c + (i.c * g) / 100 };
}, { k: 0, p: 0, f: 0, c: 0 });
// Przelicza porcje dnia: 3 grupy produktów (białkowe, tłuszczowe, węglowodanowe; warzywa stałe) dobrane tak,
// by kcal trafiły w cel, a białko i tłuszcz były jak najbliżej (ważone najmniejsze kwadraty z ograniczeniami).
const dayFactors = (meals, T) => {
  const G = ["P", "F", "C"], s = { P: [0, 0, 0], F: [0, 0, 0], C: [0, 0, 0], V: [0, 0, 0] };
  meals.forEach((x) => x.meal.items.forEach(([id, g]) => { const i = ING[id], t = s[i.g]; t[0] += i.k * g / 100; t[1] += i.p * g / 100; t[2] += i.f * g / 100; }));
  const tgt = [T.kcal, T.prot, T.fat], wt = T.wt || [12, 4, 1];
  const r = tgt.map((v, m) => v - s.V[m]);
  const x = [1, 1, 1], lo = 0.5, hi = 2.4;
  for (let it = 0; it < 200; it++) for (let j = 0; j < 3; j++) {
    let num = 0, den = 0;
    for (let m = 0; m < 3; m++) {
      const a = s[G[j]][m], rest = r[m] - G.reduce((acc, gg, k) => acc + (k === j ? 0 : s[gg][m] * x[k]), 0), w = wt[m] / (tgt[m] * tgt[m]);
      num += w * a * rest; den += w * a * a;
    }
    if (den > 0) x[j] = Math.min(hi, Math.max(lo, num / den));
  }
  return { P: x[0], F: x[1], C: x[2], V: 1 };
};
const scaleItems = (items, f) => items.map(([id, g]) => [id, g * f[ING[id].g]]);
const fmt = (n) => String(n).replace(".", ",");
const qty = (id, g) => {
  const i = ING[id];
  if (i.szt) { const n = Math.max(0.5, Math.round(g / i.szt * 2) / 2); return `${fmt(n)} szt. (ok. ${Math.round(g / 5) * 5} g)`; }
  if (id === "oliwa" || id === "miod" || id === "maslo_orz") return `${Math.max(5, Math.round(g / 5) * 5)} g`;
  return `${Math.max(10, Math.round(g / 10) * 10)} ${i.ml ? "ml" : "g"}`;
};
const bulk = (id, g) => {
  const i = ING[id];
  if (i.szt) return `${Math.ceil(g / i.szt)} szt.`;
  if (g >= 1000) return `${fmt(Math.round(g / 100) / 10)} ${i.ml ? "l" : "kg"}`;
  return `${Math.ceil(g / 50) * 50} ${i.ml ? "ml" : "g"}`;
};


const GEAR_TAGS = {
  squat: ["sztanga"], floor: ["sztanga", "mata"], row: ["sztanga"], ohp: ["sztanga"], rdl: ["sztanga"],
  pullup: ["drazek", "guma"], chinup: ["drazek", "guma"], curl: ["hantle"], lunge: ["hantle"],
  facepull: ["guma"], pushdown: ["guma", "drazek"], lateral: ["hantle"], knee: ["drazek"],
  rope: ["cardio"], bike: ["cardio"],
};
const GEAR_LABEL = { sztanga: "Sztanga", hantle: "Hantle", drazek: "Drążek", guma: "Guma oporowa", mata: "Mata", cardio: "Cardio" };
