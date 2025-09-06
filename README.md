# PiPanel

PiPanel is a customizable smart dashboard for Raspberry Pi. It features Spotify playback controls, calendar and agenda sync, photo slideshows, and a smart home control panel.

## Overview

- Frontend: Vite + Preact app in `frontend/` (built output in `frontend/dist`).
- Backend: Flask app in `backend/` that serves the built frontend and exposes `/spotify/*` endpoints.
- Production: Gunicorn runs the Flask app and serves static assets from the built frontend.

## Prerequisites

- Python 3.11+ (tested with 3.13)
- Node.js 18+ and npm

## Repository Structure

- `frontend/` – Vite/Preact source, `npm run build` outputs to `dist/`.
- `backend/` – Flask app, Spotify routes, Python deps in `requirements.txt`.
- `README.md` – This file.

## Setup

1) Install frontend dependencies

```
cd frontend
npm install
```

2) Build the frontend for production

```
npm run build
```

This creates `frontend/dist/`, which the Flask app serves at the root path (`/`).

3) Create a Python virtual environment and install backend deps

```
cd ../backend
python -m venv venv
. venv/bin/activate
pip install -r requirements.txt
```

## Running

You can run the backend from either the repo root or inside `backend/`.

- From repo root (uses `backend.app:app`):

```
backend/venv/bin/gunicorn -b 127.0.0.1:5000 backend.app:app
```

- From backend/ directory (imports `app:app` directly):

```
cd backend
venv/bin/gunicorn -b 127.0.0.1:5000 app:app
```

Notes:
- The Flask app is configured with `static_folder="../frontend/dist"` and `static_url_path="/"` so assets like `/assets/...` and `/vite.svg` resolve correctly.
- An SPA fallback is enabled: unknown paths return `index.html`, allowing client‑side routing.

## Development

Run the frontend and backend separately for fast iteration.

Frontend (Vite dev server):

```
cd frontend
npm run dev   # Vite (defaults to http://127.0.0.1:5173)
```

Backend (Flask via Gunicorn or Flask dev server):

```
cd backend
venv/bin/gunicorn -b 127.0.0.1:5001 app:app
# or for quick local debugging
python app.py
```

The backend enables CORS, so the Vite dev server can call the API during development.

## Environment

- Copy `env-example` to `.env` at the repo root and adjust values as needed.
- Backend also loads environment variables (see `backend/requirements.txt` for `python-dotenv`).

## API Endpoints (Spotify)

Base path: `/spotify`

- `GET /spotify/status` – Current playback status
- `GET /spotify/play` – Play
- `GET /spotify/pause` – Pause
- `GET /spotify/next` – Next track
- `GET /spotify/prev` – Previous track
- `GET /spotify/seek/<int:pos>` – Seek to position (seconds)
- `GET /spotify/shuffle/<state>` – Toggle shuffle (`true`/`false`)
- `GET /spotify/repeat/<state>` – Repeat mode (`off`|`context`|`track`)
- `GET /spotify/volume/<int:volume>` – Set volume (0–100)

## Troubleshooting

- Error: `ModuleNotFoundError: No module named 'backend'`
  - Run from the repo root with `backend.app:app`, or set `PYTHONPATH=..` if running inside `backend/`.
  - Example inside `backend/`: `PYTHONPATH=.. venv/bin/gunicorn -b 127.0.0.1:5000 backend.app:app`.

- Frontend not loading or assets 404
  - Ensure you ran `npm run build` in `frontend/`.
  - Confirm Flask is started after the build and that `static_url_path="/"` is configured (it is by default in this repo).
