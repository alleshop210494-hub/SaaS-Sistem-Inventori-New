import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../features/auth/context/AuthContext';
import { useInventory } from '../features/inventory/context/InventoryContext';
import { InventoryTable } from '../features/inventory/components/InventoryTable';
import { InventoryForm } from '../features/inventory/components/InventoryForm';
import { InventorySuppliers } from '../features/inventory/components/InventorySuppliers';
import { InventoryTransactions } from '../features/inventory/components/InventoryTransactions';
import { InventoryStockOpname } from '../features/inventory/components/InventoryStockOpname';
import { InventoryCharts } from '../features/inventory/components/InventoryCharts';

export function MainDashboard() {
  const { user, logout } = useAuth() || {};
  const { companyName, setCompanyName } = useInventory() || {};
  const [activeTab, setActiveTab] = useState('inventory');
  const [editingItem, setEditingItem] = useState(null);
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(companyName || 'PT Antariksa');
  const inputRef = useRef(null);

  const firstName = String(user?.name || user?.email || 'User');
  const initial = firstName.length > 0 ? firstName.substring(0, 1).toUpperCase() : 'U';

  const handleSaveName = () => {
    if (setCompanyName) {
      setCompanyName(tempName);
    }
    setIsEditingName(false);
  };

  useEffect(() => {
    if (isEditingName && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditingName]);

  useEffect(() => {
    if (companyName) {
      setTempName(companyName);
    }
  }, [companyName]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-50 flex">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0 shrink-0">
        <div className="p-6 border-b border-gray-100 flex items-center space-x-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            {initial}
          </div>
          <div className="overflow-hidden w-full">
            {isEditingName ? (
              <input
                ref={inputRef}
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onBlur={handleSaveName}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                className="w-full text-sm font-bold text-gray-800 bg-gray-50 border border-slate-300 rounded px-1 outline-none focus:border-slate-900"
              />
            ) : (
              <h1 
                onClick={() => { setIsEditingName(true); setTempName(companyName || 'PT Antariksa'); }}
                className="text-sm font-bold text-gray-800 truncate cursor-pointer hover:text-slate-600 transition-colors"
                title="Klik untuk mengubah nama"
              >
                {companyName || 'PT Antariksa'}
              </h1>
            )}
            <p className="text-xs text-gray-400 truncate">{firstName}</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${
              activeTab === 'inventory' ? 'bg-slate-900 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Manajemen Barang
          </button>
          <button
            onClick={() => setActiveTab('suppliers')}
            className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${
              activeTab === 'suppliers' ? 'bg-slate-900 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Supplier / Mitra
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${
              activeTab === 'transactions' ? 'bg-slate-900 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Riwayat Transaksi
          </button>
          <button
            onClick={() => setActiveTab('opname')}
            className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${
              activeTab === 'opname' ? 'bg-slate-900 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Stock Opname
          </button>
          <button
            onClick={() => setActiveTab('charts')}
            className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${
              activeTab === 'charts' ? 'bg-slate-900 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Overview & Analytics
          </button>
        </nav>

        <div className="p-4 border-t border-gray-100 flex items-center justify-between shrink-0 bg-white">
          <span className="text-xs bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full font-medium border border-emerald-100 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Synced
          </span>
          <button
            type="button"
            onClick={logout}
            className="text-xs text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer"
          >
            Keluar
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
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

        <main className="flex-1 p-8 max-w-7xl w-full mx-auto">
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
    </div>
  );
}

export default MainDashboard;