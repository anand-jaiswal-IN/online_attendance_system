/*
  Warnings:

  - Added the required column `isAttendanceDone` to the `AttendanceDoneDate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AttendanceDoneDate" ADD COLUMN     "isAttendanceDone" BOOLEAN NOT NULL;
