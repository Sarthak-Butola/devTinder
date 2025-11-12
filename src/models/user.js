const mongoose = require('mongoose');
const validator = require("validator");
const { default: isEmail } = require('validator/lib/isEmail');

const userSchema = new mongoose.Schema({
    emailNotifications: {
        type: Boolean,
        default: false, // all existing users will have this by default
    },
    firstName:{
        type:String,
        required:true,
        maxLength:50,
        minLength:1,

    },
    lastName:{
        type:String
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        to:true,
        lowercase:true,
        validate(value){
            if(!isEmail(value)){
                throw new Error("EmailId is not valid")
            }
        }

    },
    //     password:{
    //         type:String,
    //         required:true,
    //         validate(value){
    //             if(!validator.isStrongPassword(value)){
    //                 throw new Error("weak password, kindly change to a stronger one..")
    //             }
    //         }
    // },

    password: {
    type: String,
    required: function() {
        return !this.googleId; // only required if not a Google user
    },
    validate: function(value) {
        if (!this.googleId && !validator.isStrongPassword(value)) {
        throw new Error("Weak password, kindly change to a stronger one.");
        }
    },
    },
    googleId: {
    type: String, // store Google ID for OAuth users
    },



    nickname:{
        type:String
    },
    address:{
        type:String
    },
    age:{
        type:Number,
        min:18,
    },
    photoUrl:{
        type:String,

    },
    skills:{
        type:[String]
    },
    about:{
        type:String,
        default:"default description is this",
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                    throw new Error("gender data is not valid");
            }
        }
    },
},{
    timestamps:true,
});

// no need for this as emailId is already unique:true
// userSchema.index({emailId:1});

const User = mongoose.model("User", userSchema);

module.exports = User;