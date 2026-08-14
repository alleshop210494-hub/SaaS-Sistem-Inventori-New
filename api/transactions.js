import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.NEON_DATABASE_URL);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      const transactions = await sql.query(`
        SELECT t.*, i.name as item_name 
        FROM transactions t 
        LEFT JOIN items i ON t.item_id = i.id 
        ORDER BY t.created_at DESC
      `);
      return res.status(200).json({ success: true, data: transactions });
    }

    if (req.method === 'POST') {
      const { item_id, type, quantity } = req.body;
      
      const result = await sql.query(
        `INSERT INTO transactions (item_id, type, quantity, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *`,
        [item_id, type, quantity]
      );

      return res.status(201).json({ success: true, data: result[0] });
    }

    return res.status(405).json({ success: false, message: 'Metode tidak diizinkan' });
  } catch (error) {
    console.error('Database Error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
}