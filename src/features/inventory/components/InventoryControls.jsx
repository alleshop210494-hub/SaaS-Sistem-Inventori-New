import React from 'react';

export const InventoryControls = ({ searchTerm, setSearchTerm, category, setCategory, categories }) => {
  return (
    <div className="bg-white p-4 border border-slate-200 rounded-md flex flex-col md:flex-row gap-3">
      <div className="flex-1">
        <input
          type="text"
          placeholder="Cari barang berdasarkan nama..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-slate-900 outline-none text-xs text-slate-900 bg-white"
        />
      </div>
      <div className="w-full md:w-56">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-slate-900 outline-none text-xs text-slate-900 bg-white font-medium"
        >
          <option value="Semua">Semua Kategori</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
    </div>
  );
};