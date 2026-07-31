# Logify

Logify is an authentication application with a React frontend and a FastAPI backend.

## Project Structure

```text
.
├── FE/   React + TypeScript + Vite frontend
└── BE/   FastAPI + MySQL authentication backend
```

## Frontend

```bash
cd FE
npm install
cp .env.example .env
npm run dev
```

The frontend uses `VITE_API_BASE_URL` to connect to the backend. The default value is:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

Available frontend checks:

```bash
npm run typecheck
npm run lint
npm run build
npm run test
```

## Backend

Create the MySQL database first:

```sql
CREATE DATABASE logify CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Then install and run the API:

```bash
cd BE
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Configure database credentials and JWT settings in `BE/.env`.

## API Endpoints

The API base path is `/api/v1`:

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/auth/register` | Register a user |
| POST | `/auth/login` | Login and receive access/refresh tokens |
| GET | `/auth/me` | Get the current user |
| POST | `/auth/access` | Refresh the access token |
| POST | `/auth/logout` | Revoke the refresh token |

## API Tests

Import `BE/postman/logify-auth.postman_collection.json` into Postman. The collection validates registration, login, token refresh, current-user access, logout, duplicate accounts, and documented validation rules.

```bash
npx newman run BE/postman/logify-auth.postman_collection.json
```
