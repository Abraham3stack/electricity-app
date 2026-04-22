import { Request, Response } from "express";
import prisma from "../config/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";  
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";

// Create user function
export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    throw new AppError("All fields are required", 400);
  }

  // Check if user already exist
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError("User already exists", 400);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  let user;

  try {
    user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
  } catch (error: any) {
    // Handle Prisma unique constraint error (duplicate email)
    if (error.code === "P2002") {
      throw new AppError("User already exists", 400);
    }

    throw new AppError("User creation failed", 500);
  }

  if (!user) {
    throw new AppError("User creation failed", 500);
  }

  // Remove password from response
  const { password: _, ...userWithoutPassword } = user;

  res.status(201).json({
    success: true,
    data: userWithoutPassword,
  });
});

// Login user function
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    throw new AppError("All fields are required", 400);
  }

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError("Invalid credentials", 401);
  }

  // Generate Token
  const token = generateToken(user.id);

  // Send response (without password)
  const { password: _, ...userWithoutPassword } = user;

  res.status(200).json({
    success: true,
    token,
    user: userWithoutPassword,
  });
});