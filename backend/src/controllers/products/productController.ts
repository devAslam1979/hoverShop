import { NextFunction, Request, Response } from "express";
import errorHandler from "../../middlewares/errorHandler";
import { CustomError } from "../../types/customError";

const getProducts = (req: Request, res: Response) => {
    res.send("Get all items")    
}

const getProductById = (req: Request, res: Response) => {
    console.log("Got item", req.params);
    res.send("Router Products page")
}

const addNewProduct = (req: Request, res: Response, next: NextFunction) => {
    res.send("Added a new product")
}

export {getProducts, getProductById, addNewProduct}