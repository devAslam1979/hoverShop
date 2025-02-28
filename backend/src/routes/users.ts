import { Router } from "express";
import { changeAddress, createAddress } from "../controllers/users/userController";

const userRouter = Router();

// userRouter.route("/:userId").get(getUserByUserId);
userRouter.route("/addAddress").post(createAddress);
userRouter.route("/changeCurrentAddress").post(changeAddress)

export default userRouter;