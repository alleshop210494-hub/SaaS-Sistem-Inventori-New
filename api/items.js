import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const sql = neon(process.env.NEON_DATABASE_URL);

    // GET: Ambil semua barang
    if (req.method === 'GET') {
      const items = await sql('SELECT * FROM items ORDER BY id DESC');
      return res.status(200).json({ success: true, data: items });
    }

    // POST: Tambah barang baru
    if (req.method === 'POST') {
      const { name, sku, stock, price, supplier_id } = req.body;
      
      const result = await sql(
        `INSERT INTO items (name, sku, stock, price, supplier_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [name, sku, stock, price, supplier_id]
      );
      return res.status(201).json({ success: true, data: result[0] });
    }

    // DELETE: Hapus barang
    if (req.method === 'DELETE') {
      const { id } = req.query;
      await sql('DELETE FROM items WHERE id = $1', [id]);
      return res.status(200).json({ success: true, message: 'Barang berhasil dihapus' });
    }

    return res.status(405).json({ success: false, message: 'Metode tidak diizinkan' });
  } catch (error) {
    console.error('Database Error:', error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
}