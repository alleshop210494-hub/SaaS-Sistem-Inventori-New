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
  const [suppliers, setSuppliers] = useState([]);
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
      } catch (err) { console.error("Gagal mengambil items:", err); }
      
      // Ambil data transactions (WIB)
      try {
        const transData = await sql`SELECT *, (created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta') as created_at FROM transactions ORDER BY id DESC`;
        setTransactions(transData);
      } catch (err) { console.error("Gagal mengambil transactions:", err); }

      // Ambil data suppliers
      try {
        const supplierData = await sql`SELECT * FROM suppliers ORDER BY id DESC`;
        setSuppliers(supplierData);
      } catch (err) { console.error("Gagal mengambil suppliers:", err); }

    } catch (error) {
      console.error("Gagal terhubung ke database Neon:", error);
    } finally {
      setLoading(false);
    }
  };

  const logTransaction = async (type, description, username) => {
    try {
      const result = await sql`
        INSERT INTO transactions (type, description, added_by, created_at)
        VALUES (${type}, ${description}, ${username}, NOW())
        RETURNING *, (created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta') as created_at
      `;
      if (result && result[0]) setTransactions(prev => [result[0], ...prev]);
    } catch (error) { console.error("Gagal mencatat transaksi:", error); }
  };

  const addSupplier = async (newSupplier) => {
    const currentUsername = user?.username || user?.primaryEmailAddress?.emailAddress || 'Admin';
    try {
      const result = await sql`
        INSERT INTO suppliers (name, contact_person, phone, email, address)
        VALUES (${newSupplier.name}, ${newSupplier.contactPerson}, ${newSupplier.phone}, ${newSupplier.email}, ${newSupplier.address})
        RETURNING *
      `;
      if (result && result[0]) {
        setSuppliers(prev => [result[0], ...prev]);
        await logTransaction('TAMBAH SUPPLIER', `Menambahkan supplier: ${newSupplier.name}`, currentUsername);
      }
    } catch (error) { console.error("Gagal menambah supplier:", error); }
  };

  const deleteSupplier = async (id) => {
    const currentUsername = user?.username || user?.primaryEmailAddress?.emailAddress || 'Admin';
    try {
      const target = suppliers.find(s => s.id === id);
      await sql`DELETE FROM suppliers WHERE id = ${id}`;
      setSuppliers(prev => prev.filter(s => s.id !== id));
      if (target) await logTransaction('HAPUS SUPPLIER', `Menghapus supplier: ${target.name}`, currentUsername);
    } catch (error) { console.error("Gagal menghapus supplier:", error); }
  };

  // Fungsi Item CRUD standar
  const addItem = async (newItem) => {
    const currentUsername = user?.username || user?.primaryEmailAddress?.emailAddress || 'Admin';
    try {
      const result = await sql`
        INSERT INTO items (name, category, stock, price, added_by)
        VALUES (${newItem.name}, ${newItem.category}, ${newItem.stock}, ${newItem.price}, ${currentUsername})
        RETURNING *
      `;
      if (result && result[0]) {
        setItems(prev => [result[0], ...prev]);
        await logTransaction('TAMBAH BARANG', `Menambahkan barang: ${newItem.name}`, currentUsername);
      }
    } catch (error) { console.error("Gagal menambah barang:", error); }
  };

  const updateItem = async (id, updatedData) => {
    const currentUsername = user?.username || user?.primaryEmailAddress?.emailAddress || 'Admin';
    try {
      const result = await sql`UPDATE items SET name = ${updatedData.name}, category = ${updatedData.category}, stock = ${updatedData.stock}, price = ${updatedData.price} WHERE id = ${id} RETURNING *`;
      if (result && result[0]) {
        setItems(prev => prev.map(item => item.id === id ? result[0] : item));
        await logTransaction('UBAH BARANG', `Update barang: ${updatedData.name}`, currentUsername);
      }
    } catch (error) { console.error("Gagal update barang:", error); }
  };

  const deleteItem = async (id) => {
    const currentUsername = user?.username || user?.primaryEmailAddress?.emailAddress || 'Admin';
    try {
      const target = items.find(i => i.id === id);
      await sql`DELETE FROM items WHERE id = ${id}`;
      setItems(prev => prev.filter(item => item.id !== id));
      if (target) await logTransaction('HAPUS BARANG', `Menghapus: ${target.name}`, currentUsername);
    } catch (error) { console.error("Gagal hapus barang:", error); }
  };

  const submitStockOpname = async (opnameResults) => {
    const currentUsername = user?.username || user?.primaryEmailAddress?.emailAddress || 'Admin';
    try {
      for (const op of opnameResults) {
        await sql`UPDATE items SET stock = ${op.physicalStock} WHERE id = ${op.id}`;
      }
      const updated = await sql`SELECT * FROM items ORDER BY id DESC`;
      setItems(updated);
      await logTransaction('STOCK OPNAME', `Update ${opnameResults.length} item.`, currentUsername);
    } catch (error) { console.error("Gagal opname:", error); }
  };

  return (
    <InventoryContext.Provider value={{ items, transactions, suppliers, companyName, addItem, updateItem, deleteItem, addSupplier, deleteSupplier, submitStockOpname, setCompanyName, loading }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => useContext(InventoryContext);