import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {rename} from "node:fs/promises";
import {resolve, join} from "node:path";

import prisma from "../../db.ts";

import type { AuthBody } from "../validators/auth.validator.ts";

import { AppError } from "../errors.ts";

import sendEmail from "../helpers/sendEmail.ts";

type VerifyQuery = {
  token?: string;
};

export const registerUser = async (
  req: Request<{}, {}, AuthBody>,
  res: Response,
) => {
  const { email, password } = req.body;
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUser)
    throw new AppError(409, `User with email ${email} already exist`);
  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: {
      email,
      passwordHash,
    },
  });

  const payload = {
    email,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "24h",
  });

  const verifyEmail = {
    to: email,
    subject: "verify email",
    html: `<a target='_blank' href='${process.env.BASE_URL}/api/auth/verify?token=${token}'>Click verify email</a>`,
  };

  await sendEmail(verifyEmail);
  res.status(201).json({
    id: newUser.id,
    email: newUser.email,
  });
};

export const verifyUser = async (
  req: Request<{}, {}, {}, VerifyQuery>,
  res: Response,
) => {
    const {token} = req.query;
    if (typeof token !== "string") {
      throw new AppError(400, "Verification token is required");
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!);
        if (typeof payload === "string" || typeof payload.email !== "string") {
          throw new AppError(401, "Invalid verification token");
        }

        const {email} = payload;
        const user = await prisma.user.findUnique({
            where: {
                email,
            }
        });
        if(!user) throw new AppError(404, `User with email ${email} not found`);
        if(user.verify) throw new AppError(401, `User already verified`);

        await prisma.user.update({
            where: {email},
            data: {verify: true}
        });

        res.json({
            message: "User successfully verified"
        })

    }
    catch(error) {
        const message = error instanceof Error
          ? error.message
          : "Invalid verification token";
        throw new AppError(401, message);
    }
}

export const loginUser = async (
  req: Request<{}, {}, AuthBody>,
  res: Response,
) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) throw new AppError(401, `Invalid email or password`);

  if (!user.verify) throw new AppError(401, `Email need verify`);

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isValidPassword) throw new AppError(401, `Invalid email or password`);

  await new Promise((resolve, reject) => {
    req.session.regenerate((error) => (error ? reject(error) : resolve("")));
  });
  req.session.userId = user.id;
  res.json({
    message: "Login success",
    avatarUrl: user.avatarUrl
  });
};

const avatarDirPath = resolve("public", "avatars");

export const setUserAvatar = async(req: Request, res: Response)=> {
  if(!req.file) {
    throw new AppError(400, "Avatar must be exist");
  }
  if (!req.user) {
    throw new AppError(401, "User not found");
  }

  const {path: oldPath, filename} = req.file;
  const newPath = join(avatarDirPath, filename);
  await rename(oldPath, newPath);
  const avatarUrl = join("avatars", filename);
  await prisma.user.update({
    where: {
      id: req.user.id,
    },
    data: {
      avatarUrl,
    }
  });
  res.json({
    avatarUrl
  })
}

export const logoutUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  req.session.destroy((error) => {
    if (error) return next(error);

    res.clearCookie("sid");
    res.status(204).send();
  });
};
