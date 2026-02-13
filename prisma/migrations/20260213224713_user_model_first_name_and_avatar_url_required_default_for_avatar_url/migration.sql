/*
  Warnings:

  - Made the column `first_name` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `avatar_url` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "first_name" SET NOT NULL,
ALTER COLUMN "avatar_url" SET NOT NULL,
ALTER COLUMN "avatar_url" SET DEFAULT '';
