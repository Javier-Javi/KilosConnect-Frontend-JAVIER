// ManageAccountsModule/AccountsIcons.tsx
import React from "react";
import { Eye, EyeOff } from 'lucide-react'; 

interface IconsProps {
  name: "eye" | "eye-off";
  size?: number;
}

const AccountsIcons: React.FC<IconsProps> = ({ name, size = 18 }) => {
  if (name === "eye") {
    return <Eye size={size} />;
  }
  if (name === "eye-off") {
    return <EyeOff size={size} />;
  }
  return null;
};

export default AccountsIcons;