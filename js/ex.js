/* Biblioteka ćwiczeń, sprzęt i generator planu (klasyczny / kalistenika, dom / siłownia, mężczyźni / kobiety). */
"use strict";
const GROUPS = { nogi: "Nogi", posladki: "Pośladki i tył ud", plecy: "Plecy", klatka: "Klatka piersiowa", barki: "Barki", ramiona: "Ramiona", brzuch: "Brzuch i core", kondycja: "Kondycja" };
const EQUIP = {
  sztanga: { n: "Sztanga", home: true }, hantle: { n: "Hantle", home: true }, drazek: { n: "Drążek", home: true }, guma: { n: "Gumy oporowe", home: true },
  skakanka: { n: "Skakanka", home: true }, rowerek: { n: "Rowerek stacjonarny", home: true }, lawka: { n: "Ławka", home: true }, kettlebell: { n: "Kettlebell", home: true },
  porecze: { n: "Poręcze / 2 stabilne krzesła", home: true },
  maszyna: { n: "Maszyny siłowe", gym: true }, wyciag: { n: "Wyciąg", gym: true }, suwnica: { n: "Suwnica (leg press)", gym: true }, smith: { n: "Maszyna Smitha", gym: true },
  bieznia: { n: "Bieżnia", gym: true }, wioslarz: { n: "Ergometr wioślarski", gym: true },
};
const HOME_DEFAULT = { sztanga: true, hantle: true, drazek: true, guma: true, skakanka: true, rowerek: true, lawka: false, kettlebell: false, porecze: false };
const LVL = { 1: "Początkujący", 2: "Średnio zaawansowany", 3: "Zaawansowany" };
const P = (sets, tempo, rest) => ({ sets, tempo, rest });
const st = (...a) => a.map(([title, detail]) => ({ title, detail }));

// Uzupełnienie istniejących 15 ćwiczeń (mają wideo)
const EX_EXTRA = {
  squat: { group: "nogi", eq: ["sztanga"], lvl: 2, presc: P("3–5 × 5–10", "3–1–1", "2–3 min"), easier: "goblet", harder: "Przysiad z pauzą 2 s na dole" },
  floor: { group: "klatka", eq: ["sztanga"], lvl: 1, presc: P("3–5 × 5–10", "3–1–1", "2–3 min"), easier: "dbfloor", harder: "bench" },
  row: { group: "plecy", eq: ["sztanga"], lvl: 2, presc: P("3–4 × 8–12", "2–1–1", "90 s – 2 min"), easier: "dbrow", harder: "Wiosłowanie z pauzą 1 s przy brzuchu" },
  ohp: { group: "barki", eq: ["sztanga"], lvl: 2, presc: P("3–5 × 5–10", "2–1–1", "2–3 min"), easier: "dbpress", harder: "Wyciskanie z pauzą na wysokości czoła" },
  rdl: { group: "posladki", eq: ["sztanga"], lvl: 2, presc: P("3–4 × 6–12", "3–1–1", "2 min"), easier: "dbrdl", harder: "deadlift" },
  pullup: { group: "plecy", eq: ["drazek"], lvl: 2, bw: true, presc: P("3–5 × 5–10", "2–0–2", "2 min"), easier: "negpull", harder: "archerpull", next: "Gdy zrobisz 3 × 10 czystych powtórzeń, przejdź do podciągania w L-sit lub łucznika." },
  chinup: { group: "plecy", eq: ["drazek"], lvl: 2, bw: true, presc: P("3–5 × 5–10", "2–0–2", "2 min"), easier: "negpull", harder: "lsitpull", next: "Gdy zrobisz 3 × 10 czystych powtórzeń, dodaj obciążenie lub przejdź do podciągania w L-sit." },
  curl: { group: "ramiona", eq: ["hantle"], lvl: 1, presc: P("3–4 × 10–15", "2–1–2", "60–90 s"), easier: "Uginanie naprzemienne, lżejsze hantle", harder: "hammer" },
  lunge: { group: "nogi", eq: ["hantle"], lvl: 2, presc: P("3–4 × 8–12 na nogę", "2–0–1", "90 s"), easier: "bwlunge", harder: "bulgarian" },
  facepull: { group: "barki", eq: ["guma"], lvl: 1, presc: P("3–4 × 15–20", "2–1–1", "60 s"), easier: "Krótszy zakres, lżejsza guma", harder: "Mocniejsza guma, pauza 2 s" },
  pushdown: { group: "ramiona", eq: ["guma", "drazek"], lvl: 1, presc: P("3–4 × 12–15", "2–1–1", "60 s"), easier: "Lżejsza guma", harder: "dbext" },
  lateral: { group: "barki", eq: ["hantle"], lvl: 1, presc: P("3–4 × 12–20", "2–1–2", "60 s"), easier: "Jedna ręka naraz, lżejsze hantle", harder: "Pauza 1 s na górze" },
  knee: { group: "brzuch", eq: ["drazek"], lvl: 2, bw: true, presc: P("3–4 × 10–15", "2–1–2", "60 s"), easier: "plank", harder: "legraise", next: "Gdy zrobisz 3 × 15 bez bujania, przejdź do unoszenia prostych nóg." },
  rope: { group: "kondycja", eq: ["skakanka"], lvl: 1, presc: P("5–8 × 45–60 s", "równe tempo", "30–60 s"), easier: "Marsz w miejscu z ruchem rąk", harder: "Podwójne obroty lub skoki naprzemienne" },
  bike: { group: "kondycja", eq: ["rowerek"], lvl: 1, presc: P("20–40 min lub interwały", "tempo rozmowy", "—"), easier: "Krótsze sesje 10–15 min", harder: "Interwały 30 s szybko / 90 s spokojnie" },
};

