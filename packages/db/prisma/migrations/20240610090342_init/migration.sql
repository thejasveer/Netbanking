-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('OnRamp', 'OffRamp');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('INITIATED', 'PROCESSING', 'SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "User" (
    "userId" SERIAL NOT NULL,
    "number" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "loginToken" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Banks" (
    "bankId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "usernamePlaceholder" TEXT NOT NULL,
    "imgUrl" TEXT NOT NULL,

    CONSTRAINT "Banks_pkey" PRIMARY KEY ("bankId")
);

-- CreateTable
CREATE TABLE "UserBank" (
    "userId" INTEGER NOT NULL,
    "bankId" INTEGER NOT NULL,
    "password" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 2000,

    CONSTRAINT "UserBank_pkey" PRIMARY KEY ("userId","bankId")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "txId" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL,
    "amount" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "bankId" INTEGER NOT NULL,
    "type" "TransactionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("txId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_token_key" ON "Transaction"("token");

-- CreateIndex
CREATE INDEX "Transaction_userId_bankId_idx" ON "Transaction"("userId", "bankId");

-- AddForeignKey
ALTER TABLE "UserBank" ADD CONSTRAINT "UserBank_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBank" ADD CONSTRAINT "UserBank_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "Banks"("bankId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_bankId_fkey" FOREIGN KEY ("userId", "bankId") REFERENCES "UserBank"("userId", "bankId") ON DELETE RESTRICT ON UPDATE CASCADE;
