const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");

const User = require("./models/user");
const Project = require("./models/project");
const Issue = require("./models/issue");
const Comment = require("./models/comment");
const Activity = require("./models/activity");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "DevTrack API is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`DevTrack server running on port ${PORT}`);
});