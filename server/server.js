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
  // UPDATED: Added enum validation to match frontend dropdown options
  unit: { 
    type: String, 
    enum: ['liters', 'pcs', 'box', 'pack', 'bottle', 'can', 'other'], 
    default: "pcs" 
  },
  quantity: { type: Number, default: 0 },
  lowStockAlert: { type: Number, default: 0 },
  location: { type: String },
  isArchived: { type: Boolean, default: false }
}, { timestamps: true });

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  area: { type: String, required: true }, // "Powerlifting", etc.
  priority: { type: String, enum: ["High", "Medium", "Low"], default: "Medium" },
  frequency: { type: String, enum: ["Daily", "Weekly", "Monthly"], required: true },
  dayType: { type: String, default: "All" },
  shift: { type: String, enum: ["AM", "PM"], default: "AM" },
  startTime: Number, // 320
  endTime: Number,   // 360
  status: { type: String, enum: ["Completed", ""], default: "Completed" },
  isBreak: { type: Boolean, default: false },
  isArchived: { type: Boolean, default: false },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
  completedAt: String
}, { timestamps: true });



const Task = mongoose.model("Task", taskSchema);
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
        const assets = await Asset.find({ isArchived: false });
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
        if (!asset) {
          console.error(`Asset with ID ${req.params.id} not found`);
          return res.status(404).json({ error: "Asset not found" });
        }
        res.json(asset);
      } catch (err) { 
        console.error("Patch Asset Error:", err.message);
        res.status(400).json({ error: err.message }); 
      }
    });

    // ─── CONSUMABLE ROUTES ───
    app.get("/api/consumables", async (req, res) => {
      try {
        const consumables = await Consumable.find({ isArchived: false });
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
        if (!consumable) {
          console.error(`Consumable with ID ${req.params.id} not found`);
          return res.status(404).json({ error: "Consumable not found" });
        }
        res.json(consumable);
      } catch (err) { 
        console.error("Patch Consumable Error:", err.message);
        res.status(400).json({ error: err.message }); 
      }
    });

    // ─── SUMMARY ROUTE ───
    app.get("/api/inventory/summary", async (req, res) => {
      try {
        const [assets, consumables] = await Promise.all([
          Asset.find({ isArchived: false }),
          Consumable.find({ isArchived: false })
        ]);
        
        const combined = [
          ...assets.map(a => ({ ...a.toObject(), type: 'Asset' })),
          ...consumables.map(c => ({ ...c.toObject(), type: 'Consumable' }))
        ];

        combined.sort((a, b) => a.name.localeCompare(b.name));
        res.json(combined);
      } catch (err) {
        console.error("Summary error:", err);
        res.status(500).json({ error: "Could not compile inventory summary" });
      }
    });

// ─── TASKS ROUTE ───
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({ isArchived: false }).sort({ startTime: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add this to your backend routes
app.post('/api/tasks', async (req, res) => {
  try {
    const { title, frequency, area, startTime, endTime, date, status } = req.body;
    
    // Create a new task object (matches your Task interface)
    const newTask = new Task({
      title,
      frequency,
      area,
      startTime,
      endTime,
      date,
      status: status || 'Completed',
      isArchived: false // Matches the archiving logic from InventoryPage[cite: 1]
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.patch("/api/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


    app.listen(5000, () => console.log("🚀 Server running on port 5000"));
  } catch (err) {
    console.error("❌ Connection Error:", err);
  }
}

startServer();