import React, { createContext, useContext, useState, useEffect } from 'react';

const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('inventory_items');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            name: 'Laptop Asus ROG',
            category: 'Elektronik',
            stock: 15,
            price: 15000000,
          },
          {
            id: 2,
            name: 'Kertas HVS A4',
            category: 'ATK',
            stock: 120,
            price: 50000,
          },
          {
            id: 3,
            name: 'Mouse Logitech',
            category: 'Elektronik',
            stock: 50,
            price: 250000,
          },
        ];
  });

  useEffect(() => {
    localStorage.setItem('inventory_items', JSON.stringify(items));
  }, [items]);

  const addItem = (item) => {
    setItems((prev) => [...prev, { ...item, id: Date.now() }]);
  };

  const deleteItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateItem = (id, updatedItem) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedItem } : item))
    );
  };

  return (
    <InventoryContext.Provider
      value={{ items, addItem, deleteItem, updateItem }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => useContext(InventoryContext);
