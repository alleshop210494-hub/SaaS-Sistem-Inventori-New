import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { exportToCSV, exportToPDF } from '../../../utils/exportUtils';

export const InventoryTable = ({ onEdit, searchTerm, category }) => {
  const { items, deleteItem, companyName } = useInventory();

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'Semua' || item.category === category;
    return matchesSearch && matchesCategory;
  });

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
      <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3 bg-slate-50/50">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Daftar Inventori Barang</h3>
          <p className="text-xs text-slate-500">Kelola dan pantau seluruh aset inventori perusahaan.</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => exportToCSV(filteredItems, 'laporan-inventori.csv')}
            className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3.5 py-1.5 text-xs font-semibold rounded-xl hover:bg-emerald-100 transition-colors"
          >
            Export CSV
          </button>
          <button
            onClick={() => exportToPDF(filteredItems, companyName, 'laporan-inventori.pdf')}
            className="bg-rose-50 text-rose-700 border border-rose-200 px-3.5 py-1.5 text-xs font-semibold rounded-xl hover:bg-rose-100 transition-colors"
          >
            Export PDF
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50/80">
            <tr>
              <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Barang</th>
              <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Kategori</th>
              <th className="px-6 py-3.5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Stok</th>
              <th className="px-6 py-3.5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Harga Satuan</th>
              <th className="px-6 py-3.5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Total Nilai</th>
              <th className="px-6 py-3.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-10 text-center text-slate-400 text-xs">Tidak ada data ditemukan.</td>
              </tr>
            ) : (
              filteredItems.map((item) => {
                const totalHarga = Number(item.stock) * Number(item.price);
                return (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">{item.name}</td>
                    <td className="px-6 py-4 text-xs text-slate-600">
                      <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg font-medium">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-semibold text-slate-800">{item.stock}</td>
                    <td className="px-6 py-4 text-sm text-right font-medium text-slate-600">{formatRupiah(item.price)}</td>
                    <td className="px-6 py-4 text-sm text-right font-bold text-indigo-600">{formatRupiah(totalHarga)}</td>
                    <td className="px-6 py-4 text-center text-xs space-x-3">
                      <button onClick={() => onEdit(item)} className="text-indigo-600 hover:text-indigo-900 font-semibold">Edit</button>
                      <button onClick={() => deleteItem(item.id)} className="text-rose-600 hover:text-rose-900 font-semibold">Hapus</button>
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
};