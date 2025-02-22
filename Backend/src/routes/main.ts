import express, { Request, Response } from "express";
import app from "../server";

const mainRouter = express.Router();

// Routes
import { authRouter, headOfDepartmentRouter, teacherRouter } from "./index";
import {
  adminEmployeeRouter,
  adminStudentRouter,
  adminAuthRouter,
  adminSubjectRouter,
} from "./admin/index";

import { verifyToken, checkRole } from "../middlewares/auth.middleware";

// Basic route

mainRouter.use("/admin/auth", adminAuthRouter);
mainRouter.use("/admin/employee", adminEmployeeRouter);
mainRouter.use("/admin/student", adminStudentRouter);
mainRouter.use("/admin/subject", adminSubjectRouter);

mainRouter.use("/auth", authRouter);

mainRouter.use(
  "/headOfDepartment",
  verifyToken,
  checkRole(["headOfDepartment"]),
  headOfDepartmentRouter
);

mainRouter.use("/teacher", verifyToken, checkRole(["teacher"]), teacherRouter);

export default mainRouter;
