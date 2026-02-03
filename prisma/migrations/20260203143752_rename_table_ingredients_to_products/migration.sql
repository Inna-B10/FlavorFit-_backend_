/*
  Warnings:

  - You are about to drop the column `ingredient_id` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `ingredient_id` on the `recipe_ingredients` table. All the data in the column will be lost.
  - You are about to drop the `ingredients` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[recipe_id,product_id]` on the table `recipe_ingredients` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `product_id` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_id` to the `recipe_ingredients` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_ingredient_id_fkey";

-- DropForeignKey
ALTER TABLE "recipe_ingredients" DROP CONSTRAINT "recipe_ingredients_ingredient_id_fkey";

-- DropIndex
DROP INDEX "recipe_ingredients_recipe_id_ingredient_id_key";

-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "ingredient_id",
ADD COLUMN     "product_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "recipe_ingredients" DROP COLUMN "ingredient_id",
ADD COLUMN     "product_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "ingredients";

-- CreateTable
CREATE TABLE "products" (
    "product_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon_url" TEXT,
    "default_unit" "Unit" NOT NULL,
    "sale_unit" "SaleUnit" NOT NULL,
    "sale_quantity" DECIMAL(65,30) NOT NULL,
    "sale_base_unit" "Unit" NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("product_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "recipe_ingredients_recipe_id_product_id_key" ON "recipe_ingredients"("recipe_id", "product_id");

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "recipe_ingredients_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;
