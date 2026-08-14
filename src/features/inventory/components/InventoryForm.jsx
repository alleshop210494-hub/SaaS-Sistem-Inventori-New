import React, { useState, useEffect } from 'react';
import { useInventory } from '../context/InventoryContext';

export function InventoryForm({ editingItem, onCancelEdit, onSubmit, onSave }) {
  const inventory = useInventory() || {};
  const addItem = inventory.addItem;
  const updateItem = inventory.updateItem;
  const suppliers = inventory.suppliers || [];

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [sku, setSku] = useState('');
  const [stock, setStock] = useState('');
  const [price, setPrice] = useState('');
  const [supplierId, setSupplierId] = useState('');

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name || '');
      setCategory(editingItem.category || '');
      setSku(editingItem.sku || '');
      setStock(editingItem.stock !== undefined ? editingItem.stock : '');
      setPrice(editingItem.price !== undefined ? editingItem.price : '');
      setSupplierId(editingItem.supplier_id || '');
    } else {
      setName('');
      setCategory('');
      setSku('');
      setStock('');
      setPrice('');
      setSupplierId('');
    }
  }, [editingItem]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Nama barang tidak boleh kosong!');
      return;
    }

    const cleanPriceString = typeof price === 'string' ? price.replace(/\./g, '').replace(',', '.') : price;
    const parsedPrice = Number(cleanPriceString);
    const parsedStock = Number(stock);

    const itemData = {
      name,
      category,
      sku,
      stock: isNaN(parsedStock) ? 0 : parsedStock,
      price: isNaN(parsedPrice) ? 0 : parsedPrice,
      supplier_id: supplierId ? Number(supplierId) : null,
    };

    const submitFunc = onSubmit || onSave;

    try {
      if (typeof submitFunc === 'function') {
        await submitFunc(editingItem ? { ...(editingItem || {}), ...itemData } : itemData);
      } else if (editingItem) {
        const itemId = editingItem.id || editingItem._id;
        if (itemId && typeof updateItem === 'function') {
          await updateItem(itemId, itemData);
        }
      } else {
        if (typeof addItem === 'function') {
          await addItem(itemData);
        }
      }

      if (editingItem && typeof onCancelEdit === 'function') {
        onCancelEdit();
      }

      if (!editingItem) {
        setName('');
        setCategory('');
        setSku('');
        setStock('');
        setPrice('');
        setSupplierId('');
      }
    } catch (error) {
      console.error('Error saat menyimpan form:', error);
      alert('Terjadi kesalahan saat menyimpan data.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {editingItem ? 'Edit Barang Inventori' : 'Tambah Barang Baru'}
        </h3>
        {editingItem && typeof onCancelEdit === 'function' && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-xs text-red-600 hover:underline font-medium"
          >
            Batal Edit
          </button>
        )}
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Nama Barang</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Contoh: Laptop Asus ROG"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Kategori</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Contoh: Electronic"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase mb-1">SKU / Kode Barang</label>
          <input
            type="text"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            placeholder="Contoh: SKU-001"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Stok</label>
          <input
            type="text"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
            placeholder="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Harga Satuan (Rp)</label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            placeholder="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Supplier</label>
          <select
            value={supplierId}
            onChange={(e) => setSupplierId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">-- Pilih Supplier --</option>
            {suppliers.map((s) => (
              <option key={s.id || s._id} value={s.id || s._id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-3 flex justify-end gap-2 mt-2">
          {editingItem && typeof onCancelEdit === 'function' && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
          )}
          <button
            type="submit"
            className="px-5 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-md"
          >
            {editingItem ? 'Simpan Perubahan' : 'Tambah Barang'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default InventoryForm;