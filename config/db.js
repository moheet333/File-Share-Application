const mongoose = require("mongoose");
require("dotenv").config();

function connectDB() {
  mongoose.connect(process.env.MONGODB, {});
  const connection = mongoose.connection;
  connection
    .once("open", () => {
      console.log("Database connected Successfully!");
    })
    .on("error", function (err) {
      console.log("Connection Failed to Database!");
    });
}

module.exports = connectDB;
