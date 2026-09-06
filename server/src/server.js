const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const memberRoutes = require("./routes/memberRoutes");
const issueRoutes = require("./routes/issueRoutes");
const commentRoutes = require("./routes/commentRoutes");
const activityRoutes = require("./routes/activityRoutes");

dotenv.config();

connectDB();

const app = express();
app.use(express.json());

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/projects", memberRoutes);
app.use("/api/projects", issueRoutes);
app.use("/api/projects", commentRoutes);
app.use("/api/projects", activityRoutes);


app.get("/", (req, res) => {
  res.json({
    message: "DevTrack API is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`DevTrack server running on port ${PORT}`);
});