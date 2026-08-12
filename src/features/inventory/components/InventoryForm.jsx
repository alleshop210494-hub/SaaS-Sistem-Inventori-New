import React, { useState, useEffect } from 'react';
import { useInventory } from '../context/InventoryContext';

export const InventoryForm = ({ currentItem, clearCurrentItem }) => {
  const { addItem, updateItem } = useInventory();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    stock: '',
    price: '',
  });

  useEffect(() => {
    if (currentItem) {
      setFormData(currentItem);
    } else {
      setFormData({ name: '', category: '', stock: '', price: '' });
    }
  }, [currentItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.category ||
      formData.stock === '' ||
      formData.price === ''
    )
      return;

    if (currentItem) {
      updateItem(currentItem.id, {
        ...formData,
        stock: Number(formData.stock),
        price: Number(formData.price),
      });
      clearCurrentItem();
    } else {
      addItem({
        ...formData,
        stock: Number(formData.stock),
        price: Number(formData.price),
      });
    }
    setFormData({ name: '', category: '', stock: '', price: '' });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-xs rounded-2xl p-6 border border-slate-200"
    >
      <h3 className="text-base font-bold text-slate-800 mb-4">
        {currentItem ? 'Edit Barang Inventori' : 'Tambah Barang Baru'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wider">
            Nama Barang
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 text-sm"
            placeholder="Contoh: Laptop"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wider">
            Kategori
          </label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 text-sm"
            placeholder="Contoh: Elektronik"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wider">
            Stok
          </label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
            className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 text-sm"
            placeholder="0"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wider">
            Harga (IDR)
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 text-sm"
            placeholder="0"
          />
        </div>
      </div>
      <div className="mt-4 flex justify-end space-x-3">
        {currentItem && (
          <button
            type="button"
            onClick={() => {
              clearCurrentItem();
              setFormData({ name: '', category: '', stock: '', price: '' });
            }}
            className="bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-300 transition-colors"
          >
            Batal
          </button>
        )}
        <button
          type="submit"
          className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-100"
        >
          {currentItem ? 'Simpan Perubahan' : 'Tambah Barang'}
        </button>
      </div>
    </form>
  );
};
