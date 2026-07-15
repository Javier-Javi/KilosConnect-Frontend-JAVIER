import React from "react";
import type { PerformanceStats } from "./ProfileMain";

const ProfileStatsSection: React.FC<{ stats: PerformanceStats }> = ({ stats }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5e7eb]">
      <h2 className="text-base font-bold text-[#111827] mb-4">Performance Statistics</h2>
      
      {/* 4 Cards Row Configuration */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {/* Maintenance Tasks */}
        <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[28px] font-bold text-[#15803d]">{stats.maintenanceTasks}</span>
            <svg className="w-5 h-5 text-[#15803d]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </div>
          <span className="text-xs font-medium text-[#16a34a] mt-2">Maintenance Tasks</span>
        </div>

        {/* Incidents Reported */}
        <div className="bg-[#fef2f2] border border-[#fecaca] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[28px] font-bold text-[#b91c1c]">{stats.incidentsReported}</span>
            <svg className="w-5 h-5 text-[#b91c1c]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <span className="text-xs font-medium text-[#dc2626] mt-2">Incidents Reported</span>
        </div>

        {/* Asset Updates */}
        <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[28px] font-bold text-[#1d4ed8]">{stats.assetUpdates}</span>
            <svg className="w-5 h-5 text-[#1d4ed8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
          </div>
          <span className="text-xs font-medium text-[#2563eb] mt-2">Asset Updates</span>
        </div>

        {/* Items Found */}
        <div className="bg-[#fffbeb] border border-[#fef3c7] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[28px] font-bold text-[#b45309]">{stats.itemsFound}</span>
            <svg className="w-5 h-5 text-[#b45309]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <span className="text-xs font-medium text-[#d97706] mt-2">Items Found</span>
        </div>
      </div>

      {/* Progress Bars Section */}
      <div className="border-t border-gray-100 pt-5 space-y-4">
        <h3 className="text-sm font-bold text-[#111827]">This Month</h3>
        
        {/* Progress 1 */}
        <div>
          <div className="flex justify-between text-xs font-medium text-[#4b5563] mb-1.5">
            <span>Maintenance Completion Rate</span>
            <span className="text-[#113e33] font-bold">{stats.maintenanceCompletionRate}%</span>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div className="bg-[#113e33] h-full rounded-full" style={{ width: `${stats.maintenanceCompletionRate}%` }} />
          </div>
        </div>

        {/* Progress 2 */}
        <div>
          <div className="flex justify-between text-xs font-medium text-[#4b5563] mb-1.5">
            <span>Tasks This Week</span>
            <span className="text-[#8b5cf6] font-bold">{stats.tasksThisWeek} completed</span>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div className="bg-[#8b5cf6] h-full rounded-full" style={{ width: '85%' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileStatsSection;