import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';

export function InventorySuppliers() {
  const { suppliers = [], addSupplier, updateSupplier, deleteSupplier } = useInventory() || {};

  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Nama supplier tidak boleh kosong!');
      return;
    }

    if (editingId) {
      updateSupplier(editingId, { name, contact, email, address });
      setEditingId(null);
    } else {
      addSupplier({ name, contact, email, address });
    }

    setName('');
    setContact('');
    setEmail('');
    setAddress('');
  };

  const handleEdit = (supplier) => {
    setEditingId(supplier.id || supplier._id);
    setName(supplier.name || '');
    setContact(supplier.contact || '');
    setEmail(supplier.email || '');
    setAddress(supplier.address || '');
  };

  const handleDelete = (id) => {
    if (window.confirm('Yakin ingin menghapus supplier ini?')) {
      deleteSupplier(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold tracking-wide">Kelola Supplier & Mitra</h2>
        <p className="text-xs text-slate-300 mt-1">Tambah, ubah, dan pantau daftar supplier atau vendor perusahaan Anda.</p>
      </div>

      {/* Form Supplier */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {editingId ? 'Edit Data Supplier' : 'Tambah Supplier Baru'}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Nama Supplier / Mitra</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Contoh: PT Sumber Makmur"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">No. Telepon / Kontak</label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Contoh: 08123456789"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Contoh: info@supplier.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Alamat</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Contoh: Jl. Raya Industri No. 10"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="md:col-span-2 flex justify-end gap-2 mt-2">
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setName('');
                  setContact('');
                  setEmail('');
                  setAddress('');
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
              {editingId ? 'Simpan Perubahan' : 'Tambah Supplier'}
            </button>
          </div>
        </form>
      </div>

      {/* Tabel Supplier */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Daftar Supplier</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="py-3 px-6 font-medium">Nama Supplier</th>
                <th className="py-3 px-6 font-medium">Kontak</th>
                <th className="py-3 px-6 font-medium">Email</th>
                <th className="py-3 px-6 font-medium">Alamat</th>
                <th className="py-3 px-6 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {suppliers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-400">
                    Belum ada data supplier terdaftar.
                  </td>
                </tr>
              ) : (
                suppliers.map((sup) => {
                  const id = sup.id || sup._id;
                  return (
                    <tr key={id || Math.random()} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 font-medium text-gray-900">{sup.name}</td>
                      <td className="py-4 px-6 text-gray-600">{sup.contact || '-'}</td>
                      <td className="py-4 px-6 text-gray-600">{sup.email || '-'}</td>
                      <td className="py-4 px-6 text-gray-600">{sup.address || '-'}</td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(sup)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-xs px-2.5 py-1 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(id)}
                          className="text-red-600 hover:text-red-800 font-medium text-xs px-2.5 py-1 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default InventorySuppliers;