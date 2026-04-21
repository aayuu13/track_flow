import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../App';
import { subscribeToProducts, subscribeToTransactions } from '../firebase/db';
import { calculatePL } from '../utils/calculatePL';
import SalesLineChart from '../charts/SalesLineChart';
import RevenueExpensesBarChart from '../charts/RevenueExpensesBarChart';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalInventoryValue: 0,
    dailySales: 0,
    dailyExpenses: 0,
    topSellingItems: [],
  });

  useEffect(() => {
    if (!user) return;

    const unsubProducts = subscribeToProducts(user.uid, setProducts);
    const unsubTransactions = subscribeToTransactions(user.uid, setTransactions);

    return () => {
      unsubProducts();
      unsubTransactions();
    };
  }, [user]);

  useEffect(() => {
    // Calculate inventory value
    const totalInventoryValue = products.reduce(
      (sum, p) => sum + (p.stock * p.sellingPrice || 0),
      0
    );

    // Calculate today's sales and expenses
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayTransactions = transactions.filter((tx) => {
      const txDate = tx.date?.toDate ? tx.date.toDate() : new Date(tx.date);
      txDate.setHours(0, 0, 0, 0);
      return txDate.getTime() === today.getTime();
    });

    const dailySales = todayTransactions
      .filter((tx) => tx.type === 'sales')
      .reduce((sum, tx) => sum + (tx.amount || 0), 0);

    const dailyExpenses = todayTransactions
      .filter((tx) => tx.type === 'expense')
      .reduce((sum, tx) => sum + (tx.amount || 0), 0);

    // Top selling items (by quantity sold)
    const salesByProduct = {};
    transactions
      .filter((tx) => tx.type === 'sales')
      .forEach((tx) => {
        const productName = products.find((p) => p.id === tx.productId)?.name || 'Unknown';
        salesByProduct[productName] = (salesByProduct[productName] || 0) + (tx.quantity || 0);
      });

    const topSellingItems = Object.entries(salesByProduct)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, quantity]) => ({ name, quantity }));

    setStats({
      totalInventoryValue: parseFloat(totalInventoryValue.toFixed(2)),
      dailySales: parseFloat(dailySales.toFixed(2)),
      dailyExpenses: parseFloat(dailyExpenses.toFixed(2)),
      topSellingItems,
    });
  }, [products, transactions]);

  return (
    <div className="md:ml-64 pt-24 p-8 min-h-screen bg-slate-50">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-600 text-base">Welcome back! Here's your financial overview for today</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-7 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition">
          <p className="text-slate-600 text-xs font-semibold uppercase tracking-wide">Total Inventory Value</p>
          <p className="text-3xl font-bold text-teal-600 mt-3">${stats.totalInventoryValue.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-2">Based on selling price</p>
        </div>

        <div className="bg-white p-7 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition">
          <p className="text-slate-600 text-xs font-semibold uppercase tracking-wide">Today's Sales</p>
          <p className="text-3xl font-bold text-cyan-600 mt-3">${stats.dailySales.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-2">Revenue today</p>
        </div>

        <div className="bg-white p-7 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition">
          <p className="text-slate-600 text-xs font-semibold uppercase tracking-wide">Today's Expenses</p>
          <p className="text-3xl font-bold text-red-600 mt-3">${stats.dailyExpenses.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-2">Expenses today</p>
        </div>

        <div className="bg-white p-7 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition">
          <p className="text-slate-600 text-xs font-semibold uppercase tracking-wide">Total Products</p>
          <p className="text-3xl font-bold text-teal-600 mt-3">{products.length}</p>
          <p className="text-xs text-slate-500 mt-2">In inventory</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-7 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Sales Trend (Last 7 Days)</h2>
          <SalesLineChart transactions={transactions} />
        </div>

        <div className="bg-white p-7 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Revenue vs Expenses</h2>
          <RevenueExpensesBarChart transactions={transactions} />
        </div>
      </div>

      {/* Top Selling Items */}
      <div className="bg-white p-7 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Top Selling Items</h2>
        {stats.topSellingItems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-slate-700 font-semibold">Product</th>
                  <th className="px-4 py-3 text-left text-slate-700 font-semibold">Quantity Sold</th>
                </tr>
              </thead>
              <tbody>
                {stats.topSellingItems.map((item, idx) => (
                  <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition">
                    <td className="px-4 py-3 text-slate-800">{item.name}</td>
                    <td className="px-4 py-3 text-slate-800 font-semibold">{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-slate-600 text-center py-8">No sales data yet</p>
        )}
      </div>
    </div>
  );
}
