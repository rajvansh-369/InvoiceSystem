const mongoose = require('mongoose');


const newSchema = new mongoose.Schema(
    {
        id: { type: Number, required: true, unique: true  },
        name: { type: String, required: true },
        price: { type: Number , required: false },
        nug: { type: Number , required: true },
        net_weight: { type: Number   , required: false },
        gross_weight: { type: Number   , required: false },
        peti: { type: Number  , required: false }
    },
    { timestamps: true } // Adds createdAt and updatedAt fields automatically
);


module.exports = mongoose.model('product', newSchema);

// userSchema.pre('save', function(next) {
//     this.updatedAt = Date.now();
//     next();
// });
// const User = mongoose.model("User", userSchema);

// module.exports = User;