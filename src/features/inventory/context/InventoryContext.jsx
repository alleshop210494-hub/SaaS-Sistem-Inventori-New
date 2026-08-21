import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
  const { user } = useUser();
  const userId = user?.primaryEmailAddress?.emailAddress || user?.id;

  const [items, setItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      setItems([]);
      setSuppliers([]);
      setTransactions([]);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [itemsRes, suppliersRes, transactionsRes] = await Promise.all([
          fetch(`/api/items?user_id=${encodeURIComponent(userId)}`),
          fetch(`/api/suppliers?user_id=${encodeURIComponent(userId)}`),
          fetch(`/api/transactions?user_id=${encodeURIComponent(userId)}`)
        ]);

        if (itemsRes.ok) {
          const itemsData = await itemsRes.json();
          setItems(Array.isArray(itemsData) ? itemsData : itemsData.data || []);
        }
        if (suppliersRes.ok) {
          const suppliersData = await suppliersRes.json();
          setSuppliers(Array.isArray(suppliersData) ? suppliersData : suppliersData.data || []);
        }
        if (transactionsRes.ok) {
          const transactionsData = await transactionsRes.json();
          setTransactions(Array.isArray(transactionsData) ? transactionsData : transactionsData.data || []);
        }
      } catch (error) {
        console.error('Gagal mengambil data dari server:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const addItem = async (newItemData) => {
    if (!userId) return;
    try {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newItemData, user_id: userId })
      });
      if (res.ok) {
        const created = await res.json();
        const actualItem = created.data || created;
        setItems(prev => [actualItem, ...prev]);
        return actualItem;
      }
    } catch (error) {
      console.error('Gagal menambah item:', error);
    }
  };

  const updateItem = async (id, updatedData) => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/items?id=${id}&user_id=${encodeURIComponent(userId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...updatedData, user_id: userId })
      });
      if (res.ok) {
        const updated = await res.json();
        const actualItem = updated.data || updated;
        setItems(prev => prev.map(item => item.id === id ? actualItem : item));
        return actualItem;
      }
    } catch (error) {
      console.error('Gagal memperbarui item:', error);
    }
  };

  const deleteItem = async (id) => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/items?id=${id}&user_id=${encodeURIComponent(userId)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
      });
      if (res.ok) {
        setItems(prev => prev.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error('Gagal menghapus item:', error);
    }
  };

  const addSupplier = async (supplierData) => {
    if (!userId) return;
    try {
      const res = await fetch('/api/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...supplierData, user_id: userId })
      });
      if (res.ok) {
        const created = await res.json();
        const actualSupplier = created.data || created;
        setSuppliers(prev => [actualSupplier, ...prev]);
        return actualSupplier;
      }
    } catch (error) {
      console.error('Gagal menambah supplier:', error);
    }
  };

  const updateSupplier = async (id, supplierData) => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/suppliers?id=${id}&user_id=${encodeURIComponent(userId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...supplierData, user_id: userId })
      });
      if (res.ok) {
        const updated = await res.json();
        const actualSupplier = updated.data || updated;
        setSuppliers(prev => prev.map(s => s.id === id ? actualSupplier : s));
        return actualSupplier;
      }
    } catch (error) {
      console.error('Gagal memperbarui supplier:', error);
    }
  };

  const deleteSupplier = async (id) => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/suppliers?id=${id}&user_id=${encodeURIComponent(userId)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
      });
      if (res.ok) {
        setSuppliers(prev => prev.filter(s => s.id !== id));
      }
    } catch (error) {
      console.error('Gagal menghapus supplier:', error);
    }
  };

  const addTransaction = async (txData) => {
    if (!userId) return;
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...txData, user_id: userId })
      });
      if (res.ok) {
        const created = await res.json();
        const actualTx = created.data || created;
        setTransactions(prev => [actualTx, ...prev]);
        return actualTx;
      }
    } catch (error) {
      console.error('Gagal menambah transaksi:', error);
    }
  };

  return (
    <InventoryContext.Provider value={{
      items,
      suppliers,
      transactions,
      loading,
      addItem,
      updateItem,
      deleteItem,
      addSupplier,
      updateSupplier,
      deleteSupplier,
      addTransaction
    }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => useContext(InventoryContext);