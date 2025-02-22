import { z } from "zod";

// Define validation schema
export const CreateAdminUserSchema = z.object({
  firstName: z.string().min(2).toLowerCase(),
  lastName: z.string().min(2).toLowerCase(),
  username: z.string().min(3).toLowerCase(),
  password: z
    .string()
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
});
