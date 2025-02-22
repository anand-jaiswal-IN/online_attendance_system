import express from "express";
import prisma from "../../config/prisma";
import { z } from "zod";
import { CreateEmployeeSchema } from "../../validations/employee.validation";
import { ApiResponse } from "../../helpers/ApiResponse";
import { generatePassword } from "../../helpers/functions";

import { hashSync, genSaltSync } from "bcrypt";
import { sendPasswordToEmail } from "../../helpers/sendmail";

const router = express.Router();

// Create a new employee ->     /create/headOfDepartment , /create/teacher
router.post("/create/:role", async (req, res): Promise<any> => {
  try {
    //cheking the uniqueness of username, email and phonenumber
    const oldEmployee = await prisma.employee.findFirst({
      where: {
        OR: [
          { username: req.body.username },
          { email: req.body.email },
          { phoneNumber: req.body.phoneNumber },
        ],
      },
    });

    if (oldEmployee) {
      return res
        .status(400)
        .json(
          ApiResponse.error(
            "Username, email or phone number already exists",
            400
          )
        );
    }
    const validatedData = CreateEmployeeSchema.parse(req.body);

    // If validatedData is correct, proceed to create the HOD
    if (!validatedData) {
      return res.status(400).json(ApiResponse.error("Invalid data", 400));
    }

    // put a strong password and send to email
    const password = generatePassword();

    // Send the password to the HOD's email
    sendPasswordToEmail(validatedData.username, validatedData.email, password);

    // Hash the password before storing it in the database
    const hashedPassword = hashSync(password, genSaltSync(10));

    if (
      req.params.role !== "headOfDepartment" &&
      req.params.role !== "teacher"
    ) {
      return res.status(400).json(ApiResponse.error("Invalid role", 400));
    }

    // Create employee with validated data
    const employee = await prisma.employee.create({
      data: {
        ...validatedData,
        role: req.params.role,
        isVerified: true,
        temporaryAddress: req.body.temporaryAddress || null,
        designation: req.body.designation || null,
        password: hashedPassword,
      },
      omit: {
        password: true,
      },
    });
    return res
      .status(201)
      .json(
        ApiResponse.success(
          employee,
          `Teacher created of username ${validatedData.username}`,
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

// List all employees -> /list/headOfDepartments , /list/teachers
router.get("/list/:role", async (req, res): Promise<any> => {
  if (req.params.role !== "headOfDepartment" && req.params.role !== "teacher") {
    return res.status(400).json(ApiResponse.error("Invalid role", 400));
  }
  try {
    const teachers = await prisma.employee.findMany({
      where: { role: req.params.role },
      select: {
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        designation: true,
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
    res.status(500).json({ error: "Internal server error" });
    console.log(error);
  }
});

// Get employee by id -> /get/headOfDepartment/:username , /get/teacher/:username
router.get("/get/:role/:username", async (req, res): Promise<any> => {
  if (req.params.role !== "headOfDepartment" && req.params.role !== "teacher") {
    return res.status(400).json(ApiResponse.error("Invalid role", 400));
  }
  try {
    const employee = await prisma.employee.findUnique({
      where: {
        role: req.params.role,
        username: req.params.username,
      },
      include: {
        department: {
          select: {
            name: true,
            abbrev: true,
          },
        },
      },
      omit: {
        password: true,
      },
    });

    if (!employee) {
      return res.status(404).json(ApiResponse.error("Employee not found", 404));
    }

    return res
      .status(200)
      .json(ApiResponse.success(employee, "Employee found", 200));
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log(error);
  }
});

// Update employee by username -> /update/headOfDepartment/:username , /update/teacher/:username
router.put("/update/:role/:username", async (req, res): Promise<any> => {
  if (req.params.role !== "headOfDepartment" && req.params.role !== "teacher") {
    return res.status(400).json(ApiResponse.error("Invalid role", 400));
  }
  try {
    const employee = await prisma.employee.findUnique({
      where: {
        role: req.params.role,
        username: req.params.username,
      },
    });

    if (!employee) {
      return res.status(404).json(ApiResponse.error("Employee not found", 404));
    }

    const updatedEmployee = await prisma.employee.update({
      where: {
        role: req.params.role,
        username: req.params.username,
      },
      data: req.body,
    });

    return res
      .status(200)
      .json(
        ApiResponse.success(
          updatedEmployee,
          "Employee updated successfully",
          200
        )
      );
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log(error);
  }
});

// Delete employee by username -> /delete/headOfDepartment/:username , /delete/teacher/:username
router.delete("/delete/:role/:username", async (req, res): Promise<any> => {
  if (req.params.role !== "headOfDepartment" && req.params.role !== "teacher") {
    return res.status(400).json(ApiResponse.error("Invalid role", 400));
  }
  try {
    const employee = await prisma.employee.findUnique({
      where: {
        role: req.params.role,
        username: req.params.username,
      },
    });

    if (!employee) {
      return res.status(404).json(ApiResponse.error("Employee not found", 404));
    }

    await prisma.employee.delete({
      where: {
        role: req.params.role,
        username: req.params.username,
      },
    });

    return res
      .status(200)
      .json(ApiResponse.success({}, "Employee deleted successfully", 200));
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log(error);
  }
});

// Get all teachers of a department -> /getTeachers/:departmentId
router.get("/getTeachers/:departmentId", async (req, res): Promise<any> => {
  try {
    const teachers = await prisma.employee.findMany({
      where: {
        departmentId: parseInt(req.params.departmentId),
        role: "teacher",
      },
      select: {
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        designation: true,
        qualification: true,
      },
    });

    return res
      .status(200)
      .json(ApiResponse.success(teachers, "Teachers list", 200));
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log(error);
  }
});

export default router;
