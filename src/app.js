const express = require("express");
const app = express();
const{connectDB} = require("./config/database");
const User = require("./models/user");
const {validateSignupData} = require("./utils/validator")
const bcrypt = require ("bcrypt");
const cookieParser = require("cookie-parser"); 
const jwt = require("jsonwebtoken");
const {authUser} = require("./middlewares/auth");
const {authRouter} = require("./routes/Auth");
const profileRouter = require("./routes/profileRouter");
const requestRouter = require("./routes/requestRouter");


app.use(cookieParser());
app.use(express.json());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

app.use("/hello",(req,res)=>{
    console.log("hello");
    res.send("hello");
})  

//Moved in routes
//login api
//save a new user in the database / Signup API

//Moved in routes
//get user profile
// app.get("/profile",authUser,async(req,res)=>{
//     try{
//     const user = req.user;
//     res.send(user);

//     } catch(err){
//         res.status(400).send("ERROR : " + err.message);
//     }
// })

    //GET DATA BY FIRSTNAME
//  app.get("/search", async(req,res)=>{
//     //req body contains the fiels like emailId,name,...
//     const userName = req.body.firstName;
//     console.log(userName);

//     try{
//     const users = await User.find({firstName : userName});
//     if(users.length === 0){
//         res.status(404).send("User not found");
//     }
//     else{
//     res.send(users);
//     }
//     }
//     catch(err){
//     res.status(400).send("An error occured")
//     }
//  });

//  //GET DATA BY ID
//  app.get("/searchId", async(req,res)=>{
//     //req body contains the fiels like emailId,name,...
//     const userId = req.body.userId;
//     console.log(userId);

//     try{
//     const user = await User.findById(userId);
//     if(!user){
//         res.status(404).send("User not found");
//     }
//     else{
//     res.send(user);
//     }
//     }
//     catch(err){
//     res.status(400).send("An error occured");
//     }
//  });
                                                
 //delete user api
 app.delete("/delUser", async(req,res)=>{
    //req body contains the fiels like emailId,name,...
    const userId = req.body._id;
    console.log(userId);
    try{
    const user = await User.findByIdAndDelete(userId);
    res.send("User successfully deleted");
    }
    catch(err){
    res.status(400).send("Something went wrong!");
    }
 });

//UPDATE USER
app.patch("/updateUser",async(req,res)=>{
    const userId = req.body.userId;
    const data = req.body;
    console.log(userId);
    console.log(data);
    try{
        if(data.skills.length > 10){
            //this will now throw ans error & has a custom message as written in " " ans can be catched in catch block & then displayed
            throw new Error("skill count must be <= 10");
        }
        const user = await User.findByIdAndUpdate(userId, data,{runValidators:true});
        res.send("user updated successfuly!!");
    }
    catch(err){
        res.status(400).send("An error occured: " + err.message);
    }
})

//moved to
//post api

connectDB()
.then(()=>{    
    console.log("successfully connected to the database");
    app.listen(7777,()=>{
        console.log("Server is successfully listening to port 7777");
    });

    })
    .catch((err)=>{
    console.log("An error occured :/");
    })