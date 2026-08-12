import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Helper untuk format rupiah di PDF
const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
};

// Fungsi Export CSV
export const exportToCSV = (items, filename = 'laporan-inventori.csv') => {
  const headers = ['Nama Barang', 'Kategori', 'Stok', 'Harga Satuan', 'Total Nilai'];
  const rows = items.map(item => [
    `"${item.name}"`,
    `"${item.category}"`,
    item.stock,
    item.price,
    Number(item.stock) * Number(item.price)
  ]);

  const csvContent = "data:text/csv;charset=utf-8," 
    + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Fungsi Export PDF untuk Laporan Inventori
export const exportToPDF = (items, companyName = 'PT 12345', filename = 'laporan-inventori.pdf') => {
  try {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    // Header Laporan Perusahaan
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text(companyName, 14, 20);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text('Laporan Resmi Inventori Aset Perusahaan', 14, 27);

    doc.setFontSize(9);
    doc.text(`Tanggal Cetak: ${currentDate}`, 14, 34);

    // Garis Pembatas Header
    doc.setDrawColor(226, 232, 240);
    doc.line(14, 38, 196, 38);

    // Tabel Data Inventori
    const tableColumn = ["Nama Barang", "Kategori", "Stok", "Harga Satuan", "Total Nilai"];
    const tableRows = [];

    let totalAsetKeseluruhan = 0;

    items.forEach(item => {
      const totalNilaiItem = Number(item.stock) * Number(item.price);
      totalAsetKeseluruhan += totalNilaiItem;

      tableRows.push([
        item.name,
        item.category,
        String(item.stock),
        formatRupiah(item.price),
        formatRupiah(totalNilaiItem)
      ]);
    });

    // Menggunakan fungsi autoTable agar kompatibel dengan lingkungan Vite / WebContainer
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 44,
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 10 },
      bodyStyles: { fontSize: 9, textColor: [51, 65, 85] },
      columnStyles: {
        2: { halign: 'right' },
        3: { halign: 'right' },
        4: { halign: 'right' }
      }
    });

    // Total Nilai Aset Keseluruhan
    const finalY = doc.lastAutoTable.finalY || 100;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(`Total Keseluruhan Nilai Aset: ${formatRupiah(totalAsetKeseluruhan)}`, 14, finalY + 12);

    // Bagian Tanda Tangan (Signature Section) Enterprise Style
    const signY = finalY + 28;
    const pageHeight = doc.internal.pageSize.height;
    let targetSignY = signY;
    
    if (targetSignY + 40 > pageHeight) {
      doc.addPage();
      targetSignY = 30;
    }

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Dibuat Oleh,', 20, targetSignY);
    doc.text('Mengetahui / Disetujui Oleh,', 135, targetSignY);

    // Garis Tanda Tangan
    doc.line(20, targetSignY + 25, 75, targetSignY + 25);
    doc.line(135, targetSignY + 25, 190, targetSignY + 25);

    // Nama / Jabatan di bawah garis
    doc.setFont('helvetica', 'bold');
    doc.text('( Administrator / Staff )', 20, targetSignY + 31);
    doc.text('( Pimpinan / Manajer )', 135, targetSignY + 31);

    doc.save(filename);
  } catch (error) {
    console.error("Gagal mengekspor PDF:", error);
    alert("Terjadi kesalahan saat membuat file PDF: " + error.message);
  }
};

// Fungsi Export PDF untuk Stock Opname dengan Bagian Tanda Tangan
export const exportStockOpnameToPDF = (items, counts, companyName = 'PT 12345', filename = 'laporan-stock-opname.pdf') => {
  try {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    // Header Laporan Perusahaan
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(companyName, 14, 20);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text('Laporan Resmi Stock Opname Fisik Inventori', 14, 27);

    doc.setFontSize(9);
    doc.text(`Tanggal Cetak: ${currentDate}`, 14, 34);

    doc.setDrawColor(226, 232, 240);
    doc.line(14, 38, 196, 38);

    // Tabel Data Stock Opname
    const tableColumn = ["Nama Barang", "Kategori", "Stok Sistem", "Stok Fisik", "Selisih"];
    const tableRows = [];

    items.forEach(item => {
      const physicalVal = counts[item.id] !== undefined ? counts[item.id] : item.stock;
      const diff = Number(physicalVal) - Number(item.stock);
      const diffText = diff === 0 ? "0" : diff > 0 ? `+${diff}` : `${diff}`;

      tableRows.push([
        item.name,
        item.category,
        String(item.stock),
        String(physicalVal),
        diffText
      ]);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 44,
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 10 },
      bodyStyles: { fontSize: 9, textColor: [51, 65, 85] },
      columnStyles: {
        2: { halign: 'center' },
        3: { halign: 'center' },
        4: { halign: 'center' }
      }
    });

    const finalY = doc.lastAutoTable.finalY || 100;

    // Bagian Tanda Tangan (Signature Section) Stock Opname
    const signY = finalY + 25;
    const pageHeight = doc.internal.pageSize.height;
    let targetSignY = signY;
    
    if (targetSignY + 40 > pageHeight) {
      doc.addPage();
      targetSignY = 30;
    }

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Petugas Stock Opname,', 20, targetSignY);
    doc.text('Disetujui Oleh (Manajemen),', 135, targetSignY);

    doc.line(20, targetSignY + 25, 75, targetSignY + 25);
    doc.line(135, targetSignY + 25, 190, targetSignY + 25);

    doc.setFont('helvetica', 'bold');
    doc.text('( ___________________ )', 20, targetSignY + 31);
    doc.text('( ___________________ )', 135, targetSignY + 31);

    doc.save(filename);
  } catch (error) {
    console.error("Gagal mengekspor PDF Stock Opname:", error);
    alert("Terjadi kesalahan saat membuat file PDF Stock Opname: " + error.message);
  }
};