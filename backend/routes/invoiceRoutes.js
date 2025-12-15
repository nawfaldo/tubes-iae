import { Router } from "express";
import { getInvoicesByUser } from "../services/invoiceService.js";
import { getUserIdFromHeader } from "../utils/getUser.js";

export const invoiceRoutes = Router();

invoiceRoutes.get("/", (req,res) => {
  const user_id = getUserIdFromHeader(req);
  if (!user_id) return res.status(401).json({error:"unauthorized"});

  const invoices = getInvoicesByUser(user_id);
  res.json(invoices);
});
