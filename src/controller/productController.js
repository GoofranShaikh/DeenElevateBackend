const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const multer = require('multer');
const productValidator = require('../../src/validations/productValidation')
const CryptoJS = require('crypto-js');

const ENCRYPTION_KEY = '12345678'

// Set up Multer storage for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images/'); // Destination folder for storing images
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Unique filename for each image
  }
});

const upload = multer({ storage: storage }).single('image_url'); // 'image' should match the name attribute of your file input in the form

const saveProducts = async (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      return res.status(500).json({ error: err.message });
    } else if (err) {
      // An unknown error occurred when uploading
      return res.status(500).json({ error: err.message });
    }

    const hasError = productValidator.schemaValidation(req, 'TShirtValidation'); //validate user input
    if (hasError) {
      return res.status(400).json({ error: hasError });
    }


    try {
      // Image uploaded successfully
      // Image uploaded successfully
      const { name, description } = req.body;
      const available_quantity = parseInt(req.body.available_quantity);
      const price = parseFloat(req.body.price); // Parsing price to float
      const image_url = req.file.path; // Path of the uploaded image

      // Save product details along with the image URL to the database using Prisma
      const post = await prisma.TShirt.create({
        data: {
          name,
          description,
          price,
          image_url,
          available_quantity,
          sizes: {
            create: [
              { size: { connect: { size_id: 1 } } }, // Connect to existing size with ID 1
              { size: { connect: { size_id: 2 } } }, // Connect to existing size with ID 2
            ],
          },
        }
      });
      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ error: error?.message });
    }
  });
};

//fetch all products

const fetchAllProducts = async (req, res) => {
  try {
    const products = await prisma.TShirt.findMany();
    res.status(200).json(products);
  }
  catch (error) {
    res.status(400).json({ error: error })
  }
}

//fetch products by id
const fetchProductByid = async (req, res) => {
  try {
    const hasError = productValidator.schemaValidation(req, 'fetcTshirthById'); //validate user input
    if (hasError) {
      return res.status(400).json({ error: hasError });
    }
    const product = await prisma.TShirt.findUnique({

      where: {
        tshirt_id: req.body.tshirt_id,
      },
      include: {
        sizes: {
          include: {
            size: true, // Include the related Size record
          },
        },
      },
    })
    res.status(200).json(product);
  }
  catch (error) {
    res.status(400).json({ error: error })
  }
}

const AddCart = async (req, res) => {
  try {
    const { customerId, cartId } = req.body;
    let CartAvailable = await prisma.cart.findFirst({
      where: {
        customerId: req.body.customerId,
      }
    })
    if (!CartAvailable) {
      // Create the Cart using create method
      const newCart = await prisma.cart.create({
        data: {
          customerId
        },
        // options: { timezone: 'Asia/Kolkata' },
      });
      addCartItem(req, res, newCart);

    }
    else { //If Cart is present for the customer
      if (cartId == 0 || cartId == undefined || cartId == null) {
        addCartItem(req, res, CartAvailable) //If user added new Product in Existing Cart
      }
      else {
        updateCart(req, res) //If user updated Existing Product in Cart
      }
    }
  }
  catch (error) {
    res.status(400).json({ message: error.message })
  }
}





const GetCart = async (req, res) => {
  try {
    const {customerId} = req.body
    const IsCartAvailable =await prisma.cart.findFirst({
      where:{
        customerId:customerId
      }
    })
    if(!IsCartAvailable){return res.status(400).json({message:'No content'}) }
    const cartItems = await prisma.cartItem.findMany({
      where: {
        cartId: IsCartAvailable.id, // Replace with your desired cart ID
      },
      include: {
        tshirt: { // Include the 'tshirt' relation
    
        },
      },
    });
    res.status(200).json({cartItems})
  
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function addCartItem(req, res, newCart) {
  try {
    const { productId, quantity } = req.body;
    const cartId = newCart.id
    const newCartItem = await prisma.cartItem.create({
      data: {
        cartId, productId, quantity
      }
    });
    res.status(201).json({ id: newCartItem.id });
  }
  catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function updateCart(req, res,) {

  // Efficiently loop and update cart items within a transaction
  try {
    const { cartId, cartItems } = req.body;
    console.log(cartItems, 'cartItems')
    await prisma.$transaction(async tx => {
      for (const item of cartItems) {
        console.log(item, 'cartItem')


        // Update existing cart item
        await tx.cartItem.updateMany({
          where: {
            AND: [
              { productId: item.productId },
              { id: item.id },
            ]
          },
          data: {
            quantity: item.quantity,
          },
        });

      }
    });
    res.status(200).json({ cartId: cartId })
  }
  catch (error) {
    res.status(400).json({ message: error.message })
  }

}




module.exports = { saveProducts, fetchAllProducts, fetchProductByid, AddCart, GetCart };
