  import express from "express";
  import cors from "cors";
  import mongoose from "mongoose";
  import dotenv from "dotenv";

  // 1. Update these imports to include the "create" functions from your controllers

  import { getAllConsumables, createConsumable } from "./controllers/consumablesController.js";
  import { getAllAssets, createAsset, updateAsset } from "./controllers/assetController.js";
  dotenv.config();

  const app = express();
  app.use(cors({ origin: "http://localhost:5173" }));
  app.use(express.json());

  // ─── DATABASE CONNECTION ──────────────────────────────
  async function startServer() {
    try {
      await mongoose.connect(process.env.KILOS_DATABASE_URI);
      console.log("✅ Connected to MongoDB via Mongoose");

      // ─── ROUTES ──────────────────────────────────────────
      
      // Asset Routes
      app.get("/api/assets", getAllAssets);
      
      // Consumable Routes
      app.get("/api/consumables", getAllConsumables);
      
      
      // 2. Add this POST route to handle adding new items
      app.post("/api/consumables", createConsumable);
      app.post("/api/assets", createAsset);
      
      app.patch("/api/assets/:id", updateAsset);

      app.listen(5000, () => console.log("🚀 Server running on port 5000"));
    } catch (err) {
      console.error("❌ Connection Error:", err);
      process.exit(1);
    }
  }

  startServer();