const express = require("express");
const requestRouter = express();
const {authUser} = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const { findById } = require("../models/user");
const User = require("../models/user");


requestRouter.post("/request/send/:status/:toUserId",authUser,async(req,res)=>{
    try{
        const user = req.user;
        const fromUserId = user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        
        const allowedStatus = ["interested", "ignored"];

        if(!allowedStatus.includes(status)){
            //INVALID STATUS
            throw new Error("Invalid Status Type: " + `'${status}'`);
        }
        //Check id toUserId is present in DB
        const isToUserIdPresent = await User.findById(toUserId);
        if(!isToUserIdPresent){
            throw new Error(`user with userId: ${toUserId} not found.`);
        } 
        
        //can't send request to oneself
        //this doesn't work with '===' but does with '==' why..??
        if(toUserId == fromUserId){ 
            throw new Error("Cannot send request to oneself");
        }

        //existing connection request must'nt be allowed to be resent
        const existingConnectionRequest = await ConnectionRequestModel.findOne({
            $or:[
                {fromUserId, toUserId},
                {fromUserId:toUserId, toUserId:fromUserId},
            ]
        })
        if(existingConnectionRequest){
            throw new Error("connection request already exists..!!");
        }

        const connectionRequest = new ConnectionRequestModel({
            fromUserId,
            toUserId,
            status
        })
    
        const data = await connectionRequest.save();
    
        res.json({
            message:"connection request sent successfully",
            data,
        });
    }catch(err){
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
    