/*
  Warnings:

  - You are about to drop the column `price` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `default_unit` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `sale_base_unit` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `sale_quantity` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `sale_unit` on the `products` table. All the data in the column will be lost.
  - Added the required column `priceAtPurchase` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productNameAtPurchase` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purchaseOptionId` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `saleBaseUnitAtPurchase` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `saleQuantityAtPurchase` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipe_unit` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Unit" ADD VALUE 'KILOGRAM';

-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_product_id_fkey";

-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "price",
DROP COLUMN "product_id",
ADD COLUMN     "priceAtPurchase" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "productNameAtPurchase" TEXT NOT NULL,
ADD COLUMN     "purchaseOptionId" TEXT NOT NULL,
ADD COLUMN     "saleBaseUnitAtPurchase" "Unit" NOT NULL,
ADD COLUMN     "saleQuantityAtPurchase" DECIMAL(65,30) NOT NULL;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "default_unit",
DROP COLUMN "description",
DROP COLUMN "price",
DROP COLUMN "sale_base_unit",
DROP COLUMN "sale_quantity",
DROP COLUMN "sale_unit",
ADD COLUMN     "recipe_unit" "Unit" NOT NULL;

-- DropEnum
DROP TYPE "SaleUnit";

-- CreateTable
CREATE TABLE "PurchaseOption" (
    "purchase_option_id" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "unit" "Unit" NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "description" TEXT,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PurchaseOption_pkey" PRIMARY KEY ("purchase_option_id")
);

-- CreateTable
CREATE TABLE "shopping_lists" (
    "shopping_list_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shopping_lists_pkey" PRIMARY KEY ("shopping_list_id")
);

-- CreateTable
CREATE TABLE "shopping_list_recipes" (
    "shopping_list_recipe_id" TEXT NOT NULL,
    "shoppingListId" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shopping_list_recipes_pkey" PRIMARY KEY ("shopping_list_recipe_id")
);

-- CreateTable
CREATE TABLE "shopping_list_items" (
    "shopping_list_item_id" TEXT NOT NULL,
    "shoppingListId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "requiredAmount" DECIMAL(65,30) NOT NULL,
    "unit" "Unit" NOT NULL,
    "isChecked" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shopping_list_items_pkey" PRIMARY KEY ("shopping_list_item_id")
);

-- CreateTable
CREATE TABLE "shopping_list_item_sources" (
    "shopping_list_item_source_id" TEXT NOT NULL,
    "shoppingListItemId" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "unit" "Unit" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shopping_list_item_sources_pkey" PRIMARY KEY ("shopping_list_item_source_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shopping_lists_user_id_key" ON "shopping_lists"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_list_recipes_shoppingListId_recipeId_key" ON "shopping_list_recipes"("shoppingListId", "recipeId");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_list_items_shoppingListId_productId_unit_key" ON "shopping_list_items"("shoppingListId", "productId", "unit");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_list_item_sources_shoppingListItemId_recipeId_key" ON "shopping_list_item_sources"("shoppingListItemId", "recipeId");

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_purchaseOptionId_fkey" FOREIGN KEY ("purchaseOptionId") REFERENCES "PurchaseOption"("purchase_option_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOption" ADD CONSTRAINT "PurchaseOption_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_lists" ADD CONSTRAINT "shopping_lists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_list_recipes" ADD CONSTRAINT "shopping_list_recipes_shoppingListId_fkey" FOREIGN KEY ("shoppingListId") REFERENCES "shopping_lists"("shopping_list_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_list_recipes" ADD CONSTRAINT "shopping_list_recipes_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipes"("recipe_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_list_items" ADD CONSTRAINT "shopping_list_items_shoppingListId_fkey" FOREIGN KEY ("shoppingListId") REFERENCES "shopping_lists"("shopping_list_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_list_items" ADD CONSTRAINT "shopping_list_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_list_item_sources" ADD CONSTRAINT "shopping_list_item_sources_shoppingListItemId_fkey" FOREIGN KEY ("shoppingListItemId") REFERENCES "shopping_list_items"("shopping_list_item_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_list_item_sources" ADD CONSTRAINT "shopping_list_item_sources_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipes"("recipe_id") ON DELETE RESTRICT ON UPDATE CASCADE;
