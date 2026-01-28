/*
  Warnings:

  - You are about to drop the column `age` on the `user_profiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user_profiles" DROP COLUMN "age",
ADD COLUMN     "birthYear" INTEGER;
