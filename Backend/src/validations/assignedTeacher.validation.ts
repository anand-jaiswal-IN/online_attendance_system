import { z } from "zod";

// In your validation schema (e.g., headOfDepartment.schema.ts)
export const CreateAssignedTeacherSchema = z
  .object({
    subjectId: z.number().positive(),
    teacherId: z.number().positive(),
    semester: z.number().min(1).max(8),
    departmentId: z.number().int().positive().min(1).max(7),
    startTime: z
      .string()
      .regex(
        /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
        "Must be in HH:MM format (24-hour clock)"
      ),
    endTime: z
      .string()
      .regex(
        /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
        "Must be in HH:MM format (24-hour clock)"
      ),
  })
  .refine(
    (data) => {
      const startTime = new Date(`2000-01-01 ${data.startTime}`);
      const endTime = new Date(`2000-01-01 ${data.endTime}`);
      // endTime is atmost 2hrs after startTime
      return endTime.getTime() - startTime.getTime() <= 2 * 60 * 60 * 1000;
    },
    { message: "Start time must be before end time." }
  );
