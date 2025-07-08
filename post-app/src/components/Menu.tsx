import React from "react";
import { List } from "lucide-react";

import { Link } from "react-router";

const Menu = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="bg-[#111] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 text-xl font-semibold">
            Music<span className="text-primary">Site</span>
          </div>

          <div className="sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none cursor-pointer"
            >
              <List size={24} />
            </button>
          </div>

          <div className="hidden sm:flex sm:space-x-6 ">
            <Link to="/">Home</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden px-4 pb-3 space-y-2  *:block ">
          <Link to="/">Home</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      )}
    </nav>
  );
};

export default Menu;
