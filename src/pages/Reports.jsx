import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../App';
import { subscribeToTransactions, subscribeToProducts } from '../firebase/db';
import { calculatePL } from '../utils/calculatePL';
import { getDateRange, filterByDateRange } from '../utils/dateUtils';
import SalesLineChart from '../charts/SalesLineChart';
import RevenueExpensesBarChart from '../charts/RevenueExpensesBarChart';
import InventoryPieChart from '../charts/InventoryPieChart';

export default function Reports() {
  const { user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [dateRange, setDateRange] = useState('30');
  const [plData, setPlData] = useState({});

  useEffect(() => {
    if (!user) return;
    const unsubTx = subscribeToTransactions(user.uid, setTransactions);
    const unsubProd = subscribeToProducts(user.uid, setProducts);
    return () => {
      unsubTx();
      unsubProd();
    };
  }, [user]);

  useEffect(() => {
    if (transactions.length > 0) {
      const { start, end } = getDateRange(parseInt(dateRange));
      const filtered = filterByDateRange(transactions, start, end);
      const pl = calculatePL(filtered);
      setPlData(pl);
    }
  }, [transactions, dateRange]);

  const expenseByCategory = {};
  transactions
    .filter((tx) => tx.type === 'expense')
    .forEach((tx) => {
      const category = tx.category || 'Other';
      expenseByCategory[category] = (expenseByCategory[category] || 0) + (tx.amount || 0);
    });

  return (
    <div className="md:ml-64 pt-24 p-8 min-h-screen bg-slate-50">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Reports & Analytics</h1>
        <p className="text-slate-600 text-base">Analyze your business performance and financial metrics</p>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
        <div className="flex items-end gap-4">
          <div className="flex-1 max-w-xs">
            <label className="block text-slate-700 font-semibold text-sm mb-2">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
              <option value="365">Last Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* P&L Statement */}
      <div className="bg-white p-7 rounded-xl shadow-sm border border-slate-200 mb-8">
        <h2 className="text-lg font-semibold text-slate-900 mb-6">Profit & Loss Statement</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <p className="text-slate-600 text-sm font-medium">Revenue</p>
            <p className="text-2xl font-bold text-green-600 mt-2">${(plData.revenue || 0).toFixed(2)}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <p className="text-slate-600 text-sm font-medium">COGS</p>
            <p className="text-2xl font-bold text-orange-600 mt-2">${(plData.cogs || 0).toFixed(2)}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <p className="text-slate-600 text-sm font-medium">Gross Profit</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">${(plData.grossProfit || 0).toFixed(2)}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <p className="text-slate-600 text-sm font-medium">Expenses</p>
            <p className="text-2xl font-bold text-red-600 mt-2">${(plData.expenses || 0).toFixed(2)}</p>
          </div>
          <div className="bg-teal-50 p-4 rounded-lg border-2 border-teal-200">
            <p className="text-slate-600 text-sm font-medium">Net Profit</p>
            <p className={`text-2xl font-bold mt-2 ${(plData.netProfit || 0) >= 0 ? 'text-teal-600' : 'text-red-600'}`}>
              ${(plData.netProfit || 0).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-7 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Sales Trend</h2>
          <SalesLineChart transactions={transactions} />
        </div>

        <div className="bg-white p-7 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Revenue vs Expenses</h2>
          <RevenueExpensesBarChart transactions={transactions} />
        </div>
      </div>

      {/* Inventory Distribution */}
      <div className="bg-white p-7 rounded-xl shadow-sm border border-slate-200 mb-8">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Inventory Distribution</h2>
        <InventoryPieChart products={products} />
      </div>

      {/* Expense Breakdown */}
      {Object.keys(expenseByCategory).length > 0 && (
        <div className="bg-white p-7 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Expense Breakdown by Category</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Category</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Amount</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Percentage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {Object.entries(expenseByCategory).map(([category, amount]) => {
                  const total = Object.values(expenseByCategory).reduce((a, b) => a + b, 0);
                  return (
                    <tr key={category} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-slate-900">{category}</td>
                      <td className="px-4 py-3 text-slate-900 font-medium">${amount.toFixed(2)}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {((amount / total) * 100).toFixed(2)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
