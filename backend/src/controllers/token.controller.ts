import { Request, Response } from "express";
import prisma from "../config/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";

// Create token function
export const createToken = asyncHandler(async (req: Request, res: Response) => {
  // Convert incoming values to numbers
  const units = Number(req.body.units);
  const amount = Number(req.body.amount)

  // Validate numbers
  if (isNaN(units) || isNaN(amount)) {
    throw new AppError("Units and amount must be numbers", 400);
  }

  const user = (req as any).user;

  const token = await prisma.token.create({
    data: {
      units,
      amount,
      userId: user.id,
    },
  });

  res.status(201).json({
    success: true,
    data: token,
  });
});

// Initialize units
export const initializeUnits = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;

  const units = Number(req.body.units);

  if (isNaN(units) || units <= 0) {
    throw new AppError("Units must be greater than 0", 400);
  }

  const token = await prisma.token.create({
    data: {
      units,
      amount: 0,
      userId: user.id,
    },
  });

  res.status(201).json({
    success: true,
    data: token,
  });
});

// Get all tokens
export const getBalance = asyncHandler( async (req: Request, res: Response) =>{
  const user = (req as any).user;

  // Total units bought
  const tokens = await prisma.token.aggregate({
    where: { userId: user.id },
    _sum: { units: true },
  });

  // Total units used
  const usage = await prisma.usage.aggregate({
    where: { userId: user.id },
    _sum: { unitsUsed: true },
  });

  const totalBought = tokens._sum.units || 0;
  const totalUsed = usage._sum.unitsUsed || 0;

  const remaining = totalBought - totalUsed;

  res.status(200).json({
    success: true,
    data: {
      totalBought,
      totalUsed,
      remaining,
    },
  });
});