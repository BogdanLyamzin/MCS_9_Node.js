import prisma from "../../prisma/client.js";

const HISTORY_LIMIT = 50;

type SaveMessageInput = {
  authorId: string;
  roomName: string;
  text: string;
};

export const saveMessage = async ({
  authorId,
  roomName,
  text,
}: SaveMessageInput) => {
  return prisma.message.create({
    data: { authorId, roomName, text },
    include: { author: true },
  });
};

export const getRoomHistory = async (roomName: string) => {
  return prisma.message.findMany({
    where: { roomName },
    orderBy: { createdAt: "asc" },
    take: HISTORY_LIMIT,
    include: { author: true },
  });
};
