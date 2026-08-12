import React from 'react';
import { useInventory } from '../context/InventoryContext';

export const InventoryDashboard = () => {
  const { items } = useInventory();
  const totalBarang = items.length;
  const totalStok = items.reduce((acc, item) => acc + Number(item.stock), 0);
  const totalNilaiAset = items.reduce((acc, item) => acc + (Number(item.stock) * Number(item.price)), 0);
  const stokMenipis = items.filter(item => Number(item.stock) < 10).length;

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Jenis Barang</p>
          <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-bold">📦</span>
        </div>
        <p className="text-2xl font-bold text-slate-900 mt-4">{totalBarang}</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Unit Stok</p>
          <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-bold">📊</span>
        </div>
        <p className="text-2xl font-bold text-slate-900 mt-4">{totalStok}</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Nilai Aset</p>
          <span className="p-2 bg-violet-50 text-violet-600 rounded-xl text-sm font-bold">💰</span>
        </div>
        <p className="text-xl font-bold text-indigo-600 mt-4">{formatRupiah(totalNilaiAset)}</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-rose-500 uppercase tracking-wider">Stok Kritis (&lt; 10)</p>
          <span className="p-2 bg-rose-50 text-rose-600 rounded-xl text-sm font-bold">⚠️</span>
        </div>
        <p className={`text-2xl font-bold mt-4 ${stokMenipis > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
          {stokMenipis}
        </p>
      </div>
    </div>
  );
};