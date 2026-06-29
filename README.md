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

## Instalacja testowa w Firefoksie

1. Otwórz w Firefoksie stronę `about:debugging`.
2. Wybierz `Ten Firefox`.
3. Kliknij `Wczytaj tymczasowy dodatek`.
4. Wskaż plik `rozszerzenie/manifest.json` z tego projektu.
5. Otwórz lub odśwież stronę IRZplus.

Dodatek tymczasowy jest usuwany po zamknięciu Firefoksa. Dane zapisane przez rozszerzenie pozostają wyłącznie w lokalnej pamięci przeglądarki.

## Planowane moduły

- generowanie listy kontrolnej zwierząt w układzie A4 pionowo,
- zbieranie danych z listy zwierząt i ich kart indywidualnych,
- karta kontekstu zwierzęcia,
- integracja z analizatorem przemieszczeń,
- szybkie przejścia i kopiowanie danych pomiędzy modułami IRZplus.
