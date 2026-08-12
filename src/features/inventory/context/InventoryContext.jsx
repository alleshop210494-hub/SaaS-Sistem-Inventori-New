import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { neon } from '@neondatabase/serverless';

const InventoryContext = createContext();

// Inisialisasi koneksi langsung ke Neon Database
const sql = neon(import.meta.env.VITE_NEON_DATABASE_URL || '');

export const InventoryProvider = ({ children }) => {
  const { user } = useUser();
  const [companyName, setCompanyName] = useState('PT 12345');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ambil data dari tabel items di Neon saat aplikasi pertama kali dimuat
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await sql`SELECT * FROM items ORDER BY id DESC`;
      setItems(data);
    } catch (error) {
      console.error("Gagal mengambil data dari Neon:", error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (newItem) => {
    const currentUsername = user?.username || user?.primaryEmailAddress?.emailAddress || user?.fullName || 'Administrator';
    
    try {
      const result = await sql`
        INSERT INTO items (name, category, stock, price, added_by)
        VALUES (${newItem.name}, ${newItem.category}, ${newItem.stock}, ${newItem.price}, ${currentUsername})
        RETURNING *
      `;
      if (result && result[0]) {
        setItems(prev => [result[0], ...prev]);
      }
    } catch (error) {
      console.error("Gagal menambah data ke Neon:", error);
    }
  };

  const updateItem = async (id, updatedData) => {
    try {
      const currentItem = items.find(i => i.id === id) || {};
      const name = updatedData.name !== undefined ? updatedData.name : currentItem.name;
      const category = updatedData.category !== undefined ? updatedData.category : currentItem.category;
      const stock = updatedData.stock !== undefined ? updatedData.stock : currentItem.stock;
      const price = updatedData.price !== undefined ? updatedData.price : currentItem.price;

      const result = await sql`
        UPDATE items 
        SET name = ${name},
            category = ${category},
            stock = ${stock},
            price = ${price}
        WHERE id = ${id}
        RETURNING *
      `;
      if (result && result[0]) {
        setItems(prev => prev.map(item => item.id === id ? result[0] : item));
      }
    } catch (error) {
      console.error("Gagal memperbarui data di Neon:", error);
    }
  };

  const deleteItem = async (id) => {
    try {
      await sql`DELETE FROM items WHERE id = ${id}`;
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error("Gagal menghapus data dari Neon:", error);
    }
  };

  const updateCompanyName = (newName) => {
    setCompanyName(newName);
  };

  return (
    <InventoryContext.Provider value={{ items, companyName, addItem, updateItem, deleteItem, updateCompanyName, loading }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => useContext(InventoryContext);