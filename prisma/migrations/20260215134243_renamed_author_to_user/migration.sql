/*
  Warnings:

  - You are about to drop the column `author_id` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `author_id` on the `recipes` table. All the data in the column will be lost.
  - You are about to alter the column `email` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - Added the required column `user_id` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `recipes` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RecipeSort" AS ENUM ('NEW', 'RECOMMENDED', 'POPULAR', 'COOKING_TIME');

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_author_id_fkey";

-- DropForeignKey
ALTER TABLE "recipes" DROP CONSTRAINT "recipes_author_id_fkey";

-- AlterTable
ALTER TABLE "comments" DROP COLUMN "author_id",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "recipes" DROP COLUMN "author_id",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE VARCHAR(100);

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
