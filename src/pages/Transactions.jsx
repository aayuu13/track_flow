import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../App';
import {
  subscribeToTransactions,
  subscribeToProducts,
  addTransaction,
  updateProduct,
  deleteTransaction
} from '../firebase/db';

import { formatDate } from '../utils/dateUtils';

export default function Transactions() {
  const { user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filterType, setFilterType] = useState('all');

  const [formData, setFormData] = useState({
    type: 'sales',
    productId: '',
    quantity: 0,
    amount: 0,
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (!user) return;

    const unsubTx = subscribeToTransactions(user.uid, setTransactions);
    const unsubProd = subscribeToProducts(user.uid, setProducts);

    return () => {
      unsubTx();
      unsubProd();
    };
  }, [user]);

  const resetForm = () => {
    setFormData({
      type: 'sales',
      productId: '',
      quantity: 0,
      amount: 0,
      date: new Date().toISOString().split('T')[0],
    });
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selected = products.find(p => p.id === formData.productId);

    await addTransaction(user.uid, {
      ...formData,
      date: new Date(formData.date),
    });

    if (selected && formData.type !== 'expense') {
      let stock = selected.stock;

      if (formData.type === 'sales' || formData.type === 'sales_return') {
        stock -= formData.quantity;
      } else {
        stock += formData.quantity;
      }

      await updateProduct(selected.id, { stock });
    }

    resetForm();
  };

  const typeMeta = {
    sales: { label: 'Sales', color: 'bg-emerald-500', icon: '↑' },
    purchase: { label: 'Purchase', color: 'bg-blue-500', icon: '↓' },
    expense: { label: 'Expense', color: 'bg-red-500', icon: '–' },
    sales_return: { label: 'Return', color: 'bg-amber-500', icon: '↺' },
  };

  const filtered = transactions.filter(tx =>
    filterType === 'all' ? true : tx.type === filterType
  );

  const StatPill = ({ label, active, onClick }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-sm font-medium transition
        ${active
          ? 'bg-slate-900 text-white'
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen md:ml-64 pt-24 px-8 pb-10 bg-gradient-to-b from-slate-50 to-slate-100">

      {/* HEADER */}
      <div className="flex items-start justify-between mb-10">

        <div>
          <h1 className="text-4xl font-semibold text-slate-900">
            Transactions
          </h1>
          <p className="text-slate-500 mt-2">
            Track income, expenses and stock movements
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-5 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition"
        >
          {showForm ? 'Close' : '+ New Transaction'}
        </button>

      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-3 mb-8">
        <StatPill label="All" active={filterType === 'all'} onClick={() => setFilterType('all')} />
        <StatPill label="Sales" active={filterType === 'sales'} onClick={() => setFilterType('sales')} />
        <StatPill label="Purchase" active={filterType === 'purchase'} onClick={() => setFilterType('purchase')} />
        <StatPill label="Return" active={filterType === 'sales_return'} onClick={() => setFilterType('sales_return')} />
        <StatPill label="Expense" active={filterType === 'expense'} onClick={() => setFilterType('expense')} />
      </div>

      {/* FORM */}
      {showForm && (
        <div className="bg-white/70 backdrop-blur-md border border-slate-200 rounded-2xl p-6 mb-10">

          <h2 className="text-lg font-semibold mb-5">New Transaction</h2>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">

            <select
              className="p-3 rounded-xl border border-slate-200"
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="sales">Sales</option>
              <option value="purchase">Purchase</option>
              <option value="expense">Expense</option>
              <option value="sales_return">Return</option>
            </select>

            {formData.type !== 'expense' && (
              <select
                className="p-3 rounded-xl border border-slate-200"
                value={formData.productId}
                onChange={e => setFormData({ ...formData, productId: e.target.value })}
              >
                <option value="">Select Product</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            )}

            {formData.type !== 'expense' && (
              <input
                type="number"
                placeholder="Quantity"
                className="p-3 rounded-xl border border-slate-200"
                value={formData.quantity}
                onChange={e => setFormData({ ...formData, quantity: Number(e.target.value) })}
              />
            )}

            <input
              type="number"
              placeholder="Amount"
              className="p-3 rounded-xl border border-slate-200"
              value={formData.amount}
              onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })}
            />

            <input
              type="date"
              className="p-3 rounded-xl border border-slate-200"
              value={formData.date}
              onChange={e => setFormData({ ...formData, date: e.target.value })}
            />

            <button className="md:col-span-2 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800">
              Save Transaction
            </button>

          </form>
        </div>
      )}

      {/* LIST */}
      <div className="space-y-3">

        {filtered.map(tx => {
          const meta = typeMeta[tx.type] || typeMeta.expense;

          return (
            <div
              key={tx.id}
              className="flex items-center justify-between bg-white/70 backdrop-blur-md border border-slate-200 rounded-2xl px-5 py-4 hover:shadow-md transition"
            >

              {/* LEFT */}
              <div className="flex items-center gap-4">

                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${meta.color}`}>
                  {meta.icon}
                </div>

                <div>
                  <p className="font-medium text-slate-900">
                    {meta.label}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatDate(tx.date)}
                  </p>
                </div>

              </div>

              {/* CENTER */}
              <div className="hidden md:block text-sm text-slate-600">
                {products.find(p => p.id === tx.productId)?.name || '—'}
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-6">

                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">
                    ${tx.amount}
                  </p>
                  <p className="text-xs text-slate-500">
                    Qty: {tx.quantity || '-'}
                  </p>
                </div>

                <button
                  onClick={() => deleteTransaction(tx.id)}
                  className="text-xs px-3 py-1 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                >
                  Delete
                </button>

              </div>

            </div>
          );
        })}

      </div>

      {filtered.length === 0 && (
        <div className="text-center text-slate-500 mt-10">
          No transactions found
        </div>
      )}

    </div>
  );
}