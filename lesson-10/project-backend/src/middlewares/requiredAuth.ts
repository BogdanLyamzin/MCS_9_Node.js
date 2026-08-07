import { Request, Response, NextFunction } from "express";

import { AppError } from "../errors.ts";

import prisma from "../../db.ts";

const requireAuth = async (req: Request, res: Response, next: NextFunction)=> {
    const { userId } = req.session;
    if (!userId) throw new AppError(401, "User not found");

    const user = await prisma.user.findUnique({
        where: {id: userId},
    });
    if(!user) throw new AppError(401, "User not found");
    req.user = user;
    next();
}

export default requireAuth;
