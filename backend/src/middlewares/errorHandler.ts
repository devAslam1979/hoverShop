import { NextFunction, Request, Response } from "express";
import { CustomError } from "../types/customError";

const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.status || 500;
    console.log("err", err);
    res.setHeader('Content-Type', 'application/json');
    res.status(statusCode).json({
        message: err.message || "Internal Server Error", 
        status: statusCode,
        stackTrace: err.stack
    });
    return next();
};

export default errorHandler;
