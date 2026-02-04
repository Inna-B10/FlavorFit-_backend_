/*
  Warnings:

  - You are about to alter the column `price_at_purchase` on the `order_items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `sale_quantity_at_purchase` on the `order_items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,3)`.
  - You are about to alter the column `amount` on the `purchase_options` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,3)`.
  - You are about to alter the column `price` on the `purchase_options` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `quantity` on the `recipe_ingredients` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,3)`.
  - You are about to alter the column `amount` on the `shopping_list_item_sources` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,3)`.
  - You are about to alter the column `required_amount` on the `shopping_list_items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,3)`.

*/
-- AlterTable
ALTER TABLE "order_items" ALTER COLUMN "price_at_purchase" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "sale_quantity_at_purchase" SET DATA TYPE DECIMAL(10,3);

-- AlterTable
ALTER TABLE "purchase_options" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(10,3),
ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "recipe_ingredients" ALTER COLUMN "quantity" SET DATA TYPE DECIMAL(10,3);

-- AlterTable
ALTER TABLE "shopping_list_item_sources" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(10,3);

-- AlterTable
ALTER TABLE "shopping_list_items" ALTER COLUMN "required_amount" SET DATA TYPE DECIMAL(10,3);
