const express = require('express');
const {getCustomer,getCustomerAPI,getCustomerByIdAPI,createCustomer} = require('../controllers/customer')
const router = express.Router();


router.get("/", getCustomer);
router.post("/create", createCustomer);
router.post("/getCustomers", getCustomerAPI);
router.post("/getCustomerById", getCustomerByIdAPI);
module.exports = router;
