import React from 'react';
import { useInventory } from '../features/inventory/context/InventoryContext';
import { UserButton } from '@clerk/clerk-react';

export function Header() {
  const { companyName, setCompanyName } = useInventory();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="text-xl font-bold text-gray-800 border-b border-transparent hover:border-gray-300 focus:border-blue-600 focus:outline-none px-1 py-0.5 rounded transition"
            title="Klik untuk mengubah nama perusahaan"
          />
          <span className="text-xs text-gray-500 px-1">Sistem Manajemen Inventori</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
}