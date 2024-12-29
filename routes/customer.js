const express = require('express');
const {getCustomer,getCustomerAPI} = require('../controllers/customer')
const router = express.Router();


router.get("/", getCustomer);
router.post("/getCustomers", getCustomerAPI);
module.exports = router;
