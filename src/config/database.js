const mongoose = require("mongoose");

const connectDB = async()=>{
    // console.log(process.env.DB_CONNECTION_SECRET)

    // process.env.DB_CONNECTION_SECRET not working here.. why??
    //now working :)
    await mongoose.connect(process.env.DB_CONNECTION_SECRET);

};

module.exports = {
connectDB
}