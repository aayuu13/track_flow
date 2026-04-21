import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signin } from '../firebase/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting sign in with:', email);
      const user = await signin(email, password);
      console.log('Sign in successful:', user);
      await new Promise(resolve => setTimeout(resolve, 500));
      navigate('/dashboard');
    } catch (err) {
      console.error('Sign in error:', err);
      const errorMessage = err.message || 'Failed to sign in. Please check your credentials.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="bg-white p-12 rounded-2xl shadow-lg w-full max-w-md border border-slate-200">
        <div className="text-center mb-12">
          <img src="/logo.jpg" alt="FINORA Logo" className="w-24 h-24 mx-auto mb-6 rounded-xl shadow-md object-cover" />
          <h1 className="text-4xl font-bold text-slate-900 mb-1">FINORA</h1>
          <p className="text-slate-500 text-sm font-medium tracking-wide">ACCOUNTING MANAGEMENT SYSTEM</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-800 p-4 rounded-lg mb-8 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-slate-700 font-semibold text-sm mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white focus:border-slate-300 text-sm transition"
              placeholder="name@company.com"
              required
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold text-sm mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white focus:border-slate-300 text-sm transition"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-semibold disabled:bg-slate-400 disabled:cursor-not-allowed transition mt-8 text-sm"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-200">
          <p className="text-center text-slate-600 text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-teal-600 hover:text-teal-700 font-semibold transition">
              Create Account
            </Link>
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-200">
          <p className="text-center text-slate-500 text-xs">© 2025 FINORA. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
