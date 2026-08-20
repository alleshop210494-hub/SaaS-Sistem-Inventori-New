import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

const InventoryContext = createContext();

export function InventoryProvider({ children }) {
  const { user, isLoaded, isSignedIn } = useUser();
  const [items, setItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [companyName, setCompanyName] = useState('PT Antariksa');
  
  // State baru untuk pengaturan kolom kustom / dinamis berdasarkan jenis bisnis
  const [customColumns, setCustomColumns] = useState([
    { key: 'sku', label: 'SKU', visible: true },
    { key: 'category', label: 'Kategori', visible: true },
    { key: 'stock', label: 'Stok', visible: true },
    { key: 'price', label: 'Harga', visible: true }
  ]);

  const [loading, setLoading] = useState(true);

  const loadInitialData = () => {
    const savedCompanyName = localStorage.getItem('inventory_company_name');
    if (savedCompanyName) {
      setCompanyName(savedCompanyName);
    }

    // Memuat konfigurasi kolom kustom yang tersimpan
    const savedCustomColumns = localStorage.getItem('inventory_custom_columns');
    if (savedCustomColumns) {
      try {
        const parsedCols = JSON.parse(savedCustomColumns);
        if (Array.isArray(parsedCols) && parsedCols.length > 0) {
          setCustomColumns(parsedCols);
        }
      } catch (e) {
        console.error('Gagal memparsing custom columns:', e);
      }
    }

    const savedSuppliers = localStorage.getItem('inventory_suppliers');
    if (savedSuppliers) {
      try {
        const parsedSup = JSON.parse(savedSuppliers);
        if (Array.isArray(parsedSup) && parsedSup.length > 0) {
          setSuppliers(parsedSup);
        } else {
          setSuppliers([
            { id: 1, name: 'PT Teknologi Jaya', contact: '081234567890', email: 'info@teklogijaya.com', address: 'Jakarta Selatan' },
            { id: 2, name: 'CV Mitra Makmur', contact: '089876543210', email: 'sales@mitramakmur.com', address: 'Surabaya' }
          ]);
        }
      } catch (e) {
        setSuppliers([]);
      }
    } else {
      const defaultSuppliers = [
        { id: 1, name: 'PT Teknologi Jaya', contact: '081234567890', email: 'info@teklogijaya.com', address: 'Jakarta Selatan' },
        { id: 2, name: 'CV Mitra Makmur', contact: '089876543210', email: 'sales@mitramakmur.com', address: 'Surabaya' }
      ];
      setSuppliers(defaultSuppliers);
      localStorage.setItem('inventory_suppliers', JSON.stringify(defaultSuppliers));
    }

    const savedTransactions = localStorage.getItem('inventory_transactions');
    if (savedTransactions) {
      try {
        const parsedTx = JSON.parse(savedTransactions);
        if (Array.isArray(parsedTx)) {
          setTransactions(parsedTx);
        }
      } catch (e) {
        setTransactions([]);
      }
    } else {
      const defaultTx = [
        { id: 1, type: 'MASUK', desc: 'Inisialisasi sistem inventori awal', time: new Date().toLocaleString() }
      ];
      setTransactions(defaultTx);
      localStorage.setItem('inventory_transactions', JSON.stringify(defaultTx));
    }
  };

  const handleSetCompanyName = (name) => {
    setCompanyName(name);
    localStorage.setItem('inventory_company_name', name);
  };

  // Fungsi untuk memperbarui dan menyimpan kolom kustom pilihan user
  const handleUpdateCustomColumns = (newColumns) => {
    setCustomColumns(newColumns);
    localStorage.setItem('inventory_custom_columns', JSON.stringify(newColumns));
  };

  const addTransaction = (type, desc) => {
    const newTx = {
      id: Date.now(),
      type,
      desc,
      time: new Date().toLocaleString()
    };
    setTransactions((prev) => {
      const updated = [newTx, ...prev];
      localStorage.setItem('inventory_transactions', JSON.stringify(updated));
      return updated;
    });
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const [resItems, resSuppliers] = await Promise.all([
        fetch('/api/items', { signal: controller.signal }),
        fetch('/api/suppliers', { signal: controller.signal }).catch(() => null)
      ]);
      
      clearTimeout(timeoutId);

      if (resItems.ok) {
        const data = await resItems.json();
        const finalData = Array.isArray(data) ? data : data.items || [];
        setItems(finalData);
        localStorage.setItem('inventory_items', JSON.stringify(finalData));
      } else {
        const savedItems = localStorage.getItem('inventory_items');
        if (savedItems) setItems(JSON.parse(savedItems));
      }

      if (resSuppliers && resSuppliers.ok) {
        const supData = await resSuppliers.json();
        const finalSup = Array.isArray(supData) ? supData : (supData.data || supData.suppliers || []);
        if (finalSup.length > 0) {
          setSuppliers(finalSup);
          localStorage.setItem('inventory_suppliers', JSON.stringify(finalSup));
        }
      }
    } catch (err) {
      console.error('Gagal mengambil data dari database:', err);
      const savedItems = localStorage.getItem('inventory_items');
      if (savedItems) setItems(JSON.parse(savedItems));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
    fetchData();
  }, []);

  const resolveUserEmail = () => {
    let email = 
      user?.primaryEmailAddress?.emailAddress || 
      user?.emailAddresses?.[0]?.emailAddress || 
      user?.username;

    if (!email || email === 'Unknown User' || email === 'Authenticated User') {
      const savedEmail = localStorage.getItem('email') || localStorage.getItem('userEmail');
      if (savedEmail && savedEmail.includes('@')) {
        email = savedEmail;
      } else {
        email = 'alleshop210494@gmail.com';
      }
    }
    return email;
  };

  const addItem = async (itemData) => {
    const userEmail = resolveUserEmail();
    const userId = user?.id || 'user-alleshop';

    const completeItemData = {
      ...itemData,
      user_id: userId,
      added_by: userEmail,
      custom_fields: itemData.custom_fields || {}
    };

    const newItem = { id: Date.now(), ...completeItemData };
    setItems((prev) => {
      const updated = [newItem, ...prev];
      localStorage.setItem('inventory_items', JSON.stringify(updated));
      return updated;
    });

    addTransaction('TAMBAH', `Menambahkan barang baru: ${itemData.name} oleh ${userEmail} (Stok: ${itemData.stock})`);

    try {
      await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(completeItemData),
      });
      fetchData();
    } catch (err) {
      console.error('API sync error (addItem):', err);
    }
  };

  const updateItem = async (id, itemData) => {
    const userEmail = resolveUserEmail();
    const userId = user?.id || 'user-alleshop';

    const completeItemData = {
      ...itemData,
      user_id: itemData.user_id || userId,
      added_by: userEmail,
      custom_fields: itemData.custom_fields || {}
    };

    setItems((prev) => {
      const updated = prev.map((item) => (item.id === id || item._id === id ? { ...item, ...completeItemData } : item));
      localStorage.setItem('inventory_items', JSON.stringify(updated));
      return updated;
    });

    addTransaction('UPDATE', `Memperbarui data barang: ${itemData.name || 'ID ' + id}`);

    try {
      await fetch(`/api/items?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(completeItemData),
      });
      fetchData();
    } catch (err) {
      console.error('API sync error (updateItem):', err);
    }
  };

  const deleteItem = async (id) => {
    let targetName = 'ID ' + id;
    setItems((prev) => {
      const found = prev.find((item) => item.id === id || item._id === id);
      if (found) targetName = found.name;
      const updated = prev.filter((item) => item.id !== id && item._id !== id);
      localStorage.setItem('inventory_items', JSON.stringify(updated));
      return updated;
    });

    addTransaction('HAPUS', `Menghapus barang dari inventori: ${targetName}`);

    try {
      await fetch(`/api/items?id=${id}`, {
        method: 'DELETE',
      });
      fetchData();
    } catch (err) {
      console.error('API sync error (deleteItem):', err);
    }
  };

  const addSupplier = async (supplierData) => {
    const nextId = suppliers.length > 0 ? Math.max(...suppliers.map(s => Number(s.id || s._id) || 0)) + 1 : 1;
    const newSup = { id: nextId, ...supplierData };
    
    setSuppliers((prev) => {
      const updated = [newSup, ...prev];
      localStorage.setItem('inventory_suppliers', JSON.stringify(updated));
      return updated;
    });
    addTransaction('SUPPLIER', `Menambahkan supplier baru: ${supplierData.name}`);

    try {
      await fetch('/api/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(supplierData),
      });
      fetchData();
    } catch (err) {
      console.error('API sync error (addSupplier):', err);
    }
  };

  const updateSupplier = async (id, supplierData) => {
    setSuppliers((prev) => {
      const updated = prev.map((s) => (s.id === id || s._id === id ? { ...s, ...supplierData } : s));
      localStorage.setItem('inventory_suppliers', JSON.stringify(updated));
      return updated;
    });
    addTransaction('SUPPLier', `Memperbarui data supplier: ${supplierData.name}`);

    try {
      await fetch(`/api/suppliers?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(supplierData),
      });
      fetchData();
    } catch (err) {
      console.error('API sync error (updateSupplier):', err);
    }
  };

  const deleteSupplier = async (id) => {
    setSuppliers((prev) => {
      const updated = prev.filter((s) => s.id !== id && s._id !== id);
      localStorage.setItem('inventory_suppliers', JSON.stringify(updated));
      return updated;
    });
    addTransaction('SUPPLIER', `Menghapus data supplier ID: ${id}`);

    try {
      await fetch(`/api/suppliers?id=${id}`, {
        method: 'DELETE',
      });
      fetchData();
    } catch (err) {
      console.error('API sync error (deleteSupplier):', err);
    }
  };

  return (
    <InventoryContext.Provider
      value={{
        items,
        suppliers,
        transactions,
        companyName,
        setCompanyName: handleSetCompanyName,
        customColumns,               // Ditambahkan untuk fitur custom table
        updateCustomColumns: handleUpdateCustomColumns, // Ditambahkan untuk fitur custom table
        loading,
        addItem,
        updateItem,
        deleteItem,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        refreshData: fetchData,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  return useContext(InventoryContext);
}