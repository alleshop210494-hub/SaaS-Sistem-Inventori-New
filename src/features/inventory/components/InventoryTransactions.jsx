import React from 'react';
import { useInventory } from '../context/InventoryContext';

export function InventoryTransactions() {
  const { transactions, loading } = useInventory();

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Log Aktivitas Sistem (Audit Trail)</h2>
        <p className="text-sm text-gray-500">Mencatat seluruh riwayat aktivitas, perubahan data, dan login secara otomatis.</p>
      </div>

      {loading ? (
        <p className="text-center py-4">Memuat riwayat aktivitas...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200 text-left text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 p-3">Waktu</th>
                <th className="border border-gray-200 p-3">Aksi</th>
                <th className="border border-gray-200 p-3">Keterangan Aktivitas</th>
                <th className="border border-gray-200 p-3">ID Produk</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center p-6 text-gray-500">Belum ada riwayat aktivitas yang tercatat.</td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50">
                    <td className="border border-gray-200 p-3 whitespace-nowrap">
                      {new Date(tx.created_at || Date.now()).toLocaleString('id-ID')}
                    </td>
                    <td className="border border-gray-200 p-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                        tx.type === 'LOGIN' ? 'bg-blue-100 text-blue-800' :
                        tx.type?.includes('TAMBAH') ? 'bg-green-100 text-green-800' :
                        tx.type?.includes('UPDATE') ? 'bg-yellow-100 text-yellow-800' :
                        tx.type?.includes('HAPUS') ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="border border-gray-200 p-3">{tx.notes || '-'}</td>
                    <td className="border border-gray-200 p-3">{tx.product_id || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default InventoryTransactions;