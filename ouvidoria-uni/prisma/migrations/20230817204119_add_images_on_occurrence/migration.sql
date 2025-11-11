/*
  Warnings:

  - You are about to drop the `_ImageToOccurrence` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ImageToOccurrence" DROP CONSTRAINT "_ImageToOccurrence_A_fkey";

-- DropForeignKey
ALTER TABLE "_ImageToOccurrence" DROP CONSTRAINT "_ImageToOccurrence_B_fkey";

-- AlterTable
ALTER TABLE "occurrences" ADD COLUMN     "imageUrl" TEXT;

-- DropTable
DROP TABLE "_ImageToOccurrence";

-- CreateTable
CREATE TABLE "images_on_occurrence" (
    "occurrenceId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,

    CONSTRAINT "images_on_occurrence_pkey" PRIMARY KEY ("occurrenceId","imageUrl")
);

-- AddForeignKey
ALTER TABLE "occurrences" ADD CONSTRAINT "occurrences_imageUrl_fkey" FOREIGN KEY ("imageUrl") REFERENCES "images"("url") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images_on_occurrence" ADD CONSTRAINT "images_on_occurrence_occurrenceId_fkey" FOREIGN KEY ("occurrenceId") REFERENCES "occurrences"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images_on_occurrence" ADD CONSTRAINT "images_on_occurrence_imageUrl_fkey" FOREIGN KEY ("imageUrl") REFERENCES "images"("url") ON DELETE RESTRICT ON UPDATE CASCADE;
