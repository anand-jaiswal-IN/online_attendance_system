import express from "express";
import prisma from "../config/prisma";
import { ApiResponse } from "../helpers/ApiResponse";
import { CreateAssignedTeacherSchema } from "../validations/assignedTeacher.validation";

const router = express.Router();

router.get("/get-all-teachers", async (req, res): Promise<any> => {
  try {
    const teachers = await prisma.employee.findMany({
      where: {
        role: "teacher",
        departmentId: parseInt(req.query.departmentId as string) || undefined,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        designation: true,
        departmentId: true,
        department: {
          select: {
            name: true,
            abbrev: true,
          },
        },
      },
    });

    return res
      .status(200)
      .json(ApiResponse.success(teachers, "Teachers list", 200));
  } catch (error) {
    return res
      .status(500)
      .json(ApiResponse.error("Internal server error", 500));
  }
});

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

// create database row for assigned teacher
router.post("/assign-teacher", async (req, res): Promise<any> => {
  try {
    const validatedData = CreateAssignedTeacherSchema.parse(req.body);

    if (validatedData instanceof Error) {
      return res
        .status(400)
        .json(ApiResponse.error(validatedData.message, 400));
    }

    // checking if the subject is belongs to the department and assigned by correct headOfDepartment
    if (
      !(await prisma.subject.findUnique({
        where: {
          id: validatedData.subjectId,
          departmentId: validatedData.departmentId,
        },
      }))
    ) {
      return res
        .status(400)
        .json(
          ApiResponse.error("Subject does not belong to the department", 400)
        );
    }

    await prisma.assignedTeacher.create({
      data: {
        subjectId: validatedData.subjectId,
        teacherId: validatedData.teacherId,
        semester: validatedData.semester,
        startTime: validatedData.startTime,
        endTime: validatedData.endTime,
      },
    });
    return res
      .status(200)
      .json(ApiResponse.success({}, "Teachers assigned successfully", 200));
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json(ApiResponse.error("Internal server error : " + error, 500));
  }
});

// Get all assigned subjects and teachers -> departmentId (required)
router.get("/assigned-subjects", async (req, res): Promise<any> => {
  try {
    const assignedTeachers = await prisma.assignedTeacher.findMany({
      where: {
        subject: {
          departmentId: parseInt(req.query.departmentId as string),
          semester: parseInt(req.query.semester as string) || undefined,
        },
      },
      include: {
        subject: {
          select: {
            name: true,
            subjectCode: true,
            semester: true,
            departmentId: true,
            department: {
              select: {
                name: true,
                abbrev: true,
              },
            },
          },
        },
        teacher: {
          select: {
            firstName: true,
            lastName: true,
            username: true,
            designation: true,
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
      .json(ApiResponse.success(assignedTeachers, "Teachers assigned", 200));
  } catch (error) {
    return res
      .status(500)
      .json(ApiResponse.error("Internal server error", 500));
  }
});

router.delete("/assigned-subjects/:id", async (req, res): Promise<any> => {
  try {
    await prisma.assignedTeacher.delete({
      where: {
        id: parseInt(req.params.id),
        subject: {
          departmentId: parseInt(req.body.departmentId),
        },
      },
    });
    return res
      .status(200)
      .json(ApiResponse.success({}, "Assigned teacher deleted", 200));
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json(ApiResponse.error("Internal server error", 500));
  }
});

router.get("/semesterSubjects", async (req, res): Promise<any> => {
  try {
    // Step 1: Fetch subjects based on departmentId and semester
    const subjects = await prisma.subject.findMany({
      where: {
        departmentId: parseInt(req.query.departmentId as string),
        semester: parseInt(req.query.semester as string),
      },
      omit: {
        description: true,
      },
    });
    // Step 2: Map subjects to include assigned teacher details
    const subjectsWithAssignedTeachers = await Promise.all(
      subjects.map(async (subject) => {
        const assignedTeacher = await prisma.assignedTeacher.findUnique({
          where: {
            subjectId: subject.id,
          },
          include: {
            teacher: {
              select: {
                firstName: true,
                lastName: true,
                username: true,
                designation: true,
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

        return {
          ...subject,
          isAssigned: !!assignedTeacher,
          assignedSubject: assignedTeacher || null,
        };
      })
    );

    // Step 3: Send the response
    return res
      .status(200)
      .json(
        ApiResponse.success(
          subjectsWithAssignedTeachers,
          "Subjects listed successfully",
          200
        )
      );
  } catch (error) {
    console.error("Error fetching semester subjects:", error);
    return res
      .status(500)
      .json(ApiResponse.error("Internal server error", 500));
  }
});

export default router;
