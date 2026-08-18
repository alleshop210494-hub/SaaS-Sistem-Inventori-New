import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { InventoryControls } from './InventoryControls';
import { InventoryCharts } from './InventoryCharts';
import { InventoryTable } from './InventoryTable';
import { InventorySuppliers } from './InventorySuppliers';
import { InventoryTransactions } from './InventoryTransactions';
import { InventoryStockOpname } from './InventoryStockOpname';
import { InventoryForm } from './InventoryForm';

export function InventoryDashboard() {
  const { items = [], suppliers = [], transactions = [], loading, refreshData } = useInventory() || {};
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const exportDashboardToExcel = () => {
    if (items.length === 0) {
      alert('Tidak ada data ringkasan untuk diexport.');
      return;
    }
    const dataToExport = items.map(item => ({
      'Nama Barang': item.name,
      'Kategori': item.category,
      'SKU': item.sku,
      'Stok': item.stock,
      'Harga Satuan (Rp)': item.price
    }));
    const keys = Object.keys(dataToExport[0]);
    const csvContent = [
      keys.join(','),
      ...dataToExport.map(row => keys.map(key => `"${String(row[key] || '').replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Ringkasan_Dashboard_Inventori_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportDashboardToPDF = () => {
    if (items.length === 0) {
      alert('Tidak ada data ringkasan untuk diexport ke PDF.');
      return;
    }
    const printWindow = window.open('', '_blank');
    const totalValue = items.reduce((acc, curr) => acc + (Number(curr.stock || 0) * Number(curr.price || 0)), 0);
    const headers = ['No', 'Nama Barang', 'Kategori', 'SKU', 'Stok', 'Harga (Rp)', 'Total Nilai (Rp)'];
    const rows = items.map((item, idx) => [
      idx + 1,
      item.name,
      item.category,
      item.sku,
      item.stock,
      Number(item.price || 0).toLocaleString('id-ID'),
      (Number(item.stock || 0) * Number(item.price || 0)).toLocaleString('id-ID')
    ]);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Laporan Ringkasan Dashboard Inventori</title>
        <style>
          body { font-family: Arial, sans-serif; color: #1e293b; margin: 30px; }
          .header { text-align: center; margin-bottom: 25px; border-bottom: 3px solid #0f172a; padding-bottom: 15px; }
          .header h1 { margin: 0; font-size: 20px; font-weight: bold; text-transform: uppercase; color: #0f172a; }
          .header p { margin: 5px 0 0; font-size: 11px; color: #475569; }
          .meta { margin-bottom: 20px; font-size: 12px; display: flex; justify-content: space-between; }
          .summary-cards { display: flex; gap: 15px; margin-bottom: 25px; }
          .card { border: 1px solid #cbd5e1; padding: 10px 15px; border-radius: 6px; flex: 1; background: #f8fafc; }
          .card h4 { margin: 0 0 5px; font-size: 11px; color: #64748b; text-transform: uppercase; }
          .card p { margin: 0; font-size: 16px; font-weight: bold; color: #0f172a; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 40px; font-size: 11px; }
          th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; }
          th { background-color: #0f172a; color: #ffffff; font-weight: bold; text-transform: uppercase; }
          tr:nth-child(even) { background-color: #f8fafc; }
          .footer { margin-top: 40px; display: flex; justify-content: space-between; font-size: 11px; }
          .sign-box { text-align: center; width: 180px; }
          .sign-space { height: 50px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>PT. Perusahaan Saya</h1>
          <p>Laporan Ringkasan Eksekutif & Statistik Inventori Perusahaan</p>
        </div>
        <div class="meta">
          <div><strong>Total Jenis Barang:</strong> ${items.length} Item</div>
          <div><strong>Total Nilai Inventori:</strong> Rp ${totalValue.toLocaleString('id-ID')}</div>
          <div><strong>Tanggal Cetak:</strong> ${new Date().toLocaleString('id-ID')}</div>
        </div>
        <div class="summary-cards">
          <div class="card">
            <h4>Total Barang</h4>
            <p>${items.length}</p>
          </div>
          <div class="card">
            <h4>Total Supplier</h4>
            <p>${suppliers.length}</p>
          </div>
          <div class="card">
            <h4>Total Transaksi / Log</h4>
            <p>${transactions.length}</p>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              ${headers.map(h => `<th>${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${rows.map(row => `<tr>${row.map(cell => `<td>${cell !== undefined && cell !== null ? cell : '-'}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
        <div class="footer">
          <div class="sign-box">
            <p>Dibuat Oleh,</p>
            <div class="sign-space"></div>
            <p><strong>Admin Inventori</strong></p>
          </div>
          <div class="sign-box">
            <p>Disetujui Oleh,</p>
            <div class="sign-space"></div>
            <p><strong>Direktur Utama</strong></p>
          </div>
        </div>
        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Navigation Tabs */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Sistem Manajemen Inventori</h1>
          <p className="text-xs text-gray-500 mt-1">Kelola stok barang, supplier, audit fisik, dan riwayat transaksi secara real-time.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setEditingItem(null);
              setShowAddModal(true);
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold shadow-md transition-colors flex items-center gap-2"
            style={{ backgroundColor: '#0f172a', color: '#ffffff' }}
          >
            + Tambah Barang
          </button>
          <button
            type="button"
            onClick={refreshData}
            className="px-3 py-2 rounded-xl text-xs font-semibold transition-colors"
            style={{ backgroundColor: '#f3f4f6', color: '#374151' }}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto gap-2 border-b border-gray-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('dashboard')}
          className="px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all"
          style={{
            backgroundColor: activeTab === 'dashboard' ? '#0f172a' : '#ffffff',
            color: activeTab === 'dashboard' ? '#ffffff' : '#4b5563',
            border: activeTab === 'dashboard' ? 'none' : '1px solid #e5e7eb'
          }}
        >
          Dashboard & Statistik
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('items')}
          className="px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all"
          style={{
            backgroundColor: activeTab === 'items' ? '#0f172a' : '#ffffff',
            color: activeTab === 'items' ? '#ffffff' : '#4b5563',
            border: activeTab === 'items' ? 'none' : '1px solid #e5e7eb'
          }}
        >
          Manajemen Barang ({items.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('suppliers')}
          className="px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all"
          style={{
            backgroundColor: activeTab === 'suppliers' ? '#0f172a' : '#ffffff',
            color: activeTab === 'suppliers' ? '#ffffff' : '#4b5563',
            border: activeTab === 'suppliers' ? 'none' : '1px solid #e5e7eb'
          }}
        >
          Supplier & Mitra ({suppliers.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('transactions')}
          className="px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all"
          style={{
            backgroundColor: activeTab === 'transactions' ? '#0f172a' : '#ffffff',
            color: activeTab === 'transactions' ? '#ffffff' : '#4b5563',
            border: activeTab === 'transactions' ? 'none' : '1px solid #e5e7eb'
          }}
        >
          Riwayat Transaksi ({transactions.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('opname')}
          className="px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all"
          style={{
            backgroundColor: activeTab === 'opname' ? '#0f172a' : '#ffffff',
            color: activeTab === 'opname' ? '#ffffff' : '#4b5563',
            border: activeTab === 'opname' ? 'none' : '1px solid #e5e7eb'
          }}
        >
          Stock Opname
        </button>
      </div>

      {/* Tab Content */}
      {loading ? (
        <div className="py-20 text-center font-medium" style={{ color: '#6b7280' }}>Memuat data inventori...</div>
      ) : (
        <div>
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <span className="text-xs font-semibold" style={{ color: '#4b5563' }}>Export Laporan Ringkasan Eksekutif:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={exportDashboardToExcel}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-colors"
                    style={{ backgroundColor: '#059669', color: '#ffffff' }}
                  >
                    Export Excel
                  </button>
                  <button
                    type="button"
                    onClick={exportDashboardToPDF}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-colors"
                    style={{ backgroundColor: '#e11d48', color: '#ffffff' }}
                  >
                    Export PDF
                  </button>
                </div>
              </div>
              <InventoryControls />
              <InventoryCharts />
            </div>
          )}
          {activeTab === 'items' && (
            <InventoryTable
              onEdit={(item) => {
                setEditingItem(item);
                setShowAddModal(true);
              }}
            />
          )}
          {activeTab === 'suppliers' && <InventorySuppliers />}
          {activeTab === 'transactions' && <InventoryTransactions />}
          {activeTab === 'opname' && <InventoryStockOpname />}
        </div>
      )}

      {/* Modal Form Tambah / Edit Barang */}
      {showAddModal && (
        <InventoryForm
          editingItem={editingItem}
          initialData={editingItem}
          onCancelEdit={() => {
            setShowAddModal(false);
            setEditingItem(null);
          }}
          onClose={() => {
            setShowAddModal(false);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
}

export default InventoryDashboard;