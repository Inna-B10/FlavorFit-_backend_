/*
  Warnings:

  - You are about to drop the column `recipeRecipeId` on the `recipe_drafts` table. All the data in the column will be lost.
  - Made the column `step_number` on table `recipe_step_drafts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `step_number` on table `recipe_steps` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "recipe_drafts" DROP COLUMN "recipeRecipeId";

-- AlterTable
ALTER TABLE "recipe_step_drafts" ALTER COLUMN "step_number" SET NOT NULL;

-- AlterTable
ALTER TABLE "recipe_steps" ALTER COLUMN "step_number" SET NOT NULL;
