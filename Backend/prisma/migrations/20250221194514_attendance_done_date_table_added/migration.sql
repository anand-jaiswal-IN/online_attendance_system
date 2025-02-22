-- CreateTable
CREATE TABLE "AttendanceDoneDate" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "assignedTeacherId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AttendanceDoneDate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AttendanceDoneDate" ADD CONSTRAINT "AttendanceDoneDate_assignedTeacherId_fkey" FOREIGN KEY ("assignedTeacherId") REFERENCES "AssignedTeacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
