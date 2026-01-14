import React from "react";

const Header = () => {
  return (
    <header className="w-full border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
            LD
          </div>
          <span className="text-xl font-semibold text-gray-800">
            Your Finder Application
          </span>
        </div>

        {/* Search */}
        <div className="hidden md:flex w-1/3">
          <input
            type="text"
            placeholder="Search businesses, places..."
            className="w-full rounded-lg border px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="#" className="text-sm font-medium text-gray-600 hover:text-blue-600">
            Explore
          </a>
          <a href="#" className="text-sm font-medium text-gray-600 hover:text-blue-600">
            Categories
          </a>
          <a href="#" className="text-sm font-medium text-gray-600 hover:text-blue-600">
            About
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="hidden md:block rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-100">
            Login
          </button>
          <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            Add Business
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
