import { Request } from "express";

interface User {
  id: number;
  typeOfUser: "teacher" | "headOfDepartment" | "student" | "admin";
  username: string; // username for teacher / headOfDepartment, rollNumber for student
}

declare module "express-serve-static-core" {
  interface Request {
    user?: User;
  }
}
