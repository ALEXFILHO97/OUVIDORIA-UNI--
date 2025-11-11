-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "extra_field" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "occurrences" ADD COLUMN     "typeId" INTEGER;

-- CreateTable
CREATE TABLE "types" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "extra_fields" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "extra_fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CategoryToExtraField" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToExtraField_AB_unique" ON "_CategoryToExtraField"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToExtraField_B_index" ON "_CategoryToExtraField"("B");

-- AddForeignKey
ALTER TABLE "occurrences" ADD CONSTRAINT "occurrences_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToExtraField" ADD CONSTRAINT "_CategoryToExtraField_A_fkey" FOREIGN KEY ("A") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToExtraField" ADD CONSTRAINT "_CategoryToExtraField_B_fkey" FOREIGN KEY ("B") REFERENCES "extra_fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;
