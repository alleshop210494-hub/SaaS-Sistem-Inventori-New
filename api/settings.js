import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  const { user_id } = req.query;

  try {
    if (req.method === 'GET') {
      const result = await sql`SELECT company_name FROM profiles WHERE user_id = ${user_id}`;
      return res.status(200).json(result.rows[0] || { company_name: 'Nama Perusahaan' });
    }

    if (req.method === 'POST') {
      const { company_name } = req.body;
      await sql`
        INSERT INTO profiles (user_id, company_name) 
        VALUES (${user_id}, ${company_name})
        ON CONFLICT (user_id) DO UPDATE SET company_name = ${company_name}
      `;
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: error.message });
  }
}