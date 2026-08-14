import React, { useState } from 'react';
import { useUser, UserButton } from '@clerk/clerk-react';
import { InventoryTable } from '../features/inventory/components/InventoryTable';
import { InventoryForm } from '../features/inventory/components/InventoryForm';
import { InventorySuppliers } from '../features/inventory/components/InventorySuppliers';
import { InventoryTransactions } from '../features/inventory/components/InventoryTransactions';
import { InventoryStockOpname } from '../features/inventory/components/InventoryStockOpname';
import { InventoryCharts } from '../features/inventory/components/InventoryCharts';

export function MainDashboard() {
  const { user } = useUser() || {};
  const [activeTab, setActiveTab] = useState('inventory');
  const [editingItem, setEditingItem] = useState(null);

  // Pengaman ketat untuk mencegah error substring pada data yang belum termuat
  const firstName = String(user?.firstName || user?.fullName || user?.username || 'User');
  const initial = firstName.length > 0 ? firstName.substring(0, 1).toUpperCase() : 'U';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            {initial}
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-800">Perusahaan Saya</h1>
            <p className="text-xs text-gray-400">Halo, {firstName}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-xs bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full font-medium border border-emerald-100 flex items-center gap-1.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Database Synced
          </span>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200 px-6 flex space-x-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'inventory' ? 'border-slate-900 text-slate-900' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Manajemen Barang
        </button>
        <button
          onClick={() => setActiveTab('suppliers')}
          className={`py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'suppliers' ? 'border-slate-900 text-slate-900' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Supplier / Mitra
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'transactions' ? 'border-slate-900 text-slate-900' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Riwayat Transaksi
        </button>
        <button
          onClick={() => setActiveTab('opname')}
          className={`py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'opname' ? 'border-slate-900 text-slate-900' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Stock Opname
        </button>
        <button
          onClick={() => setActiveTab('charts')}
          className={`py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'charts' ? 'border-slate-900 text-slate-900' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Overview & Analytics
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-lg">
              <h2 className="text-xl font-bold tracking-wide">Manajemen Data Inventori</h2>
              <p className="text-xs text-slate-300 mt-1">Pantau dan kelola seluruh metrik inventori perusahaan secara real-time dengan standar modern.</p>
            </div>
            <InventoryForm editingItem={editingItem} onCancelEdit={() => setEditingItem(null)} />
            <InventoryTable onEdit={(item) => setEditingItem(item)} />
          </div>
        )}

        {activeTab === 'suppliers' && <InventorySuppliers />}
        {activeTab === 'transactions' && <InventoryTransactions />}
        {activeTab === 'opname' && <InventoryStockOpname />}
        {activeTab === 'charts' && <InventoryCharts />}
      </main>
    </div>
  );
}

export default MainDashboard;