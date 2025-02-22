import express from "express";
import prisma from "../config/prisma";
import { ApiResponse } from "../helpers/ApiResponse";
import { isoStringDateOnly, isWithinTimeRange } from "../helpers/functions";

const router = express.Router();

router.get("/assigned-subjects", async (req, res): Promise<any> => {
  try {
    const subjects = await prisma.assignedTeacher.findMany({
      where: {
        teacher: {
          id: parseInt(req.query.teacherId as string),
        },
      },
      include: {
        subject: {
          select: {
            name: true,
            subjectCode: true,
            departmentId: true,
            department: {
              select: {
                name: true,
                abbrev: true,
              },
            },
          },
        },
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

router.get("/get-students", async (req, res): Promise<any> => {
  try {
    const students = await prisma.student.findMany({
      where: {
        departmentId: parseInt(req.query.departmentId as string),
        presentSemester: parseInt(req.query.presentSemester as string),
      },
      select: {
        id: true,
        rollNumber: true,
        firstName: true,
        lastName: true,
        gender: true,
        email: true,
      },
    });
    return res
      .status(200)
      .json(ApiResponse.success(students, "Students listed sucessfully", 200));
  } catch (error) {
    return res
      .status(500)
      .json(ApiResponse.error("Internal server error", 500));
  }
});

router.post("/submit-attendances", async (req, res): Promise<any> => {
  try {
    if (
      !req.body.date ||
      !req.body.assignedTeacherId ||
      !req.body.attendances ||
      req.body.attendances.length <= 0
    ) {
      return res.status(400).json(ApiResponse.error("Invalid request", 400));
    }

    const attendances = req.body.attendances;

    if (attendances.length <= 0) {
      return res
        .status(400)
        .json(ApiResponse.error("Invalid attendances", 400));
    }

    if (
      await prisma.attendanceDoneDate.findFirst({
        where: {
          date: isoStringDateOnly(req.body.date),
          assignedTeacherId: parseInt(req.body.assignedTeacherId),
        },
      })
    ) {
      return res
        .status(400)
        .json(ApiResponse.error("Attendance already done", 400));
    }

    // create attendance done by date
    await prisma.attendanceDoneDate.create({
      data: {
        date: isoStringDateOnly(req.body.date),
        assignedTeacherId: parseInt(req.body.assignedTeacherId),
        isAttendanceDone: true,
      },
    });

    // Process all attendance entries concurrently
    await Promise.all(
      attendances.map(async (attendance: any) => {
        if (
          !attendance.date ||
          attendance.isPresent === undefined || // Fix: Handle false as valid
          !attendance.assignedTeacherId ||
          !attendance.studentId
        ) {
          throw new Error("Invalid attendances");
        }

        // Checking assigned teacher
        const assignedTeacher = await prisma.assignedTeacher.findUnique({
          where: { id: parseInt(attendance.assignedTeacherId) },
        });
        if (!assignedTeacher) {
          throw new Error("Invalid teacher");
        }
        if (
          !isWithinTimeRange(assignedTeacher.startTime, assignedTeacher.endTime)
        ) {
          throw new Error("Invalid date time");
        }

        // Checking student
        const student = await prisma.student.findUnique({
          where: { id: parseInt(attendance.studentId) },
        });
        if (!student) {
          throw new Error("Invalid student");
        }

        // Insert attendance record
        await prisma.attendance.create({
          data: {
            date: attendance.date,
            studentId: parseInt(attendance.studentId),
            assignedTeacherId: parseInt(attendance.assignedTeacherId),
            isPresent: attendance.isPresent,
          },
        });
      })
    );
    return res
      .status(200)
      .json(ApiResponse.success({}, "Attendance is taken successfully", 200));
  } catch (error: any) {
    console.log(error);
    return res
      .status(500)
      .json(ApiResponse.error(error.message || "Internal server error", 500));
  }
});

export default router;
