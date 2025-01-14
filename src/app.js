const express = require("express");
const app = express();



app.get("/test",(req,res)=>{
    res.send("got Namaste test!!");
});

app.post("/test",(req,res)=>{
    res.send("posted Namaste test!!");
});

app.put("/test",(req,res)=>{
    res.send("Putted Namaste test!!");
});

app.delete("/test",(req,res)=>{
    res.send("Deleted Namaste test!!");
});

//this responds to all types get,put,delete,post etc so write below
app.use("/test",(req,res)=>{
    res.send("Namaste test!!");
});

app.use("/hello/:userId/:name/:password",(req,res)=>{
    console.log(req.params);
    const {userId, name, password} = req.params;
res.send("Namaste Boi Hello.." + ` userId:${userId}, name:${name}, pass:${password}`);
});

app.use("/hello/123",(req,res)=>{
    res.send("Namaste Boi Hello 123!! ");
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
