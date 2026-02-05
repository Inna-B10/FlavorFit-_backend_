/*
  Warnings:

  - You are about to drop the column `purchase_option_id` on the `cart_items` table. All the data in the column will be lost.
  - You are about to drop the `purchase_options` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "cart_items" DROP CONSTRAINT "cart_items_purchase_option_id_fkey";

-- DropForeignKey
ALTER TABLE "purchase_options" DROP CONSTRAINT "purchase_options_product_id_fkey";

-- AlterTable
ALTER TABLE "cart_items" DROP COLUMN "purchase_option_id",
ADD COLUMN     "product_variant_id" TEXT;

-- DropTable
DROP TABLE "purchase_options";

-- CreateTable
CREATE TABLE "product_variants" (
    "product_variant_id" TEXT NOT NULL,
    "pricing_amount" DECIMAL(10,3) NOT NULL,
    "pricing_unit" "SaleUnit" NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "description" TEXT,
    "product_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_variants_pkey" PRIMARY KEY ("product_variant_id")
);

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_product_variant_id_fkey" FOREIGN KEY ("product_variant_id") REFERENCES "product_variants"("product_variant_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE CASCADE ON UPDATE CASCADE;
