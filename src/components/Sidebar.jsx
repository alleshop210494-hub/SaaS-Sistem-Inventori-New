import React, { useRef, useEffect } from 'react';

export function Sidebar({ 
  user, 
  logout, 
  companyName, 
  setCompanyName, 
  activeTab, 
  setActiveTab,
  isEditingName,
  setIsEditingName,
  tempName,
  setTempName
}) {
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

  return (
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
          {/* Email/username disembunyikan sesuai pengaturan sebelumnya */}
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
  );
}

export default Sidebar;