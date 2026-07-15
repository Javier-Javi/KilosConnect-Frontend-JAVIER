import React from "react";
import type { ActivityItem } from "./ProfileMain";

interface LayoutConfig {
  bgColor: string;
  borderColor: string;
  textColor: string;
  icon: React.ReactNode;
}

const itemStyles: Record<ActivityItem["type"], LayoutConfig> = {
  maintenance: {
    bgColor: "bg-[#f0fdf4]",
    borderColor: "border-[#dcfce7]",
    textColor: "text-[#111827]",
    icon: (
      <svg className="w-4 h-4 text-[#16a34a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      </svg>
    ),
  },
  incident: {
    bgColor: "bg-[#fef2f2]",
    borderColor: "border-[#fee2e2]",
    textColor: "text-[#111827]",
    icon: (
      <svg className="w-4 h-4 text-[#dc2626]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
  lostfound: {
    bgColor: "bg-[#fffbeb]",
    borderColor: "border-[#fef3c7]",
    textColor: "text-[#111827]",
    icon: (
      <svg className="w-4 h-4 text-[#d97706]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
};

const ProfileActivitySection: React.FC<{ activities: ActivityItem[] }> = ({ activities }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5e7eb]">
      <h2 className="text-base font-bold text-[#111827] mb-4">Recent Activity</h2>
      
      <div className="flex flex-col gap-3">
        {activities.map((item) => {
          const style = itemStyles[item.type];
          return (
            <div
              key={item.id}
              className={`flex flex-col p-4 border rounded-xl ${style.bgColor} ${style.borderColor}`}
            >
              <div className="flex items-center gap-2.5">
                {style.icon}
                <span className={`text-sm font-medium ${style.textColor}`}>{item.title}</span>
              </div>
              <span className="text-xs text-gray-400 mt-1 pl-6">{item.timeAgo}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileActivitySection;