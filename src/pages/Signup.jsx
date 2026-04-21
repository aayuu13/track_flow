import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../firebase/auth';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signup(email, password, businessName);
      await new Promise((r) => setTimeout(r, 400));
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 px-4">

      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 shadow-xl rounded-3xl p-10">

          {/* Header */}
          <div className="text-center mb-10">
            <img
              src="/logo.jpg"
              alt="FINORA"
              className="w-16 h-16 mx-auto rounded-2xl shadow-md object-cover mb-5"
            />

            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              Create account
            </h1>

            <p className="text-slate-500 text-sm mt-2">
              Start managing your business smarter
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-3 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="text-xs font-medium text-slate-600">
                Business name
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Your company name"
                className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>

          </form>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-teal-600 font-medium hover:text-teal-700"
            >
              Sign in
            </Link>
          </div>

        </div>

        {/* small footer */}
        <p className="text-center text-xs text-slate-400 mt-6">
          © {new Date().getFullYear()} FINORA • Built for modern accounting
        </p>

      </div>
    </div>
  );
}