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