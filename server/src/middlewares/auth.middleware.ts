import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

interface JwtPayload {
  userId: string;
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Get token from cookie
    const token = req.cookies.token;

    if (!token) {
      throw { statusCode: 401, message: "Not authorized, no token" };
    }

    // 2. Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // 3. Find user in DB
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true }, // Don't select password!
    });

    if (!user) {
      throw { statusCode: 401, message: "Not authorized, user not found" };
    }

    // 4. Attach user to request object
    // @ts-ignore - We defined this in types/express.d.ts but sometimes TS is stubborn
    req.user = user;
    
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Not authorized, token failed" });
  }
};