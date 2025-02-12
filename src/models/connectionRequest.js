const mongoose  = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({

    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
    },
    status:{
        type:String,
        required:true,
        // THIS BASICALLY WORKS LIKE A VALIDATOR WHICH SENDS MESSAGE IF VALUE IS NOT PRESENT IN VALUES:[]
        enum:{
                values:["ignore","interested","accepted","rejected"],
                message:`incorrect status type`
        }
    }
},
{
    timestamps:true
})

connectionRequestSchema.index({fromUserId:1, toUserId:1});

const ConnectionRequestModel = new mongoose.model(
    "connectionRequest",
    connectionRequestSchema
);

module.exports = ConnectionRequestModel;