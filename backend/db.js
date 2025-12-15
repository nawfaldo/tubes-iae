import { Database } from "bun:sqlite";

console.log("📦 Initializing database...");
export const db = new Database("app.db");
console.log("✅ Database connected: app.db");

db.run("PRAGMA foreign_keys = ON");
console.log("✅ Foreign keys enabled");

db.run(`
  CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE,
    password TEXT
  );
`);
console.log("✅ Table 'users' ready");

db.run(`
  CREATE TABLE IF NOT EXISTS restaurants(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE
  );
`);
console.log("✅ Table 'restaurants' ready");

db.run(`
  CREATE TABLE IF NOT EXISTS menus(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    restaurant_id INTEGER,
    price INTEGER DEFAULT 0,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
  );
`);
console.log("✅ Table 'menus' ready");

// Add price column to existing menus table if it doesn't exist
try {
  db.run(`ALTER TABLE menus ADD COLUMN price INTEGER DEFAULT 0`);
} catch (e) {
  // Column might already exist, ignore error
}

db.run(`
  CREATE TABLE IF NOT EXISTS carts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);
console.log("✅ Table 'carts' ready");

db.run(`
  CREATE TABLE IF NOT EXISTS cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cart_id INTEGER,
    menu_id INTEGER,
    qty INTEGER DEFAULT 1,
    FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE
  );
`);
console.log("✅ Table 'cart_items' ready");

db.run(`
  CREATE TABLE IF NOT EXISTS invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);
console.log("✅ Table 'invoices' ready");

db.run(`
  CREATE TABLE IF NOT EXISTS invoice_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_id INTEGER,
    menu_id INTEGER,
    qty INTEGER,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE
  );
`);
console.log("✅ Table 'invoice_items' ready");
console.log("✅ Database schema initialized successfully");