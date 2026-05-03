import React, { useState } from "react";
import { SidebarNavigationSection } from "../components/SidebarNavigationSection";
import { X, AlertCircle, Wrench, Layers, Filter, Search, Bell, Trash2, ChevronDown, MapPin } from "lucide-react";

// --- Types ---
interface InventoryItemData {
  _id: string;
  consumableId: string;
  name: string;
  category: string;
  lowStockAlert: number;
  quantity: number;
  unit: string;
  location: string;
  type: "Consumable"; 
}

interface EquipmentAsset {
  _id: string;
  assetId: string;
  name: string;
  condition: "Working" | "Damaged" | "Need Repair" | "Under Repair";
  area: string;
  purchaseDate: string;
  type: "Asset"; 
}

// --- Hardcoded Mock Data ---
const MOCK_CONSUMABLES: InventoryItemData[] = [
  { _id: "c1", consumableId: "CON-OGRNGQ0VQ", name: "Surf 1000000g", category: "Consumables", lowStockAlert: 2, quantity: 5, unit: "PACK", location: "Maintenance Supplies", type: "Consumable" },
  { _id: "c2", consumableId: "CON-2EV1HWZEW", name: "Detergent Liquid", category: "Consumables", lowStockAlert: 5, quantity: 2, unit: "BOX", location: "Maintenance Supplies", type: "Consumable" },
  { _id: "c3", consumableId: "CON-LMVQX3CV5", name: "ZESTO Juice", category: "Consumables", lowStockAlert: 2, quantity: 0, unit: "BOXES", location: "Maintenance Supplies", type: "Consumable" },
  { _id: "c4", consumableId: "CON-16QETGCLE", name: "Paper Towels", category: "Consumables", lowStockAlert: 10, quantity: 8, unit: "PCS", location: "Maintenance Supplies", type: "Consumable" },
  { _id: "c5", consumableId: "CON-99QETGAAA", name: "Hand Soap", category: "Consumables", lowStockAlert: 5, quantity: 5, unit: "BOTTLES", location: "Restrooms", type: "Consumable" },
];

const MOCK_ASSETS: EquipmentAsset[] = [
  { _id: "a1", assetId: "AST-67P6CX88A", name: "Olympic Barbell", condition: "Working", area: "Open WOD Area", purchaseDate: new Date().toISOString(), type: "Asset" },
  { _id: "a2", assetId: "AST-2Q42RDE4L", name: "Rowing Machine", condition: "Working", area: "Powerlifting Area", purchaseDate: new Date().toISOString(), type: "Asset" },
  { _id: "a3", assetId: "AST-MUGFO4P4S", name: "Dumbbell Set 25kg", condition: "Need Repair", area: "Powerlifting Area", purchaseDate: new Date().toISOString(), type: "Asset" },
  { _id: "a4", assetId: "AST-H80OZQ6KB", name: "Treadmill X1", condition: "Under Repair", area: "Open WOD Area", purchaseDate: new Date().toISOString(), type: "Asset" },
];

