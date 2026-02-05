/*
  Warnings:

  - Added the required column `slug` to the `recipes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "recipe_ingredients" ADD COLUMN     "note" TEXT;

-- AlterTable
ALTER TABLE "recipes" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "carts" (
    "cart_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "carts_pkey" PRIMARY KEY ("cart_id")
);

-- CreateTable
CREATE TABLE "cart_items" (
    "cart_item_id" TEXT NOT NULL,
    "goods_count" DECIMAL(65,30),
    "cart_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "purchase_option_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cart_items_pkey" PRIMARY KEY ("cart_item_id")
);

-- CreateTable
CREATE TABLE "cart_item_requirements" (
    "cart_item_requirement_id" TEXT NOT NULL,
    "cart_item_id" TEXT NOT NULL,
    "shopping_list_item_id" TEXT NOT NULL,

    CONSTRAINT "cart_item_requirements_pkey" PRIMARY KEY ("cart_item_requirement_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cart_items_cart_id_product_id_key" ON "cart_items"("cart_id", "product_id");

-- CreateIndex
CREATE UNIQUE INDEX "cart_item_requirements_cart_item_id_shopping_list_item_id_key" ON "cart_item_requirements"("cart_item_id", "shopping_list_item_id");

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "carts"("cart_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_purchase_option_id_fkey" FOREIGN KEY ("purchase_option_id") REFERENCES "purchase_options"("purchase_option_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_item_requirements" ADD CONSTRAINT "cart_item_requirements_cart_item_id_fkey" FOREIGN KEY ("cart_item_id") REFERENCES "cart_items"("cart_item_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_item_requirements" ADD CONSTRAINT "cart_item_requirements_shopping_list_item_id_fkey" FOREIGN KEY ("shopping_list_item_id") REFERENCES "shopping_list_items"("shopping_list_item_id") ON DELETE CASCADE ON UPDATE CASCADE;
