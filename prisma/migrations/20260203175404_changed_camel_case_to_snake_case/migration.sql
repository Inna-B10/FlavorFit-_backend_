/*
  Warnings:

  - You are about to drop the column `priceAtPurchase` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `productNameAtPurchase` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `purchaseOptionId` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `saleBaseUnitAtPurchase` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `saleQuantityAtPurchase` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `recipeId` on the `shopping_list_item_sources` table. All the data in the column will be lost.
  - You are about to drop the column `shoppingListItemId` on the `shopping_list_item_sources` table. All the data in the column will be lost.
  - You are about to drop the column `isChecked` on the `shopping_list_items` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `shopping_list_items` table. All the data in the column will be lost.
  - You are about to drop the column `requiredAmount` on the `shopping_list_items` table. All the data in the column will be lost.
  - You are about to drop the column `shoppingListId` on the `shopping_list_items` table. All the data in the column will be lost.
  - You are about to drop the column `recipeId` on the `shopping_list_recipes` table. All the data in the column will be lost.
  - You are about to drop the column `shoppingListId` on the `shopping_list_recipes` table. All the data in the column will be lost.
  - You are about to drop the column `birthYear` on the `user_profiles` table. All the data in the column will be lost.
  - You are about to drop the `PurchaseOption` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[shopping_list_item_id,recipe_id]` on the table `shopping_list_item_sources` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[shopping_list_id,product_id,unit]` on the table `shopping_list_items` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[shopping_list_id,recipe_id]` on the table `shopping_list_recipes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `price_at_purchase` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_name_at_purchase` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purchase_option_id` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sale_quantity_at_purchase` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sale_unit_at_purchase` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipe_id` to the `shopping_list_item_sources` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shopping_list_item_id` to the `shopping_list_item_sources` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_id` to the `shopping_list_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `required_amount` to the `shopping_list_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shopping_list_id` to the `shopping_list_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipe_id` to the `shopping_list_recipes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shopping_list_id` to the `shopping_list_recipes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PurchaseOption" DROP CONSTRAINT "PurchaseOption_productId_fkey";

-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_purchaseOptionId_fkey";

-- DropForeignKey
ALTER TABLE "shopping_list_item_sources" DROP CONSTRAINT "shopping_list_item_sources_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "shopping_list_item_sources" DROP CONSTRAINT "shopping_list_item_sources_shoppingListItemId_fkey";

-- DropForeignKey
ALTER TABLE "shopping_list_items" DROP CONSTRAINT "shopping_list_items_productId_fkey";

-- DropForeignKey
ALTER TABLE "shopping_list_items" DROP CONSTRAINT "shopping_list_items_shoppingListId_fkey";

-- DropForeignKey
ALTER TABLE "shopping_list_recipes" DROP CONSTRAINT "shopping_list_recipes_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "shopping_list_recipes" DROP CONSTRAINT "shopping_list_recipes_shoppingListId_fkey";

-- DropIndex
DROP INDEX "shopping_list_item_sources_shoppingListItemId_recipeId_key";

-- DropIndex
DROP INDEX "shopping_list_items_shoppingListId_productId_unit_key";

-- DropIndex
DROP INDEX "shopping_list_recipes_shoppingListId_recipeId_key";

-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "priceAtPurchase",
DROP COLUMN "productNameAtPurchase",
DROP COLUMN "purchaseOptionId",
DROP COLUMN "saleBaseUnitAtPurchase",
DROP COLUMN "saleQuantityAtPurchase",
ADD COLUMN     "price_at_purchase" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "product_name_at_purchase" TEXT NOT NULL,
ADD COLUMN     "purchase_option_id" TEXT NOT NULL,
ADD COLUMN     "sale_quantity_at_purchase" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "sale_unit_at_purchase" "Unit" NOT NULL;

-- AlterTable
ALTER TABLE "shopping_list_item_sources" DROP COLUMN "recipeId",
DROP COLUMN "shoppingListItemId",
ADD COLUMN     "recipe_id" TEXT NOT NULL,
ADD COLUMN     "shopping_list_item_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "shopping_list_items" DROP COLUMN "isChecked",
DROP COLUMN "productId",
DROP COLUMN "requiredAmount",
DROP COLUMN "shoppingListId",
ADD COLUMN     "is_checked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "product_id" TEXT NOT NULL,
ADD COLUMN     "required_amount" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "shopping_list_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "shopping_list_recipes" DROP COLUMN "recipeId",
DROP COLUMN "shoppingListId",
ADD COLUMN     "recipe_id" TEXT NOT NULL,
ADD COLUMN     "shopping_list_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user_profiles" DROP COLUMN "birthYear",
ADD COLUMN     "birth_year" INTEGER;

-- DropTable
DROP TABLE "PurchaseOption";

-- CreateTable
CREATE TABLE "purchase_options" (
    "purchase_option_id" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "unit" "Unit" NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "description" TEXT,
    "product_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "purchase_options_pkey" PRIMARY KEY ("purchase_option_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shopping_list_item_sources_shopping_list_item_id_recipe_id_key" ON "shopping_list_item_sources"("shopping_list_item_id", "recipe_id");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_list_items_shopping_list_id_product_id_unit_key" ON "shopping_list_items"("shopping_list_id", "product_id", "unit");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_list_recipes_shopping_list_id_recipe_id_key" ON "shopping_list_recipes"("shopping_list_id", "recipe_id");

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_purchase_option_id_fkey" FOREIGN KEY ("purchase_option_id") REFERENCES "purchase_options"("purchase_option_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_options" ADD CONSTRAINT "purchase_options_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_list_recipes" ADD CONSTRAINT "shopping_list_recipes_shopping_list_id_fkey" FOREIGN KEY ("shopping_list_id") REFERENCES "shopping_lists"("shopping_list_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_list_recipes" ADD CONSTRAINT "shopping_list_recipes_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("recipe_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_list_items" ADD CONSTRAINT "shopping_list_items_shopping_list_id_fkey" FOREIGN KEY ("shopping_list_id") REFERENCES "shopping_lists"("shopping_list_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_list_items" ADD CONSTRAINT "shopping_list_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_list_item_sources" ADD CONSTRAINT "shopping_list_item_sources_shopping_list_item_id_fkey" FOREIGN KEY ("shopping_list_item_id") REFERENCES "shopping_list_items"("shopping_list_item_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_list_item_sources" ADD CONSTRAINT "shopping_list_item_sources_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("recipe_id") ON DELETE RESTRICT ON UPDATE CASCADE;
