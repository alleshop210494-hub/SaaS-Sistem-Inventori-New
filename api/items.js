import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.NEON_DATABASE_URL);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      const items = await sql`SELECT * FROM items ORDER BY id DESC`;
      return res.status(200).json({ success: true, data: items });
    }

    if (req.method === 'POST') {
      const { name, sku, stock, price, supplier_id, category } = req.body;
      
      const result = await sql`
        INSERT INTO items (name, sku, stock, price, supplier_id, category) 
        VALUES (${name}, ${sku}, ${stock || 0}, ${price || 0}, ${supplier_id || null}, ${category || ''}) 
        RETURNING *
      `;
      return res.status(201).json({ success: true, data: result[0] });
    }

    if (req.method === 'PUT') {
      const { id, name, sku, stock, price, supplier_id, category } = req.body;
      
      if (!id) {
        return res.status(400).json({ success: false, message: 'ID barang diperlukan.' });
      }

      const result = await sql`
        UPDATE items 
        SET name = ${name}, 
            sku = ${sku}, 
            stock = ${stock || 0}, 
            price = ${price || 0}, 
            supplier_id = ${supplier_id || null},
            category = ${category || ''}
        WHERE id = ${id}
        RETURNING *
      `;

      return res.status(200).json({ success: true, data: result[0] });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      await sql`DELETE FROM items WHERE id = ${id}`;
      return res.status(200).json({ success: true, message: 'Barang berhasil dihapus' });
    }

    return res.status(405).json({ success: false, message: 'Metode tidak diizinkan' });
  } catch (error) {
    console.error('Database Error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
}