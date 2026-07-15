import React, { useState, useMemo } from "react";
import ArchivesInfoSection from "./ArchivesInfoSection";
import ArchivesStatsSection from "./ArchivesStatsSection";
import RecentArchivesSection from "./RecentArchivesSection";
import { SidebarNavigationSection } from '../../components/SidebarNavigationSection';
import { useAuth } from "../../Hooks/useAuth";

export interface ArchiveItem {
  id: string;
  archiveId: string;
  title: string;
  type: "Incident" | "Asset" | "Maintenance";
  description: string;
  originalDate: string;
  archivedDate: string;
  archivedBy: string;
  reason: string;
}

export interface ArchiveStats {
  total: number;
  incidents: number;
  maintenance: number;
  assets: number;
}

//MOCKING BIRD
const initialArchives: ArchiveItem[] = [
  {
    id: "INC-004",
    archiveId: "ARC-001",
    title: "INC-004 - Pull-up Bar Loose Bolts",
    type: "Incident",
    description: "Maintenance incident resolved. Loose bolts tightened and verified safe.",
    originalDate: "2024-05-08",
    archivedDate: "2024-05-09",
    archivedBy: "Sarah Admin",
    reason: "Incident resolved and closed",
  },
  {
    id: "ARC-002",
    archiveId: "ARC-002",
    title: "Bench Press Station #3 - Decommissioned",
    type: "Asset",
    description: "Old bench press station removed from facility due to structural damage.",
    originalDate: "2020-03-15",
    archivedDate: "2024-04-20",
    archivedBy: "Sarah Admin",
    reason: "Asset decommissioned and removed",
  },
  {
    id: "ARC-003",
    archiveId: "ARC-003",
    title: "Monthly Deep Clean - April 2024",
    type: "Maintenance",
    description: "Complete facility deep cleaning and equipment maintenance cycle completed.",
    originalDate: "2024-04-01",
    archivedDate: "2024-05-02",
    archivedBy: "Sarah Admin",
    reason: "Maintenance cycle completed",
  },
  {
    id: "INC-002",
    archiveId: "ARC-004",
    title: "INC-002 - Treadmill Belt Slipping",
    type: "Incident",
    description: "Treadmill belt replaced and recalibrated for standard operation.",
    originalDate: "2024-02-12",
    archivedDate: "2024-02-15",
    archivedBy: "Sarah Admin",
    reason: "Incident resolved and closed",
  }
];

const ArchivesMain: React.FC = () => {
  const [archives, setArchives] = useState<ArchiveItem[]>(initialArchives);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  
  // Modal Overlays state management
  const [viewItem, setViewItem] = useState<ArchiveItem | null>(null);
  const [restoreItem, setRestoreItem] = useState<ArchiveItem | null>(null);

  const filteredArchives = useMemo(() => {
    return archives.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.archiveId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType =
        selectedType === "All Types" || item.type === selectedType;
      return matchesSearch && matchesType;
    });
  }, [archives, searchQuery, selectedType]);

  const stats: ArchiveStats = useMemo(() => {
    return {
      total: archives.length,
      incidents: archives.filter((i) => i.type === "Incident").length,
      maintenance: archives.filter((i) => i.type === "Maintenance").length,
      assets: archives.filter((i) => i.type === "Asset").length,
    };
  }, [archives]);

  const executeRestore = (id: string) => {
    setArchives((prev) => prev.filter((item) => item.id !== id));
    setRestoreItem(null);
  };

  const { role } = useAuth()
  const userRole = (role ?? 'admin') as React.ComponentProps<typeof SidebarNavigationSection>["userRole"]


  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <SidebarNavigationSection userRole={userRole}/>
      <div className="lg:pl-[280px] p-8">
        
        <div className="mb-6">
          <h1 className="text-[28px] font-bold text-[#0f172a] tracking-tight">Archives</h1>
          <p className="text-sm text-[#64748b] mt-0.5">Historical records of completed and decommissioned items</p>
        </div>

        <ArchivesInfoSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
        />

        <ArchivesStatsSection stats={stats} />

        <RecentArchivesSection 
          items={filteredArchives} 
          onView={(item) => setViewItem(item)}
          onRestore={(item) => setRestoreItem(item)}
        />

        {/* 1. VIEW DETAILED RECORD PANEL MODAL */}
        {viewItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <div className="bg-white w-full max-w-[540px] rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-[#113e33] p-6 text-white flex justify-between items-center">
                <div>
                  <h3 className="text-[17px] font-bold tracking-tight">{viewItem.title}</h3>
                  <p className="text-xs text-emerald-200/80 mt-0.5 tracking-wide">{viewItem.archiveId}</p>
                </div>
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/15 border border-white/10 uppercase tracking-wider">
                  {viewItem.type}
                </span>
              </div>
              
              <div className="p-6 space-y-5">
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Description</label>
                  <p className="text-sm text-[#334155] bg-slate-50 p-3.5 rounded-xl border border-slate-100 leading-relaxed">
                    {viewItem.description}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-2">
                  <div>
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Original Date</label>
                    <span className="text-sm font-semibold text-[#1e293b] mt-0.5 block">{viewItem.originalDate}</span>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Archived Date</label>
                    <span className="text-sm font-semibold text-[#1e293b] mt-0.5 block">{viewItem.archivedDate}</span>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Archived By</label>
                    <span className="text-sm font-semibold text-[#1e293b] mt-0.5 block">{viewItem.archivedBy}</span>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Reason For Archiving</label>
                    <span className="text-sm font-semibold text-[#1e293b] mt-0.5 block truncate" title={viewItem.reason}>
                      {viewItem.reason}
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 flex justify-end">
                <button 
                  onClick={() => setViewItem(null)}
                  className="px-5 py-2.5 bg-[#113e33] hover:bg-[#14493c] text-white rounded-xl text-xs font-bold transition-all duration-150 active:scale-[0.98] shadow-sm shadow-slate-900/10"
                >
                  Close View
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. BEAUTIFIED RESTORE CONFIRMATION MODAL */}
        {restoreItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <div className="bg-white w-full max-w-[440px] rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-[#3b82f6] p-6 text-white flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 15H19" />
                    </svg>
                  </div>
                  <h3 className="text-base font-bold tracking-tight">Restore Record</h3>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-[#475569] text-sm leading-relaxed">
                  Are you sure you want to restore <span className="font-bold text-[#0f172a]">"{restoreItem.title}"</span>? This will relocate the tracking card back onto live production monitors.
                </p>
              </div>

              <div className="px-6 pb-6 pt-2 flex items-center justify-end gap-2.5">
                <button 
                  onClick={() => setRestoreItem(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#334155] rounded-xl text-xs font-semibold transition-all duration-150"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => executeRestore(restoreItem.id)}
                  className="px-5 py-2.5 bg-[#3b82f6] hover:bg-[#3f7bdb] text-white rounded-xl text-xs font-bold transition-all duration-150 active:scale-[0.98] shadow-sm shadow-slate-900/10"
                >
                  Confirm Restore
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ArchivesMain;