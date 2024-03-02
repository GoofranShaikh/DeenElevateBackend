
const express = require('express');
const router = express.Router();
const ProductsController = require('../../src/controller/productController')
const UserController = require('../../src/controller/userController')

router.post('/AddProducts',ProductsController.saveProducts);
router.post('/products',ProductsController.fetchAllProducts)
router.post('/fetchProductsById',ProductsController.fetchProductByid);
router.post('/AddToCart',ProductsController.AddCart);
router.post('/GetCart',ProductsController.GetCart);
router.post('/CreateUser',UserController.createUser);
router.post('/Login', UserController.Login)

module.exports=router;