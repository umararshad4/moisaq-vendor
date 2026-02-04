"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import AppLogo from "@/assets/app-logo";
import { User, LogOut } from "lucide-react";
import Image from "next/image";
import {
  getUserInfoCookie,
  getAuthCookie,
  clearAuthCookies,
} from "@/lib/cookie";
import type { LoginUserInfo } from "@/types";

interface NavBarProps {
  isAuthenticated?: boolean;
  user?: {
    name: string;
    role: string;
    avatarUrl?: string;
  };
}

export function NavBar({
  isAuthenticated: propIsAuthenticated,
  user: propUser,
}: NavBarProps) {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<LoginUserInfo | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(
    propIsAuthenticated ?? false
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If props are provided, use them (e.g., sign-in page explicitly sets isAuthenticated=false)
    if (propIsAuthenticated !== undefined || propUser) {
      return;
    }

    // Otherwise, check cookies for authentication status
    const accessToken = getAuthCookie();
    const authenticated = !!accessToken;
    setIsAuthenticated(authenticated);

    // Get user info from cookie if authenticated
    if (authenticated) {
      const user = getUserInfoCookie();
      setUserInfo(user);
    }
  }, [propIsAuthenticated, propUser]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = () => {
    clearAuthCookies();
    setIsDropdownOpen(false);
    router.push("/sign-in");
  };

  // Use prop values if provided, otherwise use cookie values
  const finalIsAuthenticated =
    propIsAuthenticated !== undefined ? propIsAuthenticated : isAuthenticated;

  const finalUser =
    propUser ||
    (userInfo
      ? {
          name: userInfo.display_name,
          role: userInfo.role,
        }
      : null);

  return (
    <nav className="flex h-[56px] w-full items-center justify-between border-b border-[#081F400F] bg-white px-5 py-3">
      {/* Left side: Logo */}
      <div className="flex items-center">
        <AppLogo className="h-[19px] w-[74px]" />
      </div>

      {/* Right side: Actions & Profile */}
      {finalIsAuthenticated && finalUser && finalUser.name && (
        <div className="flex items-center gap-5">
          {/* User Profile with Dropdown */}
          <div className="relative flex items-center gap-2" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-[#081F400D] transition-colors hover:bg-[#081F401A]"
            >
              {finalUser.avatarUrl ? (
                <Image
                  src={finalUser.avatarUrl}
                  alt={finalUser.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <User className="h-4 w-4 text-[#081F40B2]" />
              )}
            </button>
            <div className="flex flex-col leading-tight">
              <span className="text-[13px] font-semibold text-[#081F40]">
                {finalUser.name}
              </span>
              <span className="text-[12px] font-normal text-[#081F40B2]">
                {finalUser.role}
              </span>
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border border-[#081F400F] bg-white shadow-lg">
                <div className="p-1">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-[#081F40] transition-colors hover:bg-[#081F4008]"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
