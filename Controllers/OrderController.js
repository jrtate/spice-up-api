import express from "express";
import {
  GetTaskOrdersAsync,
  UpsertTaskOrderAsync,
} from "../Services/OrderService.js";

const OrderRouter = express.Router();

OrderRouter.get("", async (req, res) => {
  try {
    const results = await GetTaskOrdersAsync();
    res.json(results);
  } catch (e) {
    console.log(e.message);
  }
});

OrderRouter.put("", async (req, res) => {
  try {
    await UpsertTaskOrderAsync(req.body);
    return res.status(200).json({});
  } catch (e) {
    console.log(e.message);
  }
});

export default OrderRouter;
