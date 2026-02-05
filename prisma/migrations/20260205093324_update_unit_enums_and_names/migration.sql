/*
  Warnings:

  - You are about to drop the column `sale_amount_at_purchase` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `sale_unit_at_purchase` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `weightUnit` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `sale_amount` on the `purchase_options` table. All the data in the column will be lost.
  - You are about to drop the column `sale_unit` on the `purchase_options` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `recipe_ingredients` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `shopping_list_item_sources` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `shopping_list_items` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[shopping_list_id,product_id,recipe_unit]` on the table `shopping_list_items` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `pricing_amount_at_purchase` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pricing_unit_at_purchase` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Made the column `goods_count` on table `order_items` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `recipe_unit` on the `products` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `pricing_amount` to the `purchase_options` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pricing_unit` to the `purchase_options` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipe_unit` to the `recipe_ingredients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipe_unit` to the `shopping_list_item_sources` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipe_unit` to the `shopping_list_items` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RecipeUnit" AS ENUM ('GRAM', 'KILOGRAM', 'MILLILITER', 'LITER', 'TEASPOON', 'TABLESPOON', 'PIECE', 'CLOVES', 'SLICE', 'PINCH');

-- CreateEnum
CREATE TYPE "SaleUnit" AS ENUM ('GRAM', 'KILOGRAM', 'MILLILITER', 'LITER', 'PIECE');

-- DropIndex
DROP INDEX "shopping_list_items_shopping_list_id_product_id_unit_key";

-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "sale_amount_at_purchase",
DROP COLUMN "sale_unit_at_purchase",
DROP COLUMN "weight",
DROP COLUMN "weightUnit",
ADD COLUMN     "pricing_amount_at_purchase" DECIMAL(10,3) NOT NULL,
ADD COLUMN     "pricing_unit_at_purchase" "SaleUnit" NOT NULL,
ALTER COLUMN "goods_count" SET NOT NULL,
ALTER COLUMN "goods_count" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "products" DROP COLUMN "recipe_unit",
ADD COLUMN     "recipe_unit" "RecipeUnit" NOT NULL;

-- AlterTable
ALTER TABLE "purchase_options" DROP COLUMN "sale_amount",
DROP COLUMN "sale_unit",
ADD COLUMN     "pricing_amount" DECIMAL(10,3) NOT NULL,
ADD COLUMN     "pricing_unit" "SaleUnit" NOT NULL;

-- AlterTable
ALTER TABLE "recipe_ingredients" DROP COLUMN "unit",
ADD COLUMN     "recipe_unit" "RecipeUnit" NOT NULL;

-- AlterTable
ALTER TABLE "shopping_list_item_sources" DROP COLUMN "unit",
ADD COLUMN     "recipe_unit" "RecipeUnit" NOT NULL;

-- AlterTable
ALTER TABLE "shopping_list_items" DROP COLUMN "unit",
ADD COLUMN     "recipe_unit" "RecipeUnit" NOT NULL;

-- DropEnum
DROP TYPE "Unit";

-- CreateIndex
CREATE UNIQUE INDEX "shopping_list_items_shopping_list_id_product_id_recipe_unit_key" ON "shopping_list_items"("shopping_list_id", "product_id", "recipe_unit");
