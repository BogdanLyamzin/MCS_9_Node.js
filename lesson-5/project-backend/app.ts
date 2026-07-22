import express, { type Request, type Response } from "express";
import pg from "pg";

const app = express();
const PORT = Number(process.env.PORT) || 5000;

const pool = new pg.Pool({
  connectionString:
    process.env.DATABASE_URL ??
    "postgresql://postgres:567234@localhost:5432/rest_app",
});

app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "REST API demo - Express + PostgreSQL",
    routes: {
      liveness: "/healthz",
      readiness: "/readyz",
    },
  });
});

app.get("/healthz", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
  });
});

app.get("/readyz", async (_req: Request, res: Response) => {
  try {
    await pool.query("SELECT 1");
    res.json({
      status: "ok",
      database: "connected",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(503).json({
      status: "error",
      database: "disconnected",
      message,
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server: http://0.0.0.0:${PORT}`);
});
