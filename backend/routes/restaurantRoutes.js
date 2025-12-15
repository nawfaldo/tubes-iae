import express from "express";
import { getAllRestaurants, getRestaurantById } from "../services/restaurantService.js";
import { getMenusByRestaurant } from "../services/menuServive.js";

export const restaurantRouter = express.Router();

restaurantRouter.get("/", (req, res) => {
  const data = getAllRestaurants();
  res.json(data);
});

restaurantRouter.get("/:id", (req, res) => {
  const { id } = req.params;
  const data = getRestaurantById(id);
  if (!data) return res.status(404).json({ msg: "not found" });
  res.json(data);
});

restaurantRouter.get("/:id/menus", (req, res) => {
  const { id } = req.params;
  const data = getMenusByRestaurant(id);
  res.json(data);
});
