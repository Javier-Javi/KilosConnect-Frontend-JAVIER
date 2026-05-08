import React, { useState } from "react";
import type { ProfileData } from "./ProfileMain";

interface ProfileInfoSectionProps {
  profile: ProfileData;
  isEditing: boolean;
  onEditToggle: () => void;
  onSave: (updated: ProfileData) => void;
}

const ProfileInfoSection: React.FC<ProfileInfoSectionProps> = ({
  profile,
  isEditing,
  onEditToggle,
}) => {
  const fullName = `${profile.firstName} ${profile.lastName}`;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] overflow-hidden">
      <div className="h-[100px] bg-gradient-to-br from-[#1a3a30] to-[#2d6a4f]" />
      <div className="flex flex-col items-center px-6 pb-6 -mt-10">
        <div className="w-[72px] h-[72px] rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center">
          <svg className="w-9 h-9 text-[#6b7280]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        </div>
        <h2 className="mt-3 text-[17px] font-bold text-[#0d1f1a]">{fullName}</h2>
        <p className="text-xs text-[#6b7280] mt-0.5">{profile.role}</p>
        <div className="flex items-center gap-1.5 mt-1.5">
          <svg className="w-3 h-3 text-[#9ca3af]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5" />
          </svg>
          <span className="text-xs text-[#9ca3af]">Joined {profile.dateJoined}</span>
        </div>
        <button
          onClick={onEditToggle}
          className={`mt-5 w-full flex items-center justify-center gap-2 text-sm font-medium py-2.5 rounded-xl transition-colors duration-150 ${
            isEditing ? "bg-gray-300 text-[#374151]" : "bg-[#072821] text-white"
          }`}
        >
          {isEditing ? "Cancel Edit" : "Edit Profile"}
        </button>
      </div>
    </div>
  );
};

export default ProfileInfoSection;