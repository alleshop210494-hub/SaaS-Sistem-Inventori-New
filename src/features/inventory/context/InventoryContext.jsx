import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
  const { user, isLoaded } = useUser();
  const [companyName, setCompanyName] = useState('Nama Perusahaan');
  const [items, setItems] = useState([]);

  // Load data dari Clerk Metadata saat user pertama kali dimuat
  useEffect(() => {
    if (isLoaded && user && user.publicMetadata?.companyName) {
      setCompanyName(user.publicMetadata.companyName);
    }
  }, [isLoaded, user]);

  // Fungsi wrapper untuk mengubah nama dan menyimpan ke server Clerk
  const updateCompanyName = async (newName) => {
    setCompanyName(newName);
    
    // Simpan ke server Clerk jika user sudah login
    if (user) {
      try {
        await user.update({
          publicMetadata: {
            ...user.publicMetadata,
            companyName: newName,
          },
        });
      } catch (err) {
        console.error("Gagal menyimpan nama perusahaan ke server:", err);
      }
    }
  };

  return (
    <InventoryContext.Provider
      value={{
        items,
        setItems,
        companyName,
        setCompanyName: updateCompanyName, // Gunakan fungsi update baru
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => useContext(InventoryContext);