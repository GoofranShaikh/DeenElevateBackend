/*
  Warnings:

  - You are about to drop the column `caputred` on the `Payment` table. All the data in the column will be lost.
  - Added the required column `captured` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Payment] DROP COLUMN [caputred];
ALTER TABLE [dbo].[Payment] ADD [captured] BIT NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
