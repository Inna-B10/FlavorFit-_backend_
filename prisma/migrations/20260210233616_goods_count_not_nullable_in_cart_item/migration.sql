/*
  Warnings:

  - Made the column `goods_count` on table `cart_items` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "cart_items" ALTER COLUMN "goods_count" SET NOT NULL,
ALTER COLUMN "goods_count" SET DEFAULT 0;
