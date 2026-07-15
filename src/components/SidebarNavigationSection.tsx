import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logOut } from "../services/authService";

type Role = "admin" | "custodian";

const navItems = [
  {
    label: "Overview",
    path: "/dashboard",
    roles: ["admin", "custodian"] as Role[],
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>,
  },
  {
    label: "Asset Registry",
    path: "/inventory",
    roles: ["admin", "custodian"] as Role[],
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>,
  },
  {
    label: "Task Monitor",
    path: "/task-monitor",
    roles: ["admin", "custodian"] as Role[],
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>,
  },
  {
    label: "Lost and Found",
    path: "/lost-and-found",
    roles: ["admin", "custodian"] as Role[],
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
  },
  {
    label: "Incident Report",
    path: "/incident-report",
    roles: ["admin", "custodian"] as Role[],
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>,
  },
  {
    label: "Logs",
    path: "/audit-logs",
    roles: ["admin"] as Role[], 
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
  },
  {
    label: "Profile",
    path: "/profile",
    roles: ["admin", "custodian"] as Role[],
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
  },
  {
    label: "Manage Accounts",
    path: "/manage-accounts",
    roles: ["admin"] as Role[], 
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  },
  {
    label: "Archives",
    path: "/archives",
    roles: ["admin"] as Role[], 
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="21 8 21 21 3 21 3 8"></polyline>
        <rect x="1" y="3" width="22" height="5"></rect>
        <line x1="10" y1="12" x2="14" y2="12"></line>
      </svg>
    ),
  },
];

export const SidebarNavigationSection: React.FC<{ userRole: Role }> = ({ userRole }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    logOut();
    navigate("/login");
  };

  const visibleItems = navItems.filter((item) => item.roles.includes(userRole));

  return (
    <aside
      className="fixed top-0 left-0 w-[240px] h-screen bg-[#072821] flex flex-col z-50"
      aria-label="Sidebar navigation"
      style={{ borderRight: "4px solid #072821" }}
    >
      {/* Logo */}
      <div className="flex items-center justify-center py-8 px-6">
        <img className="w-[140px] object-contain" alt="Kilos logo" src="https://c.animaapp.com/C3N4JJvt/img/kilos-white-logo-1.png" />
      </div>

      {/* Nav items */}
      <nav className="flex-1 flex flex-col px-4 gap-1 overflow-y-auto" aria-label="Main navigation">
        {visibleItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 w-full px-4 py-3 rounded-[10px] transition-all cursor-pointer border-l-4 ${
                isActive
                  ? "bg-white/10 text-[#f5a623] border-[#f5a623]"
                  : "text-[#FDFFE0] hover:bg-white/5 border-transparent"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={isActive ? "text-[#f5a623]" : "text-[#FDFFE0]"}>{item.icon}</span>
                <span className="[font-family:'Poppins',Helvetica] font-medium text-sm leading-5 whitespace-nowrap">
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Log Out */}
      <div className="px-4 pb-8">
        <button
          type="button"
          onClick={handleLogoutClick}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-[10px] text-[#c8d8d5] hover:bg-white/5 transition-colors cursor-pointer border-l-4 border-transparent"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FDFFE0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span className="[font-family:'Poppins',Helvetica] font-medium text-[#FDFFE0] text-sm leading-5 whitespace-nowrap">Log Out</span>
        </button>
      </div>
    </aside>
  );
};