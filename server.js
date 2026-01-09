require('dotenv').config();
const express =require("express");
const cookiesParser =require("cookie-parser");
const cors =require("cors");
const connectDB = require("./src/config/database/db");
const cacheInstance = require('./src/services/cache.service');

const authRoutes = require("./src/routes/auth.routes");
const resumeRoutes = require("./src/routes/resume.routes");
const aiRoutes = require("./src/routes/ai.routes");
const feedbackRoutes = require("./src/routes/feedback.routes");

const app = express();
connectDB();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true,
}));
app.use(cookiesParser());

cacheInstance.on("connect", () => {
  console.log("Redis connected successfully");
});

app.get("/", (req, res) => res.send("Server is live..."));
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/feedback", feedbackRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
