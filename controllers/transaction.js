// const User = require('../models/user');
const db = require("../models/all-models.js");
const Transaction = require("../models/transaction.js");



module.exports = {
    getTransaction,
    updateTransaction,
    editTransaction,
    createTransaction,
    getTransactionAPI,
    // addTransactionAPI
}


async function getTransaction(req, res) {

    const allTransaction = await Transaction.aggregate([
        {
            $addFields: {
                customer_id_str: { $toString: "$customer_id" }  // Convert to string
            }
        },
        {
            $lookup: {
                from: "customers", 
                localField: "customer_id_str",  // Use the converted string field
                foreignField: "id",  // Ensure "id" in customers collection is a string
                as: "customer",
            }
        },
        {
            $unwind: {
                path: "$customer",
                preserveNullAndEmptyArrays: true, 
            },
        }
    ]);
    console.log("getTransaction",allTransaction);
    res.render('pages/transactions', { allTransaction });

}

async function updateTransaction(req, res) {

 
    try {
        const { transaction_id, customer_id, credit, debit, transaction_date } = req.body;


        console.log(" req.body",  req.body)
        const updatedTransaction = await Transaction.findOneAndUpdate(
            { id: transaction_id },  // Filter condition
            { $set: { customer_id, credit, debit, transaction_date } },  // Fields to update
            { new: true }  // Return the updated document
        );

        if (updatedTransaction) {
            res.json({ success: true, data: updatedTransaction, message: 'Transaction updated successfully' });
        } else {
            res.json({ success: false, message: 'Transaction not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating transaction', error: error.message });
    }
}


async function editTransaction(req, res) {

    const result = await Transaction.findOne(
        { id: req.body.id },// Filter
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


    const { customer_id, credit, debit,transaction_date   }= req.body;
    // Validate required fields
    if (!customer_id || !credit|| !debit|| !transaction_date) {
        return res.status(400).json({ success: false, message: 'Credit, Debit and transaction_date are required' });
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
    // const slug = name.toLowerCase().replace(/\s+/g, '-'); // Generate slug
    console.log("ID", id, lastTransaction);
    // Create a new product
    const result = await Transaction.create({
        id,
        customer_id,
        credit,
        debit,
        transaction_date
    });

    console.log("createTransaction", result);

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



