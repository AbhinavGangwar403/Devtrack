// Express API and Socket.IO server.

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const helmet = require("helmet");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const memberRoutes = require("./routes/memberRoutes");
const issueRoutes = require("./routes/issueRoutes");
const commentRoutes = require("./routes/commentRoutes");
const activityRoutes = require("./routes/activityRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const {
  initializeSocket,
} = require("./utils/socket");

const {
  authLimiter,
  apiLimiter,
} = require("./middleware/rateLimitMiddleware");

const {
  notFound,
  errorHandler,
} = require("./middleware/errorMiddleware");

dotenv.config();

connectDB();

const app = express();

app.set("trust proxy", 1);

app.use(helmet());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
    ],
  },
});

initializeSocket(io);

app.use(express.json());
app.use(cors());
app.use("/api", apiLimiter);
app.use("/api/auth", authLimiter);
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

app.use(notFound);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT);

module.exports = {
  app,
  server,
  io,
};