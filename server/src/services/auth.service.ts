import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as userRepo from "../repositories/user.repository";
import { LoginDto, RegisterDto } from "../dtos/auth.dto";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

// Helper to generate Token
const generateToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
};

/**
 * Registers a new user, hashes their password, and issues a JWT.
 * @param data - Registration data (name, email, password).
 * @returns The created user (sanitized) and auth token.
 */
export const registerUser = async (data: RegisterDto) => {
  // 1. Check if user exists
  const existingUser = await userRepo.findUserByEmail(data.email);
  if (existingUser) {
    throw { statusCode: 400, message: "User already exists" };
  }

  // 2. Hash password
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // 3. Create user in DB
  const user = await userRepo.createUser({ ...data, password: hashedPassword });

  // 4. Generate Token
  const token = generateToken(user.id);

  // Return user (without password) and token
  const { password, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};

/**
 * Updates a user's profile information.
 * @param userId - The ID of the authenticated user.
 * @param data - The fields to update (name, email).
 * @returns The updated user object.
 */
export const updateProfile = async (userId: string, data: { name?: string; email?: string }) => {
  // If email is changing, ensure it's not taken
  if (data.email) {
    const existingUser = await userRepo.findUserByEmail(data.email);
    if (existingUser && existingUser.id !== userId) {
      throw { statusCode: 400, message: "Email already in use" };
    }
  }

  const updatedUser = await userRepo.updateUser(userId, data);
  const { password, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
};

export const getAllUsers = async () => {
  return await userRepo.getAllUsers();
};

/**
 * Authenticates a user and issues a JWT if credentials match.
 * @param data - Login credentials (email, password).
 * @returns The user object and auth token.
 */
export const loginUser = async (data: LoginDto) => {
  // 1. Find user
  const user = await userRepo.findUserByEmail(data.email);
  if (!user) {
    throw { statusCode: 401, message: "Invalid credentials" };
  }

  // 2. Check password
  const isMatch = await bcrypt.compare(data.password, user.password);
  if (!isMatch) {
    throw { statusCode: 401, message: "Invalid credentials" };
  }

  // 3. Generate Token
  const token = generateToken(user.id);

  const { password, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};