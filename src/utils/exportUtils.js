export const exportToExcel = (items, filename = 'Laporan_Inventori.xls') => {
  if (!items || items.length === 0) {
    alert('Tidak ada data untuk diexport.');
    return;
  }

  const totalValue = items.reduce((acc, curr) => acc + (Number(curr.stock || 0) * Number(curr.price || 0)), 0);

  let html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8" />
      <style>
        table { border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 11pt; }
        th { background-color: #0F172A; color: #FFFFFF; font-weight: bold; text-align: center; border: 1px solid #CBD5E1; padding: 10px; }
        td { border: 1px solid #CBD5E1; padding: 8px; vertical-align: middle; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .title { font-size: 14pt; font-weight: bold; color: #0F172A; margin-bottom: 5px; }
        .subtitle { font-size: 10pt; color: #475569; margin-bottom: 15px; }
        .footer-row { background-color: #F1F5F9; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="title">Laporan Ringkasan Eksekutif Inventori</div>
      <div class="subtitle">Tanggal Cetak: ${new Date().toLocaleString('id-ID')} | Total Jenis Barang: ${items.length} Item</div>
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Barang</th>
            <th>Kategori</th>
            <th>SKU</th>
            <th>Stok</th>
            <th>Harga Satuan (Rp)</th>
            <th>Total Nilai (Rp)</th>
          </tr>
        </thead>
        <tbody>
  `;

  items.forEach((item, index) => {
    const stock = Number(item.stock || 0);
    const price = Number(item.price || 0);
    const total = stock * price;
    html += `
          <tr>
            <td class="text-center">${index + 1}</td>
            <td>${item.name || '-'}</td>
            <td>${item.category || '-'}</td>
            <td>${item.sku || '-'}</td>
            <td class="text-right">${stock}</td>
            <td class="text-right">${price}</td>
            <td class="text-right">${total}</td>
          </tr>
    `;
  });

  html += `
          <tr class="footer-row">
            <td colspan="6" class="text-right">Total Keseluruhan Nilai Inventori:</td>
            <td class="text-right">${totalValue}</td>
          </tr>
        </tbody>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};