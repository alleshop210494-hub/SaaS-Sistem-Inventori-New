import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';

export function InventoryTransactions() {
  const { items, transactions, addTransaction, loading } = useInventory();
  
  const [productId, setProductId] = useState('');
  const [type, setType] = useState('IN');
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productId || !quantity) return;

    await addTransaction({
      product_id: productId,
      type,
      quantity: Number(quantity),
      notes
    });

    setProductId('');
    setQuantity('');
    setNotes('');
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Manajemen Transaksi Inventori</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Produk</label>
          <select 
            value={productId} 
            onChange={(e) => setProductId(e.target.value)} 
            className="w-full border rounded p-2"
            required
          >
            <option value="">Pilih Produk</option>
            {items.map(item => (
              <option key={item.id} value={item.id}>
                {item.name} (Stok: {item.stock})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tipe Transaksi</label>
          <select 
            value={type} 
            onChange={(e) => setType(e.target.value)} 
            className="w-full border rounded p-2"
          >
            <option value="IN">Barang Masuk (IN)</option>
            <option value="OUT">Barang Keluar (OUT)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Jumlah</label>
          <input 
            type="number" 
            value={quantity} 
            onChange={(e) => setQuantity(e.target.value)} 
            className="w-full border rounded p-2" 
            placeholder="0"
            min="1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Catatan</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              className="w-full border rounded p-2" 
              placeholder="Keterangan..."
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Simpan
            </button>
          </div>
        </div>
      </form>

      <h3 className="text-lg font-semibold mb-3">Riwayat Transaksi</h3>
      {loading ? (
        <p>Memuat data transaksi...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200 text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 p-2">ID</th>
                <th className="border border-gray-200 p-2">Produk ID</th>
                <th className="border border-gray-200 p-2">Tipe</th>
                <th className="border border-gray-200 p-2">Jumlah</th>
                <th className="border border-gray-200 p-2">Catatan</th>
                <th className="border border-gray-200 p-2">Waktu</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-4 text-gray-500">Belum ada data transaksi.</td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="border border-gray-200 p-2">{tx.id}</td>
                    <td className="border border-gray-200 p-2">{tx.product_id}</td>
                    <td className="border border-gray-200 p-2">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${tx.type === 'IN' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="border border-gray-200 p-2">{tx.quantity}</td>
                    <td className="border border-gray-200 p-2">{tx.notes || '-'}</td>
                    <td className="border border-gray-200 p-2">{new Date(tx.created_at || Date.now()).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default InventoryTransactions;