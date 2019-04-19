const express = require('express');
//getting the root path of the project 
const path = require('path');
const isAuth = require('../middleware/is-auth');
const router = express.Router();

const adminController = require('../controllers/admin');

// const rootDir = require('../util/path');

//handle request function that starts with /add-product 
router.get('/add-product', isAuth, adminController.getAddProduct);

router.get('/products', isAuth, adminController.getProducts);

router.post('/add-product', isAuth, adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product', isAuth, adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;