BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Payment] ALTER COLUMN [amount_refunded] INT NULL;
ALTER TABLE [dbo].[Payment] ADD CONSTRAINT [Payment_amount_refunded_df] DEFAULT 0 FOR [amount_refunded];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
