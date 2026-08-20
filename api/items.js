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
          return res.status(400).json({ error: 'user_id is required' });
        }
        const { rows } = await pool.query(
          'SELECT * FROM products WHERE user_id = $1 ORDER BY id DESC',
          [userId]
        );
        return res.status(200).json(rows);
      }

      case 'POST': {
        const {
          name,
          category,
          sku,
          stock,
          price,
          image_url,
          added_by,
          supplier_id,
          custom_fields,
          user_id: bodyUserId
        } = req.body;

        // Ambil user_id dari body, jika kosong ambil dari query sebagai fallback
        const userId = bodyUserId || queryUserId;

        if (!userId) {
          return res.status(400).json({ error: 'user_id is required and cannot be null' });
        }

        const query = `
          INSERT INTO products (name, category, sku, stock, price, image_url, added_by, supplier_id, custom_fields, user_id)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          RETURNING *
        `;
        const values = [
          name,
          category || '',
          sku || '',
          stock || 0,
          price || 0,
          image_url || '',
          added_by || '',
          supplier_id ? parseInt(supplier_id) : null,
          custom_fields || {},
          userId
        ];

        const { rows } = await pool.query(query, values);
        return res.status(200).json(rows[0]);
      }

      case 'PUT': {
        const userId = req.body.user_id || queryUserId;
        if (!id || !userId) {
          return res.status(400).json({ error: 'id and user_id are required' });
        }

        const {
          name,
          category,
          sku,
          stock,
          price,
          image_url,
          added_by,
          supplier_id,
          custom_fields
        } = req.body;

        const query = `
          UPDATE products 
          SET name = COALESCE($1, name), 
              category = COALESCE($2, category), 
              sku = COALESCE($3, sku), 
              stock = COALESCE($4, stock), 
              price = COALESCE($5, price), 
              image_url = COALESCE($6, image_url), 
              added_by = COALESCE($7, added_by), 
              supplier_id = $8, 
              custom_fields = COALESCE($9, custom_fields) 
          WHERE id = $10 AND user_id = $11 
          RETURNING *
        `;
        const values = [
          name,
          category,
          sku,
          stock,
          price,
          image_url,
          added_by,
          supplier_id ? parseInt(supplier_id) : null,
          custom_fields,
          id,
          userId
        ];

        const { rows } = await pool.query(query, values);
        if (rows.length === 0) {
          return res.status(404).json({ error: 'Item not found or unauthorized' });
        }
        return res.status(200).json(rows[0]);
      }

      case 'DELETE': {
        const userId = queryUserId || req.body.user_id;
        if (!id || !userId) {
          return res.status(400).json({ error: 'id and user_id are required' });
        }

        const { rowCount } = await pool.query(
          'DELETE FROM products WHERE id = $1 AND user_id = $2',
          [id, userId]
        );
        if (rowCount === 0) {
          return res.status(404).json({ error: 'Item not found or unauthorized' });
        }
        return res.status(200).json({ success: true });
      }

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: error.message });
  }
}