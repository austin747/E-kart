import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "../models/User.model";

// we Define a safe internal structure matching what Multer populates
interface UploadedFileSummary {
  path: string;
  fieldname?: string;
  originalname?: string;
  mimetype?: string;
  size?: number;
}

// Extended globally so both req.userId, req.role, and req.file work everywhere smoothly
export interface AuthRequest extends Omit<Request, "file" | "files"> {
  userId?: string; 
  role?: UserRole;
  
  // Now we can define file safely using our custom shape without type clashes!
  file?: any; // Or use: file?: UploadedFileSummary;
  files?: any;
}

interface JwtPayload {
  userId: string;
  role: UserRole;
}

export function protect(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ success: false, message: "No token, unauthorized" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    req.userId = decoded.userId;
    req.role   = decoded.role;
    next();
  } catch {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}

export function requireRole(...roles: UserRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.role || !roles.includes(req.role)) {
      res.status(403).json({
        success: false,
        message: "Access denied — insufficient permissions",
      });
      return;
    }
    next();
  };
}