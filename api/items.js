import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.NEON_DATABASE_URL);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      const items = await sql.query('SELECT * FROM items ORDER BY id DESC');
      return res.status(200).json({ success: true, data: items });
    }

    if (req.method === 'POST') {
      const { name, sku, stock, price, supplier_id } = req.body;
      
      const result = await sql.query(
        `INSERT INTO items (name, sku, stock, price, supplier_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [name, sku, stock || 0, price || 0, supplier_id || null]
      );
      return res.status(201).json({ success: true, data: result[0] });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      await sql.query('DELETE FROM items WHERE id = $1', [id]);
      return res.status(200).json({ success: true, message: 'Barang berhasil dihapus' });
    }

    return res.status(405).json({ success: false, message: 'Metode tidak diizinkan' });
  } catch (error) {
    console.error('Database Error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
}