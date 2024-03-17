
const express = require('express');
const router = express.Router();
const ProductsController = require('../../src/controller/productController');
const UserController = require('../../src/controller/userController');
const auth = require('../middleware/auth');

router.post('/AddProducts',ProductsController.saveProducts);
router.post('/products',ProductsController.fetchAllProducts)
router.post('/fetchProductsById',ProductsController.fetchProductByid);
router.post('/AddToCart',ProductsController.AddCart);
router.post('/auth/GetCart', auth.AuthenticateRequest,ProductsController.GetCart);
router.post('/signup',UserController.createUser);
router.post('/login', UserController.Login)

module.exports=router;