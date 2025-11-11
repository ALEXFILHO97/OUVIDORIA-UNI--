-- DropForeignKey
ALTER TABLE "occurrences" DROP CONSTRAINT "occurrences_studentId_fkey";

-- AlterTable
ALTER TABLE "occurrences" ALTER COLUMN "studentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "occurrences" ADD CONSTRAINT "occurrences_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE SET NULL ON UPDATE CASCADE;
