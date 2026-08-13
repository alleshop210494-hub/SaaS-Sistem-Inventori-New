import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { exportToCSV, exportToPDF } from '../../../utils/exportUtils';

export const InventoryTable = ({ onEdit, searchTerm, category }) => {
  const { items, deleteItem } = useInventory();

  // Filter data berdasarkan pencarian dan kategori
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes((searchTerm || '').toLowerCase());
    const matchesCategory = category === 'Semua' || !category || item.category === category;
    return matchesSearch && matchesCategory;
  });

  // Format khusus untuk Export Excel/CSV (Tanpa kolom "Ditambahkan Oleh")
  const handleExportExcel = () => {
    if (filteredItems.length === 0) {
      alert('Tidak ada data barang untuk diexport.');
      return;
    }
    const dataToExport = filteredItems.map((item, index) => ({
      No: index + 1,
      'Nama Barang': item.name,
      Kategori: item.category,
      Stok: `${item.stock} unit`,
      'Harga Satuan': `Rp ${Number(item.price).toLocaleString('id-ID')}`,
      'Total Nilai': `Rp ${Number(item.stock * item.price).toLocaleString('id-ID')}`
    }));
    exportToCSV(dataToExport, 'daftar-inventori-barang.csv');
  };

  // Format untuk Export PDF (Tanpa kolom "Ditambahkan Oleh")
  const handleExportPDF = () => {
    if (filteredItems.length === 0) {
      alert('Tidak ada data barang untuk diexport.');
      return;
    }
    const dataToExport = filteredItems.map((item, index) => ({
      No: index + 1,
      'Nama Barang': item.name,
      Kategori: item.category,
      Stok: `${item.stock} unit`,
      'Harga Satuan': `Rp ${Number(item.price).toLocaleString('id-ID')}`,
      'Total Nilai': `Rp ${Number(item.stock * item.price).toLocaleString('id-ID')}`
    }));
    const columns = [
      { header: 'No', dataKey: 'No' },
      { header: 'Nama Barang', dataKey: 'Nama Barang' },
      { header: 'Kategori', dataKey: 'Kategori' },
      { header: 'Stok', dataKey: 'Stok' },
      { header: 'Harga Satuan', dataKey: 'Harga Satuan' },
      { header: 'Total Nilai', dataKey: 'Total Nilai' }
    ];
    exportToPDF(dataToExport, columns, 'Laporan Daftar Inventori Barang', 'daftar-inventori-barang.pdf');
  };

  return (
    <div className="bg-white rounded-3xl border border-orange-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-orange-50 bg-[#FAF6EE]/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xs font-bold text-orange-950 uppercase tracking-wider">Daftar Inventori Barang</h3>
          <p className="text-[11px] text-orange-600/70 mt-0.5">Kelola dan pantau seluruh aset inventori perusahaan.</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportExcel}
            className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition-colors shadow-xs"
          >
            Export Excel / CSV
          </button>
          <button
            onClick={handleExportPDF}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors shadow-xs"
          >
            Export PDF
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-orange-100 text-[11px] font-bold text-orange-950 uppercase tracking-wider bg-orange-50/30">
              <th className="p-4">Nama Barang</th>
              <th className="p-4">Kategori</th>
              <th className="p-4">Stok</th>
              <th className="p-4">Harga Satuan</th>
              <th className="p-4">Total Nilai</th>
              <th className="p-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-orange-50 text-xs">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-12 text-center text-orange-400">Tidak ada data barang yang ditemukan.</td>
              </tr>
            ) : (
              filteredItems.map(item => (
                <tr key={item.id} className="hover:bg-orange-50/40 transition-colors">
                  <td className="p-4 font-bold text-orange-950">{item.name}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 bg-orange-100/60 text-orange-800 rounded-lg text-[10px] font-bold">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-orange-900">{item.stock} unit</td>
                  <td className="p-4 text-orange-900">Rp {Number(item.price).toLocaleString('id-ID')}</td>
                  <td className="p-4 font-extrabold text-orange-950">Rp {Number(item.stock * item.price).toLocaleString('id-ID')}</td>
                  <td className="p-4 text-right space-x-2">
                    <button 
                      onClick={() => onEdit(item)} 
                      className="text-blue-600 hover:text-blue-800 font-bold transition-colors"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => {
                        if (confirm(`Yakin ingin menghapus ${item.name}?`)) {
                          deleteItem(item.id);
                        }
                      }} 
                      className="text-rose-600 hover:text-rose-800 font-bold transition-colors"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};