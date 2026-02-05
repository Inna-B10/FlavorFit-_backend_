/*
  Warnings:

  - You are about to drop the column `description` on the `product_variants` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `carts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone_number]` on the table `couriers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[product_id,pricing_amount,pricing_unit,label]` on the table `product_variants` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[recipe_id,order]` on the table `recipe_steps` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `recipes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `label` to the `product_variants` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product_variants" DROP COLUMN "description",
ADD COLUMN     "label" TEXT NOT NULL,
ADD COLUMN     "note" TEXT;

-- CreateTable
CREATE TABLE "nutrition_facts" (
    "fact_id" TEXT NOT NULL,
    "protein" DECIMAL(65,30),
    "fats" DECIMAL(65,30),
    "carbohydrates" DECIMAL(65,30),
    "fiber" DECIMAL(65,30),
    "recipe_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nutrition_facts_pkey" PRIMARY KEY ("fact_id")
);

-- CreateTable
CREATE TABLE "recipe_tags" (
    "tag_id" TEXT NOT NULL,
    "tag_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recipe_tags_pkey" PRIMARY KEY ("tag_id")
);

-- CreateTable
CREATE TABLE "_RecipeToRecipeTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_RecipeToRecipeTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "nutrition_facts_recipe_id_key" ON "nutrition_facts"("recipe_id");

-- CreateIndex
CREATE UNIQUE INDEX "recipe_tags_tag_name_key" ON "recipe_tags"("tag_name");

-- CreateIndex
CREATE INDEX "_RecipeToRecipeTag_B_index" ON "_RecipeToRecipeTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "carts_user_id_key" ON "carts"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "couriers_phone_number_key" ON "couriers"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "product_variants_product_id_pricing_amount_pricing_unit_lab_key" ON "product_variants"("product_id", "pricing_amount", "pricing_unit", "label");

-- CreateIndex
CREATE UNIQUE INDEX "recipe_steps_recipe_id_order_key" ON "recipe_steps"("recipe_id", "order");

-- CreateIndex
CREATE UNIQUE INDEX "recipes_slug_key" ON "recipes"("slug");

-- AddForeignKey
ALTER TABLE "nutrition_facts" ADD CONSTRAINT "nutrition_facts_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("recipe_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RecipeToRecipeTag" ADD CONSTRAINT "_RecipeToRecipeTag_A_fkey" FOREIGN KEY ("A") REFERENCES "recipes"("recipe_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RecipeToRecipeTag" ADD CONSTRAINT "_RecipeToRecipeTag_B_fkey" FOREIGN KEY ("B") REFERENCES "recipe_tags"("tag_id") ON DELETE CASCADE ON UPDATE CASCADE;
