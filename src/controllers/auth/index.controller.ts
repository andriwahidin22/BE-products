import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretjwt";

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user.id, username: user.username, role: user.role },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const me = async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user) return res.status(401).json({ message: "Unauthorized" });

  return res.status(200).json({ user });
};

export const logout = async (_req: Request, res: Response) => {
  // Logout handled client-side by deleting token
  return res.status(200).json({ message: "Logged out successfully" });
};
