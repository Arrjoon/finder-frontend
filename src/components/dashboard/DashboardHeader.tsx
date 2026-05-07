"use client";

import React from "react";
import Link from "next/link";
import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthUserStore } from "@/stores";
import {
  authUserDashboardHref,
  authUserDisplayName,
  authUserInitials,
} from "@/lib/auth-user-display";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

const DashboardHeader = ({ title, subtitle }: DashboardHeaderProps) => {
  const user = useAuthUserStore((s) => s.user);
  const displayName = authUserDisplayName(user);
  const initials = authUserInitials(user);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle ? (
              <p className="text-sm text-gray-600 mt-1 truncate">{subtitle}</p>
            ) : null}
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="hidden md:flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search..."
                  className="pl-9 w-64 h-9 border-gray-300 focus:border-blue-500"
                />
              </div>
            </div>

            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-green-600 rounded-full" />
            </Button>

            <Link
              href={user ? authUserDashboardHref(user.role) : "/dashboard/user"}
              className="flex items-center gap-3 rounded-lg hover:bg-gray-50 p-1 -m-1 transition-colors"
            >
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-white text-xs font-semibold">
                {user ? initials : <User className="h-4 w-4" />}
              </div>
              <div className="hidden md:block text-left min-w-0 max-w-[160px]">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user ? displayName : "Guest"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email ?? "Not signed in"}
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
