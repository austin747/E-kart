import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import User, { UserRole } from "../models/User.model";
import jwt, { SignOptions } from "jsonwebtoken";
import { sendVerificationEmail } from "../utils/sendEmail";

// ── helper ───────────────────────────────────────────────
function generateToken(userId: string, role: UserRole): string {
  const options: SignOptions = {
    expiresIn: "7d",
  };

  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET as string,
    options
  );
}

function hashToken(rawToken: string): string {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

// ── POST /api/auth/register ──────────────────────────────
export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
      return;
    }

    const assignedRole: UserRole =
      role === "retailer" ? "retailer" : "customer";

    const existing = await User.findOne({ email });
    if (existing) {
      res.status(409).json({
        success: false,
        message: "Email already registered",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate a raw token to email, store only its hash in the DB
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = hashToken(rawToken);
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: assignedRole,
      isVerified: false,
      verificationToken: tokenHash,
      verificationTokenExpires: tokenExpires,
    });

    try {
      await sendVerificationEmail(user.email, user.name, rawToken);
    } catch (emailErr) {
      // Roll back the user so they aren't stuck unverified with no way to retry
      await User.findByIdAndDelete(user._id);
      res.status(500).json({
        success: false,
        message: "Could not send verification email. Please try registering again.",
        error: emailErr,
      });
      return;
    }

    // No JWT issued here — user must verify before they can log in
    res.status(201).json({
      success: true,
      message: "Registered successfully. Please check your email to verify your account.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err,
    });
  }
}

// ── GET /api/auth/verify-email/:token ────────────────────
export async function verifyEmail(req: Request, res: Response): Promise<void> {
  try {
    const { token } = req.params;

    if (!token) {
      res.status(400).json({ success: false, message: "Token is required" });
      return;
    }

    const tokenHash = hashToken(token);

    const user = await User.findOne({
      verificationToken: tokenHash,
      verificationTokenExpires: { $gt: new Date() },
    }).select("+verificationToken +verificationTokenExpires");

    if (!user) {
      res.status(400).json({
        success: false,
        message: "Verification link is invalid or has expired",
      });
      return;
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
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

    if (!user.isVerified) {
      res.status(403).json({
        success: false,
        message: "Please verify your email before logging in",
      });
      return;
    }

    const token = generateToken(String(user._id), user.role);

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
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