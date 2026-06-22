import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.model";
import jwt, { SignOptions } from "jsonwebtoken"; 

// ── helper ───────────────────────────────────────────────
function generateToken(userId: string): string {
  const options: SignOptions = {
    expiresIn: "7d",  // ✅ hardcoded string literal, not from process.env
  };

  return jwt.sign(
    { userId },
    process.env.JWT_SECRET as string,
    options
  );
}

// ── POST /api/auth/register ──────────────────────────────
export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
      return;
    }

    const existing = await User.findOne({ email });
    if (existing) {
      res.status(409).json({
        success: false,
        message: "Email already registered",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(String(user._id));

    res.status(201).json({
      success: true,
      message: "Registered successfully",
      token,
      user: {
        id:    user._id,
        name:  user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err,
    });
  }
}

// ── POST /api/auth/login ─────────────────────────────────
export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    const token = generateToken(String(user._id));

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      user: {
        id:    user._id,
        name:  user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err,
    });
  }
}

// ── GET /api/auth/me ─────────────────────────────────────
export async function getMe(
  req: Request & { userId?: string },
  res: Response
): Promise<void> {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err,
    });
  }
}

// ── POST /api/auth/logout ────────────────────────────────
export async function logout(_req: Request, res: Response): Promise<void> {
  res.status(200).json({
    success: true,
    message: "Logged out successfully. Delete token on client.",
  });
}