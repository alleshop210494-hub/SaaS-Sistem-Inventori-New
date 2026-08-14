import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';

const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
  const { getToken } = useAuth();
  const [suppliers, setSuppliers] = useState([]);
  const [items, setItems] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [companyName, setCompanyName] = useState('Perusahaan Saya');
  const [loading, setLoading] = useState(true);

  // --- SUPPLIERS API ---
  const fetchSuppliers = async () => {
    try {
      const token = await getToken();
      const response = await fetch('/api/suppliers', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        setSuppliers(result.data);
      }
    } catch (error) {
      console.error('Gagal mengambil data supplier:', error);
    }
  };

  const addSupplier = async (formData) => {
    try {
      const token = await getToken();
      const response = await fetch('/api/suppliers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      if (result.success) {
        setSuppliers(prev => [result.data, ...prev]);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Gagal menyimpan supplier:', error);
    }
  };

  const deleteSupplier = async (id) => {
    try {
      const token = await getToken();
      const response = await fetch(`/api/suppliers?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        setSuppliers(prev => prev.filter(s => s.id !== id));
      }
    } catch (error) {
      console.error('Gagal menghapus supplier:', error);
    }
  };

  // --- ITEMS API ---
  const fetchItems = async () => {
    try {
      const token = await getToken();
      const response = await fetch('/api/items', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        setItems(result.data);
      }
    } catch (error) {
      console.error('Gagal mengambil data barang:', error);
    }
  };

  const addItem = async (itemData) => {
    try {
      const token = await getToken();
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(itemData)
      });
      const result = await response.json();
      if (result.success) {
        setItems(prev => [result.data, ...prev]);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Gagal menyimpan barang:', error);
    }
  };

  const deleteItem = async (id) => {
    try {
      const token = await getToken();
      const response = await fetch(`/api/items?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        setItems(prev => prev.filter(i => i.id !== id));
      }
    } catch (error) {
      console.error('Gagal menghapus barang:', error);
    }
  };

  // --- TRANSACTIONS API ---
  const fetchTransactions = async () => {
    try {
      const token = await getToken();
      const response = await fetch('/api/transactions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        setTransactions(result.data);
      }
    } catch (error) {
      console.error('Gagal mengambil data transaksi:', error);
    }
  };

  const addTransaction = async (transData) => {
    try {
      const token = await getToken();
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(transData)
      });
      const result = await response.json();
      if (result.success) {
        setTransactions(prev => [result.data, ...prev]);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Gagal menyimpan transaksi:', error);
    }
  };

  // Load all data on mount
  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([
        fetchSuppliers(),
        fetchItems(),
        fetchTransactions()
      ]);
      setLoading(false);
    };
    loadAll();
  }, []);

  return (
    <InventoryContext.Provider value={{
      suppliers,
      addSupplier,
      deleteSupplier,
      items,
      addItem,
      deleteItem,
      transactions,
      addTransaction,
      companyName,
      setCompanyName,
      loading
    }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => useContext(InventoryContext);