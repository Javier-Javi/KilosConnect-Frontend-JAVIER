// ManageAccountsModule/AccountsListSection.tsx
import React from "react";
import type { UserAccount } from "./types";

interface AccountsListSectionProps {
  accounts: UserAccount[];
  onEditClick: (account: UserAccount) => void;
  onDeleteClick: (id: string, name: string) => void;
}

const AccountsListSection: React.FC<AccountsListSectionProps> = ({ 
  accounts, 
  onEditClick, 
  onDeleteClick 
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-[#fafbfc] text-[11px] font-bold text-gray-500 uppercase tracking-widest">
          <tr>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Phone Number</th>
            <th className="px-6 py-3">User ID</th>
            <th className="px-6 py-3">Role</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Date Added</th>
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((acc) => (
            <tr key={acc.id} className="border-b border-[#eef1f3] text-sm hover:bg-gray-50/70 transition-colors">
              <td className="px-6 py-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#e6ecea] text-[#05211a] font-bold flex items-center justify-center text-xs">
                  {acc.initials}
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-[#1a1a1a]">{acc.name}</span>
                  <span className="text-[#6b6b6b] text-[12px]">{acc.email}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-gray-700">{acc.phoneNumber}</td>
              <td className="px-6 py-4 text-gray-400 font-mono text-[13px]">{acc.id}</td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                  acc.role === "Admin" 
                    ? "bg-purple-100 text-purple-700" 
                    : "bg-blue-100 text-blue-600"
                }`}>
                  {acc.role}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                  acc.status === "Active" 
                    ? "bg-green-100 text-green-600" 
                    : "bg-gray-200 text-gray-600"
                }`}>
                  {acc.status}
                </span>
              </td>
              <td className="px-6 py-4 text-gray-500">{acc.dateAdded}</td>
              <td className="px-6 py-4 text-right">
                <button 
                  onClick={() => onEditClick(acc)} 
                  className="text-blue-600 hover:text-blue-800 mr-4 font-semibold text-xs cursor-pointer"
                >
                  Edit
                </button>
                <button 
                  onClick={() => onDeleteClick(acc.id, acc.name)} 
                  className="text-red-600 hover:text-red-800 font-semibold text-xs cursor-pointer"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AccountsListSection;