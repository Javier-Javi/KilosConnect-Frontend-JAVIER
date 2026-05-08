import React from "react";
import type { ActivityItem } from "./ManageProfileMain";

interface ProfileActivitySectionProps {
  activities: ActivityItem[];
}

const activityDotColor: Record<ActivityItem["type"], string> = {
  task: "bg-[#1a4d3e]",
  incident: "bg-[#ef4444]",
  inventory: "bg-[#3b82f6]",
  log: "bg-[#f59e0b]",
};

const ProfileActivitySection: React.FC<ProfileActivitySectionProps> = ({
  activities,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-[#e8e8e8] shadow-sm px-6 py-5">
      <h2 className="font-['Poppins',Helvetica] font-semibold text-[#1a1a1a] text-xl mb-4 m-0 p-0">
        Recent Activity
      </h2>

      {activities.length === 0 ? (
        <p className="font-['Poppins',Helvetica] font-normal text-xs text-[#888] text-center py-6">
          No recent activity available.
        </p>
      ) : (
        <div className="flex flex-col gap-0">
          {activities.map((item, idx) => (
            <div
              key={item.id}
              className={`flex items-start justify-between py-4 ${
                idx !== activities.length - 1
                  ? "border-b border-[#f3f4f6]"
                  : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                    activityDotColor[item.type]
                  }`}
                />
                <div>
                  <p className="font-['Poppins',Helvetica] font-medium text-sm text-[#1a1a1a]">
                    {item.title}
                  </p>
                  <p className="font-['Poppins',Helvetica] font-normal text-xs text-[#888] mt-0.5">
                    {item.description}
                  </p>
                </div>
              </div>
              <span className="font-['Poppins',Helvetica] font-normal text-xs text-[#888] whitespace-nowrap ml-4 mt-0.5">
                {item.timeAgo}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileActivitySection;