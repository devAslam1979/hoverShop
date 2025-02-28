import { Router } from "express";
import { login, refresh, register } from "../controllers/auth/authController";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/refresh",refresh);

export default router;
