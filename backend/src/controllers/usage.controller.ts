import { Request, Response } from "express";
import prisma from "../config/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";

// ===== Create usage function =====
export const createUsage = asyncHandler(async (req: Request, res: Response) => {
  const unitsUsed = Number(req.body.unitsUsed);
  const user = (req as any).user;

  if (isNaN(unitsUsed) || unitsUsed <= 0) {
    throw new AppError("Units used must be a valid number greater than 0", 400);
  }

  // Get Current balance
  const tokens = await prisma.token.aggregate({
    where: { userId: user.id },
    _sum: { units: true },
  });

  const usage = await prisma.usage.aggregate({
    where: { userId: user.id },
    _sum: { unitsUsed: true },
  });

  const totalBought = tokens._sum.units || 0;
  const totalUsed = usage._sum.unitsUsed || 0;

  const remaining = totalBought - totalUsed;

  // Prevent overdrawing
  if (unitsUsed > remaining) {
    throw new AppError("Not enough electricity units", 400);
  }

  // Save usage
  const newUsage = await prisma.usage.create({
    data: {
      unitsUsed,
      userId: user.id,
    },
  });

  res.status(201).json({
    success: true,
    data: newUsage,
  });
});

// ===== Get all usage =====
export const predictUsage = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;

  const usages = await prisma.usage.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
  });

  if (usages.length < 2) {
    return res.json({
      success: true,
      data: { message: "Not enough data yet", },
    });
  }

  // Calculate total used
  const totalUsed = usages.reduce((sum, u) => sum + u.unitsUsed, 0);

  // Calculate average
  const firstDate = usages[0]!.createdAt;
  const lastDate = usages[usages.length - 1]!.createdAt;

  const rawDays =
    (new Date(lastDate).getTime() - new Date(firstDate).getTime()) /
    (1000 * 60 * 60 * 24);

    const days = rawDays < 1 ? 1 : rawDays;

  const avgPerDay = Number((totalUsed / days).toFixed(2));

  // Get balance
  const tokens = await prisma.token.aggregate({
    where: { userId: user.id },
    _sum: { units: true },
  });

  const usageAgg = await prisma.usage.aggregate({
    where: { userId: user.id },
    _sum: { unitsUsed: true },
  });

  const remaining =
    (tokens._sum.units || 0) - (usageAgg._sum.unitsUsed || 0); 

  const daysLeft = avgPerDay > 0 ? remaining / avgPerDay : 0;

  res.json({
    success: true,
    data: {
      avgPerDay,
      remaining,
      estimatedDaysLeft: Math.max(0, Math.ceil(daysLeft)),
    },
  });
});

// Get Alert
export const getAlert = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;

  // Get balance
  const tokens = await prisma.token.aggregate({
    where: { userId: user.id },
    _sum: { units: true },
  });

  const usage = await prisma.usage.aggregate({
    where: { userId: user.id },
    _sum: { unitsUsed: true },
  });

  const totalBought = tokens._sum.units || 0;
  const totalUsed = usage._sum.unitsUsed || 0;
  const remaining = totalBought - totalUsed;

  // Get usage history for prediction
  const usages = await prisma.usage.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
  });

  let estimatedDaysLeft = null;

  if (usages.length >= 2) {
    const firstDate = usages[0]!.createdAt;
    const lastDate = usages[usages.length - 1]!.createdAt;

    const rawDays = 
      (new Date(lastDate).getTime() - new Date(firstDate).getTime()) /
      (1000 * 60 * 60 * 24);
    
    const days = rawDays < 1 ? 1 : rawDays;

    const totalUsedCalc = usages.reduce((sum, u) => sum + u.unitsUsed, 0);
    const avgPerDay = totalUsedCalc / days;

    const daysLeft = avgPerDay > 0 ? remaining / avgPerDay : 0;

    estimatedDaysLeft = Math.ceil(daysLeft);
  }

  // Alert logic
  let alert = "All good";

  if (remaining <= 0) {
    alert = "⚠️ You have no electricity units left!";
  } else if (remaining <= 10) {
    alert = "⚠️ You have only a few electricity units left!";
  } else if (estimatedDaysLeft !== null && estimatedDaysLeft <= 1) {
    alert = "⚠️ Your electricity may finish within a day!";
  }

  res.json({
    success: true,
    data: {
      remaining,
      estimatedDaysLeft,
      alert,
    },
  });
});

// Get usageHistory
export const getUsageHistory = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;

  const usages = await prisma.usage.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc"},
  });

  // Group by day
  const grouped: Record<string, number> = {};

  usages.forEach((u) => {
    const date = new Date(u.createdAt).toISOString().split("T")[0] as string;

    if (!grouped[date]) {
      grouped[date] = 0;
    }

    grouped[date] += u.unitsUsed;
  });

  const result = Object.entries(grouped).map(([date, unitsUsed]) => ({
    date,
    unitsUsed,
  }));

  res.json({
    success: true,
    data: result,
  });
});