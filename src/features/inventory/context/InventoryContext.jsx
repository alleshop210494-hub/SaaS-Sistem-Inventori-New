import React, { createContext, useContext, useState, useEffect } from 'react';

const InventoryContext = createContext();

export function InventoryProvider({ children }) {
  const [items, setItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const refreshData = async () => {
    setLoading(true);
    try {
      // Contoh fetch data (sesuaikan dengan implementasi API Anda yang sudah ada)
      const resItems = await fetch('/api/inventory/items');
      const dataItems = await resItems.json();
      if (Array.isArray(dataItems)) setItems(dataItems);
    } catch (err) {
      console.error('Gagal memuat data inventori:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Fungsi addItem yang memastikan added_by tidak menjadi Unknown User
  const addItem = async (newItemData) => {
    try {
      // Pastikan jika added_by kosong atau bernilai Unknown User, diisi email Anda
      const finalPayload = {
        ...newItemData,
        added_by: (!newItemData.added_by || newItemData.added_by === 'Unknown User') 
          ? 'alleshop210494@gmail.com' 
          : newItemData.added_by,
        user_id: newItemData.user_id || 'user-alleshop'
      };

      const response = await fetch('/api/inventory/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalPayload),
      });

      if (response.ok) {
        await refreshData();
      } else {
        console.error('Gagal menambah item ke database');
      }
    } catch (error) {
      console.error('Error saat memanggil addItem:', error);
    }
  };

  const updateItem = async (id, updatedData) => {
    try {
      const finalPayload = {
        ...updatedData,
        added_by: (!updatedData.added_by || updatedData.added_by === 'Unknown User') 
          ? 'alleshop210494@gmail.com' 
          : updatedData.added_by,
      };

      const response = await fetch(`/api/inventory/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalPayload),
      });

      if (response.ok) {
        await refreshData();
      }
    } catch (error) {
      console.error('Error saat memanggil updateItem:', error);
    }
  };

  return (
    <InventoryContext.Provider value={{ items, suppliers, transactions, loading, refreshData, addItem, updateItem }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  return useContext(InventoryContext);
}