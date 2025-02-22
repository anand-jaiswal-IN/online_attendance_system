import express from "express";
import prisma from "../../config/prisma";
import { z } from "zod";
import { ApiResponse } from "../../helpers/ApiResponse";
import { CreateSubjectSchema } from "../../validations/subject.validation";

const router = express.Router();

// Create a new subject
router.post("/create", async (req, res): Promise<any> => {
  try {
    // Validate the request body
    const validatedData = CreateSubjectSchema.parse(req.body);
    if (!validatedData) {
      return res
        .status(400)
        .json(ApiResponse.error("Invalid data, add fields are required", 400));
    }

    //cheking the uniqueness of subject code
    const subject = await prisma.subject.findUnique({
      where: {
        subjectCode: req.body.subjectCode,
      },
    });
    if (subject) {
      return res
        .status(400)
        .json(ApiResponse.error("Subject code already exists", 400));
    }
    const newSubject = await prisma.subject.create({
      data: {
        name: req.body.name,
        description: req.body.description,
        subjectCode: req.body.subjectCode,
        department: req.body.department,
        departmentId: req.body.departmentId,
        semester: parseInt(req.body.semester),
      },
      include: {
        department: {
          select: {
            name: true,
            abbrev: true,
          },
        },
      },
    });
    res
      .status(201)
      .json(
        ApiResponse.success(newSubject, "Subject created successfully", 201)
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

// List all subjects
router.get("/list", async (req, res) => {
  try {
    const subjects = await prisma.subject.findMany({
      include: {
        department: {
          select: {
            name: true,
            abbrev: true,
          },
        },
      },
    });
    res
      .status(200)
      .json(ApiResponse.success(subjects, "Subjects listed sucessfully", 200));
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log(error);
  }
});

// Get a subject by id
router.get("/get/:id", async (req, res): Promise<any> => {
  try {
    const subject = await prisma.subject.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
      include: {
        department: {
          select: {
            name: true,
            abbrev: true,
          },
        },
      },
    });
    if (!subject) {
      return res.status(404).json(ApiResponse.error("Subject not found", 404));
    }
    res
      .status(200)
      .json(ApiResponse.success(subject, "Subject found successfully", 200));
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log(error);
  }
});

// Delete a subject by id
router.delete("/delete/:id", async (req, res): Promise<any> => {
  try {
    const subject = await prisma.subject.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });
    if (!subject) {
      return res.status(404).json(ApiResponse.error("Subject not found", 404));
    }
    await prisma.subject.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });
    res
      .status(200)
      .json(ApiResponse.success({}, "Subject deleted successfully", 200));
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log(error);
  }
});

// get all subjects by department
router.get("/list/department/:id", async (req, res): Promise<any> => {
  try {
    const subjects = await prisma.subject.findMany({
      where: {
        departmentId: parseInt(req.params.id),
      },
      include: {
        department: {
          select: {
            name: true,
            abbrev: true,
          },
        },
      },
    });
    if (subjects.length === 0) {
      return res.status(404).json(ApiResponse.error("Subjects not found", 404));
    }
    res
      .status(200)
      .json(ApiResponse.success(subjects, "Subjects listed sucessfully", 200));
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log(error);
  }
});

export default router;
