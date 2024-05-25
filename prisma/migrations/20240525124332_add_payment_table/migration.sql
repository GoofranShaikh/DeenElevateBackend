BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Payment] (
    [amount] INT NOT NULL,
    [amount_refunded] INT NOT NULL,
    [caputred] BIT NOT NULL,
    [card_id] NVARCHAR(1000),
    [contact] NVARCHAR(1000),
    [created_at] DATETIME2 NOT NULL CONSTRAINT [Payment_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [Currency] NVARCHAR(1000) NOT NULL,
    [payment_id] NVARCHAR(1000) NOT NULL,
    [international] BIT NOT NULL CONSTRAINT [Payment_international_df] DEFAULT 0,
    [method] NVARCHAR(1000) CONSTRAINT [Payment_method_df] DEFAULT 'Offline',
    [rz_order_id] NVARCHAR(1000),
    [order_id] INT NOT NULL,
    [Status] NVARCHAR(1000) NOT NULL CONSTRAINT [Payment_Status_df] DEFAULT 'Pending',
    [tax] INT,
    [wallet] NVARCHAR(1000) CONSTRAINT [Payment_wallet_df] DEFAULT 'Offline',
    CONSTRAINT [Payment_pkey] PRIMARY KEY CLUSTERED ([payment_id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Payment] ADD CONSTRAINT [Payment_order_id_fkey] FOREIGN KEY ([order_id]) REFERENCES [dbo].[Order]([order_id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
