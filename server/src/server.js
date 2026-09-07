const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const memberRoutes = require("./routes/memberRoutes");
const issueRoutes = require("./routes/issueRoutes");
const commentRoutes = require("./routes/commentRoutes");
const activityRoutes = require("./routes/activityRoutes");
const {initializeSocket,} = require("./utils/socket");

const analyticsRoutes = require("./routes/analyticsRoutes");


dotenv.config();

connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  },
});

initializeSocket(io);

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/projects", memberRoutes);
app.use("/api/projects", issueRoutes);
app.use("/api/projects", commentRoutes);
app.use("/api/projects", activityRoutes);
app.use("/api/projects", analyticsRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "DevTrack API is running",
  });
});


const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`DevTrack server running on port ${PORT}`);
});

module.exports = {
  app,
  server,
  io,
};