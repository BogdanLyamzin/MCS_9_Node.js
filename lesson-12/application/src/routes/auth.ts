import { Router } from "express";

import { login, logout, me, register } from "../controllers/auth.js";
import { loginValidation, registerValidation } from "../schemas/auth.js";

const router = Router();

router.get("/me", me);
router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.post("/logout", logout);

export default router;
