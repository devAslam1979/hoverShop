import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../../models/User";
import jwt, { JwtPayload } from "jsonwebtoken";
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        status: false,
        message: "All fields are required",
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(200).json({
        success: false,
        message: "User already exists",
      });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      phone,
      password: passwordHash,
    });
    await newUser.save();
    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_ACCESS_SECRET as string,
      {
        expiresIn: "15m",
      }
    );
    const refreshToken = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_REFRESH_SECRET as string,
      {
        expiresIn: "7d",
      }
    );
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_ACCESS_SECRET as string,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET as string,
      {
        expiresIn: "7d",
      }
    );
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required",
      });
    }
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string
    ) as JwtPayload;
    if (!decoded || typeof decoded === "string") {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }
    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_ACCESS_SECRET as string,
      { expiresIn: "15m" }
    );
    const newRefreshToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_REFRESH_SECRET as string,
      {
        expiresIn: "7d",
      }
    );
    res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
      data: {
        accessToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
