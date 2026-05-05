// ManageAccountsModule/AccountsStatsSection.tsx
import React from "react";

const AccountsStatsSection: React.FC = () => {
  return (
    <header className="flex items-center justify-between px-8 pt-8 pb-4 bg-white border-b border-[#e8e8e8]">
      <div>
        <h1 className="font-semibold text-[36px] m-0">Manage Accounts</h1>
        <p className="text-[#6b6b6b] text-base">Add, edit, and manage user accounts</p>
      </div>
      <div className="flex items-center gap-4">
        <img className="w-10 h-10" src="https://c.animaapp.com/C3N4JJvt/img/notification@2x.png" alt="notifications" />
        <img className="w-10 h-10 rounded-full" src="https://c.animaapp.com/C3N4JJvt/img/profile@2x.png" alt="profile" />
      </div>
    </header>
  );
};

export default AccountsStatsSection;