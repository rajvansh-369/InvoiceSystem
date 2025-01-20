const express = require('express');
const {getCustomer,getCustomerAPI,getCustomerByIdAPI} = require('../controllers/customer')
const router = express.Router();


router.get("/", getCustomer);
router.post("/getCustomers", getCustomerAPI);
router.post("/getCustomerById", getCustomerByIdAPI);
module.exports = router;
