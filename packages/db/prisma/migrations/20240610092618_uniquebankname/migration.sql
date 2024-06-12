/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Banks` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Banks_name_key" ON "Banks"("name");
