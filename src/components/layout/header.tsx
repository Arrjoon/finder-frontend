"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Sparkles, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthUserStore } from "@/stores";
import {
  authUserDashboardHref,
  authUserDisplayName,
  authUserInitials,
} from "@/lib/auth-user-display";
import { logout as logoutApi } from "@/api-services/user/user-services";

const Header = () => {
  const router = useRouter();
  const user = useAuthUserStore((s) => s.user);
  const clearUser = useAuthUserStore((s) => s.clearUser);
  const displayName = authUserDisplayName(user);
  const initials = authUserInitials(user);

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch {
      /* cookies may already be invalid */
    }
    clearUser();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="w-full border-b border-gray-200 bg-gradient-to-r from-blue-50 via-white to-green-50 backdrop-blur-md z-50 shadow-md">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-green-600 text-white font-bold text-xl shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-green-600 bg-clip-text text-transparent leading-tight">
                LocalFinder
              </span>
              <span className="text-xs text-gray-500 font-medium">Discover Local</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            <a
              href="#"
              className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all"
            >
              Explore
            </a>
            <a
              href="#"
              className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all"
            >
              Categories
            </a>
            <a
              href="#"
              className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:text-green-600 hover:bg-green-50 transition-all"
            >
              For Business
            </a>
            <a
              href="#"
              className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all"
            >
              About
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {user ? (
              <>
                <div className="hidden sm:flex items-center gap-2 max-w-[200px]">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {displayName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild className="hidden md:inline-flex">
                  <Link href={authUserDashboardHref(user.role)}>
                    <LayoutDashboard className="h-4 w-4 mr-1" />
                    Dashboard
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => void handleLogout()}
                  className="text-gray-700"
                >
                  <LogOut className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">Log out</span>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild className="hidden md:flex text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium">
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all font-semibold px-4 sm:px-6">
                  <Link href="/register">Sign up</Link>
                </Button>
              </>
            )}
            <Button variant="ghost" size="icon" className="lg:hidden hover:bg-blue-50">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
