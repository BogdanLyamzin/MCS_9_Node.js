import type { Request, Response } from "express";

import prisma from "../../db.ts";

import type { CreateCategoryBody } from "../validators/category.validator.ts";

export const getAllCategories = async (_req: Request, res: Response) => {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      notes: true,
    },
  });

  res.json(categories);
};

export const addCategory = async (
  req: Request<{}, {}, CreateCategoryBody>,
  res: Response,
) => {
  const newCategory = await prisma.category.create({
    data: req.body,
  });

  res.status(201).json(newCategory);
};
