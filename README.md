# ApexFit – Your training crew

Aplikacja treningowa na Androida: plan na 4 tygodnie, ćwiczenia z filmami, żywienie i siedmioro trenerów-asystentów (Zając, Rico, Pitbull, Atena, Łapka, Marta i Oliwka), którzy towarzyszą Ci jako animowane postacie. Trenerzy mogą odpowiadać na pytania przez internet (Gemini, Grok lub ChatGPT – wymaga własnego klucza API, opcjonalnie); bez klucza działają odpowiedzi offline.

## Instalacja na Androidzie

1. Otwórz stronę [Releases](../../releases/latest) na telefonie i pobierz plik APK:
   - `apexfit-1.3.6.apk` – wersja standardowa (ok. 23,5 MB),
   - `apexfit-1.3.6-hq.apk` – wersja HQ: animacje trenerów i filmy ćwiczeń w pełnej jakości (ok. 73 MB).
2. Otwórz pobrany plik. Jeśli Android zapyta, zezwól przeglądarce lub menedżerowi plików na instalowanie aplikacji z nieznanych źródeł.
3. Potwierdź instalację. Aplikacja nazywa się **ApexFit**.

Obie wersje mają ten sam identyfikator aplikacji i ten sam podpis, więc instalują się na starszych wersjach z zachowaniem danych. Wersję HQ (1.3.6-HQ) można zainstalować jako aktualizację na wersji standardowej 1.3.6 i na 1.3.5-HQ. Instalacja „w dół” (np. standardowej 1.3.6 na HQ) wymaga wcześniejszego odinstalowania aplikacji.

Wymagania: Android 7.0 (API 24) lub nowszy.

## iPhone i przeglądarka (PWA)

Wersja webowa działa bez instalowania z App Store: **https://5hady8unny.github.io/apexfit/**

1. Otwórz link w Safari na iPhonie.
2. Dotknij **Udostępnij** → **Do ekranu początkowego**. Aplikacja ApexFit pojawi się jak zwykła ikona i będzie działać na pełnym ekranie.
3. Po pierwszym uruchomieniu większość aplikacji działa offline (filmy ćwiczeń zapisują się po pierwszym odtworzeniu).

Rozmowa z AI wymaga własnego klucza (Gemini, Grok lub ChatGPT) – klucz zapisuje się tylko na Twoim urządzeniu. Funkcje wyłącznie androidowe (nakładka trenera na ekranie, mikrofon w tle) są w wersji webowej ukryte.

## Wersje

| Wersja | Plik | Opis |
|---|---|---|
| 1.3.6 | `apexfit-1.3.6.apk` | Poprawka połączenia z Gemini: obsługa nowych kluczy w formacie „AQ.”, dokładne komunikaty błędów (z kodem HTTP) i stabilniejsze odpowiedzi AI. |
| 1.3.6-HQ | `apexfit-1.3.6-hq.apk` | To samo co 1.3.6, ale z animacjami 262×520 i filmami ćwiczeń 480×848 w pełnej jakości. |
| 1.3.5 | `apexfit-1.3.5.apk` | Nowy wygląd „glass”, nazwa ApexFit, siedmiu trenerów jako interaktywne animowane postacie, rozmowa z AI (Gemini / Grok / ChatGPT), przebudowane ekrany treningów, nowy ekran startowy. |
| 1.3.5-HQ | `apexfit-1.3.5-hq.apk` | To samo co 1.3.5, ale z animacjami 262×520 i filmami ćwiczeń 480×848 w pełnej jakości. |
