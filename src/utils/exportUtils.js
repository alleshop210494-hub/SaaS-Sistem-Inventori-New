import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Sanitasi nilai untuk mencegah CSV / Formula Injection.
 * Karakter =, +, -, @ di awal string akan dinetralkan dengan tanda petik tunggal.
 */
const sanitizeCSVCell = (val) => {
  if (val === null || val === undefined) return '""';
  let str = String(val).trim();
  
  // Netralkan karakter eksekusi formula Excel
  if (/^[=\+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }
  
  // Escape tanda petik ganda
  return `"${str.replace(/"/g, '""')}"`;
};

// Export ke CSV / Excel dengan proteksi CSV Injection
export const exportToCSV = (data, filename = 'export.csv') => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    alert('Tidak ada data valid untuk diexport.');
    return;
  }

  const keys = Object.keys(data[0]);
  const headerRow = keys.map(key => `"${key.replace(/"/g, '""')}"`).join(',');
  
  const dataRows = data.map(row => 
    keys.map(key => sanitizeCSVCell(row[key])).join(',')
  );

  const csvContent = [headerRow, ...dataRows].join('\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' }); // \uFEFF untuk support UTF-8 BOM Excel
  
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename.replace(/[^a-zA-Z0-9_\-\.]/g, '_')); // Sanitasi nama file
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Export ke PDF yang Aman
export const exportToPDF = (
  data, 
  columnsOrTitle = [], 
  titleOrFilename = 'Laporan', 
  filenameOpt = 'export.pdf', 
  companyName = ''
) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    alert('Tidak ada data valid untuk diexport.');
    return;
  }

  try {
    const doc = new jsPDF();

    let columns = columnsOrTitle;
    let title = titleOrFilename;
    let filename = filenameOpt;

    if (!Array.isArray(columns)) {
      filename = titleOrFilename || 'export.pdf';
      title = columnsOrTitle || 'Laporan Inventori';
      const keys = Object.keys(data[0]);
      columns = keys.map(key => ({ header: key.toUpperCase(), dataKey: key }));
    }

    let startY = 18;

    // Title Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(String(title), 14, startY);
    startY += 7;

    // Company Name Subheader
    if (companyName) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(80);
      doc.text(`Perusahaan: ${String(companyName)}`, 14, startY);
      startY += 6;
    }

    // Timestamp
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(120);
    doc.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 14, startY);
    startY += 6;

    // Table AutoTable Integration
    const headers = columns.map(col => String(col.header || ''));
    const body = data.map(row => columns.map(col => {
      const val = row[col.dataKey] !== undefined ? row[col.dataKey] : (row[col.header] !== undefined ? row[col.header] : '');
      return String(val ?? '');
    }));

    autoTable(doc, {
      head: [headers],
      body: body,
      startY: startY + 2,
      theme: 'grid',
      headStyles: { fillColor: [234, 88, 12], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 8, cellPadding: 3, overflow: 'linebreak' },
      alternateRowStyles: { fillColor: [255, 247, 237] }
    });

    const safeFilename = String(filename).replace(/[^a-zA-Z0-9_\-\.]/g, '_');
    doc.save(safeFilename);
  } catch (error) {
    console.error("Gagal membuat PDF:", error);
    alert("Terjadi kesalahan teknis saat membuat file PDF.");
  }
};