import { db } from "../db.js"

export function getOrCreateCart(user_id) {
  let cart = db.query("SELECT id FROM carts WHERE user_id=?").get(user_id)
  if (!cart) {
    db.query("INSERT INTO carts (user_id) VALUES (?)").run(user_id)
    cart = db.query("SELECT id FROM carts WHERE user_id=?").get(user_id)
  }
  return cart
}

export function addItem(user_id, menu_id) {
  const cart = getOrCreateCart(user_id)

  const item = db.query("SELECT id, qty FROM cart_items WHERE cart_id=? AND menu_id=?").get(cart.id, menu_id)

  if (item) {
    db.query("UPDATE cart_items SET qty = qty + 1 WHERE id=?").run(item.id)
  } else {
    db.query("INSERT INTO cart_items (cart_id, menu_id, qty) VALUES (?, ?, 1)").run(cart.id, menu_id)
  }
}

export function removeItem(user_id, menu_id) {
  const cart = db.query("SELECT id FROM carts WHERE user_id=?").get(user_id)
  if (!cart) return

  const item = db.query("SELECT id, qty FROM cart_items WHERE cart_id=? AND menu_id=?").get(cart.id, menu_id)
  if (!item) return

  if (item.qty <= 1) {
    db.query("DELETE FROM cart_items WHERE id=?").run(item.id)
  } else {
    db.query("UPDATE cart_items SET qty = qty - 1 WHERE id=?").run(item.id)
  }
}

export function deleteItem(user_id, menu_id) {
  const cart = db.query("SELECT id FROM carts WHERE user_id=?").get(user_id)
  if (!cart) return

  db.query("DELETE FROM cart_items WHERE cart_id=? AND menu_id=?").run(cart.id, menu_id)
}

export function getCartItems(user_id) {
  const cart = db.query("SELECT id FROM carts WHERE user_id=?").get(user_id)
  if (!cart) return []

  return db.query(`
    SELECT cart_items.menu_id, cart_items.qty, menus.name as menu_name, menus.price
    FROM cart_items
    JOIN menus ON menus.id = cart_items.menu_id
    WHERE cart_items.cart_id=?
  `).all(cart.id)
}

export function checkout(user_id) {
  const cart = db.query("SELECT id FROM carts WHERE user_id=?").get(user_id)
  if (!cart) return null

  const items = db.query("SELECT menu_id, qty FROM cart_items WHERE cart_id=?").all(cart.id)
  if (items.length === 0) return null

  const invoice = db.query("INSERT INTO invoices (user_id) VALUES (?)").run(user_id)
  const invoice_id = invoice.lastInsertRowid

  const insertItem = db.query(`INSERT INTO invoice_items (invoice_id, menu_id, qty) VALUES (?, ?, ?)`)

  for (const i of items) {
    insertItem.run(invoice_id, i.menu_id, i.qty)
  }

  db.query("DELETE FROM cart_items WHERE cart_id=?").run(cart.id)

  return invoice_id
}
