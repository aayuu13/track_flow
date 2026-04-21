import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../App';
import { subscribeToProducts, addProduct, updateProduct, deleteProduct } from '../firebase/db';

export default function Inventory() {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    stock: 0,
    costPrice: 0,
    sellingPrice: 0,
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToProducts(user.uid, setProducts);
    return unsubscribe;
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateProduct(editingId, formData);
        setEditingId(null);
      } else {
        await addProduct(user.uid, formData);
      }
      setFormData({
        name: '',
        category: '',
        stock: 0,
        costPrice: 0,
        sellingPrice: 0,
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      category: product.category,
      stock: product.stock,
      costPrice: product.costPrice,
      sellingPrice: product.sellingPrice,
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteProduct(productId);
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const lowStockItems = products.filter((p) => p.stock < 10);
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.stock * p.sellingPrice), 0);
  const totalItems = products.reduce((sum, p) => sum + p.stock, 0);
  const totalProducts = products.length;

  return (
    <div className="md:ml-64 pt-24 p-8 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Inventory</h1>
          <p className="text-gray-600 mt-2">Manage your product inventory and stock levels</p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({
              name: '',
              category: '',
              stock: 0,
              costPrice: 0,
              sellingPrice: 0,
            });
          }}
          className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors font-semibold shadow-sm"
        >
          {showForm ? '✕ Cancel' : '+ Add Product'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Products</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalProducts}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <span className="text-2xl">📦</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Stock Items</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalItems}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <span className="text-2xl">📊</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Inventory Value</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">${totalInventoryValue.toFixed(2)}</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Low Stock Items</p>
              <p className={`text-3xl font-bold mt-2 ${lowStockItems.length > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                {lowStockItems.length}
              </p>
            </div>
            <div className={`${lowStockItems.length > 0 ? 'bg-red-50' : 'bg-gray-50'} p-3 rounded-lg`}>
              <span className="text-2xl">⚠️</span>
            </div>
          </div>
        </div>
      </div>

      {/* Low Stock Alerts */}
      {lowStockItems.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="text-2xl">⚠️</span>
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-red-900">Low Stock Alert</h3>
              <p className="text-red-800 text-sm mt-1">
                {lowStockItems.length} {lowStockItems.length === 1 ? 'item' : 'items'} {lowStockItems.length === 1 ? 'has' : 'have'} less than 10 units in stock
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {lowStockItems.map((item) => (
                  <span key={item.id} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
                    {item.name} ({item.stock} units)
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {editingId ? '✎ Edit Product' : '+ Add New Product'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Laptop, Monitor, Keyboard"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-900 placeholder-gray-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                <input
                  type="text"
                  placeholder="e.g., Electronics, Furniture, Accessories"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-900 placeholder-gray-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Quantity *</label>
                <input
                  type="number"
                  placeholder="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cost Price ($) *</label>
                <input
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  value={formData.costPrice}
                  onChange={(e) => setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Selling Price ($) *</label>
                <input
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  value={formData.sellingPrice}
                  onChange={(e) => setFormData({ ...formData, sellingPrice: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-900"
                  required
                />
              </div>

              {formData.costPrice > 0 && formData.sellingPrice > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Profit Margin</label>
                  <div className="px-4 py-2 bg-teal-50 border border-teal-300 rounded-lg text-teal-900 font-medium">
                    {((((formData.sellingPrice - formData.costPrice) / formData.costPrice) * 100) || 0).toFixed(1)}%
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                type="submit"
                className="flex-1 bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-semibold"
              >
                {editingId ? '✓ Update Product' : '✓ Save Product'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({
                    name: '',
                    category: '',
                    stock: 0,
                    costPrice: 0,
                    sellingPrice: 0,
                  });
                }}
                className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Products ({totalProducts})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Cost</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Selling</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Profit %</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Value</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => {
                const profitMargin = product.costPrice > 0 
                  ? (((product.sellingPrice - product.costPrice) / product.costPrice) * 100).toFixed(1)
                  : 0;
                const totalValue = (product.stock * product.sellingPrice).toFixed(2);
                const isLowStock = product.stock < 10;

                return (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-lg">📦</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{product.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold ${
                        isLowStock 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-900 font-medium">${product.costPrice.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right text-gray-900 font-medium">${product.sellingPrice.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
                        {profitMargin}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-900 font-bold">${totalValue}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="inline-flex items-center justify-center w-8 h-8 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                          title="Edit"
                        >
                          ✎
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="inline-flex items-center justify-center w-8 h-8 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                          title="Delete"
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {products.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-6xl mb-4">📭</p>
            <p className="text-gray-500 text-lg">No products yet</p>
            <p className="text-gray-400 text-sm mt-2">Add your first product to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
