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
    <table className="w-full text-left">
      <thead className="bg-[#fafbfc] text-[11px] font-bold text-gray-500 uppercase tracking-widest">
        <tr>
          <th className="px-6 py-3">Name</th>
          <th className="px-6 py-3">Phone Number</th>
          <th className="px-6 py-3">User ID</th>
          <th className="px-6 py-3">Role</th>
          <th className="px-6 py-3">Status</th>
          <th className="px-6 py-3">Date Added</th>
          <th className="px-6 py-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        {accounts.map((acc) => (
          <tr key={acc.id} className="border-b border-[#eef1f3] text-sm hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#0b3026] text-white flex items-center justify-center font-bold text-xs">
                {acc.initials}
              </div>
              <div className="flex flex-col">
                <span className="font-semibold">{acc.name}</span>
                <span className="text-[#6b6b6b] text-[12px]">{acc.email}</span>
              </div>
            </td>
            <td className="px-6 py-4">{acc.phoneNumber}</td>
            <td className="px-6 py-4 text-gray-400 font-mono text-[13px]">{acc.id}</td>
            <td className="px-6 py-4">
              {/* Conditional styling for Role */}
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
            <td className="px-6 py-4 text-gray-400">{acc.dateAdded}</td>
            <td className="px-6 py-4">
              <button onClick={() => onEditClick(acc)} className="text-blue-600 mr-3 font-medium hover:underline">Edit</button>
              <button onClick={() => onDeleteClick(acc.id, acc.name)} className="text-red-500 font-medium hover:underline">Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AccountsListSection;