import mongoose from "mongoose";

const assetSchema = new mongoose.Schema({
  assetId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  condition: { 
    type: String, 
    // CHANGE THESE TO CAPITALIZED TO MATCH THE FRONTEND/DB
    enum: ["Working", "Damaged", "Need Repair", "Under Repair"],
    default: "Working"
  },
  purchaseDate: { type: Date, required: true },
  category: String,
  // --- UPDATED FIELDS ---
  quantity: { type: Number, default: 1 },
  area: { type: String }, // This matches the "area" field in your screenshot
  isArchived: { type: Boolean, default: false },
  // ----------------------
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Using a named export to match your controller's import
export const Asset = mongoose.model("Asset", assetSchema);