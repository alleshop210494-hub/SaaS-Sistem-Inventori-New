import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { exportToExcel } from '../../../utils/exportUtils';

export default function InventoryControls() {
  const { items, companyName } = useInventory();

  const handleExport = () => {
    exportToExcel(items, 'Laporan_Inventori.xls', companyName);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm">
      <div>
        <h2 className="text-lg font-bold text-gray-800">Daftar Inventori Barang</h2>
        <p className="text-sm text-gray-500">Kelola dan pantau stok barang perusahaan Anda.</p>
      </div>
      <div>
        <button
          onClick={handleExport}
          className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg shadow transition flex items-center gap-2"
        >
          Export Excel
        </button>
      </div>
    </div>
  );
}