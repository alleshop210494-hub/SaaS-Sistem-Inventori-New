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

  // Ambil data dari API Backend Aman Vercel
  const fetchSuppliers = async () => {
    try {
      const token = await getToken();
      const response = await fetch('/api/suppliers', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (result.success) {
        setSuppliers(result.data);
      }
    } catch (error) {
      console.error('Gagal mengambil data supplier:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

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
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (result.success) {
        setSuppliers(prev => prev.filter(s => s.id !== id));
      }
    } catch (error) {
      console.error('Gagal menghapus supplier:', error);
    }
  };

  return (
    <InventoryContext.Provider value={{
      suppliers,
      items,
      transactions,
      companyName,
      setCompanyName,
      addSupplier,
      deleteSupplier,
      loading
    }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => useContext(InventoryContext);