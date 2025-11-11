/*
  Warnings:

  - You are about to drop the `_CategoryToExtraField` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `extra_fields` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CategoryToExtraField" DROP CONSTRAINT "_CategoryToExtraField_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToExtraField" DROP CONSTRAINT "_CategoryToExtraField_B_fkey";

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "extra_fields" JSONB;

-- AlterTable
ALTER TABLE "occurrences" ADD COLUMN     "extra_fields" JSONB;

-- DropTable
DROP TABLE "_CategoryToExtraField";

-- DropTable
DROP TABLE "extra_fields";
