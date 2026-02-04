/*
  Warnings:

  - You are about to drop the column `quantity` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `sale_quantity_at_purchase` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `purchase_options` table. All the data in the column will be lost.
  - Added the required column `sale_amount_at_purchase` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sale_amount` to the `purchase_options` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "quantity",
DROP COLUMN "sale_quantity_at_purchase",
ADD COLUMN     "goods_count" INTEGER,
ADD COLUMN     "sale_amount_at_purchase" DECIMAL(10,3) NOT NULL,
ADD COLUMN     "weight" DECIMAL(10,3),
ADD COLUMN     "weightUnit" "Unit";

-- AlterTable
ALTER TABLE "purchase_options" DROP COLUMN "amount",
ADD COLUMN     "sale_amount" DECIMAL(10,3) NOT NULL;
