const mongoose = require("mongoose");

const connectDB = async()=>{
    // console.log(process.env.DB_CONNECTION_SECRET)

    // process.env.DB_CONNECTION_SECRET not working here.. why??
    await mongoose.connect("mongodb+srv://Wizard_Dev:NHpSsrFYEA1iI9fV@nodejs.fhvox.mongodb.net/devTinder");

};

module.exports = {
connectDB
}