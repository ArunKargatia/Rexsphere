import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, Compass, TrendingUp, Grid, ChevronDown } from "lucide-react";
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
    setIsDropdownOpen(false);
  };

  const NavLinks = [
    {
      name: "Explore",
      path: "/explore",
      icon: Compass
    },
    {
      name: "Trending",
      path: "/trending",
      icon: TrendingUp
    },
    {
      name: "Categories",
      path: "/categories",
      icon: Grid
    }
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-[var(--color-card)] border-b border-gray-700/20 
      backdrop-blur-md bg-opacity-80 z-50 shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo with Subtle Animation */}
          <Link
            to="/"
            className="text-2xl font-bold text-[var(--color-primary)] 
              transform transition-transform duration-300 hover:scale-105"
          >
            Rexsphere
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-6 items-center">
            {NavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="group flex items-center space-x-2 text-white 
                  hover:text-[var(--color-primary)] transition-colors duration-300"
              >
                <link.icon
                  className="w-5 h-5 text-gray-400 group-hover:text-[var(--color-primary)] 
                    transition-colors duration-300"
                />
                <span>{link.name}</span>
              </Link>
            ))}
          </div>

          {/* Auth & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {token ? (
              <div
                className="relative"
                ref={dropdownRef}
              >
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 text-white 
                    font-medium hover:text-[var(--color-primary)] 
                    transition-colors duration-300 group"
                >
                  <User
                    className="w-5 h-5 text-gray-400 group-hover:text-[var(--color-primary)] 
                      transition-colors duration-300"
                  />
                  <span>Profile</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 
                      ${isDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-[var(--color-card)] 
                      border border-gray-700/40 rounded-xl shadow-2xl 
                      overflow-hidden animate-dropdown"
                  >
                    <Link
                      to="/profile"
                      className="flex items-center space-x-3 px-4 py-3 
                        text-white hover:bg-[var(--color-primary)]/10 
                        transition-colors group"
                    >
                      <User
                        className="w-5 h-5 text-gray-400 
                          group-hover:text-[var(--color-primary)] 
                          transition-colors"
                      />
                      <span>My Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 
                        text-left px-4 py-3 text-white 
                        hover:bg-[var(--color-primary)]/10 
                        transition-colors group"
                    >
                      <LogOut
                        className="w-5 h-5 text-gray-400 
                          group-hover:text-[var(--color-primary)] 
                          transition-colors"
                      />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/signin"
                className="px-6 py-2.5 bg-[var(--color-primary)] text-white 
                  rounded-full font-medium shadow-lg hover:shadow-xl 
                  transform hover:-translate-y-1 transition-all duration-300"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-white focus:outline-none 
                transform transition-transform hover:rotate-90"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 bg-[var(--color-background)] 
              z-50 animate-slide-in"
          >
            <div className="flex flex-col space-y-6 py-12 px-6">
              {NavLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex items-center space-x-4 text-xl 
                    text-white hover:text-[var(--color-primary)] 
                    transition-colors group"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <link.icon
                    className="w-6 h-6 text-gray-400 
                      group-hover:text-[var(--color-primary)] 
                      transition-colors"
                  />
                  <span>{link.name}</span>
                </Link>
              ))}
            </div>
            <button
              className="absolute top-6 right-6 text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={32} />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;