// const User = require('../models/user');
const db = require("../models/all-models.js");
const Ledger = require("../models/ledger.js");
const Product = require("../models/product.js");
const ProductLedger = require("../models/product_ledger.js");



module.exports = {
    getLedger,
    updateLedger,
    editLedger,
    createLedger,
    viewLedger
}


async function getLedger(req, res) {
    try {
        // const allLedger = await Ledger.find();



        const allLedger = await Ledger.aggregate([

            // {
            //     $match:{
            //         id: ledgerId
            //     }
            // },
            {
                $lookup: {
                    from: 'customers', // The name of the customers collection
                    localField: 'customer_id', // Field in the ledgers collection
                    foreignField: 'id', // Field in the customers collection
                    as: 'customer_details' // Alias for the joined data
                }
            },
            {
                $unwind: '$customer_details' // Deconstructs the array returned by $lookup
            }
        ]);

        console.log(allLedger.length, "ledgers", allLedger);
        res.render('pages/ledgers', { allLedger });

    } catch (err) {
        console.error('Error fetching data:', err);
    }

}

async function updateLedger(req, res) {

    const result = await Ledger.updateOne(
        { Ledger_id: req.body.Ledger_id },// Filter
        { $set: { name: req.body.name, nug: req.body.nug } } // Update fields
    );

    // const allLedger = await Ledger.find();
    // const Ledger = await Ledger.findOne({ Ledger_id: req.body.Ledger_id });
    console.log(req.body.name, result, req.body.nug);

    if (result) {
        // result.name = name;
        res.json({ success: true });
    } else {
        res.json({ success: false, message: 'Record not found' });
    }
}


