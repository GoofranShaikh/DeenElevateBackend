BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Customer] (
    [customer_id] INT NOT NULL IDENTITY(1,1),
    [first_name] NVARCHAR(1000) NOT NULL,
    [last_name] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [phone_number] NVARCHAR(1000),
    [shipping_address] NVARCHAR(1000) NOT NULL,
    [billing_address] NVARCHAR(1000),
    [created_at] DATETIME2 NOT NULL CONSTRAINT [Customer_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [Customer_pkey] PRIMARY KEY CLUSTERED ([customer_id])
);

-- CreateTable
CREATE TABLE [dbo].[Order] (
    [order_id] INT NOT NULL IDENTITY(1,1),
    [customer_id] INT NOT NULL,
    [total_amount] FLOAT(53) NOT NULL,
    [order_date] DATETIME2 NOT NULL CONSTRAINT [Order_order_date_df] DEFAULT CURRENT_TIMESTAMP,
    [status_code] INT NOT NULL,
    CONSTRAINT [Order_pkey] PRIMARY KEY CLUSTERED ([order_id])
);

-- CreateTable
CREATE TABLE [dbo].[Status] (
    [status_code] INT NOT NULL,
    [status] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Status_pkey] PRIMARY KEY CLUSTERED ([status_code])
);

-- CreateTable
CREATE TABLE [dbo].[Order_Item] (
    [order_item_id] INT NOT NULL IDENTITY(1,1),
    [order_id] INT NOT NULL,
    [tshirt_id] INT NOT NULL,
    [size_id] INT NOT NULL,
    [quantity] INT NOT NULL,
    [price] FLOAT(53) NOT NULL,
    CONSTRAINT [Order_Item_pkey] PRIMARY KEY CLUSTERED ([order_item_id])
);

-- CreateTable
CREATE TABLE [dbo].[TShirt] (
    [tshirt_id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000),
    [price] FLOAT(53) NOT NULL,
    [available_quantity] INT NOT NULL,
    [image_url] NVARCHAR(1000),
    [created_at] DATETIME2 NOT NULL CONSTRAINT [TShirt_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [TShirt_pkey] PRIMARY KEY CLUSTERED ([tshirt_id])
);

-- CreateTable
CREATE TABLE [dbo].[Size] (
    [size_id] INT NOT NULL IDENTITY(1,1),
    [size_name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Size_pkey] PRIMARY KEY CLUSTERED ([size_id])
);

-- CreateTable
CREATE TABLE [dbo].[TShirt_Size] (
    [tshirt_id] INT NOT NULL,
    [size_id] INT NOT NULL,
    CONSTRAINT [TShirt_Size_pkey] PRIMARY KEY CLUSTERED ([tshirt_id],[size_id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Order] ADD CONSTRAINT [Order_status_code_fkey] FOREIGN KEY ([status_code]) REFERENCES [dbo].[Status]([status_code]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Order] ADD CONSTRAINT [Order_customer_id_fkey] FOREIGN KEY ([customer_id]) REFERENCES [dbo].[Customer]([customer_id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Order_Item] ADD CONSTRAINT [Order_Item_order_id_fkey] FOREIGN KEY ([order_id]) REFERENCES [dbo].[Order]([order_id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Order_Item] ADD CONSTRAINT [Order_Item_tshirt_id_fkey] FOREIGN KEY ([tshirt_id]) REFERENCES [dbo].[TShirt]([tshirt_id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Order_Item] ADD CONSTRAINT [Order_Item_size_id_fkey] FOREIGN KEY ([size_id]) REFERENCES [dbo].[Size]([size_id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[TShirt_Size] ADD CONSTRAINT [TShirt_Size_tshirt_id_fkey] FOREIGN KEY ([tshirt_id]) REFERENCES [dbo].[TShirt]([tshirt_id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[TShirt_Size] ADD CONSTRAINT [TShirt_Size_size_id_fkey] FOREIGN KEY ([size_id]) REFERENCES [dbo].[Size]([size_id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
