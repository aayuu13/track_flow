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
      totalInventoryValue: Number(totalInventoryValue.toFixed(2)),
      dailySales: Number(dailySales.toFixed(2)),
      dailyExpenses: Number(dailyExpenses.toFixed(2)),
      topSellingItems,
    });
  }, [products, transactions]);

  const Card = ({ title, value, subtitle, accent }) => (
    <div className="relative bg-white/70 backdrop-blur-md border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <div className={`absolute left-0 top-0 h-full w-1 rounded-l-2xl ${accent}`} />
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </p>
      <p className="text-3xl font-bold text-slate-900 mt-3">{value}</p>
      <p className="text-xs text-slate-500 mt-2">{subtitle}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 md:ml-64 pt-24 px-8 pb-10">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
          Dashboard
        </h1>
        <p className="text-slate-500 mt-2">
          Financial overview and performance insights
        </p>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

        <Card
          title="Inventory Value"
          value={`$${stats.totalInventoryValue.toLocaleString()}`}
          subtitle="Based on selling price"
          accent="bg-teal-500"
        />

        <Card
          title="Today's Sales"
          value={`$${stats.dailySales.toLocaleString()}`}
          subtitle="Revenue generated today"
          accent="bg-blue-500"
        />

        <Card
          title="Today's Expenses"
          value={`$${stats.dailyExpenses.toLocaleString()}`}
          subtitle="Operational cost today"
          accent="bg-red-500"
        />

        <Card
          title="Products"
          value={products.length}
          subtitle="Total inventory items"
          accent="bg-indigo-500"
        />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">

        <div className="bg-white/70 backdrop-blur-md border border-slate-200 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Sales Trend
          </h2>
          <SalesLineChart transactions={transactions} />
        </div>

        <div className="bg-white/70 backdrop-blur-md border border-slate-200 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Revenue vs Expenses
          </h2>
          <RevenueExpensesBarChart transactions={transactions} />
        </div>

      </div>

      {/* TOP SELLING */}
      <div className="bg-white/70 backdrop-blur-md border border-slate-200 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Top Selling Items
        </h2>

        {stats.topSellingItems.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {stats.topSellingItems.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between py-3 text-slate-700"
              >
                <span>{item.name}</span>
                <span className="font-semibold">{item.quantity}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-center py-8">
            No sales data yet
          </p>
        )}
      </div>
    </div>
  );
}