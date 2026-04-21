import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../App';
import {
  subscribeToProducts,
  addProduct,
  updateProduct,
  deleteProduct
} from '../firebase/db';

export default function Inventory() {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    stock: 0,
    costPrice: 0,
    sellingPrice: 0,
  });

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToProducts(user.uid, setProducts);
    return unsub;
  }, [user]);

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      stock: 0,
      costPrice: 0,
      sellingPrice: 0,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await updateProduct(editingId, formData);
    } else {
      await addProduct(user.uid, formData);
    }

    resetForm();
  };

  const handleEdit = (p) => {
    setFormData({
      name: p.name,
      category: p.category,
      stock: p.stock,
      costPrice: p.costPrice,
      sellingPrice: p.sellingPrice,
    });
    setEditingId(p.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product?')) {
      await deleteProduct(id);
    }
  };

  const lowStock = products.filter(p => p.stock < 10);

  const Card = ({ title, value, sub, color }) => (
    <div className="relative bg-white/70 backdrop-blur-md border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition hover:-translate-y-1">
      <div className={`absolute left-0 top-0 h-full w-1 rounded-l-2xl ${color}`} />
      <p className="text-xs uppercase tracking-widest text-slate-500">{title}</p>
      <p className="text-3xl font-semibold text-slate-900 mt-3">{value}</p>
      <p className="text-xs text-slate-500 mt-2">{sub}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 md:ml-64 pt-24 px-8 pb-10">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-semibold text-slate-900">Inventory</h1>
          <p className="text-slate-500 mt-2">
            Manage products and stock levels
          </p>
        </div>

        <button
          onClick={() => {
            setShowForm(!showForm);
            if (showForm) resetForm();
          }}
          className="px-5 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition"
        >
          {showForm ? 'Close' : '+ Add Product'}
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

        <Card
          title="Products"
          value={products.length}
          sub="Total items"
          color="bg-indigo-500"
        />

        <Card
          title="Stock Items"
          value={products.reduce((a, b) => a + b.stock, 0)}
          sub="Total quantity"
          color="bg-emerald-500"
        />

        <Card
          title="Inventory Value"
          value={`$${products.reduce((a, b) => a + (b.stock * b.sellingPrice), 0).toFixed(2)}`}
          sub="Estimated value"
          color="bg-blue-500"
        />

        <Card
          title="Low Stock"
          value={lowStock.length}
          sub="Needs restock"
          color="bg-red-500"
        />

      </div>

      {/* LOW STOCK ALERT */}
      {lowStock.length > 0 && (
        <div className="mb-8 p-5 rounded-2xl bg-red-50 border border-red-200">
          <p className="font-semibold text-red-700 mb-2">Low Stock Alert</p>
          <div className="flex flex-wrap gap-2">
            {lowStock.map(p => (
              <span
                key={p.id}
                className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-full"
              >
                {p.name} ({p.stock})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* FORM */}
      {showForm && (
        <div className="mb-10 bg-white/70 backdrop-blur-md border border-slate-200 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-6 text-slate-900">
            {editingId ? 'Edit Product' : 'Add Product'}
          </h2>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">

            <input
              placeholder="Product name"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="p-3 rounded-xl border border-slate-200 bg-white"
              required
            />

            <input
              placeholder="Category"
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
              className="p-3 rounded-xl border border-slate-200 bg-white"
              required
            />

            <input
              type="number"
              placeholder="Stock"
              value={formData.stock}
              onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
              className="p-3 rounded-xl border border-slate-200 bg-white"
            />

            <input
              type="number"
              placeholder="Cost Price"
              value={formData.costPrice}
              onChange={e => setFormData({ ...formData, costPrice: Number(e.target.value) })}
              className="p-3 rounded-xl border border-slate-200 bg-white"
            />

            <input
              type="number"
              placeholder="Selling Price"
              value={formData.sellingPrice}
              onChange={e => setFormData({ ...formData, sellingPrice: Number(e.target.value) })}
              className="p-3 rounded-xl border border-slate-200 bg-white"
            />

            <button
              className="md:col-span-2 mt-2 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition"
            >
              {editingId ? 'Update Product' : 'Save Product'}
            </button>

          </form>
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white/70 backdrop-blur-md border border-slate-200 rounded-2xl overflow-hidden">

        <div className="p-5 border-b border-slate-200">
          <h2 className="font-semibold text-slate-900">Products</h2>
        </div>

        <div className="divide-y divide-slate-100">

          {products.map(p => {
            const profit = ((p.sellingPrice - p.costPrice) / p.costPrice * 100 || 0).toFixed(1);

            return (
              <div key={p.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition">

                <div>
                  <p className="font-medium text-slate-900">{p.name}</p>
                  <p className="text-xs text-slate-500">{p.category}</p>
                </div>

                <div className="text-sm text-slate-600">
                  Stock: {p.stock}
                </div>

                <div className="text-sm font-medium text-slate-900">
                  ${p.sellingPrice}
                </div>

                <div className="text-sm text-emerald-600 font-medium">
                  {profit}%
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="px-3 py-1 text-xs rounded-lg bg-slate-200 hover:bg-slate-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="px-3 py-1 text-xs rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>

              </div>
            );
          })}

        </div>
      </div>

    </div>
  );
}