import React, { useState } from 'react';
import { ClerkProvider, SignedIn, SignedOut, SignIn, UserButton, useUser } from '@clerk/clerk-react';
import { InventoryProvider, useInventory } from './features/inventory/context/InventoryContext';
import { InventoryForm } from './features/inventory/components/InventoryForm';
import { InventoryTable } from './features/inventory/components/InventoryTable';
import { InventoryControls } from './features/inventory/components/InventoryControls';
import { InventoryDashboard } from './features/inventory/components/InventoryDashboard';
import { InventoryCharts } from './features/inventory/components/InventoryCharts';
import { InventoryStockOpname } from './features/inventory/components/InventoryStockOpname';

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const MainDashboard = () => {
  const { user } = useUser();
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
                  <button onClick={handleEditCompanyName} className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium underline">Ubah</button>
                </div>
              </div>
            </div>
          </div>

          <nav className="space-y-1.5">
            <button onClick={() => setActiveMenu('overview')} className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium ${activeMenu === 'overview' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600'}`}>
              <span>Overview & Analytics</span>
            </button>
            <button onClick={() => setActiveMenu('management')} className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium ${activeMenu === 'management' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600'}`}>
              <span>Manajemen Barang</span>
            </button>
            <button onClick={() => setActiveMenu('opname')} className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium ${activeMenu === 'opname' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600'}`}>
              <span>Stock Opname</span>
            </button>
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
             <UserButton afterSignOutUrl="/" />
             <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-800 truncate">{user?.fullName || 'User'}</p>
              <p className="text-[10px] text-slate-400">Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        <main className="flex-1 p-6 lg:p-10">
          <div className="max-w-6xl mx-auto space-y-8">
             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
                <h1 className="text-xl font-extrabold text-slate-900">{getPageTitle()}</h1>
             </div>
            {activeMenu === 'overview' && <div className="space-y-8"><InventoryDashboard /><InventoryCharts /></div>}
            {activeMenu === 'management' && <div className="space-y-6"><InventoryForm currentItem={currentItem} clearCurrentItem={() => setCurrentItem(null)} /><InventoryControls searchTerm={searchTerm} setSearchTerm={setSearchTerm} category={category} setCategory={setCategory} categories={categories} /><InventoryTable onEdit={(item) => setCurrentItem(item)} searchTerm={searchTerm} category={category} /></div>}
            {activeMenu === 'opname' && <InventoryStockOpname />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <SignedIn>
        <InventoryProvider>
          <MainDashboard />
        </InventoryProvider>
      </SignedIn>
      <SignedOut>
        <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
          <SignIn />
        </div>
      </SignedOut>
    </ClerkProvider>
  );
}