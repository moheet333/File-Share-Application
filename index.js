const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const path = require("path");
const ejs = require("ejs");
const bodyParser = require("body-parser");

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser({ extended: true }));
// MONGODb
const connectDB = require("./config/db");
connectDB();

// Routes
app.use("/api/files", require("./routes/files"));
app.use("/files", require("./routes/show"));
app.use("/files/download", require("./routes/download"));
app.use(express.json());
// post reqs

app.listen(PORT, function () {
  console.log(`Server listening on port ${PORT}`);
});
// {
//   "file": "http://localhost:5000/files/5161b068-f024-4a93-8a65-8e33e05b8741"
// }
