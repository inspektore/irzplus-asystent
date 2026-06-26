# IRZplus Asystent

Oddzielny projekt dla nakładki/asystenta pracy z IRZplus.

Cel projektu: poprawić ergonomię codziennej pracy na stronie IRZplus, szczególnie tam, gdzie informacje są pochowane, wymagają wielu kliknięć albo trudno je zestawić w jednym widoku.

## Założenia

- Użytkownik loguje się do IRZplus samodzielnie.
- Aplikacja nie przechowuje loginu ani hasła.
- Pierwsze wersje powinny działać lokalnie i możliwie bezpiecznie.
- Projekt nie jest ograniczony tylko do historii zdarzeń zwierzęcia.
- Funkcje mają wynikać z realnych problemów użytkowych na stronie.

## Możliwe kierunki

- panel boczny z najważniejszym kontekstem aktualnej sprawy,
- szybkie kopiowanie numerów zwierząt, dokumentów i działalności,
- podświetlanie powiązanych numerów na stronie,
- wykrywanie aktualnego ekranu IRZplus,
- skróty do często używanych sekcji,
- zbieranie danych z widocznych tabel,
- przekazywanie danych do analizatora przemieszczeń,
- lokalne notatki do sprawy,
- raport pomocniczy z aktualnego widoku.

## Forma techniczna do rozważenia

1. Bookmarklet lub skrypt uruchamiany ręcznie na stronie.
2. Rozszerzenie przeglądarki.
3. Lokalna aplikacja pomocnicza współpracująca z przeglądarką.

Na start najrozsądniejszy jest szybki prototyp jako nakładka uruchamiana na aktualnie otwartej stronie. Docelowo wygodniejsze będzie rozszerzenie przeglądarki.

## Status

Szkielet projektu. Bez połączenia z IRZplus i bez gotowych funkcji produkcyjnych.
