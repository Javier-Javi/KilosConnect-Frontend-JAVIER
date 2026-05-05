import React, { useState } from "react";
import { useAuth } from '../../Hooks/useAuth';
import { SidebarNavigationSection } from '../../components/SidebarNavigationSection';

// Modular Imports
import type { UserAccount, NewUserForm } from "./types";
import AccountsStatsSection from "./AccountsStatsSection";
import AccountsFilterSection from "./AccountsFilterSection";
import AccountsListSection from "./AccountsListSection";
import AccountsIcons from "./AccountsIcons";

const ManageAccountsMain: React.FC = () => {
  const [search, setSearch] = useState("");
  const [accounts, setAccounts] = useState<UserAccount[]>([
    { id: "USER-1032CD8C", initials: "MG", name: "Maria Garcia", email: "maria.garcia@kilosph.com", role: "Custodian", status: "Active", dateAdded: "2/20/2024", phoneNumber: "+63 956 745 2678" },
    { id: "USER-1029ZS8C", initials: "DC", name: "David Chen", email: "david.chen@kilosph.com", role: "Custodian", status: "Active", dateAdded: "3/10/2024", phoneNumber: "+63 998 574 9281" },
    { id: "USER-1029ZS8D", initials: "C", name: "David Tan", email: "david.Tan@kilosph.com", role: "Admin", status: "Inactive", dateAdded: "4/6/2024", phoneNumber: "+63 998 574 2678" }
  ]);

  // --- MODAL & FORM STATES ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: string; name: string }>({ 
    isOpen: false, id: "", name: "" 
  });
  const [showPassword, setShowPassword] = useState(false); 
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);
  
  const [newUserForm, setNewUserForm] = useState<NewUserForm>({
    firstName: "", lastName: "", password: "", email: "", role: "Custodian", phoneNumber: "",
  });

  // --- HELPER FUNCTIONS ---
  const formatPHPhoneNumber = (value: string): string => {
    const digits = value.replace(/\D/g, "");
    const cleanNumbers = digits.startsWith("63") ? digits.slice(2) : digits;
    
    let formatted = "+63";
    if (cleanNumbers.length > 0) formatted += " " + cleanNumbers.substring(0, 3);
    if (cleanNumbers.length > 3) formatted += " " + cleanNumbers.substring(3, 6);
    if (cleanNumbers.length > 6) formatted += " " + cleanNumbers.substring(6, 10);
    
    return formatted.trim();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "phoneNumber") {
      setNewUserForm((prev) => ({ ...prev, [name]: formatPHPhoneNumber(value) }));
    } else {
      setNewUserForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAddModalOpen) return;

    // Email validation check before saving
    if (newUserForm.email && !newUserForm.email.includes("@")) {
      alert("Please enter a valid email address containing '@'");
      return;
    }

    if (!newUserForm.firstName || !newUserForm.lastName) return;

    const fullName = `${newUserForm.firstName} ${newUserForm.lastName}`;
    const initials = (newUserForm.firstName[0] + (newUserForm.lastName[0] || "")).toUpperCase();

    if (editingAccountId) {
      setAccounts(accounts.map(acc => 
        acc.id === editingAccountId 
          ? { ...acc, name: fullName, initials, email: newUserForm.email, role: newUserForm.role as any, phoneNumber: newUserForm.phoneNumber }
          : acc
      ));
    } else {
      const newAccount: UserAccount = {
        id: `USER-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        initials,
        name: fullName,
        email: newUserForm.email,
        role: newUserForm.role as any,
        status: "Active",
        dateAdded: new Date().toLocaleDateString(),
        phoneNumber: newUserForm.phoneNumber
      };
      setAccounts([newAccount, ...accounts]);
    }
    closeAddModal();
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setShowPassword(false);
    setEditingAccountId(null);
    setNewUserForm({ firstName: "", lastName: "", password: "", email: "", role: "Custodian", phoneNumber: "" });
  };

  const openEditModal = (account: UserAccount) => {
    const nameParts = account.name.split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ");

    setEditingAccountId(account.id); 
    setNewUserForm({
      firstName,
      lastName,
      password: "password123", 
      email: account.email,
      role: account.role,
      phoneNumber: account.phoneNumber,
    });
    setIsAddModalOpen(true);
  };

  const openDeleteConfirm = (id: string, name: string) => {
    setDeleteConfirm({ isOpen: true, id, name });
  };

  const confirmDelete = () => {
    setAccounts(accounts.filter(acc => acc.id !== deleteConfirm.id));
    setDeleteConfirm({ isOpen: false, id: "", name: "" });
  };

  const { role } = useAuth();
  const userRole = (role ?? 'custodian') as React.ComponentProps<typeof SidebarNavigationSection>["userRole"];

  const filteredAccounts = accounts.filter(a => {
    const query = search.toLowerCase();
    return (
      a.name.toLowerCase().includes(query) || 
      a.id.toLowerCase().includes(query) ||
      a.email.toLowerCase().includes(query) ||
      a.role.toLowerCase().includes(query) ||
      a.phoneNumber.includes(query)
    );
  });

  return (
    <div className="flex h-screen bg-[#f4f5f6] overflow-hidden font-sans text-[#1a1a1a]">
      <SidebarNavigationSection userRole={userRole}/>

      <div className="flex flex-col flex-1 min-w-0 ml-60 overflow-y-auto">
        <AccountsStatsSection />

        <main className="p-6">
          <div className="bg-white rounded-2xl border border-[#e8e8e8] shadow-sm overflow-hidden">
            <AccountsFilterSection 
              totalAccounts={filteredAccounts.length}
              onSearchChange={setSearch}
              onAddNewUser={() => { setEditingAccountId(null); setIsAddModalOpen(true); }}
            />

            <AccountsListSection 
              accounts={filteredAccounts}
              onEditClick={openEditModal}
              onDeleteClick={openDeleteConfirm}
            />
          </div>
        </main>

        {/* --- ADD/EDIT MODAL --- */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-[20px] w-full max-w-[420px] overflow-hidden shadow-2xl">
              <div className="bg-[#0b3026] px-7 py-5">
                <h3 className="text-white text-xl font-bold">{editingAccountId ? "Edit User" : "Add User"}</h3>
              </div>
              <form className="p-7 space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-1.5">
                  <label className="text-[14px] font-semibold text-gray-700">First Name: <span className="text-red-500">*</span></label>
                  <input required name="firstName" value={newUserForm.firstName} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[14px] font-semibold text-gray-700">Last Name: <span className="text-red-500">*</span></label>
                  <input required name="lastName" value={newUserForm.lastName} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[14px] font-semibold text-gray-700">Password: <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input 
                      required
                      name="password"
                      type={showPassword ? "text" : "password"} 
                      value={newUserForm.password}
                      onChange={handleInputChange}
                      className="w-full bg-[#eff4ff] border-none rounded-lg p-2.5 text-sm pr-10 focus:outline-none" 
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-gray-400">
                      <AccountsIcons name={showPassword ? "eye" : "eye-off"} />
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[14px] font-semibold text-gray-700">Email:</label>
                  <input 
                    name="email" 
                    type="email" 
                    value={newUserForm.email} 
                    onChange={handleInputChange} 
                    className={`w-full border rounded-lg p-2.5 text-sm ${
                      newUserForm.email && !newUserForm.email.includes("@") ? "border-red-400" : "border-gray-300"
                    }`} 
                  />
                  {newUserForm.email && !newUserForm.email.includes("@") && (
                    <p className="text-[10px] text-red-500 mt-1 animate-pulse">Email must contain an "@" symbol</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-[14px] font-semibold text-gray-700">Phone Number: <span className="text-red-500">*</span></label>
                  <input 
                    required 
                    name="phoneNumber" 
                    placeholder="+63 XXX XXX XXXX"
                    value={newUserForm.phoneNumber} 
                    onChange={handleInputChange} 
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[14px] font-semibold text-gray-700">Role: <span className="text-red-500">*</span></label>
                  <select required name="role" value={newUserForm.role} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm bg-white">
                    <option value="Custodian">Custodian</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div className="flex justify-center gap-3 pt-4">
                  <button type="button" onClick={closeAddModal} className="w-full py-2.5 border border-gray-300 rounded-lg text-sm font-bold">Cancel</button>
                  <button type="submit" className="w-full py-2.5 bg-[#0b3026] text-white rounded-lg text-sm font-bold">
                    {editingAccountId ? "Save Changes" : "Add User"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- DELETE POPUP --- */}
        {deleteConfirm.isOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-[20px] w-full max-w-[420px] overflow-hidden shadow-2xl">
              <div className="bg-[#0b3026] px-7 py-5">
                <h3 className="text-white text-xl font-bold">Confirm Deletion</h3>
              </div>
              <div className="p-7">
                <p className="text-[#4a5568] text-base mb-8">
                  Are you sure you want to delete the profile for <span className="font-bold text-[#1a1a1a]">{deleteConfirm.name}</span>?
                </p>
                <div className="flex justify-center gap-3">
                  <button 
                    onClick={() => setDeleteConfirm({ isOpen: false, id: "", name: "" })} 
                    className="w-full py-2.5 border border-gray-300 rounded-lg text-sm font-bold text-[#1a1a1a] hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={confirmDelete} 
                    className="w-full py-2.5 bg-[#0b3026] text-white rounded-lg text-sm font-bold hover:bg-[#08241d]"
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