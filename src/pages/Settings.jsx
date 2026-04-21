import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../App';
import { getUserData, updateUserSettings } from '../firebase/db';

export default function Settings() {
  const { user, logout } = useContext(AuthContext);
  const [settings, setSettings] = useState({
    businessName: '',
    currency: 'NPR',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchSettings = async () => {
      try {
        const userData = await getUserData(user.uid);
        if (userData) {
          setSettings({
            businessName: userData.businessName || '',
            currency: userData.currency || 'NPR',
          });
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, [user]);

  const handleSettingChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateUserSettings(user.uid, settings);
      setMessage('✓ Settings updated successfully!');
      setHasChanges(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('✗ Error updating settings');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top spacing for navbar */}
      <div className="h-24"></div>

      {/* Main Container - Responsive */}
      <div className="w-full px-4 sm:px-6 md:px-8 md:ml-64 lg:px-12 py-6 sm:py-8 md:py-10 lg:py-12">
        {/* Header Section */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-1 sm:mb-2">Settings</h1>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 font-normal">Manage your account settings and preferences</p>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div className={`mb-6 sm:mb-8 px-3 sm:px-4 md:px-6 py-3 sm:py-4 rounded-lg font-medium text-xs sm:text-sm md:text-base border transition-all ${
            message.includes('✓')
              ? 'bg-green-50 border-green-300 text-green-800'
              : 'bg-red-50 border-red-300 text-red-800'
          }`}>
            {message}
          </div>
        )}

        {/* Settings Layout - Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-7xl">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6 md:space-y-8">
            {/* Profile Section */}
            <section className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
              <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 border-b border-slate-100">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900">Profile Settings</h2>
                <p className="text-xs sm:text-sm text-slate-500 font-normal mt-1">Update your account information</p>
              </div>
              
              <div className="divide-y divide-slate-100">
                {/* Email Field */}
                <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6">
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-md bg-slate-50 cursor-not-allowed text-slate-600 text-xs sm:text-sm md:text-base"
                  />
                  <p className="text-xs text-slate-500 font-normal mt-2">Email address cannot be changed</p>
                </div>

                {/* Business Name Field */}
                <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6">
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Business Name</label>
                  <input
                    type="text"
                    value={settings.businessName}
                    onChange={(e) => handleSettingChange('businessName', e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 text-xs sm:text-sm md:text-base transition-all"
                    placeholder="Enter your business name"
                  />
                  <p className="text-xs text-slate-500 font-normal mt-2">Displayed on reports and financial documents</p>
                </div>
              </div>
            </section>

            {/* Preferences Section */}
            <section className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
              <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 border-b border-slate-100">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900">Preferences</h2>
                <p className="text-xs sm:text-sm text-slate-500 font-normal mt-1">Customize your experience</p>
              </div>
              
              <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6">
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Default Currency</label>
                <select
                  value={settings.currency}
                  onChange={(e) => handleSettingChange('currency', e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 text-xs sm:text-sm md:text-base transition-all"
                >
                  <option value="NPR">NPR (Nepalese Rupee)</option>
                  <option value="USD">USD (US Dollar)</option>
                  <option value="INR">INR (Indian Rupee)</option>
                  <option value="EUR">EUR (Euro)</option>
                  <option value="GBP">GBP (British Pound)</option>
                </select>
                <p className="text-xs text-slate-500 font-normal mt-2">All transactions will display in this currency</p>
              </div>
            </section>
          </div>

          {/* Sidebar - Account Actions */}
          <div className="lg:col-span-1">
            <section className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm lg:sticky lg:top-28">
              <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 border-b border-slate-100">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900">Account</h2>
              </div>
              
              <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 space-y-3 sm:space-y-4">
                <button
                  onClick={logout}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 sm:py-3 md:py-3 rounded-md transition-colors font-semibold text-xs sm:text-sm md:text-base"
                >
                  Sign Out
                </button>
                
                <div className="bg-slate-50 rounded-md p-3 sm:p-4 border border-slate-200">
                  <p className="text-xs font-medium text-slate-600">Account Status</p>
                  <p className="text-xs text-slate-500 mt-2">Active</p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Save Button - Full Width */}
        <div className="mt-8 sm:mt-10 md:mt-12 max-w-7xl">
          <button
            onClick={handleSave}
            disabled={!hasChanges || loading}
            className={`w-full py-3 sm:py-4 md:py-4 rounded-md font-semibold text-sm sm:text-base transition-all ${
              hasChanges && !loading
                ? 'bg-teal-600 hover:bg-teal-700 text-white cursor-pointer shadow-md hover:shadow-lg'
                : 'bg-slate-200 text-slate-500 cursor-not-allowed'
            }`}
          >
            {loading ? 'Saving Changes...' : 'Save Changes'}
          </button>
          <p className="text-xs text-slate-500 font-normal mt-3 text-center">Changes are automatically backed up to your account</p>
        </div>
      </div>
    </div>
  );
}
