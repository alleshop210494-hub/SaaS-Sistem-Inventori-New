import React, { useState, useEffect } from 'react';
import { useInventory } from '../context/InventoryContext';
import { useUser } from '@clerk/clerk-react';

export function InventoryForm({ editingItem, initialData, onCancelEdit, onClose, onSubmit, onSave }) {
  const inventory = useInventory() || {};
  const addItem = inventory.addItem;
  const updateItem = inventory.updateItem;
  const suppliers = inventory.suppliers || [];

  const { user } = useUser();
  const activeEditing = editingItem || initialData;

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [sku, setSku] = useState('');
  const [stock, setStock] = useState('');
  const [price, setPrice] = useState('');
  const [supplierId, setSupplierId] = useState('');

  useEffect(() => {
    if (activeEditing) {
      setName(activeEditing.name || '');
      setCategory(activeEditing.category || '');
      setSku(activeEditing.sku || '');
      setStock(activeEditing.stock !== undefined ? activeEditing.stock : '');
      setPrice(activeEditing.price !== undefined ? activeEditing.price : '');
      setSupplierId(activeEditing.supplier_id || '');
    } else {
      setName('');
      setCategory('');
      setSku('');
      setStock('');
      setPrice('');
      setSupplierId('');
    }
  }, [activeEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Nama barang tidak boleh kosong!');
      return;
    }

    const cleanPriceString = typeof price === 'string' ? price.replace(/\./g, '').replace(',', '.') : price;
    const parsedPrice = Number(cleanPriceString);
    const parsedStock = Number(stock);

    // Ambil email user login secara konsisten (Clerk -> LocalStorage -> Fallback Email Anda)
    let userEmail = 'alleshop210494@gmail.com';
    let userId = 'user-alleshop';

    if (user) {
      const clerkEmail = 
        user?.primaryEmailAddress?.emailAddress || 
        user?.emailAddresses?.[0]?.emailAddress || 
        user?.username;
      if (clerkEmail) userEmail = clerkEmail;
      if (user?.id) userId = user.id;
    }

    try {
      const localUser = localStorage.getItem('user') || localStorage.getItem('currentUser') || localStorage.getItem('auth_user');
      if (localUser) {
        try {
          const parsed = JSON.parse(localUser);
          if (parsed.email) userEmail = parsed.email;
          if (parsed.id || parsed.userId) userId = parsed.id || parsed.userId;
        } catch (err) {
          if (localUser.includes('@')) userEmail = localUser;
        }
      }
      const savedEmail = localStorage.getItem('email') || localStorage.getItem('userEmail');
      if (savedEmail && savedEmail.includes('@')) {
        userEmail = savedEmail;
      }
    } catch (err) {
      console.error('Error reading localStorage:', err);
    }

    const itemData = {
      name,
      category,
      sku,
      stock: isNaN(parsedStock) ? 0 : parsedStock,
      price: isNaN(parsedPrice) ? 0 : parsedPrice,
      supplier_id: supplierId ? Number(supplierId) : null,
      user_id: userId,
      added_by: userEmail,
    };

    const submitFunc = onSubmit || onSave;

    try {
      if (typeof submitFunc === 'function') {
        const finalPayload = activeEditing 
          ? { ...activeEditing, ...itemData, user_id: activeEditing.user_id || userId, added_by: userEmail } 
          : itemData;
        await submitFunc(finalPayload);
      } else if (activeEditing) {
        const itemId = activeEditing.id || activeEditing._id;
        if (itemId && typeof updateItem === 'function') {
          await updateItem(itemId, itemData);
        }
      } else {
        if (typeof addItem === 'function') {
          await addItem(itemData);
        }
      }

      if (typeof onCancelEdit === 'function') onCancelEdit();
      if (typeof onClose === 'function') onClose();

      if (!activeEditing) {
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
          {activeEditing ? 'Edit Barang Inventori' : 'Tambah Barang Baru'}
        </h3>
        {(onCancelEdit || onClose) && (
          <button
            type="button"
            onClick={() => {
              if (onCancelEdit) onCancelEdit();
              if (onClose) onClose();
            }}
            className="text-xs text-red-600 hover:underline font-medium"
          >
            Batal
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
          {(onCancelEdit || onClose) && (
            <button
              type="button"
              onClick={() => {
                if (onCancelEdit) onCancelEdit();
                if (onClose) onClose();
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
          )}
          <button
            type="submit"
            className="px-5 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-md"
          >
            {activeEditing ? 'Simpan Perubahan' : 'Tambah Barang'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default InventoryForm;