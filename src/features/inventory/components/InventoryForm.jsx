import React, { useState, useEffect } from 'react';
import { useInventory } from '../context/InventoryContext';

export const InventoryForm = ({ currentItem, clearCurrentItem }) => {
  const { addItem, updateItem } = useInventory();
  const [formData, setFormData] = useState({ name: '', category: '', stock: '', price: '' });

  useEffect(() => {
    if (currentItem) {
      setFormData(currentItem);
    } else {
      setFormData({ name: '', category: '', stock: '', price: '' });
    }
  }, [currentItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category || formData.stock === '' || formData.price === '') return;

    if (currentItem) {
      updateItem(currentItem.id, {
        ...formData,
        stock: Number(formData.stock),
        price: Number(formData.price)
      });
      clearCurrentItem();
    } else {
      addItem({
        ...formData,
        stock: Number(formData.stock),
        price: Number(formData.price)
      });
    }
    setFormData({ name: '', category: '', stock: '', price: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-md p-6">
      <h3 className="text-sm font-bold text-slate-900 mb-4">
        {currentItem ? 'Edit Barang Inventori' : 'Tambah Barang Baru'}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Nama Barang</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-slate-900 outline-none text-slate-900 text-xs font-medium bg-white"
            placeholder="Contoh: Laptop"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Kategori</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-slate-900 outline-none text-slate-900 text-xs font-medium bg-white"
            placeholder="Contoh: Elektronik"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Stok</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-slate-900 outline-none text-slate-900 text-xs font-mono bg-white"
            placeholder="0"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Harga (IDR)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-slate-900 outline-none text-slate-900 text-xs font-mono bg-white"
            placeholder="0"
          />
        </div>
      </div>
      <div className="mt-5 flex justify-end space-x-2">
        {currentItem && (
          <button
            type="button"
            onClick={() => { clearCurrentItem(); setFormData({ name: '', category: '', stock: '', price: '' }); }}
            className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded text-xs font-medium hover:bg-slate-50"
          >
            Batal
          </button>
        )}
        <button
          type="submit"
          className="bg-slate-900 text-white px-4 py-2 rounded text-xs font-medium hover:bg-slate-800"
        >
          {currentItem ? 'Simpan Perubahan' : 'Tambah Barang'}
        </button>
      </div>
    </form>
  );
};