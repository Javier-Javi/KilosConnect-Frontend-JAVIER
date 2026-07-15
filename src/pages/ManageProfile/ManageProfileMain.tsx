// ManageAccountsModule/ManageProfileMain.tsx
import React, { useState } from "react";
import { SidebarNavigationSection } from '../../components/SidebarNavigationSection';
import { useAuth } from "../../Hooks/useAuth";

// Modular Imports
import type { UserAccount, NewUserForm } from "./types";
import AccountsStatsSection from "./AccountsStatsSection";
import AccountsFilterSection from "./AccountsFilterSection";
import AccountsListSection from "./AccountsListSection";
import AccountsIcons from "./AccountsIcons";

const ManageAccountsMain: React.FC = () => {
  const [search, setSearch] = useState("");
  const [accounts, setAccounts] = useState<UserAccount[]>([
    { id: "USER-1032CD8C", initials: "MG", name: "Maria Garcia", email: "maria.garcia@kilosph.com", role: "Custodian", status: "Active", dateAdded: "2/20/2024", phoneNumber: "63+ 956 745 2678" },
    { id: "USER-1029ZS8C", initials: "DC", name: "David Chen", email: "david.chen@kilosph.com", role: "Custodian", status: "Active", dateAdded: "3/10/2024", phoneNumber: "63+ 998 574 9281" },
    { id: "USER-1029ZS8D", initials: "DT", name: "David Tan", email: "david.Tan@kilosph.com", role: "Admin", status: "Inactive", dateAdded: "4/6/2024", phoneNumber: "63+ 998 574 9281" }
  ]);

  // Modals state
  const [isAddOpen, useStateAdd] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: "", name: "" });
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [formData, setFormData] = useState<NewUserForm>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "63+ ",
    role: "Admin",
    password: ""
  });

  const [editFormData, setEditFormData] = useState<UserAccount | null>(null);

  const filteredAccounts = accounts.filter(acc =>
    acc.name.toLowerCase().includes(search.toLowerCase()) ||
    acc.email.toLowerCase().includes(search.toLowerCase()) ||
    acc.id.toLowerCase().includes(search.toLowerCase())
  );

  // Formats digits into "63+ ### ### ####" automatically
  const formatPhoneNumber = (value: string): string => {
    // Extract only digits from the input
    const digits = value.replace(/\D/g, "");
    
    // Discard any initial '63' from re-parsing to avoid duplication
    let coreDigits = digits;
    if (digits.startsWith("63")) {
      coreDigits = digits.substring(2);
    }

    // Limit maximum length of phone number digits to 10 numbers
    const truncated = coreDigits.substring(0, 10);

    // Build format structured as: "63+ ### ### ####"
    let formatted = "63+ ";
    if (truncated.length > 0) {
      formatted += truncated.substring(0, 3);
    }
    if (truncated.length >= 4) {
      formatted += " " + truncated.substring(3, 6);
    }
    if (truncated.length >= 7) {
      formatted += " " + truncated.substring(6, 10);
    }

    return formatted;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let value = e.target.value;
    
    if (e.target.name === "phoneNumber") {
      value = formatPhoneNumber(value);
    }
    
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (editFormData) {
      let value = e.target.value;
      
      if (e.target.name === "phoneNumber") {
        value = formatPhoneNumber(value);
      }
      
      setEditFormData({ ...editFormData, [e.target.name]: value });
    }
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    const initials = `${formData.firstName[0] || ''}${formData.lastName[0] || ''}`.toUpperCase();
    
    const newAcc: UserAccount = {
      id: `USER-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      initials: initials || "U",
      name: fullName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      role: formData.role,
      status: "Active",
      dateAdded: new Date().toLocaleDateString()
    };

    setAccounts([newAcc, ...accounts]);
    useStateAdd(false);
    setFormData({ firstName: "", lastName: "", email: "", phoneNumber: "63+ ", role: "Admin", password: "" });
  };

  const handleEditClick = (account: UserAccount) => {
    setEditFormData(account);
    setIsEditOpen(true);
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFormData) return;

    setAccounts(accounts.map(acc => acc.id === editFormData.id ? editFormData : acc));
    setIsEditOpen(false);
    setEditFormData(null);
  };

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteConfirm({ isOpen: true, id, name });
  };

  const confirmDelete = () => {
    setAccounts(accounts.filter(acc => acc.id !== deleteConfirm.id));
    setDeleteConfirm({ isOpen: false, id: "", name: "" });
  };

  const { role } = useAuth()
  const userRole = (role ?? 'custodian, admin') as React.ComponentProps<typeof SidebarNavigationSection>["userRole"]


  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <SidebarNavigationSection userRole={userRole}/>
      
      <div className="lg:pl-[280px] p-8">
        <AccountsStatsSection />

        <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] overflow-hidden">
          <AccountsFilterSection 
            totalAccounts={accounts.length} 
            onSearchChange={(val) => setSearch(val)} 
            onAddNewUser={() => useStateAdd(true)} 
          />

          <AccountsListSection 
            accounts={filteredAccounts} 
            onEditClick={(acc) => handleEditClick(acc)} 
            onDeleteClick={(id, name) => handleDeleteClick(id, name)} 
          />
        </div>

        {/* --- ADD NEW USER POPUP --- */}
        {isAddOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-[20px] w-full max-w-[500px] overflow-hidden shadow-2xl">
              <div className="bg-[#0b3026] px-8 py-6">
                <h3 className="text-white text-2xl font-bold tracking-tight">Add New User</h3>
              </div>
              <form onSubmit={handleCreateUser} className="p-8 space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-[#4a5568] mb-1.5">First Name</label>
                  <input required name="firstName" value={formData.firstName} onChange={handleInputChange} type="text" className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#0b3026]" placeholder="e.g. Maria" />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-[#4a5568] mb-1.5">Last Name</label>
                  <input required name="lastName" value={formData.lastName} onChange={handleInputChange} type="text" className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#0b3026]" placeholder="e.g. Garcia" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4a5568] mb-1.5">Email Address</label>
                  <input required name="email" value={formData.email} onChange={handleInputChange} type="email" className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#0b3026]" placeholder="maria@kilosph.com" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4a5568] mb-1.5">Phone Number</label>
                  <input required name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} type="text" className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#0b3026]" placeholder="63+ 000 000 0000" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4a5568] mb-1.5">Role</label>
                  <select name="role" value={formData.role} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#0b3026] bg-white">
                    <option value="Admin">Admin</option>
                    <option value="Custodian">Custodian</option>
                  </select>
                </div>

                <div className="relative">
                  <label className="block text-xs font-semibold text-[#4a5568] mb-1.5">Temporary Password</label>
                  <input required name="password" value={formData.password} onChange={handleInputChange} type={showPassword ? "text" : "password"} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#0b3026]" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-[38px] text-gray-400 hover:text-gray-600 cursor-pointer">
                    <AccountsIcons name={showPassword ? "eye-off" : "eye"} size={18} />
                  </button>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                  <button type="button" onClick={() => useStateAdd(false)} className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-bold text-[#1a1a1a] hover:bg-gray-50 cursor-pointer">Cancel</button>
                  <button type="submit" className="px-5 py-2.5 bg-[#0b3026] text-white rounded-lg text-sm font-bold hover:bg-[#08241d] cursor-pointer">Create Account</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- EDIT USER POPUP --- */}
        {isEditOpen && editFormData && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-[20px] w-full max-w-[500px] overflow-hidden shadow-2xl">
              <div className="bg-[#0b3026] px-8 py-6">
                <h3 className="text-white text-2xl font-bold tracking-tight">Edit User</h3>
              </div>
              <form onSubmit={handleUpdateUser} className="p-8 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#4a5568] mb-1.5">Full Name</label>
                  <input required name="name" value={editFormData.name} onChange={handleEditInputChange} type="text" className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#0b3026]" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4a5568] mb-1.5">Email Address</label>
                  <input required name="email" value={editFormData.email} onChange={handleEditInputChange} type="email" className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#0b3026]" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4a5568] mb-1.5">Phone Number</label>
                  <input required name="phoneNumber" value={editFormData.phoneNumber} onChange={handleEditInputChange} type="text" className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#0b3026]" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#4a5568] mb-1.5">Role</label>
                    <select name="role" value={editFormData.role} onChange={handleEditInputChange} className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#0b3026] bg-white">
                      <option value="Admin">Admin</option>
                      <option value="Custodian">Custodian</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#4a5568] mb-1.5">Status</label>
                    <select name="status" value={editFormData.status} onChange={handleEditInputChange} className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#0b3026] bg-white">
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                  <button type="button" onClick={() => setIsEditOpen(false)} className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-bold text-[#1a1a1a] hover:bg-gray-50 cursor-pointer">Cancel</button>
                  <button type="submit" className="px-5 py-2.5 bg-[#0b3026] text-white rounded-lg text-sm font-bold hover:bg-[#08241d] cursor-pointer">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- CONFIRM DELETE POPUP --- */}
        {deleteConfirm.isOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-[20px] w-full max-w-[420px] overflow-hidden shadow-2xl">
              <div className="bg-[#0b3026] px-7 py-5">
                <h3 className="text-white text-xl font-bold tracking-tight">Confirm Deletion</h3>
              </div>
              <div className="p-7">
                <p className="text-[#4a5568] text-base mb-8">
                  Are you sure you want to delete the profile for <span className="font-bold text-[#1a1a1a]">{deleteConfirm.name}</span>?
                </p>
                <div className="flex justify-center gap-3">
                  <button 
                    onClick={() => setDeleteConfirm({ isOpen: false, id: "", name: "" })} 
                    className="w-full py-2.5 border border-gray-300 rounded-lg text-sm font-bold text-[#1a1a1a] hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={confirmDelete} 
                    className="w-full py-2.5 bg-[#0b3026] text-white rounded-lg text-sm font-bold hover:bg-[#08241d] cursor-pointer"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ManageAccountsMain;