import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const { rows } = await sql`SELECT * FROM items ORDER BY id DESC`;
      return res.status(200).json(rows);
    } 
    
    if (req.method === 'POST') {
      const { name, category, sku, stock, price, supplier_id } = req.body;
      const { rows } = await sql`
        INSERT INTO items (name, category, sku, stock, price, supplier_id)
        VALUES (${name}, ${category}, ${sku}, ${stock}, ${price}, ${supplier_id || null})
        RETURNING *;
      `;
      return res.status(201).json(rows[0]);
    } 
    
    if (req.method === 'PUT') {
      const { id } = req.query;
      const { name, category, sku, stock, price, supplier_id } = req.body;
      
      console.log('API PUT Hit - ID:', id, 'Body:', req.body);

      if (!id) {
        return res.status(400).json({ error: 'Parameter ID wajib disertakan untuk update' });
      }

      const { rows } = await sql`
        UPDATE items 
        SET name = ${name}, 
            category = ${category}, 
            sku = ${sku}, 
            stock = ${stock}, 
            price = ${price}, 
            supplier_id = ${supplier_id || null}
        WHERE id = ${id}
        RETURNING *;
      `;
      
      return res.status(200).json(rows[0]);
    } 
    
    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: 'Parameter ID wajib disertakan untuk delete' });
      }
      await sql`DELETE FROM items WHERE id = ${id}`;
      return res.status(200).json({ message: 'Item berhasil dihapus' });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error('Database Error:', error);
    return res.status(500).json({ error: error.message });
  }
}