const NEW = [
  // ---- klatka ----
  { id: "bench", name: "Wyciskanie sztangi na ławce płaskiej", group: "klatka", muscles: "Klatka piersiowa, triceps, przednie aktony barków", eq: ["sztanga", "lawka"], gear: "Sztanga, ławka (najlepiej ze stojakami)", lvl: 2, presc: P("3–5 × 5–10", "3–1–1", "2–3 min"),
    steps: st(["Ustawienie", "Oczy pod sztangą, łopatki ściągnięte, stopy mocno na podłodze."], ["Opuszczanie", "Opuść sztangę do dolnej części klatki, łokcie ok. 45° od tułowia."], ["Wyciskanie", "Wypchnij sztangę w górę i lekko w stronę barków do wyprostu."]),
    mistakes: ["Odbijanie sztangi od klatki", "Odrywanie pośladków od ławki", "Łokcie rozłożone pod kątem 90°"], easier: "dbbench", harder: "Wyciskanie z pauzą 1 s na klatce" },
  { id: "dbbench", name: "Wyciskanie hantli na ławce", group: "klatka", muscles: "Klatka piersiowa, triceps, barki", eq: ["hantle", "lawka"], gear: "Hantle, ławka", lvl: 1, presc: P("3–4 × 8–12", "3–1–1", "90 s – 2 min"),
    steps: st(["Start", "Usiądź z hantlami na udach, połóż się i unieś je nad klatkę."], ["Opuszczanie", "Opuszczaj hantle po łuku do poziomu klatki, łokcie ok. 45°."], ["Wyciskanie", "Wypchnij hantle w górę, zbliżając je do siebie nad klatką."]),
    mistakes: ["Zbyt głębokie opuszczanie z bólem barków", "Uderzanie hantlami o siebie", "Brak kontroli w dole"], easier: "dbfloor", harder: "bench" },
  { id: "dbfloor", name: "Wyciskanie hantli leżąc na podłodze", group: "klatka", muscles: "Klatka piersiowa, triceps", eq: ["hantle"], gear: "Hantle, mata", lvl: 1, presc: P("3–4 × 8–12", "3–1–1", "90 s"),
    steps: st(["Pozycja", "Leżenie na macie, kolana ugięte, hantle nad klatką."], ["Opuszczanie", "Opuść hantle, aż łokcie dotkną podłogi; krótka pauza."], ["Wyciskanie", "Wypchnij hantle pionowo w górę."]),
    mistakes: ["Odbijanie łokci od podłogi", "Wyginanie nadgarstków", "Brak napięcia łopatek"], easier: "pushup", harder: "dbbench" },
  { id: "machinechest", name: "Wyciskanie na maszynie (klatka)", group: "klatka", muscles: "Klatka piersiowa, triceps, barki", eq: ["maszyna"], gear: "Maszyna do wyciskania siedząc", lvl: 1, presc: P("3–4 × 10–12", "2–1–1", "90 s"),
    steps: st(["Ustawienie", "Uchwyty na wysokości środka klatki, plecy przy oparciu."], ["Wyciskanie", "Wypchnij uchwyty do prawie pełnego wyprostu."], ["Powrót", "Wracaj powoli, aż poczujesz rozciągnięcie klatki."]),
    mistakes: ["Za wysoko ustawione siedzisko", "Unoszenie barków do uszu", "Za szybki powrót"], easier: "Mniejsze obciążenie", harder: "bench" },
  // ---- plecy ----
  { id: "dbrow", name: "Wiosłowanie hantlem jednorącz", group: "plecy", muscles: "Najszersze grzbietu, czworoboczny, biceps", eq: ["hantle"], gear: "Hantel, ławka lub krzesło do podparcia", lvl: 1, presc: P("3–4 × 10–12 na stronę", "2–1–2", "60–90 s"),
    steps: st(["Podparcie", "Dłoń i kolano na ławce lub krześle, plecy równoległe do podłogi."], ["Przyciąganie", "Przyciągnij hantel do biodra, łokieć blisko tułowia."], ["Powrót", "Opuść hantel do pełnego wyprostu ramienia."]),
    mistakes: ["Skręcanie tułowia", "Przyciąganie do barku zamiast do biodra", "Okrągłe plecy"], easier: "bandrow", harder: "row" },
  { id: "latpull", name: "Ściąganie drążka wyciągu do klatki", group: "plecy", muscles: "Najszersze grzbietu, obły większy, biceps", eq: ["wyciag"], gear: "Wyciąg górny", lvl: 1, presc: P("3–4 × 8–12", "2–1–2", "90 s"),
    steps: st(["Chwyt", "Nachwyt nieco szerzej niż barki, uda zablokowane pod wałkami."], ["Ściąganie", "Ściągnij drążek do górnej części klatki, łokcie w dół."], ["Powrót", "Puść drążek w górę pod kontrolą do wyprostu."]),
    mistakes: ["Odchylanie się mocno do tyłu", "Ściąganie za kark", "Szarpanie ciężarem"], easier: "Lżejsze obciążenie", harder: "pullup" },
  { id: "cablerow", name: "Wiosłowanie na wyciągu dolnym siedząc", group: "plecy", muscles: "Plecy środkowe, najszersze, biceps", eq: ["wyciag"], gear: "Wyciąg dolny, uchwyt V", lvl: 1, presc: P("3–4 × 10–12", "2–1–2", "90 s"),
    steps: st(["Pozycja", "Siad, stopy na podporach, kolana lekko ugięte, plecy proste."], ["Przyciąganie", "Przyciągnij uchwyt do brzucha, ściągając łopatki."], ["Powrót", "Wyprostuj ramiona, nie zaokrąglając pleców."]),
    mistakes: ["Bujanie tułowiem", "Unoszenie barków", "Okrągłe plecy przy powrocie"], easier: "bandrow", harder: "row" },
  { id: "bandrow", name: "Wiosłowanie z gumą", group: "plecy", muscles: "Plecy środkowe, najszersze, tylne barki", eq: ["guma"], gear: "Guma oporowa zaczepiona na wysokości pasa", lvl: 1, presc: P("3–4 × 12–20", "2–1–2", "60 s"),
    steps: st(["Ustawienie", "Guma zaczepiona przed Tobą, krok w tył, by była napięta."], ["Przyciąganie", "Łokcie wzdłuż tułowia do tyłu, łopatki razem."], ["Powrót", "Powoli wyprostuj ramiona."]),
    mistakes: ["Za słabo napięta guma", "Odchylanie tułowia", "Unoszenie barków"], easier: "Lżejsza guma", harder: "dbrow" },
  { id: "bandpulldown", name: "Ściąganie gumy z góry", group: "plecy", muscles: "Najszersze grzbietu, obły większy", eq: ["guma"], gear: "Guma oporowa zaczepiona wysoko (drążek, drzwi)", lvl: 1, presc: P("3–4 × 12–20", "2–1–2", "60 s"),
    steps: st(["Ustawienie", "Klęk lub stanie pod zaczepioną wysoko gumą, ramiona w górze."], ["Ściąganie", "Ściągnij łokcie w dół do żeber, łopatki w dół."], ["Powrót", "Powoli wypuść ramiona w górę."]),
    mistakes: ["Ciągnięcie samymi rękami", "Garbienie się", "Za szybki powrót"], easier: "Lżejsza guma", harder: "negpull" },
  // ---- barki / ramiona ----
  { id: "dbpress", name: "Wyciskanie hantli nad głowę", group: "barki", muscles: "Barki, triceps, mięśnie tułowia", eq: ["hantle"], gear: "Hantle", lvl: 1, presc: P("3–4 × 8–12", "2–1–1", "90 s"),
    steps: st(["Start", "Hantle na wysokości barków, łokcie lekko przed tułowiem."], ["Wyciskanie", "Wypchnij hantle nad głowę, brzuch i pośladki napięte."], ["Powrót", "Opuść hantle pod kontrolą do barków."]),
    mistakes: ["Wyginanie lędźwi", "Niepełny zakres", "Hantle uciekające do przodu"], easier: "Wyciskanie siedząc, lżejsze hantle", harder: "ohp" },
  { id: "hammer", name: "Uginanie młotkowe z hantlami", group: "ramiona", muscles: "Ramienny, biceps, przedramiona", eq: ["hantle"], gear: "Hantle", lvl: 1, presc: P("3–4 × 10–15", "2–1–2", "60 s"),
    steps: st(["Chwyt", "Hantle chwytem neutralnym, kciuki do przodu."], ["Uginanie", "Ugnij łokcie, nie ruszając ramion."], ["Powrót", "Powoli opuść hantle do wyprostu."]),
    mistakes: ["Bujanie tułowiem", "Łokcie wędrujące do przodu", "Za szybkie opuszczanie"], easier: "curl", harder: "Pauza 1 s na górze" },
  { id: "dbext", name: "Wyciskanie francuskie hantlem nad głową", group: "ramiona", muscles: "Triceps (głowa długa)", eq: ["hantle"], gear: "Hantel", lvl: 1, presc: P("3–4 × 10–15", "3–0–1", "60 s"),
    steps: st(["Start", "Trzymaj jeden hantel oburącz nad głową, łokcie wąsko."], ["Opuszczanie", "Opuść hantel za głowę, łokcie skierowane w górę."], ["Prostowanie", "Wyprostuj ramiona, nie rozchylając łokci."]),
    mistakes: ["Rozchylanie łokci", "Wyginanie lędźwi", "Za ciężki hantel"], easier: "pushdown", harder: "dip" },
  { id: "cablepushdown", name: "Prostowanie ramion na wyciągu", group: "ramiona", muscles: "Triceps", eq: ["wyciag"], gear: "Wyciąg górny, linka lub drążek", lvl: 1, presc: P("3–4 × 10–15", "2–1–1", "60 s"),
    steps: st(["Pozycja", "Stań blisko wyciągu, łokcie przy tułowiu."], ["Prostowanie", "Wyprostuj ramiona w dół do pełnego wyprostu."], ["Powrót", "Powoli wróć do kąta 90° w łokciach."]),
    mistakes: ["Odsuwanie łokci od tułowia", "Pochylanie się nad wyciągiem", "Za szybki powrót"], easier: "pushdown", harder: "dip" },
  // ---- nogi ----
  { id: "legpress", name: "Wypychanie nogami na suwnicy", group: "nogi", muscles: "Czworogłowe ud, pośladki", eq: ["suwnica"], gear: "Suwnica (leg press)", lvl: 1, presc: P("3–4 × 10–15", "3–1–1", "2 min"),
    steps: st(["Ustawienie", "Stopy na środku platformy na szerokość barków."], ["Opuszczanie", "Ugnij kolana do ok. 90°, plecy przy oparciu."], ["Wypychanie", "Wypchnij platformę całą stopą, bez blokowania kolan."]),
    mistakes: ["Odrywanie bioder od oparcia", "Blokowanie kolan na górze", "Kolana uciekające do środka"], easier: "Mniejszy zakres", harder: "squat" },
  { id: "smithsquat", name: "Przysiad na maszynie Smitha", group: "nogi", muscles: "Czworogłowe ud, pośladki", eq: ["smith"], gear: "Maszyna Smitha", lvl: 1, presc: P("3–4 × 8–12", "3–1–1", "2 min"),
    steps: st(["Ustawienie", "Sztanga na barkach, stopy lekko przed linią sztangi."], ["Zejście", "Zejdź do równoległej ud, plecy proste."], ["Wstawanie", "Wypchnij podłogę całą stopą."]),
    mistakes: ["Stopy za daleko z tyłu", "Odrywanie pięt", "Płytkie zejście"], easier: "goblet", harder: "squat" },
  { id: "goblet", name: "Przysiad goblet", group: "nogi", muscles: "Czworogłowe ud, pośladki, core", eq: ["hantle|kettlebell"], gear: "Hantel lub kettlebell", lvl: 1, presc: P("3–4 × 10–15", "3–1–1", "90 s"),
    steps: st(["Chwyt", "Trzymaj ciężar przy klatce, łokcie w dół."], ["Zejście", "Zejdź głęboko, łokcie między kolanami, plecy proste."], ["Wstawanie", "Wstań, wypychając podłogę piętami."]),
    mistakes: ["Pochylanie tułowia", "Kolana do środka", "Odrywanie pięt"], easier: "airsquat", harder: "squat" },
  { id: "sumo", name: "Przysiad sumo z ciężarem", group: "posladki", muscles: "Pośladki, przywodziciele, czworogłowe", eq: ["hantle|kettlebell"], gear: "Hantel lub kettlebell", lvl: 1, presc: P("3–4 × 10–15", "3–1–1", "90 s"),
    steps: st(["Ustawienie", "Szeroki rozstaw stóp, palce na zewnątrz, ciężar w opuszczonych rękach."], ["Zejście", "Zejdź prosto w dół, kolana nad palcami."], ["Wstawanie", "Wstań, mocno napinając pośladki."]),
    mistakes: ["Kolana zapadające się do środka", "Pochylanie tułowia", "Za wąski rozstaw"], easier: "airsquat", harder: "Pauza 2 s na dole" },
  { id: "legcurl", name: "Uginanie nóg na maszynie", group: "posladki", muscles: "Dwugłowe ud", eq: ["maszyna"], gear: "Maszyna do uginania nóg", lvl: 1, presc: P("3–4 × 10–15", "2–1–2", "60–90 s"),
    steps: st(["Ustawienie", "Wałek nad piętami, kolana na osi maszyny."], ["Uginanie", "Ugnij nogi maksymalnie, biodra przy siedzisku."], ["Powrót", "Powoli prostuj nogi."]),
    mistakes: ["Unoszenie bioder", "Szarpanie", "Niepełny zakres"], easier: "glutebridge", harder: "Jednonóż" },
  { id: "deadlift", name: "Martwy ciąg klasyczny", group: "posladki", muscles: "Pośladki, dwugłowe ud, prostowniki grzbietu, plecy", eq: ["sztanga"], gear: "Sztanga z obciążeniem", lvl: 2, presc: P("3–5 × 3–6", "2–1–1", "2–3 min"),
    steps: st(["Ustawienie", "Sztanga nad środkiem stopy, chwyt tuż za kolanami, plecy proste."], ["Podnoszenie", "Wypchnij podłogę nogami, sztanga sunie po nogach."], ["Zakończenie", "Wyprostuj biodra, potem odłóż sztangę tą samą drogą."]),
    mistakes: ["Okrągłe plecy", "Sztanga daleko od nóg", "Odchylanie się na górze"], easier: "rdl", harder: "Martwy ciąg z pauzą pod kolanami" },
  { id: "dbrdl", name: "Martwy ciąg rumuński z hantlami", group: "posladki", muscles: "Dwugłowe ud, pośladki, prostowniki", eq: ["hantle|kettlebell"], gear: "Hantle lub kettlebell", lvl: 1, presc: P("3–4 × 10–12", "3–1–1", "90 s"),
    steps: st(["Start", "Stań z hantlami przed udami, kolana lekko ugięte."], ["Zawias", "Biodra w tył, hantle suną blisko nóg do połowy piszczeli."], ["Powrót", "Wypchnij biodra w przód, napinając pośladki."]),
    mistakes: ["Okrągłe plecy", "Uginanie kolan jak w przysiadzie", "Hantle daleko od nóg"], easier: "glutebridge", harder: "rdl" },
  { id: "kbswing", name: "Swing kettlebell", group: "kondycja", muscles: "Pośladki, dwugłowe ud, core, układ krążenia", eq: ["kettlebell"], gear: "Kettlebell", lvl: 2, presc: P("4–6 × 15–20", "dynamicznie", "45–60 s"),
    steps: st(["Start", "Kettlebell przed stopami, zawias biodrowy, chwyt oburącz."], ["Zamach", "Przenieś kettlebell między nogami i dynamicznie wypchnij biodra."], ["Góra", "Kettlebell do wysokości klatki siłą bioder, nie rąk."]),
    mistakes: ["Unoszenie ciężaru rękami", "Przysiad zamiast zawiasu", "Odchylanie się na górze"], easier: "dbrdl", harder: "Swing jednorącz" },
  { id: "hipthrust", name: "Hip thrust z obciążeniem", group: "posladki", muscles: "Pośladki, dwugłowe ud", eq: ["sztanga|hantle|kettlebell"], gear: "Sztanga lub hantel; ławka albo kanapa jako oparcie", lvl: 1, presc: P("3–5 × 8–15", "2–2–1", "90 s"),
    steps: st(["Ustawienie", "Łopatki oparte o ławkę lub kanapę, ciężar na biodrach, stopy na szerokość bioder."], ["Wypchnięcie", "Wypchnij biodra w górę do linii kolana–bark, broda lekko w dół."], ["Pauza", "Zatrzymaj 2 s z mocno napiętymi pośladkami, potem opuść."]),
    mistakes: ["Przeprost w lędźwiach", "Stopy za blisko lub za daleko", "Brak pauzy na górze"], easier: "glutebridge", harder: "Hip thrust jednonóż" },
  { id: "glutebridge", name: "Mostek biodrowy (glute bridge)", group: "posladki", muscles: "Pośladki, dwugłowe ud", eq: [], gear: "Mata", lvl: 1, presc: P("3–4 × 15–20", "2–2–1", "45–60 s"),
    steps: st(["Pozycja", "Leżenie na plecach, kolana ugięte, stopy blisko pośladków."], ["Uniesienie", "Wypchnij biodra w górę, napinając pośladki."], ["Pauza", "Zatrzymaj 2 s, powoli opuść."]),
    mistakes: ["Wyginanie lędźwi", "Pchanie palcami zamiast piętami", "Za szybkie tempo"], easier: "Mniejszy zakres", harder: "slbridge", next: "Gdy zrobisz 3 × 20 z 2-sekundową pauzą, przejdź do mostka jednonóż." },
  { id: "kickback", name: "Odwodzenie nogi w tył z gumą", group: "posladki", muscles: "Pośladek wielki", eq: ["guma"], gear: "Mini band lub guma oporowa", lvl: 1, presc: P("3 × 15–20 na nogę", "2–1–1", "45 s"),
    steps: st(["Pozycja", "Klęk podparty, guma wokół stóp lub nad kolanami."], ["Ruch", "Wypchnij jedną stopę w górę i w tył, kolano ugięte."], ["Kontrola", "Bez wyginania lędźwi, powoli wróć."]),
    mistakes: ["Wyginanie pleców", "Bujanie tułowiem", "Zbyt szybkie tempo"], easier: "Bez gumy", harder: "cablekick" },
  { id: "cablekick", name: "Odwodzenie nogi w tył na wyciągu", group: "posladki", muscles: "Pośladek wielki", eq: ["wyciag"], gear: "Wyciąg dolny, mankiet na kostkę", lvl: 1, presc: P("3 × 12–15 na nogę", "2–1–1", "45 s"),
    steps: st(["Ustawienie", "Mankiet na kostce, przytrzymaj się wyciągu, lekki pochył."], ["Ruch", "Odprowadź nogę w tył, napinając pośladek."], ["Powrót", "Powoli wróć, nie odkładając ciężaru."]),
    mistakes: ["Przeprost w lędźwiach", "Wymachy nogą", "Skręcanie bioder"], easier: "kickback", harder: "Pauza 2 s w tyle" },
  { id: "abduction", name: "Odwodzenie bioder z gumą", group: "posladki", muscles: "Pośladek średni i mały", eq: ["guma"], gear: "Mini band nad kolanami", lvl: 1, presc: P("3 × 15–25", "1–1–1", "45 s"),
    steps: st(["Pozycja", "Siad na brzegu krzesła lub półprzysiad, guma nad kolanami."], ["Ruch", "Rozsuń kolana na zewnątrz przeciw oporowi gumy."], ["Powrót", "Powoli wróć, utrzymując napięcie."]),
    mistakes: ["Za słaba guma", "Ruch szarpany", "Garbienie się"], easier: "Lżejsza guma", harder: "abdmachine" },
  { id: "abdmachine", name: "Odwodzenie nóg na maszynie", group: "posladki", muscles: "Pośladek średni i mały", eq: ["maszyna"], gear: "Maszyna do odwodzenia", lvl: 1, presc: P("3 × 15–20", "2–1–2", "45–60 s"),
    steps: st(["Ustawienie", "Siad, plecy przy oparciu, poduszki po zewnętrznej stronie kolan."], ["Ruch", "Rozsuń nogi szeroko, pauza 1 s."], ["Powrót", "Powoli zsuń nogi."]),
    mistakes: ["Odbijanie ciężaru", "Za duże obciążenie", "Niepełny zakres"], easier: "abduction", harder: "Lekki pochył tułowia do przodu" },
  { id: "stepup", name: "Wejścia na podwyższenie", group: "nogi", muscles: "Czworogłowe ud, pośladki", eq: [], gear: "Stabilny stopień, skrzynia lub ławka; opcjonalnie hantle", lvl: 1, presc: P("3 × 10–12 na nogę", "2–0–1", "60–90 s"),
    steps: st(["Ustawienie", "Cała stopa na podwyższeniu, tułów lekko pochylony."], ["Wejście", "Wejdź siłą nogi z przodu, bez odbijania tylnej."], ["Zejście", "Zejdź powoli tą samą nogą."]),
    mistakes: ["Odbijanie się z tylnej nogi", "Kolano uciekające do środka", "Za wysokie podwyższenie"], easier: "bwlunge", harder: "Z hantlami w dłoniach" },
  { id: "bulgarian", name: "Przysiad bułgarski", group: "nogi", muscles: "Czworogłowe ud, pośladki", eq: [], bw: true, gear: "Krzesło lub ławka; opcjonalnie hantle", lvl: 2, presc: P("3–4 × 8–12 na nogę", "3–0–1", "90 s"),
    steps: st(["Ustawienie", "Stopa tylnej nogi na krześle, przednia ok. 60–80 cm przed nim."], ["Zejście", "Opuść się, aż tylne kolano prawie dotknie podłogi."], ["Wstawanie", "Wypchnij się przednią nogą."]),
    mistakes: ["Za krótki rozstaw", "Kolano do środka", "Utrata równowagi przez pośpiech"], easier: "bwlunge", harder: "shrimp", next: "Gdy zrobisz 3 × 12 na nogę z kontrolą, przejdź do przysiadu shrimp." },
  { id: "calf", name: "Wspięcia na palce", group: "nogi", muscles: "Łydki", eq: [], bw: true, gear: "Stopień (opcjonalnie hantel)", lvl: 1, presc: P("3–4 × 15–20", "2–2–1", "45 s"),
    steps: st(["Pozycja", "Przednia część stóp na stopniu, pięty w dół."], ["Wspięcie", "Wspnij się maksymalnie na palce, pauza 2 s."], ["Opuszczanie", "Powoli opuść pięty poniżej stopnia."]),
    mistakes: ["Odbijanie się", "Niepełny zakres", "Uginanie kolan"], easier: "Na płaskiej podłodze", harder: "Jednonóż z hantlem" },
  // ---- brzuch / kondycja ----
  { id: "plank", name: "Deska (plank)", group: "brzuch", muscles: "Mięśnie brzucha, core", eq: [], bw: true, hold: true, gear: "Mata", lvl: 1, presc: P("3–4 × 30–60 s", "statycznie", "45 s"),
    steps: st(["Pozycja", "Podpór na przedramionach, łokcie pod barkami."], ["Napięcie", "Ciało w linii prostej, pośladki i brzuch napięte."], ["Oddech", "Oddychaj spokojnie, nie unoś bioder."]),
    mistakes: ["Opadające biodra", "Biodra za wysoko", "Wstrzymywanie oddechu"], easier: "Deska na kolanach", harder: "hollow", next: "Gdy utrzymasz 60 s, przejdź do hollow body." },
  { id: "burpee", name: "Burpees", group: "kondycja", muscles: "Całe ciało, układ krążenia", eq: [], bw: true, gear: "Bez sprzętu", lvl: 2, presc: P("4–6 × 30–40 s", "dynamicznie", "30–60 s"),
    steps: st(["Przysiad", "Zejdź do przysiadu i połóż dłonie na podłodze."], ["Podpór", "Wyrzuć nogi w tył do podporu (opcjonalnie pompka)."], ["Wyskok", "Przyciągnij nogi i wyskocz z rękami w górze."]),
    mistakes: ["Opadające biodra w podporze", "Twarde lądowanie", "Zbyt szybkie tempo bez techniki"], easier: "Bez wyskoku i pompki", harder: "Z pompką i wysokim wyskokiem" },
  { id: "treadmill", name: "Bieżnia — marsz pod górę lub bieg", group: "kondycja", muscles: "Układ krążenia, nogi", eq: ["bieznia"], gear: "Bieżnia", lvl: 1, presc: P("20–40 min lub interwały", "tempo rozmowy", "—"),
    steps: st(["Rozgrzewka", "5 min marszu 5–6 km/h."], ["Praca", "Marsz pod górę 8–12% lub spokojny bieg."], ["Wyciszenie", "3–5 min wolnego marszu."]),
    mistakes: ["Trzymanie się poręczy", "Za duże nachylenie od razu", "Zbyt długie kroki"], easier: "Marsz po płaskim", harder: "Interwały 1 min szybko / 2 min wolno" },
  { id: "rowerg", name: "Ergometr wioślarski", group: "kondycja", muscles: "Układ krążenia, plecy, nogi", eq: ["wioslarz"], gear: "Ergometr wioślarski", lvl: 1, presc: P("15–30 min lub interwały", "20–26 pociągnięć/min", "—"),
    steps: st(["Odbicie", "Wypchnij nogami, plecy proste."], ["Przeciągnięcie", "Odchyl się lekko i przyciągnij uchwyt do dolnych żeber."], ["Powrót", "Ręce, tułów, potem nogi — w odwrotnej kolejności."]),
    mistakes: ["Ciągnięcie samymi rękami", "Okrągłe plecy", "Za szybkie tempo"], easier: "Krótsze odcinki", harder: "Interwały 250 m szybko / 1 min przerwy" },
  // ---- kalistenika ----
  { id: "inclinepush", name: "Pompki na podwyższeniu", group: "klatka", cal: true, muscles: "Klatka piersiowa, triceps, barki", eq: [], bw: true, gear: "Stół, parapet lub ławka", lvl: 1, presc: P("3–4 × 8–15", "2–0–1", "60–90 s"),
    steps: st(["Pozycja", "Dłonie na podwyższeniu szerzej niż barki, ciało w linii prostej."], ["Opuszczanie", "Opuść klatkę do krawędzi, łokcie ok. 45°."], ["Wypchnięcie", "Wypchnij się do wyprostu ramion."]),
    mistakes: ["Opadające biodra", "Łokcie na boki", "Niepełny zakres"], easier: "Pompki przy ścianie", harder: "pushup", next: "Gdy zrobisz 3 × 15, obniż podwyższenie lub przejdź do pompek klasycznych." },
  { id: "pushup", name: "Pompki klasyczne", group: "klatka", cal: true, muscles: "Klatka piersiowa, triceps, barki, core", eq: [], bw: true, gear: "Bez sprzętu", lvl: 1, presc: P("3–5 × 8–20", "2–0–1", "60–90 s"),
    steps: st(["Pozycja", "Dłonie nieco szerzej niż barki, ciało w linii prostej."], ["Opuszczanie", "Opuść klatkę prawie do podłogi, łokcie ok. 45°."], ["Wypchnięcie", "Wypchnij podłogę, utrzymując napięty brzuch."]),
    mistakes: ["Opadające biodra", "Wysunięta głowa", "Płytki zakres"], easier: "inclinepush", harder: "diamond", next: "Gdy zrobisz 3 × 20, przejdź do pompek diamentowych lub łucznika." },
  { id: "diamond", name: "Pompki diamentowe", group: "ramiona", cal: true, muscles: "Triceps, klatka piersiowa", eq: [], bw: true, gear: "Bez sprzętu", lvl: 2, presc: P("3–4 × 6–15", "2–0–1", "90 s"),
    steps: st(["Chwyt", "Dłonie blisko siebie pod klatką, kciuki i palce wskazujące tworzą romb."], ["Opuszczanie", "Opuść klatkę do dłoni, łokcie blisko tułowia."], ["Wypchnięcie", "Wypchnij się do wyprostu."]),
    mistakes: ["Łokcie na boki", "Opadające biodra", "Ból nadgarstków przy zbyt dużym obciążeniu"], easier: "pushup", harder: "archer", next: "Gdy zrobisz 3 × 15, przejdź do pompek łucznika." },
  { id: "archer", name: "Pompki łucznika", group: "klatka", cal: true, muscles: "Klatka piersiowa, triceps, barki", eq: [], bw: true, gear: "Bez sprzętu", lvl: 3, presc: P("3–4 × 4–8 na stronę", "3–0–1", "2 min"),
    steps: st(["Pozycja", "Bardzo szeroki rozstaw dłoni."], ["Opuszczanie", "Opuść się nad jedną dłoń, drugie ramię prawie proste."], ["Wypchnięcie", "Wypchnij się i powtórz na drugą stronę."]),
    mistakes: ["Skręcanie tułowia", "Uginanie prostego ramienia", "Opadające biodra"], easier: "diamond", harder: "pseudoplanche", next: "Gdy zrobisz 3 × 8 na stronę, przejdź do pompek pseudo-planche." },
  { id: "pseudoplanche", name: "Pompki pseudo-planche", group: "barki", cal: true, muscles: "Przednie aktony barków, klatka, triceps, core", eq: [], bw: true, gear: "Bez sprzętu (opcjonalnie paraletki)", lvl: 3, presc: P("3–5 × 5–10", "3–1–1", "2 min"),
    steps: st(["Pozycja", "Dłonie przy biodrach, palce na zewnątrz, barki daleko przed dłońmi."], ["Opuszczanie", "Opuść się, utrzymując przechył do przodu."], ["Wypchnięcie", "Wypchnij się, nie cofając barków."]),
    mistakes: ["Cofanie barków za dłonie", "Opadające biodra", "Za szybkie zwiększanie przechyłu"], easier: "archer", harder: "Większy przechył lub nogi na podwyższeniu" },
  { id: "benchdip", name: "Dipy na krześle", group: "ramiona", cal: true, muscles: "Triceps, klatka, przednie barki", eq: [], bw: true, gear: "Stabilne krzesło lub ławka", lvl: 1, presc: P("3–4 × 8–15", "2–0–1", "60–90 s"),
    steps: st(["Pozycja", "Dłonie na krawędzi krzesła za sobą, nogi ugięte."], ["Opuszczanie", "Opuść biodra, aż łokcie ugną się do ok. 90°."], ["Wypchnięcie", "Wyprostuj ramiona."]),
    mistakes: ["Za głęboko — ból barków", "Łokcie na boki", "Biodra daleko od krzesła"], easier: "Nogi bliżej krzesła", harder: "dip", next: "Gdy zrobisz 3 × 15 z prostymi nogami, przejdź do dipów na poręczach." },
  { id: "dip", name: "Dipy na poręczach", group: "klatka", cal: true, muscles: "Klatka (dolna część), triceps, barki", eq: ["porecze"], bw: true, gear: "Poręcze lub dwa stabilne krzesła", lvl: 2, presc: P("3–5 × 5–12", "2–0–1", "2 min"),
    steps: st(["Podpór", "Proste ramiona na poręczach, barki w dół."], ["Opuszczanie", "Lekki pochył, opuść się do kąta 90° w łokciach."], ["Wypchnięcie", "Wypchnij się do wyprostu."]),
    mistakes: ["Zbyt głębokie zejście", "Unoszenie barków do uszu", "Bujanie nogami"], easier: "benchdip", harder: "Dipy z obciążeniem", next: "Gdy zrobisz 3 × 12, dodaj obciążenie (plecak) lub zwolnij tempo opuszczania." },
  { id: "negpull", name: "Podciąganie negatywne lub z gumą", group: "plecy", cal: true, muscles: "Najszersze grzbietu, biceps", eq: ["drazek"], bw: true, gear: "Drążek; opcjonalnie guma do asysty", lvl: 1, presc: P("3–5 × 3–6", "5 s opuszczania", "2 min"),
    steps: st(["Start", "Wskocz lub wejdź na krzesło, broda nad drążkiem."], ["Opuszczanie", "Opuszczaj się 4–5 s do pełnego zwisu."], ["Asysta", "Alternatywnie podciągaj się z gumą pod stopami lub kolanami."]),
    mistakes: ["Spadanie zamiast kontroli", "Niepełny zwis", "Bujanie"], easier: "australian", harder: "pullup", next: "Gdy zrobisz 3 × 5 negatywów po 5 s, spróbuj pełnego podciągania." },
  { id: "lsitpull", name: "Podciąganie w pozycji L-sit", group: "plecy", cal: true, muscles: "Najszersze grzbietu, biceps, brzuch", eq: ["drazek"], bw: true, gear: "Drążek", lvl: 3, presc: P("3–4 × 4–8", "2–1–2", "2 min"),
    steps: st(["Pozycja", "Zwis, nogi proste uniesione do poziomu."], ["Podciąganie", "Podciągnij się, utrzymując nogi w L."], ["Opuszczanie", "Powoli zejdź bez opuszczania nóg."]),
    mistakes: ["Opadające nogi", "Bujanie", "Niepełny zakres"], easier: "chinup", harder: "archerpull" },
  { id: "archerpull", name: "Podciąganie łucznika", group: "plecy", cal: true, muscles: "Najszersze grzbietu, biceps, przedramiona", eq: ["drazek"], bw: true, gear: "Drążek", lvl: 3, presc: P("3–4 × 3–6 na stronę", "2–1–3", "2–3 min"),
    steps: st(["Chwyt", "Bardzo szeroki nachwyt."], ["Podciąganie", "Podciągnij się w stronę jednej dłoni, drugie ramię się prostuje."], ["Powrót", "Zejdź powoli i zmień stronę."]),
    mistakes: ["Uginanie prostego ramienia", "Bujanie", "Zbyt szybkie opuszczanie"], easier: "pullup", harder: "Podciąganie jednorącz z asystą ręcznika" },
  { id: "australian", name: "Wiosłowanie australijskie", group: "plecy", cal: true, muscles: "Plecy środkowe, najszersze, biceps", eq: [], bw: true, gear: "Nisko zawieszony drążek lub stabilny stół", lvl: 1, presc: P("3–4 × 8–15", "2–1–2", "60–90 s"),
    steps: st(["Pozycja", "Zwis pod drążkiem lub stołem, ciało proste, pięty na podłodze."], ["Przyciąganie", "Przyciągnij klatkę do drążka, łopatki razem."], ["Powrót", "Powoli opuść się do wyprostu ramion."]),
    mistakes: ["Opadające biodra", "Niepełny zakres", "Wysunięta głowa"], easier: "Nogi ugięte, wyżej zawieszony drążek", harder: "Nogi na podwyższeniu", next: "Gdy zrobisz 3 × 15 z prostymi nogami, przejdź do podciągania negatywnego." },
  { id: "airsquat", name: "Przysiad bez obciążenia", group: "nogi", cal: true, muscles: "Czworogłowe ud, pośladki", eq: [], bw: true, gear: "Bez sprzętu", lvl: 1, presc: P("3–4 × 15–25", "2–1–1", "60 s"),
    steps: st(["Ustawienie", "Stopy na szerokość barków, ręce przed sobą."], ["Zejście", "Biodra w tył i w dół do równoległej lub niżej."], ["Wstawanie", "Wstań, wypychając podłogę całą stopą."]),
    mistakes: ["Odrywanie pięt", "Kolana do środka", "Okrągłe plecy"], easier: "Przysiad do krzesła", harder: "bulgarian", next: "Gdy zrobisz 3 × 25 z pełnym zakresem, przejdź do przysiadu bułgarskiego." },
  { id: "bwlunge", name: "Wykroki z masą ciała", group: "nogi", cal: true, muscles: "Czworogłowe ud, pośladki", eq: [], bw: true, gear: "Bez sprzętu", lvl: 1, presc: P("3 × 10–15 na nogę", "2–0–1", "60 s"),
    steps: st(["Krok", "Duży krok w przód, tułów prosto."], ["Zejście", "Opuść się, aż tylne kolano prawie dotknie podłogi."], ["Powrót", "Odepchnij się przednią nogą do pozycji wyjściowej."]),
    mistakes: ["Za krótki krok", "Kolano do środka", "Pochylanie tułowia"], easier: "Wykroki w tył przy ścianie", harder: "bulgarian" },
  { id: "shrimp", name: "Przysiad shrimp", group: "nogi", cal: true, muscles: "Czworogłowe ud, pośladki, równowaga", eq: [], bw: true, gear: "Bez sprzętu (na początku przytrzymaj się ściany)", lvl: 3, presc: P("3–4 × 4–8 na nogę", "3–0–1", "2 min"),
    steps: st(["Pozycja", "Stań na jednej nodze, drugą ugnij i chwyć za stopę za sobą."], ["Zejście", "Opuść się, aż kolano tylnej nogi dotknie podłogi."], ["Wstawanie", "Wstań siłą nogi podporowej."]),
    mistakes: ["Opadanie bez kontroli", "Pięta odrywa się od podłogi", "Kolano do środka"], easier: "bulgarian", harder: "pistol", next: "Gdy zrobisz 3 × 8 na nogę, przejdź do pistoletu." },
  { id: "pistol", name: "Pistolet (przysiad na jednej nodze)", group: "nogi", cal: true, muscles: "Czworogłowe ud, pośladki, core, mobilność", eq: [], bw: true, gear: "Bez sprzętu (na początku do krzesła)", lvl: 3, presc: P("3–4 × 3–6 na nogę", "3–0–1", "2 min"),
    steps: st(["Pozycja", "Stań na jednej nodze, druga prosta przed sobą, ręce w przód."], ["Zejście", "Zejdź powoli do pełnego przysiadu."], ["Wstawanie", "Wstań bez odrywania pięty."]),
    mistakes: ["Odrywanie pięty", "Okrągłe plecy na dole", "Odbijanie się z dołu"], easier: "shrimp", harder: "Pistolet z ciężarem w dłoniach" },
  { id: "slbridge", name: "Mostek biodrowy jednonóż", group: "posladki", cal: true, muscles: "Pośladki, dwugłowe ud", eq: [], bw: true, gear: "Mata", lvl: 2, presc: P("3–4 × 10–15 na nogę", "2–2–1", "60 s"),
    steps: st(["Pozycja", "Leżenie na plecach, jedna noga ugięta, druga prosta w górze."], ["Uniesienie", "Wypchnij biodra jedną nogą, biodra równo."], ["Pauza", "2 s na górze, powoli opuść."]),
    mistakes: ["Opadanie jednego biodra", "Przeprost w lędźwiach", "Pośpiech"], easier: "glutebridge", harder: "Hip thrust jednonóż z barkami na kanapie" },
  { id: "hollow", name: "Hollow body hold", group: "brzuch", cal: true, muscles: "Mięśnie brzucha, zginacze bioder", eq: [], bw: true, hold: true, gear: "Mata", lvl: 1, presc: P("3–4 × 20–40 s", "statycznie", "60 s"),
    steps: st(["Pozycja", "Leżenie na plecach, lędźwie dociśnięte do podłogi."], ["Uniesienie", "Unieś łopatki i proste nogi kilka cm nad podłogę, ręce za głową."], ["Utrzymanie", "Trzymaj kształt banana, oddychaj spokojnie."]),
    mistakes: ["Odrywanie lędźwi", "Za wysoko uniesione nogi", "Wstrzymywanie oddechu"], easier: "Kolana ugięte", harder: "lsit", next: "Gdy utrzymasz 3 × 40 s, przejdź do L-sit." },
  { id: "lsit", name: "L-sit (progresja)", group: "brzuch", cal: true, muscles: "Brzuch, zginacze bioder, triceps", eq: ["porecze"], bw: true, hold: true, gear: "Poręcze, paraletki lub dwa krzesła", lvl: 2, presc: P("4–6 × 10–20 s", "statycznie", "90 s"),
    steps: st(["Podpór", "Proste ramiona na poręczach, barki w dół."], ["Progresja", "Najpierw kolana przy klatce (tuck), potem jedna noga prosta, na końcu obie."], ["Utrzymanie", "Trzymaj nogi w poziomie, palce wyprostowane."]),
    mistakes: ["Unoszenie barków", "Uginanie łokci", "Opadające nogi"], easier: "Tuck L-sit (kolana ugięte)", harder: "Pełny L-sit 20 s", next: "Gdy utrzymasz tuck 3 × 20 s, wyprostuj jedną nogę; potem obie." },
  { id: "legraise", name: "Unoszenie prostych nóg w zwisie", group: "brzuch", cal: true, muscles: "Mięśnie brzucha, zginacze bioder", eq: ["drazek"], bw: true, top: true, gear: "Drążek", lvl: 3, presc: P("3–4 × 6–12", "2–1–2", "90 s"),
    steps: st(["Zwis", "Pełny zwis, łopatki lekko ściągnięte."], ["Uniesienie", "Unieś proste nogi do poziomu lub wyżej."], ["Opuszczanie", "Opuszczaj powoli, bez bujania."]),
    mistakes: ["Bujanie", "Uginanie kolan", "Szybkie opuszczanie"], easier: "knee", harder: "Nogi do drążka (toes to bar)" },
  { id: "dragonflag", name: "Dragon flag negatywny", group: "brzuch", cal: true, muscles: "Cały brzuch, core", eq: [], bw: true, gear: "Ławka lub stabilny mebel do chwytu za głową", lvl: 3, presc: P("3–4 × 3–6", "5 s opuszczania", "2 min"),
    steps: st(["Chwyt", "Leżenie na plecach, chwyć mebel lub ławkę za głową."], ["Góra", "Unieś ciało do pionu, oparte na łopatkach."], ["Opuszczanie", "Opuszczaj proste ciało powoli przez 4–5 s."]),
    mistakes: ["Łamanie w biodrach", "Opieranie się na karku", "Spadanie bez kontroli"], easier: "Z ugiętymi kolanami", harder: "Pełny dragon flag z powrotem w górę" },
  { id: "pike", name: "Pompki w pozycji pike", group: "barki", cal: true, muscles: "Barki, triceps", eq: [], bw: true, gear: "Bez sprzętu", lvl: 1, presc: P("3–4 × 6–12", "2–0–1", "90 s"),
    steps: st(["Pozycja", "Biodra wysoko, ciało w odwróconej literze V."], ["Opuszczanie", "Opuść głowę w kierunku podłogi przed dłońmi."], ["Wypchnięcie", "Wypchnij się, łokcie lekko do tyłu."]),
    mistakes: ["Za mało bioder w górze", "Łokcie na boki", "Płytki zakres"], easier: "Pike na kolanach", harder: "elevpike", next: "Gdy zrobisz 3 × 12, połóż stopy na podwyższeniu." },
  { id: "elevpike", name: "Pompki pike z nogami na podwyższeniu", group: "barki", cal: true, muscles: "Barki, triceps, górna część klatki", eq: [], bw: true, gear: "Krzesło, ławka lub skrzynia", lvl: 2, presc: P("3–4 × 5–10", "2–0–1", "2 min"),
    steps: st(["Pozycja", "Stopy na podwyższeniu, biodra nad barkami."], ["Opuszczanie", "Opuść głowę przed dłonie."], ["Wypchnięcie", "Wypchnij się do wyprostu."]),
    mistakes: ["Garbienie pleców", "Zbyt niskie biodra", "Uderzanie głową o podłogę"], easier: "pike", harder: "wallhs", next: "Gdy zrobisz 3 × 10, ćwicz stanie na rękach przy ścianie." },
  { id: "wallhs", name: "Stanie na rękach przy ścianie", group: "barki", cal: true, muscles: "Barki, triceps, core, równowaga", eq: [], bw: true, hold: true, gear: "Ściana, mata", lvl: 3, presc: P("4–6 × 20–45 s", "statycznie", "90 s"),
    steps: st(["Wejście", "Dłonie 10–20 cm od ściany, wejdź nogami po ścianie lub wymachem."], ["Pozycja", "Ramiona proste, barki przy uszach, brzuch napięty."], ["Zejście", "Schodź kontrolowanie, w razie potrzeby przewrót bokiem."]),
    mistakes: ["Banan w lędźwiach", "Uginanie łokci", "Za daleko od ściany"], easier: "elevpike", harder: "Pompki w staniu na rękach" },
];

