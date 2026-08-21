export const exportToExcel = (items, filename = 'Laporan_Inventori.xls', companyName = 'Nama Perusahaan') => {
  if (!items || items.length === 0) {
    alert('Tidak ada data untuk diexport.');
    return;
  }

  const totalValue = items.reduce((acc, curr) => acc + (Number(curr.stock || 0) * Number(curr.price || 0)), 0);

  let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
  <?mso-application progid="Excel.Sheet"?>
  <Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
    xmlns:o="urn:schemas-microsoft-com:office:office"
    xmlns:x="urn:schemas-microsoft-com:office:excel"
    xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
    xmlns:html="http://www.w3.org/TR/REC-html40">
    <Styles>
      <Style ss:ID="Header">
        <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
        <Borders>
          <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
          <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
          <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
          <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
        </Borders>
        <Font ss:Bold="1" ss:Color="#FFFFFF" ss:Size="11" ss:FontName="Arial"/>
        <Interior ss:Color="#0F172A" ss:Pattern="Solid"/>
      </Style>
      <Style ss:ID="Title">
        <Font ss:Bold="1" ss:Size="16" ss:Color="#0F172A" ss:FontName="Arial"/>
      </Style>
      <Style ss:ID="Subtitle">
        <Font ss:Bold="1" ss:Size="12" ss:Color="#334155" ss:FontName="Arial"/>
      </Style>
      <Style ss:ID="MetaText">
        <Font ss:Size="10" ss:Color="#475569" ss:FontName="Arial"/>
      </Style>
      <Style ss:ID="CellData">
        <Alignment ss:Vertical="Center"/>
        <Borders>
          <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
          <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
          <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
          <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
        </Borders>
        <Font ss:Size="10" ss:FontName="Arial"/>
      </Style>
      <Style ss:ID="CellCenter">
        <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
        <Borders>
          <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
          <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
          <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
          <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
        </Borders>
        <Font ss:Size="10" ss:FontName="Arial"/>
      </Style>
      <Style ss:ID="CellNumber">
        <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
        <Borders>
          <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
          <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
          <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
          <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
        </Borders>
        <Font ss:Size="10" ss:FontName="Arial"/>
        <NumberFormat ss:Format="#,##0"/>
      </Style>
      <Style ss:ID="FooterStyle">
        <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
        <Borders>
          <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
          <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
          <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
          <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
        </Borders>
        <Font ss:Bold="1" ss:Size="10" ss:FontName="Arial"/>
        <Interior ss:Color="#F1F5F9" ss:Pattern="Solid"/>
      </Style>
    </Styles>
    <Worksheet ss:Name="Laporan Inventori">
      <Table>
        <Column ss:Width="40"/>
        <Column ss:Width="180"/>
        <Column ss:Width="110"/>
        <Column ss:Width="100"/>
        <Column ss:Width="60"/>
        <Column ss:Width="120"/>
        <Column ss:Width="130"/>
        
        <Row ss:Height="28">
          <Cell ss:StyleID="Title"><Data ss:Type="String">${companyName}</Data></Cell>
        </Row>
        <Row ss:Height="20">
          <Cell ss:StyleID="Subtitle"><Data ss:Type="String">Laporan Ringkasan Eksekutif Inventori</Data></Cell>
        </Row>
        <Row ss:Height="18">
          <Cell ss:StyleID="MetaText"><Data ss:Type="String">Tanggal Cetak: ${new Date().toLocaleString('id-ID')} | Total Jenis Barang: ${items.length} Item</Data></Cell>
        </Row>
        <Row ss:Height="10"/>
        
        <Row ss:Height="25">
          <Cell ss:StyleID="Header"><Data ss:Type="String">No</Data></Cell>
          <Cell ss:StyleID="Header"><Data ss:Type="String">Nama Barang</Data></Cell>
          <Cell ss:StyleID="Header"><Data ss:Type="String">Kategori</Data></Cell>
          <Cell ss:StyleID="Header"><Data ss:Type="String">SKU</Data></Cell>
          <Cell ss:StyleID="Header"><Data ss:Type="String">Stok</Data></Cell>
          <Cell ss:StyleID="Header"><Data ss:Type="String">Harga Satuan (Rp)</Data></Cell>
          <Cell ss:StyleID="Header"><Data ss:Type="String">Total Nilai (Rp)</Data></Cell>
        </Row>`;

  items.forEach((item, index) => {
    const stock = Number(item.stock || 0);
    const price = Number(item.price || 0);
    const total = stock * price;
    const safeName = (item.name || '-').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const safeCategory = (item.category || '-').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const safeSku = (item.sku || '-').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    xmlContent += `
        <Row ss:Height="20">
          <Cell ss:StyleID="CellCenter"><Data ss:Type="Number">${index + 1}</Data></Cell>
          <Cell ss:StyleID="CellData"><Data ss:Type="String">${safeName}</Data></Cell>
          <Cell ss:StyleID="CellData"><Data ss:Type="String">${safeCategory}</Data></Cell>
          <Cell ss:StyleID="CellData"><Data ss:Type="String">${safeSku}</Data></Cell>
          <Cell ss:StyleID="CellNumber"><Data ss:Type="Number">${stock}</Data></Cell>
          <Cell ss:StyleID="CellNumber"><Data ss:Type="Number">${price}</Data></Cell>
          <Cell ss:StyleID="CellNumber"><Data ss:Type="Number">${total}</Data></Cell>
        </Row>`;
  });

  xmlContent += `
        <Row ss:Height="22">
          <Cell ss:StyleID="FooterStyle" ss:Index="1" ss:MergeAcross="5"><Data ss:Type="String">Total Keseluruhan Nilai Inventori:</Data></Cell>
          <Cell ss:StyleID="FooterStyle" ss:Index="7"><Data ss:Type="Number">${totalValue}</Data></Cell>
        </Row>
      </Table>
    </Worksheet>
  </Workbook>`;

  const blob = new Blob([xmlContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};