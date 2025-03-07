import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";

const Navbar = () => {
  const { token, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-[var(--color-card)] border-b border-gray-700/30 shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-[var(--color-primary)]">
            Rexsphere
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-6">
            <Link to="/explore" className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition">Explore</Link>
            <Link to="/trending" className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition">Trending</Link>
            <Link to="/categories" className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition">Categories</Link>
          </div>

          {/* Auth Section */}
          <div>
            {token ? (
              <div 
                className="relative"
                ref={dropdownRef}
              >
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="text-[var(--color-text-primary)] focus:outline-none"
                >
                  Profile ▾
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-[var(--color-card)] border border-gray-700/40 rounded-lg shadow-lg">
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-[var(--color-text-primary)] hover:bg-gray-800/40"
                    >
                      Profile
                    </Link>
                    <button 
                      onClick={logout} 
                      className="w-full text-left px-4 py-2 text-[var(--color-text-primary)] hover:bg-gray-800/40"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/signin" className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
