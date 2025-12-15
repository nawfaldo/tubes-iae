import { db } from "../db.js";
import bcrypt from "bcrypt";

export function getUsers() {
  return db.query(`
    SELECT id, name FROM users
  `).all();
}

export function createUser(name, password) {
  const hash = bcrypt.hashSync(password, 10);
  db.run("INSERT INTO users (name, password) VALUES (?, ?)", [name, hash]);

  return db.query("SELECT id, name FROM users WHERE name = ?").get(name);
}

export function getUserByName(name) {
  return db.query("SELECT * FROM users WHERE name = ?").get(name);
}
