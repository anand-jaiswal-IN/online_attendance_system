import { z } from "zod";

// Define validation schema
export const CreateEmployeeSchema = z.object({
  firstName: z.string().min(2).toLowerCase(),
  lastName: z.string().min(2).toLowerCase(),
  username: z.string().min(3).toLowerCase(),
  email: z.string().email().toLowerCase(),
  phoneNumber: z.string().min(10).max(15),
  gender: z.enum(["male", "female", "other"]),
  departmentId: z.number().int().positive().min(1).max(7),
  // designation: z.enum(["professor", "assistantProfessor"]),
  qualification: z.string().min(2),
  dateOfBirth: z.coerce.date(),
  dateOfJoining: z.coerce.date(),
  aadharNumber: z.string().length(12),
  permanentAddress: z.string().min(5),
  // password: z.string().min(6),
});

export const CreateStudentSchema = z.object({
  firstName: z.string().min(2).toLowerCase(),
  lastName: z.string().min(2).toLowerCase(),
  fatherName: z.string().min(2).toLowerCase(),
  motherName: z.string().min(2).toLowerCase(),
  gender: z.enum(["male", "female", "other"]),
  rollNumber: z.string().length(13),
  email: z.string().email().toLowerCase(),
  phoneNumber: z.string().min(10).max(15),
  aadharNumber: z.string().length(12),
  dateOfBirth: z.coerce.date(),
  dateOfJoining: z.coerce.date(),
  presentSemester: z.number().int().positive().min(1).max(8),
  isHosteler: z.boolean(),
  departmentId: z.number().int().positive().min(1).max(7),
  permanentAddress: z.string().min(5),
  category: z.enum(["general", "obc", "sc", "st", "others"]),
});
