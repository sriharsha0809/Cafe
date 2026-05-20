import express from 'express';
import cors from 'cors';
import { initDb, getDb } from './db.js';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Initialize DB
initDb();

// ==================== CATEGORIES ====================
app.get('/api/categories', (req, res) => {
  try {
    const db = getDb();
    const categories = db.prepare('SELECT * FROM categories ORDER BY sort_order').all();
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==================== ITEMS ====================
app.get('/api/items', (req, res) => {
  try {
    const db = getDb();
    const { category_id, search, featured } = req.query;

    let query = `
      SELECT i.*, c.name as category_name, c.icon as category_icon
      FROM items i
      LEFT JOIN categories c ON i.category_id = c.id
      WHERE i.is_available = 1
    `;
    const params = [];

    if (category_id) {
      query += ' AND i.category_id = ?';
      params.push(category_id);
    }
    if (search) {
      query += ' AND (i.name LIKE ? OR c.name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (featured === 'true') {
      query += ' AND i.is_featured = 1';
    }

    query += ' ORDER BY i.id';
    const items = db.prepare(query).all(...params);
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/items/:id', (req, res) => {
  try {
    const db = getDb();
    const item = db.prepare(`
      SELECT i.*, c.name as category_name
      FROM items i LEFT JOIN categories c ON i.category_id = c.id
      WHERE i.id = ?
    `).get(req.params.id);
    if (!item) return res.status(404).json({ success: false, error: 'Item not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==================== CART ====================
app.post('/api/cart', (req, res) => {
  try {
    const db = getDb();
    const { user_id } = req.body;
    const id = uuidv4();
    db.prepare('INSERT INTO cart (id, user_id) VALUES (?, ?)').run(id, user_id || 'guest');
    res.json({ success: true, data: { cart_id: id } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/cart/:cart_id', (req, res) => {
  try {
    const db = getDb();
    const cartItems = db.prepare(`
      SELECT ci.*, i.name, i.image_url, i.category_id, c.name as category_name
      FROM cart_items ci
      JOIN items i ON ci.item_id = i.id
      LEFT JOIN categories c ON i.category_id = c.id
      WHERE ci.cart_id = ?
    `).all(req.params.cart_id);
    res.json({ success: true, data: cartItems });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/cart/:cart_id/items', (req, res) => {
  try {
    const db = getDb();
    const { item_id, quantity, price_chosen } = req.body;
    const { cart_id } = req.params;

    const existing = db.prepare('SELECT * FROM cart_items WHERE cart_id = ? AND item_id = ? AND price_chosen = ?').get(cart_id, item_id, price_chosen);
    if (existing) {
      db.prepare('UPDATE cart_items SET quantity = quantity + ? WHERE id = ?').run(quantity || 1, existing.id);
    } else {
      db.prepare('INSERT INTO cart_items (cart_id, item_id, quantity, price_chosen) VALUES (?, ?, ?, ?)').run(cart_id, item_id, quantity || 1, price_chosen);
    }
    res.json({ success: true, message: 'Item added to cart' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/cart/items/:item_id', (req, res) => {
  try {
    const db = getDb();
    const { quantity } = req.body;
    if (quantity <= 0) {
      db.prepare('DELETE FROM cart_items WHERE id = ?').run(req.params.item_id);
    } else {
      db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').run(quantity, req.params.item_id);
    }
    res.json({ success: true, message: 'Cart updated' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/cart/items/:item_id', (req, res) => {
  try {
    const db = getDb();
    db.prepare('DELETE FROM cart_items WHERE id = ?').run(req.params.item_id);
    res.json({ success: true, message: 'Item removed' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/cart/:cart_id', (req, res) => {
  try {
    const db = getDb();
    db.prepare('DELETE FROM cart_items WHERE cart_id = ?').run(req.params.cart_id);
    res.json({ success: true, message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==================== ORDERS ====================
app.post('/api/orders', (req, res) => {
  try {
    const db = getDb();
    const { cart_id, user_id, order_type, payment_method, customer_name, customer_phone, address, items } = req.body;

    const id = uuidv4();
    const total = items.reduce((sum, it) => sum + (it.price * it.quantity), 0);

    db.prepare(`
      INSERT INTO orders (id, user_id, total_amount, order_type, payment_method, status, customer_name, customer_phone, address)
      VALUES (?, ?, ?, ?, ?, 'confirmed', ?, ?, ?)
    `).run(id, user_id || 'guest', total, order_type, payment_method, customer_name || 'Guest', customer_phone || '', address || '');

    const insertOrderItem = db.prepare('INSERT INTO order_items (order_id, item_id, quantity, price, item_name) VALUES (?, ?, ?, ?, ?)');
    for (const item of items) {
      insertOrderItem.run(id, item.item_id, item.quantity, item.price, item.name);
    }

    // Clear the cart
    if (cart_id) {
      db.prepare('DELETE FROM cart_items WHERE cart_id = ?').run(cart_id);
    }

    res.json({
      success: true,
      data: { order_id: id, total_amount: total, status: 'confirmed' }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/orders/:order_id', (req, res) => {
  try {
    const db = getDb();
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.order_id);
    if (!order) return res.status(404).json({ success: false, error: 'Order not found' });

    const orderItems = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(req.params.order_id);
    res.json({ success: true, data: { ...order, items: orderItems } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 ChaiOPod API running at http://localhost:${PORT}`);
});
