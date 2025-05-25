import { StatusCodes } from "http-status-codes"

// Base error class
export class CustomError extends Error {
  statusCode: number

  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
  }
}

// Bad request error
export class BadRequestError extends CustomError {
  constructor(message: string) {
    super(message, StatusCodes.BAD_REQUEST)
  }
}

// Not found error
export class NotFoundError extends CustomError {
  constructor(message: string) {
    super(message, StatusCodes.NOT_FOUND)
  }
}

// Unauthenticated error
export class UnauthenticatedError extends CustomError {
  constructor(message: string) {
    super(message, StatusCodes.UNAUTHORIZED)
  }
}

// Forbidden error
export class ForbiddenError extends CustomError {
  constructor(message: string) {
    super(message, StatusCodes.FORBIDDEN)
  }
}
