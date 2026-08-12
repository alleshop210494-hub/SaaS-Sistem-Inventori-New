import React from 'react';
import { useInventory } from '../context/InventoryContext';

export const InventoryDashboard = () => {
  const { items } = useInventory();
  const totalBarang = items.length;
  const totalStok = items.reduce((acc, item) => acc + Number(item.stock), 0);
  const totalNilaiAset = items.reduce(
    (acc, item) => acc + Number(item.stock) * Number(item.price),
    0
  );
  const stokMenipis = items.filter((item) => Number(item.stock) < 10).length;

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(number);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Total Jenis Barang
        </h4>
        <p className="text-3xl font-extrabold text-slate-900 mt-2">
          {totalBarang}
        </p>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Total Unit Stok
        </h4>
        <p className="text-3xl font-extrabold text-slate-900 mt-2">
          {totalStok}
        </p>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Total Nilai Aset
        </h4>
        <p className="text-2xl lg:text-3xl font-extrabold text-indigo-600 mt-2 truncate">
          {formatRupiah(totalNilaiAset)}
        </p>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <h4 className="text-xs font-semibold text-rose-500 uppercase tracking-wider">
          Stok Menipis (&lt; 10)
        </h4>
        <p
          className={`text-3xl font-extrabold mt-2 ${
            stokMenipis > 0 ? 'text-rose-600' : 'text-slate-900'
          }`}
        >
          {stokMenipis}
        </p>
      </div>
    </div>
  );
};
