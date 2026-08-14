import React, { createContext, useContext, useState, useEffect } from 'react';

const InventoryContext = createContext();

export function InventoryProvider({ children }) {
  const [items, setItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadInitialData = () => {
    // Load Items
    const savedItems = localStorage.getItem('inventory_items');
    if (savedItems) {
      try {
        const parsed = JSON.parse(savedItems);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
        } else {
          setItems([
            { id: 1, name: 'Laptop Asus ROG Strix', category: 'Elektronik', sku: 'SKU-001', stock: 12, price: 15000000 },
            { id: 2, name: 'Kertas HVS A4 70gr', category: 'ATK', sku: 'SKU-002', stock: 50, price: 45000 },
          ]);
        }
      } catch (e) {
        setItems([]);
      }
    } else {
      setItems([
        { id: 1, name: 'Laptop Asus ROG Strix', category: 'Elektronik', sku: 'SKU-001', stock: 12, price: 15000000 },
        { id: 2, name: 'Kertas HVS A4 70gr', category: 'ATK', sku: 'SKU-002', stock: 50, price: 45000 },
      ]);
    }

    // Load Suppliers
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

    // Load Transactions
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

    setLoading(false);
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
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const res = await fetch('/api/items', { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const finalData = Array.isArray(data) ? data : data.items || [];
        if (finalData.length > 0) {
          setItems(finalData);
          localStorage.setItem('inventory_items', JSON.stringify(finalData));
        } else {
          loadInitialData();
        }
      } else {
        loadInitialData();
      }
    } catch (err) {
      loadInitialData();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const addItem = async (itemData) => {
    const newItem = { id: Date.now(), ...itemData };
    setItems((prev) => {
      const updated = [newItem, ...prev];
      localStorage.setItem('inventory_items', JSON.stringify(updated));
      return updated;
    });

    addTransaction('TAMBAH', `Menambahkan barang baru: ${itemData.name} (Stok: ${itemData.stock})`);

    try {
      await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData),
      });
    } catch (err) {
      console.error('API sync error (addItem):', err);
    }
  };

  const updateItem = async (id, itemData) => {
    setItems((prev) => {
      const updated = prev.map((item) => (item.id === id || item._id === id ? { ...item, ...itemData } : item));
      localStorage.setItem('inventory_items', JSON.stringify(updated));
      return updated;
    });

    addTransaction('UPDATE', `Memperbarui data barang: ${itemData.name || 'ID ' + id}`);

    try {
      await fetch(`/api/items?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData),
      });
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
    } catch (err) {
      console.error('API sync error (deleteItem):', err);
    }
  };

  const addSupplier = (supplierData) => {
    const newSup = { id: Date.now(), ...supplierData };
    setSuppliers((prev) => {
      const updated = [newSup, ...prev];
      localStorage.setItem('inventory_suppliers', JSON.stringify(updated));
      return updated;
    });
    addTransaction('SUPPLIER', `Menambahkan supplier baru: ${supplierData.name}`);
  };

  const updateSupplier = (id, supplierData) => {
    setSuppliers((prev) => {
      const updated = prev.map((s) => (s.id === id || s._id === id ? { ...s, ...supplierData } : s));
      localStorage.setItem('inventory_suppliers', JSON.stringify(updated));
      return updated;
    });
    addTransaction('SUPPLIER', `Memperbarui data supplier: ${supplierData.name}`);
  };

  const deleteSupplier = (id) => {
    setSuppliers((prev) => {
      const updated = prev.filter((s) => s.id !== id && s._id !== id);
      localStorage.setItem('inventory_suppliers', JSON.stringify(updated));
      return updated;
    });
    addTransaction('SUPPLIER', `Menghapus data supplier ID: ${id}`);
  };

  return (
    <InventoryContext.Provider
      value={{
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