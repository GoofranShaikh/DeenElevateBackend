/*
  Warnings:

  - You are about to drop the column `Status` on the `Payment` table. All the data in the column will be lost.
  - Added the required column `status` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Payment] DROP COLUMN [Status];
ALTER TABLE [dbo].[Payment] ADD [status] NVARCHAR(1000) NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
