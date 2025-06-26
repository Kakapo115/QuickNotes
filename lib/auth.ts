import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export function verifyToken(token: string): { userId: number } {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number };
  } catch {
    throw new Error("Invalid token");
  }
}
