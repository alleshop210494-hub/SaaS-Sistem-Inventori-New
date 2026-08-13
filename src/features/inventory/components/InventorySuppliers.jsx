import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { exportToCSV, exportToPDF } from '../../../utils/exportUtils';

export const InventorySuppliers = () => {
  const { suppliers, addSupplier, deleteSupplier, companyName } = useInventory(); // Tambahkan companyName di sini
  const [formData, setFormData] = useState({ name: '', contactPerson: '', phone: '', email: '', address: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Sanitasi & Trim seluruh input form
    const sanitizedData = {
      name: formData.name.trim(),
      contactPerson: formData.contactPerson.trim(),
      phone: formData.phone.trim().replace(/[^0-9+\-\s()]/g, ''), // Hanya izinkan karakter nomor telepon valid
      email: formData.email.trim().toLowerCase(),
      address: formData.address.trim()
    };

    if (!sanitizedData.name) {
      alert("Nama supplier tidak boleh kosong.");
      return;
    }

    await addSupplier(sanitizedData);
    setFormData({ name: '', contactPerson: '', phone: '', email: '', address: '' });
  };

  const getFormattedDataForExport = () => {
    return suppliers.map((s, index) => ({
      No: index + 1,
      Nama: s.name,
      'Contact Person': s.contact_person || '-',
      Telepon: s.phone || '-',
      Email: s.email || '-',
      Alamat: s.address || '-'
    }));
  };

  const handleExportExcel = () => {
    if (suppliers.length === 0) return alert('Tidak ada data supplier.');
    exportToCSV(getFormattedDataForExport(), 'daftar-supplier.csv');
  };

  const handleExportPDF = () => {
    if (suppliers.length === 0) return alert('Tidak ada data supplier.');
    const columns = [
      { header: 'No', dataKey: 'No' },
      { header: 'Nama Supplier', dataKey: 'Nama' },
      { header: 'Contact Person', dataKey: 'Contact Person' },
      { header: 'Telepon', dataKey: 'Telepon' },
      { header: 'Email', dataKey: 'Email' },
      { header: 'Alamat', dataKey: 'Alamat' }
    ];
    // Masukkan companyName sebagai parameter tambahan
    exportToPDF(getFormattedDataForExport(), columns, 'Laporan Daftar Supplier', 'daftar-supplier.pdf', companyName);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-orange-100 shadow-sm">
        <span className="text-[10px] font-extrabold tracking-widest text-orange-400 uppercase">Input Data</span>
        <h2 className="text-xl font-bold text-orange-950 mt-1">Tambah Supplier Baru</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <input className="p-3 border border-orange-100 rounded-xl text-xs focus:ring-2 focus:ring-orange-200" placeholder="Nama Perusahaan/Supplier" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          <input className="p-3 border border-orange-100 rounded-xl text-xs" placeholder="Contact Person" value={formData.contactPerson} onChange={e => setFormData({...formData, contactPerson: e.target.value})} />
          <input className="p-3 border border-orange-100 rounded-xl text-xs" placeholder="Telepon" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
          <input className="p-3 border border-orange-100 rounded-xl text-xs" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          <input className="p-3 border border-orange-100 rounded-xl text-xs md:col-span-2" placeholder="Alamat Lengkap" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
          <button className="bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-xl font-bold text-xs md:col-span-2 transition-colors">Simpan Supplier</button>
        </form>
      </div>

      <div className="bg-white rounded-3xl border border-orange-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-orange-50 bg-[#FAF6EE]/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-xs font-bold text-orange-950 uppercase tracking-wider">Daftar Supplier</h3>
            <span className="text-[11px] text-orange-500 font-semibold mt-0.5 block">Total: {suppliers.length} Supplier</span>
          </div>
          <div className="flex items-center space-x-3">
            <button onClick={handleExportExcel} className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition-colors shadow-xs">Export Excel</button>
            <button onClick={handleExportPDF} className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors shadow-xs">Export PDF</button>
          </div>
        </div>

        <div className="divide-y divide-orange-50">
          {suppliers.length === 0 ? (
            <div className="p-12 text-center text-orange-400 text-xs">Belum ada data supplier.</div>
          ) : (
            suppliers.map(s => (
              <div key={s.id} className="p-5 flex justify-between items-center hover:bg-orange-50/40 transition-colors">
                <div>
                  <p className="text-xs font-bold text-orange-950">{s.name}</p>
                  <p className="text-[10px] text-orange-600/70">{s.contact_person} • {s.phone}</p>
                </div>
                <button onClick={() => {if(confirm('Hapus supplier ini?')) deleteSupplier(s.id)}} className="text-[10px] font-bold text-rose-600 hover:text-rose-800">Hapus</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};