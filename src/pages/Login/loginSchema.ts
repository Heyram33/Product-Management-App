import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password should be minimum 6 letters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
