import { AssetInventorySummarySection } from "./sections/AssetInventoryDash";
import { LostAndFoundTrackingSection } from "./sections/LostAndFoundTrackingSection";
import { SafetyIncidentReportSection } from "./sections/SafetyIncidentReportSection";
import { SidebarNavigationSection } from "../../components/SidebarNavigationSection";
import { TaskStatusPanelSection } from "./sections/TaskStatusPanelSection";

export const DashboardPage: React.FC = () => {
  return (
    <div className="flex h-screen bg-[#f4f5f6] overflow-hidden">
      {/* Fixed Sidebar */}
      <SidebarNavigationSection />

      {/* Main content area that handles scrolling for the whole page */}
      <div className="flex flex-col flex-1 min-w-0 ml-[240px] overflow-y-auto h-full">
        {/* Sticky Header */}
        <header className="sticky top-0 z-20 flex items-center justify-between px-8 pt-8 pb-4 bg-white border-b border-[#e8e8e8]">
          <div>
            <h1 className="[font-family:'Poppins',Helvetica] font-semibold text-[#1f1f1f] text-[36px] leading-tight m-0 p-0">
              Dashboard
            </h1>
            <p className="mt-0.5 [font-family:'Poppins',Helvetica] font-normal text-[#6b6b6b] text-base leading-normal m-0 p-0">
              Welcome, BingBong!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#f0f0f0] transition-colors cursor-pointer"
              aria-label="View notifications"
            >
              <img
                className="w-6 h-6 object-contain"
                alt="Notifications"
                src="https://c.animaapp.com/C3N4JJvt/img/notification@2x.png"
              />
            </button>
            <button
              type="button"
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#f0f0f0] transition-colors cursor-pointer"
              aria-label="Open profile menu"
            >
              <img
                className="w-8 h-8 object-cover rounded-full"
                alt="Profile"
                src="https://c.animaapp.com/C3N4JJvt/img/profile@2x.png"
              />
            </button>
          </div>
        </header>

        {/* Dashboard Grid Content */}
        <div className="flex flex-1 gap-5 p-6">
          {/* Left column (Inventory, Safety, Lost & Found) */}
          <div className="flex flex-col gap-5 flex-1 min-w-0">
            <AssetInventorySummarySection />
            <SafetyIncidentReportSection />
            <LostAndFoundTrackingSection />
          </div>

          {/* Right column (Tasks) */}
          <div className="flex-shrink-0 w-[300px]">
            <TaskStatusPanelSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;