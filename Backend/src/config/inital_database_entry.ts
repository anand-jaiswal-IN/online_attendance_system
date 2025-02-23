import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { hashSync, genSaltSync } from "bcrypt";

const prisma = new PrismaClient();

async function create_inital_department_entry() {
  const dummyDataPath = path.join(
    __dirname,
    "../../dummy_data/departments.json"
  );
  const departments = JSON.parse(fs.readFileSync(dummyDataPath, "utf-8"));
  for (const department of departments) {
    if (
      await prisma.department.findUnique({ where: { name: department.name } })
    )
      continue;
    await prisma.department.create({
      data: department,
    });
  }
}

async function create_inital_student_entry() {
  const dummyDataPath = path.join(__dirname, "../../dummy_data/students.json");
  const students = JSON.parse(fs.readFileSync(dummyDataPath, "utf-8"));
  for (const student of students) {
    if (
      await prisma.student.findUnique({
        where: { rollNumber: student.rollNumber },
      })
    )
      continue;

    const hashedPassword = hashSync(student.password, genSaltSync(10));
    await prisma.student.create({
      data: {
        ...student,
        password: hashedPassword,
        dateOfBirth: new Date(student.dateOfBirth),
        dateOfJoining: new Date(student.dateOfJoining),
      },
    });
  }
}

async function create_inital_employee_entry() {
  const dummyDataPath = path.join(__dirname, "../../dummy_data/employees.json");
  const employees = JSON.parse(fs.readFileSync(dummyDataPath, "utf-8"));
  for (const employee of employees) {
    if (
      await prisma.employee.findUnique({
        where: { username: employee.username },
      })
    )
      continue;

    const hashedPassword = hashSync(employee.password, genSaltSync(10));
    await prisma.employee.create({
      data: {
        ...employee,
        password: hashedPassword,
        dateOfBirth: new Date(employee.dateOfBirth),
        dateOfJoining: new Date(employee.dateOfJoining),
      },
    });
  }
}

async function create_initial_subject_entry() {
  const dummyDataPath = path.join(__dirname, "../../dummy_data/subjects.json");
  const subjects = JSON.parse(fs.readFileSync(dummyDataPath, "utf-8"));
  for (const subject of subjects) {
    if (
      await prisma.subject.findUnique({
        where: { subjectCode: subject.subjectCode },
      })
    )
      continue;
    await prisma.subject.create({
      data: subject,
    });
  }
}
export async function create_inital_database_entry() {
  // console.log("Creating initial database entry...");
  // console.log("Creating initial database entry of department...");
  // await create_inital_department_entry();
  // console.log("Done database entry of department...");
  // console.log("Creating initial database entry of student...");
  // await create_inital_student_entry();
  // console.log("Done database entry of student...");
  // console.log("Creating initial database entry of employee...");
  // await create_inital_employee_entry();
  // console.log("Done database entry of employee...");
  // console.log("Creating initial database entry of subject...");
  // await create_initial_subject_entry();
  // console.log("Creating initial database entry of subject...");
}
