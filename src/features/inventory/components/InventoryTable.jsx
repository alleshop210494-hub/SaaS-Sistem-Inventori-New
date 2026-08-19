import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';

export function InventoryTable({ onEdit }) {
  const { items = [], companyName = 'Perusahaan Saya', deleteItem } = useInventory() || {};
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const filteredItems = items.filter((item) => {
    const matchesSearch = 
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['ALL', ...new Set(items.map((i) => i.category).filter(Boolean))];

  const exportToExcel = () => {
    if (filteredItems.length === 0) {
      alert('Tidak ada data untuk diexport.');
      return;
    }
    const dataToExport = filteredItems.map(item => ({
      'Nama Barang': item.name,
      'Kategori': item.category,
      'SKU / Kode': item.sku,
      'Stok': item.stock,
      'Harga Satuan (Rp)': item.price,
      'Supplier': item.supplier || '-'
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
    link.setAttribute('download', `Laporan_Inventori_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    if (filteredItems.length === 0) {
      alert('Tidak ada data untuk diexport ke PDF.');
      return;
    }
    const printWindow = window.open('', '_blank');
    const headers = ['No', 'Nama Barang', 'Kategori', 'SKU / Kode', 'Stok', 'Harga Satuan (Rp)', 'Supplier'];
    const rows = filteredItems.map((item, idx) => [
      idx + 1,
      item.name,
      item.category,
      item.sku,
      item.stock,
      Number(item.price || 0).toLocaleString('id-ID'),
      item.supplier || '-'
    ]);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Laporan Manajemen Barang - ${companyName}</title>
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
          <p>Laporan Resmi Manajemen Barang & Inventori Perusahaan</p>
        </div>
        <div class="meta">
          <div><strong>Kategori Filter:</strong> ${selectedCategory}</div>
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
            <p><strong>Admin Gudang</strong></p>
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
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-3">
          <h3 className="text-lg font-semibold text-gray-800 whitespace-nowrap">Daftar Barang</h3>
          <input
            type="text"
            placeholder="Cari nama barang / SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'ALL' ? 'Semua Kategori' : cat}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
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
              <th className="py-3 px-6 font-medium">Kategori</th>
              <th className="py-3 px-6 font-medium">SKU / Kode</th>
              <th className="py-3 px-6 font-medium">Stok</th>
              <th className="py-3 px-6 font-medium">Harga Satuan</th>
              <th className="py-3 px-6 font-medium">Supplier</th>
              <th className="py-3 px-6 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-8 text-center text-gray-400">
                  Tidak ada data barang ditemukan.
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => {
                const id = item.id || item._id;
                return (
                  <tr key={id || Math.random()} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium text-gray-900">{item.name}</td>
                    <td className="py-4 px-6 text-gray-600">{item.category}</td>
                    <td className="py-4 px-6 text-gray-500 font-mono text-xs">{item.sku}</td>
                    <td className="py-4 px-6 font-semibold text-gray-800">{item.stock}</td>
                    <td className="py-4 px-6 text-gray-600">Rp {Number(item.price || 0).toLocaleString('id-ID')}</td>
                    <td className="py-4 px-6 text-gray-600">{item.supplier || '-'}</td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => onEdit(item)}
                        className="font-medium text-xs px-2.5 py-1 rounded-lg transition-colors"
                        style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteItem(id)}
                        className="font-medium text-xs px-2.5 py-1 rounded-lg transition-colors"
                        style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}
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