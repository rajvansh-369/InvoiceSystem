// const User = require('../models/user');
const db = require("../models/all-models.js");
const Ledger = require("../models/ledger.js");
const Product = require("../models/product.js");
const ProductLedger = require("../models/product_ledger.js");
const { encrypt , decrypt } = require('../helper/cryptoUtils'); // Import the utility



const mongoose = require('mongoose');



module.exports = {
  getLedger,
  updateLedger,
  editLedger,
  deleteLedger,
  createLedger,
  viewLedger,
  viewLedgerPdf,
  updateLedgerAPI,
  createLedgerView,
  sendWaReport,
}


async function getLedger(req, res) {
  try {
    // const allLedger = await Ledger.find();



    const result = await Ledger.aggregate([

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
      },
      {
        $sort:{
          createdAt : -1
        }
      }
      
    ]);
    // Encrypt the `id` field in the results
    const allLedger = result.map((ledger) => {
      return {
        ...ledger,
        id: (ledger.id), // Encrypt the `id` field
      };
    });

    console.log(allLedger.length, "ledgers", allLedger);
    res.render('pages/ledgers', { allLedger });

  } catch (err) {
    console.error('Error fetching data:', err);
  }

}


async function deleteLedger(req, res) {
  try {
      const result = await Ledger.deleteOne({ id: req.params.ledgerId }); // Fix `req.param` to `req.params`

      console.log(req.body.ledgerId, result, req.params.ledgerId.toString());

      if (result.deletedCount > 0) {
          res.redirect('back'); // Redirects the user back to the previous page
      } else {
          res.json({ success: false, message: 'Record not found' });
      }
  } catch (error) {
      console.error('Error deleting ledger:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
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

  const decryptedId = (req.params.ledgerId);
  const ledgerId = decryptedId; // Retrieve the ledger ID

  console.log("ledgerId",ledgerId,decryptedId);
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
              product: ["$$product_entry.product"],
              product_qty: "$$product_entry.product_qty",
              ledger_products_id: "$product_entry.id",
              product_price: "$$product_entry.product_price",
              ledger_product_details: "$$product_entry",
            },
          },
        },
      },
    },
  ]);

  result = data[0];
  console.log(result, result.ledger_products[0].ledger_product_details, 'test');


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

  console.log("ledgerId",req.params.ledgerId);
  const decryptedId = (req.params.ledgerId);
  const ledgerId = decryptedId; // Retrieve the ledger ID

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
              product: ["$$product_entry.product"],
              product_qty: "$$product_entry.product_qty",
              ledger_products_id: "$product_entry.id",
              product_price: "$$product_entry.product_price",
              ledger_product_details: "$$product_entry",
            },
          },
        },
      },
    },
  ]);




  result = data[0];
  console.log(result, result.ledger_products[0].ledger_product_details, 'test');

  const pdfUrl = req.headers.host + "/ledger/view-pdf/" + encrypt(result.id);
  // var pdfUrl = req.hostname
  if (result) {
    // result.name = name;
    res.render('pages/ledger-view', { result, pdfUrl });

    // res.json({ success: true, data: result, message: 'Record found' });
  } else {
    // res.render('pages/ledger-edit', { result });

    res.json({ success: false, message: 'Record not found' });
  }
}

async function viewLedgerPdf(req, res) {
  
  console.log("ledgerId",req.params.ledgerId);
  const decryptedId = decrypt(req.params.ledgerId);
  const ledgerId = decryptedId; // Retrieve the ledger ID const ledgerId = req.params.ledgerId; // Retrieve the ledger ID
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
              product: ["$$product_entry.product"],
              product_qty: "$$product_entry.product_qty",
              ledger_products_id: "$product_entry.id",
              product_price: "$$product_entry.product_price",
              ledger_product_details: "$$product_entry",
            },
          },
        },
      },
    },
  ]);

  result = data[0];
  console.log(result, result.ledger_products[0].ledger_product_details, 'test');

  if (result) {
    // result.name = name;
    res.render('pages/ledger-view_pdf', { result });

    // res.json({ success: true, data: result, message: 'Record found' });
  } else {
    // res.render('pages/ledger-edit', { result });

    res.json({ success: false, message: 'Record not found' });
  }
}

async function createLedgerView(req, res) {


  // const ledgerId = req.params.ledgerId; // Retrieve the ledger ID
  // const data = await Ledger.findOne().sort({ id: -1 })

  const result = await Ledger.aggregate([
    {
      $addFields: {
        idAsInt: { $toInt: "$id" } // Convert id to an integer
      }
    },
    {
      $sort: { idAsInt: -1 } // Sort by converted integer field
    },
    {
      $limit: 1 // Get only the latest record
    }
  ]);


  data = result[0];
  console.log(data, 'test');
  data.bill_no++;
  if (data) {
    // result.name = name;
    res.render('pages/ledger-create', { data });

    // res.json({ success: true, data: result, message: 'Record found' });
  } else {
    // res.render('pages/ledger-edit', { result });

    res.json({ success: false, message: 'Record not found' });
  }



  // res.render('pages/ledger-create');
}

