const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authUser = async(req,res,next)=>{
    try{
        const cookies = req.cookies;
        const {token}=cookies;
        
        if(!token){
            throw new Error("Token isn't valid");
        }

        const decodedMsg = await jwt.verify(token,"qwerty12345678");
    
        const{userId} = decodedMsg;

        const user = await User.findById(userId); 
        if(!user){
            throw new Error("User not found");
        }
        //STORING USER RETRIEVED IN REQ
        req.user = user;
        next();
        } catch(err){
            res.status(400).send("ERROR : " + err.message);
        }
 };



 module.exports = {
    authUser,
    
 }