/*
  Warnings:

  - You are about to drop the column `amount` on the `shopping_list_item_sources` table. All the data in the column will be lost.
  - Added the required column `quantity` to the `shopping_list_item_sources` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "shopping_list_item_sources" DROP COLUMN "amount",
ADD COLUMN     "quantity" DECIMAL(10,3) NOT NULL;
