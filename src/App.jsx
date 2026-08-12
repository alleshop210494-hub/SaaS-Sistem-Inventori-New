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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const categories = [...new Set(items.map(item => item.category))];

  const handleEditCompanyName = () => {
    const newName = prompt("Masukkan nama perusahaan baru:", companyName);
    if (newName) {
      updateCompanyName(newName);
    }
  };

  const getPageTitle = () => {
    switch (activeMenu) {
      case 'overview': return 'Overview & Analytics';
      case 'management': return 'Manajemen Data Inventori';
      case 'opname': return 'Stock Opname Fisik';
      default: return 'Dashboard';
    }
  };

  const menuItems = [
    {
      id: 'overview',
      label: 'Overview & Analytics',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      )
    },
    {
      id: 'management',
      label: 'Manajemen Barang',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      )
    },
    {
      id: 'opname',
      label: 'Stock Opname',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      )
    }
  ];

  return (
    <div className="h-screen w-screen bg-slate-100 text-slate-900 flex overflow-hidden font-sans">
      
      {/* SIDEBAR */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-shrink-0 flex-col justify-between p-5 select-none shadow-xs">
        <div>
          <div className="flex items-center justify-between mb-8 px-2">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="w-7 h-7 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm">
                {companyName.substring(0, 1).toUpperCase()}
              </div>
              <span className="font-bold text-sm tracking-tight text-slate-900 truncate" title={companyName}>{companyName}</span>
            </div>
            <button 
              onClick={handleEditCompanyName}
              className="text-[11px] text-slate-500 hover:text-slate-900 font-medium transition-colors"
            >
              Edit
            </button>
          </div>

          <div className="px-2 mb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">Menu Utama</div>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  activeMenu === item.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span className={activeMenu === item.id ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between">
          <div className="flex items-center space-x-3 overflow-hidden">
            <UserButton afterSignOutUrl="/" />
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-900 truncate">{user?.fullName || 'Administrator'}</p>
              <p className="text-[10px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Connected
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* MOBILE DRAWER */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative w-72 bg-white h-full border-r border-slate-200 flex flex-col justify-between p-5 z-10 shadow-2xl">
            <div>
              <div className="flex items-center justify-between mb-8 px-2">
                <span className="font-bold text-sm text-slate-900">{companyName}</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-500">✕</button>
              </div>
              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setActiveMenu(item.id); setIsMobileMenuOpen(false); }}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                      activeMenu === item.id ? 'bg-slate-900 text-white' : 'text-slate-600'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center space-x-3">
              <UserButton afterSignOutUrl="/" />
              <p className="text-xs font-bold text-slate-900 truncate">{user?.fullName || 'Admin'}</p>
            </div>
          </div>
        </div>
      )}

      {/* MAIN LAYOUT */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto bg-slate-100">
        
        {/* MOBILE HEADER */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-5 py-3.5 flex justify-between items-center lg:hidden sticky top-0 z-30">
          <button onClick={() => setIsMobileMenuOpen(true)} className="text-slate-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <span className="font-bold text-xs text-slate-900">{companyName}</span>
          <UserButton afterSignOutUrl="/" />
        </header>

        <main className="flex-1 p-4 sm:p-8 lg:p-10">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* HERO BANNER */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xs">
              <div className="absolute right-0 top-0 w-64 h-64 bg-slate-100 rounded-full blur-3xl pointer-events-none"></div>
              <div>
                <span className="text-[10px] font-extrabold tracking-widest text-slate-400 uppercase">System Workspace</span>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">{getPageTitle()}</h1>
                <p className="text-xs text-slate-500 mt-0.5">Pantau dan kelola seluruh metrik inventori perusahaan secara real-time.</p>
              </div>
              <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1.5 rounded-full text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Database Synced</span>
              </div>
            </div>

            {/* CONTENT SWITCHER */}
            {activeMenu === 'overview' && (
              <div className="space-y-6">
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
              <div>
                <InventoryStockOpname />
              </div>
            )}

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
        <div className="h-screen w-screen flex items-center justify-center bg-slate-100 p-4">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center max-w-sm w-full space-y-6 shadow-xl">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl mx-auto flex items-center justify-center text-white font-bold text-xl shadow-md">
              I
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">CloudInventory Pro</h2>
              <p className="text-xs text-slate-500 mt-1">Autentikasi aman berbasis Clerk</p>
            </div>
            <div className="flex justify-center">
              <SignIn routing="hash" />
            </div>
          </div>
        </div>
      </SignedOut>
    </ClerkProvider>
  );
}