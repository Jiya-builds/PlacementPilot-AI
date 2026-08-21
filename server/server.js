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


// ============================================================
// DNS
// ============================================================

dns.setServers(["8.8.8.8", "8.8.4.4"]);


// ============================================================
// APP
// ============================================================

const app = express();


// ============================================================
// CORS
// ============================================================

app.use(cors());


// ============================================================
// JSON
// ============================================================

app.use(express.json());


// ============================================================
// PATH
// ============================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// ============================================================
// UPLOADS
// ============================================================

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);


// ============================================================
// ROUTES
// ============================================================

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/resume",
  resumeRoutes
);

app.use(
  "/api/ai",
  aiRoutes
);


// ============================================================
// TEST ROUTE
// ============================================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "PlacementPilot AI Backend is running",
  });
});


// ============================================================
// DATABASE
// ============================================================

const connectDB = async () => {
  try {

    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      "✅ MongoDB Connected Successfully"
    );

  } catch (error) {

    console.error(
      "❌ MongoDB Connection Failed:",
      error.message
    );

    process.exit(1);
  }
};


// ============================================================
// START SERVER
// ============================================================

connectDB().then(() => {

  const PORT =
    process.env.PORT || 5000;

  app.listen(
    PORT,
    () => {

      console.log(
        `🚀 Server running on port ${PORT}`
      );

    }
  );

});