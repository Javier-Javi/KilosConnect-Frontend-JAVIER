import React from "react";
import type { ProfileData } from "./ManageProfileMain";
import { useState } from "react";

interface ProfileInfoSectionProps {
  profile: ProfileData;
  isEditing: boolean;
  onEditToggle: () => void;
  onSave: (updated: ProfileData) => void;
}

interface ProfileInfoSectionProps {
  profile: ProfileData;
  isEditing: boolean;
  onEditToggle: () => void;
}

const ProfileInfoSection: React.FC<ProfileInfoSectionProps> = ({
  profile,
  isEditing,
  onEditToggle,
}) => {
  const fullName = `${profile.firstName} ${profile.lastName}`;
  const [showPhotoPopup, setShowPhotoPopup] = useState(false);

  const togglePhotoPopup = () => {
    // Only allow photo changes if not in general info edit mode
    if (!isEditing) {
      setShowPhotoPopup((prev) => !prev);
    }
  };

  return (
    <div className="bg-white rounded-[16px] border border-[#e8e8e8] shadow-sm overflow-hidden">
      {/* Banner */}
      <div className="h-[100px] bg-gradient-to-br from-[#1a3a30] to-[#2d6a4f]" />

      {/* Avatar + Info */}
      <div className="flex flex-col items-center px-6 pb-6 -mt-10">
        <div className="w-[72px] h-[72px] rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={fullName}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <svg
              className="w-9 h-9 text-[#6b7280]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
          )}
        </div>

        <h2 className="mt-3 [font-family:'Poppins',Helvetica] font-semibold text-[#1a1a1a] text-base">
          {fullName}
        </h2>
        <p className="[font-family:'Poppins',Helvetica] font-normal text-[#888] text-xs mt-0.5">
          {profile.role}
        </p>

        <div className="flex items-center gap-1.5 mt-1.5">
          <svg
            className="w-3 h-3 text-[#9ca3af]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0121 18.75m-18 0v-7.5"
            />
          </svg>
          <span className="[font-family:'Poppins',Helvetica] font-normal text-xs text-[#888]">
            Joined {profile.dateJoined}
          </span>
        </div>

        {/* Edit / Cancel */}
        {!isEditing ? (
          <button
            onClick={onEditToggle}
            className="mt-5 w-full flex items-center justify-center gap-2 [font-family:'Poppins',Helvetica] font-medium text-sm bg-[#1a4d3e] hover:bg-[#153d34] text-white py-2.5 rounded-[8px] transition-colors duration-150 cursor-pointer"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125"
              />
            </svg>
            Edit Profile
          </button>
        ) : (
          <button
            onClick={onEditToggle}
            className="mt-5 w-full flex items-center justify-center gap-2 [font-family:'Poppins',Helvetica] font-medium text-sm bg-[#e8e8e8] hover:bg-[#ddd] text-[#555] py-2.5 rounded-[8px] transition-colors duration-150 cursor-pointer"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Cancel Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileInfoSection;