// const User = require('../models/user');
const db = require("../models/all-models");
const Customer = require("../models/customer");



module.exports = {
    getCustomer,
    getCustomerAPI,
    getCustomerByIdAPI
}

async function getCustomer(req, res) {

    const allCustomer = await Customer.find();
    heading = "Test Data";
    const items = ['Apple', 'Banana', 'Cherry', 'Date'];
    console.log(allCustomer);
    res.render('pages/customers', { allCustomer, items });

}


async function getCustomerAPI(req, res) {

    try {
        const allCustomer = await Customer.find().sort({ name: 1 });
        res.json({ success: true, data: allCustomer }); // Send data as JSON
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch customers', error: error.message });
    }

}


async function getCustomerByIdAPI(req, res) {

    try {
        const customer = await Customer.findOne({id : req.body.customer_id.toString()}).sort({ name: 1 });
        res.json({ success: true, data: customer }); // Send data as JSON
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch customers', error: error.message });
    }

}

