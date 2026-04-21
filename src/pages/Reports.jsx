import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../App';
import { subscribeToProducts, subscribeToTransactions } from '../firebase/db';

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
    const totalInventoryValue = products.reduce(
      (sum, p) => sum + (p.stock * p.sellingPrice || 0),
      0
    );

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

    const salesByProduct = {};
    transactions
      .filter((tx) => tx.type === 'sales')
      .forEach((tx) => {
        const productName =
          products.find((p) => p.id === tx.productId)?.name || 'Unknown';
        salesByProduct[productName] =
          (salesByProduct[productName] || 0) + (tx.quantity || 0);
      });

    const topSellingItems = Object.entries(salesByProduct)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, quantity]) => ({ name, quantity }));

    setStats({
      totalInventoryValue,
      dailySales,
      dailyExpenses,
      topSellingItems,
    });
  }, [products, transactions]);

  const Card = ({ children, className = '' }) => (
    <div className={`bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-sm ${className}`}>
      {children}
    </div>
  );

  return (
    <div className="md:ml-64 pt-24 px-8 pb-10 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
          Dashboard
        </h1>
        <p className="text-slate-500 mt-2">
          Real-time overview of your business performance
        </p>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-10">

        <Card className="p-6 border-l-4 border-l-teal-500">
          <p className="text-xs text-slate-500 uppercase tracking-wide">Inventory Value</p>
          <p className="text-3xl font-semibold mt-2 text-slate-900">
            ${stats.totalInventoryValue.toLocaleString()}
          </p>
        </Card>

        <Card className="p-6 border-l-4 border-l-sky-500">
          <p className="text-xs text-slate-500 uppercase tracking-wide">Today Sales</p>
          <p className="text-3xl font-semibold mt-2 text-slate-900">
            ${stats.dailySales.toLocaleString()}
          </p>
        </Card>

        <Card className="p-6 border-l-4 border-l-rose-500">
          <p className="text-xs text-slate-500 uppercase tracking-wide">Expenses</p>
          <p className="text-3xl font-semibold mt-2 text-slate-900">
            ${stats.dailyExpenses.toLocaleString()}
          </p>
        </Card>

        <Card className="p-6 border-l-4 border-l-indigo-500">
          <p className="text-xs text-slate-500 uppercase tracking-wide">Products</p>
          <p className="text-3xl font-semibold mt-2 text-slate-900">
            {products.length}
          </p>
        </Card>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

        <Card className="p-6">
          <h2 className="text-sm font-medium text-slate-600 mb-4">
            Sales Trend
          </h2>
          <SalesLineChart transactions={transactions} />
        </Card>

        <Card className="p-6">
          <h2 className="text-sm font-medium text-slate-600 mb-4">
            Revenue vs Expenses
          </h2>
          <RevenueExpensesBarChart transactions={transactions} />
        </Card>

      </div>

      {/* TOP PRODUCTS */}
      <Card className="p-6">
        <h2 className="text-sm font-medium text-slate-600 mb-4">
          Top Selling Items
        </h2>

        {stats.topSellingItems.length === 0 ? (
          <p className="text-slate-400 text-sm">No sales data yet</p>
        ) : (
          <div className="space-y-3">
            {stats.topSellingItems.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0"
              >
                <span className="text-slate-700">{item.name}</span>
                <span className="text-slate-900 font-medium">
                  {item.quantity}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}