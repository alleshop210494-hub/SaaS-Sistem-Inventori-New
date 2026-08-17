import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      const { rows } = await pool.query('SELECT * FROM items ORDER BY id DESC');
      return res.status(200).json(rows);
    }

    if (req.method === 'POST') {
      const { name, category, sku, stock, price } = req.body;
      const query = 'INSERT INTO items (name, category, sku, stock, price) VALUES ($1, $2, $3, $4, $5) RETURNING *';
      const values = [name, category, sku, stock, price];
      const { rows } = await pool.query(query, values);
      return res.status(200).json(rows[0]);
    }

    if (req.method === 'PUT') {
      const { id } = req.query;
      const { name, category, sku, stock, price } = req.body;
      const query = 'UPDATE items SET name = COALESCE($1, name), category = COALESCE($2, category), sku = COALESCE($3, sku), stock = COALESCE($4, stock), price = COALESCE($5, price) WHERE id = $6 RETURNING *';
      const values = [name, category, sku, stock, price, id];
      const { rows } = await pool.query(query, values);
      return res.status(200).json(rows[0]);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      await pool.query('DELETE FROM items WHERE id = $1', [id]);
      return res.status(200).json({ success: true });
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: error.message });
  }
}