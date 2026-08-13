import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express, {
  type ErrorRequestHandler,
  type Request,
  type Response,
} from "express";
import cookieParser from "cookie-parser";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { errors as celebrateErrors } from "celebrate";

import { socketAuthMiddleware } from "./middlewares/socket-auth.js";
import authRouter from "./routes/auth.js";
import {
  registerChatHandlers,
  type ChatServer,
} from "./sockets/chat.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const httpServer = createServer(app);
const io: ChatServer = new Server(httpServer);

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));

app.use("/auth", authRouter);

io.use(socketAuthMiddleware);

io.on("connection", (socket) => {
  registerChatHandlers(socket, io);
});

app.use(celebrateErrors());

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  res.status(status).send(err.message || "Internal Server Error");
};

app.use(errorHandler);

const port = Number(process.env.PORT || 3000);

httpServer.listen(port, () => {
  console.log(`Сервер запущено на порті ${port}`);
});