export const InventoryPage: React.FC = () => {
  const [consumables] = useState<InventoryItemData[]>(MOCK_CONSUMABLES);
  const [assets] = useState<EquipmentAsset[]>(MOCK_ASSETS);
  const [activeCategory, setActiveCategory] = useState<"Consumables" | "Assets" | "All">("Consumables");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("ALL");

  const isLowStock = (item: InventoryItemData) => item.quantity > 0 && item.quantity <= item.lowStockAlert;
  const isOutOfStock = (item: InventoryItemData) => item.quantity === 0;

  const outOfStockCount = consumables.filter(isOutOfStock).length;
  const lowStockCount = consumables.filter(isLowStock).length;

  const filteredConsumables = consumables.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (filter === "LOW STOCK") return matchesSearch && isLowStock(item);
    if (filter === "OUT OF STOCK") return matchesSearch && isOutOfStock(item);
    return matchesSearch;
  });

  const filteredAssets = assets.filter(asset => 
    asset.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#f4f5f6] overflow-hidden font-sans">
      <SidebarNavigationSection />

      <div className="flex flex-col flex-1 min-w-0 ml-[240px] overflow-y-auto">
        <header className="flex items-center justify-between px-10 py-6">
          <h1 className="font-bold text-[#1f1f1f] text-[40px]">Inventory</h1>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full border border-gray-200 bg-white shadow-sm"><Bell size={22} /></button>
            {/* Centered Profile Fix Applied Below */}
            <div className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center overflow-hidden cursor-pointer">
              <img src="https://c.animaapp.com/C3N4JJvt/img/profile@2x.png" alt="User" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        <div className="px-10 pb-10">
          {(outOfStockCount > 0 || lowStockCount > 0) && (
            <div className="mb-8 flex items-center gap-4 p-5 bg-[#fff5f5] border border-[#feb2b2] rounded-2xl">
              <div className="p-2 bg-white rounded-lg border border-[#feb2b2]">
                 <AlertCircle className="text-[#ff1a1a]" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-[#ff1a1a] text-lg">Inventory Alert</h3>
                <p className="text-[#ff1a1a] text-sm font-medium">{outOfStockCount} out of stock and {lowStockCount} low stock items.</p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-[32px] p-10 border border-[#e8e8e8] shadow-sm relative">
            <div className="flex justify-between items-start mb-10">
              <h2 className="text-[28px] font-bold text-[#1f1f1f]">Inventory Overview</h2>
              
              <div className="flex gap-8 text-center uppercase tracking-wider">
                {activeCategory === "Consumables" ? (
                  <>
                    <div>
                      <div className="text-[22px] font-black text-[#ff1a1a]">{outOfStockCount}</div>
                      <div className="text-[10px] font-bold text-gray-400">Out of Stock</div>
                    </div>
                    <div>
                      <div className="text-[22px] font-black text-[#ff9900]">{lowStockCount}</div>
                      <div className="text-[10px] font-bold text-gray-400">Low Stock</div>
                    </div>
                  </>
                ) : activeCategory === "Assets" ? (
                    <>
                        <div><div className="text-[22px] font-black text-[#ff1a1a]">0</div><div className="text-[10px] font-bold text-gray-400">Damaged</div></div>
                        <div><div className="text-[22px] font-black text-[#ff9900]">1</div><div className="text-[10px] font-bold text-gray-400">Need Repair</div></div>
                        <div><div className="text-[22px] font-black text-[#3385ff]">1</div><div className="text-[10px] font-bold text-gray-400">Under Repair</div></div>
                    </>
                ) : (
                    <div><div className="text-[22px] font-black text-[#1f1f1f]">{consumables.length + assets.length}</div><div className="text-[10px] font-bold text-gray-400">Total Items</div></div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mb-8">
              <div className="flex gap-2 bg-[#f4f5f6] p-1.5 rounded-xl">
                {["All Items", "Consumables", "Assets"].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveCategory(tab.replace(" Items", "") as any)}
                    className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeCategory === tab.replace(" Items", "") ? "bg-[#0a2e27] text-white shadow-lg" : "text-[#6b6b6b] hover:text-[#1f1f1f]"}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                {activeCategory === "Consumables" && (
                    <div className="flex items-center bg-[#f4f5f6] p-1 rounded-xl">
                        {["ALL", "LOW STOCK", "OUT OF STOCK"].map(f => (
                            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black ${filter === f ? "bg-white text-[#1f1f1f] shadow-sm" : "text-gray-400"}`}>{f}</button>
                        ))}
                    </div>
                )}
                {activeCategory === "Assets" && (
                    <>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-black"><Filter size={14}/> ALL CONDITIONS</button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-black"><MapPin size={14}/> ALL AREAS</button>
                    </>
                )}
              </div>
            </div>

            <h3 className="text-lg font-bold text-[#1f1f1f] mb-6">
                {activeCategory === "All" ? "Full Inventory" : activeCategory === "Consumables" ? "Maintenance Supplies" : "Equipment Assets"}
            </h3>

            <div className="flex gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  className="w-full pl-14 pr-6 py-4 rounded-2xl border border-[#e8e8e8] focus:outline-none focus:ring-2 focus:ring-[#0a2e27]/10" 
                  placeholder="Search items..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-[#0a2e27] text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-[#08241f] transition-all shadow-md"
              >
                <span className="text-2xl">+</span> Add Item
              </button>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {(activeCategory === "Consumables" || activeCategory === "All") && filteredConsumables.map(item => (
                <div key={item._id} className={`flex items-center justify-between p-6 bg-white border-2 rounded-2xl group hover:shadow-lg transition-all ${isOutOfStock(item) ? "border-[#ff1a1a]" : isLowStock(item) ? "border-[#ff9900]" : "border-[#e8e8e8]"}`}>
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-[#f4f5f6] text-gray-400 group-hover:bg-[#0a2e27] group-hover:text-white transition-colors">
                      <Layers size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h4 className="text-xl font-bold text-[#1f1f1f]">{item.name}</h4>
                        {isLowStock(item) && <span className="px-2 py-0.5 bg-[#fff7ed] text-[#ff9900] text-[10px] font-black rounded-md uppercase">Low Stock</span>}
                        {isOutOfStock(item) && <span className="px-2 py-0.5 bg-[#fef2f2] text-[#ff1a1a] text-[10px] font-black rounded-md uppercase">Out of Stock</span>}
                      </div>
                      <p className="text-sm font-medium text-gray-400 uppercase tracking-tight">ID: {item.consumableId} • Min: {item.lowStockAlert}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <div className={`text-[32px] font-black leading-none ${isOutOfStock(item) ? "text-[#ff1a1a]" : isLowStock(item) ? "text-[#ff9900]" : "text-[#1f1f1f]"}`}>{item.quantity}</div>
                      <div className="text-[10px] font-black text-gray-400 uppercase">{item.unit}</div>
                    </div>
                    <button className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={22} /></button>
                  </div>
                </div>
              ))}

              {(activeCategory === "Assets" || activeCategory === "All") && filteredAssets.map(asset => (
                 <div key={asset._id} className="flex items-center justify-between p-6 bg-white border-2 border-[#10b981] rounded-2xl group hover:shadow-lg transition-all">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-[#f4f5f6] text-[#10b981]">
                            <Wrench size={24} />
                        </div>
                        <div>
                            <h4 className="text-xl font-bold text-[#1f1f1f]">{asset.name}</h4>
                            <p className="text-sm font-medium text-gray-400 uppercase tracking-tight">ID: {asset.assetId} • {asset.area}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-8">
                        <span className={`px-4 py-1.5 text-[10px] font-black rounded-full uppercase ${
                          asset.condition === "Working" ? "bg-[#ecfdf5] text-[#10b981]" : 
                          asset.condition === "Need Repair" ? "bg-[#fff7ed] text-[#ff9900]" : "bg-blue-50 text-blue-500"
                        }`}>
                          {asset.condition}
                        </span>
                        <button className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={22} /></button>
                    </div>
                 </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-[540px] rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-[#0a2e27] p-8 flex justify-between items-start text-white">
              <div>
                <h2 className="text-2xl font-bold">Add New Item</h2>
                <p className="text-white/70 text-sm mt-1">Fill in the details to add an item</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors"><X size={28} /></button>
            </div>
            
            <div className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#4a5568]">Item Name <span className="text-red-500">*</span></label>
                <input className="w-full px-5 py-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl text-[#1f1f1f] focus:outline-none focus:border-[#0a2e27]" placeholder="e.g. Magnesium Chalk" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#4a5568]">Current Quantity</label>
                  <input type="number" defaultValue={0} className="w-full px-5 py-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl text-[#1f1f1f]" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#4a5568]">Zone / Area</label>
                  <div className="relative">
                    <input className="w-full px-5 py-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl text-[#1f1f1f]" placeholder="Select zone" readOnly />
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#4a5568]">Minimum Quantity</label>
                  <input type="number" defaultValue={10} className="w-full px-5 py-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl text-[#1f1f1f]" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#4a5568]">Unit</label>
                  <input className="w-full px-5 py-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl text-[#1f1f1f]" defaultValue="pcs" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#4a5568]">Category <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-2 gap-4">
                  <button className="py-4 rounded-2xl border-2 border-[#e2e8f0] font-bold text-[#4a5568] hover:bg-gray-50 transition-colors">Consumables</button>
                  <button className="py-4 rounded-2xl bg-[#0a2e27] text-white font-bold shadow-lg shadow-[#0a2e27]/20">Assets</button>
                </div>
              </div>

              <div className="p-5 bg-[#f0fdfa] border border-[#ccfbf1] rounded-2xl space-y-1">
                <h4 className="text-[12px] font-black text-[#0a2e27] uppercase">Make sure to:</h4>
                <ul className="text-[11px] font-bold text-[#0d9488] list-disc list-inside space-y-1">
                  <li>Double-check the item details before adding</li>
                  <li>Set appropriate minimum quantity for reorder alerts</li>
                </ul>
              </div>

              <div className="flex gap-4 pt-4">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 border-2 border-[#e2e8f0] rounded-2xl font-bold text-[#4a5568] hover:bg-gray-50 transition-all">Cancel</button>
                <button className="flex-1 py-4 bg-[#0a2e27] text-white rounded-2xl font-bold shadow-lg hover:bg-[#08241f] transition-all">+ Add to Inventory</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;