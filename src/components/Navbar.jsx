import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { SidebarContext } from '../context/SidebarContext';
import { logout } from '../firebase/auth';

export default function Navbar() {
  const { user } = useContext(AuthContext);
  const { isOpen, setIsOpen } = useContext(SidebarContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-slate-900 border-b border-teal-600/30 shadow-xl fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex justify-between items-center max-w-full px-3 sm:px-4 md:px-6 lg:px-8 py-2.5 sm:py-3 md:py-4">
        {/* Hamburger Menu - Mobile Phone Only */}
        {user && (
          <button
            onClick={toggleSidebar}
            className="md:hidden flex flex-col gap-1 mr-2 sm:mr-3 p-1.5 sm:p-2 hover:bg-slate-800 rounded-lg transition-colors duration-200 active:bg-slate-700"
            aria-label="Toggle navigation menu"
            title={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            <span className={`w-6 h-0.5 bg-white transition-all duration-300 origin-center ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'opacity-0 scale-0' : 'opacity-100'}`}></span>
            <span className={`w-6 h-0.5 bg-white transition-all duration-300 origin-center ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        )}

        {/* Branding */}
        <Link to={user ? '/dashboard' : '/login'} className="flex items-center gap-2 sm:gap-3 md:gap-4 group flex-1 md:flex-none">
          <img src="/logo.jpg" alt="FINORA Logo" className="w-9 sm:w-10 md:w-12 h-9 sm:h-10 md:h-12 rounded-lg shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all object-cover" />
          <div className="flex flex-col hidden sm:flex">
            <span className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight">FINORA</span>
            <span className="text-xs text-teal-400 font-semibold uppercase tracking-wider leading-none">Accounting</span>
          </div>
        </Link>

        {/* User Info & Logout - Right Side */}
        {user && (
          <div className="flex items-center gap-2 sm:gap-3 md:gap-6 ml-auto">
            <div className="text-right border-r border-slate-700 pr-2 sm:pr-3 md:pr-6 hidden sm:block">
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-0.5">Account</p>
              <p className="font-medium text-slate-200 truncate max-w-xs text-xs sm:text-sm">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white px-2.5 sm:px-3 md:px-6 py-1.5 sm:py-2 md:py-2.5 rounded-lg font-semibold transition-colors duration-200 text-xs sm:text-sm shadow-md hover:shadow-lg"
              title="Sign out of your account"
            >
              <span className="hidden sm:inline">Logout</span>
              <span className="inline sm:hidden">Exit</span>
            </button>
          </div>
        )}
      </div>

      {/* Mobile Menu Overlay - Phone Only */}
      {isOpen && user && (
        <div
          className="fixed inset-0 bg-black/30 md:hidden z-30 transition-opacity duration-200"
          onClick={toggleSidebar}
          onKeyDown={(e) => e.key === 'Escape' && toggleSidebar()}
          role="button"
          tabIndex={0}
          aria-label="Close navigation menu"
        ></div>
      )}
    </nav>
  );
}
