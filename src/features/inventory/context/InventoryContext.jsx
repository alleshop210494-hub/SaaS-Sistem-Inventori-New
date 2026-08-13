import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { neon } from '@neondatabase/serverless';

const InventoryContext = createContext();

const sql = neon(import.meta.env.VITE_NEON_DATABASE_URL || '', {
  disableWarningInBrowsers: true
});

export const InventoryProvider = ({ children }) => {
  const { user } = useUser();
  const [companyName, setCompanyName] = useState('PT 12345');
  const [items, setItems] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Ambil data items
      try {
        const itemsData = await sql`SELECT * FROM items ORDER BY id DESC`;
        setItems(itemsData);
      } catch (err) {
        console.error("Gagal mengambil data items:", err);
        setItems([]);
      }
      
      // Ambil data transactions dengan konversi zona waktu ke WIB (Asia/Jakarta)
      try {
        const transData = await sql`
          SELECT *, (created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta') as created_at 
          FROM transactions 
          ORDER BY id DESC
        `;
        setTransactions(transData);
      } catch (err) {
        console.warn("Tabel transactions belum siap:", err);
        setTransactions([]);
      }
    } catch (error) {
      console.error("Gagal terhubung ke database Neon:", error);
    } finally {
      setLoading(false);
    }
  };

  const logTransaction = async (type, description, username) => {
    try {
      // Menggunakan NOW() untuk insert, dan mengambil kembali dengan konversi zona waktu
      const result = await sql`
        INSERT INTO transactions (type, description, added_by, created_at)
        VALUES (${type}, ${description}, ${username}, NOW())
        RETURNING *, (created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta') as created_at
      `;
      if (result && result[0]) {
        setTransactions(prev => [result[0], ...prev]);
      }
    } catch (error) {
      console.error("Gagal mencatat transaksi:", error);
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
        await logTransaction('TAMBAH BARANG', `Menambahkan barang baru: ${newItem.name} (${newItem.stock} unit)`, currentUsername);
      }
    } catch (error) {
      console.error("Gagal menambah data ke Neon:", error);
    }
  };

  const updateItem = async (id, updatedData) => {
    const currentUsername = user?.username || user?.primaryEmailAddress?.emailAddress || user?.fullName || 'Administrator';
    try {
      const currentItem = items.find(i => i.id === id) || {};
      const name = updatedData.name !== undefined ? updatedData.name : currentItem.name;
      const category = updatedData.category !== undefined ? updatedData.category : currentItem.category;
      const stock = updatedData.stock !== undefined ? updatedData.stock : currentItem.stock;
      const price = updatedData.price !== undefined ? updatedData.price : currentItem.price;

      const result = await sql`
        UPDATE items 
        SET name = ${name}, category = ${category}, stock = ${stock}, price = ${price}
        WHERE id = ${id}
        RETURNING *
      `;
      if (result && result[0]) {
        setItems(prev => prev.map(item => item.id === id ? result[0] : item));
        await logTransaction('UBAH BARANG', `Memperbarui data barang: ${name} (Stok: ${stock})`, currentUsername);
      }
    } catch (error) {
      console.error("Gagal memperbarui data di Neon:", error);
    }
  };

  const deleteItem = async (id) => {
    const currentUsername = user?.username || user?.primaryEmailAddress?.emailAddress || user?.fullName || 'Administrator';
    try {
      const targetItem = items.find(i => i.id === id);
      await sql`DELETE FROM items WHERE id = ${id}`;
      setItems(prev => prev.filter(item => item.id !== id));
      if (targetItem) {
        await logTransaction('HAPUS BARANG', `Menghapus barang: ${targetItem.name}`, currentUsername);
      }
    } catch (error) {
      console.error("Gagal menghapus data dari Neon:", error);
    }
  };

  const submitStockOpname = async (opnameResults) => {
    const currentUsername = user?.username || user?.primaryEmailAddress?.emailAddress || user?.fullName || 'Administrator';
    try {
      for (const op of opnameResults) {
        await sql`UPDATE items SET stock = ${op.physicalStock} WHERE id = ${op.id}`;
      }
      const updatedItems = await sql`SELECT * FROM items ORDER BY id DESC`;
      setItems(updatedItems);
      const description = `Melakukan penyesuaian Stock Opname fisik pada ${opnameResults.length} jenis barang.`;
      await logTransaction('STOCK OPNAME', description, currentUsername);
    } catch (error) {
      console.error("Gagal memproses stock opname:", error);
    }
  };

  const updateCompanyName = (newName) => {
    setCompanyName(newName);
  };

  return (
    <InventoryContext.Provider value={{ items, transactions, companyName, addItem, updateItem, deleteItem, submitStockOpname, updateCompanyName, loading }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => useContext(InventoryContext);