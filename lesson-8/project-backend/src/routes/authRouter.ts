
import { Router } from "express";

import { registerUser, loginUser, logoutUser } from "../controllers/auth.controller.ts";

import validateBody from "../middlewares/validateBody.ts";
import { authSchema } from './../validators/auth.validator.ts';

const authRouter = Router();

authRouter.post("/register", validateBody(authSchema), registerUser);

authRouter.post("/login", validateBody(authSchema), loginUser);

authRouter.post("/logout", logoutUser);

export default authRouter;