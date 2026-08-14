import React, { createContext, useContext, useState, useEffect } from 'react';

const InventoryContext = createContext();

export function InventoryProvider({ children }) {
  const [items, setItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resItems, resSuppliers, resTransactions] = await Promise.all([
        fetch('/api/items').then(res => res.json()),
        fetch('/api/suppliers').then(res => res.json()).catch(() => []),
        fetch('/api/transactions').then(res => res.json()).catch(() => [])
      ]);

      setItems(Array.isArray(resItems) ? resItems : resItems.items || []);
      setSuppliers(Array.isArray(resSuppliers) ? resSuppliers : resSuppliers.suppliers || []);
      setTransactions(Array.isArray(resTransactions) ? resTransactions : resTransactions.transactions || []);
    } catch (error) {
      console.error('Gagal mengambil data inventori:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addItem = async (itemData) => {
    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData),
      });
      if (response.ok) {
        await fetchData();
        alert('Barang baru berhasil ditambahkan!');
      } else {
        const errData = await response.json();
        alert('Gagal menambah barang: ' + (errData.error || 'Server error'));
      }
    } catch (error) {
      console.error('Gagal menambah barang:', error);
      alert('Terjadi kesalahan koneksi saat menambah barang.');
    }
  };

  const updateItem = async (id, itemData) => {
    try {
      console.log(`Mengirim request PUT ke /api/items?id=${id}`, itemData);
      const response = await fetch(`/api/items?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData),
      });
      
      const result = await response.json();
      console.log('Respon server update:', result);

      if (response.ok) {
        await fetchData();
        alert('Data barang berhasil diperbarui!');
      } else {
        alert('Gagal memperbarui barang: ' + (result.error || 'Kesalahan pada server'));
      }
    } catch (error) {
      console.error('Gagal memperbarui barang:', error);
      alert('Terjadi kesalahan jaringan saat memperbarui barang.');
    }
  };

  const deleteItem = async (id) => {
    try {
      const response = await fetch(`/api/items?id=${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await fetchData();
        alert('Item berhasil dihapus');
      } else {
        alert('Gagal menghapus item');
      }
    } catch (error) {
      console.error('Gagal menghapus barang:', error);
    }
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

export default InventoryContext;