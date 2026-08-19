import React, { useState, useEffect } from 'react';
import { useInventory } from '../context/InventoryContext';

export function InventoryTable({ onEdit }) {
  const { items = [], deleteItem, categories = [] } = useInventory() || {};
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // State untuk Custom Kolom Bawaan yang bisa disembunyikan
  const [columnVisibility, setColumnVisibility] = useState(() => {
    const saved = localStorage.getItem('inventory_column_visibility');
    return saved ? JSON.parse(saved) : {
      sku: true,
      category: true,
      stock: true,
      price: true,
      supplier: true,
      minStock: true,
      actions: true
    };
  });

  // State untuk Kolom Dinamis / Tambahan Baru (Fitur Add New Column)
  const [customColumns, setCustomColumns] = useState(() => {
    const saved = localStorage.getItem('inventory_dynamic_custom_columns');
    return saved ? JSON.parse(saved) : [];
  });

  const [newColumnName, setNewColumnName] = useState('');
  const [showColumnModal, setShowColumnModal] = useState(false);

  useEffect(() => {
    localStorage.setItem('inventory_column_visibility', JSON.stringify(columnVisibility));
  }, [columnVisibility]);

  useEffect(() => {
    localStorage.setItem('inventory_dynamic_custom_columns', JSON.stringify(customColumns));
  }, [customColumns]);

  const handleToggleColumn = (colKey) => {
    setColumnVisibility(prev => ({
      ...prev,
      [colKey]: !prev[colKey]
    }));
  };

  const handleAddCustomColumn = (e) => {
    e.preventDefault();
    const trimmedName = newColumnName.trim();
    if (!trimmedName) return;

    if (customColumns.includes(trimmedName)) {
      alert('Nama kolom sudah ada!');
      return;
    }

    setCustomColumns(prev => [...prev, trimmedName]);
    setNewColumnName('');
  };

  const handleDeleteCustomColumn = (colToRemove) => {
    if (window.confirm(`Hapus kolom "${colToRemove}"? Data pada kolom ini untuk semua barang akan diabaikan.`)) {
      setCustomColumns(prev => prev.filter(col => col !== colToRemove));
    }
  };

  // Fungsi Export Data ke Excel (CSV format yang kompatibel dengan Excel termasuk kolom Supplier)
  const handleExportExcel = () => {
    let headers = ['No', 'Nama Barang', 'SKU / Kode', 'Kategori', 'Stok', 'Harga Satuan', 'Supplier', 'Stok Minimum'];
    customColumns.forEach(col => headers.push(col));

    let rows = filteredItems.map((item, index) => {
      let row = [
        index + 1,
        `"${(item.name || '').replace(/"/g, '""')}"`,
        `"${(item.sku || '').replace(/"/g, '""')}"`,
        `"${(item.category || '').replace(/"/g, '""')}"`,
        item.stock || 0,
        item.price || 0,
        `"${(item.supplier || '').replace(/"/g, '""')}"`,
        item.minStock || 0
      ];
      customColumns.forEach(col => {
        row.push(`"${(item.customFields?.[col] || '').replace(/"/g, '""')}"`);
      });
      return row.join(',');
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "data_inventori_supplier.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter items berdasarkan search dan category
  const filteredItems = items.filter(item => {
    const matchesSearch = (item.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.sku || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          <input
            type="text"
            placeholder="Cari nama barang atau SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 w-full sm:w-64"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
          >
            <option value="">Semua Kategori</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Tombol Export & Pengaturan Kolom */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportExcel}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            📊 Export Excel
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowColumnModal(!showColumnModal)}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              ⚙️ Atur & Tambah Kolom
            </button>

            {/* Modal / Dropdown Pengaturan & Tambah Kolom */}
            {showColumnModal && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-gray-200 shadow-xl p-4 z-50 space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-xs font-bold text-gray-900">Pengaturan Kolom Tabel</span>
                  <button
                    type="button"
                    onClick={() => setShowColumnModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-xs font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Form Tambah Kolom Baru */}
                <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-800">➕ Tambah Kolom Baru (Custom)</span>
                  <form onSubmit={handleAddCustomColumn} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Cth: Warna, Garansi, Lokasi Rak"
                      value={newColumnName}
                      onChange={(e) => setNewColumnName(e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs flex-1 focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      Tambah
                    </button>
                  </form>
                </div>

                {/* Daftar Kolom Custom yang Sudah Dibuat */}
                {customColumns.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-gray-700">Kolom Kustom Aktif:</span>
                    <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                      {customColumns.map((col, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-gray-50 px-2.5 py-1.5 rounded-lg text-xs">
                          <span className="text-gray-700 font-medium truncate max-w-[160px]">{col}</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteCustomColumn(col)}
                            className="text-rose-600 hover:text-rose-800 text-[10px] font-bold cursor-pointer"
                          >
                            Hapus
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tampilkan / Sembunyikan Kolom Bawaan */}
                <div className="space-y-2 border-t pt-2">
                  <span className="text-[11px] font-bold text-gray-700">Tampilkan / Sembunyikan Kolom Bawaan:</span>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={columnVisibility.sku}
                        onChange={() => handleToggleColumn('sku')}
                        className="rounded border-gray-300 text-slate-900 focus:ring-slate-900"
                      />
                      SKU / Kode Barang
                    </label>
                    <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={columnVisibility.category}
                        onChange={() => handleToggleColumn('category')}
                        className="rounded border-gray-300 text-slate-900 focus:ring-slate-900"
                      />
                      Kategori
                    </label>
                    <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={columnVisibility.stock}
                        onChange={() => handleToggleColumn('stock')}
                        className="rounded border-gray-300 text-slate-900 focus:ring-slate-900"
                      />
                      Stok Barang
                    </label>
                    <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={columnVisibility.price}
                        onChange={() => handleToggleColumn('price')}
                        className="rounded border-gray-300 text-slate-900 focus:ring-slate-900"
                      />
                      Harga Satuan
                    </label>
                    <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={columnVisibility.supplier}
                        onChange={() => handleToggleColumn('supplier')}
                        className="rounded border-gray-300 text-slate-900 focus:ring-slate-900"
                      />
                      Supplier / Vendor
                    </label>
                    <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={columnVisibility.minStock}
                        onChange={() => handleToggleColumn('minStock')}
                        className="rounded border-gray-300 text-slate-900 focus:ring-slate-900"
                      />
                      Stok Minimum
                    </label>
                    <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={columnVisibility.actions}
                        onChange={() => handleToggleColumn('actions')}
                        className="rounded border-gray-300 text-slate-900 focus:ring-slate-900"
                      />
                      Aksi (Edit / Hapus)
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabel Data */}
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-900 text-white">
              <th className="p-3 font-semibold text-center w-12">No</th>
              <th className="p-3 font-semibold">Nama Barang</th>
              {columnVisibility.sku && <th className="p-3 font-semibold">SKU / Kode</th>}
              {columnVisibility.category && <th className="p-3 font-semibold">Kategori</th>}
              {columnVisibility.stock && <th className="p-3 font-semibold text-right">Stok</th>}
              {columnVisibility.price && <th className="p-3 font-semibold text-right">Harga Satuan</th>}
              {columnVisibility.supplier && <th className="p-3 font-semibold">Supplier</th>}
              {columnVisibility.minStock && <th className="p-3 font-semibold text-center">Stok Min</th>}
              
              {/* Render Kolom Dinamis Tambahan di Header */}
              {customColumns.map((col, idx) => (
                <th key={idx} className="p-3 font-semibold text-amber-300 bg-slate-800">{col}</th>
              ))}

              {columnVisibility.actions && <th className="p-3 font-semibold text-center">Aksi</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={9 + customColumns.length} className="text-center py-8 text-gray-400">
                  Tidak ada data barang ditemukan.
                </td>
              </tr>
            ) : (
              filteredItems.map((item, index) => {
                const customFields = item.customFields || {};
                return (
                  <tr key={item.id || index} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 text-center text-gray-500 font-medium">{index + 1}</td>
                    <td className="p-3 font-medium text-gray-900">{item.name || '-'}</td>
                    {columnVisibility.sku && <td className="p-3 text-gray-600">{item.sku || '-'}</td>}
                    {columnVisibility.category && (
                      <td className="p-3">
                        <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md font-medium text-[10px]">
                          {item.category || '-'}
                        </span>
                      </td>
                    )}
                    {columnVisibility.stock && (
                      <td className="p-3 text-right font-semibold text-gray-900">
                        {Number(item.stock || 0)}
                      </td>
                    )}
                    {columnVisibility.price && (
                      <td className="p-3 text-right text-gray-900">
                        Rp {Number(item.price || 0).toLocaleString('id-ID')}
                      </td>
                    )}
                    {columnVisibility.supplier && <td className="p-3 text-gray-600">{item.supplier || '-'}</td>}
                    {columnVisibility.minStock && (
                      <td className="p-3 text-center text-gray-600">{item.minStock || 0}</td>
                    )}

                    {/* Render Nilai Kolom Dinamis */}
                    {customColumns.map((col, idx) => (
                      <td key={idx} className="p-3 text-gray-700 font-medium">
                        {customFields[col] || '-'}
                      </td>
                    ))}

                    {columnVisibility.actions && (
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => onEdit && onEdit(item)}
                            className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg font-medium hover:bg-amber-100 transition-colors cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Yakin ingin menghapus ${item.name}?`)) {
                                deleteItem(item.id);
                              }
                            }}
                            className="px-2.5 py-1 bg-rose-50 text-rose-700 rounded-lg font-medium hover:bg-rose-100 transition-colors cursor-pointer"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    )}
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