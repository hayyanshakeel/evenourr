-- Add tags and product tags tables for auto-categorization

CREATE TABLE IF NOT EXISTS "ProductTag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" INTEGER NOT NULL,
    "tag" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProductTag_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Index for faster tag lookups
CREATE INDEX IF NOT EXISTS "ProductTag_productId_idx" ON "ProductTag"("productId");
CREATE INDEX IF NOT EXISTS "ProductTag_tag_idx" ON "ProductTag"("tag");
CREATE UNIQUE INDEX IF NOT EXISTS "ProductTag_productId_tag_key" ON "ProductTag"("productId", "tag");
