"use client";

import AppLogo from "@/assets/app-logo";
import { Bell, User } from "lucide-react";
import Image from "next/image";

interface NavBarProps {
  isAuthenticated?: boolean;
  user?: {
    name: string;
    role: string;
    avatarUrl?: string;
  };
}

export function NavBar({
  isAuthenticated = true,
  user = {
    name: "Mark Steven",
    role: "Linguistic Reviewer",
    // Removed broken default avatarUrl
  },
}: NavBarProps) {
  return (
    <nav className="flex h-[56px] w-full items-center justify-between border-b border-[#081F400F] bg-white px-5 py-3">
      {/* Left side: Logo */}
      <div className="flex items-center">
        <AppLogo className="h-[19px] w-[74px]" />
      </div>

      {/* Right side: Actions & Profile */}
      {isAuthenticated && (
        <div className="flex items-center gap-5">
          {/* Bell Icon */}
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-[#081F400D] transition-colors hover:bg-[#081F401A]">
            <Bell className="h-3.5 w-3.5 text-[#081F40]" />
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-2">
            <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-[#081F400D]">
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <User className="h-4 w-4 text-[#081F40B2]" />
              )}
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[13px] font-semibold text-[#081F40]">
                {user.name}
              </span>
              <span className="text-[12px] font-normal text-[#081F40B2]">
                {user.role}
              </span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
