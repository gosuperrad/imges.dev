-- CreateTable
CREATE TABLE "ImageEvent" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "bgColor" TEXT,
    "fgColor" TEXT,
    "format" TEXT NOT NULL,
    "hasText" BOOLEAN NOT NULL DEFAULT false,
    "hasBorder" BOOLEAN NOT NULL DEFAULT false,
    "hasBlur" BOOLEAN NOT NULL DEFAULT false,
    "hasPattern" BOOLEAN NOT NULL DEFAULT false,
    "hasGradient" BOOLEAN NOT NULL DEFAULT false,
    "hasCustomFont" BOOLEAN NOT NULL DEFAULT false,
    "queryParams" JSONB,
    "userAgent" TEXT,
    "referrer" TEXT,

    CONSTRAINT "ImageEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PopularStats" (
    "id" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "statType" TEXT NOT NULL,
    "statValue" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "period" TEXT NOT NULL DEFAULT 'all',
    "periodDate" TIMESTAMP(3),

    CONSTRAINT "PopularStats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ImageEvent_createdAt_idx" ON "ImageEvent"("createdAt");

-- CreateIndex
CREATE INDEX "ImageEvent_width_height_idx" ON "ImageEvent"("width", "height");

-- CreateIndex
CREATE INDEX "ImageEvent_format_idx" ON "ImageEvent"("format");

-- CreateIndex
CREATE INDEX "ImageEvent_bgColor_idx" ON "ImageEvent"("bgColor");

-- CreateIndex
CREATE INDEX "ImageEvent_fgColor_idx" ON "ImageEvent"("fgColor");

-- CreateIndex
CREATE INDEX "PopularStats_statType_count_idx" ON "PopularStats"("statType", "count");

-- CreateIndex
CREATE UNIQUE INDEX "PopularStats_statType_statValue_period_periodDate_key" ON "PopularStats"("statType", "statValue", "period", "periodDate");
