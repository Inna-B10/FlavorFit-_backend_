/*
  Warnings:

  - You are about to drop the column `dishType` on the `recipes` table. All the data in the column will be lost.
  - Added the required column `dish_type` to the `recipes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "recipes" DROP COLUMN "dishType",
ADD COLUMN     "dish_type" "DishType" NOT NULL;
