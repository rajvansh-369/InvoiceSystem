const express = require('express');
const { getTransaction, updateTransaction,editTransaction,createTransaction,getTransactionAPI} = require('../controllers/transaction')
const router = express.Router();


router.get("/", getTransaction);
router.post("/create", createTransaction);
router.post("/update", updateTransaction);
router.post("/editTransaction", editTransaction);
router.post("/getTransaction", getTransactionAPI);
module.exports = router;
