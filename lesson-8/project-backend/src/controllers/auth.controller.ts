import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";

import prisma from "../../db.ts";

import type { AuthBody } from "../validators/auth.validator.ts";

import { AppError } from "../errors.ts";

// const salt = await bcrypt.genSalt(10);
// console.log(salt);
// const hashStr1 = await bcrypt.hash("123456", 10);
// console.log(hashStr1);
// const compareResult1 = await bcrypt.compare("123456", hashStr1);
// console.log(compareResult1);
// const compareResult2 = await bcrypt.compare("123457", hashStr1);
// console.log(compareResult2);

export const registerUser = async (
  req: Request<{}, {}, AuthBody>,
  res: Response,
) => {
    const {email, password} = req.body;
    const existingUser = await prisma.user.findUnique({
        where: {email}
    });
    if(existingUser) throw new AppError(409, `User with email ${email} already exist`);
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
        data: {
            email,
            passwordHash,
        }
    });
    res.status(201).json({
        id: newUser.id,
        email: newUser.email,
    })
};

export const loginUser = async(req: Request<{}, {}, AuthBody>,
  res: Response)=> {
    const {email, password} = req.body;
    const user = await prisma.user.findUnique({
        where: {email}
    });
    if(!user) throw new AppError(401, `Invalid email or password`);
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if(!isValidPassword) throw new AppError(401, `Invalid email or password`);

    await new Promise((resolve, reject)=> {
        req.session.regenerate(error => error ? reject(error) : resolve(""));
    });
    req.session.userId = user.id;
    res.json({
        message: "Login success"
    })
}

export const logoutUser = async(req: Request, res: Response, next: NextFunction) => {
    req.session.destroy(error => {
        if(error) return next(error);

        res.clearCookie("sid");
        res.status(204).send();
    })
}