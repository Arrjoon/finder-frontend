import React from "react";
import { Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="w-full border-b bg-white/95 backdrop-blur-sm z-50 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold text-xl shadow-lg">
              F
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              LocalFinder
            </span>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <a href="#" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
              Explore
            </a>
            <a href="#" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
              Categories
            </a>
            <a href="#" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
              For Business
            </a>
            <a href="#" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
              About
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <Button variant="ghost" className="hidden md:block text-gray-700 hover:text-blue-600">
              Log In
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md">
              Sign Up
            </Button>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
