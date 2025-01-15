const express = require("express");
const app = express();



app.use("/hello",(req,res,next)=>{
    throw new Error("hi");
    res.send("Namaste Boi Hello!!");
    console.log('go to next');
}
);
app.use("/hell",(req,res)=>{
    throw new Error("hi");
    res.send("response sent");
})

//if any error occurs in any route then this msg is sent
app.use("/",(err,req,res,next)=>{
    if(err)
    res.send("something went wrong");
})



app.listen(7777,()=>{
    console.log("Server is successfully listening to port 7777");
}); 
