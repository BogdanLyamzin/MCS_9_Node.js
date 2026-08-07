import type { User } from "../../prisma/generated/prisma/client.ts";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export {};
