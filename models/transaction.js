const mongoose = require('mongoose');


const newSchema = new mongoose.Schema(
    {
        id: { type: String,required: true, unique: true  }, // Normal integer IDc
        customer_id: { type: Number, required: true }, // Normal integer IDc
        credit: { type: Number , required: false },
        debit: { type: Number , required: true },
        transaction_date: { type: String   , required: false },
    },
    { timestamps: true } // Adds createdAt and updatedAt fields automatically
);


module.exports = mongoose.model('transaction', newSchema);

// userSchema.pre('save', function(next) {
//     this.updatedAt = Date.now();
//     next();
// });
// const User = mongoose.model("User", userSchema);

// module.exports = User;