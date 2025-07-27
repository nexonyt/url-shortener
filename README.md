# 🔗 URL Shortener

Prosty i rozszerzalny system skracania linków zbudowany w oparciu o Node.js, Express i MySQL. Obsługuje funkcje takie jak hasła, limity czasowe, śledzenie użycia i aliasy.

## ✨ Funkcje

- Skracanie długich linków do postaci `https://urlpretty.pl/v/alias`
- Możliwość ustawienia hasła (z haszowaniem SHA-512)
- Obsługa dat ważności (`valid_from`, `valid_to`) i limitów użycia
- Śledzenie kliknięć (tracking)
- Generowanie unikalnych aliasów lub możliwość ich ręcznego ustawienia
- REST API zbudowane w Express
- Obsługa Docker i `docker-compose`

## 🛠️ Wymagania

- Node.js (v16+)
- MySQL
- Docker (opcjonalnie)

## 🚀 Uruchomienie

### 1. Klonowanie repozytorium

```bash
git clone https://github.com/nexonyt/url-shortener.git
cd url-shortener
``` 
 
### 2. Konfiguracja środowiska
Utwórz plik .env w katalogu głównym i dodaj:

```bash
env
SECRET_PASS_ENCODER=twoje_super_tajne_haslo
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=twoje_haslo
DB_NAME=url_shortener
```

### 3. Instalacja zależności
```bash
cd backend
npm install
```

### 4. Uruchomienie aplikacji
```bash 
npm start
```
Aplikacja będzie dostępna pod adresem http://localhost:3000.

## 🐳 Uruchomienie z Docker
```bash
docker-compose up --build
```
To polecenie uruchomi zarówno backend, jak i bazę danych MySQL.


📦 Struktura katalogów
```bash
url-shortener/
├── backend/           # Kod źródłowy backendu (Express)
│   ├── routes/        # Definicje tras API
│   ├── controllers/   # Logika biznesowa
│   └── ...
├── frontend/          # (opcjonalnie) Kod frontendowy
├── docker-compose.yml # Konfiguracja Docker Compose
├── Dockerfile         # Plik Dockerfile dla backendu
└── README.md          # Dokumentacja projektu
```

## 📘 API
Przykład żądania POST do tworzenia nowego skróconego linku:

```bash
POST /api/create-link
Content-Type: application/json

{
  "email": "user@example.com",
  "extended_link": "https://example.com",
  "password": "base64_zaszyfrowane_haslo",
  "tracking": 1,
  "status": 1,
  "expiring": 0,
  "usage_limit": 0
}
Odpowiedź:

{
  "status": "created",
  "short_link": "https://urlpretty.pl/v/abc123"
}
```

## 🧪 Testowanie
Możesz użyć narzędzi takich jak Postman lub curl do testowania endpointów API.

## 🧾 Licencja
Projekt dostępny na licencji MIT.
