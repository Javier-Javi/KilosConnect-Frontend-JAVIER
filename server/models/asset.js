import mongoose from "mongoose";

const assetSchema = new mongoose.Schema({
  assetId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  condition: { 
    type: String, 
    enum: ["Working", "Damaged", "Need Repair", "Under Repair"],
    default: "Working"
  },
  purchaseDate: { type: Date, required: true },
  category: String,
  quantity: { type: Number, default: 1 },
  area: { type: String }, 
  isArchived: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Asset = mongoose.model("Asset", assetSchema);