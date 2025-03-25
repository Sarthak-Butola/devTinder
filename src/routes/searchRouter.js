const express = require("express");
const searchRouter = express();
const {authUser} = require("../middlewares/auth");
const User = require("../models/user");

//finding all guys named as searched by the user
searchRouter.get("/search/:toUserName",authUser , async(req,res)=>{
    const toUserName = req.params.toUserName;
    try{
        const user = await User.find({firstName:toUserName});
        console.log(user);
        res.send(user);

    }catch(err){
        res.status(400).send(err.message);
    }
})

module.exports = searchRouter;