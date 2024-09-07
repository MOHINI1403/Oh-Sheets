const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI)
        console.log("DB connected at: ", connect.connection.host, connect.connection.name);
    } catch (err) {
        console.log(err)
        process.exit(1)
    }
};

module.exports = connectDB;