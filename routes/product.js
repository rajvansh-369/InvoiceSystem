const express = require('express');
const { getProduct, updateProduct,editProdut,createProduct} = require('../controllers/product')
const router = express.Router();


router.get("/", getProduct);
router.post("/create", createProduct);
router.post("/update", updateProduct);
router.post("/editProdut", editProdut);
module.exports = router;
