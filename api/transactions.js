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

        const { rows } = await pool.query(
          'SELECT * FROM transactions WHERE user_id = $1 ORDER BY id DESC',
          [userId]
        );
        return res.status(200).json({ success: true, data: rows });
      }

      case 'POST': {
        const { product_id, type, quantity, notes, user_id: bodyUserId } = req.body;
        const userId = bodyUserId || queryUserId;

        if (!userId) {
          return res.status(400).json({ success: false, message: 'user_id diperlukan.' });
        }
        if (!product_id || !type || quantity === undefined) {
          return res.status(400).json({ success: false, message: 'product_id, type, dan quantity wajib diisi.' });
        }

        const query = `
          INSERT INTO transactions (product_id, type, quantity, notes, user_id) 
          VALUES ($1, $2, $3, $4, $5) 
          RETURNING *
        `;
        const values = [
          parseInt(product_id),
          type,
          parseInt(quantity),
          notes || '',
          userId
        ];

        const { rows } = await pool.query(query, values);
        return res.status(201).json({ success: true, data: rows[0] });
      }

      case 'DELETE': {
        const userId = queryUserId || req.body.user_id;
        if (!id || !userId) {
          return res.status(400).json({ success: false, message: 'ID dan user_id diperlukan.' });
        }

        const { rowCount } = await pool.query(
          'DELETE FROM transactions WHERE id = $1 AND user_id = $2',
          [id, userId]
        );

        if (rowCount === 0) {
          return res.status(404).json({ success: false, message: 'Transaksi tidak ditemukan atau tidak diizinkan.' });
        }
        return res.status(200).json({ success: true, message: 'Transaksi berhasil dihapus.' });
      }

      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Database Error (Transactions):', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}