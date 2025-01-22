const validator = require("validator");

const validateSignupData = (req) =>{
const{firstName,lastName,emailId,password,age,gender,skills} = req.body;

if(firstName.length==0 || lastName.length == 0){
    throw new Error("kindly enter first and last names both");
}
    
}
module.exports = {
    validateSignupData,
};