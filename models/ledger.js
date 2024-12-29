const mongoose = require('mongoose');

const ledgerSchema = new mongoose.Schema(
  {
    id: { type: String,required: true, unique: true  }, // Normal integer IDc
    customer_id: { type: Number, required: true }, // Normal integer IDc
    bill_no: { type: String, required: true },
    total_amount: { type: Number, required: true },
    total_credit: { type: Number, required: true },
    interest_amount: { type: Number, required: true },
    total_due: { type: Number, required: true },
    labour: { type: Number, required: true },
    bardana: { type: Number, required: true },
    is_paid: { type: Boolean, required: true },
    sms_sent_type: { type: Number, enum: [1, 2, 3], required: true }, // Assuming limited types for SMS sent status
    invoice_date: { type: Date, required: true },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields automatically
);

module.exports = mongoose.model('ledger', ledgerSchema);
