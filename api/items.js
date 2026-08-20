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
      const { rows } = await pool.query('SELECT * FROM products ORDER BY id DESC');
      return res.status(200).json(rows);
    }

    if (req.method === 'POST') {
      const { name, category, sku, stock, price, image_url, added_by, supplier_id, custom_fields } = req.body;
      const query = 'INSERT INTO products (name, category, sku, stock, price, image_url, added_by, supplier_id, custom_fields) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *';
      const values = [name, category, sku, stock, price, image_url, added_by, supplier_id || null, custom_fields || {}];
      const { rows } = await pool.query(query, values);
      return res.status(200).json(rows[0]);
    }

    if (req.method === 'PUT') {
      const { id } = req.query;
      const { name, category, sku, stock, price, image_url, added_by, supplier_id, custom_fields } = req.body;
      const query = 'UPDATE products SET name = COALESCE($1, name), category = COALESCE($2, category), sku = COALESCE($3, sku), stock = COALESCE($4, stock), price = COALESCE($5, price), image_url = COALESCE($6, image_url), added_by = COALESCE($7, added_by), supplier_id = $8, custom_fields = COALESCE($9, custom_fields) WHERE id = $10 RETURNING *';
      const values = [name, category, sku, stock, price, image_url, added_by, supplier_id || null, custom_fields || null, id];
      const { rows } = await pool.query(query, values);
      return res.status(200).json(rows[0]);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      await pool.query('DELETE FROM products WHERE id = $1', [id]);
      return res.status(200).json({ success: true });
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: error.message });
  }
}