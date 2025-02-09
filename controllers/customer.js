// const User = require('../models/user');
const db = require("../models/all-models");
const Customer = require("../models/customer");



module.exports = {
    getCustomer,
    getCustomerAPI,
    getCustomerByIdAPI,
    createCustomer
}

async function getCustomer(req, res) {

    const allCustomer = await Customer.find();
    heading = "Test Data";
    const items = ['Apple', 'Banana', 'Cherry', 'Date'];
    console.log(allCustomer);
    res.render('pages/customers', { allCustomer, items });

}

async function createCustomer(req, res) {


    const { name, phone , address, city, state, country} = req.body;
    // Validate required fields
    if (!name || !phone || !address || !city) {
        return res.status(400).json({ success: false, message: 'Please Fill Required Field' });
    }

    // Get the last product's product_id and increment it
    // const lastProduct = await Product.findOne({}, { product_id: 1 , id: 1}) // Only fetch `product_id`
    //     .sort({ id: -1 }); // Sort in descending order by `product_id`

    const lastCustomer = await Customer.aggregate([
        {
            $addFields: {
                idAsNumber: { $toInt: "$id" } // Convert `id` from string to integer
            }
        },
        {
            $sort: { idAsNumber: -1 } // Sort by the numeric `id` in descending order
        },
        {
            $limit: 1 // Fetch the top result
        },
        {
            $project: {
                customer_id: 1, // Include `product_id` in the result
                id: 1 // Include original `id` in the result
            }
        }
    ]);
    const id = lastCustomer ? Number(lastCustomer[0].id) + 1 : 1; // Increment or start at 1
   // const slug = name.toLowerCase().replace(/\s+/g, '-'); // Generate slug
    console.log("ID", id, lastCustomer);
    // Create a new product
    const result = await Customer.create({
        id,
        name,
        phone,
        address,
        city,
        state,
        country, 
    });

    // console.log(req.body.name, req.body.nug);

    if (result) {
        // result.name = name;
        res.json({ success: true, data: result, message: 'Record found' });
    } else {
        res.json({ success: false, message: 'Record not found' });
    }
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

