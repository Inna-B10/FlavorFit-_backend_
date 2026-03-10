-- AlterTable
ALTER TABLE "users" ALTER COLUMN "avatar_url" DROP NOT NULL,
ALTER COLUMN "avatar_url" DROP DEFAULT,
ALTER COLUMN "avatar_blob_path" DROP NOT NULL,
ALTER COLUMN "avatar_blob_path" DROP DEFAULT;
