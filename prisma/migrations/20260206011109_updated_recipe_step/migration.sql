/*
  Warnings:

  - You are about to drop the column `order` on the `recipe_steps` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[recipe_id,step_number]` on the table `recipe_steps` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "recipe_steps_recipe_id_order_key";

-- AlterTable
ALTER TABLE "recipe_steps" DROP COLUMN "order",
ADD COLUMN     "step_number" INTEGER,
ALTER COLUMN "title" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "recipe_steps_recipe_id_step_number_key" ON "recipe_steps"("recipe_id", "step_number");
