import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';

export function InventorySuppliers() {
  const { suppliers = [], addSupplier, updateSupplier, deleteSupplier } = useInventory() || {};

  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Nama supplier tidak boleh kosong!');
      return;
    }

    if (editingId) {
      updateSupplier(editingId, { name, contact, email, address });
      setEditingId(null);
    } else {
      addSupplier({ name, contact, email, address });
    }

    setName('');
    setContact('');
    setEmail('');
    setAddress('');
  };

  const handleEdit = (supplier) => {
    setEditingId(supplier.id || supplier._id);
    setName(supplier.name || '');
    setContact(supplier.contact || '');
    setEmail(supplier.email || '');
    setAddress(supplier.address || '');
  };

  const handleDelete = (id) => {
    if (window.confirm('Yakin ingin menghapus supplier ini?')) {
      deleteSupplier(id);
    }
  };

  const exportToExcel = () => {
    if (suppliers.length === 0) {
      alert('Tidak ada data supplier untuk diexport.');
      return;
    }
    const dataToExport = suppliers.map(s => ({
      'Nama Supplier': s.name,
      'Kontak': s.contact,
      'Email': s.email,
      'Alamat': s.address
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
    link.setAttribute('download', `Laporan_Supplier_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    if (suppliers.length === 0) {
      alert('Tidak ada data supplier untuk diexport ke PDF.');
      return;
    }
    const printWindow = window.open('', '_blank');
    const headers = ['No', 'Nama Supplier / Mitra', 'Kontak / Telepon', 'Email', 'Alamat'];
    const rows = suppliers.map((s, idx) => [
      idx + 1,
      s.name,
      s.contact || '-',
      s.email || '-',
      s.address || '-'
    ]);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Laporan Data Supplier & Mitra</title>
        <style>
          body { font-family: Arial, sans-serif; color: #1e293b; margin: 30px; }
          .header { text-align: center; margin-bottom: 25px; border-bottom: 3px solid #0f172a; padding-bottom: 15px; }
          .header h1 { margin: 0; font-size: 20px; font-weight: bold; text-transform: uppercase; color: #0f172a; }
          .header p { margin: 5px 0 0; font-size: 11px; color: #475569; }
          .meta { margin-bottom: 20px; font-size: 12px; display: flex; justify-content: space-between; }
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
          <p>Laporan Resmi Daftar Supplier & Mitra Perusahaan</p>
        </div>
        <div class="meta">
          <div><strong>Total Supplier:</strong> ${suppliers.length} Vendor</div>
          <div><strong>Tanggal Cetak:</strong> ${new Date().toLocaleString('id-ID')}</div>
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
            <p><strong>Admin Pembelian</strong></p>
          </div>
          <div class="sign-box">
            <p>Disetujui Oleh,</p>
            <div class="sign-space"></div>
            <p><strong>Manajer Operasional</strong></p>
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
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold tracking-wide">Kelola Supplier & Mitra</h2>
        <p className="text-xs text-slate-300 mt-1">Tambah, ubah, dan pantau daftar supplier atau vendor perusahaan Anda.</p>
      </div>

      {/* Form Supplier */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {editingId ? 'Edit Data Supplier' : 'Tambah Supplier Baru'}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Nama Supplier / Mitra</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Contoh: PT Sumber Makmur"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">No. Telepon / Kontak</label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Contoh: 08123456789"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Contoh: info@supplier.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Alamat</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Contoh: Jl. Raya Industri No. 10"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
          <div className="md:col-span-2 flex justify-end gap-2 mt-2">
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setName('');
                  setContact('');
                  setEmail('');
                  setAddress('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                style={{ color: '#374151' }}
              >
                Batal
              </button>
            )}
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-sm font-medium transition-colors shadow-md"
              style={{ backgroundColor: '#0f172a', color: '#ffffff' }}
            >
              {editingId ? 'Simpan Perubahan' : 'Tambah Supplier'}
            </button>
          </div>
        </form>
      </div>

      {/* Tabel Supplier */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <h3 className="text-lg font-semibold text-gray-800">Daftar Supplier</h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={exportToExcel}
              className="px-3.5 py-2 rounded-lg text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
              style={{ backgroundColor: '#059669', color: '#ffffff' }}
            >
              Export Excel
            </button>
            <button
              type="button"
              onClick={exportToPDF}
              className="px-3.5 py-2 rounded-lg text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
              style={{ backgroundColor: '#e11d48', color: '#ffffff' }}
            >
              Export PDF
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="py-3 px-6 font-medium">Nama Supplier</th>
                <th className="py-3 px-6 font-medium">Kontak</th>
                <th className="py-3 px-6 font-medium">Email</th>
                <th className="py-3 px-6 font-medium">Alamat</th>
                <th className="py-3 px-6 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {suppliers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-400">
                    Belum ada data supplier terdaftar.
                  </td>
                </tr>
              ) : (
                suppliers.map((sup) => {
                  const id = sup.id || sup._id;
                  return (
                    <tr key={id || Math.random()} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 font-medium text-gray-900">{sup.name}</td>
                      <td className="py-4 px-6 text-gray-600">{sup.contact || '-'}</td>
                      <td className="py-4 px-6 text-gray-600">{sup.email || '-'}</td>
                      <td className="py-4 px-6 text-gray-600">{sup.address || '-'}</td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(sup)}
                          className="font-medium text-xs px-2.5 py-1 rounded-lg transition-colors"
                          style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(id)}
                          className="font-medium text-xs px-2.5 py-1 rounded-lg transition-colors"
                          style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default InventorySuppliers;