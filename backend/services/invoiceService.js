import { db } from "../db.js"

export function getInvoicesByUser(user_id) {
  const invoices = db.query(`
    SELECT id, created_at
    FROM invoices
    WHERE user_id = ?
    ORDER BY created_at DESC
  `).all(user_id);

  const getItems = db.query(`
      SELECT invoice_items.menu_id, menus.name as menu_name, invoice_items.qty, menus.price
      FROM invoice_items
      JOIN menus ON menus.id = invoice_items.menu_id
      WHERE invoice_items.invoice_id = ?
  `);

  for (let inv of invoices) {
    const items = getItems.all(inv.id);
    inv.items = items;
  }

  return invoices;
}
