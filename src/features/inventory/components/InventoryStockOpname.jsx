import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { exportStockOpnameToPDF } from '../../../utils/exportUtils';

export const InventoryStockOpname = () => {
  const { items, updateItem, companyName } = useInventory();
  const [counts, setCounts] = useState({});
  const [successMsg, setSuccessMsg] = useState('');

  const handleCountChange = (id, value) => {
    setCounts(prev => ({ ...prev, [id]: value }));
  };

  const handleApplyOpname = () => {
    let updatedCount = 0;
    Object.keys(counts).forEach(id => {
      const numericId = Number(id);
      const physicalStock = Number(counts[id]);
      if (!isNaN(physicalStock)) {
        const item = items.find(i => i.id === numericId);
        if (item && item.stock !== physicalStock) {
          updateItem(numericId, { stock: physicalStock });
          updatedCount++;
        }
      }
    });
    setSuccessMsg(`Berhasil menyinkronkan stok untuk ${updatedCount} barang.`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Formulir Stock Opname Fisik</h3>
          <p className="text-xs text-slate-500">Sesuaikan jumlah stok sistem berdasarkan perhitungan fisik di lapangan.</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => exportStockOpnameToPDF(items, counts, companyName, 'laporan-stock-opname.pdf')}
            className="bg-rose-50 text-rose-700 border border-rose-200 px-3.5 py-1.5 text-xs font-semibold rounded-xl hover:bg-rose-100 transition-colors"
          >
            Export PDF
          </button>
          <button
            onClick={handleApplyOpname}
            className="bg-indigo-600 text-white px-4 py-1.5 text-xs font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-xs"
          >
            Sinkronisasi Stok
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-medium">
          {successMsg}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50/80">
            <tr>
              <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Barang</th>
              <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Kategori</th>
              <th className="px-6 py-3.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Stok Sistem</th>
              <th className="px-6 py-3.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Stok Fisik (Hitung)</th>
              <th className="px-6 py-3.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Selisih</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {items.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-10 text-center text-slate-400 text-xs">Tidak ada data ditemukan.</td>
              </tr>
            ) : (
              items.map((item) => {
                const physicalVal = counts[item.id] !== undefined ? counts[item.id] : item.stock;
                const diff = Number(physicalVal) - Number(item.stock);
                return (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">{item.name}</td>
                    <td className="px-6 py-4 text-xs text-slate-600">
                      <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg font-medium">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-center font-semibold text-slate-700">{item.stock}</td>
                    <td className="px-6 py-4 text-center">
                      <input
                        type="number"
                        value={physicalVal}
                        onChange={(e) => handleCountChange(item.id, e.target.value)}
                        className="w-24 text-center px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50/50 text-slate-900"
                      />
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-bold">
                      {diff === 0 ? (
                        <span className="text-slate-400">0</span>
                      ) : diff > 0 ? (
                        <span className="text-emerald-600">+{diff}</span>
                      ) : (
                        <span className="text-rose-600">{diff}</span>
                      )}
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