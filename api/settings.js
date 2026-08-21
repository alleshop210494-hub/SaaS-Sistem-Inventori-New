import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default async function handler(req, res) {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    if (req.method === 'GET') {
      const query = 'SELECT company_name FROM profiles WHERE user_id = $1';
      const result = await pool.query(query, [user_id]);
      
      if (result.rows.length > 0) {
        return res.status(200).json(result.rows[0]);
      } else {
        return res.status(200).json({ company_name: 'Nama Perusahaan' });
      }
    }

    if (req.method === 'POST') {
      const { company_name } = req.body;
      const query = `
        INSERT INTO profiles (user_id, company_name) 
        VALUES ($1, $2)
        ON CONFLICT (user_id) DO UPDATE SET company_name = $2
      `;
      await pool.query(query, [user_id, company_name || 'Nama Perusahaan']);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Database error in /api/settings:', error);
    return res.status(500).json({ error: error.message });
  }
}