/*
  Warnings:

  - The primary key for the `shopping_list_item_sources` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `recipe_ingredients_version_at_add` on the `shopping_list_item_sources` table. All the data in the column will be lost.
  - You are about to drop the column `shopping_list_item_id` on the `shopping_list_item_sources` table. All the data in the column will be lost.
  - You are about to drop the column `shopping_list_item_source_id` on the `shopping_list_item_sources` table. All the data in the column will be lost.
  - The primary key for the `shopping_list_items` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `shopping_list_id` on the `shopping_list_items` table. All the data in the column will be lost.
  - You are about to drop the column `shopping_list_item_id` on the `shopping_list_items` table. All the data in the column will be lost.
  - The primary key for the `shopping_list_recipes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `shopping_list_id` on the `shopping_list_recipes` table. All the data in the column will be lost.
  - You are about to drop the column `shopping_list_recipe_id` on the `shopping_list_recipes` table. All the data in the column will be lost.
  - The primary key for the `shopping_lists` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `shopping_list_id` on the `shopping_lists` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[list_item_id,recipe_id]` on the table `shopping_list_item_sources` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[list_id,product_id,recipe_unit]` on the table `shopping_list_items` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[list_id,recipe_id]` on the table `shopping_list_recipes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `list_item_id` to the `shopping_list_item_sources` table without a default value. This is not possible if the table is not empty.
  - The required column `list_item_source_id` was added to the `shopping_list_item_sources` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `list_id` to the `shopping_list_items` table without a default value. This is not possible if the table is not empty.
  - The required column `list_item_id` was added to the `shopping_list_items` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `list_id` to the `shopping_list_recipes` table without a default value. This is not possible if the table is not empty.
  - The required column `list_recipe_id` was added to the `shopping_list_recipes` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `list_id` was added to the `shopping_lists` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "cart_item_requirements" DROP CONSTRAINT "cart_item_requirements_shopping_list_item_id_fkey";

-- DropForeignKey
ALTER TABLE "shopping_list_item_sources" DROP CONSTRAINT "shopping_list_item_sources_shopping_list_item_id_fkey";

-- DropForeignKey
ALTER TABLE "shopping_list_items" DROP CONSTRAINT "shopping_list_items_shopping_list_id_fkey";

-- DropForeignKey
ALTER TABLE "shopping_list_recipes" DROP CONSTRAINT "shopping_list_recipes_shopping_list_id_fkey";

-- DropIndex
DROP INDEX "shopping_list_item_sources_shopping_list_item_id_recipe_id_key";

-- DropIndex
DROP INDEX "shopping_list_items_shopping_list_id_product_id_recipe_unit_key";

-- DropIndex
DROP INDEX "shopping_list_recipes_shopping_list_id_recipe_id_key";

-- AlterTable
ALTER TABLE "shopping_list_item_sources" DROP CONSTRAINT "shopping_list_item_sources_pkey",
DROP COLUMN "recipe_ingredients_version_at_add",
DROP COLUMN "shopping_list_item_id",
DROP COLUMN "shopping_list_item_source_id",
ADD COLUMN     "ingredients_version_used" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "list_item_id" TEXT NOT NULL,
ADD COLUMN     "list_item_source_id" TEXT NOT NULL,
ADD CONSTRAINT "shopping_list_item_sources_pkey" PRIMARY KEY ("list_item_source_id");

-- AlterTable
ALTER TABLE "shopping_list_items" DROP CONSTRAINT "shopping_list_items_pkey",
DROP COLUMN "shopping_list_id",
DROP COLUMN "shopping_list_item_id",
ADD COLUMN     "list_id" TEXT NOT NULL,
ADD COLUMN     "list_item_id" TEXT NOT NULL,
ADD CONSTRAINT "shopping_list_items_pkey" PRIMARY KEY ("list_item_id");

-- AlterTable
ALTER TABLE "shopping_list_recipes" DROP CONSTRAINT "shopping_list_recipes_pkey",
DROP COLUMN "shopping_list_id",
DROP COLUMN "shopping_list_recipe_id",
ADD COLUMN     "list_id" TEXT NOT NULL,
ADD COLUMN     "list_recipe_id" TEXT NOT NULL,
ADD CONSTRAINT "shopping_list_recipes_pkey" PRIMARY KEY ("list_recipe_id");

-- AlterTable
ALTER TABLE "shopping_lists" DROP CONSTRAINT "shopping_lists_pkey",
DROP COLUMN "shopping_list_id",
ADD COLUMN     "list_id" TEXT NOT NULL,
ADD CONSTRAINT "shopping_lists_pkey" PRIMARY KEY ("list_id");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_list_item_sources_list_item_id_recipe_id_key" ON "shopping_list_item_sources"("list_item_id", "recipe_id");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_list_items_list_id_product_id_recipe_unit_key" ON "shopping_list_items"("list_id", "product_id", "recipe_unit");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_list_recipes_list_id_recipe_id_key" ON "shopping_list_recipes"("list_id", "recipe_id");

-- AddForeignKey
ALTER TABLE "cart_item_requirements" ADD CONSTRAINT "cart_item_requirements_shopping_list_item_id_fkey" FOREIGN KEY ("shopping_list_item_id") REFERENCES "shopping_list_items"("list_item_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_list_items" ADD CONSTRAINT "shopping_list_items_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "shopping_lists"("list_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_list_item_sources" ADD CONSTRAINT "shopping_list_item_sources_list_item_id_fkey" FOREIGN KEY ("list_item_id") REFERENCES "shopping_list_items"("list_item_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_list_recipes" ADD CONSTRAINT "shopping_list_recipes_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "shopping_lists"("list_id") ON DELETE CASCADE ON UPDATE CASCADE;
