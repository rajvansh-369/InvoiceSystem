const mongoose = require('mongoose');

const pivotSchema = new mongoose.Schema(
  {
    product_id: { type: String,  required: true }, // Assuming Product is a separate collection
    ledger_id: { type: String,required: true }, // Assuming Ledger is a separate collection
    product_qty: { type: Number, required: true }, // Quantity as a number
    product_price: { type: Number, required: true }, // Price as a number
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } } // Custom field names for timestamps
);

module.exports = mongoose.model('product_ledger', pivotSchema);
