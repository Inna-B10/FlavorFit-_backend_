/*
  Warnings:

  - Added the required column `updated_at` to the `shopping_list_item_sources` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `shopping_list_recipes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "recipes" ADD COLUMN     "ingredients_version" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "shopping_list_item_sources" ADD COLUMN     "recipe_ingredients_version_at_add" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "shopping_list_recipes" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
