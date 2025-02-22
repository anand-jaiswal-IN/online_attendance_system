import "../types/express";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import prisma from "../config/prisma";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: Function
): Promise<any> => {
  try {
    const token = req.cookies.token;

    if (!token) throw new Error("No token provided");

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
      typeOfUser: "admin";
      username: string;
    };

    const adminUser = await prisma.adminUser.findUnique({
      where: {
        id: decoded.id,
        username: decoded.username,
      },
    });
    if (!adminUser) throw new Error("Admin user not found");
    req.user = {
      id: decoded.id,
      username: decoded.username,
      typeOfUser: decoded.typeOfUser,
    };
    next();
  } catch (error) {
    res.clearCookie("token");
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
