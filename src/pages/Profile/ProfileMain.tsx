import React, { useState } from "react";
import ProfileInfoSection from "./ProfileInfoSection";
import ProfileStatsSection from "./ProfileStatsSection";
import ProfileActivitySection from "./RecentActivitySection";
import { SidebarNavigationSection } from '../../components/SidebarNavigationSection';
import { useAuth } from "../../Hooks/useAuth";


export interface ProfileData {
  firstName: string;
  lastName: string;
  username: string;
  phone: string;
  role: string;
  dateJoined: string;
  location: string;
}

export interface PerformanceStats {
  maintenanceTasks: number;
  incidentsReported: number;
  assetUpdates: number;
  itemsFound: number;
  maintenanceCompletionRate: number;
  tasksThisWeek: number;
}

export interface ActivityItem {
  id: string;
  type: "maintenance" | "incident" | "lostfound";
  title: string;
  timeAgo: string;
}
//MOCKING BIRD
const mockProfile: ProfileData = {
  firstName: "John",
  lastName: "Custodian",
  username: "john.custodian@kilosph.com",
  phone: "+63 912 345 6789",
  role: "Custodian",
  dateJoined: "January 2024",
  location: "Kilos PH, Pasig City"
};

const mockStats: PerformanceStats = {
  maintenanceTasks: 42,
  incidentsReported: 15,
  assetUpdates: 28,
  itemsFound: 8,
  maintenanceCompletionRate: 95,
  tasksThisWeek: 12
};

const mockActivity: ActivityItem[] = [
  { id: "1", type: "maintenance", title: "Completed maintenance verification for Mezzanine", timeAgo: "2 hours ago" },
  { id: "2", type: "incident", title: "Reported cable fraying on Machine B", timeAgo: "5 hours ago" },
  { id: "3", type: "lostfound", title: "Added Black Water Bottle to lost & found", timeAgo: "1 day ago" }
];

const ProfileMain: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData>(mockProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<ProfileData>(profile);

  const handleEditToggle = () => setIsEditing((prev) => !prev);
  const handleSave = () => {
    if (!form.username.includes("@")) {
      alert("Please enter a valid email address containing '@'");
      return;
    }
    setProfile(form);
    setIsEditing(false);
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    const cleanNumbers = numbers.startsWith("63") ? numbers.slice(2) : numbers;
    
    let formatted = "+63";
    if (cleanNumbers.length > 0) formatted += " " + cleanNumbers.substring(0, 3);
    if (cleanNumbers.length > 3) formatted += " " + cleanNumbers.substring(3, 6);
    if (cleanNumbers.length > 6) formatted += " " + cleanNumbers.substring(6, 10);
    
    return formatted.trim();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "phone") {
      setForm((prev) => ({ ...prev, [name]: formatPhoneNumber(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const { role } = useAuth()
  const userRole = (role ?? 'custodian, admin') as React.ComponentProps<typeof SidebarNavigationSection>["userRole"]

  
  return (
    <div className="min-h-screen bg-[#f4f5f6]">
      <SidebarNavigationSection userRole={userRole}/>
      <div className="lg:pl-[280px] p-8">
        {/* Header Title */}
        <div className="mb-6">
          <h1 className="text-[28px] font-bold text-[#0d1f1a] leading-tight">My Profile</h1>
          <p className="text-sm text-[#6b7280] mt-0.5">Account information and performance statistics</p>
        </div>

        {/* Core Layout Split */}
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">
          {/* Left Column: Info & Permissions */}
          <div className="flex flex-col gap-6">
            <ProfileInfoSection
              profile={profile}
              form={form}
              isEditing={isEditing}
              onEditToggle={handleEditToggle}
              onChange={handleChange}
              onSave={handleSave}
              onCancel={() => { setForm(profile); setIsEditing(false); }}
            />
          </div>

          {/* Right Column: Stats & Recent Activity */}
          <div className="flex flex-col gap-6">
            <ProfileStatsSection stats={mockStats} />
            <ProfileActivitySection activities={mockActivity} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileMain;