import React, { useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../App';
import { SidebarContext } from '../context/SidebarContext';

export default function Sidebar() {
  const { user } = useContext(AuthContext);
  const { isOpen, setIsOpen } = useContext(SidebarContext);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  if (!user) return null;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '▣' },
    { path: '/inventory', label: 'Inventory', icon: '▦' },
    { path: '/transactions', label: 'Transactions', icon: '◉' },
    { path: '/reports', label: 'Reports', icon: '▤' },
    { path: '/settings', label: 'Settings', icon: '⚙' },
  ];

  const Item = ({ item, isActive }) => (
    <Link
      to={item.path}
      className={`relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all group
      ${isActive
        ? 'text-slate-900 bg-white shadow-sm'
        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
      }`}
    >
      {/* Active indicator bar */}
      {isActive && (
        <div className="absolute left-0 top-2 bottom-2 w-1 bg-slate-900 rounded-full" />
      )}

      <span className={`text-lg ${isActive ? 'scale-110' : 'group-hover:scale-105'} transition`}>
        {item.icon}
      </span>

      <span className="font-medium">{item.label}</span>
    </Link>
  );

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-white/70 backdrop-blur-md border-r border-slate-200 z-40">

        <div className="w-full px-5 py-6 flex flex-col">

          {/* BRAND */}
          <div className="mb-8 px-2">
            <div className="text-xl font-semibold text-slate-900">
              TrackFlow
            </div>
            <div className="text-xs text-slate-500">
              Business OS
            </div>
          </div>

          {/* NAV */}
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Item
                key={item.path}
                item={item}
                isActive={location.pathname === item.path}
              />
            ))}
          </nav>

          {/* FOOTER USER */}
          <div className="mt-auto pt-6 border-t border-slate-200">
            <div className="flex items-center gap-3 px-2">
              <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-medium">
                {user.email?.charAt(0).toUpperCase()}
              </div>

              <div className="flex flex-col">
                <span className="text-sm text-slate-800 truncate max-w-[150px]">
                  {user.email}
                </span>
                <span className="text-xs text-slate-500">
                  Active
                </span>
              </div>
            </div>
          </div>

        </div>
      </aside>

      {/* MOBILE SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-2xl transform transition-transform duration-300 md:hidden
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >

        <div className="p-5 flex flex-col h-full">

          <div className="mb-6">
            <div className="text-lg font-semibold text-slate-900">
              TrackFlow
            </div>
            <div className="text-xs text-slate-500">
              Navigation
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <Item
                key={item.path}
                item={item}
                isActive={location.pathname === item.path}
              />
            ))}
          </nav>

        </div>
      </aside>

      {/* BACKDROP */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/20 md:hidden z-40"
        />
      )}
    </>
  );
}