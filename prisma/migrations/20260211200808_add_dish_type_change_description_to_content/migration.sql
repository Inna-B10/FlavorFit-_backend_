/*
  Warnings:

  - You are about to drop the column `description` on the `recipe_steps` table. All the data in the column will be lost.
  - Added the required column `content` to the `recipe_steps` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dishType` to the `recipes` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DishType" AS ENUM ('SOUP', 'MAIN', 'SALAD', 'SNACK', 'DESSERT', 'BAKING', 'DRINK');

-- AlterTable
ALTER TABLE "recipe_steps" DROP COLUMN "description",
ADD COLUMN     "content" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "recipes" ADD COLUMN     "dishType" "DishType" NOT NULL,
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;
