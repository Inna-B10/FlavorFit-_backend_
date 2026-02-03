/*
  Warnings:

  - You are about to drop the column `purchase_option_id` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `purchase_options` table. All the data in the column will be lost.
  - Added the required column `sale_unit` to the `purchase_options` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_author_id_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_recipe_id_fkey";

-- DropForeignKey
ALTER TABLE "fitness_profiles" DROP CONSTRAINT "fitness_profiles_user_id_fkey";

-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "likes_recipe_id_fkey";

-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "likes_user_id_fkey";

-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_order_id_fkey";

-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_purchase_option_id_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_user_id_fkey";

-- DropForeignKey
ALTER TABLE "purchase_options" DROP CONSTRAINT "purchase_options_product_id_fkey";

-- DropForeignKey
ALTER TABLE "recipe_ingredients" DROP CONSTRAINT "recipe_ingredients_recipe_id_fkey";

-- DropForeignKey
ALTER TABLE "recipe_steps" DROP CONSTRAINT "recipe_steps_recipe_id_fkey";

-- DropForeignKey
ALTER TABLE "shopping_list_item_sources" DROP CONSTRAINT "shopping_list_item_sources_recipe_id_fkey";

-- DropForeignKey
ALTER TABLE "shopping_list_item_sources" DROP CONSTRAINT "shopping_list_item_sources_shopping_list_item_id_fkey";

-- DropForeignKey
ALTER TABLE "shopping_list_items" DROP CONSTRAINT "shopping_list_items_shopping_list_id_fkey";

-- DropForeignKey
ALTER TABLE "shopping_list_recipes" DROP CONSTRAINT "shopping_list_recipes_recipe_id_fkey";

-- DropForeignKey
ALTER TABLE "shopping_list_recipes" DROP CONSTRAINT "shopping_list_recipes_shopping_list_id_fkey";

-- DropForeignKey
ALTER TABLE "shopping_lists" DROP CONSTRAINT "shopping_lists_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_profiles" DROP CONSTRAINT "user_profiles_user_id_fkey";

-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "purchase_option_id";

-- AlterTable
ALTER TABLE "purchase_options" DROP COLUMN "unit",
ADD COLUMN     "sale_unit" "Unit" NOT NULL;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("order_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_options" ADD CONSTRAINT "purchase_options_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("recipe_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("recipe_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "recipe_ingredients_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("recipe_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_steps" ADD CONSTRAINT "recipe_steps_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("recipe_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_lists" ADD CONSTRAINT "shopping_lists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_list_recipes" ADD CONSTRAINT "shopping_list_recipes_shopping_list_id_fkey" FOREIGN KEY ("shopping_list_id") REFERENCES "shopping_lists"("shopping_list_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_list_recipes" ADD CONSTRAINT "shopping_list_recipes_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("recipe_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_list_items" ADD CONSTRAINT "shopping_list_items_shopping_list_id_fkey" FOREIGN KEY ("shopping_list_id") REFERENCES "shopping_lists"("shopping_list_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_list_item_sources" ADD CONSTRAINT "shopping_list_item_sources_shopping_list_item_id_fkey" FOREIGN KEY ("shopping_list_item_id") REFERENCES "shopping_list_items"("shopping_list_item_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_list_item_sources" ADD CONSTRAINT "shopping_list_item_sources_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("recipe_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fitness_profiles" ADD CONSTRAINT "fitness_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
