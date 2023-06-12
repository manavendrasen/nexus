import Link from "next/link";
import React from "react";
import { UserNav } from "./UserNav";

interface NavbarProps {
  title?: string | React.ReactNode;
  href?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  title = "Nexus",
  href = "/",
}) => {
  return (
    <div className="h-20 z-50 bg-background text-foreground lg:py-4 lg:px-56 px-8 py-4 flex justify-between items-center sticky top-0 left-0 border-b-1 border-accent">
      <Link href={href}>
        <div className="font-semibold cursor-pointer">{title}</div>
      </Link>
      <UserNav />
    </div>
  );
};
