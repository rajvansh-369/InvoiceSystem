const mongoose = require('mongoose');

const ledgerSchema = new mongoose.Schema(
  {
    id: { type: String,required: true, unique: true  }, // Normal integer IDc
    customer_id: { type: String, required: true }, // Normal integer IDc
    bill_no: { type: String, required: true,unique: true },
    total_amount: { type: Number, required: false },
    total_credit: { type: Number, required: false },
    interest_amount: { type: Number, required: false },
    total_due: { type: Number, required: false },
    labour: { type: Number, required: false },
    bardana: { type: Number, required: false },
    is_paid: { type: Boolean, required: false },
    sms_sent_type: { type: Number, enum: [1, 2, 3], required: false }, // Assuming limited types for SMS sent status
    invoice_date: { type: Date, required: false },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields automatically
);


module.exports = mongoose.model('ledger', ledgerSchema);
