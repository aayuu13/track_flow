import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../App';
import { subscribeToTransactions, subscribeToProducts, addTransaction, updateProduct, deleteTransaction } from '../firebase/db';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const selectedProduct = products.find((p) => p.id === formData.productId);

      // Add transaction
      await addTransaction(user.uid, {
        ...formData,
        date: new Date(formData.date),
      });

      // Update stock based on transaction type
      if (selectedProduct) {
        let newStock = selectedProduct.stock;
        if (formData.type === 'sales' || formData.type === 'sales_return') {
          newStock -= formData.quantity;
        } else if (formData.type === 'purchase' || formData.type === 'return') {
          newStock += formData.quantity;
        }

        await updateProduct(selectedProduct.id, { stock: newStock });
      }

      setFormData({
        type: 'sales',
        productId: '',
        quantity: 0,
        amount: 0,
        date: new Date().toISOString().split('T')[0],
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const handleDelete = async (transactionId) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteTransaction(transactionId);
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  return (
    <div className="md:ml-64 pt-24 p-8 min-h-screen bg-slate-50">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Transactions</h1>
        <p className="text-slate-600 text-base">Manage all your sales and expense records</p>
      </div>

      {/* Add Transaction Button */}
      <div className="mb-8">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
        >
          {showForm ? '✕ Cancel' : '+ Add Transaction'}
        </button>
      </div>

      {/* Filter Buttons */}
      <div className="mb-8 flex flex-wrap gap-3">
        <button
          onClick={() => setFilterType('all')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
            filterType === 'all'
              ? 'bg-slate-900 text-white'
              : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
          }`}
        >
          All Transactions
        </button>
        <button
          onClick={() => setFilterType('sales')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
            filterType === 'sales'
              ? 'bg-green-600 text-white'
              : 'bg-green-100 text-green-900 hover:bg-green-200'
          }`}
        >
          Sales
        </button>
        <button
          onClick={() => setFilterType('sales_return')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
            filterType === 'sales_return'
              ? 'bg-amber-600 text-white'
              : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
          }`}
        >
          Sales Return
        </button>
        <button
          onClick={() => setFilterType('purchase')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
            filterType === 'purchase'
              ? 'bg-blue-600 text-white'
              : 'bg-blue-100 text-blue-900 hover:bg-blue-200'
          }`}
        >
          Purchase
        </button>
        <button
          onClick={() => setFilterType('expense')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
            filterType === 'expense'
              ? 'bg-red-600 text-white'
              : 'bg-red-100 text-red-900 hover:bg-red-200'
          }`}
        >
          Expense
        </button>
      </div>

      {/* Add Transaction Form */}
      {showForm && (
        <div className="bg-white p-7 rounded-xl shadow-sm border border-slate-200 mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Add New Transaction</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-semibold text-slate-700 mb-2 text-sm">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                >
                  <option value="sales">Sales</option>
                  <option value="purchase">Purchase</option>
                  <option value="sales_return">Sales Return</option>
                  <option value="expense">Expense</option>
                </select>
              </div>

              {formData.type !== 'expense' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-2 text-sm">Product</label>
                  <select
                    value={formData.productId}
                    onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                    required={formData.type !== 'expense'}
                  >
                    <option value="">Select Product</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {formData.type !== 'expense' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-2 text-sm">Quantity</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                    required={formData.type !== 'expense'}
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-2 text-sm">Amount ($)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-2 text-sm">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg transition-colors font-semibold text-sm"
            >
              ✓ Add Transaction
            </button>
          </form>
        </div>
      )}

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Type</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Product</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Quantity</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Amount</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-slate-700">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {transactions
              .filter((tx) => (filterType === 'all' ? true : tx.type === filterType))
              .map((tx) => (
              <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-3 text-slate-900">
                  {formatDate(tx.date)}
                </td>
                <td className="px-6 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${
                      tx.type === 'sales'
                        ? 'bg-green-600'
                        : tx.type === 'purchase'
                        ? 'bg-blue-600'
                        : tx.type === 'sales_return'
                        ? 'bg-amber-600'
                        : 'bg-red-600'
                    }`}
                  >
                    {tx.type}
                  </span>
                </td>
                <td className="px-6 py-3 text-slate-900">
                  {products.find((p) => p.id === tx.productId)?.name || 'N/A'}
                </td>
                <td className="px-6 py-3 text-slate-900">{tx.quantity || '-'}</td>
                <td className="px-6 py-3 text-slate-900 font-semibold">${tx.amount.toFixed(2)}</td>
                <td className="px-6 py-3 text-center">
                  <button
                    onClick={() => handleDelete(tx.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg transition-colors text-sm font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {transactions.length === 0 && (
          <div className="p-8 text-center text-slate-500 font-medium">
            No transactions yet. Add your first transaction to get started.
          </div>
        )}
      </div>
    </div>
  );
}
