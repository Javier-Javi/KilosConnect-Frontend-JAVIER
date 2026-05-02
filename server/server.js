import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// ─── SCHEMAS & MODELS ──────────────────────────────────

const assetSchema = new mongoose.Schema({
  assetId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  condition: { 
    type: String, 
    enum: ["Working", "Damaged", "Need Repair", "Under Repair"],
    default: "Working"
  },
  purchaseDate: { type: Date, default: Date.now },
  category: String,
  quantity: { type: Number, default: 1 },
  area: { type: String }, 
  isArchived: { type: Boolean, default: false }
}, { timestamps: true });

const consumableSchema = new mongoose.Schema({
  consumableId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String },
  unit: { type: String, default: "pcs" },
  quantity: { type: Number, default: 0 },
  lowStockAlert: { type: Number, default: 0 },
  location: { type: String },
  isArchived: { type: Boolean, default: false }
}, { timestamps: true });

const Asset = mongoose.model("Asset", assetSchema);
const Consumable = mongoose.model("Consumable", consumableSchema);

// ─── DATABASE CONNECTION & SERVER START ────────────────

async function startServer() {
  try {
    await mongoose.connect(process.env.KILOS_DATABASE_URI);
    console.log("✅ Connected to MongoDB");

    // ─── ASSET ROUTES ───
    app.get("/api/assets", async (req, res) => {
      try {
        const assets = await Asset.find();
        res.json(assets);
      } catch (err) { res.status(500).json({ error: err.message }); }
    });

    app.post("/api/assets", async (req, res) => {
      try {
        const asset = new Asset(req.body);
        await asset.save();
        res.status(201).json(asset);
      } catch (err) { res.status(400).json({ error: err.message }); }
    });

    app.patch("/api/assets/:id", async (req, res) => {
      try {
        const asset = await Asset.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(asset);
      } catch (err) { res.status(400).json({ error: err.message }); }
    });

    // ─── CONSUMABLE ROUTES ───
    app.get("/api/consumables", async (req, res) => {
      try {
        const consumables = await Consumable.find();
        res.json(consumables);
      } catch (err) { res.status(500).json({ error: err.message }); }
    });

    app.post("/api/consumables", async (req, res) => {
      try {
        const consumable = new Consumable(req.body);
        await consumable.save();
        res.status(201).json(consumable);
      } catch (err) { res.status(400).json({ error: err.message }); }
    });

    app.patch("/api/consumables/:id", async (req, res) => {
      try {
        const consumable = await Consumable.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(consumable);
      } catch (err) { res.status(400).json({ error: err.message }); }
    });

    // ─── SUMMARY ROUTE (The one causing the error) ───
    app.get("/api/inventory/summary", async (req, res) => {
      try {
        const [assets, consumables] = await Promise.all([
          Asset.find(),
          Consumable.find()
        ]);
        
        // Combine and tag them so the frontend can distinguish styles
        const combined = [
          ...assets.map(a => ({ ...a.toObject(), type: 'Asset' })),
          ...consumables.map(c => ({ ...c.toObject(), type: 'Consumable' }))
        ];

        // Sort alphabetically by name
        combined.sort((a, b) => a.name.localeCompare(b.name));
        
        res.json(combined);
      } catch (err) {
        console.error("Summary error:", err);
        res.status(500).json({ error: "Could not compile inventory summary" });
      }
    });

    app.listen(5000, () => console.log("🚀 Server running on port 5000"));
  } catch (err) {
    console.error("❌ Connection Error:", err);
  }
}

startServer();