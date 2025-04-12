const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const {validateSignupData} = require("../utils/validator")
const bcrypt = require ("bcrypt");
const jwt = require("jsonwebtoken");



authRouter.post("/login",async(req,res)=>{    
    try{
        const {password, emailId} = req.body;
        const user = await User.findOne({ emailId:emailId });
        if(!user){
            //user not presenet in database
            throw new Error("Invalid credentials")
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);

            if(isPasswordValid){
                
                //creating a token            //expiring token
                const token = await jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn:"7d"});
                
                //               token expiring in 24 hours
                res.cookie("token",token,{
                    expires: new Date(Date.now() + 24 * 3600000),
                });
                // console.log(token);
                
                res.send(user);
            }
            else{
                throw new Error("Invalid credentials");
            }
        
    }catch(err){
            res.status(400).send("ERROR: " + err.message);
    }
})

//save a new user in the database
authRouter.post("/signup", async(req,res)=>{
    const user = new User(req.body);
    try{
    //validate the data
    validateSignupData(req);

    const{password,firstName,lastName,emailId,age,gender,skills,photoUrl} = req.body;
    //encrypt the password before storing in the database
    const passwordHash=await bcrypt.hash(password, 10);
    // console.log(passwordHash);
    
    //creating new user with pass as hash password
        const newUser = new User({
            password:passwordHash,
            firstName,
            lastName,
            emailId,
            age,
            gender,
            skills,
            photoUrl
        })

    //this saves the user data into the DB
       const user = await newUser.save();

       { 
        //creating a token              
        const token = await jwt.sign({userId: user._id}, process.env.JWT_SECRET , {expiresIn:"7d"});;
        
        //               token expiring in 24 hours
        res.cookie("token",token,{
            expires: new Date(Date.now() + 24 * 3600000),
        });
        }

        res.json({message: "User added successfully!!" , data:user});
    }catch(err){
        res.status(400).send("error in saving the user:" + err.message);
        }
    });

// Logout API
authRouter.post("/logout", (req,res)=>{
    try{
res.cookie("token", null, {
    expires: new Date(Date.now()),
})
res.send("Logout successful");
    }catch(err){
      console.log(err.message);
    }
})


module.exports = {
authRouter
}