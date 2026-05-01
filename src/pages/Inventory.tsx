import React, { useState, useEffect } from "react";
import { SidebarNavigationSection } from "../components/SidebarNavigationSection";
import { X, Info } from "lucide-react";

// --- Types for MongoDB Data ---
interface InventoryItemData {
  _id: string;
  name: string;
  category: string;
  minStock: string; 
  currentCount: number;
  unit: string;
}

interface EquipmentAsset {
  _id: string;
  code: string;
  name: string;
  count: number;
  status: "Working" | "Damaged" | "Under Repair";
  zone: string;
}

export const InventoryPage: React.FC = () => {
  const [consumables, setConsumables] = useState<InventoryItemData[]>([]);
  const [assets, setAssets] = useState<EquipmentAsset[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for Add Item Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  // State to handle clicking between Consumables and Assets
  const [activeCategory, setActiveCategory] = useState<"Consumables" | "Assets">("Consumables");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(false);
      } catch (error) {
        console.error("Error fetching inventory:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const isLowStock = (item: InventoryItemData) => {
    const minVal = parseInt(item.minStock.replace(/[^0-9]/g, ""));
    return item.currentCount < minVal;
  };

  const lowStockItems = consumables.filter(isLowStock);
  const outOfStockItems = consumables.filter(item => item.currentCount === 0);

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
          {lowStockItems.length > 0 && (
            <div className="mb-6 flex items-start gap-4 p-4 bg-[#fff5f5] border border-[#feb2b2] rounded-xl animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e53e3e" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-[#c53030] text-lg">Low Stock Alert</h3>
                <p className="text-[#e53e3e] text-sm">
                  {lowStockItems.length} items are below minimum stock level in Maintenance Storage
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col lg:flex-row flex-1 gap-6">
            <div className="flex-1 lg:flex-[2] bg-white rounded-3xl p-4 md:p-8 border border-[#e8e8e8] shadow-sm min-w-0">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h2 className="text-xl md:text-2xl font-semibold text-[#1f1f1f]">Inventory Overview</h2>
                <div className="flex gap-6">
                  <div className="text-center">
                    <div className="text-red-500 font-bold text-lg leading-none">{outOfStockItems.length}</div>
                    <div className="text-[10px] text-[#6b6b6b] uppercase font-bold">Out of Stock</div>
                  </div>
                  <div className="text-center">
                    <div className="text-orange-400 font-bold text-lg leading-none">{lowStockItems.length}</div>
                    <div className="text-[10px] text-[#6b6b6b] uppercase font-bold">Low Stock</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mb-6">
                <button className="px-4 py-1.5 rounded-lg bg-[#0a2e27] text-white text-sm font-medium transition-all">Consumables</button>
                <button className="px-4 py-1.5 rounded-lg bg-[#d1d1d1] text-[#6b6b6b] text-sm font-medium hover:bg-gray-300 transition-all">Assets</button>
              </div>

              <h3 className="text-lg font-semibold mb-4 text-[#1f1f1f]">Maintenance Supplies</h3>

              <div className="flex flex-col md:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b6b6b" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                  </span>
                  <input className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#e8e8e8] focus:outline-none focus:border-[#0a2e27] transition-colors" placeholder="Search items..." />
                </div>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-[#0a2e27] text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-medium text-sm hover:bg-[#08241f] transition-colors"
                >
                  <span className="text-lg">+</span> Add Item
                </button>
              </div>

              <div className="space-y-3">
                {loading ? (
                  <div className="py-10 text-center text-gray-400 animate-pulse">Loading items...</div>
                ) : consumables.length > 0 ? (
                  consumables.map((item) => {
                    const low = isLowStock(item);
                    return (
                      <div 
                        key={item._id} 
                        className={`flex items-center justify-between p-4 bg-white border rounded-xl hover:shadow-md transition-all ${
                          low ? "border-[#feb2b2] shadow-[0_0_10px_rgba(254,178,178,0.2)]" : "border-[#e8e8e8]"
                        }`}
                      >
                        <div className="flex items-center gap-3 md:gap-4 min-w-0">
                          <div className={`w-10 h-10 flex items-center justify-center rounded-lg shrink-0 ${low ? "bg-[#fff5f5]" : "bg-[#f4f5f6]"}`}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={low ? "#e53e3e" : "#6b6b6b"} strokeWidth="2">
                              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                            </svg>
                          </div>
                          <div className="truncate">
                            <div className="flex items-center gap-2">
                              <h4 className={`font-semibold text-base md:text-lg truncate ${low ? "text-[#c53030]" : "text-[#1f1f1f]"}`}>
                                {item.name}
                              </h4>
                              {low && (
                                <span className="px-2 py-0.5 bg-[#fff5f5] text-[#e53e3e] text-[10px] font-bold rounded uppercase">
                                  Low Stock
                                </span>
                              )}
                            </div>
                            <p className="text-xs md:text-sm text-[#6b6b6b] truncate">Category: {item.category} • Min: {item.minStock}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0 ml-4">
                          <div className={`text-xl md:text-2xl font-bold ${low ? "text-[#c53030]" : "text-[#1f1f1f]"}`}>
                            {item.currentCount}
                          </div>
                          <div className="text-[10px] text-[#6b6b6b] uppercase tracking-wider font-bold">{item.unit}</div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-10 text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
                    No items found in database.
                  </div>
                )}
              </div>
            </div>

            <div className="w-full lg:w-[320px] bg-white rounded-3xl p-6 border border-[#e8e8e8] shadow-sm shrink-0">
              <div className="grid grid-cols-4 gap-2 mb-8 border-b pb-6">
                {[
                  { label: "Total Assets", val: assets.length, color: "text-gray-900" },
                  { label: "Damaged", val: assets.filter(a => a.status === "Damaged").length, color: "text-red-500" },
                  { label: "Need Repair", val: 0, color: "text-orange-400" },
                  { label: "Under Repair", val: assets.filter(a => a.status === "Under Repair").length, color: "text-blue-500" },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className={`text-lg font-bold ${stat.color}`}>{stat.val}</div>
                    <div className="text-[8px] md:text-[9px] text-gray-500 uppercase font-bold leading-tight">{stat.label}</div>
                  </div>
                ))}
              </div>
              <h3 className="text-lg font-semibold mb-6">Equipment by Zone</h3>
              <div className="space-y-8">
                {loading ? (
                  <div className="space-y-4 animate-pulse">
                    {[1, 2, 3].map(i => <div key={i} className="h-12 bg-gray-50 rounded-lg" />)}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-400 text-sm italic">
                    No equipment data available.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- ADD NEW ITEM MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-[500px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#0a2e27] p-6 flex justify-between items-start">
              <div className="text-white">
                <h2 className="text-xl font-bold">Add New Item</h2>
                <p className="text-gray-300 text-xs mt-1">Fill in the details to add an item</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Item Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  placeholder="e.g. Magnesium Chalk"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a2e27]/20 focus:border-[#0a2e27]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Current Quantity</label>
                  <input 
                    type="number" 
                    placeholder="0"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a2e27]/20 focus:border-[#0a2e27]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Zone / Area</label>
                  <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a2e27]/20 focus:border-[#0a2e27] bg-white text-black text-sm">
                    <option value="">Select zone</option>
                    <option value="mezzanine">Mezzanine</option>
                    <option value="powerlifting-area">Powerlifting Area</option>
                    <option value="open-wod-area">Open WOD Area</option>
                    <option value="crossfit-area">CrossFit Area</option>
                    <option value="cafe">Café</option>
                    <option value="general-storage">General Storage Room</option>
                    <option value="maintenance-storage">Maintenance & Asset Storage Room</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Minimum Quantity</label>
                <input 
                  type="number" 
                  placeholder="10"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a2e27]/20 focus:border-[#0a2e27]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Category <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button 
                    onClick={() => setActiveCategory("Consumables")}
                    className={`py-2 rounded-lg font-medium text-sm transition-colors ${
                      activeCategory === "Consumables" 
                      ? "bg-[#0a2e27] text-white" 
                      : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Consumables
                  </button>
                  <button 
                    onClick={() => setActiveCategory("Assets")}
                    className={`py-2 rounded-lg font-medium text-sm transition-colors ${
                      activeCategory === "Assets" 
                      ? "bg-[#0a2e27] text-white" 
                      : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Assets
                  </button>
                </div>
              </div>

              <div className="bg-[#f0f9f6] border border-[#d1e9e0] rounded-xl p-4 flex gap-3">
                <Info className="text-[#0a2e27] shrink-0" size={20} />
                <div className="text-[11px] text-gray-600 space-y-1">
                  <p className="font-bold text-gray-700">Make sure to:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>Double-check the item details before adding</li>
                    <li>Set appropriate minimum quantity for reorder alerts</li>
                    <li>Use consistent naming (e.g., "Zone: Area Name")</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 flex gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 py-3 bg-[#0a2e27] text-white rounded-xl font-semibold hover:bg-[#08241f] transition-colors flex items-center justify-center gap-2">
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