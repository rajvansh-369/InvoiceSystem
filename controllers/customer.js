// const User = require('../models/user');
const db = require("../models/all-models");
const Customer = require("../models/customer");



module.exports = {
    getCustomer
}

async function getCustomer(req, res) {

    const allCustomer = await Customer.find();
    heading = "Test Data";
    const items = ['Apple', 'Banana', 'Cherry', 'Date'];
    console.log(allCustomer);
    res.render('pages/customers', { allCustomer, items });

}

