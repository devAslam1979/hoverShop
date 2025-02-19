import { Request, Response } from "express";

const getProducts = (req: Request, res: Response) => {
    res.send("Get all items")    
}

const getProductById = (req: Request, res: Response) => {
    console.log("Got item", req.params);
    res.send("Router Products page")
}

export {getProducts, getProductById}