const validator = require("validator");

const validateSignupData = (req) =>{
const{firstName,lastName,emailId,password,age,gender,skills} = req.body;

if(firstName.length==0 || lastName.length == 0){
    throw new Error("kindly enter first and last names both");
}



}


const validateEditProfileData = (req)=>{
    const allowedEditFields = [
        "firstName",
        "lastName",
        "gender",
        "skills",
        "age",
        "about",
        "photoUrl"
    ];

    const isEditAllowed = Object.keys(req.body).every((field)=>
        allowedEditFields.includes(field)
        );
        return isEditAllowed;
}

module.exports = {
    validateSignupData,
    validateEditProfileData,
};