/*
  Warnings:

  - You are about to drop the column `name` on the `couriers` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `products` table. All the data in the column will be lost.
  - Added the required column `courier_name` to the `couriers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_name` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "couriers" DROP COLUMN "name",
ADD COLUMN     "courier_name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "name",
ADD COLUMN     "product_name" TEXT NOT NULL;
