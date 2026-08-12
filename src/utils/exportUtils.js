import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToCSV = (data, filename = 'laporan-inventori.csv') => {
  if (!data || data.length === 0) {
    alert("Tidak ada data untuk di-export");
    return;
  }
  const headers = ['Nama Barang', 'Kategori', 'Stok', 'Harga'];
  const rows = data.map(item => [`"${item.name}"`, `"${item.category}"`, item.stock, item.price]);
  const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToPDF = (data, companyName = 'CloudInventory', filename = 'laporan-inventori.pdf') => {
  if (!data || data.length === 0) {
    alert("Tidak ada data untuk di-export ke PDF");
    return;
  }
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text(`Laporan Inventori - ${companyName}`, 14, 20);
  
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 14, 28);

  const tableColumn = ["Nama Barang", "Kategori", "Stok", "Harga Satuan"];
  const tableRows = data.map(item => [
    item.name,
    item.category,
    item.stock,
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.price)
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 35,
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229] },
  });

  doc.save(filename);
};

export const exportStockOpnameToPDF = (items, counts, companyName = 'CloudInventory', filename = 'laporan-stock-opname.pdf') => {
  if (!items || items.length === 0) {
    alert("Tidak ada data Stock Opname untuk di-export ke PDF");
    return;
  }
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text(`Laporan Stock Opname Fisik - ${companyName}`, 14, 20);
  
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 14, 28);

  const tableColumn = ["Nama Barang", "Kategori", "Stok Sistem", "Stok Fisik", "Selisih"];
  const tableRows = items.map(item => {
    const physicalVal = counts[item.id] !== undefined ? counts[item.id] : item.stock;
    const diff = Number(physicalVal) - Number(item.stock);
    const diffText = diff === 0 ? "0" : diff > 0 ? `+${diff}` : `${diff}`;
    return [
      item.name,
      item.category,
      item.stock,
      physicalVal,
      diffText
    ];
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 35,
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229] },
  });

  doc.save(filename);
};