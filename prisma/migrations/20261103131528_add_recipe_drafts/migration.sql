-- CreateEnum
CREATE TYPE "RecipeDraftStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "recipe_drafts" (
    "recipe_draft_id" TEXT NOT NULL,
    "slug" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "calories" INTEGER,
    "cooking_time" INTEGER,
    "difficulty" "Difficulty" NOT NULL,
    "dish_type" "DishType" NOT NULL,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "RecipeDraftStatus" NOT NULL DEFAULT 'PENDING',
    "review_note" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "reviewed_by" TEXT,
    "user_id" TEXT NOT NULL,
    "published_recipe_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "recipeRecipeId" TEXT,

    CONSTRAINT "recipe_drafts_pkey" PRIMARY KEY ("recipe_draft_id")
);

-- CreateTable
CREATE TABLE "ingredient_drafts" (
    "ingredient_draft_id" TEXT NOT NULL,
    "quantity" DECIMAL(10,3),
    "recipe_unit" "RecipeUnit",
    "ingredient_note" TEXT,
    "product_id" TEXT,
    "raw_product_name" TEXT,
    "recipe_draft_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ingredient_drafts_pkey" PRIMARY KEY ("ingredient_draft_id")
);

-- CreateTable
CREATE TABLE "recipe_step_drafts" (
    "recipe_step_draft_id" TEXT NOT NULL,
    "step_number" INTEGER,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "recipe_draft_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recipe_step_drafts_pkey" PRIMARY KEY ("recipe_step_draft_id")
);

-- CreateTable
CREATE TABLE "nutrition_fact_drafts" (
    "fact_draft_id" TEXT NOT NULL,
    "protein" DECIMAL(65,30),
    "fats" DECIMAL(65,30),
    "carbohydrates" DECIMAL(65,30),
    "fiber" DECIMAL(65,30),
    "sugar" DECIMAL(65,30),
    "recipe_draft_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nutrition_fact_drafts_pkey" PRIMARY KEY ("fact_draft_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "recipe_drafts_published_recipe_id_key" ON "recipe_drafts"("published_recipe_id");

-- CreateIndex
CREATE INDEX "recipe_drafts_status_idx" ON "recipe_drafts"("status");

-- CreateIndex
CREATE INDEX "recipe_drafts_user_id_status_idx" ON "recipe_drafts"("user_id", "status");

-- CreateIndex
CREATE INDEX "ingredient_drafts_product_id_idx" ON "ingredient_drafts"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "recipe_step_drafts_recipe_draft_id_step_number_key" ON "recipe_step_drafts"("recipe_draft_id", "step_number");

-- CreateIndex
CREATE UNIQUE INDEX "nutrition_fact_drafts_recipe_draft_id_key" ON "nutrition_fact_drafts"("recipe_draft_id");

-- AddForeignKey
ALTER TABLE "recipe_drafts" ADD CONSTRAINT "recipe_drafts_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_drafts" ADD CONSTRAINT "recipe_drafts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_drafts" ADD CONSTRAINT "recipe_drafts_published_recipe_id_fkey" FOREIGN KEY ("published_recipe_id") REFERENCES "recipes"("recipe_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredient_drafts" ADD CONSTRAINT "ingredient_drafts_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredient_drafts" ADD CONSTRAINT "ingredient_drafts_recipe_draft_id_fkey" FOREIGN KEY ("recipe_draft_id") REFERENCES "recipe_drafts"("recipe_draft_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_step_drafts" ADD CONSTRAINT "recipe_step_drafts_recipe_draft_id_fkey" FOREIGN KEY ("recipe_draft_id") REFERENCES "recipe_drafts"("recipe_draft_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nutrition_fact_drafts" ADD CONSTRAINT "nutrition_fact_drafts_recipe_draft_id_fkey" FOREIGN KEY ("recipe_draft_id") REFERENCES "recipe_drafts"("recipe_draft_id") ON DELETE CASCADE ON UPDATE CASCADE;
