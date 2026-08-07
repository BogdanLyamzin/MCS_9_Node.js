
import { Router } from "express";

import { registerUser, verifyUser, loginUser, setUserAvatar, logoutUser } from "../controllers/auth.controller.ts";

import upload from "../middlewares/upload.ts";
import requireAuth from "../middlewares/requiredAuth.ts";
import validateBody from "../middlewares/validateBody.ts";
import { authSchema } from './../validators/auth.validator.ts';

const authRouter = Router();

authRouter.post("/register", validateBody(authSchema), registerUser);

authRouter.get("/verify", verifyUser);

authRouter.post("/login", validateBody(authSchema), loginUser);

// upload.fields([{
//     name: "avatar",
//     maxCount: 1
// }])
// upload.array("avatar", 8);
authRouter.post("/avatar", requireAuth, upload.single("avatar"), setUserAvatar)

authRouter.post("/logout", logoutUser);

export default authRouter;