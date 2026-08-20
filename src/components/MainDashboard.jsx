import React, { useState, useEffect } from 'react';
import { useAuth } from '../features/auth/context/AuthContext';
import { useInventory } from '../features/inventory/context/InventoryContext';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
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

  useEffect(() => {
    if (companyName) {
      setTempName(companyName);
    }
  }, [companyName]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-50 flex">
      <Sidebar 
        user={user}
        logout={logout}
        companyName={companyName}
        setCompanyName={setCompanyName}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isEditingName={isEditingName}
        setIsEditingName={setIsEditingName}
        tempName={tempName}
        setTempName={setTempName}
      />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <Header activeTab={activeTab} />

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