# Express + TypeScript + PostgreSQL

Small REST API demo with Express, TypeScript, and PostgreSQL.

## Routes

| Route | Description |
| --- | --- |
| `GET /` | API entry point |
| `GET /healthz` | Liveness check |
| `GET /readyz` | PostgreSQL readiness check |

## Setup

Install dependencies:

```bash
npm install
```

Start PostgreSQL locally and create a database named `rest_app`.

Default connection string:

```text
postgresql://postgres:567234@localhost:5432/rest_app
```

You can override it with `DATABASE_URL`.

## Scripts

```bash
npm run dev
npm run typecheck
npm run build
npm start
```

Development server:

```bash
npm run dev
```

Health checks:

```bash
curl http://localhost:5000/healthz
curl http://localhost:5000/readyz
```
