import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';

export function InventoryTransactions() {
  const { transactions = [], companyName = 'Perusahaan Saya' } = useInventory() || {};

  const exportToExcel = () => {
    if (transactions.length === 0) {
      alert('Tidak ada data riwayat transaksi untuk diexport.');
      return;
    }
    const dataToExport = transactions.map(tx => ({
      'Waktu': tx.time,
      'Jenis Aktivitas': tx.type,
      'Keterangan': tx.desc
    }));
    const keys = Object.keys(dataToExport[0]);
    const csvContent = [
      keys.join(','),
      ...dataToExport.map(row => keys.map(key => `"${String(row[key] || '').replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Laporan_Riwayat_Transaksi_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    if (transactions.length === 0) {
      alert('Tidak ada data riwayat transaksi untuk diexport ke PDF.');
      return;
    }
    const printWindow = window.open('', '_blank');
    const headers = ['No', 'Waktu Aktivitas', 'Jenis Aktivitas', 'Keterangan Mutasi / Perubahan'];
    const rows = transactions.map((tx, idx) => [
      idx + 1,
      tx.time,
      tx.type,
      tx.desc
    ]);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Laporan Riwayat Transaksi - ${companyName}</title>
        <style>
          body { font-family: Arial, sans-serif; color: #1e293b; margin: 30px; }
          .header { text-align: center; margin-bottom: 25px; border-bottom: 3px solid #0f172a; padding-bottom: 15px; }
          .header h1 { margin: 0; font-size: 20px; font-weight: bold; text-transform: uppercase; color: #0f172a; }
          .header p { margin: 5px 0 0; font-size: 11px; color: #475569; }
          .meta { margin-bottom: 20px; font-size: 12px; display: flex; justify-content: space-between; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 40px; font-size: 11px; }
          th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; }
          th { background-color: #0f172a; color: #ffffff; font-weight: bold; text-transform: uppercase; }
          tr:nth-child(even) { background-color: #f8fafc; }
          .footer { margin-top: 40px; display: flex; justify-content: space-between; font-size: 11px; }
          .sign-box { text-align: center; width: 180px; }
          .sign-space { height: 50px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${companyName}</h1>
          <p>Laporan Resmi Riwayat Transaksi & Mutasi Sistem Inventori</p>
        </div>
        <div class="meta">
          <div><strong>Total Aktivitas:</strong> ${transactions.length} Log</div>
          <div><strong>Tanggal Cetak:</strong> ${new Date().toLocaleString('id-ID')}</div>
        </div>
        <table>
          <thead>
            <tr>
              ${headers.map(h => `<th>${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${rows.map(row => `<tr>${row.map(cell => `<td>${cell !== undefined && cell !== null ? cell : '-'}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
        <div class="footer">
          <div class="sign-box">
            <p>Dibuat Oleh,</p>
            <div class="sign-space"></div>
            <p><strong>Admin Sistem</strong></p>
          </div>
          <div class="sign-box">
            <p>Disetujui Oleh,</p>
            <div class="sign-space"></div>
            <p><strong>Manajer Operasional</strong></p>
          </div>
        </div>
        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold tracking-wide">Riwayat Transaksi Real-Time</h2>
        <p className="text-xs text-slate-300 mt-1">Catatan aktivitas dan perubahan yang terjadi pada sistem inventori secara otomatis.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">
            Total: {transactions.length} Aktivitas
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={exportToExcel}
              className="px-3.5 py-2 rounded-lg text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
              style={{ backgroundColor: '#059669', color: '#ffffff' }}
            >
              Export Excel
            </button>
            <button
              type="button"
              onClick={exportToPDF}
              className="px-3.5 py-2 rounded-lg text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
              style={{ backgroundColor: '#e11d48', color: '#ffffff' }}
            >
              Export PDF
            </button>
          </div>
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
                  let badgeStyle = { backgroundColor: '#f3f4f6', color: '#1f2937' };
                  if (tx.type === 'TAMBAH') badgeStyle = { backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' };
                  else if (tx.type === 'UPDATE') badgeStyle = { backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' };
                  else if (tx.type === 'HAPUS') badgeStyle = { backgroundColor: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' };
                  else if (tx.type === 'SUPPLIER') badgeStyle = { backgroundColor: '#fffbeb', color: '#b45309', border: '1px solid #fde68a' };

                  return (
                    <tr key={tx.id || Math.random()} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 text-gray-500 whitespace-nowrap text-xs font-medium">{tx.time}</td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-semibold" style={badgeStyle}>
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