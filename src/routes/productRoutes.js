
const express = require('express');
const router = express.Router();
const ProductsController = require('../../src/controller/productController');
const UserController = require('../../src/controller/userController');
const auth = require('../middleware/auth');

router.post('/AddProducts',ProductsController.saveProducts);
router.post('/products',ProductsController.fetchAllProducts);
router.post('/fetchProductsById',ProductsController.fetchProductByid);
router.post('/auth/AddToCart',auth.AuthenticateRequest,ProductsController.AddCart);
router.post('/auth/GetCart', auth.AuthenticateRequest,ProductsController.GetCart);
router.post('/auth/deleteCart',auth.AuthenticateRequest,ProductsController.deleteCart);
router.post('/signup',UserController.createUser);
router.post('/login', UserController.Login);
router.post('/updateCustomer', UserController?.updateCustomer);
router.post('/GetStates',UserController.GetPinCode);
router.post('/getAddressInfo',UserController.getAddressInfo)
module.exports=router;