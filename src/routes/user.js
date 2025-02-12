const express = require("express");
const userRouter = express();
const { authUser } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const { ConnectionStates } = require("mongoose");
const User = require("../models/user");

const USER_INFO = "firstName lastName age skills"

//get all pending connection requests for logged in user
userRouter.get("/user/requests/received",authUser, async(req, res)=>{
    try{
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequestModel.find({
            toUserId:loggedInUser._id,
            status:"interested"
        // }).populate("fromUserId", ["firstName", "lastName", "age", "skills"])
        }).populate("fromUserId", "firstName lastName age skills")

        if(!connectionRequests){
            throw new Error("No pending connection requests");
        }
        res.json({
            message:"Data fetched successfully",
            data: connectionRequests,
        })
    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }

 } 
);

//get all connections of logged in user
userRouter.get("/connections",authUser, async(req,res)=>{
  try{
    const loggedInUser = req.user;

    //find accepted connection requests in db
    const connectionRequests = await ConnectionRequestModel.find({
        $or:[
            {toUserId:loggedInUser._id, status:"accepted"},
            {fromUserId:loggedInUser._id, status:"accepted"}
        ]
    }).populate("fromUserId", USER_INFO)
      .populate("toUserId", USER_INFO);

    //mapping so that a person doesn't see themselves as a connection
    const data = connectionRequests.map((row)=>{
        if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
            return row.toUserId;
        }
        return row.fromUserId;
    })

    res.send(data);

  }catch(err){
    res.status(400).send("ERROR: " + err.message);
  }
})

// MAKING A FEED API WHICH SHOWS USERS TO LOGGED IN USER
userRouter.get("/feed", authUser, async(req,res)=>{
try{
    const loggedInUser = req.user;
   
    // IF MENTIONED INT URL THEN VALUE IS TAKEN FROM QUERY ELSE DEFAULT VALUES TAKEN FOR PAGE AND LIMIT LIKE ||1, ||10
    
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    
    //IF LIMIT > 50 KEEP IT AT MAX 50 ONLY TO NOT SLOW DOWN DB
    limit = limit > 50 ? 50 : limit;

    const skip = (page-1)*limit;

    const connectionRequests = await ConnectionRequestModel.find({
        $or: [{fromUserId: loggedInUser._id}, {toUserId:loggedInUser._id}]
    }).select("fromUserId toUserId");

    //making a set of user Ids that have to be ignored / not to be shown to the loggedInUser
    const hideUsersFromFeed = new Set();

    connectionRequests.forEach((req)=>{
        hideUsersFromFeed.add(req.fromUserId.toString());
        hideUsersFromFeed.add(req.toUserId.toString());       
    });

    // console.log(hideUsersFromFeed);

    //USERS CONTAINS USERS THAT ARENT IN HIDEUSERSFROMFEED A CONNECTION OF LOGGEDINUSER
    const users = await User.find({
        $and: [
        {_id:{$nin: Array.from(hideUsersFromFeed)}},
        {_id:{$ne: loggedInUser._id}},
        ]

    }).select(USER_INFO)
      .skip(skip)
      .limit(limit);

    res.send(users);

}catch(err){
    res.status(400).send("ERROR: " + err.message);
} 
 
})



module.exports = {
    userRouter,
}