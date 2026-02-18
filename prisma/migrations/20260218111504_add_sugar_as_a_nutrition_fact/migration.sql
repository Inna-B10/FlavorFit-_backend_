-- AlterEnum
ALTER TYPE "RecipeUnit" ADD VALUE 'CUP';

-- AlterTable
ALTER TABLE "nutrition_facts" ADD COLUMN     "sugar" DECIMAL(65,30);
