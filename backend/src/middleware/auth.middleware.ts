import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";
import { error } from "node:console";

// Protect route function
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new AppError("Not authorized, no token", 401)
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { id: number };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    (req as any).user = user;

    next();
  } catch (error) {
    throw new AppError("Not authorized, token failed", 401)
  }
}