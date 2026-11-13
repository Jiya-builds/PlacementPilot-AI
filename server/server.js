
import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dns from "dns";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();

// Allowed frontend origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://placement-pilot-ai-dbx5.vercel.app"
];

// CORS Middleware
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Body Parser
app.use(express.json());

// File paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Static uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/ai", aiRoutes);

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected Successfully");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err.message);
    process.exit(1);
  }
};

// Start Server
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
