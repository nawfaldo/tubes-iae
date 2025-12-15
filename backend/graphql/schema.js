import { buildSchema } from "graphql";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { getAllRestaurants, getRestaurantById } from "../services/restaurantService.js";
import { getMenusByRestaurant } from "../services/menuServive.js";
import {
  getCartItems,
  addItem as addCartItem,
  removeItem as removeCartItem,
  deleteItem as deleteCartItem,
  checkout as checkoutCart,
} from "../services/cartService.js";
import { getInvoicesByUser } from "../services/invoiceService.js";
import { createUser, getUserByName } from "../services/userService.js";
import { getUserIdFromHeader } from "../utils/getUser.js";
import { db } from "../db.js";

const JWT_SECRET = "idk";

export const schema = buildSchema(`
  type Restaurant {
    id: ID!
    name: String!
    menus: [Menu!]!
  }

  type Menu {
    id: ID!
    name: String!
    price: Int
    restaurant_id: ID
  }

  type CartItem {
    menu_id: ID!
    qty: Int!
    menu_name: String
    price: Int
  }

  type InvoiceItem {
    menu_id: ID!
    menu_name: String
    qty: Int!
    price: Int
  }

  type Invoice {
    id: ID!
    created_at: String
    items: [InvoiceItem!]!
  }

  type AuthPayload {
    token: String!
    name: String!
  }

  type Query {
    restaurants: [Restaurant!]!
    restaurant(id: ID!): Restaurant
    cartItems: [CartItem!]!
    invoices: [Invoice!]!
  }

  type Mutation {
    register(name: String!, password: String!): AuthPayload!
    login(name: String!, password: String!): AuthPayload!
    addItem(menu_id: ID!): Boolean!
    removeItem(menu_id: ID!): Boolean!
    deleteItem(menu_id: ID!): Boolean!
    checkout: Invoice
  }
`);

function requireUserId(context) {
  const userId = getUserIdFromHeader(context.req);
  if (!userId) {
    throw new Error("unauthorized");
  }
  return userId;
}

function attachMenus(restaurant) {
  if (!restaurant) return null;
  return { ...restaurant, menus: getMenusByRestaurant(restaurant.id) };
}

export const rootResolvers = {
  restaurants() {
    return getAllRestaurants().map(attachMenus);
  },
  restaurant({ id }) {
    const restaurant = getRestaurantById(id);
    return attachMenus(restaurant);
  },
  cartItems(args, context) {
    const userId = requireUserId(context);
    return getCartItems(userId);
  },
  invoices(args, context) {
    const userId = requireUserId(context);
    return getInvoicesByUser(userId);
  },
  async register({ name, password }) {
    const user = createUser(name, password);
    const token = jwt.sign({ uid: user.id }, JWT_SECRET);
    return { token, name: user.name };
  },
  async login({ name, password }) {
    const user = getUserByName(name);
    if (!user) {
      throw new Error("invalid credentials");
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new Error("invalid credentials");
    }
    const token = jwt.sign({ uid: user.id }, JWT_SECRET);
    return { token, name: user.name };
  },
  addItem({ menu_id }, context) {
    const userId = requireUserId(context);
    addCartItem(userId, Number(menu_id));
    return true;
  },
  removeItem({ menu_id }, context) {
    const userId = requireUserId(context);
    removeCartItem(userId, Number(menu_id));
    return true;
  },
  deleteItem({ menu_id }, context) {
    const userId = requireUserId(context);
    deleteCartItem(userId, Number(menu_id));
    return true;
  },
  checkout(args, context) {
    const userId = requireUserId(context);
    const invoiceId = checkoutCart(userId);
    if (!invoiceId) return null;

    const invoice = db
      .query("SELECT id, created_at FROM invoices WHERE id = ?")
      .get(invoiceId);
    const items = db
      .query(
        `
        SELECT invoice_items.menu_id, menus.name as menu_name, invoice_items.qty, menus.price
        FROM invoice_items
        JOIN menus ON menus.id = invoice_items.menu_id
        WHERE invoice_items.invoice_id = ?
      `
      )
      .all(invoiceId);

    return { ...invoice, items };
  },
};

console.log("✅ GraphQL schema loaded");
console.log("✅ GraphQL resolvers initialized");

