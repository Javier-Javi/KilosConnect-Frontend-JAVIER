import React from "react";
import type { PerformanceStats } from "./ManageProfileMain";

interface ProfileStatsSectionProps {
  stats: PerformanceStats;
}

interface StatRowProps {
  label: string;
  sublabel: string;
  value: number;
}

const StatRow: React.FC<StatRowProps> = ({ label, sublabel, value }) => (
  <div className="flex items-center justify-between py-3 border-b border-[#f3f4f6] last:border-0">
    <div>
      <p className="font-['Poppins',Helvetica] font-medium text-sm text-[#1a1a1a]">
        {label}
      </p>
      <p className="font-['Poppins',Helvetica] font-normal text-xs text-[#888] mt-0.5">
        {sublabel}
      </p>
    </div>
    <span className="font-['Poppins',Helvetica] font-semibold text-2xl text-[#1a4d3e] leading-none">
      {value}
    </span>
  </div>
);

const ProfileStatsSection: React.FC<ProfileStatsSectionProps> = ({ stats }) => {
  return (
    <div className="bg-white rounded-2xl border border-[#e8e8e8] shadow-sm px-6 py-5">
      <h2 className="font-['Poppins',Helvetica] font-semibold text-[#1a1a1a] text-xl mb-2 m-0 p-0">
        Performance Stats
      </h2>

      <StatRow
        label="Tasks Completed"
        sublabel="This Month"
        value={stats.tasksCompleted}
      />
      <StatRow
        label="Incidents Reported"
        sublabel="This Month"
        value={stats.incidentsReported}
      />
      <StatRow
        label="Items Logged"
        sublabel="This Month"
        value={stats.itemsLogged}
      />
      <StatRow
        label="Active Days"
        sublabel="This Month"
        value={stats.activeDays}
      />
    </div>
  );
};

export default ProfileStatsSection;