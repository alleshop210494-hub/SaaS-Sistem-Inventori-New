import React, { useState } from 'react';
import { UserButton, useUser } from '@clerk/clerk-react';
import { useInventory } from '../features/inventory/context/InventoryContext';
import { InventoryForm } from '../features/inventory/components/InventoryForm';
import { InventoryTable } from '../features/inventory/components/InventoryTable';
import { InventoryControls } from '../features/inventory/components/InventoryControls';
import { InventoryDashboard } from '../features/inventory/components/InventoryDashboard';
import { InventoryCharts } from '../features/inventory/components/InventoryCharts';
import { InventoryStockOpname } from '../features/inventory/components/InventoryStockOpname';
import { InventoryTransactions } from '../features/inventory/components/InventoryTransactions';
import { InventorySuppliers } from '../features/inventory/components/InventorySuppliers';

export const MainDashboard = () => {
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
      case 'transactions': return 'Riwayat Transaksi';
      case 'suppliers': return 'Daftar Supplier';
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
    },
    {
      id: 'transactions',
      label: 'Riwayat Transaksi',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'suppliers',
      label: 'Daftar Supplier',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    }
  ];

  return (
    <div className="h-screen w-screen bg-[#FAF9F6] text-orange-950 flex overflow-hidden font-sans">
      
      {/* SIDEBAR */}
      <aside className="hidden lg:flex w-68 bg-[#FDFCF7] border-r border-orange-100/80 flex-shrink-0 flex-col justify-between p-6 select-none shadow-sm">
        <div>
          <div className="flex items-center justify-between mb-8 px-2">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-8 h-8 bg-gradient-to-tr from-orange-600 to-amber-500 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-md shadow-orange-500/20 flex-shrink-0">
                {companyName.substring(0, 1).toUpperCase()}
              </div>
              <span className="font-extrabold text-sm tracking-tight text-orange-950 truncate" title={companyName}>{companyName}</span>
            </div>
            <button 
              onClick={handleEditCompanyName}
              className="text-[11px] text-orange-500 hover:text-orange-700 font-semibold transition-colors flex-shrink-0 bg-orange-50 px-2 py-1 rounded-lg border border-orange-100"
            >
              Edit
            </button>
          </div>

          <div className="px-2 mb-3 text-[10px] font-extrabold tracking-widest text-orange-400 uppercase">Menu Utama</div>
          <nav className="space-y-1.5">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all duration-200 ${
                  activeMenu === item.id
                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-600/20 translate-x-1'
                    : 'text-orange-900/70 hover:bg-orange-50/80 hover:text-orange-950'
                }`}
              >
                <span className={activeMenu === item.id ? 'text-white' : 'text-orange-500'}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-3.5 bg-[#FAF6EE] border border-orange-100/80 rounded-2xl flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-3 overflow-hidden">
            <UserButton 
              afterSignOutUrl="/" 
              appearance={{ elements: { userButtonPopoverFooter: { display: 'none' } } }} 
            />
            <div className="overflow-hidden">
              <p className="text-xs font-extrabold text-orange-950 truncate">{user?.fullName || 'Administrator'}</p>
              <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                System Connected
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* MOBILE DRAWER */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-orange-950/40 backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative w-72 bg-[#FDFCF7] h-full border-r border-orange-100 flex flex-col justify-between p-6 z-10 shadow-2xl animate-in slide-in-from-left duration-200">
            <div>
              <div className="flex items-center justify-between mb-8 px-2">
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                    {companyName.substring(0, 1).toUpperCase()}
                  </div>
                  <span className="font-bold text-sm text-orange-950">{companyName}</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center font-bold">✕</button>
              </div>
              <nav className="space-y-1.5">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setActiveMenu(item.id); setIsMobileMenuOpen(false); }}
                    className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-2xl text-xs font-bold ${
                      activeMenu === item.id ? 'bg-orange-600 text-white shadow-md' : 'text-orange-800/80 hover:bg-orange-50'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
            <div className="p-3.5 bg-[#FAF6EE] border border-orange-100 rounded-2xl flex items-center space-x-3">
              <UserButton 
                afterSignOutUrl="/" 
                appearance={{ elements: { userButtonPopoverFooter: { display: 'none' } } }} 
              />
              <p className="text-xs font-bold text-orange-950 truncate">{user?.fullName || 'Admin'}</p>
            </div>
          </div>
        </div>
      )}

      {/* MAIN LAYOUT */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[#FAF9F6]">
        
        {/* MOBILE HEADER */}
        <header className="bg-[#FAF9F6]/90 backdrop-blur-md border-b border-orange-100 px-6 py-4 flex justify-between items-center lg:hidden sticky top-0 z-30 shadow-xs">
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 rounded-xl bg-orange-50 text-orange-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <span className="font-extrabold text-xs text-orange-950">{companyName}</span>
          <UserButton 
            afterSignOutUrl="/" 
            appearance={{ elements: { userButtonPopoverFooter: { display: 'none' } } }} 
          />
        </header>

        <main className="flex-1 p-5 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full">
          <div className="space-y-8">
            
            {/* HERO BANNER */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-orange-100/80 relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-sm">
              <div className="absolute right-0 top-0 w-72 h-72 bg-gradient-to-br from-orange-100/60 to-amber-50/20 rounded-full blur-3xl pointer-events-none"></div>
              <div className="relative z-10">
                <span className="text-[10px] font-extrabold tracking-widest text-orange-500 uppercase bg-orange-50 px-3 py-1 rounded-full border border-orange-100">System Workspace 2026</span>
                <h1 className="text-2xl sm:text-3xl font-black text-orange-950 tracking-tight mt-2">{getPageTitle()}</h1>
                <p className="text-xs sm:text-sm text-orange-800/70 mt-1 font-medium">Pantau dan kelola seluruh metrik inventori perusahaan secara real-time dengan standar modern.</p>
              </div>
              <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200/80 text-emerald-700 px-4 py-2 rounded-2xl text-xs font-bold shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Database Synced</span>
              </div>
            </div>

            {/* CONTENT SWITCHER */}
            {activeMenu === 'overview' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <InventoryDashboard />
                <InventoryCharts />
              </div>
            )}

            {activeMenu === 'management' && (
              <div className="space-y-8 animate-in fade-in duration-300">
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
              <div className="animate-in fade-in duration-300">
                <InventoryStockOpname />
              </div>
            )}

            {activeMenu === 'transactions' && (
              <div className="animate-in fade-in duration-300">
                <InventoryTransactions />
              </div>
            )}

            {activeMenu === 'suppliers' && (
              <div className="animate-in fade-in duration-300">
                <InventorySuppliers />
              </div>
            )}

          </div>
        </main>
      </div>

    </div>
  );
};