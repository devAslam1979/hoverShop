import { Router } from "express";
import { getUserByUserId } from "../controllers/users/users";

const userRouter = Router();

userRouter.route("/:userId").get(getUserByUserId);

export default userRouter;