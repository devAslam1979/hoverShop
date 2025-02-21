import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../../models/User";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password) {
      res.status(400).json({
        status: false,
        message: "All fields are required",
      });
      return;
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(200).json({
        success: false,
        message: "User already exists",
      });
      return;
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      phone,
      password: passwordHash,
    });
    await newUser.save();
    res.status(201).json({
      success: true,
      message: "User registered successfully",
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
      res.status(400).json({
        success: false,
        message: "All fields are required",
      });
      return;
    }
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({
        status: false,
        message: "User not found",
      });
      return;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: userWithoutPassword,
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
    res.status(200).json({
      success: true,
      message: "User refreshed successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
