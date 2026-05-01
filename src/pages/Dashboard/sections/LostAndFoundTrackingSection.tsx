import React, { useState } from "react";

export type LostAndFoundItem = {
  id: string;
  description: string;
  location: string;
  dateFound: string;
  status: "Claimed" | "Unclaimed";
};

export const LostAndFoundTrackingSection: React.FC = () => {
  const [items, setItems] = useState<LostAndFoundItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    description: "",
    location: "Mezzanine",
    dateFound: "",
  });

  const unclaimedCount = items.filter((i) => i.status === "Unclaimed").length;

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: LostAndFoundItem = {
      id: `LF-${Math.floor(1000 + Math.random() * 9000)}`,
      description: formData.description,
      location: formData.location,
      dateFound: formData.dateFound,
      status: "Unclaimed",
    };

    setItems([newItem, ...items]); // Add new items to the top
    setIsModalOpen(false);
    setFormData({ description: "", location: "Mezzanine", dateFound: "" });
  };

  const toggleStatus = (id: string) => {
    setItems(items.map(item => 
      item.id === id 
        ? { ...item, status: item.status === "Unclaimed" ? "Claimed" : "Unclaimed" } 
        : item
    ));
  };

  return (
    <section
      aria-labelledby="lost-and-found-heading"
      className="w-full bg-white rounded-[16px] border border-[#e8e8e8] shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-5 pb-3 flex-wrap gap-3">
        <div className="flex items-center gap-4">
          <h2
            id="lost-and-found-heading"
            className="font-semibold text-[#1a1a1a] text-xl m-0 p-0"
          >
            Lost and Found
          </h2>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="relative z-10 bg-[#0b2b26] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#153a34] active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>+</span> Add Item
          </button>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="font-semibold text-2xl leading-none text-[#e07000]">
            {unclaimedCount}
          </span>
          <span className="font-normal text-[#888] text-[11px] whitespace-nowrap">
            Unclaimed Items
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="px-6 pb-5 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#efefef]">
              {["ID", "Item Description", "Location Found", "Date Found", "Status"].map((col) => (
                <th key={col} className="font-semibold text-[#1a1a1a] text-sm text-left py-2 pr-6 whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-[#bbb] text-sm italic">
                  No lost and found data available. Click "Add Item" to start.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa] transition-colors">
                  <td className="py-2.5 pr-6 text-[#555] text-sm">{item.id}</td>
                  <td className="py-2.5 pr-6 text-[#1a1a1a] text-sm font-medium">{item.description}</td>
                  <td className="py-2.5 pr-6 text-[#555] text-sm">{item.location}</td>
                  <td className="py-2.5 pr-6 text-[#555] text-sm whitespace-nowrap">{item.dateFound}</td>
                  <td className="py-2.5">
                    <button 
                      onClick={() => toggleStatus(item.id)}
                      className={`inline-flex items-center justify-center px-3 py-0.5 rounded-full text-[11px] font-medium transition-colors ${
                        item.status === "Unclaimed" 
                          ? "bg-[#fff0e0] text-[#e07000] hover:bg-[#ffe0c0]" 
                          : "bg-[#e0f5e9] text-[#1b9640] hover:bg-[#c8ecd7]"
                      }`}
                    >
                      {item.status}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-[#1e4d46] p-5 flex justify-between items-center text-white">
              <div>
                <h3 className="font-semibold text-lg">Add New Inventory Item</h3>
                <p className="text-xs text-white/70">Fill in details for the lost item</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-white/80 hover:text-white p-1"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleAddItem} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item Description *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g., Insulated black water bottle"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1e4d46] focus:border-transparent outline-none"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Found In (Zone) *</label>
                <select 
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1e4d46] outline-none"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                >
                  <option value="Mezzanine">Mezzanine</option>
                  <option value="Powerlifting Area">Powerlifting Area</option>
                  <option value="Open WOD Area">Open WOD Area</option>
                  <option value="CrossFit Area">CrossFit Area</option>
                  <option value="Café">Café</option>
                  <option value="General Storage Room">General Storage Room</option>
                  <option value="Maintenance and Asset Storage">Maintenance Room</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Found *</label>
                <input
                  required
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1e4d46] outline-none"
                  value={formData.dateFound}
                  onChange={(e) => setFormData({...formData, dateFound: e.target.value})}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#1e4d46] text-white rounded-lg text-sm font-medium hover:bg-[#153a34] shadow-md transition-all active:scale-95"
                >
                  Add to Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};