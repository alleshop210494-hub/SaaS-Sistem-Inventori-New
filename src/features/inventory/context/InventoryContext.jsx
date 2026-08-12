import React, { createContext, useContext, useState, useEffect } from 'react';
import { neon } from '@neondatabase/serverless';

const InventoryContext = createContext();

const sql = neon(import.meta.env.VITE_NEON_DATABASE_URL || 'postgresql://user:password@host/dbname?sslmode=require');

export const InventoryProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [companyName, setCompanyName] = useState(() => {
    return localStorage.getItem('inventory_company_name') || 'CloudInventory';
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await sql`SELECT * FROM items ORDER BY id DESC`;
      if (data) {
        setItems(data);
      }
    } catch (error) {
      console.error("Gagal mengambil data dari Neon:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    localStorage.setItem('inventory_company_name', companyName);
  }, [companyName]);

  const addItem = async (item) => {
    try {
      const result = await sql`
        INSERT INTO items (name, category, stock, price) 
        VALUES (${item.name}, ${item.category}, ${item.stock}, ${item.price})
        RETURNING *
      `;
      if (result && result[0]) {
        setItems(prev => [result[0], ...prev]);
      }
    } catch (error) {
      console.error("Gagal menambah barang ke Neon:", error);
      const newItem = { ...item, id: Date.now() };
      setItems(prev => [newItem, ...prev]);
    }
  };

  const deleteItem = async (id) => {
    try {
      await sql`DELETE FROM items WHERE id = ${id}`;
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error("Gagal menghapus barang dari Neon:", error);
      setItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const updateItem = async (id, updatedItem) => {
    try {
      const result = await sql`
        UPDATE items 
        SET name = ${updatedItem.name}, category = ${updatedItem.category}, stock = ${updatedItem.stock}, price = ${updatedItem.price}
        WHERE id = ${id}
        RETURNING *
      `;
      if (result && result[0]) {
        setItems(prev => prev.map(item => item.id === id ? result[0] : item));
      }
    } catch (error) {
      console.error("Gagal memperbarui barang di Neon:", error);
      setItems(prev => prev.map(item => item.id === id ? { ...item, ...updatedItem } : item));
    }
  };

  const updateCompanyName = (newName) => {
    if (newName && newName.trim() !== '') {
      setCompanyName(newName.trim());
    }
  };

  return (
    <InventoryContext.Provider value={{ items, addItem, deleteItem, updateItem, companyName, updateCompanyName, loading }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => useContext(InventoryContext);