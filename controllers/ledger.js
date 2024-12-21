// const User = require('../models/user');
const db = require("../models/all-models.js");
const Ledger = require("../models/ledger.js");



module.exports = {
    getLedger,
    updateLedger,
    editLedger,
    createLedger
}


async function getLedger(req, res) {
    try {
        // const allLedger = await Ledger.find();

        const allLedger = await Ledger.aggregate([

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

    const result = await Ledger.findOne(
        { Ledger_id: req.body.Ledger_id },// Filter
    );

    console.log(req.body.name, result, req.body.nug);

    if (result) {
        // result.name = name;
        res.json({ success: true, data: result, message: 'Record found' });
    } else {
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

