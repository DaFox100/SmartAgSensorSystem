# SmartAg Sensor System

A full-stack IoT dashboard for monitoring agricultural sensor data (soil moisture, temperature, humidity) from Arduino hardware. Includes a web dashboard and Android/iOS apps built with Capacitor.

## Project Structure

```
SmartAgSensorSystem/
├── frontend/          # React + TypeScript + Vite web app (+ Android & iOS via Capacitor)
├── backend/           # Python Flask API
├── ArdunioCode/       # Arduino sensor firmware
└── static/            # Static assets
```

---

## Frontend

**Stack:** React 19, TypeScript, Vite, react-plotly.js, Capacitor (Android & iOS)

### Pages
| Route | Description |
|---|---|
| `/home` | Live sensor dashboard — current readings, daily highs/lows, data graph |
| `/workerPage` | Worker view |
| `/adminPage` | Admin controls |
| `/loginPage` | Login |

### Setup

```bash
cd frontend
npm install
```

### Environment

Create a `frontend/.env` file:

```
VITE_API_URL=http://localhost:8081
```

For connecting a phone on the same network, replace `localhost` with your machine's local IP (e.g. `http://192.168.1.x:8081`).

### Run (web)

```bash
cd frontend
npm run dev
```

### Build

```bash
cd frontend
npm run build
```

---

## Backend

**Stack:** Python, Flask, Flask-CORS, Firebase Admin SDK, bcrypt

### Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Run

```bash
python app.py
```

The API runs on port **8081** by default.

### API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/latest` | Most recent sensor reading |
| GET | `/highs_lows?date=YYYY-MM-DD` | Daily high/low values |
| GET | `/graph-data?start=YYYY-MM-DD&end=YYYY-MM-DD` | Sensor data for graph |
| GET | `/average?start=YYYY-MM-DD&end=YYYY-MM-DD` | Average readings over a date range |
| POST | `/receive_data` | Ingest data from Arduino |

---

## Mobile Apps (Capacitor)

The frontend is wrapped as native Android and iOS apps using [Capacitor](https://capacitorjs.com/).

### Update the app after frontend changes

```bash
cd frontend
npm run build
npx cap sync
```

### Changing the backend URL

Edit `frontend/.env` with your server's IP, then rebuild and sync:

```
VITE_API_URL=http://192.168.x.x:8081
```

```bash
npm run build && npx cap sync
```

---

## Android App

### Requirements
- [Android Studio](https://developer.android.com/studio)
- Android SDK installed

### Open in Android Studio

```bash
cd frontend
npx cap open android
```

---

## iOS App

### Requirements
- macOS with [Xcode](https://developer.apple.com/xcode/) installed
- Apple Developer account (required for deploying to a real device)

### Open in Xcode

```bash
cd frontend
npx cap open ios
```

---

## Arduino

Firmware is located in `ArdunioCode/`. The Arduino posts sensor readings (soil moisture, temperature, humidity) to the Flask backend via HTTP.
