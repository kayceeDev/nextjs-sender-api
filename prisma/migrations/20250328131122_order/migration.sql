-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "token" TEXT NOT NULL,
    "network" TEXT NOT NULL,
    "recipientInstitution" TEXT NOT NULL,
    "recipientAccountName" TEXT NOT NULL,
    "recipientAccountIdentifier" TEXT NOT NULL,
    "returnAddress" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);
