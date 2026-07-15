// ManageAccountsModule/types.ts
export interface UserAccount {
  id: string;
  initials: string;
  name: string;
  email: string;
  role: string;
  status: string;
  dateAdded: string;
  phoneNumber: string;
}

export interface NewUserForm {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: "Admin" | "Custodian";
  password: string;
}