import { db } from "../db.js";

export function getAllRestaurants() {
  return db.query("SELECT * FROM restaurants").all();
}

export function getRestaurantById(id) {
  return db.query("SELECT * FROM restaurants WHERE id = ?").get(id);
}