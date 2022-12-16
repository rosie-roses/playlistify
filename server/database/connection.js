const mongoose = require('mongoose');

const connectDB = () => {
    try {
        //MongoDB connection string.
        mongoose.set("strictQuery", false);
        mongoose.connect(process.env.MONGO_URI, () => {
            console.log("Connected to MongoDB.");
        });
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

module.exports = connectDB;