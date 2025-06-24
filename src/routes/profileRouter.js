const express = require("express");
const profileRouter = express();
const {authUser} = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validator");
const User = require("../models/user");
const ConnectionRequestModel = require("../models/connectionRequest");
const { Chat } = require("../models/chat");


profileRouter.patch("/profile/delete/User", authUser, async(req,res)=>{
    try{
        const {confirmation} = req.body;
        const loggedInUser = req.user;
        // console.log(loggedInUser);

        if(confirmation =="I WILLINGLY AGREE TO DELETE MY PROFILE PERMANENTLY"){ 
        const {_id} = loggedInUser;
        //THIS API IS MORE COMPLEX THAN IMAGINED IT REQUIRES FURTHER WORK AS WE ALSO HAVE TO DELETE ALL REQUEST INSTANCES FROM THE DB ELSE WE GET ERRORS / CONNECTIONS NEVER LOAD FOR SOME PROFILES

        // DELETING ALL REQUEST INSTANCES OF LOGGED IN PROFILE
        const deleteRequests = await ConnectionRequestModel.deleteMany(
            {
                $or:[
                    {fromUserId:_id},
                    {toUserId:_id},
                ]
            }
        );

        //DELETING USER DATA FROM USER DB
        const deleteUser = await User.findByIdAndDelete(_id);
         
        //DELETING ALL CHATS OG LOGGED IN USER FROM DB
        const deleteChat = await Chat.deleteMany({
            $or:[
                {participants:_id},
            ]
        })

        // EXPIRING COOKIE AFTER ACCOUNT DELETION
        res.cookie("token", null, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            expires: new Date(Date.now()),
        })

        res.send("User has been deleted successfully");
        }
        res.send("confirmation message is not correct");

    }catch(err){
        console.log(err.message);
    }
})


profileRouter.patch("/profile/edit",authUser, async(req,res)=>{
    try{
        if(!validateEditProfileData(req)){
            throw new Error("Invalid Edit");
        }
        const loggedInUser = req.user;
        // console.log(loggedInUser);

        //saving loggedInUser values as req.user values/edited values sent by user
        Object.keys(req.body).forEach((key)=>(loggedInUser[key] = req.body[key]));


        //saving in DB
        await loggedInUser.save();

        // console.log(loggedInUser);
        res.json({massage: loggedInUser.firstName + "'s Profile has been updated successfully",
                data:loggedInUser});

    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
})


profileRouter.get("/profile",authUser,async(req,res)=>{
    try{
    const user = req.user;
    res.send(user);

    } catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
})


module.exports = profileRouter;