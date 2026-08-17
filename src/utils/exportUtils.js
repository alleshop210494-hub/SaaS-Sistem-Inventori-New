// src/utils/exportUtils.js

export function getCompanyName() {
  try {
    return localStorage.getItem('inventory_company_name') || 'Perusahaan Saya';
  } catch (error) {
    return 'Perusahaan Saya';
  }
}

export function exportToPDF(title = 'Laporan Inventori', data = [], columns = []) {
  const companyName = getCompanyName();
  
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Mohon izinkan pop-up pada browser Anda untuk mencetak PDF.');
    return;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="id">
      <head>
        <meta charset="UTF-8">
        <title>${title} - ${companyName}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 30px; color: #1f2937; background: #fff; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #111827; padding-bottom: 15px; }
          .company-name { font-size: 24px; font-weight: bold; text-transform: uppercase; margin: 0; color: #111827; }
          .report-title { font-size: 16px; font-weight: 600; color: #4b5563; margin: 6px 0 0 0; }
          .date { font-size: 12px; color: #6b7280; margin-top: 6px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #e5e7eb; padding: 10px 12px; text-align: left; font-size: 13px; }
          th { background-color: #f9fafb; color: #374151; font-weight: bold; }
          .footer { margin-top: 40px; text-align: right; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 10px; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="company-name">${companyName}</h1>
          <div class="report-title">${title}</div>
          <div class="date">Tanggal Cetak: ${new Date().toLocaleString('id-ID')}</div>
        </div>
        <table>
          <thead>
            <tr>${columns.map(col => `<th>${col.header}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${data && data.length > 0 ? data.map(row => `
              <tr>${columns.map(col => `<td>${row[col.accessor] ?? '-'}</td>`).join('')}</tr>
            `).join('') : `<tr><td colspan="${columns.length}" style="text-align: center;">Tidak ada data</td></tr>`}
          </tbody>
        </table>
        <div class="footer">
          <p>Dokumen ini digenerase otomatis oleh Sistem Inventori — <strong>${companyName}</strong></p>
        </div>
        <script>
          window.onload = function() { window.print(); };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}