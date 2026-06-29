# IRZplus Asystent

Lokalne rozszerzenie do Firefoksa, które usprawnia codzienną pracę w IRZplus. Projekt jest rozwijany jako osobna aplikacja i nie ogranicza się do analizy przemieszczeń.

## Bezpieczeństwo

- użytkownik loguje się do IRZplus samodzielnie,
- rozszerzenie nie odczytuje ani nie przechowuje loginu i hasła,
- dane nie są wysyłane poza komputer,
- rozszerzenie uruchamia się tylko na `https://irz.arimr.gov.pl/`,
- jest to wersja testowa i może zawierać błędy.

## Aktualny zakres

- panel pomocniczy widoczny na stronach IRZplus,
- lokalne zapamiętywanie numeru działalności,
- pobieranie numeru działalności z aktualnej strony,
- automatyczne uzupełnianie formularza raportu terminowości:
  - numer działalności,
  - oba zakresy dat od początku bieżącego roku do dzisiaj,
  - bez automatycznego wyboru gatunku,
  - bez automatycznego uruchomienia raportu.
- zbieranie zwierząt z tabeli wyników dla działalności,
- uzupełnianie danych z indywidualnych kart zwierząt:
  - data przybycia,
  - najwyższy, najnowszy numer duplikatu,
  - oznaczenie `U/K`,
- przygotowanie listy kontrolnej do wydruku lub zapisania jako PDF:
  - format A4 pionowo,
  - jeden niezawijany wiersz dla każdej sztuki,
  - sortowanie według trzech ostatnich cyfr,
  - wiek na wskazany dzień,
  - podsumowanie płci, `U/K` i liczby zwierząt.

## Przygotowanie listy kontrolnej

1. Wyszukaj w IRZplus zwierzęta dla właściwego numeru działalności.
2. Sprawdź, czy tabela zawiera oczekiwane zwierzęta.
3. W panelu `IRZplus Asystent` ustaw numer działalności i datę `Stan na dzień`.
4. Kliknij `Przygotuj listę`.
5. Poczekaj na uzupełnienie kart zwierząt. Rozszerzenie wykorzystuje do tego jedną nieaktywną kartę Firefoksa.
6. W otwartym podglądzie wybierz `Drukuj lub zapisz PDF`.

Nie zamykaj pomocniczej karty podczas zbierania danych. Przed wykorzystaniem dokumentu sprawdź liczbę zwierząt i podsumowanie.

## Instalacja testowa w Firefoksie

1. Otwórz w Firefoksie stronę `about:debugging`.
2. Wybierz `Ten Firefox`.
3. Kliknij `Wczytaj tymczasowy dodatek`.
4. Wskaż plik `rozszerzenie/manifest.json` z tego projektu.
5. Otwórz lub odśwież stronę IRZplus.

Dodatek tymczasowy jest usuwany po zamknięciu Firefoksa. Dane zapisane przez rozszerzenie pozostają wyłącznie w lokalnej pamięci przeglądarki.

## Dalszy rozwój

- karta kontekstu zwierzęcia,
- generowanie listy potomstwa na podstawie numeru kolczyka matki,
- integracja z analizatorem przemieszczeń,
- szybkie przejścia i kopiowanie danych pomiędzy modułami IRZplus.
