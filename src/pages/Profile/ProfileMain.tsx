import React, { useState } from "react";
// Assuming SidebarProfile is a separate component in your project
// import SidebarProfile from "../../src/components/SidebarProfile";
import ProfileInfoSection from "./ProfileInfoSection";
import ProfileStatsSection from "./ProfileStatsSection";
import ProfileActivitySection from "./RecentActivitySection";
import { useAuth } from '../../Hooks/useAuth';
import { SidebarNavigationSection } from '../../components/SidebarNavigationSection';

export interface ProfileData {
  firstName: string;
  lastName: string;
  username: string;
  phone: string;
  role: string;
  dateJoined: string;
  avatarUrl?: string;
}

export interface PerformanceStats {
  tasksCompleted: number;
  incidentsReported: number;
  itemsLogged: number;
  activeDays: number;
}

export interface ActivityItem {
  id: string;
  type: "task" | "incident" | "inventory" | "log";
  title: string;
  description: string;
  timeAgo: string;
}

// Mock data populated to match image_179009.png[cite: 2]
const mockProfile: ProfileData = {
  firstName: "Bingbong",
  lastName: "Marcos",
  username: "bingg@kilosph.com",
  phone: "+63 912 345 6789",
  role: "Admin",
  dateJoined: "2023-01-15",
  avatarUrl: "", // Leave empty to show the default SVG icon from ProfileInfoSection
};

const mockStats: PerformanceStats = {
  tasksCompleted: 156,
  incidentsReported: 8,
  itemsLogged: 45,
  activeDays: 23,
};

const mockActivity: ActivityItem[] = [
  {
    id: "1",
    type: "task",
    title: "Completed task",
    description: "Clean Mezzanine Floor",
    timeAgo: "2 hours ago",
  },
  {
    id: "2",
    type: "incident",
    title: "Reported incident",
    description: "Squat rack unstable",
    timeAgo: "3 hours ago",
  },
  {
    id: "3",
    type: "inventory",
    title: "Updated inventory",
    description: "Floor Cleaner stock",
    timeAgo: "5 hours ago",
  },
  {
    id: "4",
    type: "task",
    title: "Completed task",
    description: "Sanitize Equipment",
    timeAgo: "1 day ago",
  },
  {
    id: "5",
    type: "log", // Representing the "Added lost item" color in image
    title: "Added lost item",
    description: "Black Water Bottle",
    timeAgo: "1 day ago",
  },
];

const ProfileMain: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData>(mockProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<ProfileData>(profile);

  const handleEditToggle = () => setIsEditing((prev) => !prev);
  const handleSave = (updated: ProfileData) => {
    setProfile(updated);
    setForm(updated);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCancel = () => {
    setForm(profile);
    setIsEditing(false);
  };

  const handleSubmit = () => handleSave(form);

  const { role, user } = useAuth()
  const userRole = (role ?? 'custodian') as React.ComponentProps<typeof SidebarNavigationSection>["userRole"]


  return (
    <div className="min-h-screen bg-[#f4f5f6]">
      <SidebarNavigationSection userRole={userRole}/>
      <div className="lg:pl-[280px] p-8">
        <div className="mb-6">
          <h1 className="text-[28px] font-bold text-[#0d1f1a] leading-tight">
            Profile
          </h1>
          <p className="text-sm text-[#6b7280] mt-0.5">
            Manage your account information and view your activity
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,420px)_1fr] gap-5">
          <div className="flex flex-col gap-5">
            <ProfileInfoSection
              profile={profile}
              isEditing={isEditing}
              onEditToggle={handleEditToggle}
              onSave={handleSave}
            />
            <ProfileStatsSection stats={mockStats} />
          </div>

          <div className="flex flex-col gap-5">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5e7eb]">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold text-[#0d1f1a]">
                  Personal Information
                </h2>
                {isEditing && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSubmit}
                      className="bg-[#183a30] hover:bg-[#336658] text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="border border-[#d1d5db] hover:bg-[#f9fafb] text-[#374151] text-sm font-medium px-4 py-1.5 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
              
              {isEditing ? (
                <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                  {(
                    [
                      { name: "firstName", label: "First Name" },
                      { name: "lastName", label: "Last Name" },
                      { name: "username", label: "Email Address" },
                      { name: "phone", label: "Phone Number" },
                    ] as { name: keyof ProfileData; label: string }[]
                  ).map(({ name, label }) => (
                    <div key={name}>
                      <label className="block text-xs text-[#6b7280] mb-1.5 font-medium">
                        {label}
                      </label>
                      <input
                        name={name}
                        value={form[name]}
                        onChange={handleChange}
                        className="w-full border border-[#d1d5db] rounded-lg px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#1a3a30]"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                  <InfoField label="First Name" value={profile.firstName} />
                  <InfoField label="Last Name" value={profile.lastName} />
                  <InfoField label="Email Address" value={profile.username} icon="user" />
                  <InfoField label="Phone Number" value={profile.phone} icon="phone" />
                  <InfoField label="Role" value={profile.role} icon="shield" />
                  <InfoField label="Date Joined" value={profile.dateJoined} icon="calendar" />
                </div>
              )}
            </div>
            <ProfileActivitySection activities={mockActivity} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Supporting Components for Info Fields[cite: 2]
const iconMap: Record<string, React.ReactNode> = {
  user: (
    <svg className="w-3.5 h-3.5 text-[#6b7280]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 1114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  ),
  phone: (
    <svg className="w-3.5 h-3.5 text-[#6b7280]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  ),
  shield: (
    <svg className="w-3.5 h-3.5 text-[#6b7280]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  ),
  calendar: (
    <svg className="w-3.5 h-3.5 text-[#6b7280]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  ),
};

const InfoField: React.FC<{ label: string; value: string; icon?: string }> = ({ label, value, icon }) => (
  <div>
    <div className="flex items-center gap-1.5 mb-1">
      {icon && iconMap[icon]}
      <span className="text-xs text-[#9ca3af] font-medium">{label}</span>
    </div>
    <p className="text-sm font-medium text-[#111827]">{value}</p>
  </div>
);

export default ProfileMain;