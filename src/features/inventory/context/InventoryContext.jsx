import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/clerk-react';

const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
  const { user } = useUser();
  const userId = user?.primaryEmailAddress?.emailAddress || user?.id;

  const [items, setItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [companyName, setCompanyNameState] = useState('Nama Perusahaan');
  const [loading, setLoading] = useState(false);
  const hasLoggedLogin = useRef(false);

  // Sinkronisasi nama perusahaan dari server Clerk unsafeMetadata saat user dimuat
  useEffect(() => {
    if (user && user.unsafeMetadata?.companyName) {
      setCompanyNameState(user.unsafeMetadata.companyName);
    }
  }, [user]);

  // Fungsi untuk mengubah nama perusahaan dan menyimpannya secara permanen ke server Clerk (tanpa localStorage)
  const setCompanyName = async (newName) => {
    setCompanyNameState(newName);
    if (user) {
      try {
        await user.update({
          unsafeMetadata: {
            ...user.unsafeMetadata,
            companyName: newName,
          },
        });
      } catch (error) {
        console.error('Gagal menyimpan nama perusahaan ke server Clerk:', error);
      }
    }
  };

  // Fungsi otomatis untuk mencatat aktivitas ke database
  const logActivity = async (type, notes, product_id = null) => {
    if (!userId) return;
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id, type, quantity: 0, notes, user_id: userId })
      });
      if (res.ok) {
        const created = await res.json();
        const actualTx = created.data || created;
        setTransactions(prev => [actualTx, ...prev]);
      }
    } catch (error) {
      console.error('Gagal mencatat log aktivitas:', error);
    }
  };

  useEffect(() => {
    if (!userId) {
      setItems([]);
      setSuppliers([]);
      setTransactions([]);
      hasLoggedLogin.current = false;
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

        // Catat aktivitas login otomatis sekali per sesi
        if (!hasLoggedLogin.current) {
          hasLoggedLogin.current = true;
          await logActivity('LOGIN', `Pengguna masuk ke sistem.`);
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
        await logActivity('TAMBAH_PRODUK', `Menambahkan produk baru: ${actualItem.name || newItemData.name}`, actualItem.id);
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
        await logActivity('UPDATE_PRODUK', `Memperbarui data produk: ${actualItem.name || updatedData.name || id}`, id);
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
        await logActivity('HAPUS_PRODUK', `Menghapus produk dengan ID: ${id}`, id);
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
        await logActivity('TAMBAH_SUPPLIER', `Menambahkan supplier baru: ${actualSupplier.name || supplierData.name}`);
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
        await logActivity('UPDATE_SUPPLIER', `Memperbarui data supplier: ${actualSupplier.name || supplierData.name || id}`);
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
        await logActivity('HAPUS_SUPPLIER', `Menghapus supplier dengan ID: ${id}`);
      }
    } catch (error) {
      console.error('Gagal menghapus supplier:', error);
    }
  };

  return (
    <InventoryContext.Provider value={{
      items,
      suppliers,
      transactions,
      loading,
      companyName,
      setCompanyName,
      addItem,
      updateItem,
      deleteItem,
      addSupplier,
      updateSupplier,
      deleteSupplier,
      logActivity
    }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => useContext(InventoryContext);