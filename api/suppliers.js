import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.NEON_DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      const { rows } = await pool.query('SELECT * FROM suppliers ORDER BY id DESC');
      return res.status(200).json({ success: true, data: rows });
    }

    if (req.method === 'POST') {
      const { name, contact, email, address } = req.body;
      
      if (!name) {
        return res.status(400).json({ success: false, message: 'Nama supplier wajib diisi.' });
      }

      const query = `INSERT INTO suppliers (name, contact, email, address) VALUES ($1, $2, $3, $4) RETURNING *`;
      const values = [name, contact || '', email || '', address || ''];
      const { rows } = await pool.query(query, values);

      return res.status(201).json({ success: true, data: rows[0] });
    }

    if (req.method === 'PUT') {
      const { id } = req.query;
      const { name, contact, email, address } = req.body;
      
      if (!id) {
        return res.status(400).json({ success: false, message: 'ID supplier diperlukan.' });
      }

      const query = `UPDATE suppliers SET name = COALESCE($1, name), contact = COALESCE($2, contact), email = COALESCE($3, email), address = COALESCE($4, address) WHERE id = $5 RETURNING *`;
      const values = [name, contact, email, address, id];
      const { rows } = await pool.query(query, values);

      return res.status(200).json({ success: true, data: rows[0] });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ success: false, message: 'ID supplier diperlukan.' });
      }

      await pool.query('DELETE FROM suppliers WHERE id = $1', [id]);
      return res.status(200).json({ success: true, message: 'Supplier berhasil dihapus.' });
    }

    return res.status(405).json({ success: false, message: 'Metode tidak diizinkan.' });
  } catch (error) {
    console.error('Database Error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Terjadi kesalahan pada server.' });
  }
}