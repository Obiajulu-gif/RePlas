import type { Request, Response } from "express"
import User, { UserRole } from "../models/user.model"
import { StatusCodes } from "http-status-codes"
import { BadRequestError, NotFoundError, UnauthenticatedError } from "../errors"

// Register user
export const register = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body

  // Validate role if provided
  if (role && !Object.values(UserRole).includes(role)) {
    throw new BadRequestError("Invalid role")
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    throw new BadRequestError("Email already in use")
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role: role || UserRole.CONSUMER,
  })

  // Generate token
  const token = user.generateAuthToken()

  // Return user data (excluding password)
  res.status(StatusCodes.CREATED).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      walletAddress: user.walletAddress,
      profileImage: user.profileImage,
      createdAt: user.createdAt,
    },
    token,
  })
}

// Login user
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body

  // Validate email and password
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password")
  }

  // Find user
  const user = await User.findOne({ email }).select("+password")
  if (!user) {
    throw new UnauthenticatedError("Invalid credentials")
  }

  // Check password
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid credentials")
  }

  // Generate token
  const token = user.generateAuthToken()

  // Return user data (excluding password)
  res.status(StatusCodes.OK).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      walletAddress: user.walletAddress,
      profileImage: user.profileImage,
      createdAt: user.createdAt,
    },
    token,
  })
}

// Get current user
export const getCurrentUser = async (req: Request, res: Response) => {
  const user = await User.findById(req.user.id)

  if (!user) {
    throw new NotFoundError("User not found")
  }

  res.status(StatusCodes.OK).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      walletAddress: user.walletAddress,
      profileImage: user.profileImage,
      createdAt: user.createdAt,
    },
  })
}

// Update user profile
export const updateProfile = async (req: Request, res: Response) => {
  const { name, walletAddress, profileImage } = req.body

  const user = await User.findById(req.user.id)

  if (!user) {
    throw new NotFoundError("User not found")
  }

  // Update fields
  if (name) user.name = name
  if (walletAddress) user.walletAddress = walletAddress
  if (profileImage) user.profileImage = profileImage

  await user.save()

  res.status(StatusCodes.OK).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      walletAddress: user.walletAddress,
      profileImage: user.profileImage,
      createdAt: user.createdAt,
    },
  })
}

// Get all users (admin only)
export const getAllUsers = async (req: Request, res: Response) => {
  const users = await User.find({})

  res.status(StatusCodes.OK).json({
    success: true,
    count: users.length,
    users: users.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      walletAddress: user.walletAddress,
      profileImage: user.profileImage,
      createdAt: user.createdAt,
    })),
  })
}
