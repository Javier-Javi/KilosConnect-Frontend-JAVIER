import React from "react";
import type { ProfileData } from "./ProfileMain";

interface ProfileInfoSectionProps {
  profile: ProfileData;
  form: ProfileData;
  isEditing: boolean;
  onEditToggle: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onCancel: () => void;
}

const ProfileInfoSection: React.FC<ProfileInfoSectionProps> = ({
  profile,
  form,
  isEditing,
  onEditToggle,
  onChange,
  onSave,
  onCancel
}) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5e7eb] flex flex-col items-center">
        {/* Profile Avatar Initials Circle */}
        <div className="w-[100px] h-[100px] rounded-full bg-[#113e33] flex items-center justify-center text-white text-[32px] font-bold tracking-wider mb-4">
          JC
        </div>

        {isEditing ? (
          <div className="w-full flex flex-col gap-3 mb-4">
            <input type="text" name="firstName" value={form.firstName} onChange={onChange} className="border p-2 text-sm rounded-lg w-full" placeholder="First Name" />
            <input type="text" name="lastName" value={form.lastName} onChange={onChange} className="border p-2 text-sm rounded-lg w-full" placeholder="Last Name" />
            <input type="email" name="username" value={form.username} onChange={onChange} className="border p-2 text-sm rounded-lg w-full" placeholder="Email" />
            <input type="text" name="phone" value={form.phone} onChange={onChange} className="border p-2 text-sm rounded-lg w-full" placeholder="Phone" />
            <input type="text" name="location" value={form.location} onChange={onChange} className="border p-2 text-sm rounded-lg w-full" placeholder="Location" />
            <div className="flex gap-2 mt-2">
              <button onClick={onSave} className="flex-1 bg-[#1a3a30] text-white text-xs py-2 rounded-lg font-medium">Save</button>
              <button onClick={onCancel} className="flex-1 bg-gray-100 text-gray-700 text-xs py-2 rounded-lg font-medium">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="text-center w-full">
            <h2 className="text-xl font-bold text-[#111827]">{profile.firstName} {profile.lastName}</h2>
            <p className="text-sm text-gray-500 mt-0.5">@{profile.username.split('@')[0]}</p>
            
            {/* Green Role Tag */}
            <div className="inline-block mt-3 px-3 py-1 bg-[#e6f4ea] text-[#137333] text-xs font-semibold rounded-full">
              {profile.role}
            </div>

            {/* Profile Meta Details list */}
            <div className="mt-6 space-y-3.5 text-left text-sm text-[#4b5563] border-t border-gray-100 pt-5">
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <span className="truncate">{profile.username}</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                <span>{profile.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span>{profile.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <span>Joined: {profile.dateJoined}</span>
              </div>
            </div>

            <button
              onClick={onEditToggle}
              className="mt-6 w-full py-3 bg-[#113e33] hover:bg-[#164e40] text-white font-medium text-sm rounded-xl transition-colors"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>

      {/* Access Permissions Box */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5e7eb]">
        <h3 className="text-base font-bold text-[#111827] mb-4">Access Permissions</h3>
        <div className="space-y-3">
          {[
            "Maintenance Verification",
            "Incident Reporting",
            "Asset Updates",
            "Lost & Found"
          ].map((permission) => (
            <div key={permission} className="flex items-center justify-between text-sm py-0.5">
              <span className="text-[#4b5563]">{permission}</span>
              <svg className="w-5 h-5 text-[#10b981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileInfoSection;