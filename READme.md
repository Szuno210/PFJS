# Aplikacja do wstawiania cytatów

## Wykorzystane frameworki i narzędzia

### 1. Express.js

Express.js to minimalistyczny i elastyczny framework do tworzenia aplikacji webowych w Node.js. Jest wykorzystywany jako główny szkielet aplikacji.

#### Kluczowe elementy:

- **Routing**: Obsługa różnych ścieżek URL i metod HTTP
- **Statyczne pliki**: Serwowanie statycznych plików (CSS, JavaScript, obrazy)

### 2. SQLite

Bezserwerowa baza danych SQL. Moduł `sqlite3` umożliwia integrację SQLite z Node.js.

#### Zastosowanie:

- Przechowywanie danych użytkowników i cytatów
- Wykonywanie zapytań SQL do manipulacji danymi

### 3. Express-session

Middleware do obsługi sesji użytkowników w Express.

#### Funkcje:

- Zarządzanie sesjami użytkowników
- Przechowywanie informacji o zalogowanym użytkowniku

### 4. Dotenv

Moduł do ładowania zmiennych środowiskowych z pliku `.env`.

### 5. Body-parser

Middleware do parsowania ciała żądań HTTP.

## Architektura aplikacji

Aplikacja opiera się na architekturze MVC (Model-View-Controller)

1. **Model**: Reprezentowany przez interakcje z bazą danych (plik `database.js`)
2. **View**: Strony HTML (`index.html`, `cytaty.html`)
3. **Controller**: Logika obsługi żądań w `server.js`

## Szczegółowe wykorzystanie narzędzi

### a. Routery kierujące ruchem HTTP

Express.js zapewnia system routingu. Przykład:

```javascript
app.get("/api/cytaty", (req, res) => {
  // Obsługa żądania GET dla /api/cytaty
});
```

### b. Konektory do baz danych

Wykorzystano moduł sqlite3 do połączenia z bazą SQLite:

```javascript
var db = new sqlite3.Database(DBSOURCE, (err) => {
  // Konfiguracja połączenia z bazą danych
});
```

### c. Współpraca z REST API

Aplikacja implementuje własne REST API do obsługi operacji CRUD na cytatach:

`GET /api/cytaty: Pobieranie cytatów`

`POST /api/dodaj_cytat: Dodawanie nowego cytatu`

`DELETE /api/cytaty/:id: Usuwanie cytatu`

`PUT /api/cytaty/:id: Aktualizacja cytatu`

## Problemy i ich przykładowe rozwiązania

Problem: Brak zabezpieczenia przed atakami SQL injection.
Rozwiązanie: Użycie parametryzowanych zapytań w sqlite3.

Problem: Przechowywanie haseł w formie plaintext.
Rozwiązanie: Implementacja haszowania haseł.

Problem: Brak walidacji danych wejściowych po stronie serwera.
Rozwiązanie: Dodanie middleware do walidacji danych przed przetworzeniem żądań.
