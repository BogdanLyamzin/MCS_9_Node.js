import { Router } from "express";

import { CreateCategorySchema } from "../validators/category.validator.ts";
import type { CreateCategoryBody } from "../validators/category.validator.ts";
import validateBody from "../middlewares/validateBody.ts";
import * as categoriesController from "../controllers/categories.controller.ts";

const categoriesRouter = Router();

categoriesRouter.get("/", categoriesController.getAllCategories);

categoriesRouter.post<{}, any, CreateCategoryBody>(
  "/",
  validateBody(CreateCategorySchema),
  categoriesController.addCategory,
);

export default categoriesRouter;
