export interface UserAccount {
  id: string;
  initials: string;
  name: string;
  email: string;
  role: "Admin" | "Custodian";
  status: "Active" | "Inactive";
  dateAdded: string;
  phoneNumber: string;
}

export interface NewUserForm {
  firstName: string;
  lastName: string;
  password: string; 
  email: string;    
  role: string;     
  phoneNumber: string;
}