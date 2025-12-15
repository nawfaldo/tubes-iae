import { db } from "../db.js";

export function getMenusByRestaurant(restaurantId) {
  return db.query("SELECT * FROM menus WHERE restaurant_id = ?").all(restaurantId);
}