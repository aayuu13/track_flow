import React, { useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../App';
import { SidebarContext } from '../context/SidebarContext';

export default function Sidebar() {
  const { user } = useContext(AuthContext);
  const { isOpen, setIsOpen } = useContext(SidebarContext);
  const location = useLocation();

  // Close sidebar on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location, setIsOpen]);

  if (!user) return null;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/inventory', label: 'Inventory', icon: '📦' },
    { path: '/transactions', label: 'Transactions', icon: '💳' },
    { path: '/reports', label: 'Reports', icon: '📈' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <>
      {/* Desktop Sidebar - Tablet and above */}
      <aside className="hidden md:block bg-slate-950 border-r border-slate-800 w-64 min-h-screen p-6 fixed left-0 top-24 bottom-0 overflow-y-auto z-40">
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-4 py-3 rounded-md font-semibold transition-all text-base flex items-center gap-3 ${
                location.pathname === item.path
                  ? 'bg-teal-600/90 text-white shadow-md'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-teal-400'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile Sidebar - Phone Only */}
      <aside
        className={`fixed left-0 top-20 w-56 max-w-[75vw] h-screen bg-slate-950 border-r border-slate-700/50 p-3 overflow-y-auto transform transition-transform duration-300 ease-in-out z-40 md:hidden shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2.5 group text-sm ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-teal-400 active:bg-slate-700'
                }`}
              >
                <span className={`text-base transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>{item.icon}</span>
                <span className="font-semibold">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Overlay Backdrop - Phone Only */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}
