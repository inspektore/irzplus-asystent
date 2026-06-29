# Notatki projektowe

## Problem

Obecna strona IRZplus jest niewygodna w codziennej pracy:

- dużo informacji jest pochowanych,
- trzeba wykonywać wiele powtarzalnych kliknięć,
- trudno szybko zobaczyć kontekst sprawy,
- dane z różnych miejsc trzeba porównywać ręcznie,
- kopiowanie informacji do dalszej analizy jest uciążliwe.

## Cel pierwszego prototypu

Ustalić, które elementy strony warto podnieść do jednego panelu pomocniczego.

Pierwszy prototyp powinien odpowiedzieć na pytania:

- na jakich ekranach IRZplus użytkownik traci najwięcej czasu,
- jakie informacje powinny być zawsze pod ręką,
- które dane warto automatycznie podświetlać,
- co powinno dać się skopiować jednym kliknięciem,
- czy nakładka ma tylko pomagać w odczycie, czy też uruchamiać analizy.

## Zasady

- Nie automatyzować logowania.
- Nie przechowywać danych uwierzytelniających.
- Nie wysyłać danych poza komputer bez wyraźnej decyzji.
- Najpierw obserwować realny workflow, potem dodawać automatyzację.

## Obserwacje ze zrzutów IRZplus

Widoczne ekrany:

- `Zadania` - lista pozycji z typem raportu, statusem, numerem dokumentu/producenta i datą.
- `Dokumenty` - rozbudowany formularz filtrowania.
- `Działalności` - wyszukiwarka z sekcjami rozwijanymi: dane działalności, stan działalności, stan dla gatunku.
- `Statusy epizootyczne` - formularz wniosków z filtrami i przyciskiem utworzenia nowego dokumentu.
- `Podmioty` - formularz wyszukiwania producenta/podmiotu.
- `Zwierzęta` - wiele zakładek i wymaganych pól; użytkownik często prawdopodobnie potrzebuje szybkiego przejścia po numerze zwierzęcia.
- `Zdarzenia` - filtry po gatunku, historii, stanie, typie zdarzeń, numerze zwierzęcia i numerze działalności.
- `Kontrola na miejscu` - formularz raportów i kontroli.
- `Raporty` - lista raportów z numerami działalności i możliwością rozwijania szczegółów.
- `Kierunek przemieszczania zwierząt` - formularz z numerem działalności, gatunkiem, typem, statusem i datami.

Wspólne problemy ergonomiczne:

- te same typy numerów pojawiają się w wielu miejscach: numer działalności, numer producenta, numer zwierzęcia, numer dokumentu/raportu,
- formularze mają dużo pól i zakładek, a najczęstsze ścieżki pracy nie są wyróżnione,
- część danych jest dostępna dopiero po rozwinięciu sekcji albo wiersza,
- trudno zbudować szybki kontekst sprawy bez przeskakiwania między modułami,
- użytkownik musi ręcznie kopiować numery i przenosić je między ekranami.

Pierwszy sensowny zakres nakładki:

- stały panel boczny `Kontekst`, zbierający numery znalezione na aktualnej stronie,
- automatyczne rozpoznawanie numerów: działalności, producenta, zwierzęcia, dokumentu i raportu,
- łagodne podświetlanie takich numerów na stronie,
- szybkie kopiowanie pojedynczego numeru albo całego kontekstu sprawy,
- wykrywanie aktualnego modułu z menu/breadcrumbs,
- skróty do typowych działań na podstawie modułu, np. `kopiuj numer działalności`, `kopiuj filtr`, `przenieś do analizatora`.

Późniejszy zakres:

- szybkie formularze dla najczęstszych wyszukiwań,
- odczyt tabel i eksport danych,
- połączenie z analizatorem przemieszczeń,
- lokalne notatki do sprawy,
- checklista sprawdzeń dla konkretnego typu problemu.

## Ustalony zakres pierwszej wersji

### Raport terminowości

- narzędzie zapamiętuje lokalnie numer działalności,
- uzupełnia oba zakresy: `Data wpływu` i `Data zdarzenia`,
- data początkowa to 1 stycznia bieżącego roku,
- data końcowa to bieżący dzień,
- gatunek jest wybierany ręcznie,
- użytkownik sam zatwierdza przyciskiem `Uruchom`.

### Lista kontrolna zwierząt

Źródła danych:

- tabela zwierząt działalności: numer identyfikacyjny, rasa, płeć, data urodzenia i status,
- karta indywidualna: data przybycia i środki identyfikacji,
- zdarzenia zwierzęcia: ustalenie `U/K`.

Reguły:

- `U` oznacza urodzenie i oznakowanie w kontrolowanej działalności,
- `K` oznacza przybycie z innej działalności,
- numer duplikatu to najwyższy, najnowszy numer spośród aktualnych środków identyfikacji,
- brak duplikatu jest prezentowany jako `-`,
- wiek jest liczony na wybrany dzień kontroli,
- zwierzęta są sortowane według trzech ostatnich cyfr numeru.

Wynik:

- wydruk A4 pionowo,
- jedna sztuka w jednym niezawijanym wierszu,
- nagłówek tabeli powtarzany na kolejnych stronach,
- pusta kolumna do ręcznego oznaczenia,
- podsumowanie płci, `U/K` i liczby zwierząt.

### Lista potomstwa

Planowana funkcja:

- przyjęcie numeru kolczyka matki jako danych wejściowych,
- wykorzystanie filtra `Numer identyfikacyjny matki` w wyszukiwarce zwierząt,
- zebranie wszystkich znalezionych potomków,
- przygotowanie zbiorczej listy potomstwa do dalszej analizy lub wydruku.
