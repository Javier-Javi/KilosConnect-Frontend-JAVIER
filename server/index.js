import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Import your specific controllers
import { getAllAssets } from "./controllers/assetController.js";
import { getAllConsumables } from "./controllers/consumablesController.js";

dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// ─── DATABASE CONNECTION ──────────────────────────────
async function startServer() {
  try {
    await mongoose.connect(process.env.KILOS_DATABASE_URI);
    console.log("✅ Connected to MongoDB via Mongoose");

    // ─── ROUTES LINKED TO YOUR CONTROLLERS ────────────────
    // These routes will now use the logic seen in your images
    app.get("/api/assets", getAllAssets);
    app.get("/api/consumables", getAllConsumables);

    app.listen(5000, () => console.log("🚀 Server running on port 5000"));
  } catch (err) {
    console.error("❌ Connection Error:", err);
    process.exit(1);
  }
}

startServer();




