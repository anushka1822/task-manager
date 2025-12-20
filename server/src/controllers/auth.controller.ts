import { Request, Response, NextFunction } from "express";
import { RegisterSchema, LoginSchema } from "../dtos/auth.dto";
import * as authService from "../services/auth.service";

// Cookie Configuration
const COOKIE_OPTIONS = {
  httpOnly: true, // Prevent client-side JS from reading the cookie
  secure: true, // Always true for cross-site (Render is HTTPS)
  sameSite: "none" as const, // Allow cross-site usage
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Validate Input with Zod
    const validation = RegisterSchema.safeParse(req.body);
    if (!validation.success) {
      throw { statusCode: 400, message: validation.error.issues[0].message };
    }

    // 2. Call Service
    const { user, token } = await authService.registerUser(validation.data);

    // 3. Set Cookie and Send Response
    res.cookie("token", token, COOKIE_OPTIONS);
    res.status(201).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Validate Input
    const validation = LoginSchema.safeParse(req.body);
    if (!validation.success) {
      throw { statusCode: 400, message: validation.error.issues[0].message };
    }

    // 2. Call Service
    const { user, token } = await authService.loginUser(validation.data);

    // 3. Set Cookie and Send Response
    res.cookie("token", token, COOKIE_OPTIONS);
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token", { ...COOKIE_OPTIONS, maxAge: 0 });
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    const userId = req.user.id;
    const { name, email } = req.body; // Validation can be added here or assuming simple body

    const updatedUser = await authService.updateProfile(userId, { name, email });

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await authService.getAllUsers();
    res.status(200).json({ success: true, users });
  } catch (error) {
    next(error);
  }
};
