import express from "express";
import { Request, Response } from "express";
import prisma from "../../config/prisma";
import { ApiResponse } from "../../helpers/ApiResponse";
import { CreateStudentSchema } from "../../validations/employee.validation";
import { generatePassword } from "../../helpers/functions";
import { sendPasswordToEmail } from "../../helpers/sendmail";
import { hashSync, genSaltSync } from "bcrypt";
import { z } from "zod";

const router = express.Router();

// Create a new student
router.post("/create", async (req: Request, res: Response): Promise<any> => {
  try {
    //cheking the uniqueness of rollnumber, email and phonenumber
    const oldStudent = await prisma.student.findFirst({
      where: {
        OR: [
          { rollNumber: req.body.rollNumber },
          { email: req.body.email },
          { phoneNumber: req.body.phoneNumber },
        ],
      },
    });

    if (oldStudent) {
      return res
        .status(400)
        .json(
          ApiResponse.error(
            "Roll number, email or phone number already exists",
            400
          )
        );
    }
    const validatedData = CreateStudentSchema.parse(req.body);

    // If validatedData is correct, proceed to create the student
    if (!validatedData) {
      return res.status(400).json(ApiResponse.error("Invalid data", 400));
    }

    // put a strong password and send to email
    const password = generatePassword();

    // Send the password to the student's email
    sendPasswordToEmail(
      validatedData.rollNumber,
      validatedData.email,
      password
    );

    // Hash the password before storing it in the database
    const hashedPassword = hashSync(password, genSaltSync(10));

    // Create student with validated data
    const student = await prisma.student.create({
      data: {
        ...validatedData,
        isVerified: true,
        password: hashedPassword,
        temporaryAddress: req.body.temporaryAddress || null,
      },
      omit: {
        password: true,
      },
    });
    return res
      .status(201)
      .json(
        ApiResponse.success(
          student,
          `Student created of roll number ${validatedData.rollNumber}`,
          201
        )
      );
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors
      return res.status(400).json({
        errors: error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        })),
      });
    }

    // Handle other errors
    res.status(500).json({ error: "Internal server error " });
    console.log(error);
  }
});

// List students with a limit of 10
router.get("/list", async (req: Request, res: Response): Promise<any> => {
  try {
    const { page = 1 } = req.query;
    const students = await prisma.student.findMany({
      skip: (Number(page) - 1) * 10,
      take: 10,
      select: {
        firstName: true,
        lastName: true,
        rollNumber: true,
        email: true,
        presentSemester: true,
        isHosteler: true,
        category: true,
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
      .json(
        ApiResponse.success(students, "Students retrieved successfully", 200)
      );
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log(error);
  }
});

// Get a student by roll number
router.get(
  "/get/:rollNumber",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const student = await prisma.student.findFirst({
        where: {
          rollNumber: req.params.rollNumber,
        },
        omit: {
          password: true,
        },
      });
      if (!student) {
        return res
          .status(404)
          .json(ApiResponse.error("Student not found", 404));
      }
      return res
        .status(200)
        .json(
          ApiResponse.success(student, "Student retrieved successfully", 200)
        );
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
      console.log(error);
    }
  }
);

// Update a student by rollNumber
router.put(
  "/update/:rollNumber",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const student = await prisma.student.findUnique({
        where: {
          rollNumber: req.params.rollNumber,
        },
      });
      if (!student) {
        return res
          .status(404)
          .json(ApiResponse.error("Student not found", 404));
      }
      const updatedStudent = await prisma.student.update({
        where: {
          rollNumber: req.params.rollNumber,
        },
        data: req.body,
      });
      return res
        .status(200)
        .json(
          ApiResponse.success(
            updatedStudent,
            "Student updated successfully",
            200
          )
        );
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
      console.log(error);
    }
  }
);

// Delete a student by rollNumber
router.delete(
  "/delete/:rlNum",
  async (req: Request, res: Response): Promise<any> => {
    const student = await prisma.student.findUnique({
      where: {
        rollNumber: req.params.rlNum,
      },
    });
    if (!student) {
      return res.status(404).json(ApiResponse.error("Student not found", 404));
    }

    await prisma.student
      .delete({
        where: {
          rollNumber: req.params.rlNum,
        },
      })
      .then(() => {
        res.status(200).json(ApiResponse.success({}, "Student deleted", 200));
      })
      .catch((error) => {
        res.status(500).json({ error: "Internal server error" });
        console.log(error);
      });
  }
);

export default router;
