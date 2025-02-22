import express from "express";
import jwt from "jsonwebtoken";
import { compareSync } from "bcrypt";
import { Request, Response } from "express";
import prisma from "../../config/prisma";
import { ApiResponse } from "../../helpers/ApiResponse";
import { verifyToken } from "../../middlewares/authAdmin.middleware";
import { hashSync, genSaltSync } from "bcrypt";
import { CreateAdminUserSchema } from "../../validations/authAdmin.validation";

const router = express.Router();

// Register route
router.post(
  "/register",
  verifyToken,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const validatedData = CreateAdminUserSchema.parse(req.body);
      if (validatedData instanceof Error) {
        return res
          .status(400)
          .json(ApiResponse.error(validatedData.message, 400));
      }
      const adminUser = await prisma.adminUser.findUnique({
        where: {
          username: validatedData.username,
        },
      });
      if (adminUser) {
        return res
          .status(400)
          .json(ApiResponse.error("Username already exists"));
      }
      const hashedPassword = hashSync(validatedData.password, genSaltSync(10));
      const newAdminUser = await prisma.adminUser.create({
        data: {
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          username: validatedData.username,
          password: hashedPassword,
        },
        omit: {
          password: true,
        },
      });
      res
        .status(201)
        .json(
          ApiResponse.success(
            newAdminUser,
            "Admin user registered successfully",
            201
          )
        );
    } catch (error) {
      console.error(error);
      return res.status(500).json(ApiResponse.error("Internal Server Error"));
    }
  }
);

// Login route
router.post("/login", async (req: Request, res: Response): Promise<any> => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json(ApiResponse.error("Invalid username or password"));
    }
    const adminUser = await prisma.adminUser.findUnique({
      where: {
        username: username,
      },
    });
    if (!adminUser) {
      return res
        .status(401)
        .json(ApiResponse.error("Invalid username or password"));
    }

    const isPasswordValid = compareSync(password, adminUser.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json(ApiResponse.error("Invalid username or password"));
    }

    const token = jwt.sign(
      {
        id: adminUser.id,
        username: adminUser.username,
        typeOfUser: "admin",
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: (process.env.JWT_EXPIRY || "1d") as unknown as number,
      }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 8 * 60 * 60 * 1000, // 8 hours
      sameSite: "strict",
    });
    res
      .status(200)
      .json(ApiResponse.success({ token }, "Logged in successfully", 200));
  } catch (error) {
    console.error(error);
    return res.status(500).json(ApiResponse.error("Internal Server Error"));
  }
});

// Logout route
router.post("/logout", verifyToken, (req: Request, res: Response) => {
  res.clearCookie("token");
  res.status(200).json(ApiResponse.success({}, "Logged out successfully", 200));
});

export default router;
