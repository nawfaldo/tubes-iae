import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { createUser, getUserByName } from "../services/userService.js";

const JWT_SECRET = "idk"

export const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
  const { name, password } = req.body;

  const user = await createUser(name, password);

  const token = jwt.sign({ uid: user.id }, JWT_SECRET);

  res.json({
    token,
    name: user.name
  });
});

authRouter.post("/login", async (req, res) => {
  const { name, password } = req.body;
  const user = getUserByName(name);
  if (!user) return res.status(401).json({ msg: "invalid" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ msg: "invalid" });

  const token = jwt.sign({ uid: user.id }, JWT_SECRET);
  res.json({ token, name: user.name });
});
