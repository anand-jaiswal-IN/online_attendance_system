import { z } from "zod";

// Define validation schema
export const CreateSubjectSchema = z.object({
  name: z.string().min(2).max(50).toLowerCase(),
  description: z.string().min(0).max(100),
  subjectCode: z.string().min(4).max(15).toUpperCase(),
  departmentId: z.number().int().positive().min(1).max(7),
});
