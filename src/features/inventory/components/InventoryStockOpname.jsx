import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';

export function InventoryStockOpname() {
  const { items = [], companyName = 'Perusahaan Saya' } = useInventory() || {};
  const [opnameData, setOpnameData] = useState(() => 
    items.map(item => ({
      id: item.id || item._id,
      name: item.name,
      sku: item.sku,
      systemStock: item.stock,
      actualStock: item.stock,
      notes: 'Sesuai'
    }))
  );

  const handleActualChange = (id, val) => {
    setOpnameData(prev => prev.map(item => {
      if (item.id === id) {
        const actual = Number(val) || 0;
        const diff = actual - item.systemStock;
        let notes = 'Sesuai';
        if (diff > 0) notes = `Lebih ${diff}`;
        if (diff < 0) notes = `Selisih ${diff}`;
        return { ...item, actualStock: actual, notes };
      }
      return item;
    }));
  };

  const exportToExcel = () => {
    if (opnameData.length === 0) {
      alert('Tidak ada data stock opname untuk diexport.');
      return;
    }
    const dataToExport = opnameData.map(o => ({
      'Nama Barang': o.name,
      'SKU': o.sku,
      'Stok Sistem': o.systemStock,
      'Stok Fisik': o.actualStock,
      'Keterangan / Selisih': o.notes
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
    link.setAttribute('download', `Laporan_Stock_Opname_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    if (opnameData.length === 0) {
      alert('Tidak ada data stock opname untuk diexport ke PDF.');
      return;
    }
    const printWindow = window.open('', '_blank');
    const headers = ['No', 'Nama Barang', 'SKU / Kode', 'Stok Sistem', 'Stok Fisik', 'Keterangan / Selisih'];
    const rows = opnameData.map((o, idx) => [
      idx + 1,
      o.name,
      o.sku,
      o.systemStock,
      o.actualStock,
      o.notes
    ]);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Laporan Stock Opname - ${companyName}</title>
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
          <p>Laporan Resmi Stock Opname & Audit Fisik Inventori</p>
        </div>
        <div class="meta">
          <div><strong>Total Item Audited:</strong> ${opnameData.length} Barang</div>
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
            <p>Tim Audit,</p>
            <div class="sign-space"></div>
            <p><strong>Petugas Opname</strong></p>
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
        <h2 className="text-xl font-bold tracking-wide">Stock Opname & Audit Fisik</h2>
        <p className="text-xs text-slate-300 mt-1">Cocokkan stok sistem dengan stok fisik di lapangan secara berkala.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <h3 className="text-lg font-semibold text-gray-800">Formulir Pengecekan Stok</h3>
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
                <th className="py-3 px-6 font-medium">Nama Barang</th>
                <th className="py-3 px-6 font-medium">SKU</th>
                <th className="py-3 px-6 font-medium">Stok Sistem</th>
                <th className="py-3 px-6 font-medium">Stok Fisik (Input)</th>
                <th className="py-3 px-6 font-medium">Keterangan / Selisih</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {opnameData.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-400">
                    Belum ada data barang untuk stock opname.
                  </td>
                </tr>
              ) : (
                opnameData.map((op) => (
                  <tr key={op.id || Math.random()} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium text-gray-900">{op.name}</td>
                    <td className="py-4 px-6 text-gray-500 font-mono text-xs">{op.sku}</td>
                    <td className="py-4 px-6 font-semibold text-gray-800">{op.systemStock}</td>
                    <td className="py-4 px-6">
                      <input
                        type="number"
                        value={op.actualStock}
                        onChange={(e) => handleActualChange(op.id, e.target.value)}
                        className="w-24 px-2.5 py-1.5 border border-gray-300 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-semibold" style={{
                        backgroundColor: op.notes === 'Sesuai' ? '#ecfdf5' : '#fffbeb',
                        color: op.notes === 'Sesuai' ? '#047857' : '#b45309',
                        border: op.notes === 'Sesuai' ? '1px solid #a7f3d0' : '1px solid #fde68a'
                      }}>
                        {op.notes}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default InventoryStockOpname;