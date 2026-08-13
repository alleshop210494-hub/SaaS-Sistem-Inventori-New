import React from 'react';
import { useInventory } from '../context/InventoryContext';

export const InventoryTransactions = () => {
  const { transactions } = useInventory();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-sm">
        <h2 className="text-xl font-bold text-orange-950">Riwayat Transaksi</h2>
        <p className="text-sm text-orange-600/70 mt-1">Catatan aktivitas dan riwayat perubahan data inventori secara real-time.</p>
      </div>

      <div className="bg-white rounded-3xl border border-orange-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-orange-50 bg-[#FAF6EE]/50">
          <h3 className="text-sm font-bold text-orange-950">Daftar Aktivitas Terakhir</h3>
        </div>
        
        <div className="divide-y divide-orange-50">
          {transactions.length === 0 ? (
            <div className="p-8 text-center text-orange-400 text-xs">Belum ada riwayat transaksi tercatat. Pastikan tabel `transactions` sudah dibuat di database Anda.</div>
          ) : (
            transactions.map((tx) => (
              <div key={tx.id || Math.random()} className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 hover:bg-orange-50/40 transition-colors">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 bg-orange-100 text-orange-800 rounded-lg text-[10px] font-bold uppercase">
                      {tx.type}
                    </span>
                    <span className="text-xs text-orange-400">
                      {tx.created_at ? new Date(tx.created_at).toLocaleString('id-ID') : 'Baru saja'}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-orange-950 mt-1.5">{tx.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-orange-600/70 font-medium">Oleh: </span>
                  <span className="text-xs font-bold text-orange-950">{tx.added_by || 'Administrator'}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};