const mongoose = require("mongoose");

const connectDB = async()=>{
    await mongoose.connect(
        "mongodb+srv://Wizard_Dev:NHpSsrFYEA1iI9fV@nodejs.fhvox.mongodb.net/devTinder"
    );
};

module.exports = {
connectDB
}