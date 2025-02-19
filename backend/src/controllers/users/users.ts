import { Request, Response } from "express";

const getUserByUserId = (req: Request, res: Response) => {
    console.log("Got item", req.params);
    res.send("Router Users page")
};

export {getUserByUserId};