import React from 'react';

export function Header({ activeTab }) {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center shadow-xs shrink-0">
      <h2 className="text-lg font-bold text-gray-800 capitalize">
        {activeTab === 'inventory' && 'Manajemen Barang'}
        {activeTab === 'suppliers' && 'Supplier & Mitra'}
        {activeTab === 'transactions' && 'Riwayat Transaksi'}
        {activeTab === 'opname' && 'Stock Opname'}
        {activeTab === 'charts' && 'Overview & Analytics'}
      </h2>
      <div className="text-xs text-gray-400 font-medium">System Workspace 2026</div>
    </header>
  );
}

export default Header;