const express = require("express");
const app = express();
const{connectDB} = require("./config/database");
const User = require("./models/user");
const {validateSignupData} = require("./utils/validator")
const bcrypt = require ("bcrypt");
const cookieParser = require("cookie-parser"); 
const jwt = require("jsonwebtoken");
const {authUser} = require("./middlewares/auth");
const {userRouter} = require("./routes/Auth");

app.use(cookieParser());
app.use(express.json());

app.use("/", userRouter);

app.use("/hello",(req,res)=>{
    console.log("hello");
    res.send("hello");
})  

// //login api
// app.post("/login",async(req,res)=>{    
//     try{
//         const {password, emailId} = req.body;
//         const user = await User.findOne({ emailId:emailId });
//         if(!user){
//             //user not presenet in database
//             throw new Error("Invalid credentials")
//         }
//         const isPasswordValid = await bcrypt.compare(password, user.password);

//             if(isPasswordValid){
                
//                 //creating a token                                              //expiring token
//                 const token = await jwt.sign({userId: user._id}, "qwerty12345678", {expiresIn:"7d"});
                
//                 //               token expiring in 24 hours
//                 res.cookie("token",token,{
//                     expires: new Date(Date.now() + 24 * 3600000),
//                 });
//                 console.log(token);
                
//                 res.send("login successful");
//             }
//             else{
//                 throw new Error("Invalid credentials");
//             }
        
//     }catch(err){
//             res.status(400).send("ERROR: " + err.message);
//     }
// })

// //save a new user in the database
// app.post("/signup", async(req,res)=>{
//     const user = new User(req.body);
//     try{
//     //validate the data
//     validateSignupData(req);

//     const{password,firstName,lastName,emailId,age,gender,skills} = req.body;
//     //encrypt the password before storing in the database
//     const passwordHash=await bcrypt.hash(password, 10);
//     console.log(passwordHash);
    
//     //creating new user with pass as hash password
//         const newUser = new User({
//             password:passwordHash,
//             firstName,
//             lastName,
//             emailId,
//             age,
//             gender,
//             skills
//         })

//     //this saves the user data into the DB
//         await newUser.save();
//         res.send("User added successfully!!");
//     }catch(err){
//         res.status(400).send("error in saving the user:" + err.message);
//         }
//     });

//get user profile
app.get("/profile",authUser,async(req,res)=>{
    try{
    const user = req.user;
    res.send(user);

    } catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
})

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



//post api
app.post("/post",authUser,async(req,res)=>{
const user = req.user;

//sending connection request
console.log("connection req sent");
// console.log(user);
res.send(user.firstName + " sent a connection request");

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