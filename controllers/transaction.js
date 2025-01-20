// const User = require('../models/user');
const db = require("../models/all-models.js");
const Transaction = require("../models/product.js");



module.exports = {
    getTransaction,
    updateTransaction,
    editTransaction,
    createTransaction,
    getTransactionAPI,
    // addTransactionAPI
}


async function getTransaction(req, res) {

    const allTransaction = await Transaction.find();
    console.log(allTransaction.length);
    res.render('pages/transactions', { allTransaction });

}

async function updateTransaction(req, res) {

    const result = await Transaction.updateOne(
        { product_id: req.body.product_id },// Filter
        { $set: { name: req.body.name, nug: req.body.nug } } // Update fields
    );

    // const allTransaction = await Transaction.find();
    // const product = await Transaction.findOne({ product_id: req.body.product_id });
    console.log(req.body.name, result, req.body.nug);

    if (result) {
        // result.name = name;
        res.json({ success: true });
    } else {
        res.json({ success: false, message: 'Record not found' });
    }
}


async function editTransaction(req, res) {

    const result = await Transaction.findOne(
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

async function createTransaction(req, res) {


    const { name, nug } = req.body;
    // Validate required fields
    if (!name || !nug) {
        return res.status(400).json({ success: false, message: 'Name and nug are required' });
    }

    // Get the last product's product_id and increment it
    // const lastTransaction = await Transaction.findOne({}, { product_id: 1 , id: 1}) // Only fetch `product_id`
    //     .sort({ id: -1 }); // Sort in descending order by `product_id`

    const lastTransaction = await Transaction.aggregate([
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
    const id = lastTransaction ? Number(lastTransaction[0].id) + 1 : 1; // Increment or start at 1
    const slug = name.toLowerCase().replace(/\s+/g, '-'); // Generate slug
    console.log("ID", id, lastTransaction);
    // Create a new product
    const result = await Transaction.create({
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


async function getTransactionAPI(req, res) {

    try {
        const allTransaction = await Transaction.find().sort({ name: 1 });
        res.json({ success: true, data: allTransaction }); // Send data as JSON
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch Transactions', error: error.message });
    }

}



