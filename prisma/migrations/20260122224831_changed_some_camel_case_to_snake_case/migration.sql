/*
  Warnings:

  - You are about to drop the column `saleBaseUnit` on the `ingredients` table. All the data in the column will be lost.
  - You are about to drop the column `saleQuantity` on the `ingredients` table. All the data in the column will be lost.
  - You are about to drop the column `saleUnit` on the `ingredients` table. All the data in the column will be lost.
  - Added the required column `sale_base_unit` to the `ingredients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sale_quantity` to the `ingredients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sale_unit` to the `ingredients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ingredients" DROP COLUMN "saleBaseUnit",
DROP COLUMN "saleQuantity",
DROP COLUMN "saleUnit",
ADD COLUMN     "sale_base_unit" "Unit" NOT NULL,
ADD COLUMN     "sale_quantity" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "sale_unit" "SaleUnit" NOT NULL;
