import React from "react";
import { UserNav } from "./UserNav";

interface NavbarProps {
  title?: string | React.ReactNode;
}

export const Navbar: React.FC<NavbarProps> = ({ title = "Nexus" }) => {
  return (
    <div className="h-16 border-b-2 bg-white border-gray-100 lg:py-4 lg:px-56 px-8 py-4 flex justify-between items-center sticky top-0 left-0">
      <div className="font-semibold">{title}</div>
      <UserNav />
    </div>
  );
};
