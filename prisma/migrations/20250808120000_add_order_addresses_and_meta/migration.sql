-- Add extended order fields for enterprise-grade details
-- SQLite allows adding columns using ALTER TABLE ADD COLUMN

ALTER TABLE "Order" ADD COLUMN "shippingAddress" TEXT;
ALTER TABLE "Order" ADD COLUMN "billingAddress" TEXT;
ALTER TABLE "Order" ADD COLUMN "shippingMethod" TEXT;
ALTER TABLE "Order" ADD COLUMN "paymentMethod" TEXT;
ALTER TABLE "Order" ADD COLUMN "taxRate" REAL;
ALTER TABLE "Order" ADD COLUMN "notes" TEXT;


