import "../types/express";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";
import { ApiResponse } from "../helpers/ApiResponse";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    // Get token from cookie
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) throw new Error("No token provided");

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
      typeOfUser: "teacher" | "headOfDepartment" | "student";
      username: string; // username for teacher/headOfDepartment, rollNumber for student
    };

    // Validate payload structure based on user type
    let user;
    if (["teacher", "headOfDepartment"].includes(decoded.typeOfUser)) {
      if (!decoded.username) throw new Error("Invalid token payload");
      user = await prisma.employee.findUnique({
        where: { id: decoded.id, username: decoded.username },
      });
    } else if (decoded.typeOfUser === "student") {
      if (!decoded.username) throw new Error("Invalid token payload");
      user = await prisma.student.findUnique({
        where: { id: decoded.id, rollNumber: decoded.username },
      });
    } else {
      throw new Error("Invalid user type");
    }

    if (!user) throw new Error("User not found");

    // Attach user to request
    req.user = {
      id: user.id,
      typeOfUser: decoded.typeOfUser,
      username: decoded.username,
    };

    next();
  } catch (error) {
    console.log(error);

    return res
      .status(401)
      .json(ApiResponse.error("Invalid or expired token", 401));
  }
};

// allowedRoles => ["teacher", "headOfDepartment", "student"]

export const checkRole = (allowedRoles: string[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      if (!req.user || !allowedRoles.includes(req.user.typeOfUser)) {
        return res.status(403).json(ApiResponse.error("Forbidden access", 403));
      }
      next();
    } catch (error) {
      return res
        .status(500)
        .json(ApiResponse.error("Internal server error", 500));
    }
  };
};
