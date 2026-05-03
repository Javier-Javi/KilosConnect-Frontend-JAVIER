import React, { useState, useEffect } from "react";
import { SidebarNavigationSection } from "../components/SidebarNavigationSection";
import { X, Info, CheckCircle2, AlertCircle, Wrench, Clock, Layers, Filter, MapPin, Trash2 } from "lucide-react";
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
  type?: "Consumable"; 
}

interface EquipmentAsset {
  _id: string;
  assetId: string;
  name: string;
  condition: "Working" | "Damaged" | "Need Repair" | "Under Repair";
  area: string;
  purchaseDate: string;
  type?: "Asset"; 
}

export const InventoryPage: React.FC = () => {
  const [consumables, setConsumables] = useState<InventoryItemData[]>([]);
  const [assets, setAssets] = useState<EquipmentAsset[]>([]);
  const [summary, setSummary] = useState<(InventoryItemData | EquipmentAsset)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<"Consumables" | "Assets" | "All">("All");
  
  // --- Consumable Sub-Filters ---
  const [consumableFilter, setConsumableFilter] = useState<"All" | "Low Stock" | "Out of Stock">("All");

  // --- Asset Filter States ---
  const [assetFilters, setAssetFilters] = useState({
    condition: "All",
    area: "All"
  });

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
    location: "", 
    lowStockAlert: "",
    unit: "pcs" // Default to pcs
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [assetsData, consumablesData, summaryData] = await Promise.all([
        inventoryService.fetchAssets(),
        inventoryService.fetchConsumables(),
        inventoryService.fetchSummary()
      ]);
      setAssets(assetsData);
      setConsumables(consumablesData);
      setSummary(summaryData);
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

  const updateAssetFilter = (key: 'condition' | 'area', value: string) => {
    setAssetFilters(prev => ({ ...prev, [key]: value }));
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

  const handleArchiveItem = async (e: React.MouseEvent, id: string, type: "Asset" | "Consumable") => {
    e.stopPropagation(); 
    
    const confirmBox = window.confirm("Move this item to archives?");
    if (confirmBox === true) {
      try {
        if (type === "Asset") {
          await inventoryService.archiveAsset(id);
        } else {
          await inventoryService.archiveConsumable(id);
        }
        await fetchData(); 
      } catch (err: any) {
        console.error("Error archiving:", err);
        alert("Failed to archive asset");
      }
    }
  };

  const isLowStock = (item: InventoryItemData) => {
    return item.quantity > 0 && item.quantity <= (item.lowStockAlert || 0);
  };

  const isOutOfStock = (item: InventoryItemData) => {
    return item.quantity === 0;
  };

  // --- RECODED SORTING LOGIC FOR ALL VIEWS ---

  // 1. Process Consumables (Descending by _id)
  const getProcessedConsumables = () => {
    let list = [...consumables].sort((a, b) => b._id.localeCompare(a._id));

    if (consumableFilter === "Low Stock") {
      list = list.filter(isLowStock);
    } else if (consumableFilter === "Out of Stock") {
      list = list.filter(isOutOfStock);
    }

    return list.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  const filteredConsumables = getProcessedConsumables();

  // 2. Process Assets (Descending by _id - FIXED)
  const filteredAssets = [...assets]
    .sort((a, b) => b._id.localeCompare(a._id)) 
    .filter(asset => {
      const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            asset.assetId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (asset.area && asset.area.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCondition = assetFilters.condition === "All" || asset.condition === assetFilters.condition;
      const matchesArea = assetFilters.area === "All" || asset.area === assetFilters.area;

      return matchesSearch && matchesCondition && matchesArea;
    });

  // 3. Process All List (Descending by _id - FIXED)
  const filteredSummary = [...summary]
    .sort((a, b) => b._id.localeCompare(a._id))
    .filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
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
      category: activeCategory === "All" ? "Consumables" : activeCategory,
      [isAsset ? 'area' : 'location']: formData.location,
      lowStockAlert: Number(formData.lowStockAlert) || 0,
      unit: formData.unit,
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
      setFormData({ name: "", quantity: "", location: "", lowStockAlert: "", unit: "pcs" });
      fetchData();
    } catch (err: any) {
      console.error("Network error:", err);
      alert(err.message || "Could not connect to the server.");
    }
  };

  const lowStockItems = consumables.filter(isLowStock);
  const outOfStockItems = consumables.filter(isOutOfStock);

  const getAssetStatusColor = (condition: string) => {
    switch (condition) {
      case "Damaged": return "text-[#ff1a1a]"; 
      case "Need Repair": return "text-[#ff9900]"; 
      case "Under Repair": return "text-[#3385ff]"; 
      case "Working": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  const getAssetBadgeClass = (condition: string) => {
    switch (condition) {
      case "Damaged": return "bg-red-50 text-[#ff1a1a]";
      case "Need Repair": return "bg-orange-50 text-[#ff9900]";
      case "Under Repair": return "bg-blue-50 text-[#3385ff]";
      case "Working": return "bg-green-50 text-green-700";
      default: return "bg-gray-50 text-gray-700";
    }
  };

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

          {activeCategory !== "Assets" && (lowStockItems.length > 0 || outOfStockItems.length > 0) && (
            <div className="mb-6 flex items-start gap-4 p-4 bg-[#fff5f5] border border-[#feb2b2] rounded-xl animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff1a1a" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-[#ff1a1a] text-lg">Inventory Alert</h3>
                <p className="text-[#ff1a1a] text-sm">
                  {outOfStockItems.length} out of stock and {lowStockItems.length} low stock items.
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col flex-1 gap-6">
            <div className="flex-1 bg-white rounded-3xl p-4 md:p-8 border border-[#e8e8e8] shadow-sm min-w-0">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h2 className="text-xl md:text-2xl font-semibold text-[#1f1f1f]">Inventory Overview</h2>
                
                <div className="flex gap-12">
                  {activeCategory === "All" ? (
                    <div className="flex flex-col items-center">
                      <div className="text-[#0a2e27] font-bold text-2xl leading-none mb-1">
                        {assets.length + consumables.length}
                      </div>
                      <div className="text-[10px] text-[#4a4a4a] uppercase font-bold whitespace-nowrap">Total Inventory</div>
                    </div>
                  ) : (
                    <>
                      {activeCategory === "Consumables" && (
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Consumables</span>
                          <div className="flex gap-8">
                            <div className="text-center">
                              <div className="text-[#ff1a1a] font-bold text-xl leading-none mb-1">{outOfStockItems.length}</div>
                              <div className="text-[10px] text-[#4a4a4a] uppercase font-bold whitespace-nowrap">Out of Stock</div>
                            </div>
                            <div className="text-center">
                              <div className="text-[#ff9900] font-bold text-xl leading-none mb-1">{lowStockItems.length}</div>
                              <div className="text-[10px] text-[#4a4a4a] uppercase font-bold whitespace-nowrap">Low Stock</div>
                            </div>
                          </div>
                        </div>
                      )}
                      {activeCategory === "Assets" && (
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Assets</span>
                          <div className="flex gap-8">
                            {[
                              { label: "Damaged", val: assets.filter(a => a.condition === "Damaged").length, color: "text-[#ff1a1a]" },
                              { label: "Need Repair", val: assets.filter(a => a.condition === "Need Repair").length, color: "text-[#ff9900]" },
                              { label: "Under Repair", val: assets.filter(a => a.condition === "Under Repair").length, color: "text-[#3385ff]" },
                            ].map((stat, i) => (
                              <div key={i} className="text-center">
                                <div className={`text-xl font-bold mb-1 ${stat.color}`}>{stat.val}</div>
                                <div className="text-[10px] text-[#4a4a4a] uppercase font-bold whitespace-nowrap leading-tight">{stat.label}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mb-6">
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveCategory("All")}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeCategory === "All" ? "bg-[#0a2e27] text-white" : "bg-[#d1d1d1] text-[#6b6b6b]"}`}
                  >
                    All Items
                  </button>
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

                {activeCategory === "Assets" && (
                  <div className="flex gap-3 animate-in fade-in slide-in-from-right-2">
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl">
                      <Filter size={14} className="text-gray-400" />
                      <select 
                        value={assetFilters.condition}
                        onChange={(e) => updateAssetFilter('condition', e.target.value)}
                        className="bg-transparent text-[11px] font-bold uppercase focus:outline-none appearance-none border-none outline-none shadow-none"
                      >
                        <option value="All">All Conditions</option>
                        <option value="Working">Working</option>
                        <option value="Damaged">Damaged</option>
                        <option value="Need Repair">Need Repair</option>
                        <option value="Under Repair">Under Repair</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl">
                      <MapPin size={14} className="text-gray-400" />
                      <select 
                        value={assetFilters.area}
                        onChange={(e) => updateAssetFilter('area', e.target.value)}
                        className="bg-transparent text-[11px] font-bold uppercase focus:outline-none appearance-none border-none outline-none shadow-none"
                      >
                        <option value="All">All Areas</option>
                        <option value="Mezzanine">Mezzanine</option>
                        <option value="Powerlifting Area">Powerlifting Area</option>
                        <option value="Open WOD Area">Open WOD Area</option>
                        <option value="CrossFit Area">CrossFit Area</option>
                        <option value="Café">Café</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeCategory === "Consumables" && (
                  <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl animate-in fade-in slide-in-from-right-2">
                     <button 
                        onClick={() => setConsumableFilter("All")}
                        className={`px-3 py-1 text-[11px] font-bold uppercase rounded-lg transition-all ${consumableFilter === "All" ? "bg-white text-[#0a2e27] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                     >All</button>
                     <button 
                        onClick={() => setConsumableFilter("Low Stock")}
                        className={`px-3 py-1 text-[11px] font-bold uppercase rounded-lg transition-all ${consumableFilter === "Low Stock" ? "bg-[#ff9900] text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                     >Low Stock</button>
                     <button 
                        onClick={() => setConsumableFilter("Out of Stock")}
                        className={`px-3 py-1 text-[11px] font-bold uppercase rounded-lg transition-all ${consumableFilter === "Out of Stock" ? "bg-[#ff1a1a] text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                     >Out of Stock</button>
                  </div>
                )}
              </div>

              <h3 className="text-lg font-semibold mb-4 text-[#1f1f1f]">
                {activeCategory === "Consumables" ? "Maintenance Supplies" : activeCategory === "Assets" ? "Equipment Assets" : "Full Inventory"}
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
                {activeCategory !== "All" && (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#0a2e27] text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-medium text-sm hover:bg-[#08241f] transition-colors"
                  >
                    <span className="text-lg">+</span> Add Item
                  </button>
                )}
              </div>

              <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                <div className="space-y-3">
                  {loading ? (
                    <div className="py-10 text-center text-gray-400 animate-pulse">Loading items...</div>
                  ) : activeCategory === "All" ? (
                    filteredSummary.length > 0 ? (
                        filteredSummary.map((item: any) => {
                            const isAsset = item.type === 'Asset';
                            return (
                                <div
                                  key={item._id}
                                  onClick={() => {
                                    if (isAsset) setSelectedAsset(item);
                                    else {
                                        setSelectedConsumable(item);
                                        setNewQuantity(item.quantity);
                                    }
                                  }}
                                  className="flex items-center justify-between p-4 bg-white border border-[#e8e8e8] rounded-xl hover:shadow-md transition-all cursor-pointer group mb-3"
                                >
                                  <div className="flex items-center gap-3 md:gap-4 min-w-0">
                                    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#f4f5f6] group-hover:bg-[#0a2e27] transition-colors">
                                      {isAsset ? (
                                          <Wrench size={18} className="text-[#6b6b6b] group-hover:text-white" />
                                      ) : (
                                          <Layers size={18} className="text-[#6b6b6b] group-hover:text-white" />
                                      )}
                                    </div>
                                    <div className="truncate">
                                      <h4 className="font-semibold text-base md:text-lg truncate text-[#1f1f1f] group-hover:text-[#0a2e27]">
                                          {item.name}
                                      </h4>
                                      <p className="text-xs md:text-sm text-[#6b6b6b] truncate">
                                          {isAsset ? `ID: ${item.assetId} • ${item.area || "Unassigned"}` : `ID: ${item.consumableId} • Category: ${item.category || "Consumables"}`}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="py-10 text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">No items found.</div>
                    )
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
                            className={`flex items-center justify-between p-4 bg-white border rounded-xl hover:shadow-md transition-all cursor-pointer group mb-3 ${out ? "border-[#ff1a1a]" : low ? "border-[#ff9900]" : "border-[#e8e8e8]"}`}
                          >
                            <div className="flex items-center gap-3 md:gap-4 min-w-0">
                              <div className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${out ? "bg-red-50" : low ? "bg-orange-50" : "bg-[#f4f5f6] group-hover:bg-[#0a2e27]"}`}>
                                <Layers size={18} className={`transition-colors ${out ? "text-[#ff1a1a]" : low ? "text-[#ff9900]" : "text-[#6b6b6b] group-hover:text-white"}`} />
                              </div>
                              <div className="truncate">
                                <div className="flex items-center gap-2">
                                  <h4 className={`font-semibold text-base md:text-lg truncate ${out ? "text-[#ff1a1a]" : low ? "text-[#ff9900]" : "text-[#1f1f1f] group-hover:text-[#0a2e27]"}`}>{item.name}</h4>
                                  {out ? (
                                    <span className="px-2 py-0.5 bg-[#ff1a1a] text-white text-[10px] font-bold rounded uppercase">Out of Stock</span>
                                  ) : low ? (
                                    <span className="px-2 py-0.5 bg-orange-50 text-[#ff9900] text-[10px] font-bold rounded uppercase">Low Stock</span>
                                  ) : null}
                                </div>
                                <p className="text-xs md:text-sm text-[#6b6b6b] truncate">
                                  ID: {item.consumableId} • Min: {item.lowStockAlert}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-6 shrink-0 ml-4">
                              <div className="text-right">
                                <div className={`text-xl md:text-2xl font-bold ${out ? "text-[#ff1a1a]" : low ? "text-[#ff9900]" : "text-[#1f1f1f]"}`}>{item.quantity}</div>
                                <div className="text-[10px] text-[#6b6b6b] uppercase tracking-wider font-bold">{item.unit || "pcs"}</div>
                              </div>
                              <button 
                                onClick={(e) => handleArchiveItem(e, item._id, "Consumable")}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                title="Archive Item"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="py-10 text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">No consumables found matching criteria.</div>
                    )
                  ) : (
                    filteredAssets.length > 0 ? (
                      filteredAssets.map((asset) => (
                        <div
                          key={asset._id}
                          onClick={() => setSelectedAsset(asset)}
                          className={`flex items-center justify-between p-4 bg-white border rounded-xl hover:shadow-md transition-all cursor-pointer group mb-3 ${asset.condition === "Damaged" ? "border-[#ff1a1a]" : asset.condition === "Need Repair" ? "border-[#ff9900]" : asset.condition === "Under Repair" ? "border-[#3385ff]" : asset.condition === "Working" ? "border-green-600" : "border-[#e8e8e8]"}`}
                        >
                          <div className="flex items-center gap-3 md:gap-4 min-w-0">
                            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#f4f5f6] group-hover:bg-[#0a2e27] transition-colors">
                              <Wrench size={18} className={`transition-colors ${getAssetStatusColor(asset.condition)} group-hover:text-white`} />
                            </div>
                            <div className="truncate">
                              <h4 className={`font-semibold text-base md:text-lg truncate group-hover:text-[#0a2e27] ${getAssetStatusColor(asset.condition)}`}>{asset.name}</h4>
                              <p className="text-xs md:text-sm text-[#6b6b6b]">ID: {asset.assetId} • {asset.area || "Unassigned"}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${getAssetBadgeClass(asset.condition)}`}>
                                {asset.condition}
                              </span>
                            </div>
                            <button 
                              onClick={(e) => handleArchiveItem(e, asset._id, "Asset")}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                              title="Archive Asset"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-10 text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">No assets found matching these filters.</div>
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
                { label: "Damaged", icon: <AlertCircle className="text-[#ff1a1a]" size={18}/>, bg: "hover:bg-red-50" },
                { label: "Need Repair", icon: <Wrench className="text-[#ff9900]" size={18}/>, bg: "hover:bg-orange-50" },
                { label: "Under Repair", icon: <Clock className="text-[#3385ff]" size={18}/>, bg: "hover:bg-blue-50" }
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
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-[#0a2e27] appearance-none"
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

              {(activeCategory === "Consumables" || activeCategory === "All") && (
                <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="space-y-1">
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
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700">Unit</label>
                    {/* CHANGED TO DROPDOWN */}
                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-[#0a2e27] appearance-none"
                    >
                      <option value="liters">liters</option>
                      <option value="pcs">pcs</option>
                      <option value="box">box</option>
                      <option value="pack">pack</option>
                      <option value="bottle">bottle</option>
                      <option value="can">can</option>
                      <option value="other">other</option>
                    </select>
                  </div>
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
                    {(activeCategory === "Consumables" || activeCategory === "All") && <li>Set appropriate minimum quantity for reorder alerts</li>}
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