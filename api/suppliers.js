import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export default async function handler(req, res) {
  const { method } = req;
  const { id, user_id: queryUserId } = req.query;

  try {
    switch (method) {
      case 'GET': {
        const userId = queryUserId;
        if (!userId) {
          return res.status(400).json({ success: false, message: 'user_id diperlukan.' });
        }

        // Filter berdasarkan user_id agar data antar akun terisolasi
        const { rows } = await pool.query(
          'SELECT * FROM suppliers WHERE user_id = $1 ORDER BY id DESC',
          [userId]
        );
        return res.status(200).json({ success: true, data: rows });
      }

      case 'POST': {
        const { name, contact, email, address, user_id: bodyUserId } = req.body;
        const userId = bodyUserId || queryUserId;

        if (!userId) {
          return res.status(400).json({ success: false, message: 'user_id diperlukan.' });
        }
        if (!name) {
          return res.status(400).json({ success: false, message: 'Nama supplier wajib diisi.' });
        }

        const query = `
          INSERT INTO suppliers (name, contact, email, address, user_id) 
          VALUES ($1, $2, $3, $4, $5) 
          RETURNING *
        `;
        const values = [name, contact || '', email || '', address || '', userId];
        const { rows } = await pool.query(query, values);
        
        return res.status(201).json({ success: true, data: rows[0] });
      }

      case 'PUT': {
        const userId = req.body.user_id || queryUserId;
        if (!id || !userId) {
          return res.status(400).json({ success: false, message: 'ID dan user_id diperlukan.' });
        }

        const { name, contact, email, address } = req.body;
        const query = `
          UPDATE suppliers 
          SET name = COALESCE($1, name), 
              contact = COALESCE($2, contact), 
              email = COALESCE($3, email), 
              address = COALESCE($4, address) 
          WHERE id = $5 AND user_id = $6 
          RETURNING *
        `;
        const values = [name, contact, email, address, id, userId];
        const { rows } = await pool.query(query, values);

        if (rows.length === 0) {
          return res.status(404).json({ success: false, message: 'Supplier tidak ditemukan atau tidak diizinkan.' });
        }
        return res.status(200).json({ success: true, data: rows[0] });
      }

      case 'DELETE': {
        const userId = queryUserId || req.body.user_id;
        if (!id || !userId) {
          return res.status(400).json({ success: false, message: 'ID dan user_id diperlukan.' });
        }

        const { rowCount } = await pool.query(
          'DELETE FROM suppliers WHERE id = $1 AND user_id = $2',
          [id, userId]
        );

        if (rowCount === 0) {
          return res.status(404).json({ success: false, message: 'Supplier tidak ditemukan atau tidak diizinkan.' });
        }
        return res.status(200).json({ success: true, message: 'Supplier berhasil dihapus.' });
      }

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Database Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}