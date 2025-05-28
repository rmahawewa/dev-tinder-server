const mongoose = require("mongoose");

// Connect to the mongo db cluster
const connectDB = async () => {
	console.log(process.env.DB_CONNECTION_SECRET);
	await mongoose.connect(process.env.DB_CONNECTION_SECRET);
};

module.exports = connectDB;
