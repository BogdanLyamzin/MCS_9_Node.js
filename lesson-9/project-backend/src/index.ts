import express from "express";

import "dotenv/config";

import logger from "./middlewares/logger.ts";
import notFoundHandler from "./middlewares/notFoundHandler.ts";
import errorHandler from "./middlewares/errorHandler.ts";
import sessionMiddleware from "./middlewares/sessionMiddleware.ts";

import authRouter from "./routes/authRouter.ts";
import categoriesRouter from "./routes/categoriesRouter.ts";
import notesRouter from "./routes/notesRouter.ts";

const app = express();

app.use(express.json());
app.use(logger);
app.use(sessionMiddleware);
app.use(express.static("public"));

app.use("/api/auth", authRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/notes", notesRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(3000, ()=> console.log("Server running on port 3000"));
