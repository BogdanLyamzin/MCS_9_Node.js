import { parseCookie } from "cookie";
import type { ExtendedError } from "socket.io";

import prisma from "../../prisma/client.js";
import { findValidSession } from "../services/session.js";
import type { ChatSocket } from "../sockets/chat.js";

export const socketAuthMiddleware = async (
  socket: ChatSocket,
  next: (err?: ExtendedError) => void,
) => {
  const cookieHeader = socket.handshake.headers.cookie;
  if (!cookieHeader) {
    return next(new Error("Не авторизовано"));
  }

  const cookies = parseCookie(cookieHeader);
  const sessionId = cookies.sessionId;
  if (!sessionId) {
    return next(new Error("Не авторизовано"));
  }

  const session = await findValidSession(sessionId);
  if (!session) {
    return next(new Error("Сесія недійсна"));
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) {
    return next(new Error("Користувача не знайдено"));
  }

  socket.data.userId = user.id;
  socket.data.username = user.username;

  next();
};
