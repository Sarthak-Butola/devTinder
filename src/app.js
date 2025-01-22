const express = require("express");
const app = express();
const{connectDB} = require("./config/database");
const User = require("./models/user");
const {validateSignupData} = require("./utils/validator")
const bcrypt = require ("bcrypt");
app.use(express.json());

app.use("/hello",(req,res)=>{
    console.log("hello");
    res.send("hello");
})

//save a new user in the database
app.post("/signup", async(req,res)=>{
    const user = new User(req.body);
    try{
    //validate the data
    validateSignupData(req);

    const{password,firstName,lastName,emailId} = req.body;
    //encrypt the password before storing in the database
    const passwordHash=await bcrypt.hash(password, 10);
    console.log(passwordHash);
    //this saves the user data into the DB
        await user.save();
        res.send("User added successfully!!");
    }catch(err){
        res.status(400).send("error in saving the user:" + err.message);
        }
    });

    //GET DATA BY FIRSTNAME
 app.get("/search", async(req,res)=>{
    //req body contains the fiels like emailId,name,...
    const userName = req.body.firstName;
    console.log(userName);

    try{
    const users = await User.find({firstName : userName});
    if(users.length === 0){
        res.status(404).send("User not found");
    }
    else{
    res.send(users);
    }
    }
    catch(err){
    res.status(400).send("An error occured")
    }
 });

 //GET DATA BY ID
 app.get("/searchId", async(req,res)=>{
    //req body contains the fiels like emailId,name,...
    const userId = req.body.userId;
    console.log(userId);

    try{
    const user = await User.findById(userId);
    if(!user){
        res.status(404).send("User not found");
    }
    else{
    res.send(user);
    }
    }
    catch(err){
    res.status(400).send("An error occured");
    }
 });
                                                
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