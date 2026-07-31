# Logify Authentication API

FastAPI authentication backend for Logify. The API uses MySQL, SQLAlchemy, JWT access tokens, and refresh tokens.

## Requirements

- Python 3.11+
- MySQL 8+
- Database schema: `logify`

## Setup

```bash
cd BE
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Create the database before starting the API:

```sql
CREATE DATABASE logify CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Update `.env` with the local database credentials. The current development configuration uses:

```env
DATABASE_URL=mysql+pymysql://root:123456@127.0.0.1:3306/logify
```

## Run

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API base path is `/api/v1`.

## Authentication API

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/auth/register` | Create a user account |
| POST | `/auth/login` | Return access and refresh tokens |
| GET | `/auth/me` | Return the authenticated user |
| POST | `/auth/access` | Create a new access token from a refresh token |
| POST | `/auth/logout` | Revoke a refresh token |

Protected endpoints require:

```text
Authorization: Bearer <access_token>
```

Register fields are `username`, `email`, `password`, `confirmPassword`, and `termsAgreement`. Login uses `username` and `password`. Logout and access-token refresh use `refreshToken`.

## Response format

All successful and business-error responses use:

```json
{
  "statusCode": 200,
  "error": null,
  "message": "Success",
  "data": {}
}
```

## Postman tests

Import `postman/logify-auth.postman_collection.json` into Postman and run the collection in order. It covers the validation and authentication rules documented in `.github/instruction/02-requirements.md` and `.github/instruction/07-testing.md`.

To run it with Newman:

```bash
npx newman run postman/logify-auth.postman_collection.json
```
