import React, { useState, useEffect } from "react";

import { fetchAssets, fetchConsumables } from "../../../services/InventoryServices";

const conditionStyles: Record<string, { color: string; bg: string }> = {
  working: { color: "#1a7a4a", bg: "#e6f4ed" },
  damaged: { color: "#d72c2c", bg: "#fdecea" },
  "need repair": { color: "#e09000", bg: "#fff3e0" },
  "under repair": { color: "#0056d2", bg: "#e8f0fe" },
};

function normalizeCondition(condition: string) {
  return condition?.toLowerCase() ?? "working";
}

export const AssetInventorySummarySection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"assets" | "consumables">("assets");
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = activeTab === "assets" ? await fetchAssets() : await fetchConsumables();
        setRows(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [activeTab]);

  const summaryStats = activeTab === "assets" 
    ? [
        { value: rows.length, label: "Total Assets", valueColor: "text-[#1a1a1a]" },
        { value: rows.filter(r => normalizeCondition(r.condition) === "damaged").length, label: "Damaged", valueColor: "text-[#d72c2c]" },
        { value: rows.filter(r => normalizeCondition(r.condition) === "need repair").length, label: "Need Repair", valueColor: "text-[#e09000]" },
        { value: rows.filter(r => normalizeCondition(r.condition) === "under repair").length, label: "Under Repair", valueColor: "text-[#0056d2]" },
      ]
    : [
        { value: rows.length, label: "Total Consumables", valueColor: "text-[#1a1a1a]" },
        { value: rows.filter(r => r.quantity <= r.lowStockAlert).length, label: "Low Stock", valueColor: "text-[#d72c2c]" },
        { value: rows.reduce((acc, r) => acc + (r.quantity || 0), 0), label: "Total Items", valueColor: "text-[#1a4d3e]" },
      ];

  const headers = activeTab === "assets" 
    ? ["ID", "Equipment", "Condition", "Date"] 
    : ["ID", "Name", "Quantity", "Location"];

  return (
    <section className="w-full bg-white rounded-[16px] border border-[#e8e8e8] shadow-sm flex flex-col overflow-hidden">
      {/* Header & Tabs */}
      <div className="flex items-center justify-between px-6 pt-5 pb-3 flex-wrap gap-3">
        <div className="flex flex-col gap-3">
          <h2 className="font-semibold text-[#1a1a1a] text-xl m-0">Inventory Overview</h2>
          <div className="flex gap-2">
            {(["assets", "consumables"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => { setRows([]); setActiveTab(tab); }}
                className={`px-4 h-[26px] rounded-[5px] font-medium text-xs capitalize transition-colors cursor-pointer ${
                  activeTab === tab ? "bg-[#1a4d3e] text-white" : "bg-[#e8e8e8] text-[#777]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-6">
          {summaryStats.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1">
              <span className={`font-semibold text-2xl leading-none ${s.valueColor}`}>{s.value}</span>
              <span className="font-normal text-[#888] text-[11px] whitespace-nowrap">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Table Container with forced scrollbar and sticky header */}
      <div 
        className="overflow-y-scroll flex-1 px-6 pb-5 max-h-[350px] custom-scrollbar" 
        style={{ scrollbarGutter: 'stable' }}
      >
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-white z-10">
            <tr className="border-b border-[#efefef]">
              {headers.map((col) => (
                <th key={col} className="font-semibold text-[#1a1a1a] text-sm text-left py-3 pr-4">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="text-center py-10 text-[#aaa] text-sm">Loading...</td></tr>
            ) : (
              rows.map((row) => {
                const id = activeTab === "assets" ? row.assetId : row.consumableId;
                return (
                  <tr key={id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa] transition-colors">
                    <td className="py-3 pr-4 text-[#555] text-xs font-mono">{id}</td>
                    <td className="py-3 pr-4 text-[#1a1a1a] text-sm font-medium">{row.name}</td>
                    
                    {activeTab === "assets" ? (
                      <>
                        <td className="py-3 pr-4">
                          <span
                            className="inline-flex items-center justify-center px-3 py-0.5 rounded-full text-[11px] font-medium"
                            style={{ 
                              color: conditionStyles[normalizeCondition(row.condition)]?.color || "#555", 
                              backgroundColor: conditionStyles[normalizeCondition(row.condition)]?.bg || "#eee" 
                            }}
                          >
                            {row.condition || "working"}
                          </span>
                        </td>
                        <td className="py-3 text-[#555] text-sm">
                          {row.purchaseDate ? new Date(row.purchaseDate).toLocaleDateString() : "1/1/2026"}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-3 pr-4 text-[#1a1a1a] text-sm">
                          <span className={row.quantity <= (row.lowStockAlert || 0) ? "text-red-600 font-bold" : ""}>
                            {row.quantity}
                          </span>
                          <span className="text-[#888] ml-1 text-xs">{row.unit || "pcs"}</span>
                        </td>
                        <td className="py-3 text-[#555] text-sm italic">{row.location || "Main Gym"}</td>
                      </>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Scrollbar Styling */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          display: block !important;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1a4d3e;
          border-radius: 10px;
          border: 2px solid #f1f1f1;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #1a4d3e #f1f1f1;
        }
      `}</style>
    </section>
  );
};