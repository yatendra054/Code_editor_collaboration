import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Code, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { NAV_LINKS } from '../../utils/constants';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const dropdownRef = useRef(null);
  
  // Helper to get display name
  const getDisplayName = () => user?.name || user?.username || 'User';
  const getInitials = () => {
    const name = getDisplayName();
    return name.split(' ')[0].charAt(0).toUpperCase();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const isActive = (path) => location.pathname === path;

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-gray-900/95 backdrop-blur-md border-b border-gray-800/50 sticky top-0 z-50 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-3 text-xl font-bold text-white hover:text-blue-400 transition-colors duration-200">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Code size={20} className="text-white" />
            </div>
            <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              CodeSync
            </span>
          </Link>
          
          <nav className="hidden md:flex gap-8">
            {NAV_LINKS.map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                className={`text-sm font-medium transition-all duration-200 hover:scale-105 ${
                  isActive(link.path) 
                    ? 'text-white border-b-2 border-blue-500 pb-1' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-3 bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 hover:border-gray-600 px-3 py-2 rounded-lg transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm overflow-hidden">
                    {user?.profilePhoto?.url ? (
                      <img src={user.profilePhoto.url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      getInitials()
                    )}
                  </div>
                  <span className="text-gray-200 text-sm font-medium">{getDisplayName()}</span>
                  <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isProfileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-xl shadow-xl overflow-hidden py-1 z-50"
                    >
                      <div className="px-4 py-3 border-b border-gray-700/50">
                        <p className="text-sm text-white font-medium truncate">{getDisplayName()}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                      
                      <Link to="/userProfile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors">
                        <User size={16} />
                        My Profile
                      </Link>
                      <Link to="/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors">
                        <Settings size={16} />
                        Settings
                      </Link>
                      
                      <div className="border-t border-gray-700/50 mt-1 pt-1">
                        <button 
                          onClick={logout}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-left"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-gray-400 hover:text-white px-4 py-2 rounded-lg transition-all duration-200 hover:bg-gray-800/50 font-medium text-sm">
                  Login
                </Link>
                <Link to="/signup" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95 font-medium text-sm">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <button 
            className="md:hidden text-white p-2 rounded-lg hover:bg-gray-800/50 transition-all duration-200" 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <motion.div
              animate={{ rotate: isMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.div>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-gray-800/50 bg-gray-800/95 backdrop-blur-md overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4">
                {NAV_LINKS.map((link) => (
                  <Link 
                    key={link.path}
                    to={link.path} 
                    className={`block py-2 font-medium transition-colors duration-200 ${
                      isActive(link.path) ? 'text-blue-400' : 'text-gray-400 hover:text-white'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                
                <div className="pt-4 border-t border-gray-700/50">
                  {user ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden">
                          {user?.profilePhoto?.url ? (
                            <img src={user.profilePhoto.url} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            getInitials()
                          )}
                        </div>
                        <div>
                          <p className="text-white font-medium">{getDisplayName()}</p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>
                      
                      <Link to="/userProfile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-gray-300 hover:text-white py-2">
                        <User size={18} /> Profile
                      </Link>
                      <button 
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 text-red-400 hover:text-red-300 py-2"
                      >
                        <LogOut size={18} /> Logout
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block text-gray-400 hover:text-white transition-colors duration-200 py-2 font-medium">
                        Login
                      </Link>
                      <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="block bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-center font-medium transition-colors duration-200">
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Navbar;