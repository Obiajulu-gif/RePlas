import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { UnauthenticatedError, ForbiddenError } from "../errors"
import type { UserRole } from "../models/user.model"

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user: {
        id: string
        role: UserRole
      }
    }
  }
}

// Authenticate user
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  // Check for token in headers
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Authentication invalid")
  }

  const token = authHeader.split(" ")[1]

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "replas_secret_key") as { id: string; role: UserRole }

    // Add user to request
    req.user = {
      id: decoded.id,
      role: decoded.role,
    }

    next()
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid")
  }
}

// Authorize by role
export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError("Not authorized to access this route")
    }
    next()
  }
}
