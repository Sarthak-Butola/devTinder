const express = require("express");
const app = express();
const{connectDB} = require("./config/database")
const User = require("./models/user")

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
    } catch(err){
        res.status(400).send("error in saving the user:" + err.message);
        }
    });

