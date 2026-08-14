import React from 'react';
import { useInventory } from '../context/InventoryContext';

export function InventoryControls() {
  const { items = [] } = useInventory() || {};

  const totalItemsCount = items.reduce((acc, curr) => acc + Number(curr.stock || 0), 0);
  const totalInventoryValue = items.reduce((acc, curr) => acc + (Number(curr.stock || 0) * Number(curr.price || 0)), 0);
  const lowStockItems = items.filter(item => Number(item.stock || 0) <= 5).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Jenis Barang</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{items.length} <span className="text-xs font-normal text-gray-600">Item</span></h3>
        </div>
        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl font-bold">
          📦
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Stok Fisik</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{totalItemsCount} <span className="text-xs font-normal text-gray-600">Pcs</span></h3>
        </div>
        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl font-bold">
          📊
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nilai Inventori</p>
          <h3 className="text-lg font-bold text-gray-900 mt-1">Rp {totalInventoryValue.toLocaleString('id-ID')}</h3>
        </div>
        <div className="p-3 bg-amber-50 text-amber-600 rounded-xl font-bold">
          💰
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Stok Menipis (≤5)</p>
          <h3 className="text-2xl font-bold text-rose-600 mt-1">{lowStockItems} <span className="text-xs font-normal text-gray-600">Item</span></h3>
        </div>
        <div className="p-3 bg-rose-50 text-rose-600 rounded-xl font-bold">
          ⚠️
        </div>
      </div>
    </div>
  );
}

export default InventoryControls;