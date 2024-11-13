-- CreateTable
CREATE TABLE "Build" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "buildStartTime" TIMESTAMP(3),
    "onpremStatus" TEXT NOT NULL,
    "dockerStatus" TEXT NOT NULL,
    "comments" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Build_pkey" PRIMARY KEY ("id")
);
