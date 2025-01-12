const express = require("express");
const app = express();


app.use("/test",(req,res)=>{
    res.send("Namaste test!!");
});
app.use("/hello",(req,res)=>{
    res.send("Namaste Boi Hello!!");
});

app.use("/" , (req,res)=>{
    res.send("Namaste Boi!!");
});

app.listen(7777,()=>{
    console.log("Server is successfully listening to port 7777");
});
