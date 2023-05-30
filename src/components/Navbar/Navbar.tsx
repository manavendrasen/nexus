import React from "react";
import { UserNav } from "./UserNav";

export function Navbar() {
  return (
    <div className="h-18 border-b-2 border-gray-50 py-4 px-12 flex justify-between items-center">
      <p className="text-xl font-medium">Nexus AI</p>
      <UserNav />
    </div>
  );
}
