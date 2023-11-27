import express from "express";
import {
  GetTaskOrdersAsync,
  UpsertTaskOrderAsync,
} from "../Services/OrderService.js";
import { AuthenticateToken } from "../Services/AuthService.js";

const OrderRouter = express.Router();

OrderRouter.get("", async (req, res) => {
  try {
    const user = await AuthenticateToken(req, res);
    const results = await GetTaskOrdersAsync(user);
    res.json(results);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

OrderRouter.put("", async (req, res) => {
  try {
    const user = await AuthenticateToken(req, res);
    await UpsertTaskOrderAsync(req.body, user);
    return res.status(200).json({});
  } catch (e) {
    res.status(500).send(e.message);
  }
});

export default OrderRouter;
