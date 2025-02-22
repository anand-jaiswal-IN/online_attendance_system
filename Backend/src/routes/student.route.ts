import express from "express";
import prisma from "../config/prisma";
import { ApiResponse } from "../helpers/ApiResponse";
import { isDateInRange, isoStringDateOnly } from "../helpers/functions";

const router = express.Router();

// get-all-subjects of particular student present semester and departmentId
router.get("/subjects", async (req, res): Promise<any> => {
  try {
    if (!req.query.departmentId || !req.query.semester) {
      return res.status(400).json(ApiResponse.error("Bad request", 400));
    }
    const subjects = await prisma.subject.findMany({
      where: {
        departmentId: parseInt(req.query.departmentId as string),
        semester: parseInt(req.query.semester as string),
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
  "/know-attendance-of-your-subjects",
  async (req, res): Promise<any> => {
    try {
      const { departmentId, semester, studentId } = req.query;

      // Validate request parameters
      if (!departmentId || !semester || !studentId) {
        return res.status(400).json(ApiResponse.error("Bad request", 400));
      }

      // Fetch subjects based on departmentId and semester
      const subjects = await prisma.subject.findMany({
        where: {
          departmentId: Number(departmentId),
          semester: Number(semester),
        },
        select: {
          id: true,
          name: true,
          subjectCode: true,
          departmentId: true,
          semester: true,
        },
      });

      if (req.query.startDate && req.query.endDate) {
        // Fetch attendance for each subject
        const responseSend = await Promise.all(
          subjects.map(async (subject) => {
            const attendanceBySubject = await prisma.attendance.findMany({
              where: {
                date: {
                  gte: new Date(req.query.startDate as string),
                  lte: new Date(req.query.endDate as string),
                },
                studentId: Number(studentId),
                assignedTeacher: {
                  subjectId: subject.id,
                },
              },
            });

            return { ...subject, attendance: attendanceBySubject };
          })
        );
        return res.status(200).json({
          success: true,
          message: "Attendance listed successfully",
          data: responseSend,
        });
      } else {
        const responseSend = await Promise.all(
          subjects.map(async (subject) => {
            const attendanceBySubject = await prisma.attendance.findMany({
              where: {
                studentId: Number(studentId),
                assignedTeacher: {
                  subjectId: subject.id,
                },
              },
            });
            return { ...subject, attendance: attendanceBySubject };
          })
        );
        return res.status(200).json({
          success: true,
          message: "Attendance listed successfully",
          data: responseSend,
        });
      }
    } catch (error) {
      console.error(error); // Log for debugging
      return res
        .status(500)
        .json(ApiResponse.error("Internal server error", 500));
    }
  }
);

export default router;
