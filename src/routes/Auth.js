const express = require("express");
const userRouter = express.Router();
const User = require("../models/user");
const {validateSignupData} = require("../utils/validator")
const bcrypt = require ("bcrypt");
const jwt = require("jsonwebtoken");



userRouter.post("/login",async(req,res)=>{    
    try{
        const {password, emailId} = req.body;
        const user = await User.findOne({ emailId:emailId });
        if(!user){
            //user not presenet in database
            throw new Error("Invalid credentials")
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);

            if(isPasswordValid){
                
                //creating a token                                              //expiring token
                const token = await jwt.sign({userId: user._id}, "qwerty12345678", {expiresIn:"7d"});
                
                //               token expiring in 24 hours
                res.cookie("token",token,{
                    expires: new Date(Date.now() + 24 * 3600000),
                });
                console.log(token);
                
                res.send("login successful");
            }
            else{
                throw new Error("Invalid credentials");
            }
        
    }catch(err){
            res.status(400).send("ERROR: " + err.message);
    }
})

//save a new user in the database
userRouter.post("/signup", async(req,res)=>{
    const user = new User(req.body);
    try{
    //validate the data
    validateSignupData(req);

    const{password,firstName,lastName,emailId,age,gender,skills} = req.body;
    //encrypt the password before storing in the database
    const passwordHash=await bcrypt.hash(password, 10);
    console.log(passwordHash);
    
    //creating new user with pass as hash password
        const newUser = new User({
            password:passwordHash,
            firstName,
            lastName,
            emailId,
            age,
            gender,
            skills
        })

    //this saves the user data into the DB
        await newUser.save();
        res.send("User added successfully!!");
    }catch(err){
        res.status(400).send("error in saving the user:" + err.message);
        }
    });

module.exports = {
userRouter
}