import React from 'react';
import { useInventory } from '../context/InventoryContext';

export function InventoryTransactions() {
  const { transactions = [] } = useInventory() || {};

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold tracking-wide">Riwayat Transaksi Real-Time</h2>
        <p className="text-xs text-slate-300 mt-1">Catatan aktivitas dan perubahan yang terjadi pada sistem inventori secara otomatis.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Log Aktivitas & Mutasi</h3>
          <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">
            Total: {transactions.length} Aktivitas
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="py-3 px-6 font-medium">Waktu</th>
                <th className="py-3 px-6 font-medium">Jenis Aktivitas</th>
                <th className="py-3 px-6 font-medium">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="3" className="py-8 text-center text-gray-400">
                    Belum ada riwayat transaksi tercatat.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => {
                  let badgeColor = 'bg-gray-100 text-gray-800';
                  if (tx.type === 'TAMBAH') badgeColor = 'bg-emerald-50 text-emerald-700 border border-emerald-200';
                  else if (tx.type === 'UPDATE') badgeColor = 'bg-blue-50 text-blue-700 border border-blue-200';
                  else if (tx.type === 'HAPUS') badgeColor = 'bg-rose-50 text-rose-700 border border-rose-200';
                  else if (tx.type === 'SUPPLIER') badgeColor = 'bg-amber-50 text-amber-700 border border-amber-200';

                  return (
                    <tr key={tx.id || Math.random()} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 text-gray-500 whitespace-nowrap text-xs font-medium">{tx.time}</td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${badgeColor}`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-800 font-medium">{tx.desc}</td>
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

export default InventoryTransactions;