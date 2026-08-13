import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Fungsi untuk Export ke CSV / Excel
export const exportToCSV = (data, filename = 'export.csv') => {
  if (!data || data.length === 0) {
    alert('Tidak ada data untuk diexport.');
    return;
  }

  const keys = Object.keys(data[0]);
  const csvContent = [
    keys.join(','),
    ...data.map(row => keys.map(key => `"${row[key] !== undefined ? row[key] : ''}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Fungsi untuk Export ke PDF yang aman dari error tipe data kolom
export const exportToPDF = (data, columnsOrTitle = [], titleOrFilename = 'Laporan', filenameOpt = 'export.pdf') => {
  if (!data || data.length === 0) {
    alert('Tidak ada data untuk diexport.');
    return;
  }

  try {
    const doc = new jsPDF();

    let columns = columnsOrTitle;
    let title = titleOrFilename;
    let filename = filenameOpt;

    // Jika parameter kedua bukan array (misal dikirim string judul), buat kolom otomatis dari key data
    if (!Array.isArray(columns)) {
      filename = titleOrFilename || 'export.pdf';
      title = columnsOrTitle || 'Laporan Inventori';
      const keys = Object.keys(data[0]);
      columns = keys.map(key => ({ header: key.toUpperCase(), dataKey: key }));
    }

    // Judul Dokumen
    doc.setFontSize(16);
    doc.text(title, 14, 20);

    // Timestamp / Waktu Cetak
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 14, 27);

    // Format header & body untuk jspdf-autotable
    const headers = columns.map(col => col.header);
    const body = data.map(row => columns.map(col => {
      const val = row[col.dataKey] !== undefined ? row[col.dataKey] : (row[col.header] !== undefined ? row[col.header] : '');
      return String(val);
    }));

    autoTable(doc, {
      head: [headers],
      body: body,
      startY: 32,
      theme: 'grid',
      headStyles: { fillColor: [234, 88, 12] }, // Warna Orange sesuai tema
      styles: { fontSize: 9, cellPadding: 4 }
    });

    doc.save(filename);
  } catch (error) {
    console.error("Gagal membuat PDF:", error);
    alert("Terjadi kesalahan saat membuat file PDF. Silakan periksa konsol.");
  }
};