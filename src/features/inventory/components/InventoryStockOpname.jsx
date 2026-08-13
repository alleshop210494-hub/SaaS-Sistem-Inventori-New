import React, { useState, useEffect } from 'react';
import { useInventory } from '../context/InventoryContext';
import { exportToCSV, exportToPDF } from '../../../utils/exportUtils';

export const InventoryStockOpname = () => {
  const { items, submitStockOpname } = useInventory();
  const [opnameData, setOpnameData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const initial = {};
    items.forEach(item => {
      initial[item.id] = item.stock;
    });
    setOpnameData(initial);
  }, [items]);

  const handleStockChange = (id, value) => {
    setOpnameData(prev => ({
      ...prev,
      [id]: value === '' ? '' : parseInt(value, 10)
    }));
  };

  const handleSubmitOpname = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');

    try {
      const results = items.map(item => ({
        id: item.id,
        name: item.name,
        physicalStock: opnameData[item.id] !== undefined ? Number(opnameData[item.id]) : item.stock
      }));

      await submitStockOpname(results);
      setSuccessMessage('Stock Opname berhasil disimpan dan otomatis tercatat di Tab Riwayat Transaksi!');
    } catch (error) {
      console.error("Error saving stock opname:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format data untuk keperluan export (Excel/CSV & PDF)
  const getFormattedDataForExport = () => {
    return items.map((item, index) => {
      const physical = opnameData[item.id] !== undefined ? opnameData[item.id] : item.stock;
      const diff = physical - item.stock;
      return {
        No: index + 1,
        'Nama Barang': item.name,
        Kategori: item.category,
        'Stok Sistem': item.stock,
        'Stok Fisik': physical,
        Selisih: diff > 0 ? `+${diff}` : diff
      };
    });
  };

  const handleExportExcel = () => {
    if (items.length === 0) {
      alert('Tidak ada data stock opname untuk diexport.');
      return;
    }
    const dataToExport = getFormattedDataForExport();
    exportToCSV(dataToExport, 'stock-opname-inventori.csv');
  };

  const handleExportPDF = () => {
    if (items.length === 0) {
      alert('Tidak ada data stock opname untuk diexport.');
      return;
    }
    const dataToExport = getFormattedDataForExport();
    const columns = [
      { header: 'No', dataKey: 'No' },
      { header: 'Nama Barang', dataKey: 'Nama Barang' },
      { header: 'Kategori', dataKey: 'Kategori' },
      { header: 'Stok Sistem', dataKey: 'Stok Sistem' },
      { header: 'Stok Fisik', dataKey: 'Stok Fisik' },
      { header: 'Selisih', dataKey: 'Selisih' }
    ];
    exportToPDF(dataToExport, columns, 'Laporan Stock Opname Inventori', 'stock-opname-inventori.pdf');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header & Export Controls */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-orange-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] font-extrabold tracking-widest text-orange-400 uppercase">Verifikasi Fisik</span>
          <h2 className="text-xl font-bold text-orange-950 mt-1">Stock Opname Inventori</h2>
          <p className="text-xs text-orange-600/70 mt-0.5">Sesuaikan jumlah stok fisik aktual di gudang dengan data sistem secara real-time.</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={handleExportExcel}
            className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition-colors flex items-center space-x-2 shadow-xs"
          >
            <span>Export Excel / CSV</span>
          </button>
          <button
            type="button"
            onClick={handleExportPDF}
            className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors flex items-center space-x-2 shadow-xs"
          >
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold animate-in fade-in">
          {successMessage}
        </div>
      )}

      <div className="bg-white rounded-3xl border border-orange-100 shadow-sm overflow-hidden">
        <form onSubmit={handleSubmitOpname}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF6EE]/60 border-b border-orange-100 text-[11px] font-bold text-orange-950 uppercase tracking-wider">
                  <th className="p-4">Nama Barang</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Stok Sistem</th>
                  <th className="p-4">Stok Fisik Aktual</th>
                  <th className="p-4">Selisih</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-50 text-xs">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-orange-400">Belum ada data barang inventori.</td>
                  </tr>
                ) : (
                  items.map(item => {
                    const physical = opnameData[item.id] !== undefined ? opnameData[item.id] : item.stock;
                    const diff = physical - item.stock;
                    return (
                      <tr key={item.id} className="hover:bg-orange-50/40 transition-colors">
                        <td className="p-4 font-bold text-orange-950">{item.name}</td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 bg-orange-100/60 text-orange-800 rounded-lg text-[10px] font-bold">
                            {item.category}
                          </span>
                        </td>
                        <td className="p-4 font-semibold text-orange-900">{item.stock} unit</td>
                        <td className="p-4">
                          <input 
                            type="number" 
                            min="0"
                            value={physical}
                            onChange={(e) => handleStockChange(item.id, e.target.value)}
                            className="w-28 px-3 py-1.5 bg-orange-50/50 border border-orange-200 rounded-xl text-orange-950 font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required
                          />
                        </td>
                        <td className="p-4 font-bold">
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] ${
                            diff === 0 ? 'bg-gray-100 text-gray-700' :
                            diff > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {diff > 0 ? `+${diff}` : diff}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {items.length > 0 && (
            <div className="p-6 bg-[#FAF6EE]/40 border-t border-orange-100 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Menyimpan & Mencatat...' : 'Simpan & Catat Stock Opname'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};