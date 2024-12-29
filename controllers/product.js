// const User = require('../models/user');
const db = require("../models/all-models");
const Product = require("../models/product.js");



module.exports = {
    getProduct,
    updateProduct,
    editProdut,
    createProduct,
    getProductAPI,
}


async function getProduct(req, res) {

    const allProduct = await Product.find();
    console.log(allProduct.length);
    res.render('pages/products', { allProduct });

}

async function updateProduct(req, res) {

    const result = await Product.updateOne(
        { product_id: req.body.product_id },// Filter
        { $set: { name: req.body.name, nug: req.body.nug } } // Update fields
    );

    // const allProduct = await Product.find();
    // const product = await Product.findOne({ product_id: req.body.product_id });
    console.log(req.body.name, result, req.body.nug);

    if (result) {
        // result.name = name;
        res.json({ success: true });
    } else {
        res.json({ success: false, message: 'Record not found' });
    }
}


async function editProdut(req, res) {

    const result = await Product.findOne(
        { product_id: req.body.product_id },// Filter
    );

    console.log(req.body.name, result, req.body.nug);

    if (result) {
        // result.name = name;
        res.json({ success: true, data: result, message: 'Record found' });
    } else {
        res.json({ success: false, message: 'Record not found' });
    }
}

async function createProduct(req, res) {


    const { name, nug } = req.body;
    // Validate required fields
    if (!name || !nug) {
        return res.status(400).json({ success: false, message: 'Name and nug are required' });
    }

    // Get the last product's product_id and increment it
    // const lastProduct = await Product.findOne({}, { product_id: 1 , id: 1}) // Only fetch `product_id`
    //     .sort({ id: -1 }); // Sort in descending order by `product_id`

    const lastProduct = await Product.aggregate([
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
                product_id: 1, // Include `product_id` in the result
                id: 1 // Include original `id` in the result
            }
        }
    ]);
    const id = lastProduct ? Number(lastProduct[0].id) + 1 : 1; // Increment or start at 1
    const slug = name.toLowerCase().replace(/\s+/g, '-'); // Generate slug
    console.log("ID", id, lastProduct);
    // Create a new product
    const result = await Product.create({
        id,
        name,
        slug,
        nug,
    });

    console.log(req.body.name, req.body.nug);

    if (result) {
        // result.name = name;
        res.json({ success: true, data: result, message: 'Record found' });
    } else {
        res.json({ success: false, message: 'Record not found' });
    }
}


async function getProductAPI(req, res) {

    try {
        const allProduct = await Product.find().sort({ name: 1 });
        res.json({ success: true, data: allProduct }); // Send data as JSON
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch Products', error: error.message });
    }

}

