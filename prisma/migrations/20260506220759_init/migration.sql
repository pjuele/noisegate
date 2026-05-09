-- CreateTable
CREATE TABLE "raw_items" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "url" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "raw_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "processed_items" (
    "id" TEXT NOT NULL,
    "rawItemId" TEXT NOT NULL,
    "isSignal" BOOLEAN NOT NULL,
    "summary" TEXT,
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "processed_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "raw_items_externalId_key" ON "raw_items"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "processed_items_rawItemId_key" ON "processed_items"("rawItemId");

-- AddForeignKey
ALTER TABLE "processed_items" ADD CONSTRAINT "processed_items_rawItemId_fkey" FOREIGN KEY ("rawItemId") REFERENCES "raw_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
