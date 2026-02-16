/*
  Warnings:

  - You are about to drop the column `note` on the `ingredients` table. All the data in the column will be lost.
  - You are about to drop the column `note` on the `product_variants` table. All the data in the column will be lost.
  - You are about to drop the column `note` on the `shopping_list_item_sources` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ingredients" DROP COLUMN "note",
ADD COLUMN     "ingredient_note" TEXT;

-- AlterTable
ALTER TABLE "product_variants" DROP COLUMN "note",
ADD COLUMN     "variant_note" TEXT;

-- AlterTable
ALTER TABLE "shopping_list_item_sources" DROP COLUMN "note",
ADD COLUMN     "ingredient_note" TEXT;
