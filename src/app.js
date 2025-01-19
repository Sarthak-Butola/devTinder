const express = require("express");
const app = express();
const{connectDB} = require("./config/database");
const User = require("./models/user");

app.use(express.json());

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

app.use("/hello",(req,res)=>{
    console.log("hello");
    res.send("hello");
})

app.post("/signup", async(req,res)=>{
    const user = new User(req.body);
    try{
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
        const user = await User.findByIdAndUpdate(userId, data);
        res.send("user updated successfuly!!");
    }catch(err){
        res.status(400).send("An error occured");
    }
})