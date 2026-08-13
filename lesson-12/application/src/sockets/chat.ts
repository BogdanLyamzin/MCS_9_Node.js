import type { Server, Socket } from "socket.io";

import { getRoomHistory, saveMessage } from "../services/messages.js";

const ALLOWED_ROOMS = ["JavaScript", "Python", "Загальний"] as const;

type RoomName = (typeof ALLOWED_ROOMS)[number];

type ChatMessagePayload = {
  roomName: string;
  text: string;
};

type ChatMessage = {
  author: string;
  text: string;
  timestamp: number;
};

type UserJoinedPayload = {
  message: string;
};

export type ClientToServerEvents = {
  "join room": (roomName: string) => void;
  "leave room": (roomName: string) => void;
  "chat message": (payload: ChatMessagePayload) => void;
  "user typing": (roomName: string) => void;
};

export type ServerToClientEvents = {
  "room history": (messages: ChatMessage[]) => void;
  "chat message": (message: ChatMessage) => void;
  "user joined": (payload: UserJoinedPayload) => void;
  "user typing": (username: string) => void;
};

export type SocketData = {
  userId: string;
  username: string;
};

export type ChatServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  Record<string, never>,
  SocketData
>;

export type ChatSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  Record<string, never>,
  SocketData
>;

const isAllowedRoom = (roomName: string): roomName is RoomName => {
  return ALLOWED_ROOMS.includes(roomName as RoomName);
};

export const registerChatHandlers = (socket: ChatSocket, io: ChatServer) => {
  console.log("Користувач підключився:", socket.data.username);

  socket.on("join room", async (roomName: string) => {
    if (!isAllowedRoom(roomName)) {
      return;
    }

    socket.join(roomName);

    const history = await getRoomHistory(roomName);
    socket.emit(
      "room history",
      history.map((msg) => ({
        author: msg.author.username,
        text: msg.text,
        timestamp: msg.createdAt.getTime(),
      })),
    );

    socket.to(roomName).emit("user joined", {
      message: `${socket.data.username} приєднався до ${roomName}`,
    });
  });

  socket.on("leave room", (roomName: string) => {
    socket.leave(roomName);
  });

  socket.on("chat message", async ({ roomName, text }: ChatMessagePayload) => {
    if (!isAllowedRoom(roomName) || !text.trim()) {
      return;
    }

    const saved = await saveMessage({
      authorId: socket.data.userId,
      roomName,
      text,
    });

    io.to(roomName).emit("chat message", {
      author: saved.author.username,
      text: saved.text,
      timestamp: saved.createdAt.getTime(),
    });
  });

  socket.on("user typing", (roomName: string) => {
    if (!isAllowedRoom(roomName)) {
      return;
    }

    socket.to(roomName).emit("user typing", socket.data.username);
  });

  socket.on("disconnect", () => {
    console.log("Користувач відключився:", socket.data.username);
  });
};