async function editLedger(req, res) {

    const ledgerId = req.params.ledgerId; // Retrieve the ledger ID

    // const result = await Ledger.findOne(
    //     { id: ledgerId },// Filter
    // );
    const results = [];
    // const data = await ProductLedger.aggregate([
    //     {
    //       $match: {
    //         ledger_id: ledgerId, // Match based on ledger_id
    //       },
    //     },
    //     {
    //       $addFields: {
    //         product_id: { $toString: "$product_id" }, // Ensure product_id is a string
    //         ledger_id: { $toString: "$ledger_id" },   // Ensure ledger_id is a string
    //       },
    //     },
    //     {
    //       $lookup: {
    //         from: "products", // Name of the Product collection
    //         localField: "product_id", // Field in ProductLedger
    //         foreignField: "id", // Field in Product
    //         as: "product",
    //       },
    //     },
    //     {
    //       $lookup: {
    //         from: "ledgers", // Name of the Ledger collection
    //         localField: "ledger_id", // Field in ProductLedger
    //         foreignField: "id", // Field in Ledger
    //         as: "ledger",
    //       },
    //     },
    //     {
    //       $unwind: "$product", // Simplify product array to object
    //     },
    //     {
    //       $unwind: "$ledger", // Simplify ledger array to object
    //     },
    //     {
    //       $addFields: {
    //         customer_id: "$ledger.customer_id", // Bring customer_id to top level
    //       },
    //     },
    //     {
    //       $lookup: {
    //         from: "customers", // Name of the Customers collection
    //         localField: "customer_id", // Match customer_id
    //         foreignField: "id", // Field in Customers
    //         as: "customer",
    //       },
    //     },
    //     {
    //       $unwind: "$customer", // Simplify customer array to object
    //     },
    //     {
    //       $project: {
    //         _id: 1,
    //         product: 1,
    //         ledger: 1,
    //         customer: 1,
    //         product_qty: 1, // Include product quantity
    //         product_price: 1, // Include product price
    //       },
    //     },
    //   ]);


    const data = await Ledger.aggregate([
        {
          $match: {
            id: ledgerId, // Match the specific ledger by its ID
          },
        },
        {
          $lookup: {
            from: "product_ledgers", // Collection linking products to ledgers
            localField: "id", // Ledger ID in the Ledger collection
            foreignField: "ledger_id", // Ledger ID in ProductLedger collection
            as: "ledger_products_raw", // Temporary field for raw data
          },
        },
        {
          $unwind: "$ledger_products_raw", // Unwind to process each product ledger entry
        },
        {
          $lookup: {
            from: "products", // Product collection
            localField: "ledger_products_raw.product_id", // Product ID in ProductLedger
            foreignField: "id", // Product ID in Product collection
            as: "product_details", // Embed product details
          },
        },
        {
          $unwind: "$product_details", // Unwind product details to process them
        },
        {
          $lookup: {
            from: "customers", // Customers collection
            localField: "customer_id", // Customer ID in Ledger collection
            foreignField: "id", // ID in Customers collection
            as: "customer_details", // Embed customer details
          },
        },
        {
          $unwind: {
            path: "$customer_details", // Unwind customer details
            preserveNullAndEmptyArrays: true, // Optional: Keep ledgers even if customer data is missing
          },
        },
        {
          $group: {
            _id: "$_id", // Group by Ledger ID
            id: { $first: "$id" },
            total_amount: { $first: "$total_amount" },
            total_credit: { $first: "$total_credit" },
            interest_amount: { $first: "$interest_amount" },
            total_due: { $first: "$total_due" },
            bill_no: { $first: "$bill_no" },
            bardana: { $first: "$bardana" },
            is_paid: { $first: "$is_paid" },
            invoice_date: { $first: "$invoice_date" },
            sms_sent_type: { $first: "$sms_sent_type" },
            createdAt: { $first: "$createdAt" },
            updatedAt: { $first: "$updatedAt" },
            customer: { $first: "$customer_details" }, // Embed customer details here
            ledger_products: {
              $push: {
                product: {
                  _id: "$product_details._id",
                  id: "$product_details.id",
                  name: "$product_details.name",
                  price: "$product_details.price",
                  nug: "$product_details.nug",
                  net_weight: "$product_details.net_weight",
                  gross_weight: "$product_details.gross_weight",
                  peti: "$product_details.peti",
                  created_at: "$product_details.created_at",
                  updated_at: "$product_details.updated_at",
                },
                ledger_products_id: "$ledger_products_raw.id",
                product_qty: "$ledger_products_raw.product_qty",
                product_price: "$ledger_products_raw.product_price",
                ledger_product_details: "$ledger_products_raw", // Embed all fields from ledger_products_raw
              },
            },
          },
        },
        {
          $addFields: {
            ledger_products: {
              $map: {
                input: "$ledger_products",
                as: "product_entry",
                in: {
                  product: ["$$product_entry.product"], // Wrap product in an array
                  product_qty: "$$product_entry.product_qty",
                  ledger_products_id: "$product_entry.id",
                  product_price: "$$product_entry.product_price",
                  ledger_product_details: "$$product_entry", // Embed all fields from ledger_products_raw
                },
              },
            },
          },
        },
      ]);
      
      result = data[0];
      console.log(result, result.ledger_products[0].ledger_product_details,'test');

    if (result) {
        // result.name = name;
        res.render('pages/ledger-edit', { result });

        // res.json({ success: true, data: result, message: 'Record found' });
    } else {
        // res.render('pages/ledger-edit', { result });

        res.json({ success: false, message: 'Record not found' });
    }
}


async function viewLedger(req, res) {

    const ledgerId = req.params.ledgerId; // Retrieve the ledger ID

    const result = await Ledger.findOne(
        { id: ledgerId },// Filter
    );

    // console.log(req.body.name, result, req.body.nug);

    if (result) {
        // result.name = name;
        res.render('pages/ledger-view', { result });

        // res.json({ success: true, data: result, message: 'Record found' });
    } else {
        // res.render('pages/ledger-edit', { result });

        res.json({ success: false, message: 'Record not found' });
    }
}

async function createLedger(req, res) {


    const { name, nug } = req.body;
    // Validate required fields
    if (!name || !nug) {
        return res.status(400).json({ success: false, message: 'Name and nug are required' });
    }

    // Get the last Ledger's Ledger_id and increment it
    // const lastLedger = await Ledger.findOne({}, { Ledger_id: 1 , id: 1}) // Only fetch `Ledger_id`
    //     .sort({ id: -1 }); // Sort in descending order by `Ledger_id`

    const lastLedger = await Ledger.aggregate([
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
                Ledger_id: 1, // Include `Ledger_id` in the result
                id: 1 // Include original `id` in the result
            }
        }
    ]);
    const id = lastLedger ? Number(lastLedger[0].id) + 1 : 1; // Increment or start at 1
    const slug = name.toLowerCase().replace(/\s+/g, '-'); // Generate slug
    console.log("ID", id, lastLedger);
    // Create a new Ledger
    const result = await Ledger.create({
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

