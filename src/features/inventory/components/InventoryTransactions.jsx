import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { exportToCSV, exportToPDF } from '../../../utils/exportUtils';

export const InventoryTransactions = () => {
  const { transactions = [] } = useInventory();

  // Format data aktivitas terakhir untuk keperluan export dengan waktu real-time yang akurat
  const getFormattedDataForExport = () => {
    return transactions.map((tx, index) => {
      let formattedTime = 'Baru saja';
      if (tx.created_at) {
        const dateObj = new Date(tx.created_at);
        // Format waktu real-time yang bersih dan standar untuk Excel (DD/MM/YYYY HH:MM:SS)
        formattedTime = dateObj.toLocaleString('id-ID', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }).replace(/\./g, ':');
      }

      return {
        No: index + 1,
        Tipe: tx.type,
        Deskripsi: tx.description,
        Oleh: tx.added_by || 'Administrator',
        Waktu: formattedTime
      };
    });
  };

  const handleExportExcel = () => {
    if (transactions.length === 0) {
      alert('Tidak ada riwayat aktivitas untuk diexport.');
      return;
    }
    const dataToExport = getFormattedDataForExport();
    exportToCSV(dataToExport, 'riwayat-aktivitas-inventori.csv');
  };

  const handleExportPDF = () => {
    if (transactions.length === 0) {
      alert('Tidak ada riwayat aktivitas untuk diexport.');
      return;
    }
    const dataToExport = getFormattedDataForExport();
    const columns = [
      { header: 'No', dataKey: 'No' },
      { header: 'Tipe', dataKey: 'Tipe' },
      { header: 'Deskripsi', dataKey: 'Deskripsi' },
      { header: 'Oleh', dataKey: 'Oleh' },
      { header: 'Waktu', dataKey: 'Waktu' }
    ];
    exportToPDF(dataToExport, columns, 'Laporan Riwayat Aktivitas Inventori', 'riwayat-aktivitas-inventori.pdf');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Info */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-orange-100 shadow-sm">
        <span className="text-[10px] font-extrabold tracking-widest text-orange-400 uppercase">Audit Log</span>
        <h2 className="text-xl font-bold text-orange-950 mt-1">Riwayat Transaksi</h2>
        <p className="text-xs text-orange-600/70 mt-0.5">Catatan aktivitas dan riwayat perubahan data inventori secara real-time.</p>
      </div>

      {/* Transaction List Card dengan Tombol Export di Header */}
      <div className="bg-white rounded-3xl border border-orange-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-orange-50 bg-[#FAF6EE]/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-xs font-bold text-orange-950 uppercase tracking-wider">Daftar Aktivitas Terakhir</h3>
            <span className="text-[11px] text-orange-500 font-semibold mt-0.5 block">Total: {transactions.length} Aktivitas</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleExportExcel}
              className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition-colors flex items-center space-x-2 shadow-xs"
            >
              <span>Export Excel / CSV</span>
            </button>
            <button
              onClick={handleExportPDF}
              className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors flex items-center space-x-2 shadow-xs"
            >
              <span>Export PDF</span>
            </button>
          </div>
        </div>
        
        <div className="divide-y divide-orange-50">
          {(!transactions || transactions.length === 0) ? (
            <div className="p-12 text-center text-orange-400 text-xs">Belum ada riwayat transaksi tercatat atau tabel transaksi belum disiapkan di database.</div>
          ) : (
            transactions.map((tx) => (
              <div key={tx.id || Math.random()} className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 hover:bg-orange-50/40 transition-colors">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 bg-orange-100 text-orange-800 rounded-lg text-[10px] font-bold uppercase tracking-wide">
                      {tx.type}
                    </span>
                    <span className="text-[11px] text-orange-400">
                      {tx.created_at ? new Date(tx.created_at).toLocaleString('id-ID') : 'Baru saja'}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-orange-950 mt-1.5">{tx.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-orange-600/70 font-medium">Oleh: </span>
                  <span className="text-[11px] font-bold text-orange-950">{tx.added_by || 'Administrator'}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};