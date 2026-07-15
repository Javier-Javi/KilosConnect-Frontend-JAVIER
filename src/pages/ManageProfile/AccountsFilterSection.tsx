// ManageAccountsModule/AccountsFilterSection.tsx
import React from "react";

interface AccountsFilterSectionProps {
  totalAccounts: number;
  onSearchChange: (value: string) => void;
  onAddNewUser: () => void;
}

const AccountsFilterSection: React.FC<AccountsFilterSectionProps> = ({
  totalAccounts,
  onSearchChange,
  onAddNewUser
}) => {
  return (
    <>
      <div className="flex items-center justify-between px-6 py-5 border-b border-[#eef1f3]">
        <span className="font-semibold text-xl">User Accounts ({totalAccounts})</span>
        <button 
          type="button" 
          onClick={onAddNewUser}
          className="bg-[#0b3026] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#08241d] transition-colors cursor-pointer"
        >
          + Add New User
        </button>
      </div>

      <div className="px-6 py-4">
        <input
          type="text"
          placeholder="Search users..."
          className="w-full bg-[#fafbfc] border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#0b3026]"
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
        />
      </div>
    </>
  );
};

export default AccountsFilterSection;