NEW.forEach((x) => { x.media = {}; EX.push(x); });
EX.forEach((x) => { Object.assign(x, EX_EXTRA[x.id] || {}); x.media = x.media || {}; if (x.eq.length === 0 || x.eq.every((t) => t === "drazek" || t === "porecze")) x.bw = x.bw !== false; });
// media: wideo (istniejące 15) i ilustracje: m — Rico/Pitbull, k — Atena/Łapka (uzupełniane przez MEDIA)
const exByIdStrict = (id) => EX.find((e) => e.id === id);
const eqOk = (ex, have) => ex.eq.every((t) => t.split("|").some((u) => have[u]));
const eqText = (ex) => ex.eq.length ? ex.eq.map((t) => t.split("|").map((u) => EQUIP[u].n).join(" lub ")).join(" + ") : "Bez sprzętu";

// ---------- generator planu ----------
Object.assign(PRESC, {
  izol: { sets: ["3 × 15", "3 × 15–20", "4 × 15", "4 × 15–20"], rest: "45–60 s", tempo: "2–1–1 (pauza w napięciu)" },
  obwod: { sets: ["3 rundy × 12–15", "3 rundy × 15", "4 rundy × 12–15", "4 rundy × 15"], rest: "30 s między ćwiczeniami, 90 s między rundami", tempo: "kontrolowane" },
  finisz: { sets: ["6 min: 30 s pracy / 30 s przerwy", "8 min: 30 s / 30 s", "10 min: 30 s / 30 s", "8 min: 40 s / 20 s"], rest: "—", tempo: "równe, mocne" },
  kal: { sets: ["3 × 5–8", "4 × 5–8", "4 × 6–10", "5 × 6–10"], rest: "2 min", tempo: "2–1–2" },
  hold: { sets: ["3 × 15–20 s", "3 × 20–30 s", "4 × 20–30 s", "4 × 30–40 s"], rest: "60–90 s", tempo: "statycznie" },
});
Object.assign(KIND_LABEL, { izol: "Izolacja", obwod: "Obwód", finisz: "Finisz kondycyjny", kal: "Kalistenika", hold: "Utrzymanie pozycji" });

