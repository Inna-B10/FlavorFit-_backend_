-- CreateEnum
CREATE TYPE "CulinaryForm" AS ENUM ('FRESH', 'FROZEN', 'SPICE_HERB_SEASONING', 'CANNED_JARRED', 'PASTE_SAUCE', 'DRIED', 'EXTRACT', 'OTHER');

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "culinary_form" "CulinaryForm",
ADD COLUMN     "family_id" TEXT,
ADD COLUMN     "search_terms" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "product_families" (
    "family_id" TEXT NOT NULL,
    "family_name" TEXT NOT NULL,

    CONSTRAINT "product_families_pkey" PRIMARY KEY ("family_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_families_family_name_key" ON "product_families"("family_name");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_family_id_fkey" FOREIGN KEY ("family_id") REFERENCES "product_families"("family_id") ON DELETE SET NULL ON UPDATE CASCADE;
