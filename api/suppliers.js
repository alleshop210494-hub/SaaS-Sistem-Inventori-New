import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.NEON_DATABASE_URL);

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
      const suppliers = await sql.query('SELECT * FROM suppliers ORDER BY id DESC');
      return res.status(200).json({ success: true, data: suppliers });
    }

    if (req.method === 'POST') {
      const { name, contactPerson, phone, email, address } = req.body;
      
      if (!name) {
        return res.status(400).json({ success: false, message: 'Nama supplier wajib diisi.' });
      }

      const result = await sql.query(
        `INSERT INTO suppliers (name, contact_person, phone, email, address) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [name, contactPerson || '', phone || '', email || '', address || '']
      );

      return res.status(201).json({ success: true, data: result[0] });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ success: false, message: 'ID supplier diperlukan.' });
      }

      await sql.query('DELETE FROM suppliers WHERE id = $1', [id]);
      return res.status(200).json({ success: true, message: 'Supplier berhasil dihapus.' });
    }

    return res.status(405).json({ success: false, message: 'Metode tidak diizinkan.' });
  } catch (error) {
    console.error('Database Error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Terjadi kesalahan pada server.' });
  }
}