// Kandydaci na wzorzec ruchu: [siłownia, dom] — wybierany jest pierwszy dostępny.
const CAND = {
  hpush: [["bench", "dbbench", "machinechest", "floor", "dbfloor", "pushup"], ["bench", "floor", "dbbench", "dbfloor", "pushup", "inclinepush"]],
  hpush2: [["dbbench", "machinechest", "bench", "dbfloor", "pushup"], ["floor", "dbbench", "dbfloor", "pushup", "inclinepush"]],
  hrow: [["row", "cablerow", "dbrow"], ["row", "dbrow", "bandrow", "australian"]],
  hrow2: [["cablerow", "dbrow", "row"], ["row", "dbrow", "bandrow", "australian"]],
  vpull: [["pullup", "latpull", "negpull"], ["pullup", "negpull", "bandpulldown", "australian"]],
  vpull2: [["chinup", "latpull"], ["chinup", "negpull", "bandpulldown", "australian"]],
  vpush: [["ohp", "dbpress"], ["ohp", "dbpress", "pike"]],
  delt: [["lateral", "facepull"], ["lateral", "facepull", "pike"]],
  rear: [["facepull", "cablerow", "dbrow"], ["facepull", "bandrow", "dbrow", "australian"]],
  tri: [["cablepushdown", "dbext", "dip"], ["pushdown", "dbext", "benchdip", "diamond"]],
  bi: [["curl", "hammer"], ["curl", "hammer", "chinup", "australian"]],
  squat: [["squat", "smithsquat", "legpress", "goblet"], ["squat", "goblet", "bulgarian", "airsquat"]],
  squat2: [["legpress", "squat", "goblet"], ["squat", "goblet", "bulgarian", "airsquat"]],
  hinge: [["rdl", "dbrdl", "legcurl"], ["rdl", "dbrdl", "kbswing", "slbridge", "glutebridge"]],
  hingeMain: [["deadlift", "rdl"], ["rdl", "deadlift", "dbrdl", "kbswing", "slbridge"]],
  lunge: [["lunge", "bulgarian", "stepup"], ["lunge", "bulgarian", "stepup", "bwlunge"]],
  core: [["knee", "plank"], ["knee", "plank", "hollow"]],
  hamcurl: [["legcurl"], []],
  calf: [["calf"], []],
  cond: [["rowerg", "treadmill", "kbswing", "bike", "burpee"], ["kbswing", "rope", "bike", "burpee"]],
  // wersja dla kobiet
  glute: [["hipthrust", "glutebridge"], ["hipthrust", "glutebridge"]],
  abd: [["abdmachine", "abduction", "slbridge"], ["abduction", "slbridge", "glutebridge"]],
  kick: [["cablekick", "kickback", "slbridge"], ["kickback", "slbridge", "glutebridge"]],
  sumo: [["sumo", "legpress", "goblet"], ["sumo", "goblet", "airsquat"]],
  wsquat: [["squat", "legpress", "goblet", "smithsquat"], ["goblet", "squat", "bulgarian", "airsquat"]],
  wsquat2: [["goblet", "legpress", "smithsquat"], ["goblet", "airsquat", "bwlunge"]],
  whinge: [["rdl", "deadlift", "dbrdl"], ["rdl", "dbrdl", "kbswing", "slbridge"]],
  wlunge: [["bulgarian", "lunge", "stepup"], ["bulgarian", "lunge", "stepup", "bwlunge"]],
  wstep: [["stepup", "lunge"], ["stepup", "bwlunge"]],
  wrow: [["cablerow", "dbrow", "row"], ["dbrow", "row", "bandrow", "australian"]],
  wvpull: [["latpull", "negpull"], ["bandpulldown", "negpull", "australian"]],
  wpush: [["dbbench", "machinechest", "pushup"], ["dbbench", "dbfloor", "floor", "pushup", "inclinepush"]],
  wpush2: [["pushup", "inclinepush"], ["pushup", "inclinepush"]],
  wvpush: [["dbpress", "ohp"], ["dbpress", "ohp", "pike"]],
  wcore: [["plank", "knee", "hollow"], ["plank", "hollow", "knee"]],
  wcore2: [["hollow", "knee", "plank"], ["hollow", "plank"]],
  wcond: [["kbswing", "burpee", "rowerg"], ["kbswing", "burpee", "rope"]],
};
// Łańcuchy progresji kalistenicznej (od najłatwiejszego); fb — zamienniki bez wymaganego sprzętu
const CHAINS = {
  push: { list: ["inclinepush", "pushup", "diamond", "archer", "pseudoplanche"] },
  pull: { list: ["negpull", "pullup", "chinup", "lsitpull", "archerpull"], fb: ["bandpulldown", "australian"] },
  row: { list: ["australian"], fb: ["bandrow"] },
  dip: { list: ["benchdip", "dip"] },
  squat: { list: ["airsquat", "bulgarian", "shrimp", "pistol"] },
  lunge: { list: ["bwlunge", "stepup", "bulgarian"] },
  bridge: { list: ["glutebridge", "slbridge"] },
  core: { list: ["plank", "hollow", "knee", "legraise", "dragonflag"], fb: ["plank"] },
  coreL: { list: ["hollow", "lsit"], fb: ["hollow"] },
  vpush: { list: ["pike", "elevpike", "wallhs"] },
  abd: { list: ["abduction"], fb: ["slbridge"] },
};
const T = (short, full, name, type, slots) => ({ short, full, name, type, slots: slots || [] });
const s = (p, k) => ({ p, k });
const c = (ch, v, k) => ({ c: ch, v: v || 0, k: k || "kal" });
const TPL = {
  m: {
    klas: [
      T("Pn", "Poniedziałek", "Góra A", "trening", [s("hpush", "glowne"), s("hrow", "glowne"), s("vpull", "wlasne"), s("delt", "pomocnicze"), s("tri", "pomocnicze"), s("bi", "pomocnicze")]),
      T("Wt", "Wtorek", "Dół A", "trening", [s("squat", "glowne"), s("hinge", "pomocnicze"), s("lunge", "pomocnicze"), s("hamcurl", "pomocnicze"), s("core", "brzuch")]),
      T("Śr", "Środa", "Regeneracja aktywna", "odpoczynek"),
      T("Cz", "Czwartek", "Góra B", "trening", [s("vpush", "glowne"), s("vpull2", "wlasne"), s("hpush2", "pomocnicze"), s("hrow2", "pomocnicze"), s("rear", "pomocnicze"), s("bi", "pomocnicze")]),
      T("Pt", "Piątek", "Dół B", "trening", [s("hingeMain", "glowne"), s("squat2", "pomocnicze"), s("lunge", "pomocnicze"), s("calf", "pomocnicze"), s("core", "brzuch")]),
      T("So", "Sobota", "Lekkie cardio", "cardio"), T("Nd", "Niedziela", "Odpoczynek", "odpoczynek"),
    ],
    kal: [
      T("Pn", "Poniedziałek", "Pchanie i ciągnięcie A", "trening", [c("push", 0), c("pull", 0), c("dip", 0), c("row", 0), c("core", 0, "brzuch")]),
      T("Wt", "Wtorek", "Nogi A", "trening", [c("squat", 0), c("lunge", 0), c("bridge", 0), c("coreL", 0, "brzuch")]),
      T("Śr", "Środa", "Regeneracja aktywna", "odpoczynek"),
      T("Cz", "Czwartek", "Pchanie i ciągnięcie B", "trening", [c("vpush", 0), c("pull", 1), c("push", 1), c("row", 0), c("coreL", 0, "brzuch")]),
      T("Pt", "Piątek", "Nogi B", "trening", [c("squat", 1), c("bridge", 1), c("lunge", 1), c("core", 1, "brzuch")]),
      T("So", "Sobota", "Lekkie cardio", "cardio"), T("Nd", "Niedziela", "Odpoczynek", "odpoczynek"),
    ],
  },
  k: {
    klas: [
      T("Pn", "Poniedziałek", "Pośladki i nogi A", "trening", [s("glute", "glowne"), s("wsquat", "glowne"), s("whinge", "pomocnicze"), s("abd", "izol"), s("wcore", "brzuch")]),
      T("Wt", "Wtorek", "Góra ciała", "trening", [s("wrow", "glowne"), s("wvpull", "pomocnicze"), s("wpush", "pomocnicze"), s("wvpush", "pomocnicze"), s("rear", "pomocnicze"), s("wcore2", "brzuch")]),
      T("Śr", "Środa", "Regeneracja aktywna", "odpoczynek"),
      T("Cz", "Czwartek", "Pośladki i nogi B", "trening", [s("whinge", "glowne"), s("wlunge", "pomocnicze"), s("sumo", "pomocnicze"), s("kick", "izol"), s("wcore", "brzuch")]),
      T("Pt", "Piątek", "Całe ciało", "trening", [s("wsquat2", "pomocnicze"), s("glute", "pomocnicze"), s("wrow", "pomocnicze"), s("wpush2", "pomocnicze"), s("wstep", "pomocnicze"), s("wcore2", "brzuch")]),
      T("So", "Sobota", "Lekkie cardio", "cardio"), T("Nd", "Niedziela", "Odpoczynek", "odpoczynek"),
    ],
    kal: [
      T("Pn", "Poniedziałek", "Nogi i pośladki A", "trening", [c("squat", 0), c("bridge", 0), c("lunge", 0), c("abd", 0, "izol"), c("core", 0, "brzuch")]),
      T("Wt", "Wtorek", "Góra ciała A", "trening", [c("push", 0), c("row", 0), c("pull", 0), c("vpush", 0), c("coreL", 0, "brzuch")]),
      T("Śr", "Środa", "Regeneracja aktywna", "odpoczynek"),
      T("Cz", "Czwartek", "Nogi i pośladki B", "trening", [c("squat", 1), c("bridge", 1), c("lunge", 1), c("abd", 0, "izol"), c("core", 1, "brzuch")]),
      T("Pt", "Piątek", "Całe ciało", "trening", [c("push", 1), c("squat", 0), c("row", 0), c("dip", 0), c("coreL", 0, "brzuch")]),
      T("So", "Sobota", "Lekkie cardio", "cardio"), T("Nd", "Niedziela", "Odpoczynek", "odpoczynek"),
    ],
  },
};
// Kontekst: { sex, style, gym, have, level, goal }
function haveFor(loc, equip) {
  const h = {};
  Object.keys(EQUIP).forEach((k) => { h[k] = loc === "silownia" ? true : (!EQUIP[k].gym && !!equip[k]); });
  return h;
}
function pickPattern(p, ctx, used) {
  const list = (CAND[p] || [[], []])[ctx.gym ? 0 : 1];
  const ok = list.map(exByIdStrict).filter((e) => e && eqOk(e, ctx.have));
  return ok.find((e) => !used.has(e.id)) || ok[0] || null;
}
function pickChain(ch, v, ctx, used) {
  const C = CHAINS[ch], L = ctx.level;
  let ok = C.list.map((id, i) => ({ e: exByIdStrict(id), i })).filter((x) => x.e && x.e.lvl <= L && eqOk(x.e, ctx.have));
  ok.sort((a, b) => b.e.lvl - a.e.lvl || a.i - b.i);
  let pool = ok.map((x) => x.e);
  if (!pool.length && C.fb) pool = C.fb.map(exByIdStrict).filter((e) => e && eqOk(e, ctx.have));
  const free = pool.filter((e) => !used.has(e.id));
  const top = free.filter((e) => free.length && e.lvl === free[0].lvl);
  return top[Math.min(v, top.length - 1)] || free[0] || pool[0] || null;
}
function buildPlan(ctx) {
  const G = goalOf(ctx.goal);
  return TPL[ctx.sex][ctx.style].map((d) => {
    if (d.type !== "trening") return Object.assign({}, d, { slots: [] });
    const used = new Set(), out = [];
    const slots = d.slots.slice();
    if (G.cond) slots.push({ p: ctx.sex === "k" ? "wcond" : "cond", k: "finisz" });
    slots.forEach((sl) => {
      const ex = sl.c ? pickChain(sl.c, sl.v, ctx, used) : pickPattern(sl.p, ctx, used);
      if (!ex || used.has(ex.id)) return;
      used.add(ex.id);
      let kind = sl.k;
      if (kind === "kal" && ex.hold) kind = "hold";
      if (kind === "brzuch" && ex.hold) kind = "hold";
      if (kind === "wlasne" && !ex.bw) kind = "pomocnicze";
      if (kind === "glowne" && ex.bw && ctx.style === "klas") kind = "wlasne";
      if (kind === "glowne" && ex.eq.length && ex.eq.every((t) => t === "guma")) kind = "pomocnicze";
      if (G.circuit && (kind === "pomocnicze" || kind === "izol")) kind = "obwod";
      out.push({ ex: ex.id, kind });
    });
    return Object.assign({}, d, { slots: out });
  });
}
function cardioPlan(ctx, w) {
  const main = ["bike", "treadmill", "rowerg"].map(exByIdStrict).find((e) => eqOk(e, ctx.have));
  const extra = ["rope", "burpee"].map(exByIdStrict).find((e) => eqOk(e, ctx.have));
  const min = [25, 25, 30, 30][w];
  const base = main ? `${main.name} ${min} min w tempie rozmowy` : `Szybki marsz lub spokojny bieg ${min + 5} min`;
  const text = w === 0 ? base : `${base} + ${extra.name.toLowerCase()} ${w === 1 ? 5 : 6} × ${extra.id === "burpee" ? "30 s" : "1 min"} (1 min przerwy)`;
  return { text, ex: [main, extra].filter(Boolean) };
}

