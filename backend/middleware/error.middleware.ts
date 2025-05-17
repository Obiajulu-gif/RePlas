import type { Request, Response, NextFunction } from "express"
import { StatusCodes } from "http-status-codes"
import { CustomError } from "../errors"

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err)

  // Handle custom errors
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    })
  }

  // Handle validation errors
  if (err.name === "ValidationError") {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: err.message,
    })
  }

  // Handle duplicate key errors
  if (err.name === "MongoError" && (err as any).code === 11000) {
    return res.status(StatusCodes.CONFLICT).json({
      success: false,
      error: "Duplicate value entered",
    })
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      error: "Invalid token",
    })
  }

  // Handle expired JWT
  if (err.name === "TokenExpiredError") {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      error: "Token expired",
    })
  }

  // Default to 500 server error
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: "Something went wrong, please try again",
  })
}
