import React from "react";
import type { ArchiveStats } from "./ArchivesMain";

const ArchivesStatsSection: React.FC<{ stats: ArchiveStats }> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white border border-[#e2e8f0] p-5 rounded-2xl shadow-sm">
        <span className="text-xs font-medium text-[#64748b]">Total Archived</span>
        <div className="text-2xl font-bold text-[#0f172a] mt-1.5">{stats.total}</div>
      </div>

      <div className="bg-[#fff5f5] border border-[#fecaca] p-5 rounded-2xl shadow-sm">
        <span className="text-xs font-semibold text-[#ef4444]">Incidents</span>
        <div className="text-2xl font-bold text-[#ef4444] mt-1.5">{stats.incidents}</div>
      </div>

      <div className="bg-[#f2fdf7] border border-[#bbf7d0] p-5 rounded-2xl shadow-sm">
        <span className="text-xs font-semibold text-[#22c55e]">Maintenance</span>
        <div className="text-2xl font-bold text-[#22c55e] mt-1.5">{stats.maintenance}</div>
      </div>

      <div className="bg-[#f0f7ff] border border-[#bfdbfe] p-5 rounded-2xl shadow-sm">
        <span className="text-xs font-semibold text-[#3b82f6]">Assets</span>
        <div className="text-2xl font-bold text-[#3b82f6] mt-1.5">{stats.assets}</div>
      </div>
    </div>
  );
};

export default ArchivesStatsSection;