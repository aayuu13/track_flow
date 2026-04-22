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
      expenseByCategory[category] =
        (expenseByCategory[category] || 0) + (tx.amount || 0);
    });

  const totalExpense = Object.values(expenseByCategory).reduce((a, b) => a + b, 0);

  return (
    <div className="md:ml-64 pt-24 px-6 md:px-10 pb-10 bg-[#0B0F17] min-h-screen text-slate-200">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          Reports & Analytics
        </h1>
        <p className="text-slate-400 mt-2 text-sm">
          Financial insights and performance overview
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        {['7', '30', '90', '365'].map((range) => (
          <button
            key={range}
            onClick={() => setDateRange(range)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              dateRange === range
                ? 'bg-white text-black'
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
          >
            {range === '7'
              ? '7D'
              : range === '30'
              ? '30D'
              : range === '90'
              ? '90D'
              : '1Y'}
          </button>
        ))}
      </div>

      {/* P&L Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-10">
        {[
          { label: 'Revenue', value: plData.revenue, color: 'text-emerald-400' },
          { label: 'COGS', value: plData.cogs, color: 'text-orange-400' },
          { label: 'Gross Profit', value: plData.grossProfit, color: 'text-blue-400' },
          { label: 'Expenses', value: plData.expenses, color: 'text-red-400' },
          {
            label: 'Net Profit',
            value: plData.netProfit,
            color:
              (plData.netProfit || 0) >= 0
                ? 'text-emerald-400'
                : 'text-red-400',
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white/[0.03] border border-white/10 rounded-xl p-5 hover:bg-white/[0.06] transition"
          >
            <p className="text-xs text-slate-400 mb-2">{item.label}</p>
            <p className={`text-xl font-semibold ${item.color}`}>
              ${Number(item.value || 0).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
          <h2 className="text-sm font-medium text-slate-400 mb-4">
            Sales Trend
          </h2>
          <SalesLineChart transactions={transactions} />
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
          <h2 className="text-sm font-medium text-slate-400 mb-4">
            Revenue vs Expenses
          </h2>
          <RevenueExpensesBarChart transactions={transactions} />
        </div>
      </div>

      {/* Inventory */}
      <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6 mb-10">
        <h2 className="text-sm font-medium text-slate-400 mb-4">
          Inventory Distribution
        </h2>
        <InventoryPieChart products={products} />
      </div>

      {/* Expense Breakdown */}
      {Object.keys(expenseByCategory).length > 0 && (
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
          <h2 className="text-sm font-medium text-slate-400 mb-6">
            Expense Breakdown
          </h2>

          <div className="space-y-4">
            {Object.entries(expenseByCategory).map(([category, amount]) => {
              const percent = ((amount / totalExpense) * 100).toFixed(1);

              return (
                <div key={category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">{category}</span>
                    <span className="text-slate-400">
                      ${amount.toFixed(2)} • {percent}%
                    </span>
                  </div>

                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-400 to-cyan-400"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}