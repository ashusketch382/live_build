-- CreateTable
CREATE TABLE "BuildSnapshot" (
    "id" SERIAL NOT NULL,
    "buildId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "buildStartTime" TIMESTAMP(3),
    "buildEndTime" TIMESTAMP(3),
    "onpremStatus" TEXT NOT NULL,
    "dockerStatus" TEXT NOT NULL,
    "comments" TEXT,
    "snapshotDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BuildSnapshot_pkey" PRIMARY KEY ("id")
);
