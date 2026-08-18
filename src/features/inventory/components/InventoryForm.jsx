import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { useUser } from '@clerk/clerk-react';

export const InventoryForm = ({ onClose }) => {
  const { addItem } = useInventory();
  const { user } = useUser();
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    sku: '',
    stock: '',
    price: '',
    image_url: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Ambil data email dan ID dari Clerk secara langsung di sini
      const userEmail = 
        user?.primaryEmailAddress?.emailAddress || 
        user?.emailAddresses?.[0]?.emailAddress || 
        user?.username || 
        'Authenticated User';
        
      const userId = user?.id || 'Anonymous ID';

      // Gabungkan data form dengan data user Clerk
      const completeData = {
        ...formData,
        stock: Number(formData.stock) || 0,
        price: Number(formData.price) || 0,
        user_id: userId,
        added_by: userEmail
      };

      await addItem(completeData);
      
      if (onClose) onClose();
    } catch (error) {
      console.error('Gagal menyimpan barang:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Tambah Barang Baru</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nama Barang</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Kategori</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">SKU</label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Stok</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Harga (Rp)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">URL Gambar (Opsional)</label>
          <input
            type="text"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
            >
              Batal
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : 'Simpan Barang'}
          </button>
        </div>
      </form>
    </div>
  );
};