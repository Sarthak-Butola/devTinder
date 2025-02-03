const mongoose  = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({

    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
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

const ConnectionRequestModel = new mongoose.model(
    "connectionRequest",
    connectionRequestSchema
);

module.exports = ConnectionRequestModel;