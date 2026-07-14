import { z } from "zod";

export const loginSchema = z.object({
  handle: z.string().min(1, "Cluster handle is required"),
  email: z.email("Enter a valid email"),
  password: z.string(),
  // .min(8, "Password must be at least 8 characters"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
