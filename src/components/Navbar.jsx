import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { SidebarContext } from '../context/SidebarContext';
import { logout } from '../firebase/auth';

export default function Navbar() {
  const { user } = useContext(AuthContext);
  const { isOpen, setIsOpen } = useContext(SidebarContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200/60 bg-white/70 backdrop-blur-md">

      <div className="flex items-center justify-between px-6 py-3 md:px-8">

        {/* LEFT: Hamburger + Brand */}
        <div className="flex items-center gap-4">

          {user && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden flex flex-col justify-center gap-1 w-10 h-10 rounded-xl hover:bg-slate-100 transition"
            >
              <span className={`h-0.5 w-5 bg-slate-800 transition ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <span className={`h-0.5 w-5 bg-slate-800 transition ${isOpen ? 'opacity-0' : ''}`} />
              <span className={`h-0.5 w-5 bg-slate-800 transition ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </button>
          )}

          <Link
            to={user ? '/dashboard' : '/login'}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-sm">
              T
            </div>

            <div className="hidden sm:flex flex-col">
              <span className="text-lg font-semibold text-slate-900 leading-none">
                TrackFlow
              </span>
              <span className="text-xs text-slate-500">
                Business Intelligence
              </span>
            </div>
          </Link>

        </div>

        {/* CENTER (optional search placeholder later) */}
        <div className="hidden md:flex flex-1 justify-center">
          <div className="w-[420px] h-9 bg-slate-100 rounded-xl flex items-center px-3 text-sm text-slate-400">
            Search (coming soon)
          </div>
        </div>

        {/* RIGHT: User + Actions */}
        {user && (
          <div className="flex items-center gap-4">

            {/* Email */}
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs text-slate-500">Signed in as</span>
              <span className="text-sm font-medium text-slate-800 truncate max-w-[160px]">
                {user.email}
              </span>
            </div>

            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-semibold">
              {user.email?.charAt(0).toUpperCase()}
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition"
            >
              Logout
            </button>

          </div>
        )}

      </div>

      {/* Mobile overlay */}
      {isOpen && user && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/20 md:hidden"
        />
      )}

    </nav>
  );
}