async function createLedger(req, res) {


  const { invoice_no ,customer_id } = req.body;

  var lastLedger = 0
  const checkBillNo = await Ledger.find({ bill_no: req.body.invoice_no });


  console.log(checkBillNo, "checkBillNo", req.body);

  if (checkBillNo.length > 0) {
    return res.status(200).json({ success: false, message: 'Invoice No is already exist !' });
  }

      const lastProduct = await Ledger.aggregate([
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
                  ledger_id: 1, // Include `product_id` in the result
                  id: 1 // Include original `id` in the result
              }
          }
      ]);

      console.log("lastProduct",lastProduct);
   const id = lastProduct ? Number(lastProduct[0].id) + 1 : 1; // Increment or start at 1

  const bill_no = invoice_no ? Number(invoice_no) + 1 : 1; // Increment or start at 1
  //const slug = name.toLowerCase().replace(/\s+/g, '-'); // Generate slug
  // console.log("ID", bill_no,id);
  // Create a new Ledger
  const createLedger = await Ledger.create({
    bill_no, // Fixed typo (was `biil_no`)
    customer_id,
    id, // Ensure `id` is provided if required
});

  

const decryptedId = encrypt(id.toString());
const ledgerId = id; // Retrieve the ledger ID


console.log( id, decrypt(ledgerId))


// result = data[0];
// console.log(result, result.ledger_products[0].ledger_product_details, 'test');



// if (result) {
  // result.name = name;
  // res.render('pages/ledger-edit', { result });

  res.json({ success: true, ledgerId : ledgerId, message: 'Record found' });
  // } else {
  //     res.json({ success: false, message: 'Record not found' });
  //   }
}


async function updateLedgerAPI(req, res) {

  // console.log(req.body.ledger, req.body.ledger, "addProductAPI",req.body);
  // return;
  // try {
  //     const products = req.body.products;
  //     const ledger = req.body.ledger;

  //     if (!Array.isArray(products) || products.length === 0) {
  //         return res.status(400).json({ success: false, message: 'No products provided' });
  //     }

  //     // Insert multiple products
  //     const insertedProducts = await ProductLedger = require("../models/product_ledger.js");
  // 

  //     res.json({ success: true, message: 'Products added successfully!', data: insertedProducts });
  // } catch (error) {
  //     res.status(500).json({ success: false, message: 'Failed to add products', error: error.message });
  // }


  try {
    const { ledger, products } = req.body;

    // Validate ledger and products
    if (!Array.isArray(ledger) || ledger.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid ledger data' });
    }
    // if (!Array.isArray(products) || products.length === 0) {
    //   return res.status(400).json({ success: false, message: 'No products provided' });
    // }

    // Extract and process ledger
    const ledgerData = ledger[0]; // Assuming you're sending one ledger at a time
    const ledgerId = ledgerData.ledger_id;

    if (!ledgerId) {
      throw new Error('Ledger ID is required');
    }

    // Insert new products into product_ledger
    const productIds = products.map((product) => product.product_id);
    const ledgerIds = products.map((product) => product.ledger_id);
    const existingProducts = await ProductLedger.find({ product_id: { $in: productIds }, ledger_id: { $in: ledgerIds } });
    const existingProductIds = existingProducts.map((product) => product.product_id);

    const newProducts = products.filter(
      (product) => !existingProductIds.includes(product.product_id)
    );

    if (newProducts.length > 0) {
      await ProductLedger.insertMany(
        newProducts.map((product) => ({
          ledger_id: product.ledger_id,
          product_id: product.product_id,
          product_qty: product.product_qty,
          product_price: product.product_price,
        }))
      );
    }
    console.log(ProductLedger, 'ProductLedger', newProducts, "ledgerData", ledgerData);

    const invoiceNo = ledgerData.invoice_no.trim(); // Ensure no extra spaces or unwanted concatenation
    const invoiceAmount = parseFloat(
      ledgerData.inv_amount.replace(/[^\d.]/g, ''), // Keep decimal points for valid float
      10
    );

    // Update ledger
    const ledgerUpdateResult = await Ledger.updateOne(
      { id: ledgerId },
      {
        $set: {
          customer_id: ledgerData.customer_list.toString(),
          bill_no: invoiceNo, // Assign cleaned invoice no
          total_amount: invoiceAmount, // Use the cleaned and parsed amount
          invoice_date: new Date(ledgerData.inv_date),
        },
      }
    );
    console.log(ledgerUpdateResult, 'ledgerUpdateResult');
    if (ledgerUpdateResult.nModified === 0) {
      return res.status(400).json({
        success: false,
        message: 'Ledger update failed. Products were not added.',
      });
    }

    return res.json({
      success: true,
      message: 'Products and ledger processed successfully',
      newProducts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to process the request',
      error: error.message,
    });
  }
}

async function sendWaReport(req, res) {

  // const phoneNumber = "7979068408"; // Example: '1234567890'
  // const message = "Hi" || 'Here is the PDF file you requested!';

  // if (!phoneNumber) {
  //   return res.send('Phone number is required');
  // }
  // const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  // await open(url); // Opens the URL in the default browser

  // res.send(`Opened WhatsApp Web for ${phoneNumber}`);
}
