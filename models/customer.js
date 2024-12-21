const mongoose = require('mongoose');


const newSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String },
        state: { type: String },
        country: { type: String }
    },
    { timestamps: true } // Adds createdAt and updatedAt fields automatically
);


module.exports = mongoose.model('customer', newSchema);

// userSchema.pre('save', function(next) {
//     this.updatedAt = Date.now();
//     next();
// });
// const User = mongoose.model("User", userSchema);

// module.exports = User;