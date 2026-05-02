import React, { useState, useEffect } from "react";
import { SidebarNavigationSection } from "../components/SidebarNavigationSection";
import { X, Info, CheckCircle2, AlertCircle, Wrench, Clock } from "lucide-react";
// Import the API services
import { inventoryService } from "../services/InventoryServices";

// --- Types updated to match your MongoDB Schema ---
interface InventoryItemData {
  _id: string;
  consumableId: string;
  name: string;
  category: string;
  lowStockAlert: number;
  quantity: number;
  unit: string;
  location: string;
}

interface EquipmentAsset {
  _id: string;
  assetId: string;
  name: string;
  condition: "Working" | "Damaged" | "Need Repair" | "Under Repair";
  area: string; // Matches 'area' field in your database
  purchaseDate: string;
}

export const InventoryPage: React.FC = () => {
  const [consumables, setConsumables] = useState<InventoryItemData[]>([]);
  const [assets, setAssets] = useState<EquipmentAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<"Consumables" | "Assets">("Consumables");

  // --- Asset State ---
  const [selectedAsset, setSelectedAsset] = useState<EquipmentAsset | null>(null);

  // --- Consumable Update State ---
  const [selectedConsumable, setSelectedConsumable] = useState<InventoryItemData | null>(null);
  const [newQuantity, setNewQuantity] = useState<number>(0);

  // --- Search State ---
  const [searchQuery, setSearchQuery] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    location: "", // Used for both location (consumables) and area (assets)
    lowStockAlert: ""
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [assetsData, consumablesData] = await Promise.all([
        inventoryService.fetchAssets(),
        inventoryService.fetchConsumables()
      ]);
      setAssets(assetsData);
      setConsumables(consumablesData);
    } catch (err: any) {
      console.error("Error fetching inventory:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleConditionUpdate = async (newCondition: string) => {
    if (!selectedAsset) return;
    try {
      await inventoryService.updateAssetCondition(selectedAsset._id, newCondition);
      setSelectedAsset(null);
      fetchData();
    } catch (err: any) {
      console.error("Network error:", err);
      alert(err.message || "Could not connect to the server.");
    }
  };

  const handleQuantityUpdate = async () => {
    if (!selectedConsumable) return;
    try {
      await inventoryService.updateConsumableQuantity(selectedConsumable._id, newQuantity);
      setSelectedConsumable(null);
      fetchData();
    } catch (err: any) {
      console.error("Network error:", err);
      alert(err.message || "Could not connect to the server.");
    }
  };

  const filteredConsumables = consumables.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredAssets = assets.filter(asset =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.assetId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (asset.area && asset.area.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddItem = async () => {
    if (!formData.name) {
      alert("Please enter an item name");
      return;
    }
    const isAsset = activeCategory === "Assets";
    const idPrefix = isAsset ? "AST" : "CON";

    const bodyData = {
      [isAsset ? 'assetId' : 'consumableId']: `${idPrefix}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      name: formData.name,
      quantity: Number(formData.quantity) || 0,
      category: activeCategory,
      [isAsset ? 'area' : 'location']: formData.location,
      lowStockAlert: Number(formData.lowStockAlert) || 0,
      condition: "Working",
      purchaseDate: new Date().toISOString(),
      isArchived: false
    };

    try {
      if (isAsset) {
        await inventoryService.addAsset(bodyData);
      } else {
        await inventoryService.addConsumable(bodyData);
      }

      setIsModalOpen(false);
      setFormData({ name: "", quantity: "", location: "", lowStockAlert: "" });
      fetchData();
    } catch (err: any) {
      console.error("Network error:", err);
      alert(err.message || "Could not connect to the server.");
    }
  };

  const isLowStock = (item: InventoryItemData) => {
    return item.quantity > 0 && item.quantity <= (item.lowStockAlert || 0);
  };

  const isOutOfStock = (item: InventoryItemData) => {
    return item.quantity === 0;
  };

  const lowStockItems = consumables.filter(isLowStock);
  const outOfStockItems = consumables.filter(isOutOfStock);

  return (
    <div className="flex h-screen bg-[#f4f5f6] overflow-hidden relative">
      <SidebarNavigationSection />

      <div className="flex flex-col flex-1 min-w-0 ml-[240px] overflow-y-auto">
        <header className="flex flex-wrap items-center justify-between px-4 md:px-8 py-6 gap-4">
          <h1 className="[font-family:'Poppins',Helvetica] font-semibold text-[#1f1f1f] text-2xl md:text-[36px]">
            Inventory
          </h1>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </button>
            <div className="w-10 h-10 rounded-full border-2 border-gray-300 overflow-hidden shrink-0">
              <img src="https://c.animaapp.com/C3N4JJvt/img/profile@2x.png" alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        <div className="px-4 md:px-8 pb-8">
          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-xl">Error: {error}</div>
          )}

          {activeCategory === "Consumables" && (lowStockItems.length > 0 || outOfStockItems.length > 0) && (
            <div className="mb-6 flex items-start gap-4 p-4 bg-[#fff5f5] border border-[#feb2b2] rounded-xl animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e53e3e" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-[#c53030] text-lg">Inventory Alert</h3>
                <p className="text-[#e53e3e] text-sm">
                  {outOfStockItems.length} out of stock and {lowStockItems.length} low stock items.
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col flex-1 gap-6">
            <div className="flex-1 bg-white rounded-3xl p-4 md:p-8 border border-[#e8e8e8] shadow-sm min-w-0">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h2 className="text-xl md:text-2xl font-semibold text-[#1f1f1f]">Inventory Overview</h2>
                
                <div className="flex gap-6">
                  {activeCategory === "Consumables" ? (
                    <>
                      <div className="text-center">
                        <div className="text-red-500 font-bold text-lg leading-none">{outOfStockItems.length}</div>
                        <div className="text-[10px] text-[#6b6b6b] uppercase font-bold">Out of Stock</div>
                      </div>
                      <div className="text-center">
                        <div className="text-orange-400 font-bold text-lg leading-none">{lowStockItems.length}</div>
                        <div className="text-[10px] text-[#6b6b6b] uppercase font-bold">Low Stock</div>
                      </div>
                    </>
                  ) : (
                    <>
                      {[
                        { label: "Damaged", val: assets.filter(a => a.condition === "Damaged").length, color: "text-red-500" },
                        { label: "Need Repair", val: assets.filter(a => a.condition === "Need Repair").length, color: "text-orange-400" },
                        { label: "Under Repair", val: assets.filter(a => a.condition === "Under Repair").length, color: "text-blue-500" },
                      ].map((stat, i) => (
                        <div key={i} className="text-center">
                          <div className={`text-lg font-bold ${stat.color}`}>{stat.val}</div>
                          <div className="text-[10px] text-gray-500 uppercase font-bold leading-tight">{stat.label}</div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>

              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setActiveCategory("Consumables")}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeCategory === "Consumables" ? "bg-[#0a2e27] text-white" : "bg-[#d1d1d1] text-[#6b6b6b]"}`}
                >
                  Consumables
                </button>
                <button
                  onClick={() => setActiveCategory("Assets")}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeCategory === "Assets" ? "bg-[#0a2e27] text-white" : "bg-[#d1d1d1] text-[#6b6b6b]"}`}
                >
                  Assets
                </button>
              </div>

              <h3 className="text-lg font-semibold mb-4 text-[#1f1f1f]">
                {activeCategory === "Consumables" ? "Maintenance Supplies" : "Equipment Assets"}
              </h3>

              <div className="flex flex-col md:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b6b6b" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                  </span>
                  <input
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#e8e8e8] focus:outline-none focus:border-[#0a2e27] transition-colors"
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-[#0a2e27] text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-medium text-sm hover:bg-[#08241f] transition-colors"
                >
                  <span className="text-lg">+</span> Add Item
                </button>
              </div>

              <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                <div className="space-y-3">
                  {loading ? (
                    <div className="py-10 text-center text-gray-400 animate-pulse">Loading items...</div>
                  ) : activeCategory === "Consumables" ? (
                    filteredConsumables.length > 0 ? (
                      filteredConsumables.map((item) => {
                        const low = isLowStock(item);
                        const out = isOutOfStock(item);
                        return (
                          <div
                            key={item._id}
                            onClick={() => {
                              setSelectedConsumable(item);
                              setNewQuantity(item.quantity);
                            }}
                            className={`flex items-center justify-between p-4 bg-white border rounded-xl hover:shadow-md transition-all cursor-pointer group ${(low || out) ? "border-[#feb2b2] shadow-[0_0_10px_rgba(254,178,178,0.2)]" : "border-[#e8e8e8]"}`}
                          >
                            <div className="flex items-center gap-3 md:gap-4 min-w-0">
                              <div className={`w-10 h-10 flex items-center justify-center rounded-lg shrink-0 ${(low || out) ? "bg-[#fff5f5]" : "bg-[#f4f5f6]"}`}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={(low || out) ? "#e53e3e" : "#6b6b6b"} strokeWidth="2">
                                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                </svg>
                              </div>
                              <div className="truncate">
                                <div className="flex items-center gap-2">
                                  <h4 className={`font-semibold text-base md:text-lg truncate ${(low || out) ? "text-[#c53030]" : "text-[#1f1f1f]"}`}>{item.name}</h4>
                                  {out ? (
                                    <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded uppercase">Out of Stock</span>
                                  ) : low ? (
                                    <span className="px-2 py-0.5 bg-[#fff5f5] text-[#e53e3e] text-[10px] font-bold rounded uppercase">Low Stock</span>
                                  ) : null}
                                </div>
                                <p className="text-xs md:text-sm text-[#6b6b6b] truncate">Category: {item.category || "Uncategorized"} • Min: {item.lowStockAlert}</p>
                              </div>
                            </div>
                            <div className="text-right shrink-0 ml-4">
                              <div className={`text-xl md:text-2xl font-bold ${(low || out) ? "text-[#c53030]" : "text-[#1f1f1f]"}`}>{item.quantity}</div>
                              <div className="text-[10px] text-[#6b6b6b] uppercase tracking-wider font-bold">{item.unit || "pcs"}</div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="py-10 text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">No consumables found.</div>
                    )
                  ) : (
                    filteredAssets.length > 0 ? (
                      filteredAssets.map((asset) => (
                        <div
                          key={asset._id}
                          onClick={() => setSelectedAsset(asset)}
                          className="flex items-center justify-between p-4 bg-white border border-[#e8e8e8] rounded-xl hover:shadow-md transition-all cursor-pointer group mb-3"
                        >
                          <div className="flex items-center gap-3 md:gap-4 min-w-0">
                            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#f4f5f6] group-hover:bg-[#0a2e27] transition-colors">
                              <svg className="group-hover:stroke-white transition-colors" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b6b6b" strokeWidth="2"><path d="M20 7h-9m3 10h5M3 7h2m4 0h2m0 10H3m8-10v10M7 7v10" /></svg>
                            </div>
                            <div className="truncate">
                              <h4 className="font-semibold text-base md:text-lg text-[#1f1f1f] truncate group-hover:text-[#0a2e27]">{asset.name}</h4>
                              {/* Using .area from your MongoDB schema */}
                              <p className="text-xs md:text-sm text-[#6b6b6b]">ID: {asset.assetId} • {asset.area || "Unassigned"}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${asset.condition === 'Working' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {asset.condition}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-10 text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">No assets found.</div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL: Update Asset Condition --- */}
      {selectedAsset && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-[400px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-[#0a2e27] p-5 flex justify-between items-center">
               <div>
                  <h3 className="text-white font-bold">{selectedAsset.name}</h3>
                  <p className="text-white/70 text-xs">{selectedAsset.assetId}</p>
               </div>
               <button onClick={() => setSelectedAsset(null)} className="text-white/70 hover:text-white">
                  <X size={20} />
               </button>
            </div>
            <div className="p-6 space-y-3">
              <p className="text-sm font-semibold text-gray-600 mb-2">Update Equipment Condition:</p>
              {[
                { label: "Working", icon: <CheckCircle2 className="text-green-600" size={18}/>, bg: "hover:bg-green-50" },
                { label: "Damaged", icon: <AlertCircle className="text-red-600" size={18}/>, bg: "hover:bg-red-50" },
                { label: "Need Repair", icon: <Wrench className="text-orange-500" size={18}/>, bg: "hover:bg-orange-50" },
                { label: "Under Repair", icon: <Clock className="text-blue-500" size={18}/>, bg: "hover:bg-blue-50" }
              ].map((option) => (
                <button
                  key={option.label}
                  onClick={() => handleConditionUpdate(option.label)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border border-gray-100 transition-all text-left font-medium text-gray-700 ${option.bg} ${selectedAsset.condition === option.label ? 'bg-gray-100 border-[#0a2e27]' : ''}`}
                >
                  {option.icon}
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: Update Consumable Quantity --- */}
      {selectedConsumable && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-[350px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-[#0a2e27] p-5 flex justify-between items-center">
              <h3 className="text-white font-bold">Update Stock: {selectedConsumable.name}</h3>
              <button onClick={() => setSelectedConsumable(null)} className="text-white/70 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-center gap-6">
                <button
                  onClick={() => setNewQuantity(Math.max(0, newQuantity - 1))}
                  className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center text-2xl hover:bg-gray-50"
                >-</button>
                <input
                  type="number"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(Number(e.target.value))}
                  className="w-20 text-center text-2xl font-bold focus:outline-none"
                />
                <button
                  onClick={() => setNewQuantity(newQuantity + 1)}
                  className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center text-2xl hover:bg-gray-50"
                >+</button>
              </div>
              <button
                onClick={handleQuantityUpdate}
                className="w-full py-3 bg-[#0a2e27] text-white rounded-xl font-semibold hover:bg-[#08241f] transition-colors"
              >
                Update Quantity
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD ITEM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-[500px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-[#0a2e27] p-6 flex justify-between items-start">
              <div className="text-white">
                <h2 className="text-xl font-bold">Add New Item</h2>
                <p className="text-gray-300 text-xs mt-1">Fill in the details to add an item</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-white/70 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Item Name <span className="text-red-500">*</span></label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="e.g. Magnesium Chalk"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0a2e27]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Current Quantity</label>
                  <input
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    type="number"
                    placeholder="0"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0a2e27]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Zone / Area</label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-[#0a2e27]"
                  >
                    <option value="">Select zone</option>
                    <option value="Mezzanine">Mezzanine</option>
                    <option value="Powerlifting Area">Powerlifting Area</option>
                    <option value="Open WOD Area">Open WOD Area</option>
                    <option value="CrossFit Area">CrossFit Area</option>
                    <option value="Café">Café</option>
                    <option value="General Storage">General Storage</option>
                    <option value="Maintenance Storage">Maintenance Storage</option>
                  </select>
                </div>
              </div>

              {activeCategory === "Consumables" && (
                <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
                  <label className="text-sm font-semibold text-gray-700">Minimum Quantity</label>
                  <input
                    name="lowStockAlert"
                    value={formData.lowStockAlert}
                    onChange={handleInputChange}
                    type="number"
                    placeholder="10"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0a2e27]"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Category <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setActiveCategory("Consumables")}
                    className={`py-2 rounded-lg font-medium text-sm transition-colors ${activeCategory === "Consumables" ? "bg-[#0a2e27] text-white" : "bg-white border border-gray-200 text-gray-600"}`}
                  >
                    Consumables
                  </button>
                  <button
                    onClick={() => setActiveCategory("Assets")}
                    className={`py-2 rounded-lg font-medium text-sm transition-colors ${activeCategory === "Assets" ? "bg-[#0a2e27] text-white" : "bg-white border border-gray-200 text-gray-600"}`}
                  >
                    Assets
                  </button>
                </div>
              </div>

              <div className="bg-[#f0f9f6] border border-[#d1e9e0] rounded-xl p-4 flex gap-3">
                <div className="text-[11px] text-gray-600 space-y-1">
                  <p className="font-bold text-gray-700">Make sure to:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>Double-check the item details before adding</li>
                    {activeCategory === "Consumables" && <li>Set appropriate minimum quantity for reorder alerts</li>}
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 flex gap-3 mt-2">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button
                onClick={handleAddItem}
                className="flex-1 py-3 bg-[#0a2e27] text-white rounded-xl font-semibold hover:bg-[#08241f] flex items-center justify-center gap-2"
              >
                <span>+</span> Add to Inventory
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;