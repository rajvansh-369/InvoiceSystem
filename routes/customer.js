const express = require('express');
const {getCustomer} = require('../controllers/customer')
const router = express.Router();


router.get("/", getCustomer);
module.exports = router;
