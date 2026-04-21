import React, { useEffect, useState, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { SidebarProvider } from './context/SidebarContext';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

export const AuthContext = createContext();

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      <Router>
        <SidebarProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <div className="flex h-screen">
                    <Sidebar />
                    <div className="flex-1 flex flex-col overflow-hidden">
                      <Navbar />
                      <div className="flex-1 overflow-auto">
                        <Dashboard />
                      </div>
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/inventory"
              element={
                <ProtectedRoute>
                  <div className="flex h-screen">
                    <Sidebar />
                    <div className="flex-1 flex flex-col overflow-hidden">
                      <Navbar />
                      <div className="flex-1 overflow-auto">
                        <Inventory />
                      </div>
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/transactions"
              element={
                <ProtectedRoute>
                  <div className="flex h-screen">
                    <Sidebar />
                    <div className="flex-1 flex flex-col overflow-hidden">
                      <Navbar />
                      <div className="flex-1 overflow-auto">
                        <Transactions />
                      </div>
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <div className="flex h-screen">
                    <Sidebar />
                    <div className="flex-1 flex flex-col overflow-hidden">
                      <Navbar />
                      <div className="flex-1 overflow-auto">
                        <Reports />
                      </div>
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <div className="flex h-screen">
                    <Sidebar />
                    <div className="flex-1 flex flex-col overflow-hidden">
                      <Navbar />
                      <div className="flex-1 overflow-auto">
                        <Settings />
                      </div>
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />

            {/* Root redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </SidebarProvider>
      </Router>
    </AuthContext.Provider>
  );
}
