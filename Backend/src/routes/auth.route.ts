import express, { Request, Response } from "express";
import { compareSync } from "bcrypt";
import { ApiResponse } from "../helpers/ApiResponse";
import prisma from "../config/prisma";
import jwt from "jsonwebtoken";

const router = express.Router();

// Login route
// typeOfUser = "teacher" | "headOfDepartment" | "student";
// username = rollNumber for student | username for employee;
router.post("/login", async (req: Request, res: Response): Promise<any> => {
  try {
    // In case of teacher / headOfDepartment -> username is unique, In case of student -> rollNumber is unique
    const { username, password, typeOfUser } = req.body;
    if (!username || !password || !typeOfUser) {
      return res
        .status(400)
        .json(
          ApiResponse.error(
            "Invalid request. username, password and typeOfUser is required",
            400
          )
        );
    }
    let user, token;
    if (typeOfUser === "teacher") {
      user = await prisma.employee.findUnique({
        where: {
          username: username,
          role: "teacher",
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
      if (!user) {
        return res
          .status(401)
          .json(ApiResponse.error("Invalid credentials", 401));
      }
      if (!compareSync(password, user.password)) {
        return res
          .status(401)
          .json(ApiResponse.error("Invalid credentials", 401));
      }

      token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          typeOfUser: typeOfUser,
        },
        process.env.JWT_SECRET!,
        {
          expiresIn: (process.env.JWT_EXPIRY || "1d") as unknown as number,
        }
      );

      return res
        .status(200)
        .json(ApiResponse.success({ token }, "Logged in successfully", 200));
    } else if (typeOfUser === "headOfDepartment") {
      user = await prisma.employee.findUnique({
        where: {
          username: username,
          role: "headOfDepartment",
        },
      });
      if (!user) {
        return res
          .status(401)
          .json(ApiResponse.error("Invalid credentials", 401));
      }

      if (!compareSync(password, user.password)) {
        return res
          .status(401)
          .json(ApiResponse.error("Invalid credentials", 401));
      }

      token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          typeOfUser: typeOfUser,
        },
        process.env.JWT_SECRET!,
        {
          expiresIn: (process.env.JWT_EXPIRY || "1d") as unknown as number,
        }
      );

      return res
        .status(200)
        .json(ApiResponse.success({ token }, "Logged in successfully", 200));
    } else if (typeOfUser === "student") {
      user = await prisma.student.findUnique({
        where: { rollNumber: username },
      });
      if (!user) {
        return res
          .status(401)
          .json(ApiResponse.error("Invalid credentials", 401));
      }

      if (!compareSync(password, user.password)) {
        return res
          .status(401)
          .json(ApiResponse.error("Invalid credentials", 401));
      }

      token = jwt.sign(
        {
          id: user.id,
          username: user.rollNumber,
          typeOfUser: typeOfUser,
        },
        process.env.JWT_SECRET!,
        {
          expiresIn: (process.env.JWT_EXPIRY || "1d") as unknown as number,
        }
      );

      return res
        .status(200)
        .json(ApiResponse.success({ token }, "Logged in successfully", 200));
    } else {
      return res
        .status(401)
        .json(ApiResponse.error("Invalid credentials", 401));
    }
  } catch (error) {
    res.status(500).json(ApiResponse.error("Internal server error", 500));
    console.log("Login error:", error);
  }
});

// Logout route
router.post("/logout", async (req: Request, res: Response): Promise<any> => {
  res.clearCookie("token");
  res.status(200).json(ApiResponse.success({}, "Logged out successfully", 200));
});

// Get the authenticated user details
router.get("/me", async (req: Request, res: Response): Promise<any> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json(ApiResponse.error("Unauthorized", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
      typeOfUser: "teacher" | "headOfDepartment" | "student";
      username: string;
    };

    if (
      decoded.typeOfUser === "teacher" ||
      decoded.typeOfUser === "headOfDepartment"
    ) {
      const user = await prisma.employee.findUnique({
        where: { id: decoded.id, username: decoded.username },
        omit: { password: true },
        include: {
          department: {
            select: {
              name: true,
              abbrev: true,
            },
          },
        },
      });

      if (!user) {
        return res.status(404).json(ApiResponse.error("User not found", 404));
      }
      return res
        .status(200)
        .json(
          ApiResponse.success(
            { ...user, userType: decoded.typeOfUser },
            "User details",
            200
          )
        );
    } else if (decoded.typeOfUser === "student") {
      const user = await prisma.student.findUnique({
        where: { id: decoded.id, rollNumber: decoded.username },
        omit: { password: true },
        include: {
          department: {
            select: {
              name: true,
              abbrev: true,
            },
          },
        },
      });

      if (!user) {
        return res.status(404).json(ApiResponse.error("User not found", 404));
      }
      res.status(200).json(
        ApiResponse.success(
          {
            ...user,
            userType: decoded.typeOfUser,
            username: user.rollNumber,
          },
          "User details",
          200
        )
      );
    }
  } catch (error) {
    return res
      .status(401)
      .json(ApiResponse.error("Invalid or expired token", 401));
  }
});

export default router;
