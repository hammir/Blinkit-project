const mongoose = require('mongoose');

const connectDb = async ()=>{

    try {
        await mongoose.connect(`${process.env.MONGODB_URL}`);
        console.log("Connected to the database");    
    } catch (error) {
console.log("Error connecting to the database", error);
    }
    

}

module.exports = {connectDb};