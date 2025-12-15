import express from "express"
import { addItem, removeItem, deleteItem, getCartItems, checkout } from "../services/cartService.js"
import { getUserIdFromHeader } from "../utils/getUser.js"

export const cartRouter = express.Router()

cartRouter.post("/add-item", (req,res)=>{
  const user_id = getUserIdFromHeader(req)
  const { menu_id } = req.body

  if (!user_id) return res.status(401).json({ error: "unauthorized" })
  if (!menu_id) return res.json({ error: "menu_id required" })

  addItem(user_id, menu_id)
  return res.json({ success: true })
})

cartRouter.post("/remove-item",(req,res)=>{
  const user_id = getUserIdFromHeader(req)
  const { menu_id } = req.body

  if (!user_id) return res.status(401).json({ error:"unauthorized" })
  if (!menu_id) return res.json({ error:"menu_id required" })

  removeItem(user_id, menu_id)
  return res.json({ success:true })
})

cartRouter.post("/delete-item",(req,res)=>{
  const user_id = getUserIdFromHeader(req)
  const { menu_id } = req.body

  if(!user_id) return res.status(401).json({ error:"unauthorized" })
  if(!menu_id) return res.json({ error:"menu_id required" })

  deleteItem(user_id, menu_id)
  return res.json({ success:true })
})

cartRouter.get("/items",(req,res)=>{
  const user_id = getUserIdFromHeader(req)
  if(!user_id) return res.status(401).json({ error:"unauthorized" })

  return res.json(getCartItems(user_id))
})

cartRouter.post("/checkout",(req,res)=>{
  const user_id = getUserIdFromHeader(req)
  if(!user_id) return res.status(401).json({ error:"unauthorized" })

  const invoice_id = checkout(user_id)
  if (!invoice_id) return res.json({ error:"cart empty" })

  return res.json({ success:true, invoice_id })
})
