/*
  Warnings:

  - You are about to drop the column `order_referanse` on the `orders` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[order_reference]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `line_total_at_purchase` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order_reference` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPrice` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "orders_order_referanse_key";

-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "line_total_at_purchase" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "product_variant_label_at_purchase" TEXT;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "order_referanse",
ADD COLUMN     "order_reference" TEXT NOT NULL,
ADD COLUMN     "totalPrice" DECIMAL(10,2) NOT NULL;

-- CreateTable
CREATE TABLE "order_recipes" (
    "order_recipe_id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "recipe_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_recipes_pkey" PRIMARY KEY ("order_recipe_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "order_recipes_order_id_recipe_id_key" ON "order_recipes"("order_id", "recipe_id");

-- CreateIndex
CREATE UNIQUE INDEX "orders_order_reference_key" ON "orders"("order_reference");

-- AddForeignKey
ALTER TABLE "order_recipes" ADD CONSTRAINT "order_recipes_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("order_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_recipes" ADD CONSTRAINT "order_recipes_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("recipe_id") ON DELETE CASCADE ON UPDATE CASCADE;
