import React, { useState } from 'react';
import { AuthProvider, useAuth } from './features/auth/context/AuthContext';
import { LoginForm } from './features/auth/components/LoginForm';
import { InventoryProvider, useInventory } from './features/inventory/context/InventoryContext';
import { InventoryForm } from './features/inventory/components/InventoryForm';
import { InventoryTable } from './features/inventory/components/InventoryTable';
import { InventoryControls } from './features/inventory/components/InventoryControls';
import { InventoryDashboard } from './features/inventory/components/InventoryDashboard';
import { InventoryCharts } from './features/inventory/components/InventoryCharts';
import { InventoryStockOpname } from './features/inventory/components/InventoryStockOpname';

const MainDashboard = () => {
  const { user, logout } = useAuth();
  const { items, companyName, updateCompanyName } = useInventory();
  const [currentItem, setCurrentItem] = useState(null);
  
  const [activeMenu, setActiveMenu] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('Semua');

  const categories = [...new Set(items.map(item => item.category))];

  const handleEditCompanyName = () => {
    const newName = prompt("Masukkan nama perusahaan baru:", companyName);
    if (newName) {
      updateCompanyName(newName);
    }
  };

  const getPageTitle = () => {
    switch (activeMenu) {
      case 'overview': return `Ringkasan & Analitik - ${companyName}`;
      case 'management': return 'Manajemen Data Inventori';
      case 'opname': return 'Stock Opname Fisik';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="h-screen w-screen bg-slate-100 flex overflow-hidden font-sans text-slate-900">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col justify-between p-6 select-none">
        <div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3 overflow-hidden w-full">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-200 shrink-0">
                {companyName.substring(0, 1).toUpperCase()}
              </div>
              <div className="overflow-hidden flex-1">
                <h2 className="font-bold text-slate-900 text-sm tracking-tight truncate" title={companyName}>{companyName}</h2>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-xs text-emerald-600 font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                    System Online
                  </span>
                  <button 
                    onClick={handleEditCompanyName}
                    title="Ubah Nama Perusahaan"
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium underline transition-colors"
                  >
                    Ubah
                  </button>
                </div>
              </div>
            </div>
          </div>

          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveMenu('overview')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeMenu === 'overview'
                  ? 'bg-indigo-50 text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span>Overview & Analytics</span>
            </button>
            <button
              onClick={() => setActiveMenu('management')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeMenu === 'management'
                  ? 'bg-indigo-50 text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <span>Manajemen Barang</span>
            </button>
            <button
              onClick={() => setActiveMenu('opname')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeMenu === 'opname'
                  ? 'bg-indigo-50 text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <span>Stock Opname</span>
            </button>
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-200">
          <div className="flex items-center space-x-3 mb-3 px-1">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-xs shrink-0">
              {user?.username?.substring(0, 2).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-800 truncate">{user?.username}</p>
              <p className="text-[10px] text-slate-400">Administrator</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-600 py-2 rounded-xl text-xs font-semibold transition-colors"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Keluar Sesi</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center md:hidden shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              {companyName.substring(0, 1).toUpperCase()}
            </div>
            <span className="font-bold text-slate-900 truncate max-w-[150px]">{companyName}</span>
          </div>
          <button
            onClick={logout}
            className="text-xs bg-rose-50 text-rose-600 px-3 py-1.5 rounded-lg font-medium"
          >
            Logout
          </button>
        </header>

        <main className="flex-1 p-6 lg:p-10">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <h1 className="text-xl lg:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {getPageTitle()}
                </h1>
                <p className="text-slate-500 text-xs lg:text-sm mt-1">
                  Pantau aset perusahaan secara *real-time* dengan kontrol penuh inventori cloud.
                </p>
              </div>
              <div className="flex items-center space-x-2 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 self-start md:self-auto">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Cloud Storage Active</span>
              </div>
            </div>

            {activeMenu === 'overview' && (
              <div className="space-y-8">
                <InventoryDashboard />
                <InventoryCharts />
              </div>
            )}

            {activeMenu === 'management' && (
              <div className="space-y-6">
                <InventoryForm currentItem={currentItem} clearCurrentItem={() => setCurrentItem(null)} />
                <InventoryControls 
                  searchTerm={searchTerm} 
                  setSearchTerm={setSearchTerm}
                  category={category}
                  setCategory={setCategory}
                  categories={categories}
                />
                <InventoryTable 
                  onEdit={(item) => setCurrentItem(item)} 
                  searchTerm={searchTerm}
                  category={category}
                />
              </div>
            )}

            {activeMenu === 'opname' && (
              <InventoryStockOpname />
            )}
          </div>
        </main>
      </div>

    </div>
  );
};

const AppContent = () => {
  const { user } = useAuth();
  if (!user) {
    return <LoginForm />;
  }
  return (
    <InventoryProvider>
      <MainDashboard />
    </InventoryProvider>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}