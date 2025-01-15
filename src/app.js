const express = require("express");
const app = express();
const {authUser} = require ("./middlewares/auth");

//handle auth middleware for get, post,... requests
app.use("/admin",authUser);


app.use("/admin/getData",(req,res,next)=>{
    res.send("Namaste admin getData !!");
 }
);
app.use("/admin/deleteData",(req,res,next)=>{
    res.send("Namaste admin deleteData !!");
 }
);



app.listen(7777,()=>{
    console.log("Server is successfully listening to port 7777");
}); 
