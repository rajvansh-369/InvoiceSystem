const mongoose = require('mongoose');


const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        remember_token: { type: String },
    },
    { timestamps: true } // Adds createdAt and updatedAt fields automatically
);


module.exports = mongoose.model('user', userSchema);

// userSchema.pre('save', function(next) {
//     this.updatedAt = Date.now();
//     next();
// });
// const User = mongoose.model("User", userSchema);

// module.exports = User;