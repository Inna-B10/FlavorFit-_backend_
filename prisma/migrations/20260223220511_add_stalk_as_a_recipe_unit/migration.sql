/*
  Warnings:

  - The values [CUP] on the enum `RecipeUnit` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RecipeUnit_new" AS ENUM ('GRAM', 'KILOGRAM', 'MILLILITER', 'LITER', 'TEASPOON', 'TABLESPOON', 'PIECE', 'CLOVES', 'SLICE', 'PINCH', 'STALK');
ALTER TABLE "products" ALTER COLUMN "recipe_unit" TYPE "RecipeUnit_new" USING ("recipe_unit"::text::"RecipeUnit_new");
ALTER TABLE "ingredients" ALTER COLUMN "recipe_unit" TYPE "RecipeUnit_new" USING ("recipe_unit"::text::"RecipeUnit_new");
ALTER TABLE "shopping_list_items" ALTER COLUMN "recipe_unit" TYPE "RecipeUnit_new" USING ("recipe_unit"::text::"RecipeUnit_new");
ALTER TABLE "shopping_list_item_sources" ALTER COLUMN "recipe_unit" TYPE "RecipeUnit_new" USING ("recipe_unit"::text::"RecipeUnit_new");
ALTER TYPE "RecipeUnit" RENAME TO "RecipeUnit_old";
ALTER TYPE "RecipeUnit_new" RENAME TO "RecipeUnit";
DROP TYPE "public"."RecipeUnit_old";
COMMIT;
