import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';

export function InventoryTable({ onEdit }) {
  const { 
    items = [], 
    suppliers = [], 
    companyName = 'Perusahaan Saya', 
    deleteItem, 
    customColumns = [], 
    updateCustomColumns 
  } = useInventory() || {};

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [newColLabel, setNewColLabel] = useState('');

  // Kolom bawaan (default) mencakup SKU, Kategori, Stok, Harga Satuan, dan Harga Total
  const defaultColumns = [
    { key: 'sku', label: 'SKU', visible: true },
    { key: 'category', label: 'Kategori', visible: true },
    { key: 'stock', label: 'Stok', visible: true },
    { key: 'price', label: 'Harga Satuan', visible: true },
    { key: 'total_harga', label: 'Harga Total', visible: true }
  ];

  const activeColumns = customColumns && customColumns.length > 0 ? customColumns : defaultColumns;
  const visibleColumns = activeColumns.filter(c => c.visible);

  const filteredItems = items.filter((item) => {
    const matchesSearch = 
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['ALL', ...new Set(items.map((i) => i.category).filter(Boolean))];

  // Helper untuk mencocokkan supplier_id dengan nama supplier atau membaca teks langsung
  const getSupplierName = (item) => {
    if (item.supplier) return item.supplier;
    if (item.supplierName) return item.supplierName;
    if (item.vendor) return item.vendor;
    if (item.supplier_name) return item.supplier_name;

    if (item.supplier_id && suppliers.length > 0) {
      const matched = suppliers.find(s => String(s.id || s._id) === String(item.supplier_id));
      if (matched) return matched.name;
    }

    return '-';
  };

  // Helper untuk mengambil nilai sel, termasuk kalkulasi otomatis Total Harga
  const getItemValue = (item, key) => {
    if (key === 'total_harga' || key === 'total') {
      const total = (Number(item.stock || item.quantity) || 0) * (Number(item.price || item.unit_price) || 0);
      return `Rp ${Number(total).toLocaleString('id-ID')}`;
    }

    if (key === 'price') {
      const priceVal = Number(item.price || item.unit_price || 0);
      return `Rp ${priceVal.toLocaleString('id-ID')}`;
    }

    if (key === 'stock') {
      return item.stock !== undefined && item.stock !== null ? item.stock : (item.quantity !== undefined ? item.quantity : 0);
    }

    if (['name', 'category', 'sku'].includes(key)) {
      return item[key] !== undefined && item[key] !== null ? item[key] : '-';
    }
    
    const customVal = item.custom_fields?.[key] ?? item[key];
    return customVal !== undefined && customVal !== null && customVal !== '' ? customVal : '-';
  };

  const toggleColumnVisibility = (key) => {
    const targetColumns = customColumns && customColumns.length > 0 ? customColumns : defaultColumns;
    const updated = targetColumns.map(col => col.key === key ? { ...col, visible: !col.visible } : col);
    if (updateCustomColumns) {
      updateCustomColumns(updated);
    }
  };

  const addCustomColumn = (e) => {
    e.preventDefault();
    if (!newColLabel.trim()) return;
    const key = newColLabel.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    const targetColumns = customColumns && customColumns.length > 0 ? customColumns : defaultColumns;
    
    if (targetColumns.some(c => c.key === key)) {
      alert('Kolom dengan nama tersebut sudah ada.');
      return;
    }
    const updated = [...targetColumns, { key, label: newColLabel.trim(), visible: true }];
    if (updateCustomColumns) {
      updateCustomColumns(updated);
    }
    setNewColLabel('');
  };

  const removeCustomColumn = (key) => {
    const targetColumns = customColumns && customColumns.length > 0 ? customColumns : defaultColumns;
    const updated = targetColumns.filter(c => c.key !== key);
    if (updateCustomColumns) {
      updateCustomColumns(updated);
    }
  };

  const exportToExcel = () => {
    if (filteredItems.length === 0) {
      alert('Tidak ada data untuk diexport.');
      return;
    }
    const dataToExport = filteredItems.map(item => {
      const rowData = { 'Nama Barang': item.name };
      visibleColumns.forEach(col => {
        let val = item[col.key];
        if (col.key === 'price') {
          val = Number(item.price || item.unit_price || 0);
        } else if (col.key === 'total_harga' || col.key === 'total') {
          val = (Number(item.stock || item.quantity) || 0) * (Number(item.price || item.unit_price) || 0);
        } else if (col.key === 'stock') {
          val = Number(item.stock || item.quantity || 0);
        } else if (!['category', 'sku'].includes(col.key)) {
          val = item.custom_fields?.[col.key] || item[col.key] || '-';
        }
        rowData[col.label] = val;
      });
      rowData['Supplier'] = getSupplierName(item);
      return rowData;
    });

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
    const headers = ['No', 'Nama Barang', ...visibleColumns.map(c => c.label), 'Supplier'];
    const rows = filteredItems.map((item, idx) => [
      idx + 1,
      item.name,
      ...visibleColumns.map(c => {
        if (c.key === 'price') return Number(item.price || item.unit_price || 0).toLocaleString('id-ID');
        if (c.key === 'total_harga' || c.key === 'total') {
          const tot = (Number(item.stock || item.quantity) || 0) * (Number(item.price || item.unit_price) || 0);
          return tot.toLocaleString('id-ID');
        }
        return getItemValue(item, c.key);
      }),
      getSupplierName(item)
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
          window.onload = function() { window.print(); }
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
        <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
          <button
            type="button"
            onClick={() => setShowColumnModal(true)}
            className="px-3.5 py-2 rounded-lg text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5 bg-slate-800 text-white hover:bg-slate-900"
          >
            ⚙️ Atur Kolom
          </button>
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

      {/* Modal Pengaturan Kolom Kustom */}
      {showColumnModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100">
            <h4 className="text-lg font-bold text-gray-800 mb-2">Pengaturan Kolom Kustom</h4>
            <p className="text-xs text-gray-500 mb-4">
              Atur kolom yang ingin ditampilkan (termasuk Stok, Harga Satuan, dan Harga Total).
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto mb-4 pr-1">
              {activeColumns.map((col) => (
                <div key={col.key} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                  <label className="flex items-center gap-2.5 text-sm font-medium text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={col.visible}
                      onChange={() => toggleColumnVisibility(col.key)}
                      className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900"
                    />
                    {col.label}
                  </label>
                  {!['sku', 'category', 'stock', 'price', 'total_harga'].includes(col.key) && (
                    <button
                      type="button"
                      onClick={() => removeCustomColumn(col.key)}
                      className="text-xs text-red-500 hover:text-red-700 font-semibold px-2 py-1"
                    >
                      Hapus
                    </button>
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={addCustomColumn} className="flex gap-2 mb-6">
              <input
                type="text"
                placeholder="Nama kolom baru..."
                value={newColLabel}
                onChange={(e) => setNewColLabel(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Tambah
              </button>
            </form>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowColumnModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors"
              >
                Selesai & Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
              <th className="py-3 px-6 font-medium">Nama Barang</th>
              {visibleColumns.map((col) => (
                <th key={col.key} className="py-3 px-6 font-medium">{col.label}</th>
              ))}
              <th className="py-3 px-6 font-medium">Supplier</th>
              <th className="py-3 px-6 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={visibleColumns.length + 3} className="py-8 text-center text-gray-400">
                  Tidak ada data barang ditemukan.
                </td>
              </tr>
            ) : (
              filteredItems.main || filteredItems.map((item) => {
                const id = item.id || item._id;
                return (
                  <tr key={id || Math.random()} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium text-gray-900">{item.name}</td>
                    {visibleColumns.map((col) => (
                      <td key={col.key} className={`py-4 px-6 text-gray-600 ${col.key === 'sku' ? 'font-mono text-xs' : col.key === 'stock' ? 'font-semibold text-gray-800' : col.key === 'total_harga' ? 'font-semibold text-gray-900' : ''}`}>
                        {getItemValue(item, col.key)}
                      </td>
                    ))}
                    <td className="py-4 px-6 text-gray-600">{getSupplierName(item)}</td>
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