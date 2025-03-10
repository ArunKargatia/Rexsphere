import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react"; // Icons for mobile menu
import { useAuth } from "../AuthContext";

const Navbar = () => {
  const { token, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-[var(--color-card)] border-b border-gray-700/30 shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-[var(--color-primary)]">
            Rexsphere
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-6">
            <Link to="/explore" className="nav-link text-white hover:text-[var(--color-primary)]">Explore</Link>
            <Link to="/trending" className="nav-link text-white hover:text-[var(--color-primary)]">Trending</Link>
            <Link to="/categories" className="nav-link text-white hover:text-[var(--color-primary)]">Categories</Link>
          </div>

          {/* Auth & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {token ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="text-white font-medium hover:text-[var(--color-primary)]"
                >
                  Profile ▾
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-[var(--color-card)] border border-gray-700/40 rounded-lg shadow-lg">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-white hover:bg-[var(--color-primary)] hover:text-white transition"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-white hover:bg-[var(--color-primary)] hover:text-white transition"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/signin" className="px-5 py-2 bg-[var(--color-primary)] text-white rounded-lg font-medium shadow-md hover:opacity-90 transition">
                Sign In
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden text-white focus:outline-none" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[var(--color-card)] border-t border-gray-700/30 shadow-md">
            <div className="flex flex-col space-y-4 py-4 px-4">
              <Link to="/explore" className="mobile-nav-link text-white hover:text-[var(--color-primary)]" onClick={() => setIsMobileMenuOpen(false)}>Explore</Link>
              <Link to="/trending" className="mobile-nav-link text-white hover:text-[var(--color-primary)]" onClick={() => setIsMobileMenuOpen(false)}>Trending</Link>
              <Link to="/categories" className="mobile-nav-link text-white hover:text-[var(--color-primary)]" onClick={() => setIsMobileMenuOpen(false)}>Categories</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
