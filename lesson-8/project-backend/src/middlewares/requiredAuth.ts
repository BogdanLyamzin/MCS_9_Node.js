import { Request, Response, NextFunction } from "express";

import { AppError } from "../errors.ts";

import prisma from "../../db.ts";

const requireAuth = async (req: Request, res: Response, next: NextFunction)=> {
    const user = await prisma.user.findUnique({
        where: {id: req.session.userId},
    });
    if(!user) throw new AppError(401, "User not found");
    next();
}

export default requireAuth;