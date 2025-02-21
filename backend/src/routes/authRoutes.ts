import { Router } from "express";
import { login, register,refresh } from "../controllers/users/authController";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/refresh",refresh);

export default router;
