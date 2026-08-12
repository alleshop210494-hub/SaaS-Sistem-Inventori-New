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
    setSuccessMsg(`Berhasil memperbarui stok untuk ${updatedCount} barang berdasarkan hasil Stock Opname.`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="bg-white shadow-xs rounded-2xl overflow-hidden border border-slate-200 p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-800">Formulir Stock Opname Fisik</h3>
          <p className="text-xs text-slate-500 mt-0.5">Masukkan jumlah stok fisik yang dihitung di lapangan untuk melakukan penyesuaian sistem.</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => exportStockOpnameToPDF(items, counts, companyName, 'laporan-stock-opname.pdf')}
            className="bg-rose-600 text-white px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-rose-700 transition-colors shadow-sm shadow-rose-100 flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Export PDF</span>
          </button>
          <button
            onClick={handleApplyOpname}
            className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-100 flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Simpan & Sinkronisasi Stok</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl">
          {successMsg}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Barang</th>
              <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Kategori</th>
              <th className="px-6 py-3.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Stok Sistem</th>
              <th className="px-6 py-3.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Stok Fisik (Hitung)</th>
              <th className="px-6 py-3.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Selisih</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {items.map((item) => {
              const physicalVal = counts[item.id] !== undefined ? counts[item.id] : item.stock;
              const diff = Number(physicalVal) - Number(item.stock);
              return (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    <span className="px-2.5 py-1 inline-flex text-xs font-semibold rounded-full bg-indigo-50 text-indigo-700">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-slate-600">{item.stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <input
                      type="number"
                      value={counts[item.id] !== undefined ? counts[item.id] : item.stock}
                      onChange={(e) => handleCountChange(item.id, e.target.value)}
                      className="w-24 text-center px-3 py-1.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold text-slate-900 bg-slate-50"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-bold">
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
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};