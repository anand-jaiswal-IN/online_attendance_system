import express from "express";
import prisma from "../config/prisma";
import { ApiResponse } from "../helpers/ApiResponse";
import { isDateInRange, isoStringDateOnly } from "../helpers/functions";

const router = express.Router();

// get-all-subjects of particular student present semester and departmentId
router.get("/get-all-subjects", async (req, res): Promise<any> => {
  try {
    const subjects = await prisma.subject.findMany({
      where: {
        departmentId: parseInt(req.query.departmentId as string) || undefined,
        semester: parseInt(req.query.semester as string) || undefined,
      },
      omit: {
        description: true,
      },
    });
    return res
      .status(200)
      .json(ApiResponse.success(subjects, "Subjects listed sucessfully", 200));
  } catch (error) {
    return res
      .status(500)
      .json(ApiResponse.error("Internal server error", 500));
  }
});

// get attendance by subject from startDate to endDate
router.get(
  "/know-attendance/subject/:subjectId",
  async (req, res): Promise<any> => {
    // if (!req.query.startDate || !req.query.endDate) {
    //   return res.status(400).json(ApiResponse.error("Bad request", 400));
    // }

    try {
      const attendanceBySubject = await prisma.attendance.findMany({
        where: {
          studentId: parseInt(req.query.studentId as string),
          assignedTeacher: {
            subjectId: parseInt(req.params.subjectId as string),
          },
        },
      });

      return res.status(200).json({
        success: true,
        message: "Attendance listed successfully",
        data: attendanceBySubject,
      });
    } catch (error) {
      return res
        .status(500)
        .json(ApiResponse.error("Internal server error", 500));
    }
  }
);

export default router;
