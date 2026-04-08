import jwt, { SignOptions } from "jsonwebtoken";

export const generateToken = (userId: number) => {
  const expiresIn = process.env.JWT_EXPIRES_IN;

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  if (expiresIn) {
    return jwt.sign(
      { id: userId },
      secret,
      { expiresIn } as SignOptions
    );
  }

  return jwt.sign({ id: userId }, secret);
};