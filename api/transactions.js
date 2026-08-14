import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const sql = neon(process.env.NEON_DATABASE_URL);

    // GET: Ambil daftar transaksi
    if (req.method === 'GET') {
      // Mengambil transaksi dan join ke tabel items untuk nama barang
      const transactions = await sql(`
        SELECT t.*, i.name as item_name 
        FROM transactions t 
        LEFT JOIN items i ON t.item_id = i.id 
        ORDER BY t.created_at DESC
      `);
      return res.status(200).json({ success: true, data: transactions });
    }

    // POST: Tambah transaksi baru
    if (req.method === 'POST') {
      const { item_id, type, quantity } = req.body;
      
      const result = await sql(
        `INSERT INTO transactions (item_id, type, quantity, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *`,
        [item_id, type, quantity]
      );
      
      // Opsional: Update stok barang secara otomatis jika ingin fitur ini
      // await sql('UPDATE items SET stock = stock + $1 WHERE id = $2', [type === 'in' ? quantity : -quantity, item_id]);

      return res.status(201).json({ success: true, data: result[0] });
    }

    return res.status(405).json({ success: false, message: 'Metode tidak diizinkan' });
  } catch (error) {
    console.error('Database Error:', error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
}