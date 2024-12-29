const express = require('express');
const { getProduct, updateProduct,editProdut,createProduct,getProductAPI} = require('../controllers/product')
const router = express.Router();


router.get("/", getProduct);
router.post("/create", createProduct);
router.post("/update", updateProduct);
router.post("/editProdut", editProdut);
router.post("/getProduct", getProductAPI);
module.exports = router;
