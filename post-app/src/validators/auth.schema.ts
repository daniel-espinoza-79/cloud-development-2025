import { z } from "zod";

const nameValidation = z
  .string()
  .min(1, "Name is required")
  .min(2, "Minimum 2 characters")
  .max(50, "Maximum 50 characters")
  .regex(/^[a-zA-Z\s]+$/, "Only letters and spaces allowed")
  .transform((name) => name.trim().replace(/\s+/g, " ")); 

const emailValidation = z
  .string()
  .min(1, "Email is required")
  .email("Invalid email format")
  .toLowerCase()
  .max(254, "Email too long");

const passwordValidation = z
  .string()
  .min(1, "Password is required")
  .min(6, "Minimum 6 characters")
  .max(128, "Maximum 128 characters")
  .refine(
    (password) => /[a-z]/.test(password),
    "Must contain at least one lowercase letter"
  )
  .refine(
    (password) => /[A-Z]/.test(password),
    "Must contain at least one uppercase letter"
  )
  .refine((password) => /\d/.test(password), "Must contain at least one number")
  .refine((password) => !/\s/.test(password), "Cannot contain spaces");

export const registerSchema = z
  .object({
    name: nameValidation,
    email: emailValidation,
    password: passwordValidation,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: emailValidation,
  password: z.string().min(1, "Password is required"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;


export const defaultRegisterValues: RegisterFormData = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const defaultLoginValues: LoginFormData = {
  email: "",
  password: "",
};