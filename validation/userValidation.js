import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string({ required_error: "Name is required" })
      .trim()
      .min(2, "Name must be at least 2 characters"),
    email: z
      .string({ required_error: "Email is required" })
      .trim()
      .toLowerCase()
      .email("Invalid email format"),
    password: z
      .string({ required_error: "Password is required" })
      .min(8, "Password must be at least 8 characters"),
  })
  .strict();

export const loginSchema = z
  .object({
    email: z
      .string({ required_error: "Email is required" })
      .trim()
      .toLowerCase()
      .nonempty("Email cannot be empty")
      .email("Invalid email format"),

    password: z
      .string({ required_error: "Password is required" })
      .nonempty("Password cannot be empty"),
  })
  .strict();
