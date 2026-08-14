import React from 'react';
import { useInventory } from '../context/InventoryContext';

export function InventoryTable({ onEdit }) {
  const { items = [], deleteItem, loading } = useInventory() || {};

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Memuat data inventori...</div>;
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800">Daftar Inventori Barang</h3>
        <p className="text-xs text-gray-400 mt-0.5">Kelola dan pantau seluruh aset inventori perusahaan.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
              <th className="py-3 px-6 font-medium">Nama Barang</th>
              <th className="py-3 px-6 font-medium">Kategori</th>
              <th className="py-3 px-6 font-medium">SKU / Kode</th>
              <th className="py-3 px-6 font-medium">Stok</th>
              <th className="py-3 px-6 font-medium">Harga Satuan</th>
              <th className="py-3 px-6 font-medium">Total Nilai</th>
              <th className="py-3 px-6 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
            {items.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-8 text-center text-gray-400">
                  Belum ada data barang tersedia.
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const id = item?.id || item?._id;
                const name = String(item?.name || '-');
                const category = String(item?.category || '-');
                const sku = String(item?.sku || '-');
                const stock = Number(item?.stock) || 0;
                const price = Number(item?.price) || 0;
                const totalValue = stock * price;

                return (
                  <tr key={id || Math.random()} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium text-gray-900">{name}</td>
                    <td className="py-4 px-6 text-gray-600">{category}</td>
                    <td className="py-4 px-6 text-gray-500 font-mono text-xs">{sku}</td>
                    <td className="py-4 px-6 text-gray-600">{stock} unit</td>
                    <td className="py-4 px-6 text-gray-600">Rp {price.toLocaleString('id-ID')}</td>
                    <td className="py-4 px-6 font-semibold text-gray-900">Rp {totalValue.toLocaleString('id-ID')}</td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => onEdit && onEdit(item)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-xs px-2.5 py-1 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Yakin ingin menghapus ${name}?`)) {
                            deleteItem(id);
                          }
                        }}
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
  );
}

export default InventoryTable;