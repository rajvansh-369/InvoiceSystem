const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true
        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true
        },
        remember_token:{
            type:String
        },
        created_at:{
            type: Date
        },
        updated_at:{
            type: Date
        }
    }
);


// userSchema.pre('save', function(next) {
//     this.updatedAt = Date.now();
//     next();
// });
const User = mongoose.model("User",userSchema);

module.exports = User;