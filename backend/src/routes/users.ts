import { Request, Response, Router } from "express";

const userRouter = Router();

userRouter.route("/:userId").get((req: Request, res: Response) => {
    console.log("Got item", req.params);
    res.send("Router Users page")
});

export default userRouter;