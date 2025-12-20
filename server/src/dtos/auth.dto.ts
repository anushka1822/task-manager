import { z } from "zod";

// Register Schema
export const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Login Schema
export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Update Profile Schema
export const UpdateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email address").optional(),
});

// TypeScript types inferred from the schemas
export type RegisterDto = z.infer<typeof RegisterSchema>;
export type LoginDto = z.infer<typeof LoginSchema>;
export type UpdateProfileDto = z.infer<typeof UpdateProfileSchema>;