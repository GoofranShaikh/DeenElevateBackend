const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const multer = require('multer');
const productValidator = require('../../src/validations/productValidation')
const CryptoJS = require('crypto-js');

const ENCRYPTION_KEY ='12345678'

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

      const hasError=productValidator.schemaValidation(req,'TShirtValidation'); //validate user input
      if(hasError){
      return res.status(400).json({ error: hasError });
      }
      
      
      try {
      // Image uploaded successfully
   // Image uploaded successfully
        const { name, description } = req.body;
        const available_quantity =parseInt(req.body.available_quantity);
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
        res.status(500).json({ error:error?.message });
      }
    });
  };

  //fetch all products

  const fetchAllProducts = async(req,res)=>{
    try{
      const products = await prisma.TShirt.findMany();
      res.status(200).json(products);
    }
    catch(error){
      res.status(400).json({error:error})
    }
  }

  //fetch products by id
const fetchProductByid = async(req,res) => {
  try{
    const hasError= productValidator.schemaValidation(req,'fetcTshirthById'); //validate user input
    if(hasError){
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
  catch(error){
    res.status(400).json({error:error})
  }
}

const AddCart = async(req,res) =>{
  try{
    console.log(req.body,'cart')
     // Sanitize and validate request data here
  const productId = req.body.productId;
  const quantity = req.body.quantity;
  console.log(req.cookies.cart,'req.cookies.cart')
  let cartItems = req.cookies.cart || [];
  cartItems.push({
    productId,quantity
  })
  const encryptedCart = encryptData(cartItems);
  res.cookie('cart', encryptedCart, { httpOnly: true, secure: true, expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }); // Expire in 30 days
  res.json({ success: true });
//   if (!req.session.cart) {
//     req.session.cart = []; // Initialize cart if it doesn't exist
// }
//     console.log(req.body, 'cart');
//     const productId = req.body.productId;
//     const quantity = req.body.quantity;

//     // Add item to cart in session
//     req.session.cart.push({ productId, quantity });

//     res.json({ success: true });



  }
  catch(error){
    res.status(400).json({message:error.message})
  }
}

// Function to encrypt data
function encryptData(data) {
  return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
}

// Function to decrypt data
function decryptData(encryptedData) {
  const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}

const getCookies = (req) => {
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
      return Object.fromEntries(
          cookieHeader.split('; ').map(cookie => {
              const [key, ...v] = cookie.split('=');
              return [key, decodeURIComponent(v.join('='))];
          })
      );
  }
  return {};
};

const GetCart = async(req,res) => {
  console.log(req.session.cart,'get')
  try {
      // Retrieve encrypted cart from cookies
      const encryptedCart = getCookies(req).cart;
      if (!encryptedCart) {
          return res.json({ cartItems: [] }); // Return empty cart if no cookie found
      }

      // Decrypt cart data
      const decryptedCart = decryptData(encryptedCart);

      res.json({ cartItems: decryptedCart });
  } catch(error) {
      res.status(400).json({ message: error.message });
  }

//   try {
//     const cartItems = req.session.cart || [];
//     res.json({ cartItems });
// } catch (error) {
//     res.status(400).json({ message: error.message });
// }
}
  

module.exports = { saveProducts,fetchAllProducts,fetchProductByid ,AddCart,GetCart};