// Dostępne ilustracje: m — Rico/Pitbull, k — Atena/Łapka
const IMG = { m: new Set(["airsquat", "archer", "archerpull", "australian", "bandpulldown", "bandrow", "bench", "benchdip", "bulgarian", "burpee", "bwlunge", "cablepushdown", "cablerow", "calf", "dbbench", "dbext", "dbfloor", "dbpress", "dbrdl", "dbrow", "deadlift", "diamond", "dip", "dragonflag", "elevpike", "glutebridge", "goblet", "hammer", "hipthrust", "hollow", "inclinepush", "kbswing", "latpull", "legcurl", "legpress", "legraise", "lsit", "lsitpull", "machinechest", "negpull", "pike", "pistol", "plank", "pseudoplanche", "pushup", "rowerg", "shrimp", "slbridge", "smithsquat", "stepup", "sumo", "treadmill", "wallhs"]), k: new Set(["abdmachine", "abduction", "airsquat", "archer", "australian", "bandpulldown", "bandrow", "benchdip", "bike", "bulgarian", "burpee", "bwlunge", "cablekick", "cablerow", "dbbench", "dbfloor", "dbpress", "dbrdl", "dbrow", "diamond", "dip", "dragonflag", "elevpike", "facepull", "floor", "glutebridge", "goblet", "hipthrust", "hollow", "inclinepush", "kbswing", "kickback", "knee", "latpull", "legraise", "lsit", "lsitpull", "negpull", "ohp", "pike", "pistol", "plank", "pseudoplanche", "pullup", "pushup", "rdl", "rope", "row", "shrimp", "slbridge", "squat", "stepup", "sumo", "wallhs"]) };
