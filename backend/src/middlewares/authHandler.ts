import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

interface AuthenticatedRequest extends Request {
  user?: any;
}

const isAuthenticated = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.headers["authorization"];
    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET as string);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default isAuthenticated;
