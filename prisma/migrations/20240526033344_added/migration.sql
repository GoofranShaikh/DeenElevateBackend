BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Payment] DROP CONSTRAINT [Payment_Status_df],
[Payment_method_df],
[Payment_wallet_df];
ALTER TABLE [dbo].[Payment] ADD [bank_transaction_id] NVARCHAR(1000);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
