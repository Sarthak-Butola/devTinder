const express = require("express");
const requestRouter = express();
const {authUser} = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const { findById } = require("../models/user");
const User = require("../models/user");
const { sendNotificationEmail } = require("../utils/emailService");


requestRouter.post("/request/send/:status/:toUserId", authUser, async (req, res) => {
  try {
    const user = req.user;
    const fromUserId = user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const allowedStatus = ["interested", "ignore"];

    if (!allowedStatus.includes(status)) {
      throw new Error("Invalid Status Type: " + `'${status}'`);
    }

    // Check if toUserId is valid
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      throw new Error(`User with userId: ${toUserId} not found.`);
    }

    if (toUserId == fromUserId) {
      throw new Error("Cannot send request to oneself");
    }

    // Check if request already exists
    const existingConnectionRequest = await ConnectionRequestModel.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ]
    });
    if (existingConnectionRequest) {
      throw new Error("Connection request already exists!");
    }

    // Save request
    const connectionRequest = new ConnectionRequestModel({
      fromUserId,
      toUserId,
      status
    });

    const data = await connectionRequest.save();

    // ✅ Send email only if 'interested' and user allows email
    

if (status === "interested" && toUser.emailNotifications && toUser.emailId) {
  sendNotificationEmail(toUser.emailId, toUser.firstName, user.firstName)
    .then(() => console.log("Email sent"))
    .catch((emailErr) => console.error("Email sending failed:", emailErr.message));
}



    res.json({
      message: "Connection request sent successfully",
      data,
    });

  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});




requestRouter.post("/request/review/:status/:requestId",authUser,async(req,res)=>{
        try{
            const loggedInUser = req.user;
            const{status, requestId} = req.params;
            
            const allowedStatus = ["accepted", "rejected"];
            if(!allowedStatus.includes(status)){
                return res.status(400).json({message:`status '${status}' is not allowed!!`});
            }

            //connection req exists or not
            const connectionRequest = await ConnectionRequestModel.findOne({
                _id:requestId,
                toUserId:loggedInUser._id,
                status:"interested"
            })
            if(!connectionRequest){
                return res.status(404).json({message:"connection request not found"});
            }

            //request found then update its status and save in the DB
            connectionRequest.status = status;

            //update changes in the DB
            const data = await connectionRequest.save();

            res.json({message: "connection request " + status , data})

        }catch(err){
            res.status(400).send("ERROR: " + err.message);
        }
    });


    module.exports =requestRouter;
    