const express = require("express");
const profileRouter = express();
const {authUser} = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validator");


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